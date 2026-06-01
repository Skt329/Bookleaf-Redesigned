'use client';

import { BookCard } from './book-card';
import { EmptyState } from '@/components/shared';
import { BookX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookData {
  id: string;
  bookId: string;
  title: string;
  genre: string;
  mrp: number | null;
  coverImageUrl: string | null;
  author: {
    penName: string | null;
    user: { name: string | null };
  };
}

interface BookGridProps {
  books: BookData[];
  loading?: boolean;
  className?: string;
}

function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-[3/4]" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-6 w-1/3" />
      </div>
    </div>
  );
}

export function BookGrid({ books, loading, className }: BookGridProps) {
  if (loading) {
    return (
      <div
        className={cn(
          'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
          className,
        )}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!books.length) {
    return (
      <EmptyState
        icon={BookX}
        title="No Books Found"
        description="Try adjusting your filters or search query to find what you're looking for."
        action={{ label: 'Browse All Books', href: '/bookstore' }}
      />
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
        className,
      )}
    >
      {books.map((book, i) => (
        <BookCard
          key={book.id}
          bookId={book.bookId}
          title={book.title}
          author={book.author.penName ?? book.author.user.name ?? 'Unknown'}
          genre={book.genre}
          mrp={book.mrp}
          coverImageUrl={book.coverImageUrl}
          index={i}
        />
      ))}
    </div>
  );
}
