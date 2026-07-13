export const runtime = 'edge';

import { MOCK_GROUPS } from '../../lib/mock-data';
import GroupView from './GroupView';

interface Props {
  params: { group_id: string };
}

export default function GroupPage({ params }: Props) {
  return <GroupView groupId={params.group_id} />;
}
