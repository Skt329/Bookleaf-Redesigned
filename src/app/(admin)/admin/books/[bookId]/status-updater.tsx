'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const STATUSES = [
  'MANUSCRIPT_RECEIVED', 'EDITING', 'COVER_DESIGN', 'TYPESETTING',
  'PROOFREADING', 'ISBN_ASSIGNMENT', 'PRINTING', 'DISTRIBUTION_SETUP', 'PUBLISHED',
];

export function StatusUpdater({ bookId, currentStatus }: { bookId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleUpdate() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/books/${bookId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) router.refresh();
    } catch {
      // handle error
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="rounded-lg border border-border bg-surface-background px-3 py-2 text-body-sm font-body text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
        ))}
      </select>
      <button
        onClick={handleUpdate}
        disabled={saving || status === currentStatus}
        className={cn(
          'rounded-lg px-4 py-2 text-body-sm font-semibold font-body transition-colors',
          saving || status === currentStatus
            ? 'bg-surface-muted text-text-muted cursor-not-allowed'
            : 'bg-brand-primary text-text-inverse hover:bg-brand-primary-hover'
        )}
      >
        {saving ? 'Saving...' : 'Update'}
      </button>
    </div>
  );
}
