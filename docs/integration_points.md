# STIX MΛGIC Integration Points

This document captures the explicit integration contract between the web mini app and the STIX MΛGIC bot/backend ecosystem.

## 1) Surface topology

- **Bot (`apps/bot`)**: Telegram command surface + Mini App handoff.
- **Mini App (`apps/web`)**: operator UI for groups/rules/content workflows.
- **API (`services/api`)**: shared contract boundary used by bot and mini app.
- **Engines (`services/sticker-engine`, `services/trigger-engine`)**: async processing backends.

## 2) API base URL contract

All surfaces should point to one authoritative API base per environment:

- Server-side: `STIXMAGIC_API_BASE_URL`
- Client-side: `NEXT_PUBLIC_STIXMAGIC_API_BASE_URL`

Mismatch here is a primary integration failure mode (UI loads but actions target wrong backend).

## 3) Current API endpoints consumed/expected

Mini app/API client paths in use:

- `GET /telegram/mini-app/bootstrap`
- `GET /groups`
- `GET /groups/:groupId`
- `GET /groups/:groupId/rules`
- `POST /groups/:groupId/rules`
- `PATCH /groups/:groupId/rules/:ruleId`
- `DELETE /groups/:groupId/rules/:ruleId`

Bot/API interactions in use:

- `GET /packs`
- `POST /internal/jobs/process-once` (internal process route)
- Trigger execution service call via `TRIGGER_ENGINE_URL/execute`

## 4) Telegram integration assumptions

### Bot identity and links

- `TELEGRAM_BOT_USERNAME` is used to generate deep links:
  - `https://t.me/<botUsername>`
  - `https://t.me/<botUsername>/app`

### Mini App URL

- `TELEGRAM_MINI_APP_URL` / `NEXT_PUBLIC_STIXMAGIC_MINI_APP_URL` must align with the deployed UI URL and BotFather mini app configuration.

### Runtime mode

- `TELEGRAM_BOT_MODE=polling` for local/dev environments.
- `TELEGRAM_BOT_MODE=webhook` for production; requires:
  - public HTTPS webhook endpoint (`TELEGRAM_WEBHOOK_URL`)
  - shared webhook secret (`TELEGRAM_WEBHOOK_SECRET`)

### Init-data trust boundary

- API validates Telegram Mini App init-data server-side.
- Freshness tolerance controlled by `TELEGRAM_INIT_DATA_MAX_AGE_SECONDS`.

## 5) Manifest/pipeline integration boundary

The web app optionally consumes pipeline manifest data through:

- `NEXT_PUBLIC_STIXMAGIC_MANIFEST_URL` (public URL)

If absent/unavailable, the app falls back to bundled sample data; this is acceptable for development but should be treated as degraded mode in production.

## 6) Auth and admin assumptions

- Admin-sensitive API operations rely on authenticated Telegram identity and explicit admin authorization middleware in the API service.
- CORS is enabled in API (`origin: true`); production environments should additionally control allowed origins at edge/proxy layer.

## 7) Webhook/public path expectations

Expected public ingress paths in production deployment design:

- API health: `/health`
- Telegram webhook route(s): under API `telegram` route namespace
- Mini App route: `/dashboard` (as configured by default URLs)

## 8) Open integration follow-ups

1. Move from permissive CORS to allowlist-based origin policy.
2. Add explicit API version prefix strategy (e.g., `/v1`) before broad external integrations.
3. Define SLOs and retry/backoff contracts between API and trigger/sticker engines.
4. Add monitoring and dead-letter strategy for queued job processing routes.
