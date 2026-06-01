'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Minus,
  Plus,
  Trash2,
  BookOpen,
  ShoppingBag,
  ArrowLeft,
  CreditCard,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/lib/stores/cart-store';
import { getGenreGradient } from '@/lib/genre-gradients';
import { EmptyState } from '@/components/shared';

const EASE = [0.25, 0.4, 0, 1] as [number, number, number, number];

export function CartPageClient() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const getTotal = useCartStore((s) => s.getTotal);
  const getItemCount = useCartStore((s) => s.getItemCount);

  // Hydration guard
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <section className="section bg-surface-background">
        <div className="container-bookleaf">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton h-28 rounded-xl" />
              ))}
            </div>
            <div className="skeleton h-64 rounded-xl" />
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="section bg-surface-background">
        <div className="container-bookleaf">
          <EmptyState
            icon={ShoppingBag}
            title="Your Cart is Empty"
            description="Browse our bookstore and discover amazing books from independent Indian authors."
            action={{ label: 'Browse Bookstore', href: '/bookstore' }}
          />
        </div>
      </section>
    );
  }

  const subtotal = getTotal();
  const shipping = 0; // free for now
  const total = subtotal + shipping;

  return (
    <section className="section bg-surface-background">
      <div className="container-bookleaf">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Table header — desktop only */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-caption text-text-muted font-body font-medium uppercase tracking-wider">
              <span className="col-span-6">Product</span>
              <span className="col-span-2 text-center">Quantity</span>
              <span className="col-span-2 text-right">Price</span>
              <span className="col-span-2 text-right">Total</span>
            </div>

            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={`${item.bookId}-${item.bookType}`}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="card p-4 md:grid md:grid-cols-12 md:items-center md:gap-4"
                >
                  {/* Product info */}
                  <div className="col-span-6 flex gap-4">
                    <div
                      className="size-20 shrink-0 rounded-lg flex items-center justify-center overflow-hidden"
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
                    <div className="min-w-0">
                      <Link
                        href={`/bookstore/${item.bookId}`}
                        className="font-body text-body-sm font-semibold text-text-primary hover:text-brand-primary truncate block"
                      >
                        {item.title}
                      </Link>
                      <p className="text-caption text-text-muted font-body truncate">
                        {item.author}
                      </p>
                      <span className="badge mt-1 bg-surface-muted text-text-muted text-caption">
                        {item.bookType === 'EBOOK' ? 'eBook' : 'Paperback'}
                      </span>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-2 mt-3 md:mt-0 flex items-center justify-center">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.bookId, item.bookType, item.quantity - 1)}
                        className="flex size-8 items-center justify-center rounded-md border border-border text-text-muted hover:bg-surface-muted hover:text-text-primary transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-10 text-center text-body-sm font-medium text-text-primary font-body">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.bookId, item.bookType, item.quantity + 1)}
                        className="flex size-8 items-center justify-center rounded-md border border-border text-text-muted hover:bg-surface-muted hover:text-text-primary transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Unit price */}
                  <div className="col-span-2 mt-2 md:mt-0 text-right">
                    <span className="text-body-sm text-text-secondary font-body">
                      {formatCurrency(item.mrp)}
                    </span>
                  </div>

                  {/* Line total + remove */}
                  <div className="col-span-2 mt-2 md:mt-0 flex items-center justify-end gap-3">
                    <span className="text-body-sm font-bold text-text-primary font-display">
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
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Actions row */}
            <div className="flex items-center justify-between pt-4">
              <Link
                href="/bookstore"
                className="inline-flex items-center gap-2 text-body-sm text-brand-primary font-medium font-body hover:underline"
              >
                <ArrowLeft className="size-4" />
                Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="text-body-sm text-status-danger font-medium font-body hover:underline"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="card-accent p-6 space-y-5 sticky top-24">
              <h2 className="font-display text-heading-sm text-text-primary">
                Order Summary
              </h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-body-sm font-body">
                  <span className="text-text-secondary">
                    Subtotal ({getItemCount()} item{getItemCount() !== 1 ? 's' : ''})
                  </span>
                  <span className="text-text-primary font-medium">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-body-sm font-body">
                  <span className="text-text-secondary">Shipping</span>
                  <span className="text-status-success font-medium">Free</span>
                </div>

                <div className="border-t border-border pt-3 flex items-center justify-between">
                  <span className="text-body-md text-text-primary font-body font-semibold">
                    Total
                  </span>
                  <span className="text-heading-md font-display font-bold text-brand-accent">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              <button
                className={cn(
                  'flex w-full items-center justify-center gap-2 rounded-lg py-3.5',
                  'bg-brand-primary text-text-inverse font-semibold text-body-md',
                  'transition-colors hover:bg-brand-primary-hover shadow-md hover:shadow-lg',
                )}
              >
                <CreditCard className="size-5" />
                Proceed to Checkout
              </button>

              <p className="text-caption text-text-muted font-body text-center">
                Secure payments powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
