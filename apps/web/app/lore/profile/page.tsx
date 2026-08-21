import type { Metadata } from 'next';
import ProfileExperience from './ProfileExperience';

export const metadata: Metadata = {
  title: 'Your LORE Profile — Aura revealed',
  description: 'A personal creative profile revealed through the LORE Archive.'
};

export default function ProfilePage() {
  return <ProfileExperience />;
}
