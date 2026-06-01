import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { ArrowLeft, BookOpen, User, Globe, CheckCircle2, Clock } from 'lucide-react';
import { StatusUpdater } from './status-updater';

export const metadata: Metadata = { title: 'Book Detail — BookLeaf Admin' };

const STEPS = [
  'MANUSCRIPT_RECEIVED', 'EDITING', 'COVER_DESIGN', 'TYPESETTING',
  'PROOFREADING', 'ISBN_ASSIGNMENT', 'PRINTING', 'DISTRIBUTION_SETUP', 'PUBLISHED',
];

interface Props { params: Promise<{ bookId: string }> }

export default async function AdminBookDetailPage({ params }: Props) {
  const { bookId } = await params;

  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: {
      author: { include: { user: { select: { name: true, email: true } } } },
      platformListings: true,
    },
  });

  if (!book) redirect('/admin/books');

  const currentIdx = STEPS.indexOf(book.status);

  return (
    <div className="space-y-6">
      <Link href="/admin/books" className="inline-flex items-center gap-2 text-body-sm text-text-secondary hover:text-brand-primary transition-colors">
        <ArrowLeft className="size-4" /> Back to Books
      </Link>

      {/* Header */}
      <div className="card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-caption text-text-muted font-mono">{book.bookId}</p>
            <h1 className="font-display text-heading-lg text-text-primary">{book.title}</h1>
            <p className="mt-1 text-body-md text-text-secondary flex items-center gap-2">
              <User className="size-4" /> {book.author.user.name} · {book.genre.replace(/_/g, ' ')}
            </p>
          </div>
          <StatusUpdater bookId={book.id} currentStatus={book.status} />
        </div>

        {book.description && (
          <p className="mt-4 text-body-md text-text-secondary border-t border-border pt-4">{book.description}</p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 text-body-sm">
          <div><span className="text-text-muted">MRP</span><p className="font-semibold text-text-primary">{book.mrp ? formatCurrency(book.mrp) : '—'}</p></div>
          <div><span className="text-text-muted">Pages</span><p className="font-semibold text-text-primary">{book.pageCount || '—'}</p></div>
          <div><span className="text-text-muted">Language</span><p className="font-semibold text-text-primary">{book.language}</p></div>
          <div><span className="text-text-muted">Published</span><p className="font-semibold text-text-primary">{book.publicationDate ? formatDate(book.publicationDate) : '—'}</p></div>
        </div>
      </div>

      {/* Status stepper */}
      <div className="card p-6">
        <h2 className="font-display text-heading-sm text-text-primary mb-6">Publishing Pipeline</h2>
        <div className="flex flex-wrap gap-2">
          {STEPS.map((step, idx) => (
            <div key={step} className={cn(
              'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
              idx < currentIdx ? 'bg-status-success/10 text-status-success' :
              idx === currentIdx ? 'bg-brand-accent/15 text-brand-accent ring-2 ring-brand-accent/30' :
              'bg-surface-muted text-text-muted'
            )}>
              {idx < currentIdx ? <CheckCircle2 className="size-3.5" /> :
               idx === currentIdx ? <Clock className="size-3.5 animate-pulse" /> : null}
              {step.replace(/_/g, ' ')}
            </div>
          ))}
        </div>
      </div>

      {/* Platform listings */}
      {book.platformListings.length > 0 && (
        <div className="card p-6">
          <h2 className="font-display text-heading-sm text-text-primary mb-4">Platform Listings</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {book.platformListings.map((pl) => (
              <div key={pl.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <span className="flex items-center gap-2 text-body-sm font-medium text-text-primary">
                  <Globe className="size-4 text-brand-primary" />
                  {pl.platform.replace(/_/g, ' ')}
                </span>
                <span className={cn('badge text-xs', pl.isActive ? 'bg-status-success/10 text-status-success' : 'bg-surface-muted text-text-muted')}>
                  {pl.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
