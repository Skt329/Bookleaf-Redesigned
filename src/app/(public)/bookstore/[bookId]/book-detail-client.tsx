'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  Globe,
  Languages,
  FileText,
  ShoppingCart,
  Check,
  ExternalLink,
  ShoppingBag,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatDate } from '@/lib/utils';
import { getGenreGradient } from '@/lib/genre-gradients';
import { useCartStore } from '@/lib/stores/cart-store';
import { BookGrid } from '@/components/bookstore/book-grid';
import { CartDrawer } from '@/components/bookstore/cart-drawer';
import { SectionWrapper } from '@/components/shared';

const EASE = [0.25, 0.4, 0, 1] as [number, number, number, number];

/* -----------------------------------------------------------------------
   Types
   ----------------------------------------------------------------------- */

interface BookDetailProps {
  book: {
    id: string;
    bookId: string;
    title: string;
    isbn: string | null;
    genre: string;
    genreLabel: string;
    description: string | null;
    coverImageUrl: string | null;
    publicationDate: string | null;
    mrp: number | null;
    language: string;
    pageCount: number | null;
    isEbookAvailable: boolean;
    isPaperbackAvailable: boolean;
    authorName: string;
    authorBio: string | null;
    authorAvatar: string | null;
    platforms: {
      id: string;
      platform: string;
      externalUrl: string | null;
      label: string;
    }[];
  };
  relatedBooks: {
    id: string;
    bookId: string;
    title: string;
    genre: string;
    coverImageUrl: string | null;
    mrp: number | null;
    author: {
      penName: string | null;
      user: { name: string | null };
    };
  }[];
}

/* -----------------------------------------------------------------------
   Component
   ----------------------------------------------------------------------- */

export function BookDetailClient({ book, relatedBooks }: BookDetailProps) {
  const [selectedFormat, setSelectedFormat] = useState<'PAPERBACK' | 'EBOOK'>(
    book.isPaperbackAvailable ? 'PAPERBACK' : 'EBOOK',
  );
  const [added, setAdded] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const itemCount = useCartStore((s) => s.getItemCount());

  const handleAddToCart = () => {
    addItem({
      bookId: book.bookId,
      title: book.title,
      author: book.authorName,
      mrp: book.mrp ?? 0,
      coverImageUrl: book.coverImageUrl,
      bookType: selectedFormat,
      genre: book.genre,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      {/* Floating cart */}
      <button
        onClick={() => setCartOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-sticky flex items-center gap-2 rounded-full px-5 py-3',
          'bg-brand-primary text-text-inverse shadow-lg',
          'transition-all duration-300 hover:bg-brand-primary-hover hover:shadow-xl hover:scale-105',
        )}
        aria-label="Open cart"
      >
        <ShoppingBag className="size-5" />
        {itemCount > 0 && (
          <span className="flex size-5 items-center justify-center rounded-full bg-brand-accent text-brand-dark text-caption font-bold">
            {itemCount}
          </span>
        )}
      </button>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Book detail */}
      <section className="section bg-surface-background">
        <div className="container-bookleaf">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Left: Cover */}
            <SectionWrapper direction="left">
              <div className="sticky top-24">
                <div
                  className="relative aspect-[3/4] w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-xl flex items-center justify-center"
                  style={{
                    background: book.coverImageUrl
                      ? undefined
                      : getGenreGradient(book.genre),
                  }}
                >
                  {book.coverImageUrl ? (
                    <img
                      src={book.coverImageUrl}
                      alt={`Cover of ${book.title}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <BookOpen className="size-24 text-text-inverse/20" strokeWidth={0.75} />
                      <span className="text-text-inverse/40 font-display text-heading-lg text-center px-6">
                        {book.title}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </SectionWrapper>

            {/* Right: Details */}
            <SectionWrapper direction="right" delay={0.1}>
              <div className="space-y-6">
                {/* Genre badge */}
                <span className="badge bg-brand-accent/15 text-brand-accent text-caption font-semibold">
                  {book.genreLabel}
                </span>

                {/* Title */}
                <h1 className="font-display text-display-sm md:text-display-md text-text-primary">
                  {book.title}
                </h1>

                {/* Author */}
                <p className="text-body-lg text-text-secondary font-body">
                  by <span className="font-medium text-text-primary">{book.authorName}</span>
                </p>

                {/* Price */}
                {book.mrp && (
                  <p className="font-display text-display-sm text-brand-accent font-bold">
                    {formatCurrency(book.mrp)}
                  </p>
                )}

                {/* Format selector */}
                <div className="space-y-2">
                  <label className="text-body-sm font-medium text-text-secondary font-body">
                    Format
                  </label>
                  <div className="flex gap-3">
                    {book.isPaperbackAvailable && (
                      <button
                        onClick={() => setSelectedFormat('PAPERBACK')}
                        className={cn(
                          'rounded-lg border px-5 py-2.5 text-body-sm font-body font-medium transition-all',
                          selectedFormat === 'PAPERBACK'
                            ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                            : 'border-border text-text-secondary hover:border-border-focus',
                        )}
                      >
                        📖 Paperback
                      </button>
                    )}
                    {book.isEbookAvailable && (
                      <button
                        onClick={() => setSelectedFormat('EBOOK')}
                        className={cn(
                          'rounded-lg border px-5 py-2.5 text-body-sm font-body font-medium transition-all',
                          selectedFormat === 'EBOOK'
                            ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                            : 'border-border text-text-secondary hover:border-border-focus',
                        )}
                      >
                        📱 eBook
                      </button>
                    )}
                  </div>
                </div>

                {/* Add to cart */}
                <motion.button
                  onClick={handleAddToCart}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    'flex w-full items-center justify-center gap-2 rounded-lg py-3.5',
                    'font-semibold text-body-md transition-all duration-300',
                    added
                      ? 'bg-status-success text-text-inverse'
                      : 'bg-brand-primary text-text-inverse hover:bg-brand-primary-hover shadow-md hover:shadow-lg',
                  )}
                  disabled={!book.mrp}
                >
                  {added ? (
                    <>
                      <Check className="size-5" />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="size-5" />
                      Add to Cart
                    </>
                  )}
                </motion.button>

                {/* Description */}
                {book.description && (
                  <div className="space-y-2 pt-4 border-t border-border">
                    <h2 className="font-display text-heading-sm text-text-primary">
                      About This Book
                    </h2>
                    <p className="text-body-md text-text-secondary font-body leading-relaxed whitespace-pre-line">
                      {book.description}
                    </p>
                  </div>
                )}

                {/* Book details grid */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  {book.publicationDate && (
                    <div className="flex items-center gap-3">
                      <Calendar className="size-4 text-text-muted shrink-0" />
                      <div>
                        <p className="text-caption text-text-muted font-body">Published</p>
                        <p className="text-body-sm text-text-primary font-body font-medium">
                          {formatDate(book.publicationDate)}
                        </p>
                      </div>
                    </div>
                  )}
                  {book.pageCount && (
                    <div className="flex items-center gap-3">
                      <FileText className="size-4 text-text-muted shrink-0" />
                      <div>
                        <p className="text-caption text-text-muted font-body">Pages</p>
                        <p className="text-body-sm text-text-primary font-body font-medium">
                          {book.pageCount}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Languages className="size-4 text-text-muted shrink-0" />
                    <div>
                      <p className="text-caption text-text-muted font-body">Language</p>
                      <p className="text-body-sm text-text-primary font-body font-medium">
                        {book.language === 'HINDI' ? 'Hindi' : 'English'}
                      </p>
                    </div>
                  </div>
                  {book.isbn && (
                    <div className="flex items-center gap-3">
                      <Globe className="size-4 text-text-muted shrink-0" />
                      <div>
                        <p className="text-caption text-text-muted font-body">ISBN</p>
                        <p className="text-body-sm text-text-primary font-body font-medium">
                          {book.isbn}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Platform links */}
                {book.platforms.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-border">
                    <h3 className="text-body-sm font-medium text-text-secondary font-body">
                      Also available on
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {book.platforms.map((pl) => (
                        <a
                          key={pl.id}
                          href={pl.externalUrl ?? '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            'inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2',
                            'text-body-sm font-body text-text-secondary no-underline',
                            'transition-colors hover:border-brand-primary hover:text-brand-primary',
                          )}
                        >
                          <ExternalLink className="size-3.5" />
                          {pl.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </SectionWrapper>
          </div>
        </div>
      </section>

      {/* Related books */}
      {relatedBooks.length > 0 && (
        <section
          className="section bg-surface-muted"
          aria-labelledby="related-heading"
        >
          <div className="container-bookleaf">
            <h2
              id="related-heading"
              className="font-display text-heading-lg md:text-display-sm text-text-primary mb-8"
            >
              You Might Also <span className="text-brand-accent">Like</span>
            </h2>
            <BookGrid books={relatedBooks} />
          </div>
        </section>
      )}
    </>
  );
}
