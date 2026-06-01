'use client';

/**
 * AuthorJoinChallengeCard — Same as JoinChallengeCard but for the author portal.
 * Uses the same /api/challenge/create-checkout endpoint.
 */

import { useState } from 'react';
import { Sparkles, IndianRupee, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AuthorJoinChallengeCardProps {
  challengeId: string;
  title: string;
  price: number;
  originalPrice: number;
  hasPendingRegistration: boolean;
}

export function AuthorJoinChallengeCard({
  challengeId,
  title,
  price,
  originalPrice,
  hasPendingRegistration,
}: AuthorJoinChallengeCardProps) {
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
        setError(data.error || 'Failed to start checkout.');
        return;
      }

      window.location.href = data.url;
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="card-accent overflow-hidden">
      <div className="bg-gradient-to-r from-brand-primary via-brand-primary-light to-brand-accent px-6 py-8 text-center">
        <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-2xl bg-brand-accent/20 backdrop-blur-sm">
          <Sparkles className="size-8 text-text-inverse" />
        </div>
        <h2 className="font-display text-heading-lg text-text-inverse">
          Join from Your Author Portal
        </h2>
        <p className="mt-2 text-body-sm text-text-inverse/80">
          {title} — 21 Days · 21 Poems · One Published Book
        </p>
      </div>

      <div className="p-6">
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="font-display text-display-sm font-bold text-brand-accent">
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

        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-3 text-body-sm text-text-secondary">
            <IndianRupee className="size-4 shrink-0 text-text-muted" />
            <span>Your book will be linked to your Author profile</span>
          </div>
        </div>

        {error && (
          <div
            className="mb-4 rounded-lg border border-status-danger/20 bg-status-danger/5 px-4 py-3 text-body-sm text-status-danger"
            role="alert"
            id="author-join-challenge-error"
          >
            {error}
          </div>
        )}

        <Button
          variant="accent"
          size="lg"
          className="w-full"
          onClick={handlePayment}
          disabled={isLoading}
          id="author-challenge-pay-stripe"
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
