import type { Metadata } from 'next';
import { Navbar, Footer } from '@/components/layout';
import { PageHeader } from '@/components/shared';
import { BookstoreCatalog } from './bookstore-catalog';

/* -----------------------------------------------------------------------
   SEO Metadata
   ----------------------------------------------------------------------- */

export const metadata: Metadata = {
  title: 'BookLeaf Bookstore — Discover Independent Indian Authors',
  description:
    "Browse and buy books from India's finest independent authors. Fiction, non-fiction, poetry, and more from 12,000+ published writers. 100% royalty to authors on direct sales.",
};

/* -----------------------------------------------------------------------
   Page Component
   ----------------------------------------------------------------------- */

export default function BookstorePage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          title="BookLeaf Bookstore"
          subtitle="Discover stories from India's finest independent authors. Browse, buy, and support indie writers."
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Bookstore' },
          ]}
        />
        <BookstoreCatalog />
      </main>
      <Footer />
    </>
  );
}
