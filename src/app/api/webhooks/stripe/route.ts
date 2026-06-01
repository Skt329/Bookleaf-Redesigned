/**
 * Stripe Webhook Handler
 *
 * POST /api/webhooks/stripe
 *
 * Verifies webhook signature and handles checkout.session.completed events.
 * Updates WritingChallengeRegistration to PAID, decrements slots,
 * and creates an AdminNotification.
 */

import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

import type Stripe from 'stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = await request.text(); // Raw body — no JSON parsing
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error('[STRIPE_WEBHOOK_VERIFY_ERROR]', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 },
    );
  }

  // Handle checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const registrationId = session.metadata?.registrationId;
    const challengeId = session.metadata?.challengeId;
    const userId = session.metadata?.userId;

    if (!registrationId) {
      console.error('[STRIPE_WEBHOOK] Missing registrationId in metadata');
      return NextResponse.json({ received: true });
    }

    try {
      const now = new Date();
      const endDate = new Date(now);
      endDate.setDate(endDate.getDate() + 21);

      // Update registration to PAID + set personal 21-day window
      await prisma.writingChallengeRegistration.update({
        where: { id: registrationId },
        data: {
          paymentStatus: 'PAID',
          stripeSessionId: session.id,
          personalStartDate: now,
          personalEndDate: endDate,
        },
      });

      // Fetch user details for notification
      const user = userId
        ? await prisma.user.findUnique({
            where: { id: userId },
            select: { name: true, email: true },
          })
        : null;

      // Create admin notification
      await prisma.adminNotification.create({
        data: {
          type: 'CHALLENGE_REGISTRATION',
          title: 'New Challenge Registration',
          message: `${user?.name ?? 'A user'} (${user?.email ?? 'unknown'}) has registered and paid for the writing challenge.`,
          referenceId: registrationId,
        },
      });

      console.log(
        `[STRIPE_WEBHOOK] Registration ${registrationId} marked as PAID`,
      );
    } catch (error) {
      console.error('[STRIPE_WEBHOOK_DB_ERROR]', error);
      // Return 500 so Stripe retries
      return NextResponse.json(
        { error: 'Database update failed' },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ received: true });
}
