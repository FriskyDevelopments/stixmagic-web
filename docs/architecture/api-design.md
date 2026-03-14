# API Design

Base service: `services/api`

## Endpoints

### POST /stickers

Creates a sticker record from processed asset metadata.

Request body:

- `packId`
- `imageUrl`
- `metadata` (`width`, `height`, `format`, `sizeBytes`, `maskType`, `interactive`)
- `triggerId`

Response envelope:

```json
{ "ok": true, "data": { "id": "...", "packId": "..." } }
```

### GET /packs

Returns all sticker packs in the owner scope.

### POST /packs

Creates a new sticker pack.

Request body:

- `name`
- `ownerId`

### GET /triggers

Returns trigger definitions.

### POST /triggers

Creates a trigger mapping.

Request body:

- `stickerId`
- `actionType` (`send_message`, `run_command`, `call_webhook`, `bot_reaction`)
- `actionPayload`

## Response Contract

All routes return:

```json
{ "ok": true|false, "data": {} }
```

## Expansion Plan

- `GET /stickers/:id`
- `POST /events/sticker-used`
- `POST /packs/:id/publish`
- versioned API prefix `/v1`
