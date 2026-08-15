import { Suspense } from 'react';
import { Panel } from '@stixmagic/ui';
import ReactionsQueryView from './ReactionsQueryView';

export default function ReactionsPage() {
  return (
    <Suspense fallback={<Panel><p className="text-sm text-muted">Loading reactions…</p></Panel>}>
      <ReactionsQueryView />
    </Suspense>
  );
}
