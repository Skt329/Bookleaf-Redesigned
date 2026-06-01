import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/writing-challenge/poems — Get user's poems for active challenge
 */
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const registration = await prisma.writingChallengeRegistration.findFirst({
    where: { userId: session.user.id, paymentStatus: 'PAID' },
    orderBy: { registeredAt: 'desc' },
    include: { challenge: true },
  });

  if (!registration) {
    return NextResponse.json({ error: 'Not registered' }, { status: 404 });
  }

  const poems = await prisma.dailyPoem.findMany({
    where: { registrationId: registration.id },
    orderBy: { dayNumber: 'asc' },
  });

  return NextResponse.json({
    success: true,
    data: { registration, poems },
  });
}

/**
 * POST /api/writing-challenge/poems — Submit/save a daily poem
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const registration = await prisma.writingChallengeRegistration.findFirst({
    where: { authorId: session.user.id, paymentStatus: 'PAID' },
    orderBy: { registeredAt: 'desc' },
    include: { challenge: true },
  });

  if (!registration) {
    return NextResponse.json({ error: 'Not registered' }, { status: 404 });
  }

  if (registration.challenge.status !== 'ACTIVE') {
    return NextResponse.json({ error: 'Challenge is not active' }, { status: 400 });
  }

  // Check personal window hasn't expired
  if (registration.personalEndDate && new Date() > registration.personalEndDate) {
    return NextResponse.json({ error: 'Your 21-day challenge window has ended' }, { status: 400 });
  }

  const body = await request.json();
  const { dayNumber, title, content, wordCount, isDraft } = body;

  if (!dayNumber || !title) {
    return NextResponse.json({ error: 'dayNumber and title are required' }, { status: 400 });
  }

  // Upsert — allow saving drafts and final submissions
  const poem = await prisma.dailyPoem.upsert({
    where: {
      registrationId_dayNumber: {
        registrationId: registration.id,
        dayNumber,
      },
    },
    create: {
      registrationId: registration.id,
      dayNumber,
      title,
      content: content || {},
      wordCount: wordCount || 0,
      isDraft: isDraft ?? true,
      lastSavedAt: new Date(),
      submittedAt: isDraft ? null : new Date(),
    },
    update: {
      title,
      content: content || {},
      wordCount: wordCount || 0,
      isDraft: isDraft ?? true,
      lastSavedAt: new Date(),
      submittedAt: isDraft ? undefined : new Date(),
    },
  });

  return NextResponse.json({ success: true, data: poem });
}
