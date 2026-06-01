import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Clock,
  GraduationCap,
  Heart,
  Laptop,
  MapPin,
  Send,
  Shield,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Navbar, Footer } from '@/components/layout';
import { PageHeader } from '@/components/shared';

/* -----------------------------------------------------------------------
   SEO Metadata
   ----------------------------------------------------------------------- */

export const metadata: Metadata = {
  title: 'Careers at BookLeaf Publishing — Join Our Team',
  description:
    "Join BookLeaf Publishing and help democratize publishing in India. Explore open positions in editorial, engineering, marketing, and operations.",
};

/* -----------------------------------------------------------------------
   Static Data
   ----------------------------------------------------------------------- */

const VALUES = [
  {
    icon: Sparkles,
    title: 'Innovation',
    description:
      'We embrace new technologies and creative approaches to publishing, from AI-assisted editing to real-time analytics.',
  },
  {
    icon: Heart,
    title: 'Author-First',
    description:
      'Every decision we make starts with asking: how does this help our authors? Their success is our success.',
  },
  {
    icon: Shield,
    title: 'Transparency',
    description:
      'Open communication, honest pricing, and clear expectations — always. No fine print, no hidden fees.',
  },
  {
    icon: TrendingUp,
    title: 'Growth',
    description:
      'We invest in your personal and professional development. Learn, grow, and shape the future of publishing.',
  },
];

const POSITIONS = [
  {
    title: 'Content Editor',
    department: 'Editorial',
    location: 'Remote (India)',
    type: 'Full-time',
    description:
      'Edit and polish manuscripts across fiction and non-fiction genres. Work directly with authors to bring their vision to life while maintaining professional publishing standards.',
  },
  {
    title: 'Full-Stack Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description:
      'Build and scale our author dashboard, bookstore platform, and internal tools. TypeScript, Next.js, and PostgreSQL experience preferred.',
  },
  {
    title: 'Marketing Manager',
    department: 'Marketing',
    location: 'New Delhi',
    type: 'Full-time',
    description:
      'Drive author acquisition and brand awareness through digital marketing, content strategy, and partnerships across India and globally.',
  },
  {
    title: 'Publishing Coordinator',
    department: 'Operations',
    location: 'Remote (India)',
    type: 'Part-time',
    description:
      'Coordinate the publishing pipeline from manuscript submission to final delivery. Ensure timely communication with authors at every stage.',
  },
];

const PERKS = [
  {
    icon: Laptop,
    title: 'Remote-Friendly',
    description: 'Work from anywhere in India',
  },
  {
    icon: GraduationCap,
    title: 'Learning Budget',
    description: '₹50,000/year for courses & conferences',
  },
  {
    icon: BookOpen,
    title: 'Book Allowance',
    description: 'Free books every month',
  },
  {
    icon: Clock,
    title: 'Flexible Hours',
    description: 'Results matter, not hours clocked',
  },
];

const DEPARTMENT_COLORS: Record<string, string> = {
  Editorial: 'bg-brand-accent/10 text-brand-accent',
  Engineering: 'bg-status-info/10 text-status-info',
  Marketing: 'bg-status-success/10 text-status-success',
  Operations: 'bg-brand-primary/10 text-brand-primary',
};

/* -----------------------------------------------------------------------
   Page Component
   ----------------------------------------------------------------------- */

export default function CareersPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          title="Careers"
          subtitle="Help us democratize publishing and give every voice a platform."
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Careers' },
          ]}
        />

        {/* ===== HERO ===== */}
        <section className="section bg-surface-background" aria-labelledby="careers-hero">
          <div className="container-bookleaf text-center">
            <h2
              id="careers-hero"
              className="font-display text-display-sm md:text-display-md text-text-primary"
            >
              Join the{' '}
              <span className="text-brand-accent">BookLeaf</span> Team
            </h2>
            <p className="mt-6 text-body-lg text-text-secondary font-body max-w-2xl mx-auto leading-relaxed">
              We&apos;re building the future of independent publishing in India.
              If you&apos;re passionate about books, technology, and empowering
              authors, we&apos;d love to hear from you.
            </p>
          </div>
        </section>

        {/* ===== VALUES ===== */}
        <section className="section bg-surface-muted" aria-labelledby="values-heading">
          <div className="container-bookleaf">
            <div className="text-center mb-12">
              <h2
                id="values-heading"
                className="font-display text-display-sm md:text-display-md text-text-primary"
              >
                Our <span className="text-brand-accent">Culture</span>
              </h2>
              <p className="mt-4 text-body-lg text-text-muted max-w-xl mx-auto font-body">
                The values that drive everything we do at BookLeaf.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {VALUES.map((value) => {
                const Icon = value.icon;
                return (
                  <div key={value.title} className="card p-6 text-center">
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

        {/* ===== OPEN POSITIONS ===== */}
        <section className="section bg-surface-background" aria-labelledby="positions-heading">
          <div className="container-bookleaf">
            <div className="text-center mb-12">
              <h2
                id="positions-heading"
                className="font-display text-display-sm md:text-display-md text-text-primary"
              >
                Open <span className="text-brand-accent">Positions</span>
              </h2>
              <p className="mt-4 text-body-lg text-text-muted max-w-xl mx-auto font-body">
                Find your next role at BookLeaf Publishing.
              </p>
            </div>

            <div className="space-y-4 max-w-3xl mx-auto">
              {POSITIONS.map((pos) => (
                <div key={pos.title} className="card p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-display text-heading-sm text-text-primary">
                          {pos.title}
                        </h3>
                        <span
                          className={cn(
                            'badge text-[0.65rem] font-semibold',
                            DEPARTMENT_COLORS[pos.department] ?? 'bg-surface-muted text-text-muted',
                          )}
                        >
                          {pos.department}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-body-sm text-text-muted font-body mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {pos.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {pos.type}
                        </span>
                      </div>

                      <p className="text-body-sm text-text-secondary font-body">
                        {pos.description}
                      </p>
                    </div>

                    <a
                      href="mailto:careers@bookleafpub.in"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-primary text-text-inverse font-semibold text-body-sm hover:bg-brand-primary-hover transition-colors duration-150 shrink-0 no-underline"
                    >
                      Apply Now
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PERKS ===== */}
        <section className="section bg-surface-muted" aria-labelledby="perks-heading">
          <div className="container-bookleaf">
            <div className="text-center mb-12">
              <h2
                id="perks-heading"
                className="font-display text-display-sm md:text-display-md text-text-primary"
              >
                Perks &{' '}
                <span className="text-brand-accent">Benefits</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {PERKS.map((perk) => {
                const Icon = perk.icon;
                return (
                  <div key={perk.title} className="card p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-brand-primary" />
                    </div>
                    <h3 className="font-display text-body-md text-text-primary font-semibold">
                      {perk.title}
                    </h3>
                    <p className="mt-2 text-body-sm text-text-muted font-body">
                      {perk.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== OPEN APPLICATION CTA ===== */}
        <section className="section-dark section" aria-label="Open application">
          <div className="container-bookleaf text-center">
            <h2 className="font-display text-display-sm md:text-display-md">
              No Matching Position?{' '}
              <span className="text-brand-accent">Reach Out</span>
            </h2>
            <p className="mt-4 text-body-lg max-w-xl mx-auto opacity-80 font-body">
              We&apos;re always looking for talented people who share our passion
              for publishing. Send us your resume and we&apos;ll keep you in mind.
            </p>
            <a
              href="mailto:careers@bookleafpub.in"
              className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-brand-accent text-brand-dark font-semibold text-body-md hover:bg-brand-accent-hover transition-colors duration-150 shadow-gold no-underline"
            >
              <Send className="w-4 h-4" />
              Send Your Resume
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
