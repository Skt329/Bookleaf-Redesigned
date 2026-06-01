import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatDate, cn } from '@/lib/utils';
import { EmptyState } from '@/components/shared';
import { Users, Search, BookOpen, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Manage Authors — BookLeaf Admin',
};

export default async function AdminAuthorsPage() {
  const authors = await prisma.author.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true, city: true, createdAt: true, isVerified: true } },
      _count: { select: { books: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-display-sm text-text-primary">Authors</h1>
          <p className="mt-1 text-body-md text-text-secondary">
            {authors.length} registered author{authors.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {authors.length === 0 ? (
        <EmptyState icon={Users} title="No Authors" description="No authors have registered yet." />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-surface-muted">
                  <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted">Author</th>
                  <th className="hidden px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted sm:table-cell">ID</th>
                  <th className="hidden px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted md:table-cell">Package</th>
                  <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted">Books</th>
                  <th className="hidden px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted lg:table-cell">Joined</th>
                  <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-muted">
                {authors.map((author) => (
                  <tr key={author.id} className="transition-colors hover:bg-surface-muted/50">
                    <td className="px-5 py-4">
                      <Link href={`/admin/authors/${author.id}`} className="block">
                        <p className="text-body-sm font-semibold text-text-primary hover:text-brand-primary transition-colors">
                          {author.user.name || author.penName}
                        </p>
                        <p className="text-caption text-text-muted flex items-center gap-1">
                          <Mail className="size-3" />
                          {author.user.email}
                        </p>
                      </Link>
                    </td>
                    <td className="hidden px-5 py-4 text-body-sm font-mono text-text-muted sm:table-cell">
                      {author.authorId}
                    </td>
                    <td className="hidden px-5 py-4 md:table-cell">
                      <span className={cn(
                        'badge text-xs',
                        author.publishingPackage === 'PROFESSIONAL' ? 'bg-brand-accent/10 text-brand-accent' :
                        author.publishingPackage === 'PREMIUM' ? 'bg-brand-primary/10 text-brand-primary' :
                        'bg-surface-muted text-text-muted'
                      )}>
                        {author.publishingPackage || 'None'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1 text-body-sm text-text-secondary">
                        <BookOpen className="size-3.5" />
                        {author._count.books}
                      </span>
                    </td>
                    <td className="hidden px-5 py-4 text-body-sm text-text-muted lg:table-cell">
                      {formatDate(author.user.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn(
                        'badge text-xs',
                        author.user.isVerified ? 'bg-status-success/10 text-status-success' : 'bg-status-warning/10 text-status-warning'
                      )}>
                        {author.user.isVerified ? 'Verified' : 'Pending'}
                      </span>
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
