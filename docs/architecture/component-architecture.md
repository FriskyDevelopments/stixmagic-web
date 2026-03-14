# Web Component Architecture

Shared components in `packages/ui`:

- `Hero`
- `FeatureGrid`
- `MaskCatalog`
- `MaskCard`
- `MaskHeroPreview`
- `Tabs`
- `Panel`

## Composition Strategy

- Pages in `apps/web/app/*` compose sections from `@stixmagic/ui`.
- Domain datasets stay in app-level data modules (`app/data`).
- Shared visual language and behavior remains reusable across future platform surfaces.

## Interaction Model

`MaskCatalog` is a client component that:

1. Renders masks from structured data.
2. Tracks selected mask state.
3. Updates preview, title, and description on card click.
4. Displays pipeline guidance and FAQ-ready context.

## Design Tokens

Tailwind theme tokens:

- Background `#05060b`
- Panel `#0b0d14`
- Secondary panel `#10131d`
- Text `#f5f7ff`
- Muted `#aeb6cf`
- Accent primary `#4d86ff`
- Accent cyan `#7cf2ff`
- Accent violet `#9d7dff`
- Accent pink `#ff7fdc`
