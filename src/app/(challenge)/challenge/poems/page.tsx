import { Suspense } from 'react';
import type { Metadata } from 'next';
import PoemsClient from './poems-client';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'My Poems — #TheWriteAngle Challenge',
  description: 'Write, edit, and submit your daily poems for the 21-day writing challenge.',
};

export default function PoemsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-brand-accent" />
        </div>
      }
    >
      <PoemsClient />
    </Suspense>
  );
}
