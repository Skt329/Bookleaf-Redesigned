import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const genre = searchParams.get('genre');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') ?? 'newest';
    const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') ?? '12')));
    const featured = searchParams.get('featured');

    // Build where clause — only published books
    const where: Prisma.BookWhereInput = {
      status: 'PUBLISHED',
    };

    if (genre && genre !== 'ALL') {
      where.genre = genre as Prisma.EnumGenreFilter;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { user: { name: { contains: search, mode: 'insensitive' } } } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    // Build orderBy
    let orderBy: Prisma.BookOrderByWithRelationInput;

    switch (sort) {
      case 'price-asc':
        orderBy = { mrp: 'asc' };
        break;
      case 'price-desc':
        orderBy = { mrp: 'desc' };
        break;
      case 'title-asc':
        orderBy = { title: 'asc' };
        break;
      case 'oldest':
        orderBy = { publicationDate: 'asc' };
        break;
      case 'newest':
      default:
        orderBy = { publicationDate: 'desc' };
        break;
    }

    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          bookId: true,
          title: true,
          genre: true,
          description: true,
          coverImageUrl: true,
          publicationDate: true,
          mrp: true,
          isEbookAvailable: true,
          isPaperbackAvailable: true,
          isFeatured: true,
          pageCount: true,
          language: true,
          author: {
            select: {
              id: true,
              penName: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
          platformListings: {
            where: { isActive: true },
            select: {
              platform: true,
              externalUrl: true,
            },
          },
        },
      }),
      prisma.book.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: books,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('[API] GET /api/bookstore/books error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch books' },
      { status: 500 },
    );
  }
}
