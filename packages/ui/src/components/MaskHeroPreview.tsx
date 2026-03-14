import type { MaskDefinition } from '@stixmagic/types';

type MaskPathRecord = Record<MaskDefinition['id'], string>;

const maskPaths: MaskPathRecord = {
  default: 'M 12 12 H 116 V 116 H 12 Z',
  circle: 'M 64 12 C 92.7 12 116 35.3 116 64 C 116 92.7 92.7 116 64 116 C 35.3 116 12 92.7 12 64 C 12 35.3 35.3 12 64 12 Z',
  square: 'M 18 18 H 110 V 110 H 18 Z',
  oval: 'M 64 16 C 95 16 120 37.5 120 64 C 120 90.5 95 112 64 112 C 33 112 8 90.5 8 64 C 8 37.5 33 16 64 16 Z',
  diamond: 'M 64 10 L 118 64 L 64 118 L 10 64 Z',
  star: 'M64 10 L77 46 L115 46 L83 68 L95 106 L64 82 L33 106 L45 68 L13 46 L51 46 Z',
  heart: 'M64 112 C42 90 14 71 14 43 C14 26 27 14 43 14 C53 14 61 20 64 28 C67 20 75 14 85 14 C101 14 114 26 114 43 C114 71 86 90 64 112 Z'
};

interface MaskHeroPreviewProps {
  selectedMask: MaskDefinition;
}

export const MaskHeroPreview = ({ selectedMask }: MaskHeroPreviewProps) => (
  <div className="relative rounded-2xl border border-white/10 bg-panel p-8">
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-cyan/10 via-transparent to-accent-violet/15" />
    <div className="relative grid gap-5 md:grid-cols-[1fr_1.2fr] md:items-center">
      <svg viewBox="0 0 128 128" className="mx-auto h-44 w-44 text-accent-primary" fill="currentColor" aria-hidden>
        <path d={maskPaths[selectedMask.id]} />
      </svg>
      <div>
        <p className="text-xs uppercase tracking-wider text-accent-cyan">Selected Mask</p>
        <h3 className="mt-2 text-2xl font-semibold text-text">{selectedMask.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">{selectedMask.description}</p>
      </div>
    </div>
  </div>
);
