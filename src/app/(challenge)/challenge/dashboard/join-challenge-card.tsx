'use client';

/**
 * JoinChallengeCard — Client component for challenge registration + Stripe payment.
 * Displayed on the challenge dashboard when user hasn't paid yet.
 */

import { useState } from 'react';
import { Sparkles, IndianRupee, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface JoinChallengeCardProps {
  challengeId: string;
  title: string;
  price: number;      // paise
  originalPrice: number; // paise
  hasPendingRegistration: boolean;
}

export function JoinChallengeCard({
  challengeId,
  title,
  price,
  originalPrice,
  hasPendingRegistration,
}: JoinChallengeCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

  async function handlePayment() {
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/challenge/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to start checkout. Please try again.');
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="card-accent overflow-hidden">
      {/* Header gradient */}
      <div className="bg-gradient-to-r from-brand-primary via-brand-primary-light to-brand-accent px-6 py-8 text-center">
        <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-2xl bg-brand-accent/20 backdrop-blur-sm">
          <Sparkles className="size-8 text-text-inverse" />
        </div>
        <h2 className="font-display text-heading-lg text-text-inverse">
          {title}
        </h2>
        <p className="mt-2 text-body-sm text-text-inverse/80">
          21 Days · 21 Poems · One Published Book
        </p>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Price */}
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="text-display-sm font-bold text-brand-accent font-display">
              {formatCurrency(price)}
            </span>
            {originalPrice > price && (
              <span className="text-body-md text-text-muted line-through">
                {formatCurrency(originalPrice)}
              </span>
            )}
          </div>
          {discount > 0 && (
            <span className="mt-1 inline-block rounded-full bg-status-success/10 px-3 py-0.5 text-caption font-semibold text-status-success">
              Save {discount}%
            </span>
          )}
        </div>

        {/* Info */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-3 text-body-sm text-text-secondary">
            <IndianRupee className="size-4 shrink-0 text-text-muted" />
            <span>Includes professional book publishing</span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-4 rounded-lg border border-status-danger/20 bg-status-danger/5 px-4 py-3 text-body-sm text-status-danger"
            role="alert"
            id="join-challenge-error"
          >
            {error}
          </div>
        )}

        {/* Pay Button */}
        <Button
          variant="accent"
          size="lg"
          className="w-full"
          onClick={handlePayment}
          disabled={isLoading}
          id="challenge-pay-stripe"
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Redirecting to Stripe…
            </span>
          ) : hasPendingRegistration ? (
            'Complete Payment'
          ) : (
            <>
              <Sparkles className="size-4" />
              Pay with Stripe
            </>
          )}
        </Button>


      </div>
    </div>
  );
}
