import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatDate, cn } from '@/lib/utils';
import { LifeBuoy } from 'lucide-react';
import { EmptyState } from '@/components/shared';
import { NewTicketForm } from './new-ticket-form';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support Tickets',
  description: 'Submit and track your support tickets.',
};

const priorityColors: Record<string, string> = {
  CRITICAL: 'bg-status-danger/10 text-status-danger',
  HIGH: 'bg-status-warning/10 text-status-warning',
  MEDIUM: 'bg-status-info/10 text-status-info',
  LOW: 'bg-surface-muted text-text-muted',
};

const ticketStatusColors: Record<string, string> = {
  OPEN: 'bg-status-info/10 text-status-info',
  IN_PROGRESS: 'bg-status-warning/10 text-status-warning',
  RESOLVED: 'bg-status-success/10 text-status-success',
  CLOSED: 'bg-surface-muted text-text-muted',
};

export default async function TicketsPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const author = await prisma.author.findFirst({
    where: { userId: session.user.id },
    include: {
      supportTickets: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!author) redirect('/author/dashboard');

  const tickets = author.supportTickets;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-display-sm text-text-primary">
            Support Tickets
          </h1>
          <p className="mt-1 text-body-md text-text-secondary">
            Get help with your publishing journey.
          </p>
        </div>
        <NewTicketForm />
      </div>

      {tickets.length === 0 ? (
        <EmptyState
          icon={LifeBuoy}
          title="No Tickets"
          description="You haven't submitted any support tickets yet."
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-surface-muted">
                  <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted">
                    Ticket #
                  </th>
                  <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted">
                    Subject
                  </th>
                  <th className="hidden px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted sm:table-cell">
                    Category
                  </th>
                  <th className="hidden px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted md:table-cell">
                    Priority
                  </th>
                  <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted">
                    Status
                  </th>
                  <th className="hidden px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted md:table-cell">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-muted">
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="transition-colors hover:bg-surface-muted/50"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/author/tickets/${ticket.id}`}
                        className="font-mono text-body-sm font-medium text-brand-primary hover:underline"
                      >
                        {ticket.ticketNumber}
                      </Link>
                    </td>
                    <td className="max-w-[200px] truncate px-5 py-4 text-body-sm text-text-primary">
                      {ticket.subject}
                    </td>
                    <td className="hidden px-5 py-4 text-body-sm text-text-secondary sm:table-cell">
                      {ticket.category.replace(/_/g, ' ')}
                    </td>
                    <td className="hidden px-5 py-4 md:table-cell">
                      <span
                        className={cn(
                          'badge',
                          priorityColors[ticket.priority],
                        )}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          'badge',
                          ticketStatusColors[ticket.status],
                        )}
                      >
                        {ticket.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="hidden px-5 py-4 text-body-sm text-text-muted md:table-cell">
                      {formatDate(ticket.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
