# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev       # Hugo dev server with drafts enabled
npm run build     # Production build (hugo --minify)
```

Hugo requires the extended version (>=0.128.0). TailwindCSS is processed via PostCSS during the Hugo build pipeline.

The Go API has no separate dev command — it runs inside Docker. To test locally:
```bash
cd api && go build -o api-server main.go && ./api-server
```

## Tech Stack

- **Hugo** (extended) — static site generator
- **TailwindCSS 3** — utility CSS via PostCSS, class-based dark mode
- **Go** — contact form API backend (standard library only, no framework)
- **Caddy** — serves static files + reverse proxies `/api/*` to Go backend
- **Swiper.js** — discography carousel (loaded via CDN)
- **Cloudflare Turnstile** — spam protection on contact form
- **Postmark** — transactional email delivery

## Architecture

### Single-page Hugo site

The site is a single-page layout. `layouts/index.html` defines the homepage by composing partials in order:

```
hero → discography → services → pricing → biography → artists → contact
```

Each section is a partial in `layouts/partials/`. The base template is `layouts/_default/baseof.html`.

### Data-driven content

YAML files in `data/` drive dynamic content:
- `nav.yaml` — navigation links (anchor links to page sections)
- `albums.yaml` — discography entries (artist, album, image, Spotify link, service tags)
- `social.yaml` — social media links (Spotify, Facebook, X, YouTube)

Site-wide params are in `hugo.toml` under `[params]`.

### Contact form flow

The contact form uses a two-tier architecture:

1. **Frontend** (`layouts/partials/contact.html` + `static/js/main.js`): Client-side validation, Turnstile widget, POSTs JSON to `/api/contact`
2. **Backend** (`api/main.go`): Validates input, verifies Turnstile token with Cloudflare, sends email via Postmark API

API endpoints: `POST /api/contact`, `GET /api/health`

### Styling system

HSL CSS custom properties defined in `assets/css/main.css` (shadcn/ui-style tokens). Dark mode defaults on (`<html class="dark">`), toggled via `localStorage.setItem('theme', ...)`. Tailwind config in `tailwind.config.js` maps these tokens to utility classes (`bg-background`, `text-foreground`, `bg-primary`, etc.).

### Client-side JavaScript

All JS is in `static/js/main.js` (vanilla, no bundler):
- Dark mode toggle
- Mobile menu open/close
- Contact form validation + async submission
- Swiper carousel initialization

## Docker & Deployment

Multi-stage Dockerfile:
1. **hugo-builder** — installs Node.js, runs `npm install` + `hugo --minify`
2. **go-builder** — compiles Go API to static binary
3. **Final image** — Caddy Alpine with supervisord running both Caddy and the Go API

`supervisord.conf` manages both processes. `docker-entrypoint.sh` exports env vars then hands off to supervisord.

**Pipeline**: Push to `master`/`main` → GitHub Actions builds Docker image → pushes to DockerHub → SSH deploys to VPS at `/opt/406-records`

### Environment Variables (runtime, set in VPS `.env`)

```
POSTMARK_TOKEN    # Postmark API key
FROM_EMAIL        # Authorized sender email
TO_EMAIL          # Contact form recipient
ALLOWED_ORIGIN    # CORS origin (default: https://www.406records.com)
TURNSTILE_SECRET  # Cloudflare Turnstile secret key
```

### GitHub Secrets Required

`DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`
