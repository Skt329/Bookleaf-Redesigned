'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GENRES } from '@/constants';
import { motion, AnimatePresence } from 'framer-motion';

const EASE = [0.25, 0.4, 0, 1] as [number, number, number, number];

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low → High', value: 'price-asc' },
  { label: 'Price: High → Low', value: 'price-desc' },
  { label: 'Title: A → Z', value: 'title-asc' },
] as const;

interface BookFiltersProps {
  genre: string;
  search: string;
  sort: string;
  onGenreChange: (genre: string) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
  totalResults: number;
}

export function BookFilters({
  genre,
  search,
  sort,
  onGenreChange,
  onSearchChange,
  onSortChange,
  onClearFilters,
  totalResults,
}: BookFiltersProps) {
  const [localSearch, setLocalSearch] = useState(search);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Debounced search
  const handleSearchInput = useCallback(
    (value: string) => {
      setLocalSearch(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onSearchChange(value);
      }, 300);
    },
    [onSearchChange],
  );

  // Sync external search changes
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Close sort dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const hasActiveFilters = genre !== 'ALL' || search.length > 0;
  const currentSort = SORT_OPTIONS.find((s) => s.value === sort) ?? SORT_OPTIONS[0];

  const allGenres = [{ label: 'All Genres', value: 'ALL' }, ...GENRES];

  return (
    <div className="space-y-4">
      {/* Top bar: Search + Sort + Mobile toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => handleSearchInput(e.target.value)}
            placeholder="Search books, authors..."
            className={cn(
              'w-full rounded-lg border border-border bg-surface-card py-2.5 pl-10 pr-10',
              'text-body-sm font-body text-text-primary placeholder:text-text-muted',
              'transition-colors focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-brand-primary/20',
            )}
            aria-label="Search books"
          />
          {localSearch && (
            <button
              onClick={() => handleSearchInput('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Sort dropdown */}
          <div ref={sortRef} className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className={cn(
                'flex items-center gap-2 rounded-lg border border-border bg-surface-card px-4 py-2.5',
                'text-body-sm font-body text-text-secondary',
                'transition-colors hover:border-border-focus',
              )}
              aria-label="Sort books"
            >
              {currentSort.label}
              <ChevronDown className={cn('size-4 transition-transform', sortOpen && 'rotate-180')} />
            </button>

            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  className="absolute right-0 top-full z-dropdown mt-2 w-48 rounded-lg border border-border bg-surface-card shadow-lg overflow-hidden"
                >
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onSortChange(option.value);
                        setSortOpen(false);
                      }}
                      className={cn(
                        'block w-full px-4 py-2.5 text-left text-body-sm font-body transition-colors',
                        sort === option.value
                          ? 'bg-brand-primary/10 text-brand-primary font-medium'
                          : 'text-text-secondary hover:bg-surface-muted',
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-4 py-2.5 lg:hidden',
              'text-body-sm font-body transition-colors',
              mobileFiltersOpen
                ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                : 'border-border bg-surface-card text-text-secondary hover:border-border-focus',
            )}
            aria-label="Toggle filters"
          >
            <SlidersHorizontal className="size-4" />
            Filters
            {hasActiveFilters && (
              <span className="flex size-5 items-center justify-center rounded-full bg-brand-primary text-text-inverse text-caption font-bold">
                !
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Genre pills — desktop always visible, mobile toggle */}
      <AnimatePresence>
        {(mobileFiltersOpen || true) && (
          <motion.div
            initial={false}
            className={cn(
              'flex-wrap gap-2',
              mobileFiltersOpen ? 'flex' : 'hidden lg:flex',
            )}
          >
            {allGenres.map((g) => (
              <button
                key={g.value}
                onClick={() => onGenreChange(g.value)}
                className={cn(
                  'rounded-full px-4 py-1.5 text-caption font-medium font-body transition-all duration-200',
                  genre === g.value
                    ? 'bg-brand-primary text-text-inverse shadow-sm'
                    : 'bg-surface-muted text-text-secondary hover:bg-surface-card-hover hover:text-text-primary border border-border-muted',
                )}
              >
                {g.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filters summary */}
      <div className="flex items-center justify-between">
        <p className="text-body-sm text-text-muted font-body">
          {totalResults} book{totalResults !== 1 ? 's' : ''} found
        </p>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-body-sm text-brand-primary font-medium font-body hover:underline transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}
