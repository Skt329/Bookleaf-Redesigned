import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Navbar, Footer } from '@/components/layout';
import { PageHeader } from '@/components/shared';
import { CheckoutForm } from './checkout-form';

export const metadata: Metadata = {
  title: 'Checkout — BookLeaf Bookstore',
  description:
    'Complete your purchase and support independent Indian authors.',
};

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          title="Checkout"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Bookstore', href: '/bookstore' },
            { label: 'Checkout' },
          ]}
        />
        <section className="section-padding">
          <div className="container-width">
            <Suspense fallback={<div className="text-center py-12 text-text-muted">Loading checkout form...</div>}>
              <CheckoutForm />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
