# Event Flow

## Sticker Creation

1. User uploads image in web app.
2. API receives asset request.
3. Sticker engine processes media pipeline.
4. API persists sticker + trigger references.
5. Sticker appears in pack builder and bot-facing metadata.

## Sticker Runtime Trigger

1. User sends sticker in Telegram chat.
2. Bot receives sticker message event.
3. Bot calls trigger engine with sticker + chat context.
4. Trigger engine executes mapped action.
5. Bot returns action result into conversation.

## Event Contract

Suggested envelope for asynchronous eventing:

```json
{
  "eventId": "evt_...",
  "type": "sticker.used",
  "occurredAt": "2026-03-14T00:00:00.000Z",
  "data": {
    "stickerId": "stk_...",
    "actorId": "usr_...",
    "chatId": "chat_...",
    "platform": "telegram"
  }
}
```

This contract supports queue-based processing in future phases.
