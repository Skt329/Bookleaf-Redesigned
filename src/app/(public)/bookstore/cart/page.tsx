import type { Metadata } from 'next';
import { Navbar, Footer } from '@/components/layout';
import { PageHeader } from '@/components/shared';
import { CartPageClient } from './cart-page-client';

/* -----------------------------------------------------------------------
   SEO Metadata
   ----------------------------------------------------------------------- */

export const metadata: Metadata = {
  title: 'Your Cart — BookLeaf Bookstore',
  description:
    'Review your cart and proceed to checkout. Buy books from independent Indian authors at BookLeaf Bookstore.',
};

/* -----------------------------------------------------------------------
   Page Component
   ----------------------------------------------------------------------- */

export default function CartPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          title="Your Cart"
          subtitle="Review your selections before checkout."
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Bookstore', href: '/bookstore' },
            { label: 'Cart' },
          ]}
        />
        <CartPageClient />
      </main>
      <Footer />
    </>
  );
}
