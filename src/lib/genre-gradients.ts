/**
 * Genre-to-gradient mapping for book cover placeholders.
 *
 * Returns a CSS gradient string based on the genre.
 * Each genre gets a unique, visually appealing gradient.
 */

const GENRE_GRADIENTS: Record<string, string> = {
  POETRY: 'linear-gradient(135deg, #7c3aed 0%, #db2777 50%, #f472b6 100%)',
  THRILLER: 'linear-gradient(135deg, #1e1b4b 0%, #7f1d1d 50%, #991b1b 100%)',
  ROMANCE: 'linear-gradient(135deg, #be185d 0%, #f43f5e 50%, #fda4af 100%)',
  BUSINESS: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 50%, #3b82f6 100%)',
  LITERARY_FICTION: 'linear-gradient(135deg, #1a3c2e 0%, #2d6b50 50%, #4ebb82 100%)',
  NON_FICTION: 'linear-gradient(135deg, #1c1917 0%, #78716c 50%, #a8a29e 100%)',
  SELF_HELP: 'linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #fdba74 100%)',
  HISTORICAL_FICTION: 'linear-gradient(135deg, #78350f 0%, #92400e 50%, #d4a373 100%)',
  TRAVEL: 'linear-gradient(135deg, #0e7490 0%, #06b6d4 50%, #67e8f9 100%)',
  MEMOIR: 'linear-gradient(135deg, #4a1d96 0%, #7c3aed 50%, #c4b5fd 100%)',
  HUMOR: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fde68a 100%)',
  PARENTING: 'linear-gradient(135deg, #059669 0%, #34d399 50%, #a7f3d0 100%)',
  CRIME: 'linear-gradient(135deg, #0f172a 0%, #334155 50%, #64748b 100%)',
  CONTEMPORARY_FICTION: 'linear-gradient(135deg, #312e81 0%, #6366f1 50%, #a5b4fc 100%)',
  URDU_LITERATURE: 'linear-gradient(135deg, #831843 0%, #c026d3 50%, #e879f9 100%)',
  OTHER: 'linear-gradient(135deg, #374151 0%, #6b7280 50%, #d1d5db 100%)',
};

/**
 * Get a CSS gradient string based on the book genre.
 *
 * @param genre - The genre enum value (e.g. 'POETRY', 'THRILLER')
 * @returns A CSS linear-gradient string
 */
export function getGenreGradient(genre: string): string {
  return GENRE_GRADIENTS[genre] ?? GENRE_GRADIENTS.OTHER;
}

/**
 * Get a Tailwind-compatible gradient class based on genre.
 * Used for overlay effects and badges.
 */
export function getGenreBadgeColor(genre: string): {
  bg: string;
  text: string;
} {
  const map: Record<string, { bg: string; text: string }> = {
    POETRY: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300' },
    THRILLER: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300' },
    ROMANCE: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-300' },
    BUSINESS: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
    LITERARY_FICTION: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300' },
    NON_FICTION: { bg: 'bg-stone-100 dark:bg-stone-900/30', text: 'text-stone-700 dark:text-stone-300' },
    SELF_HELP: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300' },
    HISTORICAL_FICTION: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300' },
    TRAVEL: { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-700 dark:text-cyan-300' },
    MEMOIR: { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-700 dark:text-violet-300' },
    HUMOR: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300' },
    PARENTING: { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-700 dark:text-teal-300' },
    CRIME: { bg: 'bg-slate-100 dark:bg-slate-900/30', text: 'text-slate-700 dark:text-slate-300' },
    CONTEMPORARY_FICTION: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-300' },
    URDU_LITERATURE: { bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/30', text: 'text-fuchsia-700 dark:text-fuchsia-300' },
  };

  return map[genre] ?? { bg: 'bg-surface-muted', text: 'text-text-secondary' };
}
