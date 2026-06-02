'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView, animate } from 'framer-motion';
import {
  BookOpen,
  PenTool,
  Palette,
  LayoutTemplate,
  Hash,
  Globe,
  BarChart3,
  Check,
  Star,
  ArrowRight,
  Sparkles,
  Package,
  FileText,
  CreditCard,
  Factory,
  Truck,
  Leaf,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { TRUST_STATS, PUBLISHING_PACKAGES } from '@/constants';
import { Navbar } from '@/components/layout';
import { Footer } from '@/components/layout';

/* ==========================================================================
   Animation Variants
   ========================================================================== */

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: EASE_OUT_EXPO },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.08, ease: EASE_OUT_EXPO },
  }),
};

/* ==========================================================================
   Helper: Animated Counter
   ========================================================================== */

function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const numericPart = value.replace(/[^0-9]/g, '');
  const numericValue = parseInt(numericPart, 10);
  const textSuffix = value.replace(/[0-9,]/g, '');

  useEffect(() => {
    if (!isInView || !ref.current) return;
    const controls = animate(0, numericValue, {
      duration: 2,
      ease: EASE_OUT_EXPO as unknown as [number, number, number, number],
      onUpdate(v) {
        if (ref.current) {
          ref.current.textContent = `${Math.floor(v).toLocaleString('en-IN')}${textSuffix}${suffix}`;
        }
      },
    });
    return () => controls.stop();
  }, [isInView, numericValue, textSuffix, suffix]);

  return <span ref={ref}>0{textSuffix}{suffix}</span>;
}

/* ==========================================================================
   Helper: Typewriter Text
   ========================================================================== */

function TypewriterText({ text, className }: { text: string; className?: string }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 55);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className={className}>
      {displayed}
      <span
        className={cn(
          'inline-block w-[3px] h-[1em] ml-1 bg-brand-accent align-middle',
          done ? 'animate-pulse-soft' : 'animate-pulse-soft'
        )}
        aria-hidden="true"
      />
    </span>
  );
}

/* ==========================================================================
   Section: Hero
   ========================================================================== */

function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-surface-background"
      aria-labelledby="hero-heading"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, var(--bl-brand-accent), transparent 70%)' }}
        />
        {/* Floating leaf shapes */}
        <motion.div
          className="absolute top-20 right-[15%] w-16 h-16 rounded-full border-2 border-brand-accent/20"
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-32 left-[10%] w-10 h-10 rounded-full bg-brand-primary/5"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="absolute top-40 left-[20%] w-6 h-6 rounded-full bg-brand-accent/10"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
        {/* Book silhouette */}
        <motion.div
          className="absolute bottom-20 right-[8%] hidden md:block"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <BookOpen className="w-24 h-24 text-brand-primary/[0.06]" strokeWidth={1} />
        </motion.div>
        {/* Leaf icon */}
        <motion.div
          className="absolute top-32 right-[30%] hidden lg:block"
          animate={{ y: [0, -12, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Leaf className="w-14 h-14 text-brand-primary/[0.08]" strokeWidth={1} />
        </motion.div>
      </div>

      <div className="container-bookleaf relative z-10 flex flex-col items-center text-center py-24 md:py-32 lg:py-40">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-accent/30 bg-brand-accent/5 text-brand-accent mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-caption font-semibold tracking-wide uppercase">
            As Seen on Shark Tank India
          </span>
        </motion.div>

        <motion.h1
          id="hero-heading"
          className="font-display text-display-lg md:text-display-xl text-text-primary max-w-4xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE_OUT_EXPO }}
        >
          India&apos;s Best{' '}
          <span className="text-brand-accent">Self-Publishing</span>{' '}
          Platform
        </motion.h1>

        <motion.p
          className="mt-6 text-body-lg md:text-heading-sm text-text-secondary max-w-2xl font-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <TypewriterText text="Publish Your Book in Just 2 Weeks" />
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link
            href="/get-published"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-brand-accent text-brand-dark font-semibold text-body-md hover:bg-brand-accent-hover transition-colors duration-150 shadow-gold no-underline"
          >
            Publish My Book
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/bookstore"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg border-2 border-brand-primary text-brand-primary font-semibold text-body-md hover:bg-brand-primary hover:text-text-inverse transition-colors duration-150 no-underline"
          >
            Explore Bookstore
          </Link>
        </motion.div>

        {/* Quick stats */}
        <motion.div
          className="mt-16 flex flex-wrap justify-center gap-8 md:gap-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.85 }}
        >
          {TRUST_STATS.slice(0, 3).map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-heading-lg md:text-display-sm text-brand-primary font-bold">
                <AnimatedCounter value={stat.value} />
              </p>
              <p className="text-caption text-text-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Section: Trust Signals Marquee
   ========================================================================== */

function TrustMarqueeSection() {
  const items = [
    ...TRUST_STATS.map((s) => `${s.value} ${s.label}`),
    '⭐ As Seen on Shark Tank India',
  ];
  const doubled = [...items, ...items];

  return (
    <section
      className="relative overflow-hidden bg-brand-primary py-4"
      aria-label="Trust statistics"
    >
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="mx-8 text-body-sm font-semibold text-text-inverse/90 flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent inline-block shrink-0" />
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ==========================================================================
   Section: Services
   ========================================================================== */

const SERVICES = [
  {
    icon: PenTool,
    title: 'Editing & Proofreading',
    description: 'Professional editors polish your manuscript for clarity, grammar, and style consistency.',
  },
  {
    icon: Palette,
    title: 'Cover Design',
    description: 'Eye-catching custom covers designed to stand out on shelves and online storefronts.',
  },
  {
    icon: LayoutTemplate,
    title: 'Typesetting & Formatting',
    description: 'Publication-ready interior layouts for paperback, hardcover, and eBook formats.',
  },
  {
    icon: Hash,
    title: 'ISBN Assignment',
    description: 'Unique ISBN registration so your book is identifiable and catalog-ready worldwide.',
  },
  {
    icon: Globe,
    title: 'Global Distribution',
    description: 'Reach readers on Amazon, Flipkart, and major platforms across 150+ countries.',
  },
  {
    icon: BarChart3,
    title: 'Live Sales Reports',
    description: 'Real-time dashboard to track sales, royalties, and reader engagement metrics.',
  },
];

function ServicesSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      className="section bg-surface-background"
      aria-labelledby="services-heading"
    >
      <div className="container-bookleaf">
        <motion.div
          className="text-center mb-14"
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <h2
            id="services-heading"
            className="font-display text-display-md text-text-primary"
          >
            Everything You Need to{' '}
            <span className="text-brand-accent">Publish</span>
          </h2>
          <p className="mt-4 text-body-lg text-text-muted max-w-2xl mx-auto font-body">
            From manuscript to bookshelf — we handle every step of the publishing journey.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {SERVICES.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                custom={i}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group card p-6 md:p-8 cursor-default"
              >
                <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center mb-5 group-hover:bg-brand-accent/15 transition-colors duration-200">
                  <Icon className="w-6 h-6 text-brand-primary group-hover:text-brand-accent transition-colors duration-200" />
                </div>
                <h3 className="font-display text-heading-sm text-text-primary mb-2">
                  {service.title}
                </h3>
                <p className="text-body-sm text-text-muted leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Section: Publishing Packages
   ========================================================================== */

function PackagesSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      className="section bg-surface-muted"
      aria-labelledby="packages-heading"
    >
      <div className="container-bookleaf">
        <motion.div
          className="text-center mb-14"
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <h2
            id="packages-heading"
            className="font-display text-display-md text-text-primary"
          >
            Choose Your Publishing{' '}
            <span className="text-brand-accent">Package</span>
          </h2>
          <p className="mt-4 text-body-lg text-text-muted max-w-2xl mx-auto font-body">
            Transparent pricing, no hidden fees. Every package includes 100% royalty on author-driven sales.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {PUBLISHING_PACKAGES.map((pkg, i) => {
            const isPopular = 'popular' in pkg && pkg.popular;
            return (
              <motion.div
                key={pkg.name}
                custom={i}
                variants={scaleIn}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={cn(
                  'relative rounded-xl p-6 md:p-8 flex flex-col',
                  isPopular
                    ? 'card-accent border-2 border-brand-accent shadow-gold'
                    : 'card'
                )}
              >
                {isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-4 py-1 rounded-full bg-brand-accent text-brand-dark text-caption font-bold uppercase tracking-wide">
                    <Star className="w-3 h-3" />
                    Most Popular
                  </span>
                )}

                <h3 className="font-display text-heading-md text-text-primary">
                  {pkg.name}
                </h3>
                <p className="mt-2 font-display text-display-sm text-brand-primary font-bold">
                  {formatCurrency(pkg.price).replace('.00', '')}
                </p>
                <p className="text-caption text-text-muted mt-1">One-time payment</p>

                <ul className="mt-6 flex-1 flex flex-col gap-2.5">
                  {pkg.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-body-sm text-text-secondary"
                    >
                      <Check className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/get-published"
                  className={cn(
                    'mt-8 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-body-md transition-colors duration-150 no-underline',
                    isPopular
                      ? 'bg-brand-accent text-brand-dark hover:bg-brand-accent-hover shadow-gold'
                      : 'bg-brand-primary text-text-inverse hover:bg-brand-primary-hover'
                  )}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Section: How It Works
   ========================================================================== */

const STEPS = [
  { icon: Package, title: 'Select Package', description: 'Choose the plan that fits your needs and budget.' },
  { icon: FileText, title: 'Submit Manuscript', description: 'Upload your manuscript through our author portal.' },
  { icon: CreditCard, title: 'Agreement & Payment', description: 'Review terms and complete secure payment.' },
  { icon: Factory, title: 'Production', description: 'Our team edits, designs, and typesets your book in ~14 days.' },
  { icon: Truck, title: 'Published & Distributed', description: 'Your book goes live on major platforms worldwide.' },
];

function HowItWorksSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      className="section bg-surface-background"
      aria-labelledby="how-heading"
    >
      <div className="container-bookleaf">
        <motion.div
          className="text-center mb-14"
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <h2
            id="how-heading"
            className="font-display text-display-md text-text-primary"
          >
            How It <span className="text-brand-accent">Works</span>
          </h2>
          <p className="mt-4 text-body-lg text-text-muted max-w-xl mx-auto font-body">
            Five simple steps from manuscript to published book.
          </p>
        </motion.div>

        {/* Desktop: horizontal timeline */}
        <motion.div
          className="hidden md:flex items-start justify-between relative"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Connecting line */}
          <div
            className="absolute top-7 left-[10%] right-[10%] h-[2px] bg-border"
            aria-hidden="true"
          />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                custom={i}
                variants={fadeUp}
                className="relative flex flex-col items-center text-center flex-1 px-3"
              >
                <div className="relative z-10 w-14 h-14 rounded-full bg-surface-card border-2 border-brand-primary flex items-center justify-center shadow-card">
                  <Icon className="w-6 h-6 text-brand-primary" />
                </div>
                <span className="mt-2 text-caption font-bold text-brand-accent">
                  Step {i + 1}
                </span>
                <h3 className="mt-1 font-display text-body-md text-text-primary font-semibold">
                  {step.title}
                </h3>
                <p className="mt-1 text-caption text-text-muted max-w-[160px]">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Mobile: vertical timeline */}
        <motion.div
          className="md:hidden flex flex-col gap-0 relative"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Connecting line */}
          <div
            className="absolute top-7 bottom-7 left-7 w-[2px] bg-border"
            aria-hidden="true"
          />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                custom={i}
                variants={fadeUp}
                className="relative flex items-start gap-5 py-5"
              >
                <div className="relative z-10 w-14 h-14 rounded-full bg-surface-card border-2 border-brand-primary flex items-center justify-center shadow-card shrink-0">
                  <Icon className="w-6 h-6 text-brand-primary" />
                </div>
                <div className="pt-1">
                  <span className="text-caption font-bold text-brand-accent">
                    Step {i + 1}
                  </span>
                  <h3 className="font-display text-body-md text-text-primary font-semibold">
                    {step.title}
                  </h3>
                  <p className="mt-0.5 text-body-sm text-text-muted">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Section: Bestseller Showcase
   ========================================================================== */

const BESTSELLERS = [
  { title: 'The Silent Valley', author: 'Priya Sharma', genre: 'Literary Fiction', color: 'bg-brand-primary' },
  { title: 'Beyond the Horizon', author: 'Arjun Mehta', genre: 'Self-Help', color: 'bg-brand-accent' },
  { title: 'Whispers of Kashmir', author: 'Nazia Khan', genre: 'Poetry', color: 'bg-status-info' },
  { title: 'The Startup Playbook', author: 'Rohan Gupta', genre: 'Business', color: 'bg-brand-primary-light' },
  { title: 'Letters Never Sent', author: 'Meera Iyer', genre: 'Romance', color: 'bg-status-warning' },
  { title: 'The Last Monsoon', author: 'Vikram Desai', genre: 'Thriller', color: 'bg-status-danger' },
];

function BestsellersSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      className="section bg-surface-muted"
      aria-labelledby="bestsellers-heading"
    >
      <div className="container-bookleaf">
        <motion.div
          className="text-center mb-14"
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <h2
            id="bestsellers-heading"
            className="font-display text-display-md text-text-primary"
          >
            Our <span className="text-brand-accent">Bestsellers</span>
          </h2>
          <p className="mt-4 text-body-lg text-text-muted max-w-xl mx-auto font-body">
            Stories that found their audience — yours could be next.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {BESTSELLERS.map((book, i) => (
            <motion.div
              key={book.title}
              custom={i}
              variants={scaleIn}
              whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
              className="group cursor-pointer"
            >
              {/* Book cover placeholder */}
              <div
                className={cn(
                  'relative aspect-[2/3] rounded-lg overflow-hidden shadow-card group-hover:shadow-card-hover transition-shadow duration-200',
                  book.color
                )}
              >
                {/* Spine effect */}
                <div
                  className="absolute inset-y-0 left-0 w-3 opacity-20"
                  style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.3), transparent)' }}
                  aria-hidden="true"
                />
                {/* Title on cover */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <BookOpen className="w-8 h-8 text-text-inverse/40 mb-3" />
                  <p className="font-display text-body-sm text-text-inverse font-bold leading-tight">
                    {book.title}
                  </p>
                  <p className="mt-1 text-caption text-text-inverse/70">
                    {book.author}
                  </p>
                </div>
              </div>

              {/* Info below cover */}
              <div className="mt-3 text-center">
                <p className="font-display text-body-sm text-text-primary font-semibold truncate">
                  {book.title}
                </p>
                <p className="text-caption text-text-muted">{book.author}</p>
                <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary text-caption font-medium">
                  {book.genre}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Section: Testimonials
   ========================================================================== */

const TESTIMONIALS = [
  {
    name: 'Ananya Verma',
    book: 'Finding My Voice',
    rating: 5,
    quote:
      'BookLeaf made my dream of becoming a published author a reality. The team was incredibly supportive, and my book was ready in just 12 days!',
  },
  {
    name: 'Karthik Reddy',
    book: 'Code to Canvas',
    rating: 5,
    quote:
      'As a first-time author, I was overwhelmed. BookLeaf guided me through every step — from editing to getting my book on Amazon India and Flipkart.',
  },
  {
    name: 'Fatima Sheikh',
    book: 'Threads of Gold',
    rating: 5,
    quote:
      'The cover design blew me away! I received compliments from readers who said they bought the book purely because of how beautiful it looked.',
  },
  {
    name: 'Rajesh Nair',
    book: 'Monsoon Memoirs',
    rating: 5,
    quote:
      'The royalty dashboard is fantastic — I can see sales in real time. BookLeaf truly puts authors first. Highly recommended!',
  },
];

function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      className="section bg-surface-background"
      aria-labelledby="testimonials-heading"
    >
      <div className="container-bookleaf">
        <motion.div
          className="text-center mb-14"
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <h2
            id="testimonials-heading"
            className="font-display text-display-md text-text-primary"
          >
            What Our Authors{' '}
            <span className="text-brand-accent">Say</span>
          </h2>
          <p className="mt-4 text-body-lg text-text-muted max-w-xl mx-auto font-body">
            Join thousands of happy authors who published with BookLeaf.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.blockquote
              key={t.name}
              custom={i}
              variants={fadeUp}
              className="card p-6 flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 fill-brand-accent text-brand-accent"
                  />
                ))}
              </div>

              <p className="text-body-sm text-text-secondary leading-relaxed flex-1 italic">
                &ldquo;{t.quote}&rdquo;
              </p>

              <footer className="mt-5 pt-4 border-t border-border">
                <p className="font-display text-body-sm text-text-primary font-semibold">
                  {t.name}
                </p>
                <p className="text-caption text-text-muted">
                  Author of <span className="text-brand-accent font-medium">{t.book}</span>
                </p>
              </footer>
            </motion.blockquote>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Section: Final CTA
   ========================================================================== */

function CtaSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section
      ref={ref}
      className="section section-dark relative overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Decorative glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, var(--bl-brand-accent), transparent 70%)' }}
        />
      </div>

      <div className="container-bookleaf relative z-10 text-center py-8 md:py-12">
        <motion.h2
          id="cta-heading"
          className="font-display text-display-md md:text-display-lg text-text-inverse"
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          Ready to Publish Your Book?
        </motion.h2>

        <motion.p
          className="mt-4 text-body-lg text-text-inverse/80 max-w-lg mx-auto font-body"
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          Join 12,000+ authors who chose BookLeaf to bring their stories to the world.
        </motion.p>

        <motion.div
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <Link
            href="/get-published"
            className="inline-flex items-center justify-center gap-2 mt-10 px-10 py-4 rounded-lg bg-brand-accent text-brand-dark font-bold text-body-lg hover:bg-brand-accent-hover transition-colors duration-150 shadow-gold no-underline"
          >
            Start Publishing Today
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Section: Featured On
   ========================================================================== */

const MEDIA_PARTNERS = [
  {
    name: 'Deccan Chronicle',
    href: 'https://www.deccanchronicle.com/lifestyle/booksart/places-via-notes-a-collection-of-poems-wins-emily-dickinson-award-1878210',
    logo: (
      <span className="font-serif italic font-bold tracking-tight text-heading-xs md:text-heading-sm text-text-secondary/70 group-hover:text-text-primary transition-colors duration-200 select-none">
        Deccan Chronicle
      </span>
    ),
  },
  {
    name: 'Hindustan Times',
    href: 'https://www.hindustantimes.com/books/on-india-independent-books-and-ideas-101764834173472.html',
    logo: (
      <span className="font-sans font-black tracking-tight text-heading-xs md:text-heading-sm text-text-secondary/70 group-hover:text-text-primary transition-colors duration-200 lowercase select-none">
        hindustantimes
      </span>
    ),
  },
  {
    name: 'Deccan Herald',
    href: 'https://www.deccanherald.com/brandspot/pr-spot/why-21-days-writing-challenge-by-bookleaf-publishing-became-a-sensation-1060590.html',
    logo: (
      <span className="font-serif font-black tracking-tight text-heading-xs md:text-heading-sm text-text-secondary/70 group-hover:text-text-primary transition-colors duration-200 select-none text-center">
        Deccan Herald
      </span>
    ),
  },
  {
    name: 'Mid-Day',
    href: 'https://www.mid-day.com/mumbai/mumbai-news/article/mumbai-diary-saturday-dossier-23206515',
    logo: (
      <span className="font-sans italic font-black tracking-tight text-heading-xs md:text-heading-sm text-text-secondary/70 group-hover:text-text-primary transition-colors duration-200 uppercase select-none">
        mid-day
      </span>
    ),
  },
  {
    name: 'ThePrint',
    href: 'https://theprint.in/theprint-valuead-initiative/bookleaf-publishings-21-day-writing-challenge-aims-to-encourage-expression-daily-writing/785687/',
    logo: (
      <div className="flex items-center gap-0.5 font-sans font-bold text-heading-xs md:text-heading-sm text-text-secondary/70 group-hover:text-text-primary transition-colors duration-200 select-none">
        <span>The</span>
        <span className="text-brand-accent">Print</span>
      </div>
    ),
  },
  {
    name: 'Business Standard',
    href: 'https://www.business-standard.com/content/press-releases-ani/delhi-publisher-launches-monthly-literary-events-to-address-growing-demand-for-open-mic-spaces-125110100429_1.html',
    logo: (
      <span className="font-serif font-extrabold tracking-tight text-[0.8rem] md:text-[0.85rem] text-text-secondary/70 group-hover:text-text-primary transition-colors duration-200 uppercase select-none text-center leading-tight">
        Business Standard
      </span>
    ),
  },
  {
    name: 'New Indian Express',
    href: 'https://www.newindianexpress.com/cities/kochi/2024/Sep/17/twenty-one-days-of-soulitude',
    logo: (
      <div className="flex flex-col items-center text-center select-none leading-none border-y border-text-secondary/30 py-1.5 px-2">
        <span className="font-serif font-black tracking-widest text-[0.65rem] md:text-[0.7rem] text-text-secondary/70 group-hover:text-text-primary transition-colors duration-200 uppercase">
          NEW INDIAN EXPRESS
        </span>
      </div>
    ),
  },
];

function FeaturedOnSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      className="section bg-surface-muted/30 border-y border-border py-12 md:py-16"
      aria-labelledby="featured-heading"
    >
      <div className="container-bookleaf">
        <motion.div
          className="text-center mb-8"
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <h2
            id="featured-heading"
            className="font-display text-body-lg text-brand-primary font-bold uppercase tracking-widest"
          >
            Featured On
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6 md:gap-8 items-center justify-items-center"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {MEDIA_PARTNERS.map((media, i) => (
            <motion.a
              key={media.name}
              custom={i}
              variants={scaleIn}
              href={media.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center h-16 w-full max-w-[160px] transition-all duration-300 transform hover:scale-[1.05]"
              title={`Read about BookLeaf Publishing on ${media.name}`}
            >
              {media.logo}
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Section: Our Distribution Channels
   ========================================================================== */

const CHANNELS = [
  {
    name: 'amazon.com',
    logo: (
      <div className="flex flex-col items-center select-none font-sans font-bold text-heading-xs text-text-secondary/70 group-hover:text-text-primary transition-colors duration-200">
        <span>amazon<span className="text-[0.65rem] text-brand-accent">.com</span></span>
        <svg viewBox="0 0 100 15" className="w-16 h-2 text-brand-accent fill-current">
          <path d="M0,2 Q40,15 100,2 Q95,5 90,8 Q80,2 75,0 Q82,5 90,8 Q50,15 0,2 Z" />
        </svg>
      </div>
    ),
  },
  {
    name: 'amazon kindle',
    logo: (
      <div className="flex items-center gap-1 font-sans font-medium text-heading-xs text-text-secondary/70 group-hover:text-text-primary transition-colors duration-200 select-none">
        <span>amazon</span>
        <span className="font-bold text-brand-accent">kindle</span>
      </div>
    ),
  },
  {
    name: 'Google Play Books',
    logo: (
      <div className="flex items-center gap-2 font-sans font-semibold text-[0.85rem] text-text-secondary/70 group-hover:text-text-primary transition-colors duration-200 select-none">
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-status-info fill-current shrink-0">
          <path d="M3 5.25v13.5a1.5 1.5 0 0 0 2.25 1.3l13.5-6.75a1.5 1.5 0 0 0 0-2.6L5.25 3.95A1.5 1.5 0 0 0 3 5.25z" />
        </svg>
        <div className="flex flex-col leading-none">
          <span className="text-[0.65rem] text-text-muted">Google Play</span>
          <span className="font-bold">Books</span>
        </div>
      </div>
    ),
  },
  {
    name: 'amazon.in',
    logo: (
      <div className="flex flex-col items-center select-none font-sans font-bold text-heading-xs text-text-secondary/70 group-hover:text-text-primary transition-colors duration-200">
        <span>amazon<span className="text-[0.65rem] text-brand-accent">.in</span></span>
        <svg viewBox="0 0 100 15" className="w-16 h-2 text-brand-accent fill-current">
          <path d="M0,2 Q40,15 100,2 Q95,5 90,8 Q80,2 75,0 Q82,5 90,8 Q50,15 0,2 Z" />
        </svg>
      </div>
    ),
  },
  {
    name: 'Flipkart',
    logo: (
      <div className="flex items-center gap-1.5 font-sans font-bold italic text-heading-xs text-text-secondary/70 group-hover:text-text-primary transition-colors duration-200 select-none">
        <div className="w-6 h-6 rounded bg-brand-primary flex items-center justify-center text-text-inverse font-serif not-italic text-caption shrink-0">
          F
        </div>
        <span>Flipkart</span>
      </div>
    ),
  },
  {
    name: 'iBooks',
    logo: (
      <div className="flex items-center gap-1.5 font-sans font-semibold text-[0.85rem] text-text-secondary/70 group-hover:text-text-primary transition-colors duration-200 select-none">
        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-brand-accent to-brand-accent-light flex items-center justify-center shrink-0 shadow-sm">
          <BookOpen className="w-3 h-3 text-brand-dark" />
        </div>
        <span>Apple Books</span>
      </div>
    ),
  },
  {
    name: 'Barnes & Noble',
    logo: (
      <span className="font-serif font-black tracking-wider text-[0.8rem] md:text-[0.85rem] text-brand-primary/80 group-hover:text-brand-primary transition-colors duration-200 uppercase select-none border-b-2 border-brand-accent pb-0.5">
        BARNES & NOBLE
      </span>
    ),
  },
  {
    name: 'Kobo',
    logo: (
      <div className="flex items-center gap-1 font-sans font-black text-heading-xs text-text-secondary/70 group-hover:text-text-primary transition-colors duration-200 select-none">
        <span className="lowercase">kobo</span>
        <span className="w-2 h-2 rounded-full bg-brand-accent" />
      </div>
    ),
  },
];

function DistributionSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      className="section bg-surface-muted/30 border-y border-border py-16"
      aria-labelledby="distribution-heading"
    >
      <div className="container-bookleaf text-center">
        <motion.div
          className="mb-12"
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <h2
            id="distribution-heading"
            className="font-display text-display-xs md:text-display-sm text-text-primary"
          >
            Our <span className="text-brand-accent">Distribution Channels</span>
          </h2>
          <p className="mt-3 text-body-md text-text-muted max-w-xl mx-auto font-body">
            We distribute your books across the world&apos;s leading paperback and eBook storefronts.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 items-center justify-items-center max-w-4xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {CHANNELS.map((channel, i) => (
            <motion.div
              key={channel.name}
              custom={i}
              variants={scaleIn}
              className="group flex items-center justify-center h-16 w-full max-w-[165px] p-4 bg-surface-card rounded-xl border border-border shadow-sm hover:shadow-md hover:border-brand-accent/30 transition-all duration-300"
            >
              {channel.logo}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Page: Home
   ========================================================================== */

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TrustMarqueeSection />
        <FeaturedOnSection />
        <ServicesSection />
        <PackagesSection />
        <HowItWorksSection />
        <BestsellersSection />
        <DistributionSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
