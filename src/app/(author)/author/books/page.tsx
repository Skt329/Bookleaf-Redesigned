import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { BOOK_STATUSES, GENRES } from '@/constants';
import { BookOpen, Eye } from 'lucide-react';
import { EmptyState } from '@/components/shared';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Books',
  description: 'View and manage all your published and in-progress books.',
};

export default async function AuthorBooksPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const author = await prisma.author.findFirst({
    where: { userId: session.user.id },
    include: {
      books: {
        orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
      },
    },
  });

  if (!author) redirect('/author/dashboard');

  const books = author.books;
  const getGenreLabel = (genre: string) =>
    GENRES.find((g) => g.value === genre)?.label ?? genre;

  const colorMap: Record<string, string> = {
    success: 'bg-status-success/10 text-status-success',
    warning: 'bg-status-warning/10 text-status-warning',
    info: 'bg-status-info/10 text-status-info',
    accent: 'bg-brand-accent/10 text-brand-accent',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-display-sm text-text-primary">
          My Books
        </h1>
        <p className="mt-1 text-body-md text-text-secondary">
          Track the status and details of all your titles.
        </p>
      </div>

      {books.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No Books Yet"
          description="Your submitted books will appear here once they're in our system."
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-surface-muted">
                  <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted">
                    Title
                  </th>
                  <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted">
                    Genre
                  </th>
                  <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted">
                    Status
                  </th>
                  <th className="hidden px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted md:table-cell">
                    Published
                  </th>
                  <th className="hidden px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted sm:table-cell">
                    MRP
                  </th>
                  <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-muted">
                {books.map((book) => {
                  const status = BOOK_STATUSES.find(
                    (s) => s.value === book.status,
                  );
                  return (
                    <tr
                      key={book.id}
                      className="transition-colors hover:bg-surface-muted/50"
                    >
                      <td className="px-5 py-4">
                        <p className="text-body-sm font-medium text-text-primary">
                          {book.title}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-body-sm text-text-secondary">
                        {getGenreLabel(book.genre)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            'badge',
                            colorMap[status?.color ?? 'info'],
                          )}
                        >
                          {status?.label ?? book.status}
                        </span>
                      </td>
                      <td className="hidden px-5 py-4 text-body-sm text-text-secondary md:table-cell">
                        {book.publicationDate
                          ? formatDate(book.publicationDate)
                          : '—'}
                      </td>
                      <td className="hidden px-5 py-4 text-body-sm font-medium text-text-primary sm:table-cell">
                        {book.mrp ? formatCurrency(book.mrp) : '—'}
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={`/author/books/${book.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-caption font-medium text-brand-primary transition-colors hover:bg-brand-primary/5"
                        >
                          <Eye className="size-3.5" />
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
