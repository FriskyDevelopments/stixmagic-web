# Pack Pages

This document describes the pack catalog and individual pack page architecture.

## Pack Catalog (`/packs`)

The pack catalog page displays all available MagicStix packs in a filterable grid.

### Components

- `Panel` — page header with title and description
- `Tabs` — category filter tabs
- `PackGrid` — responsive grid of `PackCard` components
- `PackCard` — individual pack card with preview, name, category, tags, and format badges

### Data

Pack data is loaded from `apps/web/app/data/packs.ts` (sample) or a future pipeline manifest.

### Pack Card Display

Each pack card shows:
- Preview image or placeholder
- Featured badge (if applicable)
- Pack name and category
- Short description
- Use-case tags
- Asset count
- Export format badges

## Individual Pack Pages (Future)

When the pipeline manifest includes sufficient metadata, individual pack pages at `/packs/[id]` will display:

- Full pack name and description
- All assets in the pack with GIF/WebM previews
- Available download formats
- Pack metadata (generated at, version, asset count)
- Related packs

## Pipeline Manifest Integration

Pack pages will eventually load data from a pipeline manifest JSON:

```json
{
  "version": "1.0.0",
  "generatedAt": "2025-01-01T00:00:00Z",
  "packs": [
    {
      "id": "motion-alphabet-v1",
      "name": "Motion Alphabet v1",
      "category": "motion-alphabet",
      "assetCount": 26,
      "formats": ["gif", "webm"],
      "tags": ["animated", "looping", "letter"]
    }
  ]
}
```

The web adapter at `integrations/asset-manifest-adapter` (planned) will parse and normalize this data.
