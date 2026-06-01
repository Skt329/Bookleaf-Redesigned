import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateBookDescription } from '@/lib/ai/services';

interface RouteParams { params: Promise<{ bookId: string }> }

/**
 * POST /api/admin/books/[bookId]/ai-description — Generate AI book description
 */
export async function POST(_request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { bookId } = await params;

  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: { author: { include: { user: { select: { name: true } } } } },
  });

  if (!book) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  const description = await generateBookDescription(
    book.title,
    book.genre,
    book.author.user.name || book.author.penName || 'Unknown',
    book.pageCount,
    book.description
  );

  // Save to book
  await prisma.book.update({
    where: { id: bookId },
    data: { description },
  });

  return NextResponse.json({ success: true, description });
}
