import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams { params: Promise<{ challengeId: string }> }

async function publishRegistrationTx(
  tx: any,
  registrationId: string,
  challengeTitle: string,
) {
  const reg = await tx.writingChallengeRegistration.findUnique({
    where: { id: registrationId },
    include: { user: true, author: true },
  });

  if (!reg) throw new Error(`Registration ${registrationId} not found`);
  if (!reg.completedChallenge) throw new Error(`Registration ${registrationId} not completed`);
  if (reg.bookPublished) throw new Error(`Registration ${registrationId} already published`);

  let authorRecord = reg.author;

  // If user is CHALLENGER, upgrade to AUTHOR and create Author record
  if (reg.user.role === 'CHALLENGER') {
    const lastAuthor = await tx.author.findFirst({
      orderBy: { authorId: 'desc' },
      select: { authorId: true },
    });
    const lastAuthorNum = lastAuthor ? parseInt(lastAuthor.authorId.replace('AUTH', ''), 10) : 0;
    const newAuthorId = `AUTH${String(lastAuthorNum + 1).padStart(3, '0')}`;

    authorRecord = await tx.author.create({
      data: {
        userId: reg.user.id,
        authorId: newAuthorId,
        penName: reg.user.name,
        publishingPackage: 'WRITING_CHALLENGE',
      },
    });

    await tx.user.update({
      where: { id: reg.user.id },
      data: { role: 'AUTHOR' },
    });

    // Link registration to the new author
    await tx.writingChallengeRegistration.update({
      where: { id: registrationId },
      data: { authorId: authorRecord.id },
    });
  }

  if (!authorRecord) {
    throw new Error(`No author record for registration ${registrationId}`);
  }

  const lastBook = await tx.book.findFirst({
    orderBy: { bookId: 'desc' },
    select: { bookId: true },
  });
  const lastBookNum = lastBook ? parseInt(lastBook.bookId.replace('BK', ''), 10) : 0;
  const bookId = `BK${String(lastBookNum + 1).padStart(3, '0')}`;

  const authorName = reg.user.name || 'Unknown Author';

  // Create the book
  await tx.book.create({
    data: {
      bookId,
      authorId: authorRecord.id,
      title: `${challengeTitle} - ${authorName}`,
      genre: 'POETRY',
      status: 'PUBLISHED',
      publicationDate: new Date(),
      writingChallengeId: reg.challengeId,
    },
  });

  // Mark registration as published
  await tx.writingChallengeRegistration.update({
    where: { id: registrationId },
    data: { bookPublished: true },
  });

  // Create admin notification
  await tx.adminNotification.create({
    data: {
      type: 'CHALLENGE_BOOKS_READY',
      title: 'Challenge Book Published',
      message: `"${challengeTitle} - ${authorName}" has been published successfully.`,
      referenceId: reg.challengeId,
    },
  });

  return { registrationId, bookId, authorName };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { challengeId } = await params;
  const body = await request.json();

  const challenge = await prisma.writingChallenge.findUnique({
    where: { id: challengeId },
  });
  if (!challenge) {
    return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
  }

  try {
    if (body.all === true) {
      // Bulk publish all ready registrations in a transaction with table locks
      const results = await prisma.$transaction(async (tx) => {
        await tx.$executeRawUnsafe('LOCK TABLE authors IN EXCLUSIVE MODE;');
        await tx.$executeRawUnsafe('LOCK TABLE books IN EXCLUSIVE MODE;');

        const readyRegistrations = await tx.writingChallengeRegistration.findMany({
          where: {
            challengeId,
            completedChallenge: true,
            bookPublished: false,
          },
        });

        const tempResults = [];
        for (const reg of readyRegistrations) {
          const result = await publishRegistrationTx(tx, reg.id, challenge.title);
          tempResults.push(result);
        }
        return tempResults;
      });

      return NextResponse.json({ success: true, publishedCount: results.length, results });
    }

    if (body.registrationId) {
      // Publish single registration in a transaction with table locks
      const result = await prisma.$transaction(async (tx) => {
        await tx.$executeRawUnsafe('LOCK TABLE authors IN EXCLUSIVE MODE;');
        await tx.$executeRawUnsafe('LOCK TABLE books IN EXCLUSIVE MODE;');
        return await publishRegistrationTx(tx, body.registrationId, challenge.title);
      });
      return NextResponse.json({ success: true, publishedCount: 1, results: [result] });
    }

    return NextResponse.json(
      { error: 'Provide { registrationId } or { all: true }' },
      { status: 400 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
