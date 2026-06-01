import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calendar, Mail, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Navbar, Footer } from '@/components/layout';
import { PageHeader } from '@/components/shared';

/* -----------------------------------------------------------------------
   SEO Metadata
   ----------------------------------------------------------------------- */

export const metadata: Metadata = {
  title: 'Blog — BookLeaf Publishing | Writing Tips & Publishing Insights',
  description:
    'Expert writing tips, self-publishing guides, and industry insights from BookLeaf Publishing. Learn how to write, publish, and market your book.',
};

/* -----------------------------------------------------------------------
   Static Data
   ----------------------------------------------------------------------- */

const CATEGORIES = [
  'All',
  'Writing Tips',
  'Publishing',
  'Marketing',
  'Author Stories',
  'Industry News',
];

const BLOG_POSTS = [
  {
    title: 'How to Self-Publish in India in 2025',
    excerpt:
      'A comprehensive guide to navigating the Indian self-publishing landscape — from manuscript preparation to global distribution and marketing strategies.',
    author: 'Amir Shah',
    initials: 'AS',
    date: 'Jan 15, 2025',
    category: 'Publishing',
    gradient: 'from-brand-primary to-brand-primary-light',
  },
  {
    title: '5 Tips for First-Time Authors',
    excerpt:
      'Writing your first book is a monumental achievement. Here are five essential tips to help you navigate the journey from blank page to published author.',
    author: 'Priya Menon',
    initials: 'PM',
    date: 'Jan 8, 2025',
    category: 'Writing Tips',
    gradient: 'from-brand-accent to-brand-accent-light',
  },
  {
    title: 'Understanding Book Royalties',
    excerpt:
      'Confused about royalty structures? We break down how platform royalties, author splits, and direct sales work — so you know exactly what you earn.',
    author: 'Rohan Kapoor',
    initials: 'RK',
    date: 'Dec 28, 2024',
    category: 'Publishing',
    gradient: 'from-brand-primary-light to-brand-accent',
  },
  {
    title: "BookLeaf's Journey on Shark Tank India",
    excerpt:
      'From a small startup in Kashmir to the Shark Tank India stage — here\'s the inside story of how BookLeaf pitched, pivoted, and prevailed.',
    author: 'Ananya Das',
    initials: 'AD',
    date: 'Dec 15, 2024',
    category: 'Author Stories',
    gradient: 'from-brand-accent to-brand-primary',
  },
  {
    title: 'The Art of Book Cover Design',
    excerpt:
      'Your book cover is the first impression readers get. Learn the principles of effective cover design and how to make your book stand out on shelves.',
    author: 'Vikram Joshi',
    initials: 'VJ',
    date: 'Dec 5, 2024',
    category: 'Marketing',
    gradient: 'from-brand-primary to-brand-accent-light',
  },
  {
    title: "Writing Your First Novel: A Beginner's Guide",
    excerpt:
      'From outlining your plot to developing compelling characters — everything you need to know to start writing your debut novel with confidence.',
    author: 'Meera Iyer',
    initials: 'MI',
    date: 'Nov 28, 2024',
    category: 'Writing Tips',
    gradient: 'from-brand-accent-light to-brand-primary-light',
  },
];

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
          <div className="container-bookleaf">
            {/* Category Filter Row */}
            <div className="flex flex-wrap gap-2 mb-10">
              {CATEGORIES.map((cat, i) => (
                <span
                  key={cat}
                  className={cn(
                    'px-4 py-2 rounded-full text-body-sm font-medium transition-colors duration-200 cursor-pointer border',
                    i === 0
                      ? 'bg-brand-primary text-text-inverse border-brand-primary'
                      : 'bg-surface-card text-text-secondary border-border hover:border-brand-accent hover:text-text-primary',
                  )}
                >
                  {cat}
                </span>
              ))}
            </div>

            {/* Posts Grid */}
            <h2 id="blog-heading" className="sr-only">
              Blog Posts
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {BLOG_POSTS.map((post) => (
                <article key={post.title} className="card overflow-hidden group">
                  {/* Header Gradient */}
                  <div
                    className={cn(
                      'h-44 bg-gradient-to-br relative flex items-end p-5',
                      post.gradient,
                    )}
                  >
                    <span className="badge bg-surface-card/90 text-text-primary backdrop-blur-sm text-caption">
                      {post.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-display text-heading-sm text-text-primary leading-snug">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-body-sm text-text-secondary font-body line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Meta Row */}
                    <div className="mt-5 flex items-center justify-between border-t border-border-muted pt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-brand-primary/10 flex items-center justify-center">
                          <span className="text-[0.625rem] font-bold text-brand-primary font-display">
                            {post.initials}
                          </span>
                        </div>
                        <div>
                          <p className="text-caption text-text-primary font-medium font-body leading-tight">
                            {post.author}
                          </p>
                          <p className="text-caption text-text-muted font-body leading-tight">
                            {post.date}
                          </p>
                        </div>
                      </div>

                      <span className="text-body-sm font-semibold text-brand-primary group-hover:text-brand-accent transition-colors duration-200">
                        Read More →
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
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
              Have a Story to{' '}
              <span className="text-brand-accent">Share?</span>
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
