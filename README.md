# MagicStix Web

The public-facing presentation, catalog, and generator frontend for the MagicStix visual asset ecosystem.

## What this repo is

This repository is the **web layer** of the MagicStix ecosystem. It showcases, previews, and catalogs assets produced by the `stixmagic-bot` pipeline. No asset generation logic lives here.

```
stixmagic-bot  →  generates assets, packs, metadata
stixmagic-web  →  displays, previews, serves them
```

## Monorepo Structure

```txt
stixmagic-web/
├── apps/
│   ├── web/           — Next.js site (main app)
│   └── bot/           — Bot runtime (separate concern)
├── packages/
│   ├── ui/            — Shared React components
│   ├── types/         — Domain types and interfaces
│   └── config/        — Typed environment config
├── docs/
│   ├── architecture/  — System architecture docs
│   ├── product/       — Product vision
│   ├── roadmap/       — Development roadmap
│   └── web/           — Web-specific docs
└── infra/
    ├── docker/
    └── deploy/
```

## Site Pages

| Page | Path | Description |
|---|---|---|
| Home | `/` | Landing — ecosystem overview and positioning |
| Ecosystem | `/ecosystem` | Explains the bot/web repo split and what MagicStix produces |
| Pack Catalog | `/packs` | Browse all MagicStix packs by category |
| Gallery | `/gallery` | Asset preview gallery with GIF/WebM indicators |
| Generator | `/generator` | Generator UI scaffold (pipeline integration ready) |
| Masks | `/masks` | Mask catalog for sticker processing pipeline |

## UI Components

The `@stixmagic/ui` package provides:

- `Hero` — landing section hero
- `FeatureGrid` — 2–4 column feature highlight grid
- `PackCard` / `PackGrid` — pack catalog cards and grid
- `GalleryCard` / `GalleryGrid` — asset preview cards and grid
- `GeneratorScaffold` — step-based generator UI with coming-soon states
- `Panel` — content panel with default/secondary variants
- `Tabs` — tab switcher for content sections
- `MaskCatalog` / `MaskCard` / `MaskHeroPreview` — mask browsing UI

## Quick Start

1. Install dependencies:

```bash
pnpm install
```

2. Prepare env:

```bash
cp .env.example .env
```

3. Run web app in development:

```bash
pnpm --filter @stixmagic/web dev
```

4. Build:

```bash
pnpm --filter @stixmagic/web build
```

## Documentation

- [`docs/web/web-architecture.md`](docs/web/web-architecture.md) — site architecture and directory structure
- [`docs/web/content-structure.md`](docs/web/content-structure.md) — content types and data sources
- [`docs/web/pack-pages.md`](docs/web/pack-pages.md) — pack catalog and page architecture
- [`docs/web/generator-ui-plan.md`](docs/web/generator-ui-plan.md) — generator frontend plan
- [`docs/web/pipeline-integration.md`](docs/web/pipeline-integration.md) — pipeline manifest and API integration

## Deployment

The web app deploys to GitHub Pages via `.github/workflows/deploy-pages.yml` on every push to `main`.

1. Create a GitHub repo and push to `main`.
2. In GitHub repo settings, set **Pages** source to **GitHub Actions**.
3. Each push to `main` auto-deploys the static export.

