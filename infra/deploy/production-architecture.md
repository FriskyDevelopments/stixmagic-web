# Deployment Architecture

## Runtime Units

- Web (`@stixmagic/web`)
- API (`@stixmagic/api`)
- Bot (`@stixmagic/bot`)
- Sticker Engine (`@stixmagic/sticker-engine`)
- Trigger Engine (`@stixmagic/trigger-engine`)
- PostgreSQL
- S3-compatible object storage

## Recommended Platform Layout

- Container platform for stateless services (Cloud Run, ECS, Fly, Railway, or Kubernetes).
- Managed PostgreSQL for relational durability.
- Managed S3-compatible bucket for sticker assets.
- Secret manager for bot token and credentials.

## Production Network Flow

1. Public traffic enters web and API.
2. Bot receives Telegram webhooks or polling events.
3. API and bot call internal sticker and trigger services.
4. Sticker engine writes artifacts to object storage.
5. API stores relational records and trigger links in PostgreSQL.

## Hardening Checklist

- Enforce JWT/session auth in API.
- Add API rate limiting and structured request validation.
- Use async queue between API and sticker engine for large jobs.
- Add OpenTelemetry traces and centralized logs.
- Add migration pipeline for PostgreSQL schema evolution.
