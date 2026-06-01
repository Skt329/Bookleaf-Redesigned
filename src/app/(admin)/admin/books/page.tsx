import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatDate, formatCurrency, cn } from '@/lib/utils';
import { EmptyState } from '@/components/shared';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Manage Books — BookLeaf Admin',
};

const statusColors: Record<string, string> = {
  PUBLISHED: 'bg-status-success/10 text-status-success',
  EDITING: 'bg-status-info/10 text-status-info',
  COVER_DESIGN: 'bg-brand-accent/10 text-brand-accent',
  TYPESETTING: 'bg-brand-primary/10 text-brand-primary',
  PROOFREADING: 'bg-status-warning/10 text-status-warning',
  ISBN_ASSIGNMENT: 'bg-brand-primary/10 text-brand-primary',
  PRINTING: 'bg-status-info/10 text-status-info',
  DISTRIBUTION_SETUP: 'bg-brand-accent/10 text-brand-accent',
  MANUSCRIPT_RECEIVED: 'bg-surface-muted text-text-muted',
};

export default async function AdminBooksPage() {
  const books = await prisma.book.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: { include: { user: { select: { name: true } } } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-display-sm text-text-primary">Books</h1>
        <p className="mt-1 text-body-md text-text-secondary">
          {books.length} total book{books.length !== 1 ? 's' : ''} across all authors
        </p>
      </div>

      {books.length === 0 ? (
        <EmptyState icon={BookOpen} title="No Books" description="No books have been submitted yet." />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-surface-muted">
                  <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted">Title</th>
                  <th className="hidden px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted sm:table-cell">Author</th>
                  <th className="hidden px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted md:table-cell">Genre</th>
                  <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted">Status</th>
                  <th className="hidden px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted lg:table-cell">MRP</th>
                  <th className="hidden px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted lg:table-cell">Published</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-muted">
                {books.map((book) => (
                  <tr key={book.id} className="transition-colors hover:bg-surface-muted/50">
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/books/${book.id}`}
                        className="text-body-sm font-semibold text-text-primary hover:text-brand-primary transition-colors"
                      >
                        {book.title}
                      </Link>
                      <p className="text-caption text-text-muted font-mono">{book.bookId}</p>
                    </td>
                    <td className="hidden px-5 py-4 text-body-sm text-text-secondary sm:table-cell">
                      {book.author.user.name}
                    </td>
                    <td className="hidden px-5 py-4 text-body-sm text-text-secondary md:table-cell">
                      {book.genre.replace(/_/g, ' ')}
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn('badge text-xs', statusColors[book.status] || 'bg-surface-muted text-text-muted')}>
                        {book.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="hidden px-5 py-4 text-body-sm text-text-secondary lg:table-cell">
                      {book.mrp ? formatCurrency(book.mrp) : '—'}
                    </td>
                    <td className="hidden px-5 py-4 text-body-sm text-text-muted lg:table-cell">
                      {book.publicationDate ? formatDate(book.publicationDate) : '—'}
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
