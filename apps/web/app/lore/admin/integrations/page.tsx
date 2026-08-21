import type { Metadata } from 'next';
import IntegrationsExperience from './IntegrationsExperience';

export const metadata: Metadata = {
  title: 'Integrations — LORE Admin',
  description: 'Server-side OAuth integration controls for the LORE MVP0.'
};

export default function IntegrationsPage() {
  return <IntegrationsExperience />;
}
