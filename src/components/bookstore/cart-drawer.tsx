'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  BookOpen,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/lib/stores/cart-store';
import { getGenreGradient } from '@/lib/genre-gradients';

const EASE = [0.25, 0.4, 0, 1] as [number, number, number, number];

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const getTotal = useCartStore((s) => s.getTotal);
  const getItemCount = useCartStore((s) => s.getItemCount);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-modal bg-surface-overlay"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed right-0 top-0 z-modal flex h-full w-full max-w-md flex-col bg-surface-card shadow-xl"
            role="dialog"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-3">
                <ShoppingBag className="size-5 text-brand-primary" />
                <h2 className="font-display text-heading-sm text-text-primary">
                  Your Cart
                </h2>
                {getItemCount() > 0 && (
                  <span className="flex size-6 items-center justify-center rounded-full bg-brand-primary text-text-inverse text-caption font-bold">
                    {getItemCount()}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-text-muted transition-colors hover:bg-surface-muted hover:text-text-primary"
                aria-label="Close cart"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-surface-muted">
                    <ShoppingBag className="size-8 text-text-muted" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-heading-sm text-text-primary">
                    Cart is Empty
                  </h3>
                  <p className="mt-2 text-body-sm text-text-muted font-body">
                    Browse our bookstore and add some books!
                  </p>
                  <button
                    onClick={onClose}
                    className={cn(
                      'mt-6 inline-flex items-center justify-center rounded-lg px-6 py-2.5',
                      'bg-brand-primary text-text-inverse font-medium text-body-sm',
                      'transition-colors hover:bg-brand-primary-hover',
                    )}
                  >
                    Continue Browsing
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.li
                        key={`${item.bookId}-${item.bookType}`}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        className="flex gap-4 rounded-lg border border-border-muted p-3"
                      >
                        {/* Mini cover */}
                        <div
                          className="size-20 shrink-0 rounded-md flex items-center justify-center overflow-hidden"
                          style={{
                            background: item.coverImageUrl
                              ? undefined
                              : getGenreGradient(item.genre),
                          }}
                        >
                          {item.coverImageUrl ? (
                            <img
                              src={item.coverImageUrl}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <BookOpen className="size-8 text-text-inverse/20" strokeWidth={1} />
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-body text-body-sm font-semibold text-text-primary truncate">
                            {item.title}
                          </h4>
                          <p className="text-caption text-text-muted font-body truncate">
                            {item.author}
                          </p>
                          <span className="badge mt-1 bg-surface-muted text-text-muted text-caption">
                            {item.bookType === 'EBOOK' ? 'eBook' : 'Paperback'}
                          </span>

                          <div className="mt-2 flex items-center justify-between">
                            {/* Quantity controls */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() =>
                                  updateQuantity(item.bookId, item.bookType, item.quantity - 1)
                                }
                                className="flex size-7 items-center justify-center rounded-md border border-border text-text-muted transition-colors hover:bg-surface-muted hover:text-text-primary"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="size-3" />
                              </button>
                              <span className="w-8 text-center text-body-sm font-medium text-text-primary font-body">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.bookId, item.bookType, item.quantity + 1)
                                }
                                className="flex size-7 items-center justify-center rounded-md border border-border text-text-muted transition-colors hover:bg-surface-muted hover:text-text-primary"
                                aria-label="Increase quantity"
                              >
                                <Plus className="size-3" />
                              </button>
                            </div>

                            {/* Price + delete */}
                            <div className="flex items-center gap-2">
                              <span className="text-body-sm font-bold text-brand-accent font-display">
                                {formatCurrency(item.mrp * item.quantity)}
                              </span>
                              <button
                                onClick={() => removeItem(item.bookId, item.bookType)}
                                className="text-text-muted hover:text-status-danger transition-colors"
                                aria-label={`Remove ${item.title}`}
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border px-6 py-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-body-md text-text-secondary font-body">
                    Subtotal
                  </span>
                  <span className="text-heading-sm font-display font-bold text-text-primary">
                    {formatCurrency(getTotal())}
                  </span>
                </div>
                <p className="text-caption text-text-muted font-body">
                  Shipping calculated at checkout
                </p>
                <Link
                  href="/bookstore/cart"
                  onClick={onClose}
                  className={cn(
                    'block w-full rounded-lg py-3 text-center',
                    'bg-brand-primary text-text-inverse font-semibold text-body-md',
                    'transition-colors hover:bg-brand-primary-hover no-underline',
                  )}
                >
                  View Cart & Checkout
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
