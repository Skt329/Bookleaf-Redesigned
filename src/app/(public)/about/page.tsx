import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
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
    "Learn about BookLeaf Publishing, India's most trusted self-publishing platform. Founded in 2016, featured on Shark Tank India. 12,000+ authors across 150+ countries.",
};

/* -----------------------------------------------------------------------
   Static Data
   ----------------------------------------------------------------------- */

const FOUNDERS = [
  {
    name: 'Musavir Khurshid',
    role: 'Co-founder & CEO',
    image: 'https://static.wixstatic.com/media/6d2cdc_5d5f92d0f92e40d5be799e3cc0f60456~mv2.jpeg/v1/crop/x_363,y_334,w_784,h_788/fill/w_216,h_217,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/1701674518145.jpeg',
    bio: 'Musavir is an Author, a bibliophile, a painter, an occasional photographer, and a full-time entrepreneur. With a hunger to always strive for the better, he has helped the team individually explore their innovative sides and implement it in their work.',
  },
  {
    name: 'Shivangi Verma',
    role: 'Co-founder & COO',
    image: 'https://static.wixstatic.com/media/6d2cdc_ed510c82e54a4f2b837e26259c0d23f2~mv2.jpeg/v1/crop/x_250,y_707,w_713,h_716/fill/w_216,h_217,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/1705874438245.jpeg',
    bio: 'Shivangi is the co-founder and COO at BookLeaf Publishing. She is devotedly involved in day to day running in the company. Apart from playing the key role, she is also an author and an avid reader, having many poetry collections to her credit.',
  },
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
              Est. 2016
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
                  Empowering Your Words,{' '}
                  <span className="text-brand-accent">Enriching the World</span>
                </h2>

                <div className="mt-8 space-y-5 text-body-md text-text-secondary font-body leading-relaxed">
                  <p>
                    At BookLeaf Publishing, we believe in the transformative power of stories and the profound impact they can make on our world. Our mission is to empower every budding author by turning their visions into reality. In our journey to revolutionize the publishing industry, we are committed to continuous innovation and evolution, ensuring that the process of publishing is not just effective but also enriching for every author.
                  </p>
                  <p>
                    Founded in 2016, BookLeaf Publishing emerged as a beacon for first-time authors seeking a reliable and reputable partner to guide them through the publishing landscape. As a vanguard of the self-publishing industry, we pride ourselves on our 8+ years of experience in empowering authors, ensuring their books are not only published but also resonate with readers universally.
                  </p>
                  <p>
                    At BookLeaf, we are more than just a publishing company; our platform is designed to break boundaries, providing authors with the freedom and independence they seek in bringing their stories to life. Join us in our mission to reshape the world of publishing, one story at a time.
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
        <section className="section bg-surface-background border-t border-border" aria-labelledby="team-heading">
          <div className="container-bookleaf">
            <div className="text-center mb-14">
              <h2
                id="team-heading"
                className="font-display text-body-lg text-brand-primary font-bold uppercase tracking-widest"
              >
                TEAM
              </h2>
              <div className="w-12 h-0.5 bg-brand-primary mx-auto mt-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 max-w-4xl mx-auto">
              {FOUNDERS.map((founder) => (
                <div key={founder.name} className="flex flex-col items-center text-center group">
                  {/* Photo wrapper */}
                  <div className="relative w-44 h-44 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-border group-hover:border-brand-accent transition-colors duration-300 shadow-md">
                    <Image
                      src={founder.image}
                      alt={`${founder.name} - ${founder.role}`}
                      fill
                      sizes="(max-width: 768px) 176px, 208px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Name and Role */}
                  <h3 className="mt-6 font-display text-heading-xs text-text-primary font-bold">
                    {founder.name}
                  </h3>
                  <p className="text-body-sm text-text-secondary font-body italic mt-1">
                    ({founder.role})
                  </p>

                  {/* Bio */}
                  <p className="mt-4 text-body-sm text-text-muted leading-relaxed font-body max-w-md">
                    {founder.bio}
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
