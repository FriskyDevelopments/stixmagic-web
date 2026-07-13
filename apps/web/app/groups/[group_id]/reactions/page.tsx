export const runtime = 'edge';

import { getGroup } from '../../../lib/mock-data';
import { notFound } from 'next/navigation';
import ReactionsEditor from './ReactionsEditor';

interface Props {
  params: { group_id: string };
}

export default function ReactionsPage({ params }: Props) {
  const group = getGroup(params.group_id);
  if (!group) notFound();

  return <ReactionsEditor groupId={group.id} groupName={group.name} />;
}
