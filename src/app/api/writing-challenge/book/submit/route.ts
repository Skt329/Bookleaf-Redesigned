import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { registrationId } = await request.json();

    const registration = await prisma.writingChallengeRegistration.findFirst({
      where: { id: registrationId, userId: session.user.id },
    });

    if (!registration) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.writingChallengeRegistration.update({
      where: { id: registrationId },
      data: {
        completedChallenge: true,
        bookSubmittedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Book Submit] Error:', error);
    return NextResponse.json(
      { error: 'Submission failed' },
      { status: 500 },
    );
  }
}
