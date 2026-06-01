import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { BOOK_STATUSES } from '@/constants';
import {
  BookOpen,
  CheckCircle2,
  Wallet,
  Clock,
  LifeBuoy,
  IndianRupee,
  User,
  ArrowRight,
} from 'lucide-react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Overview of your publishing journey, books, and royalties.',
};

export default async function AuthorDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const author = await prisma.author.findFirst({
    where: { userId: session.user.id },
    include: {
      books: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });

  if (!author) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="font-display text-heading-md text-text-primary">
          Author Profile Not Found
        </h2>
        <p className="mt-2 text-body-md text-text-secondary">
          Your author profile hasn&apos;t been set up yet. Please contact
          support.
        </p>
      </div>
    );
  }

  const totalBooks = author.books.length;
  const publishedBooks = author.books.filter(
    (b) => b.status === 'PUBLISHED',
  ).length;
  const totalEarned = author.totalRoyaltyEarned;
  const pendingRoyalty = author.totalRoyaltyEarned - author.totalRoyaltyPaid;

  const summaryCards = [
    {
      label: 'Total Books',
      value: totalBooks.toString(),
      icon: BookOpen,
      bgClass: 'bg-status-info/10',
      iconClass: 'text-status-info',
    },
    {
      label: 'Published',
      value: publishedBooks.toString(),
      icon: CheckCircle2,
      bgClass: 'bg-status-success/10',
      iconClass: 'text-status-success',
    },
    {
      label: 'Total Royalty Earned',
      value: formatCurrency(totalEarned),
      icon: Wallet,
      bgClass: 'bg-brand-accent/10',
      iconClass: 'text-brand-accent',
    },
    {
      label: 'Pending Royalty',
      value: formatCurrency(pendingRoyalty),
      icon: Clock,
      bgClass: 'bg-status-warning/10',
      iconClass: 'text-status-warning',
    },
  ];

  const quickActions = [
    { label: 'Submit a Ticket', href: '/author/tickets', icon: LifeBuoy },
    { label: 'View Royalties', href: '/author/royalties', icon: IndianRupee },
    { label: 'Update Profile', href: '/author/profile', icon: User },
  ];

  const colorMap: Record<string, string> = {
    success: 'bg-status-success/10 text-status-success',
    warning: 'bg-status-warning/10 text-status-warning',
    info: 'bg-status-info/10 text-status-info',
    accent: 'bg-brand-accent/10 text-brand-accent',
  };

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="font-display text-display-sm text-text-primary">
          Welcome back, {session.user.name?.split(' ')[0] ?? 'Author'}
        </h1>
        <p className="mt-1 text-body-md text-text-secondary">
          Here&apos;s an overview of your publishing journey.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="card flex items-start gap-4 p-5">
            <div
              className={cn(
                'flex size-12 shrink-0 items-center justify-center rounded-xl',
                card.bgClass,
              )}
            >
              <card.icon className={cn('size-6', card.iconClass)} />
            </div>
            <div>
              <p className="text-caption font-medium uppercase tracking-wider text-text-muted">
                {card.label}
              </p>
              <p className="mt-1 text-heading-md font-semibold text-text-primary">
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Books */}
        <div className="card p-6 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-heading-sm text-text-primary">
              Recent Books
            </h2>
            <Link
              href="/author/books"
              className="flex items-center gap-1 text-body-sm font-medium text-brand-primary transition-colors hover:text-brand-primary-hover"
            >
              View All <ArrowRight className="size-4" />
            </Link>
          </div>

          {author.books.length === 0 ? (
            <p className="py-8 text-center text-body-md text-text-muted">
              You haven&apos;t submitted any books yet.
            </p>
          ) : (
            <div className="space-y-3">
              {author.books.map((book) => {
                const status = BOOK_STATUSES.find(
                  (s) => s.value === book.status,
                );
                return (
                  <Link
                    key={book.id}
                    href={`/author/books/${book.id}`}
                    className="flex items-center justify-between rounded-lg border border-border-muted p-4 transition-all hover:border-border hover:shadow-sm"
                  >
                    <div>
                      <p className="text-body-md font-medium text-text-primary">
                        {book.title}
                      </p>
                      <p className="mt-0.5 text-caption text-text-muted">
                        {book.publicationDate
                          ? formatDate(book.publicationDate)
                          : 'Not yet published'}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'badge',
                        colorMap[status?.color ?? 'info'],
                      )}
                    >
                      {status?.label ?? book.status}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Royalty Trend Placeholder */}
          <div className="card p-6">
            <h2 className="mb-4 font-display text-heading-sm text-text-primary">
              Royalty Trends
            </h2>
            <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-border-muted">
              <p className="px-4 text-center text-body-sm text-text-muted">
                Royalty trends chart — coming in Phase 5
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h2 className="mb-4 font-display text-heading-sm text-text-primary">
              Quick Actions
            </h2>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-body-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
                >
                  <action.icon className="size-5 text-text-muted" />
                  {action.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
