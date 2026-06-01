import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatDate, cn } from '@/lib/utils';
import { EmptyState } from '@/components/shared';
import { LifeBuoy } from 'lucide-react';

export const metadata: Metadata = { title: 'Manage Tickets — BookLeaf Admin' };

const statusColors: Record<string, string> = {
  OPEN: 'bg-status-info/10 text-status-info',
  IN_PROGRESS: 'bg-status-warning/10 text-status-warning',
  RESOLVED: 'bg-status-success/10 text-status-success',
  CLOSED: 'bg-surface-muted text-text-muted',
};

const priorityColors: Record<string, string> = {
  CRITICAL: 'bg-status-danger/10 text-status-danger',
  HIGH: 'bg-status-warning/10 text-status-warning',
  MEDIUM: 'bg-status-info/10 text-status-info',
  LOW: 'bg-surface-muted text-text-muted',
};

export default async function AdminTicketsPage() {
  const tickets = await prisma.supportTicket.findMany({
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    include: {
      author: { include: { user: { select: { name: true } } } },
      book: { select: { title: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-display-sm text-text-primary">Support Tickets</h1>
        <p className="mt-1 text-body-md text-text-secondary">
          {tickets.filter((t) => t.status === 'OPEN').length} open · {tickets.length} total
        </p>
      </div>

      {tickets.length === 0 ? (
        <EmptyState icon={LifeBuoy} title="No Tickets" description="No support tickets have been submitted." />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-surface-muted">
                  <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted">Ticket</th>
                  <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted">Subject</th>
                  <th className="hidden px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted sm:table-cell">Author</th>
                  <th className="hidden px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted md:table-cell">Category</th>
                  <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted">Priority</th>
                  <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted">Status</th>
                  <th className="hidden px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted lg:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-muted">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="transition-colors hover:bg-surface-muted/50">
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/tickets/${ticket.id}`}
                        className="font-mono text-body-sm font-medium text-brand-primary hover:underline"
                      >
                        {ticket.ticketNumber}
                      </Link>
                    </td>
                    <td className="max-w-[180px] truncate px-5 py-4 text-body-sm text-text-primary">
                      {ticket.subject}
                    </td>
                    <td className="hidden px-5 py-4 text-body-sm text-text-secondary sm:table-cell">
                      {ticket.author.user.name}
                    </td>
                    <td className="hidden px-5 py-4 text-body-sm text-text-secondary md:table-cell">
                      {ticket.category.replace(/_/g, ' ')}
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn('badge text-xs', priorityColors[ticket.priority] || '')}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn('badge text-xs', statusColors[ticket.status] || '')}>
                        {ticket.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="hidden px-5 py-4 text-body-sm text-text-muted lg:table-cell">
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
