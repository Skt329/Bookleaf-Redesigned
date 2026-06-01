import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { BOOK_STATUSES, GENRES, PLATFORMS } from '@/constants';
import { ArrowLeft, ExternalLink, Check } from 'lucide-react';

import type { Metadata } from 'next';

interface BookDetailPageProps {
  params: Promise<{ bookId: string }>;
}

export async function generateMetadata({
  params,
}: BookDetailPageProps): Promise<Metadata> {
  const { bookId } = await params;
  const book = await prisma.book.findUnique({
    where: { id: bookId },
    select: { title: true },
  });
  return {
    title: book?.title ?? 'Book Details',
    description: `View details, status, and royalties for ${book?.title ?? 'this book'}.`,
  };
}

/** The 9-step lifecycle (excluding WRITING_CHALLENGE_IN_PROGRESS) */
const LIFECYCLE_STEPS = BOOK_STATUSES.filter(
  (s) => s.value !== 'WRITING_CHALLENGE_IN_PROGRESS',
);

export default async function BookDetailPage({
  params,
}: BookDetailPageProps) {
  const { bookId } = await params;
  const session = await auth();
  if (!session?.user) redirect('/login');

  const author = await prisma.author.findFirst({
    where: { userId: session.user.id },
  });
  if (!author) redirect('/author/dashboard');

  const book = await prisma.book.findFirst({
    where: { id: bookId, authorId: author.id },
    include: {
      platformListings: true,
      royaltyRecords: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!book) notFound();

  const genreLabel =
    GENRES.find((g) => g.value === book.genre)?.label ?? book.genre;
  const currentStepIndex = LIFECYCLE_STEPS.findIndex(
    (s) => s.value === book.status,
  );

  const totalGross = book.royaltyRecords.reduce(
    (sum, r) => sum + r.grossRoyalty,
    0,
  );
  const totalPaid = book.royaltyRecords.reduce(
    (sum, r) => sum + r.royaltyPaid,
    0,
  );
  const totalPending = book.royaltyRecords.reduce(
    (sum, r) => sum + r.royaltyPending,
    0,
  );

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href="/author/books"
        className="inline-flex items-center gap-1.5 text-body-sm font-medium text-text-muted transition-colors hover:text-text-primary"
      >
        <ArrowLeft className="size-4" /> Back to My Books
      </Link>

      {/* Header */}
      <div>
        <h1 className="font-display text-display-sm text-text-primary">
          {book.title}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-body-sm text-text-secondary">
          <span>{genreLabel}</span>
          <span className="text-border">•</span>
          {book.isbn && <span>ISBN: {book.isbn}</span>}
          {book.isbn && <span className="text-border">•</span>}
          <span>
            {book.pageCount ? `${book.pageCount} pages` : 'Page count TBD'}
          </span>
        </div>
      </div>

      {/* Book Info Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="card space-y-4 p-6">
          <h2 className="font-display text-heading-sm text-text-primary">
            Book Details
          </h2>
          <dl className="space-y-3">
            {(
              [
                [
                  'Status',
                  BOOK_STATUSES.find((s) => s.value === book.status)?.label ??
                    book.status,
                ],
                ['MRP', book.mrp ? formatCurrency(book.mrp) : 'Not set'],
                ['Language', book.language],
                [
                  'Publication Date',
                  book.publicationDate
                    ? formatDate(book.publicationDate)
                    : 'Pending',
                ],
                ['Print Partner', book.printPartner ?? 'Not assigned'],
              ] as const
            ).map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between border-b border-border-muted pb-2 last:border-0"
              >
                <dt className="text-body-sm text-text-muted">{label}</dt>
                <dd className="text-body-sm font-medium text-text-primary">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {book.description && (
          <div className="card p-6">
            <h2 className="mb-3 font-display text-heading-sm text-text-primary">
              Description
            </h2>
            <p className="text-body-md leading-relaxed text-text-secondary">
              {book.description}
            </p>
          </div>
        )}
      </div>

      {/* Status Stepper */}
      <div className="card p-6">
        <h2 className="mb-6 font-display text-heading-sm text-text-primary">
          Publishing Progress
        </h2>
        <div className="relative">
          {/* Connection line */}
          <div className="absolute bottom-5 left-5 top-5 hidden w-0.5 bg-border-muted sm:block" />

          <div className="space-y-4 sm:grid sm:grid-cols-1 sm:gap-0 sm:space-y-0">
            {LIFECYCLE_STEPS.map((step, idx) => {
              const isCompleted = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const isFuture = idx > currentStepIndex;

              return (
                <div
                  key={step.value}
                  className="relative flex items-center gap-4 py-3 sm:pl-0"
                >
                  {/* Step circle */}
                  <div
                    className={cn(
                      'relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                      isCompleted && 'border-status-success bg-status-success',
                      isCurrent &&
                        'animate-pulse-soft border-brand-accent bg-brand-accent',
                      isFuture && 'border-border-muted bg-surface-muted',
                    )}
                  >
                    {isCompleted ? (
                      <Check className="size-5 text-text-inverse" />
                    ) : (
                      <span
                        className={cn(
                          'text-caption font-bold',
                          isCurrent ? 'text-text-inverse' : 'text-text-muted',
                        )}
                      >
                        {idx + 1}
                      </span>
                    )}
                  </div>

                  {/* Step label */}
                  <div>
                    <p
                      className={cn(
                        'text-body-sm font-medium',
                        isCompleted && 'text-status-success',
                        isCurrent && 'font-semibold text-brand-accent',
                        isFuture && 'text-text-muted',
                      )}
                    >
                      {step.label}
                    </p>
                    {isCurrent && (
                      <p className="mt-0.5 text-caption text-text-muted">
                        Current stage
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Platform Listings */}
      {book.platformListings.length > 0 && (
        <div className="card p-6">
          <h2 className="mb-4 font-display text-heading-sm text-text-primary">
            Platform Listings
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {book.platformListings.map((listing) => {
              const platform = PLATFORMS.find(
                (p) => p.value === listing.platform,
              );
              return (
                <div
                  key={listing.id}
                  className="flex items-center justify-between rounded-lg border border-border-muted p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'size-2 rounded-full',
                        listing.isActive
                          ? 'bg-status-success'
                          : 'bg-text-muted',
                      )}
                    />
                    <span className="text-body-sm font-medium text-text-primary">
                      {platform?.label ?? listing.platform}
                    </span>
                  </div>
                  {listing.externalUrl && (
                    <a
                      href={listing.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted transition-colors hover:text-brand-primary"
                    >
                      <ExternalLink className="size-4" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Royalty Summary */}
      <div className="card p-6">
        <h2 className="mb-4 font-display text-heading-sm text-text-primary">
          Royalty Summary
        </h2>
        {book.royaltyRecords.length === 0 ? (
          <p className="py-4 text-center text-body-md text-text-muted">
            No royalty records available yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-status-success/10 p-4 text-center">
              <p className="text-caption font-medium uppercase tracking-wider text-text-muted">
                Gross Earned
              </p>
              <p className="mt-1 text-heading-md font-semibold text-status-success">
                {formatCurrency(totalGross)}
              </p>
            </div>
            <div className="rounded-lg bg-brand-primary/10 p-4 text-center">
              <p className="text-caption font-medium uppercase tracking-wider text-text-muted">
                Paid Out
              </p>
              <p className="mt-1 text-heading-md font-semibold text-brand-primary">
                {formatCurrency(totalPaid)}
              </p>
            </div>
            <div className="rounded-lg bg-status-warning/10 p-4 text-center">
              <p className="text-caption font-medium uppercase tracking-wider text-text-muted">
                Pending
              </p>
              <p className="mt-1 text-heading-md font-semibold text-status-warning">
                {formatCurrency(totalPending)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
