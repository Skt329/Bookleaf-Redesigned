import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/writing-challenge — Get active challenge info
 */
export async function GET() {
  const challenge = await prisma.writingChallenge.findFirst({
    where: { status: { in: ['REGISTRATION_OPEN', 'IN_PROGRESS'] } },
    orderBy: { startDate: 'desc' },
  });

  if (!challenge) {
    return NextResponse.json({ success: true, data: null });
  }

  return NextResponse.json({ success: true, data: challenge });
}

/**
 * POST /api/writing-challenge — Register for active challenge
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const challenge = await prisma.writingChallenge.findFirst({
    where: { status: 'REGISTRATION_OPEN' },
  });

  if (!challenge) {
    return NextResponse.json({ error: 'No challenge currently accepting registrations' }, { status: 400 });
  }

  if (challenge.slotsRemaining <= 0) {
    return NextResponse.json({ error: 'Challenge is full' }, { status: 400 });
  }

  // Check if already registered
  const existing = await prisma.writingChallengeRegistration.findFirst({
    where: { challengeId: challenge.id, authorId: session.user.id },
  });

  if (existing) {
    return NextResponse.json({ error: 'Already registered' }, { status: 400 });
  }

  const body = await request.json();
  const { stripePaymentIntentId } = body;

  // Create registration
  const registration = await prisma.writingChallengeRegistration.create({
    data: {
      challengeId: challenge.id,
      authorId: session.user.id,
      paymentStatus: stripePaymentIntentId ? 'PAID' : 'PENDING',
      stripePaymentIntentId: stripePaymentIntentId || null,
    },
  });

  // Decrement slots
  await prisma.writingChallenge.update({
    where: { id: challenge.id },
    data: { slotsRemaining: { decrement: 1 } },
  });

  return NextResponse.json({ success: true, data: registration }, { status: 201 });
}
