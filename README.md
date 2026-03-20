# Telegram VideoChat Companion Bot

A focused Telegram bot project for group voice chats, video chats, and live rooms.

This repository is intentionally practical: it removes the previous demo branding and keeps only a working foundation for a real Telegram room-assistant product.

## What it does

The bot is designed for Telegram group admins and community moderators who run recurring voice or video sessions and need lightweight automation inside the room.

### Current capabilities

- Detects Telegram `video_chat_started` and `video_chat_ended` service messages.
- Tracks invited participants from `video_chat_participants_invited` events.
- Announces that a session has started.
- Provides room commands:
  - `/vc`
  - `/status`
  - `/join`
  - `/leave`
- Maintains an in-memory speaker queue.
- Ships with a minimal landing page in `web/` instead of a fake dashboard.

## Repo structure

```txt
.
├── bot/    # Telegram bot runtime, commands, and event handlers
├── core/   # Shared config, formatting, and session-state logic
├── web/    # Minimal static landing page
└── docs/   # Audit notes and product-facing documentation
```

## Local development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Required variable:

- `TELEGRAM_BOT_TOKEN`

Optional variables:

- `BOT_USERNAME`
- `SESSION_ANNOUNCE_TEMPLATE`
- `WEB_PORT`

### 3. Run in development

```bash
npm run dev
```

This starts:

- the Telegram bot in watch mode
- the static landing page at `http://localhost:3000`

### 4. Build

```bash
npm run build
```

### 5. Start the bot

```bash
npm start
```

## Product positioning

This is an early-stage but real foundation for a Telegram live-room assistant.

It is intentionally narrow:

- no fake generator UI
- no unrelated sticker-pipeline narrative
- no placeholder product theater

## Known limitations

Telegram bots do not expose every voice-chat presence signal. This codebase only claims support for what is currently implemented.

### Implemented today

- room start/end detection through Telegram service events
- invited participant tracking from service messages
- simple speaker queue commands
- room status output

### Not implemented yet

- persistent storage
- moderator permissions and admin-only controls
- queue rotation automation
- session timers and reminders
- richer analytics for room attendance
- deeper participant join/leave tracking if Telegram exposes additional usable events for bots

## Roadmap

1. Add persistence for sessions and queues.
2. Add admin-only moderation commands.
3. Add scheduled reminders and session timers.
4. Add optional webhook mode and deployment recipes.
5. Add room stats once reliable event coverage is available.

## Audit

See `docs/audit.md` for the cleanup summary and what was removed.
