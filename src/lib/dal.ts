/**
 * BookLeaf Data Access Layer (DAL)
 *
 * Centralised, cached database queries used across server components.
 * Uses React `cache()` to deduplicate identical queries within a single
 * request lifecycle (e.g. generateMetadata + page body calling the
 * same function will only hit the DB once).
 *
 * Enterprise patterns applied:
 * - React cache() for request-level deduplication
 * - Eager-loaded relations via Prisma `include` (no N+1)
 * - Aggregate queries instead of fetching all records + JS reduce
 * - Selective `select` clauses to minimize data transfer
 * - Batched parallel queries via Promise.all where possible
 */

import { cache } from 'react';
import { prisma } from '@/lib/prisma';

/* ==========================================================================
   Bookstore — Public Queries
   ========================================================================== */

/**
 * Fetch a single published book by ID or bookId with all relations.
 * Cached per request to avoid duplicate queries from generateMetadata + page.
 */
export const getPublishedBook = cache(async (idOrBookId: string) => {
  return prisma.book.findFirst({
    where: {
      OR: [{ id: idOrBookId }, { bookId: idOrBookId }],
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
      authorId: true,
      author: {
        select: {
          id: true,
          penName: true,
          authorBio: true,
          user: {
            select: { name: true, avatarUrl: true },
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
});

/**
 * Fetch related books by genre (excluding the current book).
 * Cached per request.
 */
export const getRelatedBooks = cache(
  async (genre: string, excludeId: string, limit = 4) => {
    return prisma.book.findMany({
      where: {
        genre: genre as any,
        status: 'PUBLISHED',
        id: { not: excludeId },
      },
      take: limit,
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
            user: { select: { name: true } },
          },
        },
      },
    });
  },
);

/* ==========================================================================
   Admin — Dashboard Aggregates
   ========================================================================== */

/**
 * Fetch all admin dashboard stats in a single batched call.
 * Uses aggregate queries where possible to avoid fetching full records.
 */
export const getAdminDashboardStats = cache(async () => {
  const [
    totalAuthors,
    totalBooks,
    publishedBooks,
    openTickets,
    royaltyAggregates,
    recentBooks,
    recentTickets,
  ] = await Promise.all([
    prisma.author.count(),
    prisma.book.count(),
    prisma.book.count({ where: { status: 'PUBLISHED' } }),
    prisma.supportTicket.count({
      where: { status: { in: ['OPEN', 'IN_PROGRESS'] } },
    }),
    // Use aggregate instead of fetching ALL records + JS reduce
    prisma.royaltyRecord.aggregate({
      _sum: {
        grossRoyalty: true,
        royaltyPaid: true,
        royaltyPending: true,
      },
    }),
    prisma.book.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        status: true,
        author: {
          select: {
            user: { select: { name: true } },
          },
        },
      },
    }),
    prisma.supportTicket.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        ticketNumber: true,
        subject: true,
        status: true,
        author: {
          select: {
            user: { select: { name: true } },
          },
        },
      },
    }),
  ]);

  return {
    totalAuthors,
    totalBooks,
    publishedBooks,
    openTickets,
    totalRoyaltyEarned: royaltyAggregates._sum.grossRoyalty ?? 0,
    totalRoyaltyPending: royaltyAggregates._sum.royaltyPending ?? 0,
    recentBooks,
    recentTickets,
  };
});

/* ==========================================================================
   Author — Portal Queries
   ========================================================================== */

/**
 * Fetch author profile with recent books for the dashboard.
 * Cached per request.
 */
export const getAuthorDashboardData = cache(async (userId: string) => {
  return prisma.author.findFirst({
    where: { userId },
    include: {
      books: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });
});

/**
 * Fetch author profile by userId (for layout/guards).
 * Lightweight query — only returns id.
 */
export const getAuthorByUserId = cache(async (userId: string) => {
  return prisma.author.findFirst({
    where: { userId },
    select: { id: true },
  });
});
