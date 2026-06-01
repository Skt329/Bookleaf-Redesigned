'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BookOpen,
  ChevronDown,
  Clock,
  Flame,
  LayoutDashboard,
  PenTool,
  Sparkles,
  Star,
  Users,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { WRITING_CHALLENGE } from '@/constants';
import { Navbar, Footer } from '@/components/layout';

/* -----------------------------------------------------------------------
   Animation helpers
   ----------------------------------------------------------------------- */

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
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.08, ease: EASE_OUT_EXPO },
  }),
};

/* -----------------------------------------------------------------------
   Static data
   ----------------------------------------------------------------------- */

const BENEFITS = [
  {
    icon: PenTool,
    title: 'Daily Guided Prompts',
    description: 'Expert-crafted daily writing prompts to keep you inspired and on track.',
  },
  {
    icon: Sparkles,
    title: 'AI Writing Assistant',
    description: 'Get real-time AI feedback on your writing to improve clarity and style.',
  },
  {
    icon: BookOpen,
    title: 'Published Anthology',
    description: 'Your work published in a beautifully curated anthology with ISBN.',
  },
  {
    icon: LayoutDashboard,
    title: 'Author Dashboard',
    description: 'Track your daily progress, submissions, and writing streak.',
  },
  {
    icon: Users,
    title: 'Community Access',
    description: 'Connect with fellow writers, share feedback, and find mentors.',
  },
  {
    icon: Award,
    title: 'Certificate of Completion',
    description: 'Official published author certificate to showcase your achievement.',
  },
];

const HOW_IT_WORKS = [
  { step: 1, title: 'Register & Pay', description: 'Sign up and secure your spot in the challenge.', icon: Zap },
  { step: 2, title: 'Write Daily for 21 Days', description: 'Follow daily prompts and write with AI guidance.', icon: PenTool },
  { step: 3, title: 'Submit Your Best Work', description: 'Select and submit your best pieces for the anthology.', icon: BookOpen },
  { step: 4, title: 'Get Published', description: 'Your work is published in a curated anthology.', icon: Award },
];

const TESTIMONIALS = [
  {
    name: 'Simran Kaur',
    quote:
      'The challenge pushed me to write every single day. I never thought I\'d become a published author at 22!',
    rating: 5,
  },
  {
    name: 'Aditya Menon',
    quote:
      'The AI feedback was incredibly helpful. It felt like having a personal writing coach available 24/7.',
    rating: 5,
  },
  {
    name: 'Priya Nambiar',
    quote:
      'From zero writing experience to published author in 21 days. BookLeaf made it possible.',
    rating: 5,
  },
];

const CHALLENGE_FAQS = [
  {
    question: 'What is #TheWriteAngle?',
    answer:
      'A 21-day guided writing challenge where you write daily, receive AI feedback, and get published in a curated anthology.',
  },
  {
    question: 'Do I need writing experience?',
    answer:
      'Not at all! The challenge is designed for complete beginners and experienced writers alike. Daily prompts guide you through the creative process.',
  },
  {
    question: 'What happens after 21 days?',
    answer:
      'Your best submissions are selected for the anthology. You\'ll receive a published copy and digital certificate as a published author.',
  },
  {
    question: 'Can I write in any language?',
    answer:
      'Currently, the challenge supports English and Hindi submissions. We plan to add more languages in future cohorts.',
  },
  {
    question: 'What if I miss a day?',
    answer:
      'You can catch up! While daily writing is encouraged, you can complete prompts at your own pace within the 21-day window.',
  },
];

/* -----------------------------------------------------------------------
   Sub-components
   ----------------------------------------------------------------------- */

function ChallengeFAQItem({
  item,
  isOpen,
  onToggle,
}: {
  item: (typeof CHALLENGE_FAQS)[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer bg-transparent border-none"
        aria-expanded={isOpen}
      >
        <span className="font-display text-body-md md:text-heading-sm text-text-primary font-semibold">
          {item.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-text-muted" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: EASE_OUT_EXPO as unknown as [number, number, number, number],
            }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-body-md text-text-secondary font-body leading-relaxed">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -----------------------------------------------------------------------
   Main Component
   ----------------------------------------------------------------------- */

export default function WritingChallengeContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const benefitsRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLElement>(null);
  const slotsRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);

  const benefitsInView = useInView(benefitsRef, { once: true, margin: '-80px' });
  const stepsInView = useInView(stepsRef, { once: true, margin: '-80px' });
  const slotsInView = useInView(slotsRef, { once: true, margin: '-60px' });
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: '-80px' });
  const faqInView = useInView(faqRef, { once: true, margin: '-60px' });

  const SLOTS_REMAINING = 47;
  const TOTAL_SLOTS = 100;

  return (
    <>
      <Navbar />
      <main>
        {/* ===== HERO ===== */}
        <section
          className="relative overflow-hidden bg-surface-background"
          aria-labelledby="challenge-hero-heading"
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.07]"
              style={{
                background: 'radial-gradient(circle, var(--bl-brand-accent), transparent 70%)',
              }}
            />
            <motion.div
              className="absolute top-20 right-[15%] w-14 h-14 rounded-full border-2 border-brand-accent/20"
              animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute bottom-28 left-[12%] w-8 h-8 rounded-full bg-brand-accent/10"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />
            <motion.div
              className="absolute top-36 left-[22%] hidden lg:block"
              animate={{ y: [0, -10, 0], rotate: [0, 12, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            >
              <PenTool className="w-12 h-12 text-brand-primary/[0.08]" strokeWidth={1} />
            </motion.div>
          </div>

          <div className="container-bookleaf relative z-10 text-center py-20 md:py-28 lg:py-36">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-accent/30 bg-brand-accent/10 text-brand-accent mb-6"
            >
              <Flame className="w-4 h-4" />
              <span className="text-caption font-bold tracking-wide uppercase">
                {WRITING_CHALLENGE.name}
              </span>
            </motion.div>

            <motion.h1
              id="challenge-hero-heading"
              className="font-display text-display-lg md:text-display-xl text-text-primary max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: EASE_OUT_EXPO }}
            >
              The {WRITING_CHALLENGE.duration}-Day{' '}
              <span className="text-brand-accent">Writing Challenge</span>
            </motion.h1>

            <motion.p
              className="mt-6 text-body-lg md:text-heading-sm text-text-secondary max-w-2xl mx-auto font-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              Transform your ideas into a published book in just 21 days with
              daily guided prompts and AI-powered feedback.
            </motion.p>

            {/* Price */}
            <motion.div
              className="mt-8 flex items-center justify-center gap-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <span className="font-display text-display-sm md:text-display-md text-brand-primary font-bold">
                {formatCurrency(WRITING_CHALLENGE.price).replace('.00', '')}
              </span>
              <span className="font-display text-heading-md text-text-muted line-through">
                {formatCurrency(WRITING_CHALLENGE.originalPrice).replace('.00', '')}
              </span>
              <span className="px-3 py-1 rounded-full bg-status-success/10 text-status-success text-caption font-bold">
                60% OFF
              </span>
            </motion.div>

            {/* CTA */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-brand-accent text-brand-dark font-semibold text-body-md hover:bg-brand-accent-hover transition-colors duration-150 shadow-gold no-underline"
              >
                Join the Challenge
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ===== BENEFITS ===== */}
        <section
          ref={benefitsRef}
          className="section bg-surface-muted"
          aria-labelledby="benefits-heading"
        >
          <div className="container-bookleaf">
            <motion.div
              className="text-center mb-14"
              variants={fadeUp}
              initial="hidden"
              animate={benefitsInView ? 'visible' : 'hidden'}
            >
              <h2
                id="benefits-heading"
                className="font-display text-display-sm md:text-display-md text-text-primary"
              >
                What You <span className="text-brand-accent">Get</span>
              </h2>
              <p className="mt-4 text-body-lg text-text-muted max-w-xl mx-auto font-body">
                Everything you need to write, improve, and publish.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
              variants={staggerContainer}
              initial="hidden"
              animate={benefitsInView ? 'visible' : 'hidden'}
            >
              {BENEFITS.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={benefit.title}
                    custom={i}
                    variants={fadeUp}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="card p-6 md:p-8"
                  >
                    <div className="w-12 h-12 rounded-lg bg-brand-accent/10 flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6 text-brand-accent" />
                    </div>
                    <h3 className="font-display text-heading-sm text-text-primary">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 text-body-sm text-text-muted font-body">
                      {benefit.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section
          ref={stepsRef}
          className="section bg-surface-background"
          aria-labelledby="challenge-steps-heading"
        >
          <div className="container-bookleaf">
            <motion.div
              className="text-center mb-14"
              variants={fadeUp}
              initial="hidden"
              animate={stepsInView ? 'visible' : 'hidden'}
            >
              <h2
                id="challenge-steps-heading"
                className="font-display text-display-sm md:text-display-md text-text-primary"
              >
                How It <span className="text-brand-accent">Works</span>
              </h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
              variants={staggerContainer}
              initial="hidden"
              animate={stepsInView ? 'visible' : 'hidden'}
            >
              {HOW_IT_WORKS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    custom={i}
                    variants={scaleIn}
                    className="text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-brand-primary border-4 border-brand-accent/20 flex items-center justify-center mx-auto shadow-card">
                      <Icon className="w-7 h-7 text-text-inverse" />
                    </div>
                    <span className="mt-3 inline-block text-caption font-bold text-brand-accent">
                      Step {step.step}
                    </span>
                    <h3 className="mt-1 font-display text-body-md text-text-primary font-semibold">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-caption text-text-muted font-body">
                      {step.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ===== SLOTS REMAINING ===== */}
        <section
          ref={slotsRef}
          className="py-12 bg-surface-muted"
          aria-label="Slots remaining"
        >
          <div className="container-bookleaf">
            <motion.div
              className="card-accent p-8 md:p-10 text-center max-w-2xl mx-auto"
              variants={scaleIn}
              initial="hidden"
              animate={slotsInView ? 'visible' : 'hidden'}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-status-warning/10 text-status-warning text-caption font-bold uppercase tracking-wider mb-4">
                <Clock className="w-3.5 h-3.5" />
                Limited Availability
              </div>
              <p className="font-display text-display-md md:text-display-lg text-brand-primary font-bold">
                {SLOTS_REMAINING}
              </p>
              <p className="text-heading-sm text-text-primary font-display">
                Slots Remaining
              </p>
              {/* Progress bar */}
              <div className="mt-6 w-full h-3 bg-border rounded-full overflow-hidden max-w-sm mx-auto">
                <motion.div
                  className="h-full rounded-full bg-brand-accent"
                  initial={{ width: 0 }}
                  animate={
                    slotsInView
                      ? { width: `${((TOTAL_SLOTS - SLOTS_REMAINING) / TOTAL_SLOTS) * 100}%` }
                      : { width: 0 }
                  }
                  transition={{ duration: 1.2, delay: 0.3, ease: EASE_OUT_EXPO as unknown as [number, number, number, number] }}
                />
              </div>
              <p className="mt-3 text-caption text-text-muted font-body">
                {TOTAL_SLOTS - SLOTS_REMAINING} of {TOTAL_SLOTS} spots filled
              </p>
            </motion.div>
          </div>
        </section>

        {/* ===== TESTIMONIALS ===== */}
        <section
          ref={testimonialsRef}
          className="section bg-surface-background"
          aria-labelledby="challenge-testimonials-heading"
        >
          <div className="container-bookleaf">
            <motion.div
              className="text-center mb-14"
              variants={fadeUp}
              initial="hidden"
              animate={testimonialsInView ? 'visible' : 'hidden'}
            >
              <h2
                id="challenge-testimonials-heading"
                className="font-display text-display-sm md:text-display-md text-text-primary"
              >
                What Past Participants{' '}
                <span className="text-brand-accent">Say</span>
              </h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
              variants={staggerContainer}
              initial="hidden"
              animate={testimonialsInView ? 'visible' : 'hidden'}
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

                  <p className="text-body-sm text-text-secondary leading-relaxed flex-1 italic font-body">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  <footer className="mt-5 pt-4 border-t border-border">
                    <p className="font-display text-body-sm text-text-primary font-semibold">
                      {t.name}
                    </p>
                    <p className="text-caption text-text-muted">Challenge Participant</p>
                  </footer>
                </motion.blockquote>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section
          ref={faqRef}
          className="section bg-surface-muted"
          aria-labelledby="challenge-faq-heading"
        >
          <div className="container-bookleaf max-w-3xl">
            <motion.div
              className="text-center mb-14"
              variants={fadeUp}
              initial="hidden"
              animate={faqInView ? 'visible' : 'hidden'}
            >
              <h2
                id="challenge-faq-heading"
                className="font-display text-display-sm md:text-display-md text-text-primary"
              >
                Challenge <span className="text-brand-accent">FAQ</span>
              </h2>
            </motion.div>

            <motion.div
              className="card p-6 md:p-8"
              variants={fadeUp}
              custom={1}
              initial="hidden"
              animate={faqInView ? 'visible' : 'hidden'}
            >
              {CHALLENGE_FAQS.map((faq, i) => (
                <ChallengeFAQItem
                  key={i}
                  item={faq}
                  isOpen={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                />
              ))}
            </motion.div>
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section className="section-dark section" aria-label="Join the challenge">
          <div className="container-bookleaf text-center">
            <Flame className="w-10 h-10 text-brand-accent mx-auto mb-4" />
            <h2 className="font-display text-display-sm md:text-display-md">
              Start Your Writing Journey{' '}
              <span className="text-brand-accent">Today</span>
            </h2>
            <div className="mt-6 flex items-center justify-center gap-4">
              <span className="font-display text-heading-lg text-text-inverse font-bold">
                {formatCurrency(WRITING_CHALLENGE.price).replace('.00', '')}
              </span>
              <span className="font-display text-body-lg text-text-inverse/50 line-through">
                {formatCurrency(WRITING_CHALLENGE.originalPrice).replace('.00', '')}
              </span>
            </div>
            <p className="mt-4 text-body-lg max-w-xl mx-auto opacity-80 font-body">
              Write daily, get AI feedback, and become a published author.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-brand-accent text-brand-dark font-semibold text-body-md hover:bg-brand-accent-hover transition-colors duration-150 shadow-gold no-underline"
            >
              Join the Challenge
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
