import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams { params: Promise<{ challengeId: string }> }

async function getNextBookId(): Promise<string> {
  const lastBook = await prisma.book.findFirst({ orderBy: { bookId: 'desc' } });
  const lastNum = lastBook ? parseInt(lastBook.bookId.replace('BK', ''), 10) : 0;
  return `BK${String(lastNum + 1).padStart(3, '0')}`;
}

async function getNextAuthorId(): Promise<string> {
  const lastAuthor = await prisma.author.findFirst({ orderBy: { authorId: 'desc' } });
  const lastNum = lastAuthor ? parseInt(lastAuthor.authorId.replace('AUTH', ''), 10) : 0;
  return `AUTH${String(lastNum + 1).padStart(3, '0')}`;
}

async function publishRegistration(
  registrationId: string,
  challengeTitle: string,
) {
  const reg = await prisma.writingChallengeRegistration.findUnique({
    where: { id: registrationId },
    include: { user: true, author: true },
  });

  if (!reg) throw new Error(`Registration ${registrationId} not found`);
  if (!reg.completedChallenge) throw new Error(`Registration ${registrationId} not completed`);
  if (reg.bookPublished) throw new Error(`Registration ${registrationId} already published`);

  let authorRecord = reg.author;

  // If user is CHALLENGER, upgrade to AUTHOR and create Author record
  if (reg.user.role === 'CHALLENGER') {
    const newAuthorId = await getNextAuthorId();
    authorRecord = await prisma.author.create({
      data: {
        userId: reg.user.id,
        authorId: newAuthorId,
        penName: reg.user.name,
        publishingPackage: 'WRITING_CHALLENGE',
      },
    });
    await prisma.user.update({
      where: { id: reg.user.id },
      data: { role: 'AUTHOR' },
    });
    // Link registration to the new author
    await prisma.writingChallengeRegistration.update({
      where: { id: registrationId },
      data: { authorId: authorRecord.id },
    });
  }

  if (!authorRecord) {
    throw new Error(`No author record for registration ${registrationId}`);
  }

  const bookId = await getNextBookId();
  const authorName = reg.user.name || 'Unknown Author';

  // Create the book
  await prisma.book.create({
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
  await prisma.writingChallengeRegistration.update({
    where: { id: registrationId },
    data: { bookPublished: true },
  });

  // Create admin notification
  await prisma.adminNotification.create({
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
      // Bulk publish all ready registrations
      const readyRegistrations = await prisma.writingChallengeRegistration.findMany({
        where: {
          challengeId,
          completedChallenge: true,
          bookPublished: false,
        },
      });

      const results = [];
      for (const reg of readyRegistrations) {
        const result = await publishRegistration(reg.id, challenge.title);
        results.push(result);
      }

      return NextResponse.json({ success: true, publishedCount: results.length, results });
    }

    if (body.registrationId) {
      const result = await publishRegistration(body.registrationId, challenge.title);
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
