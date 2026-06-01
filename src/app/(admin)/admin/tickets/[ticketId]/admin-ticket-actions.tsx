'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Send, Sparkles } from 'lucide-react';

const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

interface Props {
  ticketId: string;
  currentStatus: string;
  currentPriority: string;
}

export function AdminTicketActions({ ticketId, currentStatus, currentPriority }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [priority, setPriority] = useState(currentPriority);
  const [reply, setReply] = useState('');
  const [saving, setSaving] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const router = useRouter();

  async function handleAIDraft() {
    setDrafting(true);
    try {
      const res = await fetch(`/api/admin/tickets/${ticketId}/ai-draft`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setReply(data.draft);
      }
    } catch {
      // handle error
    } finally {
      setDrafting(false);
    }
  }

  async function handleUpdate() {
    setSaving(true);
    try {
      await fetch(`/api/admin/tickets/${ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, priority }),
      });
      router.refresh();
    } catch {
      // handle error
    } finally {
      setSaving(false);
    }
  }

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: reply.trim() }),
      });
      if (res.ok) {
        setReply('');
        router.refresh();
      }
    } catch {
      // handle error
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Status / Priority controls */}
      <div className="card p-5">
        <h3 className="font-body font-semibold text-body-lg text-text-primary mb-4">Actions</h3>
        <div className="flex flex-wrap gap-3">
          <div>
            <label className="block text-caption text-text-muted mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-border bg-surface-background px-3 py-2 text-body-sm font-body text-text-primary">
              {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-caption text-text-muted mb-1">Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-lg border border-border bg-surface-background px-3 py-2 text-body-sm font-body text-text-primary">
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleUpdate}
              disabled={saving || (status === currentStatus && priority === currentPriority)}
              className={cn(
                'rounded-lg px-4 py-2 text-body-sm font-semibold font-body transition-colors',
                saving || (status === currentStatus && priority === currentPriority)
                  ? 'bg-surface-muted text-text-muted cursor-not-allowed'
                  : 'bg-brand-primary text-text-inverse hover:bg-brand-primary-hover'
              )}
            >
              {saving ? 'Saving...' : 'Update'}
            </button>
          </div>
        </div>
      </div>

      {/* Admin reply */}
      <form onSubmit={handleReply} className="card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-body font-semibold text-body-lg text-text-primary">Reply as Admin</h3>
          <button
            type="button"
            onClick={handleAIDraft}
            disabled={drafting}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold bg-brand-accent/10 text-brand-accent hover:bg-brand-accent/20 transition-colors font-body disabled:opacity-50"
          >
            <Sparkles className={cn('size-3.5', drafting && 'animate-spin')} />
            {drafting ? 'Drafting...' : 'AI Draft'}
          </button>
        </div>
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Type your response..."
          rows={3}
          className="w-full rounded-lg border border-border bg-surface-background px-4 py-3 text-body-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/30 transition-colors resize-none font-body"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving || !reply.trim()}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-body-sm font-semibold font-body transition-colors',
              saving || !reply.trim()
                ? 'bg-surface-muted text-text-muted cursor-not-allowed'
                : 'bg-brand-primary text-text-inverse hover:bg-brand-primary-hover'
            )}
          >
            <Send className="size-4" />
            {saving ? 'Sending...' : 'Send Reply'}
          </button>
        </div>
      </form>
    </div>
  );
}
