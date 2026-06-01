'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_LINKS_PUBLIC } from '@/constants';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-100 bg-surface-background/95 backdrop-blur-md border-b border-border">
      <nav
        className="container-bookleaf flex items-center justify-between h-16 md:h-18"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-brand-primary no-underline"
          aria-label="BookLeaf Publishing — Home"
        >
          <BookOpen className="h-7 w-7" strokeWidth={1.8} />
          <span className="font-display text-heading-sm font-bold tracking-tight">
            BookLeaf
          </span>
        </Link>

        <ul className="hidden lg:flex items-center gap-6">
          {NAV_LINKS_PUBLIC.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-body-sm font-medium text-text-secondary hover:text-brand-primary transition-colors duration-150"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/login"
            className="text-body-sm font-medium text-text-secondary hover:text-brand-primary transition-colors duration-150"
          >
            Log in
          </Link>
          <Link
            href="/get-published"
            className="inline-flex items-center px-5 py-2 rounded-lg bg-brand-accent text-brand-dark font-semibold text-body-sm hover:bg-brand-accent-hover transition-colors duration-150"
          >
            Publish Now
          </Link>
        </div>

        <button
          type="button"
          className="lg:hidden p-2 text-text-primary"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden border-t border-border bg-surface-background"
          >
            <ul className="container-bookleaf flex flex-col gap-1 py-4">
              {NAV_LINKS_PUBLIC.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2.5 text-body-md text-text-secondary hover:text-brand-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="mt-3 flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center py-2.5 rounded-lg border border-border text-text-primary font-medium text-body-md"
                >
                  Log in
                </Link>
                <Link
                  href="/get-published"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center py-2.5 rounded-lg bg-brand-accent text-brand-dark font-semibold text-body-md"
                >
                  Publish Now
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
