# Pipeline Integration

This document describes how the `stixmagic-web` repository integrates with the `stixmagic-bot` pipeline.

## Integration Principle

This web repository does **not** generate assets. It consumes outputs from the `stixmagic-bot` pipeline.

The integration boundary is defined by:
- Pipeline manifest JSON files
- Generated preview assets (GIF, WebM, WebP)
- A future generation API for the generator frontend

## What the Pipeline Produces

The `stixmagic-bot` pipeline produces:

| Output | Format | Used by web |
|---|---|---|
| Pack manifests | JSON | Pack catalog, asset gallery |
| Asset previews | GIF, WebM | Gallery cards, pack cards |
| Motion presets | JSON | Generator style selector |
| Metadata | JSON | Asset detail cards |

## Manifest Schema

### Pack Manifest

```json
{
  "version": "1.0.0",
  "generatedAt": "2025-01-01T00:00:00Z",
  "packs": [
    {
      "id": "motion-alphabet-v1",
      "name": "Motion Alphabet v1",
      "category": "motion-alphabet",
      "description": "Animated A–Z letters...",
      "previewUrl": "https://assets.magicstix.io/packs/motion-alphabet-v1/preview.gif",
      "assetCount": 26,
      "tags": ["animated", "looping", "letter"],
      "formats": ["gif", "webm"],
      "featured": true
    }
  ]
}
```

### Asset Manifest

```json
{
  "assets": [
    {
      "id": "letter-a-neon",
      "name": "Letter A — Neon",
      "packId": "motion-alphabet-v1",
      "previewUrl": "https://assets.magicstix.io/assets/letter-a-neon/preview.gif",
      "formats": ["gif", "webm"],
      "tags": ["animated", "looping", "letter", "neon"]
    }
  ]
}
```

## Current Integration State

The web app currently uses sample data in `apps/web/app/data/packs.ts` and `apps/web/app/data/assets.ts`.

These files mirror the `ProductPack` and `AssetPreviewItem` types from `packages/types`. When the pipeline produces manifests in this format, the sample data can be replaced with a manifest loader.

## Planned Manifest Loader

A manifest adapter (planned at `apps/web/app/integrations/`) will:
1. Fetch the manifest JSON from a CDN or pipeline output location
2. Validate and parse it against the `PipelineManifest` type
3. Expose hooks like `usePacks()` and `useAssets()` for page components

## Preview Asset Delivery

Preview assets (GIF, WebM) will be served from:
- Object storage (S3-compatible) via CDN
- URLs referenced in asset manifests
- The web app displays them without proxy — direct CDN references

## Generation API (Future)

When the pipeline exposes a generation API, the `/generator` page will connect to it.

See `docs/web/generator-ui-plan.md` for the planned API contract.
