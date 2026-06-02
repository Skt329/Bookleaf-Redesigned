import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import { Navbar, Footer } from '@/components/layout';
import { PageHeader } from '@/components/shared';
import { BlogContent } from './blog-content';

/* -----------------------------------------------------------------------
   SEO Metadata
   ----------------------------------------------------------------------- */

export const metadata: Metadata = {
  title: 'Blog — BookLeaf Publishing | Writing Tips & Publishing Insights',
  description:
    'Expert writing tips, self-publishing guides, and industry insights from BookLeaf Publishing. Learn how to write, publish, and market your book.',
};

/* -----------------------------------------------------------------------
   Page Component
   ----------------------------------------------------------------------- */

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          title="Blog"
          subtitle="Writing tips, publishing insights, and author stories from the BookLeaf team."
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Blog' },
          ]}
        />

        {/* ===== CATEGORIES & POSTS ===== */}
        <section className="section bg-surface-background" aria-labelledby="blog-heading">
          <h2 id="blog-heading" className="sr-only">
            Blog Posts
          </h2>
          <BlogContent />
        </section>

        {/* ===== NEWSLETTER ===== */}
        <section className="section bg-surface-muted" aria-labelledby="blog-newsletter">
          <div className="container-bookleaf">
            <div className="card p-8 md:p-12 max-w-2xl mx-auto text-center">
              <h2
                id="blog-newsletter"
                className="font-display text-display-sm text-text-primary"
              >
                Stay <span className="text-brand-accent">Updated</span>
              </h2>
              <p className="mt-4 text-body-md text-text-secondary font-body">
                Get weekly writing tips and publishing insights delivered to your
                inbox. Join 5,000+ subscribers.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-surface-card text-text-primary text-body-md font-body focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent"
                    aria-label="Email address"
                  />
                </div>
                <button className="px-6 py-3 rounded-lg bg-brand-primary text-text-inverse font-semibold text-body-md hover:bg-brand-primary-hover transition-colors duration-150 shrink-0">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="section-dark section" aria-label="Call to action">
          <div className="container-bookleaf text-center">
            <h2 className="font-display text-display-sm md:text-display-md">
              Have a Story to <span className="text-brand-accent">Share?</span>
            </h2>
            <p className="mt-4 text-body-lg max-w-xl mx-auto opacity-80 font-body">
              From manuscript to bookshelf — publish your book with BookLeaf and
              join our community of 12,000+ authors.
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
