// Dark mode toggle
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.classList.contains('dark');

  if (isDark) {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
}

// Initialize theme toggles
document.getElementById('theme-toggle-mobile')?.addEventListener('click', toggleTheme);
document.getElementById('theme-toggle-desktop')?.addEventListener('click', toggleTheme);

// Mobile menu
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuPanel = document.getElementById('mobile-menu-panel');
const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

function openMobileMenu() {
  mobileMenu.classList.remove('hidden');
  // Trigger reflow for transition
  mobileMenuPanel.offsetHeight;
  mobileMenuPanel.classList.add('open');
  mobileMenuPanel.classList.remove('translate-x-full');
}

function closeMobileMenu() {
  mobileMenuPanel.classList.remove('open');
  mobileMenuPanel.classList.add('translate-x-full');
  setTimeout(() => {
    mobileMenu.classList.add('hidden');
  }, 250);
}

mobileMenuButton?.addEventListener('click', openMobileMenu);
mobileMenuClose?.addEventListener('click', closeMobileMenu);
mobileMenuBackdrop?.addEventListener('click', closeMobileMenu);
mobileMenuLinks.forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// Contact form handling
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formSuccess = document.getElementById('form-success');
const formError = document.getElementById('form-error');

function showError(fieldId, message) {
  const errorEl = document.getElementById(fieldId + '-error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
  }
}

function hideError(fieldId) {
  const errorEl = document.getElementById(fieldId + '-error');
  if (errorEl) {
    errorEl.classList.add('hidden');
  }
}

function clearErrors() {
  ['name', 'email', 'phone', 'message'].forEach(field => hideError(field));
  formSuccess.classList.add('hidden');
  formError.classList.add('hidden');
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  // Allow various phone formats
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
  return /^\+?[0-9]{10,15}$/.test(cleaned);
}

contactForm?.addEventListener('submit', async function(e) {
  e.preventDefault();
  clearErrors();

  const formData = new FormData(this);
  const name = formData.get('name')?.toString().trim() || '';
  const email = formData.get('email')?.toString().trim() || '';
  const phone = formData.get('phone')?.toString().trim() || '';
  const message = formData.get('message')?.toString().trim() || '';

  // Get Turnstile token
  const turnstileResponse = formData.get('cf-turnstile-response');

  // Validate
  let hasErrors = false;

  if (!name || name.length < 2) {
    showError('name', 'Please enter your name');
    hasErrors = true;
  }

  if (!email || !validateEmail(email)) {
    showError('email', 'Please enter a valid email address');
    hasErrors = true;
  }

  if (!phone || !validatePhone(phone)) {
    showError('phone', 'Please enter a valid phone number');
    hasErrors = true;
  }

  if (!message || message.length < 10) {
    showError('message', 'Please enter a message (at least 10 characters)');
    hasErrors = true;
  }

  if (hasErrors) return;

  // Disable submit button
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        message,
        turnstile_token: turnstileResponse
      })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      formSuccess.textContent = result.message || 'Thank you for your message! We\'ll be in touch soon.';
      formSuccess.classList.remove('hidden');
      contactForm.reset();
      // Reset Turnstile
      if (window.turnstile) {
        window.turnstile.reset();
      }
    } else {
      formError.textContent = result.error || 'Something went wrong. Please try again.';
      formError.classList.remove('hidden');
    }
  } catch (error) {
    formError.textContent = 'Network error. Please check your connection and try again.';
    formError.classList.remove('hidden');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
  }
});

// Discography carousel
document.addEventListener('DOMContentLoaded', function() {
  const discographySwiper = document.querySelector('.discography-swiper');
  if (discographySwiper && typeof Swiper !== 'undefined') {
    new Swiper('.discography-swiper', {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      rewind: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 2,
        slideShadows: false
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      keyboard: {
        enabled: true
      },
      a11y: {
        prevSlideMessage: 'Previous album',
        nextSlideMessage: 'Next album',
        paginationBulletMessage: 'Go to album {{index}}'
      }
    });
  }
});
