# LORE MVP handoff

The selected `stixmagic-web` repository now contains a browser-first LORE experience built on the existing Next.js web surface. The homepage at `/` is an editorial entry point for profiles, Auras, archive fragments, rituals, cover artifacts, and a personal Shelf.

## Implemented MVP slice

| Area | Delivered behavior |
| --- | --- |
| First-visit onboarding | Four cinematic panels, persistent skip, `localStorage` completion state, keyboard-visible controls, mobile layout, and reduced-motion behavior. |
| Ambient layer | Optional soundless grain, orbit traces, paper-light glow, and low-intensity ghost shapes. The toggle persists locally and automatically defaults off for reduced-motion preferences. |
| Aura directory | Four editorial Auras with color accents, descriptions, and routing into the ritual experience. |
| Archive | Three local editorial entries with deep links into The Canon Thread and local Shelf save actions. |
| Ritual deck | Intent filters, random draw, calm reduced-motion-compatible presentation, local favorites, and a copyable deep link. |
| Cover Room | Local-only title, Aura, and texture composition with browser-generated PNG export. Outputs are explicitly labeled personal creative artifacts, not identity verification. |
| Shelf | Browser-local saved discoveries with empty state, saved cards, remove actions, and clear no-account copy. |
| Canon Thread | Long-form reading route at `/lore/thread/` with chapter navigation, deep links, pull quotes, Aura references, scroll progress memory, ArrowUp/ArrowDown reading shortcuts, related artifacts, and print styles. |
| Type Room | Public design-system specimen using the same LORE tokens as the experience. |

## Run locally

From the repository root:

```bash
pnpm install
pnpm --filter @stixmagic/web dev
```

Open `http://localhost:3000/`. The Thread is available at `http://localhost:3000/lore/thread/`.

## Verification

The following checks passed during implementation:

```bash
pnpm --filter @stixmagic/web typecheck
pnpm --filter @stixmagic/web build
pnpm --filter @stixmagic/web lint
pnpm test
```

The browser verification covered onboarding progression and persistence, Thread loading and keyboard reading, Shelf save state, ritual redraw, title and Aura editing, PNG export, and the downloaded `lore-cover-artifact.png` file.

## Intentional MVP boundaries

This slice is intentionally local-first. It does not create accounts, claim a live community, require a CMS, call an image-generation API, or persist data beyond the current browser. A production phase can later add authenticated profiles, server-backed collections, a real archive source, and reusable project-launch content blocks without replacing the core interaction model.
