# Deployment Guide

This repository is a **pnpm/turbo monorepo** with a Next.js 14 static-export web app (`apps/web`) and supporting bot/API services.

## 1) Build and output model

- Web framework: **Next.js App Router** (`apps/web`).
- Build mode: `output: 'export'` with `trailingSlash: true` and unoptimized images.
- Static output directory: `apps/web/out`.
- Root build command: `pnpm build` (runs turbo pipeline).
- Web-only build command: `pnpm --filter @stixmagic/web build`.

Because the web app is static-exported, deployment targets should be static hosting providers (Cloudflare Pages, Vercel static deploy, GitHub Pages, or external Pages repo).

## 2) Deployment provider selection (GitHub Actions)

The repository contains multiple deploy workflows. To avoid accidental multi-provider production deploys, workflows are now gated by repository variables:

- `DEPLOY_PROVIDER`: one of `vercel`, `cloudflare`, `github-pages`, `external-pages`
- `ENABLE_PROD_DEPLOY`: `true`/`false`
- `ENABLE_PREVIEW_DEPLOY`: `true`/`false`

### Recommended baseline

- Production: `DEPLOY_PROVIDER=cloudflare` (or your chosen provider)
- Preview: same provider or `external-pages`
- Set:
  - `ENABLE_PROD_DEPLOY=true`
  - `ENABLE_PREVIEW_DEPLOY=true`

If these variables are missing or mismatched, deploy jobs are skipped safely.

## 3) Branch and environment behavior

- `main` → production deploy workflows (when enabled).
- `preview`, `dev` → preview/development deploy workflows (when enabled).
- `pull_request` into `main` runs preview builds; secret-based deploy steps skip for forks.

## 4) Provider-specific workflow summary

### Vercel
- Workflows:
  - `.github/workflows/deploy-vercel-production.yml`
  - `.github/workflows/deploy-vercel-preview.yml`
- Required secret: `VERCEL_TOKEN`
- Uses `vercel pull`, `vercel build`, `vercel deploy --prebuilt`.

### Cloudflare Pages
- Workflows:
  - `.github/workflows/deploy-cf-production.yml`
  - `.github/workflows/deploy-cf-preview.yml`
- Required secrets:
  - `CLOUDFLARE_API_TOKEN`
  - `CLOUDFLARE_ACCOUNT_ID`
- Required/optional vars:
  - `CF_PAGES_PROJECT_NAME` (defaults to `stixmagic-web`)

### GitHub Pages (same repo)
- Workflow:
  - `.github/workflows/deploy-pages.yml`
- Uses GitHub Pages artifact + `actions/deploy-pages`.

### External preview Pages repo
- Workflow:
  - `.github/workflows/deploy-preview-pages.yml`
- Required secret: `PREVIEW_REPO_TOKEN`
- Optional vars:
  - `PREVIEW_PAGES_REPO`
  - `PAGES_PREVIEW_DOMAIN`

## 5) Pre-deploy checklist

1. Configure required secrets for your selected provider.
2. Configure environment variables in GitHub Actions repository variables.
3. Set deploy gate variables (`DEPLOY_PROVIDER`, `ENABLE_*_DEPLOY`).
4. Ensure `NEXT_PUBLIC_STIXMAGIC_*` values resolve to the target environment URLs.
5. Confirm the Telegram bot username and Mini App URL pair is consistent with BotFather Mini App settings.

## 6) Operational notes for bot ecosystem alignment

- Bot and web must reference the same API origin (`STIXMAGIC_API_BASE_URL` / `NEXT_PUBLIC_STIXMAGIC_API_BASE_URL`).
- Production webhook mode requires public HTTPS endpoint and webhook secret.
- Mini App init-data validation depends on valid bot token + freshness window.

## 7) Manual follow-up outside this repo

- Register final Mini App URL in Telegram BotFather.
- Configure HTTPS ingress for API webhook endpoint.
- Provision Postgres + S3-compatible storage for production services.
- Add environment protection rules in GitHub for `production` environment approvals if desired.
