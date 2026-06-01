import type { Metadata } from 'next';
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
            <CheckoutForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
