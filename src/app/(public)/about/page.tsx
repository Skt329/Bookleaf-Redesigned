import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Globe,
  Heart,
  Leaf,
  MapPin,
  Shield,
  Sparkles,
  Star,
  Target,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OFFICE_ADDRESSES, TRUST_STATS } from '@/constants';
import { Navbar, Footer } from '@/components/layout';

/* -----------------------------------------------------------------------
   SEO Metadata
   ----------------------------------------------------------------------- */

export const metadata: Metadata = {
  title: "About BookLeaf Publishing — Our Story & Mission",
  description:
    "Learn about BookLeaf Publishing, India's most trusted self-publishing platform. Founded in 2020, featured on Shark Tank India. 12,000+ authors across 150+ countries.",
};

/* -----------------------------------------------------------------------
   Static Data
   ----------------------------------------------------------------------- */

const TEAM_MEMBERS = [
  { name: 'Amir H. Shah', role: 'CEO & Founder', initials: 'AS' },
  { name: 'Priya Menon', role: 'Chief Technology Officer', initials: 'PM' },
  { name: 'Rohan Kapoor', role: 'Head of Publishing', initials: 'RK' },
  { name: 'Ananya Das', role: 'Creative Director', initials: 'AD' },
  { name: 'Vikram Joshi', role: 'Marketing Head', initials: 'VJ' },
  { name: 'Meera Iyer', role: 'Author Relations Lead', initials: 'MI' },
];

const VALUES = [
  {
    icon: Shield,
    title: 'Transparency',
    description:
      'No hidden fees, no surprises. Clear pricing, honest timelines, and open communication at every stage of your publishing journey.',
  },
  {
    icon: Target,
    title: 'Quality',
    description:
      'Every book meets professional publishing standards — from meticulous editing to stunning cover design and flawless typesetting.',
  },
  {
    icon: Heart,
    title: 'Author-First',
    description:
      'You retain 100% copyright and creative control. We exist to serve authors, not the other way around.',
  },
];

/* -----------------------------------------------------------------------
   Page Component
   ----------------------------------------------------------------------- */

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ===== HERO ===== */}
        <section
          className="section-dark relative overflow-hidden"
          aria-labelledby="about-hero-heading"
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-[0.08]"
              style={{
                background: 'radial-gradient(circle, var(--bl-brand-accent), transparent 70%)',
              }}
            />
            <div className="absolute top-16 right-[12%] w-12 h-12 rounded-full border-2 border-brand-accent/20 animate-float" />
            <div className="absolute bottom-20 left-[8%] hidden md:block">
              <BookOpen className="w-20 h-20 text-text-inverse/[0.06]" strokeWidth={1} />
            </div>
            <div className="absolute top-28 left-[25%] hidden lg:block">
              <Leaf className="w-12 h-12 text-text-inverse/[0.08]" strokeWidth={1} />
            </div>
          </div>

          <div className="container-bookleaf relative z-10 text-center py-16 md:py-24">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-accent/30 bg-brand-accent/10 text-brand-accent text-caption font-semibold tracking-wide uppercase mb-6">
              <Sparkles className="w-4 h-4" />
              Est. 2020
            </span>

            <h1
              id="about-hero-heading"
              className="font-display text-display-lg md:text-display-xl max-w-3xl mx-auto"
            >
              Our <span className="text-brand-accent">Story</span>
            </h1>

            <p className="mt-6 text-body-lg md:text-heading-sm max-w-2xl mx-auto opacity-80 font-body">
              We&apos;re on a mission to democratize publishing in India and give
              every voice the platform it deserves.
            </p>
          </div>
        </section>

        {/* ===== STORY ===== */}
        <section className="section bg-surface-background" aria-labelledby="story-heading">
          <div className="container-bookleaf">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Text */}
              <div>
                <h2
                  id="story-heading"
                  className="font-display text-display-sm md:text-display-md text-text-primary"
                >
                  From a Small Idea to{' '}
                  <span className="text-brand-accent">12,000+ Authors</span>
                </h2>

                <div className="mt-8 space-y-5 text-body-md text-text-secondary font-body leading-relaxed">
                  <p>
                    BookLeaf Publishing was founded in 2020 with a single belief: every story
                    deserves to be told, and every author deserves a partner who puts their
                    vision first.
                  </p>
                  <p>
                    What started as a small team in Srinagar, Kashmir, has grown into India&apos;s
                    most trusted self-publishing platform — now operating from three offices
                    across two countries, serving authors in 150+ nations.
                  </p>
                  <p>
                    Our approach is simple — transparent pricing, professional-grade production,
                    and an author-first philosophy that puts you in control of your creative
                    journey from first draft to global distribution.
                  </p>
                </div>

                <Link
                  href="/get-published"
                  className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-primary text-text-inverse font-semibold text-body-md hover:bg-brand-primary-hover transition-colors duration-150 no-underline"
                >
                  Start Publishing
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Decorative illustration */}
              <div className="relative flex items-center justify-center" aria-hidden="true">
                <div className="w-64 h-80 md:w-80 md:h-96 rounded-2xl bg-brand-primary/5 border border-border-muted flex flex-col items-center justify-center gap-6 relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                      background:
                        'repeating-linear-gradient(45deg, var(--bl-brand-primary) 0, var(--bl-brand-primary) 1px, transparent 0, transparent 50%)',
                      backgroundSize: '20px 20px',
                    }}
                  />
                  <BookOpen className="w-16 h-16 text-brand-primary/40" strokeWidth={1.2} />
                  <Leaf className="w-12 h-12 text-brand-accent/50" strokeWidth={1.2} />
                  <p className="font-display text-heading-sm text-text-muted">
                    Stories That <span className="text-brand-accent">Matter</span>
                  </p>
                </div>
                {/* Floating accents */}
                <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-brand-accent/10 border border-brand-accent/20" />
                <div className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full bg-brand-primary/10 border border-brand-primary/20" />
              </div>
            </div>
          </div>
        </section>

        {/* ===== STATS ===== */}
        <section className="section bg-surface-muted" aria-labelledby="stats-heading">
          <div className="container-bookleaf">
            <h2 id="stats-heading" className="sr-only">
              BookLeaf in Numbers
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
              {TRUST_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="card p-6 md:p-8 text-center"
                >
                  <p className="font-display text-display-sm md:text-display-md text-brand-primary font-bold">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-body-sm text-text-muted font-body">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SHARK TANK BADGE ===== */}
        <section className="section bg-surface-background" aria-label="Shark Tank India feature">
          <div className="container-bookleaf">
            <div className="card-accent p-8 md:p-12 text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-accent/10 text-brand-accent text-caption font-bold uppercase tracking-wider mb-4">
                <Star className="w-4 h-4 fill-brand-accent" />
                Featured
              </div>
              <h2 className="font-display text-display-sm md:text-display-md text-text-primary">
                As Seen on{' '}
                <span className="text-brand-accent">Shark Tank India</span>{' '}
                🦈
              </h2>
              <p className="mt-4 text-body-lg text-text-secondary font-body max-w-xl mx-auto">
                BookLeaf was featured on Shark Tank India, recognized for
                revolutionizing the self-publishing landscape in India with
                transparent pricing and author-first values.
              </p>
            </div>
          </div>
        </section>

        {/* ===== OFFICES ===== */}
        <section className="section bg-surface-muted" aria-labelledby="offices-heading">
          <div className="container-bookleaf">
            <div className="text-center mb-14">
              <h2
                id="offices-heading"
                className="font-display text-display-sm md:text-display-md text-text-primary"
              >
                Our <span className="text-brand-accent">Offices</span>
              </h2>
              <p className="mt-4 text-body-lg text-text-muted max-w-xl mx-auto font-body">
                A global team serving authors around the world.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {OFFICE_ADDRESSES.map((office) => (
                <div key={office.name} className="card p-6 md:p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-5 h-5 text-brand-primary" />
                  </div>
                  <h3 className="font-display text-heading-sm text-text-primary">
                    {office.name}
                  </h3>
                  <p className="mt-2 text-body-sm text-text-muted font-body">
                    {office.line1}
                  </p>
                  <p className="text-body-sm text-text-muted font-body">{office.line2}</p>
                  <span className="inline-block mt-3 px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent text-caption font-semibold">
                    {office.country}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TEAM ===== */}
        <section className="section bg-surface-background" aria-labelledby="team-heading">
          <div className="container-bookleaf">
            <div className="text-center mb-14">
              <h2
                id="team-heading"
                className="font-display text-display-sm md:text-display-md text-text-primary"
              >
                Meet the <span className="text-brand-accent">Team</span>
              </h2>
              <p className="mt-4 text-body-lg text-text-muted max-w-xl mx-auto font-body">
                The people behind every published story.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
              {TEAM_MEMBERS.map((member) => (
                <div key={member.name} className="text-center group">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-brand-primary/10 border-2 border-border flex items-center justify-center mx-auto group-hover:border-brand-accent transition-colors duration-200">
                    <span className="font-display text-heading-md md:text-heading-lg text-brand-primary font-bold">
                      {member.initials}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-body-sm text-text-primary font-semibold">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-caption text-text-muted font-body">
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== VALUES ===== */}
        <section className="section bg-surface-muted" aria-labelledby="values-heading">
          <div className="container-bookleaf">
            <div className="text-center mb-14">
              <h2
                id="values-heading"
                className="font-display text-display-sm md:text-display-md text-text-primary"
              >
                Our <span className="text-brand-accent">Values</span>
              </h2>
              <p className="mt-4 text-body-lg text-text-muted max-w-xl mx-auto font-body">
                The principles that guide everything we do.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {VALUES.map((value) => {
                const Icon = value.icon;
                return (
                  <div key={value.title} className="card p-6 md:p-8 text-center">
                    <div className="w-14 h-14 rounded-xl bg-brand-accent/10 flex items-center justify-center mx-auto mb-5">
                      <Icon className="w-7 h-7 text-brand-accent" />
                    </div>
                    <h3 className="font-display text-heading-sm text-text-primary">
                      {value.title}
                    </h3>
                    <p className="mt-3 text-body-sm text-text-muted font-body">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="section-dark section" aria-label="Call to action">
          <div className="container-bookleaf text-center">
            <h2 className="font-display text-display-sm md:text-display-md">
              Ready to Publish Your{' '}
              <span className="text-brand-accent">Book?</span>
            </h2>
            <p className="mt-4 text-body-lg max-w-xl mx-auto opacity-80 font-body">
              Join 12,000+ authors who chose BookLeaf. Your story is next.
            </p>
            <Link
              href="/get-published"
              className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-brand-accent text-brand-dark font-semibold text-body-md hover:bg-brand-accent-hover transition-colors duration-150 shadow-gold no-underline"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
