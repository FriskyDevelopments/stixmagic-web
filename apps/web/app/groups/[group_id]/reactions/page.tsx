import { MOCK_GROUPS } from '../../../lib/mock-data';
import ReactionsEditor from './ReactionsEditor';

export const dynamicParams = false;

export async function generateStaticParams() {
  return MOCK_GROUPS.map((group) => ({ group_id: group.id }));
}

interface Props {
  params: { group_id: string };
}

export default function ReactionsPage({ params }: Props) {
  return <ReactionsEditor groupId={params.group_id} />;
}
