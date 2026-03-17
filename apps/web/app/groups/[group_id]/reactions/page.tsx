import { notFound } from 'next/navigation';
import { MOCK_GROUPS, getGroup, getRules } from '../../../lib/mock-data';
import ReactionsEditor from './ReactionsEditor';

export function generateStaticParams() {
  return MOCK_GROUPS.map((group) => ({ group_id: group.id }));
}

interface Props {
  params: { group_id: string };
}

export default function ReactionsPage({ params }: Props) {
  const group = getGroup(params.group_id);
  if (!group) notFound();

  const rules = getRules(group.id);

  return <ReactionsEditor groupId={group.id} groupName={group.name} initialRules={rules} />;
}
