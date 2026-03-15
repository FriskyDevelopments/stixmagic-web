# Stix Magic

Stix  is a sticker alchemy platform where sticker assets become programmable interacMagiction objects in chat.

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
- `@stixmagic/trigger-engine`: Sticker action  runtime.

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
- Masks page: dynamic mask catalog with live selection preview and pipeline explanation.execution

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

5. (Optional) Use a short custom subdomain (for example `go.yourdomain.com`):
	- Add a repository variable named `PAGES_CUSTOM_DOMAIN` with your subdomain value.
	- In your DNS provider, create a `CNAME` record from the subdomain (for example `go`) to `<owner>.github.io`.
	- Push to `main` (or run the workflow manually). The workflow writes a `CNAME` file automatically.

### Preview Environment (`preview.stixmagic.com`)

This repo includes `.github/workflows/deploy-preview-pages.yml` to deploy preview builds into a separate GitHub Pages repository, so production and preview can stay live at the same time.

1. Create a preview Pages repository (example: `FriskyDevelopments/stixmagic-web-preview`).

2. In the preview repository settings, configure **Pages** source as:
	- **Deploy from branch**
	- Branch: `gh-pages` / root

3. In this main repository (`stixmagic-web`), add an Actions secret:
	- Name: `PREVIEW_REPO_TOKEN`
	- Value: GitHub token with write access to the preview repository

4. Add repository variables:
	- `PREVIEW_PAGES_REPO=FriskyDevelopments/stixmagic-web-preview`
	- `PAGES_PREVIEW_DOMAIN=preview.stixmagic.com`

5. Create a long-lived preview branch and push it:

```bash
git checkout -b preview
git push -u origin preview
```

6. In Cloudflare DNS, add a `CNAME` record:
   - Host: `preview`
	- Target: `FriskyDevelopments.github.io`

7. Push to `preview` branch (or run the preview workflow manually) to deploy live.

8. Manual deploy from any branch:
	- Open Actions → **Deploy Preview Web (External Pages Repo)**
	- Click **Run workflow**
	- Set `source_ref` to a branch/tag/SHA (for example `copilot/implement-stix-magic-webpage`)
	- Run to publish that revision to `preview.stixmagic.com`
