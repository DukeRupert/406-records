# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview production build
npm run check            # Run svelte-check type checking
npm run check:watch      # Watch mode type checking
npm run lint             # ESLint + Prettier check
npm run format           # Auto-format with Prettier
npm run test             # Run all tests (integration + unit)
npm run test:integration # Playwright E2E tests
npm run test:unit        # Vitest unit tests
```

## Tech Stack

- **SvelteKit 2.7** with **Svelte 5** (uses runes: `$state`, `$props`, snippets)
- **TailwindCSS** with dark mode (class-based via mode-watcher)
- **Bits UI** for accessible ShadcN-style components
- **Directus SDK** for headless CMS integration
- **Postmark** for transactional email

## Architecture

### Directus CMS Integration

The app fetches content from Directus CMS with a polymorphic block system:

- **Client setup**: `src/lib/directus/index.ts` - REST client and `build_asset_url()` helper
- **Block renderer**: `src/lib/directus/components/Blocks.svelte` - Dynamically renders blocks by type
- **Block types**: `block_hero`, `block_content`, `block_discography` → corresponding Svelte components

Data flows: Directus → `+page.ts`/`+layout.ts` load functions → Page components

### Form Handling Pattern

Contact form in `+page.svelte` uses SvelteKit form actions:
- Server validation in `+page.server.ts` with `validateForm()` and `validatePhone()`
- Honeypot fields (`bot_trap`, `address`) for spam prevention
- Progressive enhancement with `use:enhance`
- Email delivery via Postmark client (`src/lib/postmark.ts`)

### Component Patterns (Svelte 5)

```svelte
<!-- Rune-based reactivity -->
let nav_open = $state(false);
let { links, logo } = $props();

<!-- Snippet pattern for reusable markup -->
{#snippet Navbar(link)}
  <a href={link.href}>{link.label}</a>
{/snippet}
{@render Navbar(link)}
```

### Styling System

CSS variables define HSL color tokens (`--primary`, `--foreground`, etc.) in `app.css`. Dark mode toggled via `.dark` class with `mode-watcher`. Typography uses `@tailwindcss/typography` plugin.

## Key Directories

- `src/lib/components/` - App components (Header, Footer, Lightswitch)
- `src/lib/directus/components/` - CMS block components
- `src/lib/ui/` - ShadcN-style UI primitives

## Environment Variables

```
PUBLIC_DIRECTUS_ENDPOINT  # Directus CMS URL
POSTMARK_API_TOKEN        # Email service token
FROM_EMAIL                # Sender email
CONTACT_FORM_EMAIL        # Form submission recipient
```

## Deployment

Deployed via GitHub Actions to a VPS with Docker.

**Pipeline**: Push to `master`/`main` → Build Docker image → Push to DockerHub → SSH deploy to VPS

### GitHub Secrets Required

| Secret | Description |
|--------|-------------|
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token |
| `VPS_HOST` | VPS IP address or hostname |
| `VPS_USER` | SSH username on VPS |
| `VPS_SSH_KEY` | Private SSH key for VPS access |

### VPS Setup

1. Create deploy directory: `sudo mkdir -p /opt/406-records`
2. Copy `docker-compose.yml` and `.env` (from `.env.example`) to `/opt/406-records/`
3. Configure outer Caddy to reverse proxy to `localhost:3000`
