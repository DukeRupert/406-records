# 406 Records

Website for 406 Records, a recording studio in Helena, Montana. Built with Hugo, TailwindCSS, and a Go contact form API.

**Live site:** [406records.com](https://www.406records.com)

## Tech Stack

- **Hugo** (extended) — static site generator
- **TailwindCSS 3** — utility CSS via PostCSS, dark mode first
- **Go** — contact form API (standard library, no framework)
- **Caddy** — static file server + reverse proxy for `/api/*`
- **Swiper.js** — discography carousel (CDN)
- **Cloudflare Turnstile** — contact form spam protection
- **Postmark** — transactional email delivery
- **Plausible Analytics** — privacy-focused analytics

## Development

```bash
npm install
npm run dev       # Hugo dev server with drafts
npm run build     # Production build (hugo --minify)
```

Hugo extended >= 0.128.0 is required.

To test the Go API locally:

```bash
cd api && go build -o api-server main.go && ./api-server
```

## Project Structure

```
content/_index.md          # All page content (YAML front matter)
layouts/index.html         # Homepage — composes section partials
layouts/partials/          # hero, discography, services, pricing, faq, biography, artists, contact
layouts/_default/single.html  # Layout for standalone pages (privacy policy, etc.)
data/                      # albums.yaml, nav.yaml, social.yaml
assets/css/main.css        # HSL design tokens (shadcn/ui style)
static/js/main.js          # Mobile menu, FAQ accordion, contact form
api/main.go                # Contact form API
```

## Deployment

Multi-stage Docker build:

1. **hugo-builder** — Node.js + Hugo production build
2. **go-builder** — compiles Go API to static binary
3. **Final image** — Caddy Alpine + supervisord running Caddy and the Go API

Pipeline: push to `master` → GitHub Actions → Docker image → DockerHub → SSH deploy to VPS

### Environment Variables (runtime)

| Variable | Description |
|---|---|
| `POSTMARK_TOKEN` | Postmark API key |
| `FROM_EMAIL` | Authorized sender email |
| `TO_EMAIL` | Contact form recipient |
| `ALLOWED_ORIGIN` | CORS origin (default: https://www.406records.com) |
| `TURNSTILE_SECRET` | Cloudflare Turnstile secret key |

### GitHub Secrets

`DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`
