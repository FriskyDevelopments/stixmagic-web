# Web Architecture

The `stixmagic-web` repository is the presentation, catalog, and future generator frontend for the MagicStix ecosystem.

## Responsibility Split

| Concern | Repository |
|---|---|
| Asset generation | `stixmagic-bot` |
| Animation pipeline | `stixmagic-bot` |
| Pack production | `stixmagic-bot` |
| Metadata manifests | `stixmagic-bot` → consumed by web |
| Landing page | `stixmagic-web` |
| Product catalog | `stixmagic-web` |
| Preview gallery | `stixmagic-web` |
| Generator UI | `stixmagic-web` |
| Storefront | `stixmagic-web` (planned) |

## Directory Structure

```
apps/web/
├── app/
│   ├── page.tsx              — Landing / home
│   ├── ecosystem/page.tsx    — Ecosystem explanation
│   ├── packs/page.tsx        — Pack catalog
│   ├── gallery/page.tsx      — Asset preview gallery
│   ├── generator/page.tsx    — Generator UI scaffold
│   ├── masks/page.tsx        — Mask catalog (legacy)
│   ├── data/
│   │   ├── packs.ts          — Sample pack definitions
│   │   ├── assets.ts         — Sample asset previews
│   │   └── masks.ts          — Mask definitions
│   ├── layout.tsx            — Root layout + navigation
│   └── globals.css           — Global styles

packages/
├── ui/          — Shared React components
├── types/       — Domain types and interfaces
└── config/      — Typed environment config
```

## Tech Stack

- **Next.js 14** with App Router, static export
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **TypeScript** throughout
- **pnpm workspaces** monorepo

## Deployment

The web app is exported as a static site and deployed to GitHub Pages via `.github/workflows/deploy-pages.yml`.

Base path is derived from `GITHUB_REPOSITORY` when `GITHUB_PAGES=true`.
