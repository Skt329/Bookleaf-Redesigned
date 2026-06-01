import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import {
  ArrowLeft,
  BookOpen,
  Wallet,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Author Detail — BookLeaf Admin',
};

interface Props {
  params: Promise<{ authorId: string }>;
}

export default async function AdminAuthorDetailPage({ params }: Props) {
  const { authorId } = await params;

  const author = await prisma.author.findUnique({
    where: { id: authorId },
    include: {
      user: true,
      books: {
        orderBy: { createdAt: 'desc' },
        select: { id: true, bookId: true, title: true, genre: true, status: true, mrp: true, publicationDate: true },
      },
      royaltyRecords: {
        orderBy: { quarter: 'desc' },
        take: 8,
      },
    },
  });

  if (!author) redirect('/admin/authors');

  const totalRoyalty = author.royaltyRecords.reduce((sum, r) => sum + r.grossRoyalty, 0);
  const totalPaid = author.royaltyRecords.reduce((sum, r) => sum + r.royaltyPaid, 0);
  const totalPending = author.royaltyRecords.reduce((sum, r) => sum + r.royaltyPending, 0);

  return (
    <div className="space-y-6">
      <Link
        href="/admin/authors"
        className="inline-flex items-center gap-2 text-body-sm text-text-secondary hover:text-brand-primary transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to Authors
      </Link>

      {/* Author header */}
      <div className="card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary font-display text-heading-md">
              {author.user.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <h1 className="font-display text-heading-lg text-text-primary">
                {author.user.name}
              </h1>
              <p className="text-body-sm text-text-muted font-mono">{author.authorId}</p>
              {author.penName && author.penName !== author.user.name && (
                <p className="text-body-sm text-text-secondary">Pen name: {author.penName}</p>
              )}
            </div>
          </div>
          <span className={cn(
            'badge px-3 py-1.5',
            author.publishingPackage === 'PROFESSIONAL' ? 'bg-brand-accent/10 text-brand-accent' :
            author.publishingPackage === 'PREMIUM' ? 'bg-brand-primary/10 text-brand-primary' :
            'bg-surface-muted text-text-muted'
          )}>
            {author.publishingPackage || 'No Package'}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-5 text-body-sm text-text-secondary">
          <span className="flex items-center gap-1"><Mail className="size-3.5" />{author.user.email}</span>
          {author.user.phone && <span className="flex items-center gap-1"><Phone className="size-3.5" />{author.user.phone}</span>}
          {author.user.city && <span className="flex items-center gap-1"><MapPin className="size-3.5" />{author.user.city}</span>}
          <span className="flex items-center gap-1"><Calendar className="size-3.5" />Joined {formatDate(author.user.createdAt)}</span>
          {author.user.isVerified && <span className="flex items-center gap-1 text-status-success"><CheckCircle2 className="size-3.5" />Verified</span>}
        </div>

        {author.authorBio && (
          <p className="mt-4 text-body-md text-text-secondary border-t border-border pt-4">
            {author.authorBio}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <BookOpen className="size-5 text-brand-primary" />
            <span className="text-body-sm text-text-muted">Total Books</span>
          </div>
          <p className="mt-2 font-display text-heading-md text-text-primary">{author.books.length}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <Wallet className="size-5 text-status-success" />
            <span className="text-body-sm text-text-muted">Total Royalty</span>
          </div>
          <p className="mt-2 font-display text-heading-md text-text-primary">{formatCurrency(totalRoyalty)}</p>
          <p className="text-caption text-status-success">Paid: {formatCurrency(totalPaid)}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <Wallet className="size-5 text-status-warning" />
            <span className="text-body-sm text-text-muted">Pending</span>
          </div>
          <p className="mt-2 font-display text-heading-md text-text-primary">{formatCurrency(totalPending)}</p>
        </div>
      </div>

      {/* Books */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-display text-heading-sm text-text-primary">Books</h2>
        </div>
        {author.books.length === 0 ? (
          <p className="p-5 text-body-sm text-text-muted text-center">No books yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-surface-muted">
                  <th className="px-5 py-3 text-caption font-semibold uppercase text-text-muted">Title</th>
                  <th className="px-5 py-3 text-caption font-semibold uppercase text-text-muted">Genre</th>
                  <th className="px-5 py-3 text-caption font-semibold uppercase text-text-muted">Status</th>
                  <th className="px-5 py-3 text-caption font-semibold uppercase text-text-muted">MRP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-muted">
                {author.books.map((book) => (
                  <tr key={book.id} className="hover:bg-surface-muted/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/books/${book.id}`} className="text-body-sm font-semibold text-text-primary hover:text-brand-primary">
                        {book.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-body-sm text-text-secondary">{book.genre.replace(/_/g, ' ')}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn('badge text-xs', book.status === 'PUBLISHED' ? 'bg-status-success/10 text-status-success' : 'bg-status-warning/10 text-status-warning')}>
                        {book.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-body-sm text-text-secondary">{book.mrp ? formatCurrency(book.mrp) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
