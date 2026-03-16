'use client';

import { useState } from 'react';
import type { PreviewState } from '@stixmagic/types';
import { cn } from '../lib/cn';

interface AssetPreviewProps {
  /** The resolved preview URL. Pass an empty string to show the "pending" state. */
  url: string;
  alt: string;
  imageClassName?: string;
}

/**
 * Renders an asset preview image with explicit state handling:
 * - pending   – url is empty (awaiting pipeline output)
 * - loading   – url is set; image request in-flight
 * - ready     – image loaded successfully
 * - failed    – image request returned an error
 */
export const AssetPreview = ({ url, alt, imageClassName }: AssetPreviewProps) => {
  const [state, setState] = useState<PreviewState>(url === '' ? 'pending' : 'loading');

  if (state === 'pending') {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2" aria-label="Preview pending">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-primary/20">
          <span className="text-lg text-accent-primary/60" aria-hidden="true">✦</span>
        </div>
        <span className="text-[10px] uppercase tracking-wide text-muted/50">Preview pending</span>
      </div>
    );
  }

  if (state === 'failed') {
    return (
      <div
        className="flex h-full w-full flex-col items-center justify-center gap-1"
        aria-label="Preview unavailable"
      >
        <span className="text-base text-muted/40" aria-hidden="true">—</span>
        <span className="text-[10px] uppercase tracking-wide text-muted/40">Unavailable</span>
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {state === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent-primary/20 border-t-accent-primary" />
        </div>
      )}
      <img
        src={url}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          state === 'loading' ? 'opacity-0' : 'opacity-100',
          imageClassName
        )}
        onLoad={() => setState('ready')}
        onError={() => setState('failed')}
      />
    </div>
  );
};
