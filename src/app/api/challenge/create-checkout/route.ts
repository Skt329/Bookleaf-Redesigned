/**
 * Stripe Checkout API — Create Challenge Payment Session
 *
 * POST /api/challenge/create-checkout
 *
 * Requires authenticated user (CHALLENGER or AUTHOR).
 * Creates a WritingChallengeRegistration with PENDING status,
 * then creates a Stripe Checkout Session and returns the URL.
 */

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createChallengeCheckoutSession } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { role, id: userId } = session.user;

    if (role !== 'CHALLENGER' && role !== 'AUTHOR') {
      return NextResponse.json(
        { error: 'Only challengers and authors can register' },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { challengeId } = body;

    if (!challengeId) {
      return NextResponse.json(
        { error: 'challengeId is required' },
        { status: 400 },
      );
    }

    // Validate challenge
    const challenge = await prisma.writingChallenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge || challenge.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Challenge is not accepting registrations' },
        { status: 400 },
      );
    }


    // Check if already registered + paid
    const existing = await prisma.writingChallengeRegistration.findFirst({
      where: { challengeId, userId, paymentStatus: 'PAID' },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Already registered and paid' },
        { status: 400 },
      );
    }

    // Look up Author record if user is AUTHOR
    let authorId: string | null = null;
    if (role === 'AUTHOR') {
      const author = await prisma.author.findFirst({
        where: { userId },
        select: { id: true },
      });
      authorId = author?.id ?? null;
    }

    // Find existing pending registration or create new one
    let registration = await prisma.writingChallengeRegistration.findFirst({
      where: { challengeId, userId, paymentStatus: 'PENDING' },
    });

    if (!registration) {
      registration = await prisma.writingChallengeRegistration.create({
        data: {
          challengeId,
          userId,
          authorId,
          paymentStatus: 'PENDING',
        },
      });
    }

    // Determine URLs
    const origin =
      request.headers.get('origin') ??
      request.headers.get('x-forwarded-host') ??
      'http://localhost:3000';

    const baseUrl = origin.startsWith('http') ? origin : `https://${origin}`;

    const successUrl = `${baseUrl}/challenge/payment?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/challenge/dashboard`;

    // Create Stripe Checkout Session
    const checkoutUrl = await createChallengeCheckoutSession({
      userId,
      challengeId,
      registrationId: registration.id,
      priceInPaise: challenge.price,
      challengeTitle: challenge.title,
      successUrl,
      cancelUrl,
    });

    return NextResponse.json({ success: true, url: checkoutUrl });
  } catch (error) {
    console.error('[CREATE_CHECKOUT_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 },
    );
  }
}
