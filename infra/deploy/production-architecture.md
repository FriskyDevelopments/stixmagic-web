# STIX MΛGIC Production Architecture

## Runtime units

### Telegram-facing surfaces
- **Bot (`@stixmagic/bot`)** — Telegram command layer, webhook/polling runtime, Mini App handoff.
- **Mini App (`@stixmagic/web`)** — Telegram operator UI for groups, reaction rules, and future deployment actions.

### Shared services
- **API (`@stixmagic/api`)** — shared contract surface for bot + Mini App.
- **Sticker Engine (`@stixmagic/sticker-engine`)** — media processing.
- **Trigger Engine (`@stixmagic/trigger-engine`)** — reaction execution/runtime automation.
- **PostgreSQL** — durable product state.
- **S3-compatible object storage** — sticker/media artifacts.

## Production relationship

The bot and Mini App should be treated as **two Telegram surfaces over one platform**, not separate products.

- The **bot** is responsible for Telegram-native entry points and event ingestion.
- The **Mini App** is responsible for operator workflows and management UX.
- The **API** is the shared source of truth for configuration, bootstrap payloads, groups, and rules.

## Shared environment strategy

### Service/runtime variables
- `STIXMAGIC_API_BASE_URL`
- `STIXMAGIC_PUBLIC_WEB_URL`
- `TELEGRAM_BOT_USERNAME`
- `TELEGRAM_MINI_APP_URL`
- `TELEGRAM_BOT_MODE`
- `TELEGRAM_WEBHOOK_URL`

### Mini App build-time variables
- `NEXT_PUBLIC_STIXMAGIC_API_BASE_URL`
- `NEXT_PUBLIC_STIXMAGIC_PUBLIC_WEB_URL`
- `NEXT_PUBLIC_STIXMAGIC_BOT_USERNAME`
- `NEXT_PUBLIC_STIXMAGIC_MINI_APP_URL`
- `NEXT_PUBLIC_STIXMAGIC_MANIFEST_URL`
- `NEXT_PUBLIC_STIXMAGIC_USE_DEMO_DATA`

## Recommended platform layout

- Public HTTPS ingress for Mini App and API.
- Long-running bot worker or container runtime.
- Managed PostgreSQL for relational durability.
- Managed S3-compatible bucket for media assets.
- Secret manager for bot token, webhook secrets, and storage credentials.

## Network flow

1. Telegram user opens the bot.
2. Bot replies with Mini App handoff and Telegram-native commands.
3. Mini App fetches `/telegram/mini-app/bootstrap` from the API.
4. Mini App reads/writes groups and rule configuration through `/groups/*` endpoints.
5. Bot and API call internal trigger/sticker services.
6. Sticker engine writes artifacts to object storage.
7. API persists durable state to PostgreSQL.

## Polling vs webhook guidance

### Development
- Use `TELEGRAM_BOT_MODE=polling` for simple local iteration.

### Production
- Prefer `TELEGRAM_BOT_MODE=webhook`.
- `TELEGRAM_WEBHOOK_URL` must be a stable HTTPS endpoint.
- The deployed webhook route should be monitored, logged, and retried safely.

## Current blockers to true production readiness

- Bot runtime does not yet expose a real Telegram webhook handler.
- Mini App init data is parsed but not cryptographically verified server-side.
- Group and rule storage is still in-memory scaffold data.
- No operator authentication/authorization layer yet.
- No durable async job layer between API and processing engines.
- No end-to-end pack publishing flow into Telegram sticker APIs.

## Practical next steps

1. Add webhook ingestion path and Telegram request verification.
2. Persist groups/rules/packs in PostgreSQL with migrations.
3. Validate Mini App launch data server-side before returning operator data.
4. Add structured logging, metrics, traces, and rate limits.
5. Add queue-backed processing for sticker generation and trigger execution.
