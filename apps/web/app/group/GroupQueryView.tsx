'use client';

import { useSearchParams } from 'next/navigation';
import { Panel } from '@stixmagic/ui';
import GroupView from '../groups/[group_id]/GroupView';

export default function GroupQueryView() {
  const groupId = useSearchParams().get('groupId');
  if (!groupId) {
    return <Panel><p className="text-sm text-muted">Choose a connected group first.</p></Panel>;
  }
  return <GroupView groupId={groupId} />;
}
