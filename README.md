# Stix Magic

Stix Magic is a sticker alchemy platform where sticker assets become programmable interaction objects in chat.

## Monorepo Structure

```txt
stixmagic
├── apps
│   ├── web
│   └── bot
├── services
│   ├── api
│   ├── sticker-engine
│   └── trigger-engine
├── packages
│   ├── ui
│   ├── config
│   └── types
├── docs
│   ├── architecture
│   ├── product
│   └── roadmap
└── infra
	├── docker
	└── deploy
```

## Core Services

- `@stixmagic/web`: Next.js product and landing interface.
- `@stixmagic/bot`: Telegram bot command and sticker-event runtime.
- `@stixmagic/api`: Packs, stickers, and triggers API.
- `@stixmagic/sticker-engine`: Sticker processing pipeline orchestration.
- `@stixmagic/trigger-engine`: Sticker action execution runtime.

## Quick Start

1. Install dependencies:

```bash
pnpm install
```

2. Prepare env:

```bash
cp .env.example .env
```

3. Run all services:

```bash
pnpm dev
```

## API Endpoints

- `POST /stickers`
- `GET /packs`
- `POST /packs`
- `GET /triggers`
- `POST /triggers`

## Product UI

- Landing page: architecture, vision, feature grid, status tabs.
- Masks page: dynamic mask catalog with live selection preview and pipeline explanation.

## Deployment

- Local container stack: `infra/docker/docker-compose.yml`
- Deployment topology: `infra/deploy/production-architecture.md`

### GitHub Pages (web app)

This repo includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml` that deploys `apps/web` as a static site.

1. Create a GitHub repo and set remote:

```bash
git remote add origin https://github.com/<you>/<repo>.git
```

2. First push:

```bash
git add .
git commit -m "chore: initial monorepo setup"
git push -u origin main
```

3. In GitHub repo settings, set **Pages** source to **GitHub Actions**.

4. Each push to `main` auto-deploys the web app to GitHub Pages.
