'use client';

import { useSearchParams } from 'next/navigation';
import { Panel } from '@stixmagic/ui';
import ReactionsEditor from '../groups/[group_id]/reactions/ReactionsEditor';

export default function ReactionsQueryView() {
  const groupId = useSearchParams().get('groupId');
  if (!groupId) {
    return <Panel><p className="text-sm text-muted">Choose a connected group first.</p></Panel>;
  }
  return <ReactionsEditor groupId={groupId} />;
}
