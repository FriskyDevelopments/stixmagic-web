/**
 * Manifest ingestion adapter
 *
 * Loads the MagicStix pipeline manifest at build time (static export).
 * When NEXT_PUBLIC_MANIFEST_URL is set, fetches from that URL and validates
 * the response. Falls back to local sample data if the URL is unset, the
 * request fails, or the response fails schema validation.
 *
 * No asset generation logic lives here — this repo is presentation-only.
 */

import type { PipelineManifest } from '@stixmagic/types';
import { validatePipelineManifest } from '@stixmagic/types';
import { SAMPLE_PACKS } from '../data/packs';
import { SAMPLE_ASSETS } from '../data/assets';

const SAMPLE_MANIFEST: PipelineManifest = {
  version: '0.0.0-sample',
  generatedAt: new Date(0).toISOString(),
  packs: SAMPLE_PACKS,
  assets: SAMPLE_ASSETS
};

let cached: PipelineManifest | null = null;

/**
 * Returns the pipeline manifest, either fetched from NEXT_PUBLIC_MANIFEST_URL
 * (validated) or the bundled sample data as a fallback.
 *
 * Results are cached in-process so multiple calls during a single build
 * produce only one network request.
 */
export async function loadPipelineManifest(): Promise<PipelineManifest> {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_MANIFEST_URL;

  if (!url) {
    cached = SAMPLE_MANIFEST;
    return cached;
  }

  let raw: unknown;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(
        `[manifest] fetch failed (HTTP ${response.status} ${response.statusText}). Falling back to sample data.`
      );
      cached = SAMPLE_MANIFEST;
      return cached;
    }
    raw = (await response.json()) as unknown;
  } catch (err) {
    console.warn(`[manifest] fetch error: ${String(err)}. Falling back to sample data.`);
    cached = SAMPLE_MANIFEST;
    return cached;
  }

  const result = validatePipelineManifest(raw);

  if (!result.ok) {
    console.warn(`[manifest] schema validation failed: ${result.error}. Falling back to sample data.`);
    cached = SAMPLE_MANIFEST;
    return cached;
  }

  cached = result.data;
  return cached;
}
