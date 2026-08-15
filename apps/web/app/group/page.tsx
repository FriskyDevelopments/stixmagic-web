import { Suspense } from 'react';
import { Panel } from '@stixmagic/ui';
import GroupQueryView from './GroupQueryView';

export default function GroupPage() {
  return (
    <Suspense fallback={<Panel><p className="text-sm text-muted">Loading group…</p></Panel>}>
      <GroupQueryView />
    </Suspense>
  );
}
