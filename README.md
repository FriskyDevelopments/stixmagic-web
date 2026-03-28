# STIX MΛGIC Telegram Platform

This repository now treats the **Telegram bot**, **Telegram Mini App**, and the supporting API/services as one product system preparing for production.

Instead of “bot over here, web demo over there”, the repo is organized around two Telegram-facing surfaces that share one deployment story:

- **Bot surface** — the Telegram bot is the entry point, command layer, and automation runtime.
- **Mini App surface** — the Telegram Mini App is the operator console for groups, rules, and future deployment actions.
- **Shared platform layer** — typed contracts, environment strategy, API assumptions, and service topology used by both.

## New architecture

```txt
Telegram user/admin
   │
   ├── STIX MΛGIC Bot (@stixmagic/bot)
   │      ├── Telegram commands
   │      ├── Bot → Mini App handoff
   │      └── Trigger execution
   │
   ├── STIX MΛGIC Mini App (@stixmagic/web)
   │      ├── Group + rule management UI
   │      ├── Telegram bootstrap/context read path
   │      └── Uses shared Telegram API contracts
   │
   └── Shared Telegram API (@stixmagic/api)
          ├── /telegram/platform
          ├── /telegram/mini-app/bootstrap
          ├── /groups + /groups/:id/rules
          ├── packs / stickers / triggers
          └── production-facing config for both surfaces
```

## Monorepo structure

```txt
stixmagic-web/
├── apps/
│   ├── bot/            # Telegram bot runtime and Mini App handoff
│   └── web/            # Next.js Telegram Mini App UI
├── services/
│   ├── api/            # Shared Telegram + asset API surface
│   ├── sticker-engine/ # Sticker processing service
│   └── trigger-engine/ # Trigger execution service
├── packages/
│   ├── config/         # Shared env parsing + Telegram platform config builders
│   ├── types/          # Shared domain and Telegram contracts
│   └── ui/             # Shared React UI components
├── docs/
└── infra/
```

## What was unified

### 1) Shared Telegram platform config
Both the bot and mini app now derive from one naming and env strategy:

- `STIXMAGIC_API_BASE_URL`
- `STIXMAGIC_PUBLIC_WEB_URL`
- `TELEGRAM_BOT_USERNAME`
- `TELEGRAM_MINI_APP_URL`
- `TELEGRAM_BOT_MODE` (`polling` or `webhook`)
- `TELEGRAM_WEBHOOK_URL` (required when using webhook mode)

The web app uses corresponding build-time variables:

- `NEXT_PUBLIC_STIXMAGIC_API_BASE_URL`
- `NEXT_PUBLIC_STIXMAGIC_PUBLIC_WEB_URL`
- `NEXT_PUBLIC_STIXMAGIC_BOT_USERNAME`
- `NEXT_PUBLIC_STIXMAGIC_MINI_APP_URL`
- `NEXT_PUBLIC_STIXMAGIC_MANIFEST_URL`
- `NEXT_PUBLIC_STIXMAGIC_USE_DEMO_DATA`

### 2) Shared Telegram contracts
`@stixmagic/types` now includes shared Telegram-facing contracts for:

- bot runtime mode
- platform config payloads
- mini app bootstrap/context payloads
- reaction rule creation payloads

### 3) Shared API assumptions
The API now exposes Telegram-oriented endpoints that the mini app can use directly:

- `GET /telegram/platform`
- `GET /telegram/mini-app/bootstrap`
- `GET /groups`
- `GET /groups/:groupId`
- `GET /groups/:groupId/rules`
- `POST /groups/:groupId/rules`
- `PATCH /groups/:groupId/rules/:ruleId`
- `DELETE /groups/:groupId/rules/:ruleId`

This replaces the previous “mostly mock UI with implied backend” split with a clearer shared contract.

### 4) Bot-to-mini-app handoff
The bot now:

- presents the mini app as the primary control surface
- uses a shared mini app URL and bot links
- supports explicit runtime mode configuration for `polling` vs `webhook`
- keeps Telegram commands aligned with the mini app instead of pointing to parallel flows

### 5) Demo mode is explicit
The mini app no longer quietly depends on missing env vars to decide behavior.

Demo data is now an explicit build-time choice:

- `NEXT_PUBLIC_STIXMAGIC_USE_DEMO_DATA=true` → UI uses seeded scaffold data
- `false` → UI expects the shared API surface and only falls back when needed

## Local development

1. Install dependencies:

```bash
pnpm install
```

2. Copy environment template:

```bash
cp .env.example .env
```

3. Start the platform locally:

```bash
pnpm dev
```

Or run individual surfaces/services:

```bash
pnpm --filter @stixmagic/web dev
pnpm --filter @stixmagic/bot dev
pnpm --filter @stixmagic/api dev
```

## Deployment model

### Bot
- Deploy as a long-running worker/service.
- Use `TELEGRAM_BOT_MODE=webhook` in production where the platform supports a stable HTTPS ingress.
- Set `TELEGRAM_WEBHOOK_URL` to the public bot webhook endpoint.

### Mini App
- Deploy as the public web surface.
- `TELEGRAM_MINI_APP_URL` should point at the deployed Mini App route.
- Build using the `NEXT_PUBLIC_STIXMAGIC_*` values for the production environment.

### API
- Deploy as the shared internal/public API surface used by both bot and mini app.
- The bot and mini app should reference the same `STIXMAGIC_API_BASE_URL` / `NEXT_PUBLIC_STIXMAGIC_API_BASE_URL` target.

### Supporting services
- `sticker-engine` and `trigger-engine` remain service backends for asset processing and trigger execution.
- PostgreSQL and S3-compatible storage are still required for a real deployment.

## Backend hardening status

Recent backend work delivered a production-safe foundation for Telegram-facing trust and processing boundaries:

- Telegram Mini App init-data is now verified server-side before returning bootstrap data.
- Admin operations now require authenticated Telegram identity and explicit admin authorization.
- Telegram webhook ingestion now validates secret headers, parses typed updates, and handles duplicates idempotently.
- Heavy trigger/sticker workflows are now acknowledged quickly and executed via durable queued jobs.
- Sticker pack publishing now integrates with real Telegram Bot API methods for pack creation and sticker addition.

## Recommended next steps

1. Swap the current file-backed persistence layer with PostgreSQL connection pooling in production deployments.
2. Add per-route rate limiting and structured audit logging for admin actions.
3. Add dead-letter and metrics around the job worker loop.
4. Expand Telegram update handling coverage beyond message/sticker payloads.

## Docs

- [`infra/deploy/production-architecture.md`](infra/deploy/production-architecture.md)
- [`docs/architecture/api-design.md`](docs/architecture/api-design.md)
- [`docs/architecture/event-flow.md`](docs/architecture/event-flow.md)
