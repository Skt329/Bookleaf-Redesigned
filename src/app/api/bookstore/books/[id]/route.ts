import { NextRequest, NextResponse } from 'next/server';
import { getPublishedBook, getRelatedBooks } from '@/lib/dal';

/**
 * GET /api/bookstore/books/[id]
 *
 * Uses the shared DAL with React cache() so that if this route is called
 * in the same request context as the page, queries are deduplicated.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const book = await getPublishedBook(id);

    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 },
      );
    }

    // Single additional query for related books
    const relatedBooks = await getRelatedBooks(book.genre, book.id);

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
