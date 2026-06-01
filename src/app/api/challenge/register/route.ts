import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/challenge/register
 *
 * Creates a WritingChallengeRegistration (paymentStatus = PENDING).
 * Called before redirecting user to Stripe Checkout.
 * Works for both CHALLENGER and AUTHOR users.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const { challengeId } = await request.json();
    if (!challengeId) {
      return NextResponse.json(
        { success: false, error: 'challengeId is required' },
        { status: 400 },
      );
    }

    const userId = session.user.id;

    // Verify challenge exists and is accepting registrations
    const challenge = await prisma.writingChallenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge || challenge.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, error: 'Challenge is not accepting registrations' },
        { status: 400 },
      );
    }


    // Check if already registered
    const existing = await prisma.writingChallengeRegistration.findFirst({
      where: { challengeId, userId },
    });

    if (existing) {
      // Return existing registration (may be PENDING — let them retry payment)
      return NextResponse.json({
        success: true,
        data: { registrationId: existing.id, alreadyRegistered: true },
      });
    }

    // Look up Author record if the user is an AUTHOR
    let authorId: string | null = null;
    if (session.user.role === 'AUTHOR') {
      const author = await prisma.author.findFirst({
        where: { userId },
        select: { id: true },
      });
      authorId = author?.id ?? null;
    }

    const registration = await prisma.writingChallengeRegistration.create({
      data: {
        challengeId,
        userId,
        authorId,
        paymentStatus: 'PENDING',
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: { registrationId: registration.id, alreadyRegistered: false },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('[API] POST /api/challenge/register error:', error);
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 },
    );
  }
}
