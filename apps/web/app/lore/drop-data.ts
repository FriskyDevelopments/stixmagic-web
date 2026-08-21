export type DropVisibility = 'public' | 'member-only';

export type LoreDrop = {
  id: string;
  title: string;
  eyebrow: string;
  releaseDate: string;
  releaseLabel: string;
  visibility: DropVisibility;
  auraId?: string;
  summary: string;
  body?: string;
  actionLabel?: string;
};

export const LORE_DROPS: LoreDrop[] = [
  {
    id: 'the-soft-machinery',
    title: 'The Soft Machinery',
    eyebrow: 'DROP 001 / TENDER STATIC',
    releaseDate: '2026-09-12T18:00:00.000Z',
    releaseLabel: '12 SEP 2026 · 18:00 UTC',
    visibility: 'member-only',
    auraId: 'tender-static',
    summary: 'A field note about the machines we build to hold a memory in place.',
    body: 'The first thing the room remembers is not the person. It is the pressure of their hand on the light switch. This drop is a small collection of images, a letter never sent, and one prompt for keeping the afterimage without turning it into proof.',
    actionLabel: 'Open member drop'
  },
  {
    id: 'weather-report-for-an-interior',
    title: 'Weather Report for an Interior',
    eyebrow: 'DROP 002 / DEEP WATER',
    releaseDate: '2026-09-26T18:00:00.000Z',
    releaseLabel: '26 SEP 2026 · 18:00 UTC',
    visibility: 'public',
    auraId: 'deep-water',
    summary: 'An open reading on the pressure before the door opens.',
    body: 'A room can keep a different kind of weather. This public fragment is a beginning for anyone who wants to read slowly.',
    actionLabel: 'Read public fragment'
  },
  {
    id: 'a-small-light-left-on',
    title: 'A Small Light, Left On',
    eyebrow: 'DROP 003 / AFTERGLOW',
    releaseDate: '2026-10-10T18:00:00.000Z',
    releaseLabel: '10 OCT 2026 · 18:00 UTC',
    visibility: 'member-only',
    auraId: 'afterglow',
    summary: 'Five images for the hour when the day has ended but the night has not yet arrived.',
    actionLabel: 'Hold for release'
  },
  {
    id: 'the-night-garden',
    title: 'The Night Garden',
    eyebrow: 'DROP 004 / NIGHT BLOOM',
    releaseDate: '2026-10-24T18:00:00.000Z',
    releaseLabel: '24 OCT 2026 · 18:00 UTC',
    visibility: 'member-only',
    auraId: 'night-bloom',
    summary: 'A ritual for objects that have been waiting for one another.',
    actionLabel: 'Hold for release'
  }
];

export function getDrop(dropId: string): LoreDrop | undefined {
  return LORE_DROPS.find((drop) => drop.id === dropId);
}
