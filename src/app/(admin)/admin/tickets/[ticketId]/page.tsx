import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatDate, cn } from '@/lib/utils';
import { ArrowLeft, Tag, Flag, Clock, MessageSquare } from 'lucide-react';
import { AdminTicketActions } from './admin-ticket-actions';

export const metadata: Metadata = { title: 'Ticket Detail — BookLeaf Admin' };

interface Props { params: Promise<{ ticketId: string }> }

export default async function AdminTicketDetailPage({ params }: Props) {
  const { ticketId } = await params;

  const ticket = await prisma.supportTicket.findUnique({
    where: { id: ticketId },
    include: {
      author: { include: { user: { select: { name: true, email: true } } } },
      book: { select: { title: true } },
      messages: {
        include: { sender: { select: { name: true } } },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!ticket) redirect('/admin/tickets');

  return (
    <div className="space-y-6">
      <Link href="/admin/tickets" className="inline-flex items-center gap-2 text-body-sm text-text-secondary hover:text-brand-primary transition-colors">
        <ArrowLeft className="size-4" /> Back to Tickets
      </Link>

      {/* Header */}
      <div className="card p-6">
        <div className="flex flex-col gap-3">
          <p className="text-caption text-text-muted font-mono">{ticket.ticketNumber}</p>
          <h1 className="font-display text-heading-lg text-text-primary">{ticket.subject}</h1>
          <p className="text-body-md text-text-secondary">{ticket.description}</p>
          <div className="flex flex-wrap gap-3 text-body-sm text-text-muted mt-2">
            <span className="flex items-center gap-1"><Tag className="size-3.5" />{ticket.category.replace(/_/g, ' ')}</span>
            <span className="flex items-center gap-1"><Flag className="size-3.5" />{ticket.priority}</span>
            <span className="flex items-center gap-1"><Clock className="size-3.5" />{formatDate(ticket.createdAt)}</span>
            <span>By: <strong className="text-text-primary">{ticket.author.user.name}</strong> ({ticket.author.user.email})</span>
            {ticket.book && <span>Book: <strong className="text-text-primary">{ticket.book.title}</strong></span>}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Messages */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-display text-heading-sm text-text-primary flex items-center gap-2">
            <MessageSquare className="size-5 text-brand-accent" /> Conversation
          </h2>
          {ticket.messages.length === 0 ? (
            <p className="text-body-md text-text-muted card p-6 text-center">No messages yet</p>
          ) : (
            <div className="space-y-3">
              {ticket.messages
                .filter((m) => !m.isInternalNote)
                .map((msg) => (
                  <div key={msg.id} className={cn(
                    'rounded-xl p-4 border',
                    msg.senderRole === 'ADMIN'
                      ? 'bg-brand-primary/5 border-brand-primary/20'
                      : 'bg-surface-card border-border'
                  )}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-body font-semibold text-body-sm text-text-primary">{msg.sender.name}</span>
                        <span className={cn('badge text-xs', msg.senderRole === 'ADMIN' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-brand-accent/10 text-brand-accent')}>
                          {msg.senderRole}
                        </span>
                      </div>
                      <span className="text-caption text-text-muted">{formatDate(msg.createdAt)}</span>
                    </div>
                    <p className="text-body-md text-text-secondary whitespace-pre-wrap">{msg.content}</p>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Actions sidebar */}
        <div>
          <AdminTicketActions
            ticketId={ticket.id}
            currentStatus={ticket.status}
            currentPriority={ticket.priority}
          />
        </div>
      </div>
    </div>
  );
}
