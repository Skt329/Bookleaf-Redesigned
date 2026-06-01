import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/writing-challenge — Get active challenge info
 */
export async function GET() {
  const challenge = await prisma.writingChallenge.findFirst({
    where: { status: 'ACTIVE' },
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
    where: { status: 'ACTIVE' },
  });

  if (!challenge) {
    return NextResponse.json({ error: 'No challenge currently accepting registrations' }, { status: 400 });
  }


  // Check if already registered
  const existing = await prisma.writingChallengeRegistration.findFirst({
    where: { challengeId: challenge.id, userId: session.user.id },
  });

  if (existing) {
    return NextResponse.json({ error: 'Already registered' }, { status: 400 });
  }

  const body = await request.json();
  const { stripePaymentIntentId } = body;

  // Look up authorId if user is an AUTHOR
  let authorId: string | null = null;
  if (session.user.role === 'AUTHOR') {
    const author = await prisma.author.findFirst({
      where: { userId: session.user.id },
      select: { id: true },
    });
    authorId = author?.id ?? null;
  }

  // Create registration
  const registration = await prisma.writingChallengeRegistration.create({
    data: {
      challengeId: challenge.id,
      userId: session.user.id,
      authorId,
      paymentStatus: stripePaymentIntentId ? 'PAID' : 'PENDING',
      stripePaymentIntentId: stripePaymentIntentId || null,
    },
  });


  return NextResponse.json({ success: true, data: registration }, { status: 201 });
}
