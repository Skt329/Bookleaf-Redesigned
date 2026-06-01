'use client';

/**
 * Challenge Payment Success Page
 *
 * Shown after returning from a successful Stripe Checkout session.
 */

import Link from 'next/link';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ChallengePaymentPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="card-accent max-w-md p-8 text-center animate-fade-in">
        {/* Success Icon */}
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-status-success/10">
          <CheckCircle2 className="size-10 text-status-success" />
        </div>

        {/* Title */}
        <div className="mb-2 flex items-center justify-center gap-2">
          <Sparkles className="size-5 text-brand-accent" />
          <h1 className="font-display text-heading-lg text-text-primary">
            Welcome to #TheWriteAngle!
          </h1>
        </div>

        {/* Description */}
        <p className="mb-2 text-body-md text-text-secondary">
          Your challenge access is now active!
        </p>
        <p className="mb-8 text-body-sm text-text-muted">
          Your payment has been confirmed. You&apos;re all set to begin your
          21-day writing journey. Start crafting your poems and work towards
          your published book.
        </p>

        {/* CTA */}
        <Link href="/challenge/dashboard">
          <Button variant="accent" size="lg" className="w-full" id="challenge-payment-go-dashboard">
            <ArrowRight className="size-4" />
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
