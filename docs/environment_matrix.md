# Environment Variable Matrix

This matrix documents development vs production expectations for STIX MΛGIC web, bot, and API surfaces.

## Classification

- **Public (client-visible):** `NEXT_PUBLIC_*` values are embedded in web bundles.
- **Private (server-only):** secrets/tokens/DB credentials; never expose to browser.

## Core runtime variables

| Variable | Scope | Public? | Required (Dev) | Required (Prod) | Notes |
|---|---|---:|---:|---:|---|
| `NODE_ENV` | all | No | Yes | Yes | `development`/`test`/`production`. |
| `WEB_PORT` | web runtime | No | Yes | Optional | Local `next dev/start` port. |
| `API_PORT` | api | No | Yes | Optional | Local API listening port. |
| `BOT_PORT` | bot | No | Yes | Optional | Local bot process port if needed by host. |
| `STICKER_ENGINE_PORT` | sticker-engine | No | Yes | Optional | Local service port. |
| `TRIGGER_ENGINE_PORT` | trigger-engine | No | Yes | Optional | Local service port. |
| `TRIGGER_ENGINE_URL` | bot | No | Yes | Optional | Base URL the bot uses to call the trigger engine (defaults to `http://localhost:4300`). |

## Infrastructure variables (private)

| Variable | Service(s) | Required (Dev) | Required (Prod) | Notes |
|---|---|---:|---:|---|
| `POSTGRES_URL` | api, bot, engines | Yes | Yes | Persistent data backend. |
| `S3_ENDPOINT` | api, bot, engines | Yes | Yes | S3-compatible endpoint. |
| `S3_REGION` | api, bot, engines | Yes | Yes | Bucket region. |
| `S3_BUCKET` | api, bot, engines | Yes | Yes | Asset bucket name. |
| `S3_ACCESS_KEY` | api, bot, engines | Yes | Yes | Private credential. |
| `S3_SECRET_KEY` | api, bot, engines | Yes | Yes | Private credential. |

## Telegram + STIX platform variables

| Variable | Surface | Public? | Required (Dev) | Required (Prod) | Notes |
|---|---|---:|---:|---:|---|
| `STIXMAGIC_PUBLIC_WEB_URL` | api/bot | No | Yes | Yes | Canonical web base URL. |
| `STIXMAGIC_API_BASE_URL` | api/bot | No | Yes | Yes | Shared API base URL. |
| `TELEGRAM_BOT_TOKEN` | bot/api validation | No | Yes | Yes | Secret token from BotFather. |
| `TELEGRAM_BOT_USERNAME` | bot/web/api | No | Yes | Yes | Without `@` preferred. |
| `TELEGRAM_MINI_APP_URL` | bot/api | No | Yes | Yes | Full Mini App URL used in bot handoff. |
| `TELEGRAM_BOT_MODE` | bot/api | No | Yes | Yes | `polling` or `webhook`. |
| `TELEGRAM_WEBHOOK_URL` | bot/api | No | No | Yes (webhook mode) | Required when mode is `webhook`; not needed in dev if using polling mode. |
| `TELEGRAM_WEBHOOK_SECRET` | api webhook | No | Recommended | Yes | Strong random secret for webhook validation. |
| `TELEGRAM_INIT_DATA_MAX_AGE_SECONDS` | api | No | Recommended | Yes | Replay/freshness control for Mini App init-data. |

## Web client variables (public)

| Variable | Required (Dev) | Required (Prod) | Notes |
|---|---:|---:|---|
| `NEXT_PUBLIC_STIXMAGIC_API_BASE_URL` | Yes | Yes | Client API origin. |
| `NEXT_PUBLIC_STIXMAGIC_PUBLIC_WEB_URL` | Yes | Yes | Public web origin. |
| `NEXT_PUBLIC_STIXMAGIC_BOT_USERNAME` | Yes | Yes | Bot deep-link UX. |
| `NEXT_PUBLIC_STIXMAGIC_MINI_APP_URL` | Yes | Yes | Client-visible app URL. |
| `NEXT_PUBLIC_STIXMAGIC_MANIFEST_URL` | Optional | Optional | Pipeline manifest endpoint; leave **unset/omitted** to use sample data (do not set to an empty string). |
| `NEXT_PUBLIC_STIXMAGIC_USE_DEMO_DATA` | Optional | Optional | `true` for demo fallback UI mode. |

## CI/CD repository variables and secrets

### Variables

- `DEPLOY_PROVIDER` (`vercel`, `cloudflare`, `github-pages`, `external-pages`)
- `ENABLE_PROD_DEPLOY` (`true`/`false`)
- `ENABLE_PREVIEW_DEPLOY` (`true`/`false`)
- `STIXMAGIC_*` and `STIXMAGIC_*_DEV` URL overrides for deploy workflows
- `CF_PAGES_PROJECT_NAME`, `PAGES_CUSTOM_DOMAIN`, `PAGES_PREVIEW_DOMAIN`, `PREVIEW_PAGES_REPO`

### Secrets

- `VERCEL_TOKEN`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `PREVIEW_REPO_TOKEN`

## Recommended production baseline

- `TELEGRAM_BOT_MODE=webhook`
- `NEXT_PUBLIC_STIXMAGIC_USE_DEMO_DATA=false`
- Distinct production and preview URLs for API and Mini App
- Unique webhook secret and strict environment protections in GitHub Actions
