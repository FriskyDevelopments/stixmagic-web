import type { Metadata } from 'next';
import DropsExperience from './DropsExperience';

export const metadata: Metadata = {
  title: 'Drops — LORE',
  description: 'A release calendar for LORE fragments, rituals, and member-room artifacts.'
};

export default function DropsPage() {
  return <DropsExperience />;
}
