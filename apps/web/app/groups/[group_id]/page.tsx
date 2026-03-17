import { MOCK_GROUPS } from '../../lib/mock-data';
import GroupView from './GroupView';

export function generateStaticParams() {
  return MOCK_GROUPS.map((group) => ({ group_id: group.id }));
}

interface Props {
  params: { group_id: string };
}

export default function GroupPage({ params }: Props) {
  return <GroupView groupId={params.group_id} />;
}

