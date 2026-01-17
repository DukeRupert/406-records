package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/mail"
	"os"
	"regexp"
	"strings"
)

type ContactRequest struct {
	Name           string `json:"name"`
	Email          string `json:"email"`
	Phone          string `json:"phone"`
	Message        string `json:"message"`
	TurnstileToken string `json:"turnstile_token"`
}

type ContactResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message,omitempty"`
	Error   string `json:"error,omitempty"`
}

type TurnstileResponse struct {
	Success     bool     `json:"success"`
	ErrorCodes  []string `json:"error-codes,omitempty"`
	ChallengeTs string   `json:"challenge_ts,omitempty"`
	Hostname    string   `json:"hostname,omitempty"`
}

type PostmarkEmail struct {
	From     string `json:"From"`
	To       string `json:"To"`
	Subject  string `json:"Subject"`
	TextBody string `json:"TextBody"`
	HtmlBody string `json:"HtmlBody"`
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	http.HandleFunc("/api/contact", handleContact)
	http.HandleFunc("/api/health", handleHealth)

	log.Printf("API server starting on port %s", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err)
	}
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

func handleContact(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	allowedOrigin := os.Getenv("ALLOWED_ORIGIN")
	if allowedOrigin == "" {
		allowedOrigin = "https://www.406records.com"
	}

	w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	// Handle preflight
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != "POST" {
		sendError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req ContactRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate inputs
	if err := validateContactRequest(&req); err != nil {
		sendError(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Verify Turnstile token
	turnstileSecret := os.Getenv("TURNSTILE_SECRET")
	if turnstileSecret != "" && req.TurnstileToken != "" {
		if !verifyTurnstile(turnstileSecret, req.TurnstileToken, r.RemoteAddr) {
			sendError(w, "Security verification failed. Please try again.", http.StatusBadRequest)
			return
		}
	}

	// Send email via Postmark
	if err := sendEmail(&req); err != nil {
		log.Printf("Failed to send email: %v", err)
		sendError(w, "Failed to send message. Please try again later.", http.StatusInternalServerError)
		return
	}

	sendSuccess(w, "Thank you for your message! We'll be in touch soon.")
}

func validateContactRequest(req *ContactRequest) error {
	req.Name = strings.TrimSpace(req.Name)
	req.Email = strings.TrimSpace(req.Email)
	req.Phone = strings.TrimSpace(req.Phone)
	req.Message = strings.TrimSpace(req.Message)

	if len(req.Name) < 2 {
		return fmt.Errorf("name is required")
	}
	if len(req.Name) > 80 {
		return fmt.Errorf("name is too long")
	}

	if _, err := mail.ParseAddress(req.Email); err != nil {
		return fmt.Errorf("invalid email address")
	}

	if !validatePhone(req.Phone) {
		return fmt.Errorf("invalid phone number")
	}

	if len(req.Message) < 10 {
		return fmt.Errorf("message is too short")
	}
	if len(req.Message) > 5000 {
		return fmt.Errorf("message is too long")
	}

	return nil
}

func validatePhone(phone string) bool {
	// Remove common formatting characters
	cleaned := regexp.MustCompile(`[\s\-\(\)\.]+`).ReplaceAllString(phone, "")
	// Check if it's a valid phone number (10-15 digits, optional + prefix)
	matched, _ := regexp.MatchString(`^\+?[0-9]{10,15}$`, cleaned)
	return matched
}

func verifyTurnstile(secret, token, remoteIP string) bool {
	data := map[string]string{
		"secret":   secret,
		"response": token,
		"remoteip": remoteIP,
	}

	jsonData, _ := json.Marshal(data)
	resp, err := http.Post(
		"https://challenges.cloudflare.com/turnstile/v0/siteverify",
		"application/json",
		bytes.NewBuffer(jsonData),
	)
	if err != nil {
		log.Printf("Turnstile verification request failed: %v", err)
		return false
	}
	defer resp.Body.Close()

	var result TurnstileResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		log.Printf("Failed to decode Turnstile response: %v", err)
		return false
	}

	return result.Success
}

func sendEmail(req *ContactRequest) error {
	postmarkToken := os.Getenv("POSTMARK_TOKEN")
	fromEmail := os.Getenv("FROM_EMAIL")
	toEmail := os.Getenv("TO_EMAIL")

	if postmarkToken == "" || fromEmail == "" || toEmail == "" {
		return fmt.Errorf("email configuration missing")
	}

	htmlBody := fmt.Sprintf(`
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> %s</p>
<p><strong>Email:</strong> %s</p>
<p><strong>Phone:</strong> %s</p>
<h3>Message:</h3>
<p>%s</p>
`, escapeHTML(req.Name), escapeHTML(req.Email), escapeHTML(req.Phone), escapeHTML(req.Message))

	textBody := fmt.Sprintf(`New Contact Form Submission

Name: %s
Email: %s
Phone: %s

Message:
%s
`, req.Name, req.Email, req.Phone, req.Message)

	email := PostmarkEmail{
		From:     fromEmail,
		To:       toEmail,
		Subject:  fmt.Sprintf("406 Records Contact: %s", req.Name),
		HtmlBody: htmlBody,
		TextBody: textBody,
	}

	jsonData, err := json.Marshal(email)
	if err != nil {
		return err
	}

	httpReq, err := http.NewRequest("POST", "https://api.postmarkapp.com/email", bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}

	httpReq.Header.Set("Accept", "application/json")
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("X-Postmark-Server-Token", postmarkToken)

	client := &http.Client{}
	resp, err := client.Do(httpReq)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("postmark API error: %s", string(body))
	}

	return nil
}

func escapeHTML(s string) string {
	s = strings.ReplaceAll(s, "&", "&amp;")
	s = strings.ReplaceAll(s, "<", "&lt;")
	s = strings.ReplaceAll(s, ">", "&gt;")
	s = strings.ReplaceAll(s, "\"", "&quot;")
	s = strings.ReplaceAll(s, "'", "&#39;")
	return s
}

func sendSuccess(w http.ResponseWriter, message string) {
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(ContactResponse{
		Success: true,
		Message: message,
	})
}

func sendError(w http.ResponseWriter, message string, statusCode int) {
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(ContactResponse{
		Success: false,
		Error:   message,
	})
}
