'use client';

import { useState, useEffect, useCallback } from 'react';
import { ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BookGrid } from '@/components/bookstore/book-grid';
import { BookFilters } from '@/components/bookstore/book-filters';
import { CartDrawer } from '@/components/bookstore/cart-drawer';
import { useCartStore } from '@/lib/stores/cart-store';

/* -----------------------------------------------------------------------
   Types
   ----------------------------------------------------------------------- */

interface BookData {
  id: string;
  bookId: string;
  title: string;
  genre: string;
  description: string | null;
  mrp: number | null;
  coverImageUrl: string | null;
  isFeatured: boolean;
  author: {
    id: string;
    penName: string | null;
    user: { name: string | null };
  };
  platformListings: { platform: string; externalUrl: string | null }[];
}

interface APIResponse {
  success: boolean;
  data: BookData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* -----------------------------------------------------------------------
   Component
   ----------------------------------------------------------------------- */

export function BookstoreCatalog() {
  const [books, setBooks] = useState<BookData[]>([]);
  const [featuredBooks, setFeaturedBooks] = useState<BookData[]>([]);
  const [loading, setLoading] = useState(true);
  const [genre, setGenre] = useState('ALL');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);

  const itemCount = useCartStore((s) => s.getItemCount());

  // Fetch featured books once
  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch('/api/bookstore/books?featured=true&limit=4');
        const json = (await res.json()) as APIResponse;
        if (json.success) {
          setFeaturedBooks(json.data);
        }
      } catch {
        // silently fail for featured
      }
    }
    fetchFeatured();
  }, []);

  // Fetch books with filters
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '12',
        sort,
      });
      if (genre !== 'ALL') params.set('genre', genre);
      if (search) params.set('search', search);

      const res = await fetch(`/api/bookstore/books?${params}`);
      const json = (await res.json()) as APIResponse;

      if (json.success) {
        setBooks(json.data);
        setTotalResults(json.total);
        setTotalPages(json.totalPages);
      }
    } catch (err) {
      console.error('Failed to fetch books:', err);
    } finally {
      setLoading(false);
    }
  }, [genre, search, sort, page]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [genre, search, sort]);

  const clearFilters = useCallback(() => {
    setGenre('ALL');
    setSearch('');
    setSort('newest');
    setPage(1);
  }, []);

  return (
    <>
      {/* Floating cart button */}
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

      {/* Cart drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Featured section */}
      {featuredBooks.length > 0 && !search && genre === 'ALL' && (
        <section
          className="section bg-surface-muted"
          aria-labelledby="featured-heading"
        >
          <div className="container-bookleaf">
            <div className="mb-8">
              <h2
                id="featured-heading"
                className="font-display text-heading-lg md:text-display-sm text-text-primary"
              >
                Featured <span className="text-brand-accent">Books</span>
              </h2>
              <p className="mt-2 text-body-md text-text-secondary font-body">
                Hand-picked titles from our editors
              </p>
            </div>
            <BookGrid books={featuredBooks} />
          </div>
        </section>
      )}

      {/* Main catalog */}
      <section className="section bg-surface-background" aria-labelledby="catalog-heading">
        <div className="container-bookleaf">
          <h2
            id="catalog-heading"
            className="font-display text-heading-lg md:text-display-sm text-text-primary mb-6"
          >
            Browse <span className="text-brand-accent">Collection</span>
          </h2>

          <BookFilters
            genre={genre}
            search={search}
            sort={sort}
            onGenreChange={setGenre}
            onSearchChange={setSearch}
            onSortChange={setSort}
            onClearFilters={clearFilters}
            totalResults={totalResults}
          />

          <div className="mt-8">
            <BookGrid books={books} loading={loading} />
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className={cn(
                  'rounded-lg px-4 py-2 text-body-sm font-body font-medium transition-colors',
                  page <= 1
                    ? 'bg-surface-muted text-text-muted cursor-not-allowed'
                    : 'bg-surface-card border border-border text-text-secondary hover:bg-surface-card-hover',
                )}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  // Show first, last, and pages around current
                  if (p === 1 || p === totalPages) return true;
                  return Math.abs(p - page) <= 2;
                })
                .map((p, i, arr) => {
                  // Insert ellipsis
                  const prev = arr[i - 1];
                  const showEllipsis = prev !== undefined && p - prev > 1;

                  return (
                    <span key={p} className="flex items-center gap-2">
                      {showEllipsis && (
                        <span className="px-2 text-text-muted">…</span>
                      )}
                      <button
                        onClick={() => setPage(p)}
                        className={cn(
                          'flex size-10 items-center justify-center rounded-lg text-body-sm font-body font-medium transition-colors',
                          p === page
                            ? 'bg-brand-primary text-text-inverse'
                            : 'bg-surface-card border border-border text-text-secondary hover:bg-surface-card-hover',
                        )}
                      >
                        {p}
                      </button>
                    </span>
                  );
                })}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className={cn(
                  'rounded-lg px-4 py-2 text-body-sm font-body font-medium transition-colors',
                  page >= totalPages
                    ? 'bg-surface-muted text-text-muted cursor-not-allowed'
                    : 'bg-surface-card border border-border text-text-secondary hover:bg-surface-card-hover',
                )}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
