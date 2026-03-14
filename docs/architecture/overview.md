# Stix Magic Architecture Overview

Stix Magic is a modular sticker alchemy platform where sticker assets become programmable objects in chat.

## Service Topology

- `apps/web` — Next.js product interface and landing experience.
- `apps/bot` — Telegram bot runtime and command surface.
- `services/api` — Primary HTTP API for packs, stickers, and triggers.
- `services/sticker-engine` — Media processing orchestration and sticker conversion metadata.
- `services/trigger-engine` — Action resolution runtime for sticker-trigger events.
- PostgreSQL — source of truth for users, packs, stickers, and triggers.
- S3-compatible object storage — persistent sticker assets and generated derivatives.

## Core Runtime Flow

1. User uploads media in web app.
2. API stores upload request and dispatches to sticker engine.
3. Sticker engine applies mask + optimization pipeline and writes output asset to object storage.
4. API records sticker metadata and trigger linkage in PostgreSQL.
5. User sends sticker in Telegram chat.
6. Bot emits sticker-used event to trigger engine.
7. Trigger engine resolves action and returns execution outcome.
8. Bot responds in chat with the resulting interaction.

## Monorepo Boundaries

- `packages/types` contains domain contracts and event schemas.
- `packages/config` provides typed environment config loading.
- `packages/ui` hosts reusable product UI components.

This boundary model keeps platform logic portable across new chat providers while retaining a shared product language.
