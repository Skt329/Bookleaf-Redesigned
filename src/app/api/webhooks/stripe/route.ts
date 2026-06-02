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
    const orderId = session.metadata?.orderId;
    const purchaseId = session.metadata?.purchaseId;

    if (!registrationId && !orderId && !purchaseId) {
      console.error('[STRIPE_WEBHOOK] Missing registrationId, orderId, or purchaseId in metadata');
      return NextResponse.json({ received: true });
    }

    if (registrationId) {
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
        return NextResponse.json(
          { error: 'Database update failed' },
          { status: 500 },
        );
      }
    }

    if (orderId) {
      try {
        // Update Order to CONFIRMED + store stripe details
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'CONFIRMED',
            stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : null,
            stripePaymentStatus: 'paid',
          },
        });

        console.log(`[STRIPE_WEBHOOK] Bookstore Order ${orderId} marked as CONFIRMED`);
      } catch (error) {
        console.error('[STRIPE_WEBHOOK_ORDER_DB_ERROR]', error);
        return NextResponse.json(
          { error: 'Database update for order failed' },
          { status: 500 },
        );
      }
    }

    if (purchaseId) {
      try {
        // Update PackagePurchase to PAID
        const purchase = await prisma.packagePurchase.update({
          where: { id: purchaseId },
          data: {
            status: 'PAID',
            stripeSessionId: session.id,
            stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : null,
          },
          include: { package: true, author: true },
        });

        // Upgrade author's publishing package
        await prisma.author.update({
          where: { id: purchase.authorId },
          data: {
            publishingPackage: purchase.package.name,
          },
        });

        // Create admin notification
        await prisma.adminNotification.create({
          data: {
            type: 'PACKAGE_PURCHASE',
            title: 'New Package Purchased',
            message: `Author with ID ${purchase.author.authorId} has purchased the ${purchase.package.name} publishing package.`,
            referenceId: purchase.id,
          },
        });

        console.log(`[STRIPE_WEBHOOK] Package Purchase ${purchaseId} marked as PAID`);
      } catch (error) {
        console.error('[STRIPE_WEBHOOK_PACKAGE_DB_ERROR]', error);
        return NextResponse.json(
          { error: 'Database update for package purchase failed' },
          { status: 500 },
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}
