# API Design

Base service: `services/api`

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
