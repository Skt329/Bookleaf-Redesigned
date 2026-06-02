import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/challenge/upgrade
 *
 * Called by admin when publishing a challenge book.
 * Upgrades a CHALLENGER user to AUTHOR role:
 * 1. Creates an Author record with sequential authorId
 * 2. Updates user role to AUTHOR
 * 3. Links the published book to the new Author
 * 4. Marks registration as bookPublished
 *
 * Body: { registrationId: string, bookId?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 },
      );
    }

    const { registrationId, bookId } = await request.json();
    if (!registrationId) {
      return NextResponse.json(
        { success: false, error: 'registrationId is required' },
        { status: 400 },
      );
    }

    // Fetch registration with user
    const registration = await prisma.writingChallengeRegistration.findUnique({
      where: { id: registrationId },
      include: { user: true },
    });

    if (!registration) {
      return NextResponse.json(
        { success: false, error: 'Registration not found' },
        { status: 404 },
      );
    }

    // Only upgrade CHALLENGER users (AUTHOR already has access)
    if (registration.user.role !== 'CHALLENGER') {
      // Already an AUTHOR — just mark bookPublished
      await prisma.writingChallengeRegistration.update({
        where: { id: registrationId },
        data: { bookPublished: true, completedChallenge: true },
      });

      return NextResponse.json({
        success: true,
        data: {
          upgraded: false,
          message: 'User is already an AUTHOR. Registration marked as published.',
        },
      });
    }

    // Transaction: upgrade user, create author, update registration
    const result = await prisma.$transaction(async (tx) => {
      await tx.$executeRawUnsafe('LOCK TABLE authors IN EXCLUSIVE MODE;');

      // Generate next sequential authorId inside transaction
      const lastAuthor = await tx.author.findFirst({
        orderBy: { authorId: 'desc' },
        select: { authorId: true },
      });

      const nextNum = lastAuthor
        ? parseInt(lastAuthor.authorId.replace('AUTH', ''), 10) + 1
        : 1;
      const newAuthorId = `AUTH${String(nextNum).padStart(3, '0')}`;

      // 1. Update user role
      await tx.user.update({
        where: { id: registration.userId },
        data: { role: 'AUTHOR' },
      });

      // 2. Create Author record
      const author = await tx.author.create({
        data: {
          userId: registration.userId,
          authorId: newAuthorId,
          penName: registration.user.name,
          authorBio: `Author who completed the #TheWriteAngle writing challenge.`,
        },
      });

      // 3. Update registration
      await tx.writingChallengeRegistration.update({
        where: { id: registrationId },
        data: {
          bookPublished: true,
          completedChallenge: true,
          authorId: author.id,
        },
      });

      // 4. Link the book to the new author (if bookId provided)
      if (bookId) {
        await tx.book.update({
          where: { id: bookId },
          data: { authorId: author.id },
        });
      }

      // 5. Create admin notification
      await tx.adminNotification.create({
        data: {
          type: 'CHALLENGE_COMPLETED',
          title: 'Challenger Upgraded to Author',
          message: `${registration.user.name ?? registration.user.email} has been upgraded from CHALLENGER to AUTHOR (${newAuthorId}).`,
          referenceId: author.id,
        },
      });

      return { author, newAuthorId };
    });

    return NextResponse.json({
      success: true,
      data: {
        upgraded: true,
        authorId: result.newAuthorId,
        authorRecordId: result.author.id,
        message: `User upgraded to AUTHOR with ID ${result.newAuthorId}`,
      },
    });
  } catch (error) {
    console.error('[API] POST /api/challenge/upgrade error:', error);
    return NextResponse.json(
      { success: false, error: 'Upgrade failed' },
      { status: 500 },
    );
  }
}
