import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Navbar, Footer } from '@/components/layout';
import { PageHeader, VideoReviewPlayer } from '@/components/shared';

/* -----------------------------------------------------------------------
   SEO Metadata
   ----------------------------------------------------------------------- */

export const metadata: Metadata = {
  title: 'Author Reviews — BookLeaf Publishing | 4.8★ from 3,700+ Reviews',
  description:
    'Read genuine reviews from BookLeaf authors. Rated 4.8/5 from 3,700+ Google Reviews. See why authors trust BookLeaf for self-publishing in India.',
};

/* -----------------------------------------------------------------------
   Static Data
   ----------------------------------------------------------------------- */

const REVIEWS = [
  {
    stars: 5,
    text: 'BookLeaf made my dream of becoming a published author come true. The entire process was seamless — from editing to cover design to distribution. I couldn\'t be happier with the result.',
    author: 'Rajesh Kumar',
    book: 'The Mountain\'s Echo',
    source: 'Google' as const,
  },
  {
    stars: 5,
    text: 'Professional editing, stunning cover design, and transparent pricing. What more could an author ask for? The team went above and beyond to ensure my book was perfect.',
    author: 'Sneha Sharma',
    book: 'Whispers of Mumbai',
    source: 'Google' as const,
  },
  {
    stars: 4,
    text: 'The team was incredibly supportive throughout the publishing journey. They answered every question and kept me updated at every stage. Minor delays in typesetting, but the final product was beautiful.',
    author: 'Arjun Patel',
    book: 'Code of Honor',
    source: 'Video' as const,
  },
  {
    stars: 5,
    text: 'From manuscript to published book in just 45 days! The speed and quality were remarkable. My cookbook looks absolutely professional and I\'ve already sold 200 copies.',
    author: 'Meenakshi Rao',
    book: 'Recipes of Love',
    source: 'Google' as const,
  },
  {
    stars: 5,
    text: 'I compared 5 publishers before choosing BookLeaf. Their transparent pricing, no hidden fees, and 80% royalty split made the decision easy. Best investment I\'ve made in my writing career.',
    author: 'Farhan Ahmed',
    book: 'Digital Nomad',
    source: 'Internal' as const,
  },
  {
    stars: 5,
    text: 'The royalty transparency is unmatched. I can track every sale in real-time on my dashboard. Quarterly payouts arrive like clockwork. This is how publishing should work.',
    author: 'Kavitha Nair',
    book: 'Monsoon Diaries',
    source: 'Google' as const,
  },
  {
    stars: 4,
    text: 'Great experience overall. The cover design team truly understood my vision and created something stunning. Would love a wider range of marketing packages, but the quality is top-notch.',
    author: 'Siddharth Verma',
    book: 'Startup Stories',
    source: 'Video' as const,
  },
  {
    stars: 5,
    text: 'As a first-time author, I was nervous about self-publishing. BookLeaf held my hand through every step. My dedicated publishing manager, Ananya, was absolutely wonderful.',
    author: 'Pooja Bhatt',
    book: 'Finding Light',
    source: 'Google' as const,
  },
];

const SOURCE_STYLES: Record<string, string> = {
  Google: 'bg-status-info/10 text-status-info',
  Video: 'bg-status-danger/10 text-status-danger',
  Internal: 'bg-brand-primary/10 text-brand-primary',
};

/* -----------------------------------------------------------------------
   Helpers
   ----------------------------------------------------------------------- */

function StarRating({ count, size = 'w-4 h-4' }: { count: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            size,
            i < count
              ? 'text-brand-accent fill-brand-accent'
              : 'text-border fill-border',
          )}
        />
      ))}
    </div>
  );
}

/* -----------------------------------------------------------------------
   Page Component
   ----------------------------------------------------------------------- */

export default function ReviewsPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          title="Author Reviews"
          subtitle="Hear from the authors who trusted BookLeaf to publish their stories."
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Author Reviews' },
          ]}
        />

        {/* ===== OVERALL STATS ===== */}
        <section className="section bg-surface-background animate-fade-in" aria-labelledby="rating-heading">
          <div className="container-bookleaf">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center max-w-5xl mx-auto">
              {/* Left Column: Trust Stats */}
              <div className="lg:col-span-7 space-y-6">
                <h2 id="rating-heading" className="font-display text-display-sm md:text-display-md text-text-primary leading-tight">
                  India&apos;s Most <span className="text-brand-accent">Trusted</span> Self-Publishing Partner
                </h2>
                <p className="font-body text-body-md text-text-secondary leading-relaxed">
                  We are rated <strong className="text-text-primary">4.8/5</strong> based on thousands of verified author reviews on Google and Trustpilot. Join our growing community of writers who realized their dream of becoming published authors.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Authors Published', value: '12,000+' },
                    { label: 'Countries Distributed', value: '150+' },
                    { label: 'Rating on Google', value: '4.8 ★' },
                  ].map((stat) => (
                    <div key={stat.label} className="p-4 rounded-xl bg-surface-card border border-border text-center shadow-sm">
                      <p className="font-display text-heading-sm text-brand-primary font-bold">
                        {stat.value}
                      </p>
                      <p className="text-[0.68rem] text-text-muted font-body font-semibold mt-1 uppercase tracking-wider">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right Column: Trust Badge Image */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative group overflow-hidden rounded-2xl border border-brand-accent/20 bg-brand-primary/5 p-2 shadow-gold max-w-[340px]">
                  <Image
                    src="/reviews_trust_badge.png"
                    alt="BookLeaf Publishing 4.8★ Rating trust badge"
                    width={320}
                    height={320}
                    className="rounded-xl object-contain hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== REVIEWS GRID ===== */}
        <section className="section bg-surface-muted" aria-labelledby="reviews-heading">
          <div className="container-bookleaf">
            <div className="text-center mb-12">
              <h2
                id="reviews-heading"
                className="font-display text-display-sm md:text-display-md text-text-primary"
              >
                What Authors <span className="text-brand-accent">Say</span>
              </h2>
              <p className="mt-4 text-body-lg text-text-muted max-w-xl mx-auto font-body">
                Real stories from real authors — unedited and unfiltered.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {REVIEWS.map((review) => (
                <div key={review.author} className="card p-6 flex flex-col">
                  <StarRating count={review.stars} />
                  <p className="mt-4 text-body-sm text-text-secondary font-body flex-1 leading-relaxed">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div className="mt-5 pt-4 border-t border-border-muted">
                    <p className="text-body-sm text-text-primary font-semibold font-body">
                      {review.author}
                    </p>
                    <p className="text-caption text-text-muted font-body italic">
                      {review.book}
                    </p>
                    <span
                      className={cn(
                        'badge mt-2 text-[0.65rem] font-semibold',
                        SOURCE_STYLES[review.source],
                      )}
                    >
                      {review.source}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== VIDEO REVIEWS ===== */}
        <section className="section bg-surface-background border-t border-border" aria-labelledby="video-heading">
          <div className="container-bookleaf">
            <div className="text-center mb-12">
              <h2
                id="video-heading"
                className="font-display text-display-sm md:text-display-md text-text-primary"
              >
                Watch Our Authors Share Their <span className="text-brand-accent">Stories</span>
              </h2>
              <p className="mt-4 text-body-lg text-text-secondary font-body max-w-xl mx-auto">
                Hear directly from published BookLeaf authors about their
                experience — from first draft to published book.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                {
                  id: 'gT5s8VpZqXo',
                  author: 'Antara Chakrabarti',
                  book: 'An Ounce of Poetry',
                  gradient: 'from-brand-primary to-brand-primary-light',
                },
                {
                  id: 'IQv1hNJgfR4',
                  author: 'Onkar Kulkarni',
                  book: 'Petrichor',
                  gradient: 'from-brand-accent to-brand-accent-light',
                },
                {
                  id: 'SwAwvyNMt-o',
                  author: 'Ankit Kumar',
                  book: 'The Pondering Thoughts',
                  gradient: 'from-brand-primary-light to-brand-accent',
                },
                {
                  id: 'yTeXLVidns0',
                  author: 'Asif Motorwala',
                  book: 'इकीस एहसास माफ़',
                  gradient: 'from-brand-accent to-brand-primary',
                },
              ].map((video) => (
                <div key={video.id} className="card overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300 border border-border animate-fade-in">
                  <VideoReviewPlayer
                    videoId={video.id}
                    title={`${video.author} - BookLeaf Author Review`}
                    gradient={video.gradient}
                  />
                  <div className="p-5 border-t border-border-muted bg-surface-card flex flex-col justify-between flex-grow">
                    <div>
                      <p className="font-display text-heading-xs text-text-primary font-bold">
                        {video.author}
                      </p>
                      <p className="text-caption text-text-secondary font-body italic mt-1">
                        Author of &ldquo;{video.book}&rdquo;
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-border-muted pt-3">
                      <span className="text-[0.7rem] font-semibold text-status-success bg-status-success/10 px-2 py-0.5 rounded-full font-body">
                        ✓ Verified Author
                      </span>
                      <a
                        href={`https://www.youtube.com/watch?v=${video.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 text-[0.75rem] font-semibold text-brand-primary hover:text-brand-accent transition-colors"
                      >
                        Watch on YouTube ↗
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="section-dark section" aria-label="Call to action">
          <div className="container-bookleaf text-center">
            <h2 className="font-display text-display-sm md:text-display-md">
              Ready to Become Our Next{' '}
              <span className="text-brand-accent">Success Story?</span>
            </h2>
            <p className="mt-4 text-body-lg max-w-xl mx-auto opacity-80 font-body">
              Join 12,000+ authors who chose BookLeaf. Your story deserves to be
              told.
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
