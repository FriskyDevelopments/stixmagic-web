# Generator UI Plan

This document describes the planned architecture for the MagicStix generator frontend.

## Overview

The generator UI will let users:
1. Enter text or select characters
2. Choose a style preset
3. Preview the animated output
4. Select export format
5. Download the generated asset

All generation logic runs in the `stixmagic-bot` pipeline. This frontend is the interface layer only.

## Current State

The `/generator` page is scaffolded with:
- Step-by-step workflow UI (`GeneratorScaffold` component)
- Step 1 (text input) — ready for wiring
- Steps 2–4 (style, preview, export) — marked "coming soon"

## Planned Components

### `TextInput`
- Free text input with character limit
- Live validation (character support per style)
- Connects to pipeline character renderer API

### `StyleSelector`
- Grid of style preset cards
- Loads from pipeline manifest `motionPresets`
- Each preset shows name, category, preview GIF

### `PreviewPlayer`
- Renders animated output preview
- Supports GIF and WebM
- Polling or WebSocket connection to generation API

### `ExportPanel`
- Format selection (GIF, WebM, WebP, PNG)
- Size/resolution options
- Download button that triggers pipeline export job

## API Boundary

The generator frontend will consume a REST or WebSocket API exposed by the `stixmagic-bot` pipeline:

```
POST /api/generate
{
  "text": "HELLO",
  "style": "neon-glow",
  "format": "gif"
}
→ { "jobId": "...", "previewUrl": "..." }

GET /api/generate/:jobId/status
→ { "status": "complete", "downloadUrl": "..." }
```

This API boundary is not yet finalized. The generator UI will remain scaffolded until it is.

## Integration Notes

- No generation logic lives in `stixmagic-web`
- Style presets load from pipeline manifest
- Preview assets stream from pipeline output storage
- Export jobs are dispatched to the pipeline and polled from this frontend
