import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const book = await prisma.book.findFirst({
      where: {
        OR: [{ id }, { bookId: id }],
        status: 'PUBLISHED',
      },
      select: {
        id: true,
        bookId: true,
        title: true,
        isbn: true,
        genre: true,
        description: true,
        coverImageUrl: true,
        publicationDate: true,
        mrp: true,
        language: true,
        pageCount: true,
        isEbookAvailable: true,
        isPaperbackAvailable: true,
        isFeatured: true,
        author: {
          select: {
            id: true,
            penName: true,
            authorBio: true,
            user: {
              select: {
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
        platformListings: {
          where: { isActive: true },
          select: {
            id: true,
            platform: true,
            externalUrl: true,
          },
        },
      },
    });

    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 },
      );
    }

    // Fetch related books (same genre, exclude current)
    const relatedBooks = await prisma.book.findMany({
      where: {
        genre: book.genre,
        status: 'PUBLISHED',
        id: { not: book.id },
      },
      take: 4,
      orderBy: { publicationDate: 'desc' },
      select: {
        id: true,
        bookId: true,
        title: true,
        genre: true,
        coverImageUrl: true,
        mrp: true,
        author: {
          select: {
            penName: true,
            user: {
              select: { name: true },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: { ...book, relatedBooks },
    });
  } catch (error) {
    console.error('[API] GET /api/bookstore/books/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch book' },
      { status: 500 },
    );
  }
}
