import type { Metadata } from 'next';
import ArchiveExperience from './ArchiveExperience';

export const metadata: Metadata = {
  title: 'Enter the Archive — LORE',
  description: 'A short, browser-local route through LORE’s Aura map.'
};

export default function ArchiveEntryPage() {
  return <ArchiveExperience />;
}
