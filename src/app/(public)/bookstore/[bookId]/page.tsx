import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Navbar, Footer } from '@/components/layout';
import { PageHeader } from '@/components/shared';
import { GENRES, PLATFORMS } from '@/constants';
import { getPublishedBook, getRelatedBooks } from '@/lib/dal';
import { BookDetailClient } from './book-detail-client';

/* -----------------------------------------------------------------------
   Types
   ----------------------------------------------------------------------- */

interface PageProps {
  params: Promise<{ bookId: string }>;
}

/* -----------------------------------------------------------------------
   Metadata — uses cached getPublishedBook (same call as page body)
   ----------------------------------------------------------------------- */

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { bookId } = await params;
  const book = await getPublishedBook(bookId); // ← cached, no duplicate query

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
   Page Component — single cached fetch + parallel related books
   ----------------------------------------------------------------------- */

export default async function BookDetailPage({ params }: PageProps) {
  const { bookId } = await params;
  const book = await getPublishedBook(bookId); // ← same cache key as metadata — 0 extra queries

  if (!book) {
    notFound();
  }

  // Fetch related books (parallel, separate cache key)
  const relatedBooks = await getRelatedBooks(book.genre, book.id);

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
          relatedBooks={relatedBooks.map((rb) => ({
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
