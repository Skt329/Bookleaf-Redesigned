import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';
import {
  Users,
  BookOpen,
  Wallet,
  LifeBuoy,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Dashboard — BookLeaf Publishing',
};

export default async function AdminDashboardPage() {
  const [
    totalAuthors,
    totalBooks,
    publishedBooks,
    openTickets,
    royaltyRecords,
    recentBooks,
    recentTickets,
  ] = await Promise.all([
    prisma.author.count(),
    prisma.book.count(),
    prisma.book.count({ where: { status: 'PUBLISHED' } }),
    prisma.supportTicket.count({ where: { status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
    prisma.royaltyRecord.findMany({
      select: { grossRoyalty: true, royaltyPaid: true, royaltyPending: true },
    }),
    prisma.book.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { author: { include: { user: { select: { name: true } } } } },
    }),
    prisma.supportTicket.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { author: { include: { user: { select: { name: true } } } } },
    }),
  ]);

  const totalRoyaltyEarned = royaltyRecords.reduce((sum, r) => sum + r.grossRoyalty, 0);
  const totalRoyaltyPending = royaltyRecords.reduce((sum, r) => sum + r.royaltyPending, 0);

  const stats = [
    { label: 'Total Authors', value: totalAuthors, icon: Users, color: 'text-brand-primary', bg: 'bg-brand-primary/10', href: '/admin/authors' },
    { label: 'Published Books', value: `${publishedBooks}/${totalBooks}`, icon: BookOpen, color: 'text-brand-accent', bg: 'bg-brand-accent/10', href: '/admin/books' },
    { label: 'Total Royalties', value: formatCurrency(totalRoyaltyEarned), icon: Wallet, color: 'text-status-success', bg: 'bg-status-success/10', href: '/admin/royalties' },
    { label: 'Open Tickets', value: openTickets, icon: LifeBuoy, color: 'text-status-warning', bg: 'bg-status-warning/10', href: '/admin/tickets' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-display-sm text-text-primary">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-body-md text-text-secondary">
          Platform overview and key metrics
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="card p-5 group hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className={`flex size-10 items-center justify-center rounded-lg ${stat.bg}`}>
                  <Icon className={`size-5 ${stat.color}`} />
                </div>
                <TrendingUp className="size-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="mt-3 text-heading-md font-display text-text-primary">
                {stat.value}
              </p>
              <p className="text-body-sm text-text-muted">{stat.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Pending royalties alert */}
      {totalRoyaltyPending > 0 && (
        <div className="rounded-xl border border-status-warning/30 bg-status-warning/5 p-4 flex items-center gap-3">
          <AlertCircle className="size-5 text-status-warning shrink-0" />
          <p className="text-body-sm text-text-primary">
            <strong>{formatCurrency(totalRoyaltyPending)}</strong> in pending royalty payouts awaiting processing.
          </p>
          <Link
            href="/admin/royalties"
            className="ml-auto text-body-sm font-semibold text-brand-primary hover:underline whitespace-nowrap"
          >
            View →
          </Link>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent books */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-heading-sm text-text-primary">Recent Books</h2>
            <Link href="/admin/books" className="text-body-sm text-brand-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentBooks.map((book) => (
              <div key={book.id} className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-surface-muted transition-colors">
                <div className="min-w-0">
                  <p className="text-body-sm font-semibold text-text-primary truncate">{book.title}</p>
                  <p className="text-caption text-text-muted">{book.author.user.name}</p>
                </div>
                <span className={`badge text-xs ${book.status === 'PUBLISHED' ? 'bg-status-success/10 text-status-success' : 'bg-status-warning/10 text-status-warning'}`}>
                  {book.status === 'PUBLISHED' ? <CheckCircle2 className="size-3 mr-1" /> : <Clock className="size-3 mr-1" />}
                  {book.status.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent tickets */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-heading-sm text-text-primary">Recent Tickets</h2>
            <Link href="/admin/tickets" className="text-body-sm text-brand-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentTickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/admin/tickets/${ticket.id}`}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-surface-muted transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-body-sm font-semibold text-text-primary truncate">{ticket.subject}</p>
                  <p className="text-caption text-text-muted">{ticket.ticketNumber} · {ticket.author.user.name}</p>
                </div>
                <span className={`badge text-xs ${ticket.status === 'OPEN' ? 'bg-status-info/10 text-status-info' : ticket.status === 'RESOLVED' ? 'bg-status-success/10 text-status-success' : 'bg-status-warning/10 text-status-warning'}`}>
                  {ticket.status.replace(/_/g, ' ')}
                </span>
              </Link>
            ))}
            {recentTickets.length === 0 && (
              <p className="text-body-sm text-text-muted text-center py-4">No tickets yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
