import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ---------------------------------------------------------------------------
// Class names
// ---------------------------------------------------------------------------

/**
 * Merge Tailwind CSS class names intelligently.
 *
 * Combines `clsx` (conditional classes) with `tailwind-merge` (deduplication
 * of conflicting utilities) so the last class always wins.
 *
 * @example
 * ```ts
 * cn('px-4 py-2', isActive && 'bg-primary text-primary-foreground')
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------------------------------------
// Currency
// ---------------------------------------------------------------------------

/**
 * Format an integer amount in **paise** to a human-readable INR string.
 *
 * Uses the Indian numbering system (lakhs / crores) via `Intl.NumberFormat`.
 *
 * @param paise - Amount in paise (e.g. 12345600 → ₹1,23,456).
 *
 * @example
 * ```ts
 * formatCurrency(12345600) // '₹1,23,456.00'
 * formatCurrency(50000)    // '₹500.00'
 * ```
 */
export function formatCurrency(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rupees);
}

// ---------------------------------------------------------------------------
// Dates
// ---------------------------------------------------------------------------

/**
 * Format a `Date` or ISO string into a readable date.
 *
 * @param date - A `Date` object or ISO-8601 string.
 * @returns E.g. `"1 Jun 2026"`
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

// ---------------------------------------------------------------------------
// Identifiers
// ---------------------------------------------------------------------------

/**
 * Generate a support ticket number in the format `TKT-YYYY-NNNN`.
 *
 * The numeric suffix is a random 4-digit value; uniqueness should be
 * enforced at the database level.
 */
export function generateTicketNumber(): string {
  const year = new Date().getFullYear();
  const seq = Math.floor(1000 + Math.random() * 9000);
  return `TKT-${year}-${seq}`;
}

/**
 * Generate an order number in the format `BL-YYYY-NNNNNN`.
 *
 * The numeric suffix is a random 6-digit value; uniqueness should be
 * enforced at the database level.
 */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const seq = Math.floor(100000 + Math.random() * 900000);
  return `BL-${year}-${seq}`;
}

// ---------------------------------------------------------------------------
// Async helpers
// ---------------------------------------------------------------------------

/**
 * Promise-based delay.
 *
 * @param ms - Milliseconds to wait.
 *
 * @example
 * ```ts
 * await sleep(1000); // wait 1 second
 * ```
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Strings
// ---------------------------------------------------------------------------

/**
 * Truncate a string to `length` characters, appending an ellipsis if trimmed.
 *
 * @param str    - The input string.
 * @param length - Maximum character count (including the ellipsis).
 *
 * @example
 * ```ts
 * truncate('Hello World', 8) // 'Hello…'
 * ```
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return `${str.slice(0, length - 1)}…`;
}
