# STIX MAGIC — Mini App & Groups API

Base service: `services/api`

## Scope

This document defines the public-facing API surface used by:
- Telegram Mini App (LORE / STIX MAGIC UI)
- Telegram group interactions (bot-triggered flows)

⚠️ This document does **NOT** include internal/admin endpoints implemented in `services/api`,
such as:
- `GET/POST /packs`
- `POST /stickers`
- `GET/POST /triggers`

These routes remain active and are used by bot/internal flows.
They should be considered **internal/legacy** and are documented separately.

## Response contract

All endpoints return a response envelope:

```json
{ "ok": true|false, "data": {} }
```

`ok=false` responses use an HTTP error code and provide a message or flattened validation payload in `data`.

## Authentication model

- Telegram Mini App identity is passed as `x-telegram-init-data` (or `tgWebAppData` query fallback).
- Identity verification is performed server-side from signed Telegram init-data.
- Admin routes require an authenticated Telegram identity and an explicit admin mapping in the repository layer.

## Telegram platform + Mini App endpoints

### `GET /telegram/platform`

Returns the normalized product platform config used by bot + Mini App surfaces.

### `GET /telegram/mini-app/bootstrap`

Authenticated route for Mini App startup payload:

- resolved Telegram platform config
- parsed Mini App launch context
- groups where the authenticated user has admin scope

## Group and reaction rule management

All `/groups*` endpoints are admin-only.

### `GET /groups`

List available Telegram groups.

### `GET /groups/:groupId`

Fetch one group by id.

### `GET /groups/:groupId/rules`

List reaction rules for a group.

### `POST /groups/:groupId/rules`

Create a reaction rule with:

- `name`
- `triggerType` (`sticker` or `emoji`)
- `triggerValue`
- `responseType` (`message` | `sticker` | `animation` | `button_action`)
- `responseContent`
- `enabled`

### `PATCH /groups/:groupId/rules/:ruleId`

Update rule enabled state.

### `DELETE /groups/:groupId/rules/:ruleId`

Delete a rule.

## Telegram webhook ingestion

### `POST /telegram/webhook`

- Validates Telegram webhook secret when `TELEGRAM_WEBHOOK_SECRET` is configured.
- Validates update payload shape.
- Deduplicates updates by Telegram `update_id`.
- Enqueues background `trigger.execute` jobs for async processing.

## Operations endpoints

### `GET /health`

Basic service liveness probe.

### `POST /internal/jobs/process-once`

Manually process one queued job (operational debug path).

## Internal/Admin API

For pack management, sticker ingestion, and trigger configuration endpoints, see:

→ `/docs/api/admin-api.md` (source of truth)

These endpoints are not part of the Mini App public contract.
