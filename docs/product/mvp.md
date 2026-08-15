# STIXMΛGIC MVP

## User promise

An approved Telegram admin can connect a group, define a sticker or emoji trigger, and have STIXMΛGIC answer matching group messages automatically.

## Included

- Signed Telegram Mini App identity validation
- Explicit admin allowlist through `ADMIN_TELEGRAM_USER_ID`
- Group discovery from Telegram group and supergroup webhooks
- Create, enable, disable, and delete reaction rules
- Emoji-text and sticker-file-id matching
- Text, sticker, animation, and inline-link button responses
- Duplicate webhook protection and retryable queued execution
- Static-export-compatible live group and reaction routes

## Required runtime configuration

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_BOT_USERNAME`
- `TELEGRAM_MINI_APP_URL`
- `TELEGRAM_WEBHOOK_SECRET`
- `ADMIN_TELEGRAM_USER_ID`
- `ENABLE_JOB_WORKER=true`
- `NEXT_PUBLIC_STIXMAGIC_USE_DEMO_DATA=false`
- `NEXT_PUBLIC_STIXMAGIC_ALLOW_API_FALLBACK=false`

Register the API webhook URL with Telegram using the same secret as `TELEGRAM_WEBHOOK_SECRET`. Production rejects webhook traffic when that secret is absent.

## Acceptance check

1. Add the bot to a test group and grant it permission to read and send messages.
2. Send one message so the webhook discovers the group.
3. Open the Mini App as the configured admin and select the group.
4. Create an emoji-to-message rule, for example `✨` to `Magic activated!`.
5. Send `✨` in the group and confirm the bot replies to that message.
6. Disable the rule and confirm the same trigger no longer produces a reply.

Local unit tests mock the Telegram Bot API. A real Telegram exchange is required before claiming a deployment is live or end-to-end verified.

## Deliberately deferred

- PostgreSQL and object-storage persistence
- Per-group Telegram membership/admin verification
- Cooldown enforcement and metrics
- Sticker generation and pack publishing UI
- Discord, Slack, and marketplace work
