import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Navbar, Footer } from '@/components/layout';
import { PageHeader } from '@/components/shared';
import { OrderTracker } from './order-tracker';

export const metadata: Metadata = {
  title: 'Track Your Order — BookLeaf Bookstore',
  description:
    'Track your BookLeaf order status using your order number and email address.',
};

export default function OrderTrackingPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          title="Track Your Order"
          subtitle="Enter your order number and email to check your order status."
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Bookstore', href: '/bookstore' },
            { label: 'Track Order' },
          ]}
        />
        <section className="section-padding">
          <div className="container-width max-w-2xl mx-auto">
            <Suspense fallback={<div className="card p-6 animate-pulse"><div className="h-10 bg-surface-muted rounded mb-4" /><div className="h-10 bg-surface-muted rounded mb-4" /><div className="h-12 bg-surface-muted rounded" /></div>}>
              <OrderTracker />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
