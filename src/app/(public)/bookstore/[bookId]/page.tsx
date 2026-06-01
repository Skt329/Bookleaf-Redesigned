import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Navbar, Footer } from '@/components/layout';
import { PageHeader } from '@/components/shared';
import { GENRES, PLATFORMS } from '@/constants';
import { BookDetailClient } from './book-detail-client';

/* -----------------------------------------------------------------------
   Types
   ----------------------------------------------------------------------- */

interface PageProps {
  params: Promise<{ bookId: string }>;
}

/* -----------------------------------------------------------------------
   Metadata
   ----------------------------------------------------------------------- */

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { bookId } = await params;

  const book = await prisma.book.findFirst({
    where: {
      OR: [{ id: bookId }, { bookId }],
      status: 'PUBLISHED',
    },
    select: { title: true, description: true, genre: true },
  });

  if (!book) {
    return { title: 'Book Not Found' };
  }

  const genreLabel = GENRES.find((g) => g.value === book.genre)?.label ?? book.genre;

  return {
    title: `${book.title} — BookLeaf Bookstore`,
    description:
      book.description?.slice(0, 155) ??
      `Buy ${book.title}, a ${genreLabel} book, from BookLeaf Bookstore. Support independent Indian authors.`,
  };
}

/* -----------------------------------------------------------------------
   Data Fetching
   ----------------------------------------------------------------------- */

async function getBook(bookId: string) {
  const book = await prisma.book.findFirst({
    where: {
      OR: [{ id: bookId }, { bookId }],
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

  if (!book) return null;

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
          user: { select: { name: true } },
        },
      },
    },
  });

  return { ...book, relatedBooks };
}

/* -----------------------------------------------------------------------
   Page Component
   ----------------------------------------------------------------------- */

export default async function BookDetailPage({ params }: PageProps) {
  const { bookId } = await params;
  const book = await getBook(bookId);

  if (!book) {
    notFound();
  }

  const genreLabel = GENRES.find((g) => g.value === book.genre)?.label ?? book.genre;
  const authorName = book.author.penName ?? book.author.user.name ?? 'Unknown Author';

  // Map platform listings with labels
  const platforms = book.platformListings.map((pl) => ({
    ...pl,
    label: PLATFORMS.find((p) => p.value === pl.platform)?.label ?? pl.platform,
  }));

  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          title={book.title}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Bookstore', href: '/bookstore' },
            { label: book.title },
          ]}
        />

        <BookDetailClient
          book={{
            id: book.id,
            bookId: book.bookId,
            title: book.title,
            isbn: book.isbn,
            genre: book.genre,
            genreLabel,
            description: book.description,
            coverImageUrl: book.coverImageUrl,
            publicationDate: book.publicationDate?.toISOString() ?? null,
            mrp: book.mrp,
            language: book.language,
            pageCount: book.pageCount,
            isEbookAvailable: book.isEbookAvailable,
            isPaperbackAvailable: book.isPaperbackAvailable,
            authorName,
            authorBio: book.author.authorBio,
            authorAvatar: book.author.user.avatarUrl,
            platforms,
          }}
          relatedBooks={book.relatedBooks.map((rb) => ({
            id: rb.id,
            bookId: rb.bookId,
            title: rb.title,
            genre: rb.genre,
            coverImageUrl: rb.coverImageUrl,
            mrp: rb.mrp,
            author: {
              penName: rb.author.penName,
              user: { name: rb.author.user.name },
            },
          }))}
        />
      </main>
      <Footer />
    </>
  );
}
