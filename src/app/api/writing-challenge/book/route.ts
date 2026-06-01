import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      registrationId,
      bookTitle,
      bookSubtitle,
      coverTemplate,
      authorBioForBook,
      dedication,
      acknowledgments,
    } = body;

    // Verify ownership
    const registration = await prisma.writingChallengeRegistration.findFirst({
      where: { id: registrationId, userId: session.user.id },
    });

    if (!registration) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const updated = await prisma.writingChallengeRegistration.update({
      where: { id: registrationId },
      data: {
        bookTitle,
        bookSubtitle,
        coverTemplate,
        authorBioForBook,
        dedication,
        acknowledgments,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[Book Save] Error:', error);
    return NextResponse.json(
      { error: 'Failed to save book details' },
      { status: 500 },
    );
  }
}
