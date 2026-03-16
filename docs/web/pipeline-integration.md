# Pipeline Integration

This document describes how the `stixmagic-web` repository integrates with the `stixmagic-bot` pipeline.

## Integration Principle

This web repository does **not** generate assets. It consumes outputs from the `stixmagic-bot` pipeline.

```
stixmagic-bot  →  generates assets, packs, metadata manifests
                         ↓
              NEXT_PUBLIC_MANIFEST_URL (CDN / object storage)
                         ↓
stixmagic-web  →  fetches + validates manifest at build time
               →  renders pack catalog, gallery, detail pages
               →  displays pipeline-produced preview assets
```

The integration boundary is defined by:
- Pipeline manifest JSON files (`PipelineManifest` schema)
- Generated preview assets (GIF, WebM, WebP) served from CDN
- A future generation API for the generator frontend

## Manifest Adapter (`apps/web/app/integrations/manifest.ts`)

The `loadPipelineManifest()` function is the single entry point for all manifest data:

1. If `NEXT_PUBLIC_MANIFEST_URL` is set, fetches the manifest JSON from that URL.
2. Validates the response against the `PipelineManifest` schema (field types, enum membership).
   - Invalid pack/asset entries are **skipped with a warning** rather than crashing.
3. If the URL is unset, the fetch fails, or validation fails at the top level, falls back to sample data.
4. Results are in-process cached so a single build triggers at most one network request.

### Configuration

Set `NEXT_PUBLIC_MANIFEST_URL` in your `.env` (or CI environment):

```env
NEXT_PUBLIC_MANIFEST_URL=https://assets.magicstix.io/manifests/latest.json
```

Leave it empty to use bundled sample data (default).

## What the Pipeline Produces

The `stixmagic-bot` pipeline produces:

| Output | Format | Used by web |
|---|---|---|
| Pack manifests | JSON | Pack catalog, asset gallery, detail pages |
| Asset previews | GIF, WebM | Gallery cards, pack cards |
| Motion presets | JSON | Generator style selector (planned) |
| Metadata | JSON | Asset detail cards |

## Manifest Schema

The manifest must conform to the `PipelineManifest` type defined in `packages/types/src/index.ts`.

### Full Manifest (`PipelineManifest`)

```json
{
  "version": "1.0.0",
  "generatedAt": "2025-01-01T00:00:00Z",
  "packs": [ /* ProductPack[] */ ],
  "assets": [ /* AssetPreviewItem[] */ ]
}
```

### Pack Entry (`ProductPack`)

```json
{
  "id": "motion-alphabet-v1",
  "name": "Motion Alphabet v1",
  "category": "motion-alphabet",
  "description": "Animated A–Z letters...",
  "previewUrl": "https://assets.magicstix.io/packs/motion-alphabet-v1/preview.gif",
  "assetCount": 26,
  "tags": ["animated", "looping", "letter"],
  "formats": ["gif", "webm"],
  "featured": true,
  "plan": "premium"
}
```

`plan` is optional. Valid values: `"free"`, `"premium"`, `"pro"`.

### Asset Entry (`AssetPreviewItem`)

```json
{
  "id": "letter-a-neon",
  "name": "Letter A — Neon",
  "description": "Animated neon-glow letter A.",
  "packId": "motion-alphabet-v1",
  "previewUrl": "https://assets.magicstix.io/assets/letter-a-neon/preview.gif",
  "formats": ["gif", "webm"],
  "tags": ["animated", "looping", "letter", "neon"]
}
```

## Runtime Schema Validation

All manifest data is validated before rendering using functions exported from `packages/types`:

- `validateProductPack(raw: unknown): ValidationResult<ProductPack>`
- `validateAssetPreviewItem(raw: unknown): ValidationResult<AssetPreviewItem>`
- `validatePipelineManifest(raw: unknown): ValidationResult<PipelineManifest>`

Validation checks required field presence, correct types, and valid enum values. Unknown tags/formats are filtered out rather than rejecting the whole entry.

## Preview Asset Delivery

Preview assets (GIF, WebM) are served directly from CDN references in the manifest. The `AssetPreview` component handles four states:

| State | Trigger |
|---|---|
| `pending` | `previewUrl` is an empty string (pipeline not yet run) |
| `loading` | `previewUrl` is set; image request in-flight |
| `ready` | Image loaded successfully |
| `failed` | Image request returned an error |

This isolates the `PENDING_PREVIEW_URL` sentinel from generic rendering logic — the component handles the distinction explicitly.

## Generation API (Future)

When the pipeline exposes a generation API, the `/generator` page will connect to it.

See `docs/web/generator-ui-plan.md` for the planned API contract.

