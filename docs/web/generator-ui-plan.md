# Generator UI Plan

This document describes the planned architecture for the MagicStix generator frontend.

## Guiding Constraint

The generator UI is a **frontend only**. No generation logic lives in this repository. The UI dispatches requests to an API exposed by the `stixmagic-bot` pipeline and renders responses.

The generator scaffold on `/generator` will remain gated as "coming soon" until the pipeline API contract is finalized and stable.

## Current State

The `/generator` page is scaffolded with:
- Step-by-step workflow UI (`GeneratorScaffold` component)
- Step 1 (text input) — interface ready, not yet wired to API
- Steps 2–4 (style, preview, export) — marked "coming soon"; gated until pipeline API exists

**Do not remove the "coming soon" gates until the pipeline API endpoints are deployed and confirmed stable.**

## Planned Generator Workflow

1. User enters text or selects characters
2. User chooses a style preset (loaded from pipeline manifest `motionPresets`)
3. User sees an animated preview (fetched from pipeline renderer)
4. User selects export format
5. User downloads the generated asset pack

## Planned Components

### `TextInput`
- Free text input with character limit per style
- Live validation (character support varies by style)
- Connects to pipeline character renderer API endpoint

### `StyleSelector`
- Grid of style preset cards
- Loads preset list from pipeline manifest `motionPresets` field
- Each preset card shows: name, category, preview GIF

### `PreviewPlayer`
- Renders animated output preview (GIF or WebM)
- Supports polling or WebSocket connection to generation API
- Uses `AssetPreview` component for loading/failed/ready states

### `ExportPanel`
- Format selection (GIF, WebM, WebP, PNG)
- Size/resolution options (from pipeline capabilities response)
- Download button triggers a pipeline export job

## Expected Pipeline API Contract

The generator frontend will consume a REST API exposed by the `stixmagic-bot` pipeline. The contract is not yet finalized, but the expected shape is:

### Submit a generation job

```http
POST /api/generate
Content-Type: application/json

{
  "text": "HELLO",
  "style": "neon-glow",
  "format": "gif"
}
```

Response:
```json
{
  "jobId": "gen_abc123",
  "status": "queued",
  "estimatedSeconds": 5
}
```

### Poll job status

```http
GET /api/generate/:jobId/status
```

Response (in progress):
```json
{ "status": "processing", "progress": 0.6 }
```

Response (complete):
```json
{
  "status": "complete",
  "previewUrl": "https://assets.magicstix.io/generated/gen_abc123/preview.gif",
  "downloadUrl": "https://assets.magicstix.io/generated/gen_abc123/export.zip"
}
```

Response (failed):
```json
{ "status": "failed", "error": "Unsupported character in style." }
```

### List available style presets

```http
GET /api/styles
```

Response:
```json
{
  "styles": [
    {
      "id": "neon-glow",
      "name": "Neon Glow",
      "category": "neon-signals",
      "previewUrl": "https://assets.magicstix.io/styles/neon-glow/preview.gif"
    }
  ]
}
```

This endpoint may also be served as a static JSON file in the pipeline manifest.

## Plan-Aware Extension Points

The `ProductPack` type supports an optional `plan` field (`'free' | 'premium' | 'pro'`). The generator may later gate style presets or export formats behind plan tiers.

**Do not implement billing, payment, or account logic in this repository.** Only render plan indicators from data provided by the pipeline/API.

## Integration Notes

- No generation logic lives in `stixmagic-web`
- Style presets load from pipeline manifest or `/api/styles`
- Preview assets stream from pipeline output storage
- Export jobs are dispatched to the pipeline API and polled from this frontend
- The UI stays "coming soon" gated until the API contract above is confirmed live

