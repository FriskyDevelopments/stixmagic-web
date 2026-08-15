import { MOCK_GROUPS } from '../../lib/mock-data';
import GroupView from './GroupView';

export const dynamicParams = false;

export async function generateStaticParams() {
  return MOCK_GROUPS.map((group) => ({ group_id: group.id }));
}

interface Props {
  params: Promise<{ group_id: string }>;
}

export default async function GroupPage({ params }: Props) {
  const { group_id: groupId } = await params;
  return <GroupView groupId={groupId} />;
}
