import type { Metadata } from 'next';
import DropsExperience from '../DropsExperience';
import { LORE_DROPS } from '../../drop-data';

export function generateStaticParams() {
  return LORE_DROPS.map((drop) => ({ drop_id: drop.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ drop_id: string }> }): Promise<Metadata> {
  const { drop_id } = await params;
  const drop = LORE_DROPS.find((item) => item.id === drop_id);
  return { title: `${drop?.title ?? 'Drop'} — LORE`, description: drop?.summary ?? 'A LORE drop.' };
}

export default async function DropDetailPage({ params }: { params: Promise<{ drop_id: string }> }) {
  const { drop_id } = await params;
  return <DropsExperience dropId={drop_id} />;
}
