import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Navbar, Footer } from '@/components/layout';
import { PageHeader } from '@/components/shared';
import { RoyaltyCalculatorClient } from './royalty-calculator-client';

/* -----------------------------------------------------------------------
   SEO Metadata
   ----------------------------------------------------------------------- */

export const metadata: Metadata = {
  title: 'Royalty Calculator — BookLeaf Publishing',
  description:
    'Calculate your book royalties with BookLeaf Publishing. See exactly how much you earn per copy sold across Amazon India, Flipkart, and more.',
};

/* -----------------------------------------------------------------------
   Page Component
   ----------------------------------------------------------------------- */

export default function RoyaltyCalculatorPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          title="Royalty Calculator"
          subtitle="See exactly how much you earn per copy — transparent, always."
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Royalty Calculator' },
          ]}
        />

        <RoyaltyCalculatorClient />

        {/* ===== CTA ===== */}
        <section className="section-dark section" aria-label="Call to action">
          <div className="container-bookleaf text-center">
            <h2 className="font-display text-display-sm md:text-display-md">
              Ready to Start{' '}
              <span className="text-brand-accent">Earning?</span>
            </h2>
            <p className="mt-4 text-body-lg max-w-xl mx-auto opacity-80 font-body">
              Publish your book with BookLeaf and enjoy the highest author
              royalties in the industry.
            </p>
            <Link
              href="/get-published"
              className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-brand-accent text-brand-dark font-semibold text-body-md hover:bg-brand-accent-hover transition-colors duration-150 shadow-gold no-underline"
            >
              Get Published
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
