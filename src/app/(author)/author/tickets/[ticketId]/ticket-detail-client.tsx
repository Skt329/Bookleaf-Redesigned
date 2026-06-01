'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn, formatDate } from '@/lib/utils';
import { SectionWrapper } from '@/components/shared';
import {
  MessageSquare,
  Clock,
  AlertCircle,
  CheckCircle2,
  Send,
  ArrowLeft,
  Tag,
  Flag,
} from 'lucide-react';

/* -----------------------------------------------------------------------
   Types
   ----------------------------------------------------------------------- */

interface Message {
  id: string;
  senderId: string;
  senderRole: string;
  content: string;
  isInternalNote: boolean;
  createdAt: string;
  sender: { name: string | null };
}

interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  book: { title: string } | null;
  messages: Message[];
}

/* -----------------------------------------------------------------------
   Helpers
   ----------------------------------------------------------------------- */

const STATUS_STYLES: Record<string, string> = {
  OPEN: 'bg-status-warning/10 text-status-warning',
  IN_PROGRESS: 'bg-brand-accent/10 text-brand-accent',
  RESOLVED: 'bg-status-success/10 text-status-success',
  CLOSED: 'bg-surface-muted text-text-muted',
};

const PRIORITY_STYLES: Record<string, string> = {
  CRITICAL: 'bg-status-danger/10 text-status-danger',
  HIGH: 'bg-status-warning/10 text-status-warning',
  MEDIUM: 'bg-brand-accent/10 text-brand-accent',
  LOW: 'bg-surface-muted text-text-muted',
};

function formatCategory(cat: string) {
  return cat.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/* -----------------------------------------------------------------------
   Component
   ----------------------------------------------------------------------- */

export default function TicketDetailClient({ ticket }: { ticket: Ticket }) {
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>(ticket.messages);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim()) return;

    setSending(true);
    try {
      const res = await fetch(
        `/api/author/tickets/${ticket.id}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: reply.trim() }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.data]);
        setReply('');
      }
    } catch {
      // handle error
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/author/tickets"
        className="inline-flex items-center gap-2 text-body-sm text-text-secondary hover:text-brand-primary transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to Tickets
      </Link>

      {/* Ticket header */}
      <SectionWrapper>
        <div className="card p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <p className="text-body-sm text-text-muted font-mono">
                {ticket.ticketNumber}
              </p>
              <h1 className="font-display text-heading-md text-text-primary">
                {ticket.subject}
              </h1>
              <p className="text-body-md text-text-secondary">{ticket.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className={cn('badge px-3 py-1', STATUS_STYLES[ticket.status] || '')}>
                {ticket.status === 'OPEN' && <Clock className="size-3" />}
                {ticket.status === 'IN_PROGRESS' && <AlertCircle className="size-3" />}
                {ticket.status === 'RESOLVED' && <CheckCircle2 className="size-3" />}
                {ticket.status.replace('_', ' ')}
              </span>
              <span className={cn('badge px-3 py-1', PRIORITY_STYLES[ticket.priority] || '')}>
                <Flag className="size-3" />
                {ticket.priority}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-body-sm text-text-muted">
            <span className="flex items-center gap-1">
              <Tag className="size-3.5" />
              {formatCategory(ticket.category)}
            </span>
            {ticket.book && (
              <span>
                Book: <strong className="text-text-primary">{ticket.book.title}</strong>
              </span>
            )}
            <span>Created: {formatDate(ticket.createdAt)}</span>
          </div>
        </div>
      </SectionWrapper>

      {/* Message thread */}
      <SectionWrapper delay={0.1}>
        <div className="space-y-4">
          <h2 className="font-display text-heading-sm text-text-primary flex items-center gap-2">
            <MessageSquare className="size-5 text-brand-accent" />
            Conversation
          </h2>

          {messages.length === 0 ? (
            <p className="text-body-md text-text-muted py-8 text-center">
              No messages yet. Start the conversation below.
            </p>
          ) : (
            <div className="space-y-4">
              {messages
                .filter((m) => !m.isInternalNote)
                .map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'rounded-xl p-4 border',
                      msg.senderRole === 'ADMIN'
                        ? 'bg-brand-primary/5 border-brand-primary/20 ml-0 mr-8 md:mr-16'
                        : 'bg-surface-card border-border ml-8 md:ml-16 mr-0'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-body font-semibold text-body-sm text-text-primary">
                          {msg.sender.name || 'Unknown'}
                        </span>
                        <span
                          className={cn(
                            'badge text-xs',
                            msg.senderRole === 'ADMIN'
                              ? 'bg-brand-primary/10 text-brand-primary'
                              : 'bg-brand-accent/10 text-brand-accent'
                          )}
                        >
                          {msg.senderRole}
                        </span>
                      </div>
                      <span className="text-caption text-text-muted">
                        {formatDate(msg.createdAt)}
                      </span>
                    </div>
                    <p className="text-body-md text-text-secondary whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </SectionWrapper>

      {/* Reply form */}
      {ticket.status !== 'CLOSED' && (
        <SectionWrapper delay={0.2}>
          <form onSubmit={handleSubmit} className="card p-6 space-y-4">
            <h3 className="font-body font-semibold text-body-lg text-text-primary">
              Reply
            </h3>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your reply..."
              rows={4}
              className="w-full rounded-lg border border-border bg-surface-background px-4 py-3 text-body-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors resize-none font-body"
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={sending || !reply.trim()}
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg px-6 py-2.5 font-body font-semibold text-body-sm transition-all',
                  sending || !reply.trim()
                    ? 'bg-surface-muted text-text-muted cursor-not-allowed'
                    : 'bg-brand-primary text-text-inverse hover:bg-brand-primary-hover'
                )}
              >
                <Send className="size-4" />
                {sending ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </form>
        </SectionWrapper>
      )}
    </div>
  );
}
