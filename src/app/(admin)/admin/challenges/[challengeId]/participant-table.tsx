'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { BookOpen, Loader2, Sparkles } from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  email: string;
  paymentStatus: string;
  poemsWritten: number;
  completedChallenge: boolean;
  bookPublished: boolean;
}

interface Props {
  challengeId: string;
  participants: Participant[];
  booksReadyCount: number;
}

const paymentStatusColors: Record<string, string> = {
  PAID: 'bg-status-success/10 text-status-success',
  PENDING: 'bg-status-warning/10 text-status-warning',
  REFUNDED: 'bg-status-danger/10 text-status-danger',
};

function getParticipantStatus(p: Participant): { label: string; className: string } {
  if (p.bookPublished) return { label: 'Published', className: 'bg-brand-accent/10 text-brand-accent' };
  if (p.completedChallenge) return { label: 'Completed', className: 'bg-status-success/10 text-status-success' };
  return { label: 'Writing', className: 'bg-status-info/10 text-status-info' };
}

export function ChallengeParticipantTable({ challengeId, participants: initial, booksReadyCount: initialReady }: Props) {
  const [participants, setParticipants] = useState(initial);
  const [booksReady, setBooksReady] = useState(initialReady);
  const [publishing, setPublishing] = useState<string | null>(null);

  const publishBook = async (registrationId: string) => {
    setPublishing(registrationId);
    try {
      const res = await fetch(`/api/admin/challenges/${challengeId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId }),
      });
      if (res.ok) {
        setParticipants((prev) =>
          prev.map((p) => (p.id === registrationId ? { ...p, bookPublished: true } : p))
        );
        setBooksReady((prev) => prev - 1);
      }
    } finally {
      setPublishing(null);
    }
  };

  const publishAll = async () => {
    setPublishing('all');
    try {
      const res = await fetch(`/api/admin/challenges/${challengeId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      });
      if (res.ok) {
        setParticipants((prev) =>
          prev.map((p) =>
            p.completedChallenge && !p.bookPublished ? { ...p, bookPublished: true } : p
          )
        );
        setBooksReady(0);
      }
    } finally {
      setPublishing(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-heading-sm text-text-primary">
          Participants ({participants.length})
        </h2>
        {booksReady > 0 && (
          <button
            onClick={publishAll}
            disabled={publishing === 'all'}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-accent px-4 py-2.5 text-body-sm font-semibold text-text-inverse transition-colors hover:bg-brand-accent-hover disabled:opacity-50"
          >
            {publishing === 'all' ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            Publish All Ready ({booksReady})
          </button>
        )}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-surface-muted">
                <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted">
                  Name
                </th>
                <th className="hidden px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted sm:table-cell">
                  Email
                </th>
                <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted">
                  Payment
                </th>
                <th className="hidden px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted md:table-cell">
                  Poems
                </th>
                <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted">
                  Status
                </th>
                <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-muted">
              {participants.map((p) => {
                const status = getParticipantStatus(p);
                const canPublish = p.completedChallenge && !p.bookPublished;

                return (
                  <tr key={p.id} className="transition-colors hover:bg-surface-muted/50">
                    <td className="px-5 py-4 text-body-sm font-semibold text-text-primary">
                      {p.name}
                    </td>
                    <td className="hidden px-5 py-4 text-body-sm text-text-secondary sm:table-cell">
                      {p.email}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          'badge text-xs',
                          paymentStatusColors[p.paymentStatus] || 'bg-surface-muted text-text-muted'
                        )}
                      >
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className="hidden px-5 py-4 text-body-sm text-text-secondary md:table-cell">
                      <span className="font-mono">{p.poemsWritten}</span>
                      <span className="text-text-muted"> / 21</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn('badge text-xs', status.className)}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {canPublish ? (
                        <button
                          onClick={() => publishBook(p.id)}
                          disabled={publishing === p.id}
                          className="inline-flex items-center gap-1.5 rounded-md bg-brand-primary px-3 py-1.5 text-caption font-semibold text-text-inverse transition-colors hover:bg-brand-primary-hover disabled:opacity-50"
                        >
                          {publishing === p.id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <BookOpen className="size-3.5" />
                          )}
                          Publish Book
                        </button>
                      ) : p.bookPublished ? (
                        <span className="text-caption text-text-muted">Published</span>
                      ) : (
                        <span className="text-caption text-text-muted">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
