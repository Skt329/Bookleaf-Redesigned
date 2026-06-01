'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Check,
  ChevronDown,
  CreditCard,
  Factory,
  FileText,
  Minus,
  Package,
  Sparkles,
  Star,
  Truck,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { PUBLISHING_PACKAGES } from '@/constants';
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

/* -----------------------------------------------------------------------
   Static data
   ----------------------------------------------------------------------- */

const STEPS = [
  { icon: Package, title: 'Select Package', description: 'Choose the plan that fits your needs and budget.' },
  { icon: FileText, title: 'Submit Manuscript', description: 'Upload your manuscript through our author portal.' },
  { icon: CreditCard, title: 'Agreement & Payment', description: 'Review terms and complete secure payment.' },
  { icon: Factory, title: 'Production', description: 'Our team edits, designs, and typesets your book in ~14 days.' },
  { icon: Truck, title: 'Published & Distributed', description: 'Your book goes live on major platforms worldwide.' },
];

const COMPARISON_FEATURES = [
  { feature: 'ISBN Assignment', basic: true, premium: true, professional: true },
  { feature: 'Cover Design Concepts', basic: '1', premium: '2', professional: '3' },
  { feature: 'Editing Word Limit', basic: '30,000', premium: '50,000', professional: '80,000' },
  { feature: 'Formatting & Typesetting', basic: 'Standard', premium: 'Professional', professional: 'Premium' },
  { feature: 'Distribution Platforms', basic: '3', premium: '5', professional: 'All' },
  { feature: 'Author Dashboard', basic: true, premium: true, professional: true },
  { feature: 'Live Sales Reports', basic: true, premium: true, professional: true },
  { feature: 'Complimentary Copies', basic: '5', premium: '10', professional: '20' },
  { feature: '100% Royalty (Author Sales)', basic: true, premium: true, professional: true },
  { feature: 'Author Interview Feature', basic: false, premium: true, professional: true },
  { feature: 'Social Media Marketing Kit', basic: false, premium: true, professional: true },
  { feature: 'Dedicated Publishing Manager', basic: false, premium: true, professional: true },
  { feature: 'Video Feature', basic: false, premium: false, professional: true },
  { feature: 'Full Marketing Campaign', basic: false, premium: false, professional: true },
  { feature: 'Press Release Distribution', basic: false, premium: false, professional: true },
  { feature: 'Book Launch Event Support', basic: false, premium: false, professional: true },
  { feature: 'Priority Support', basic: false, premium: false, professional: true },
];

const FAQS = [
  {
    question: 'How long does the publishing process take?',
    answer:
      'Typically 14 business days from manuscript submission to publication. This includes editing, cover design, typesetting, ISBN assignment, and distribution setup.',
  },
  {
    question: 'What formats do you publish in?',
    answer:
      'We publish in paperback, hardcover, and eBook (Kindle & ePub) formats. Your package determines which formats are included.',
  },
  {
    question: 'Can I publish in multiple languages?',
    answer:
      'Yes! We support publishing in English, Hindi, Urdu, and several other Indian languages. Contact us for specific language availability.',
  },
  {
    question: 'Do I retain copyright of my book?',
    answer:
      'Absolutely. You retain 100% copyright and ownership of your work. BookLeaf never claims any rights over your intellectual property.',
  },
  {
    question: 'What platforms will my book be available on?',
    answer:
      'Depending on your package, your book will be distributed on Amazon India, Amazon US, Amazon UK, Flipkart, and the BookLeaf Store.',
  },
  {
    question: 'How do I track my book\'s progress?',
    answer:
      'Your author dashboard provides real-time status updates for every stage — from manuscript received to published and distributed.',
  },
  {
    question: 'Is there a word limit for manuscripts?',
    answer:
      'Each package includes editing up to a certain word count (30K / 50K / 80K). Additional words can be accommodated at a nominal per-word rate.',
  },
  {
    question: 'What is the refund policy?',
    answer:
      'We offer a full refund if we haven\'t started production on your book. Once production begins, partial refunds may apply based on work completed.',
  },
];

/* -----------------------------------------------------------------------
   Sub-components
   ----------------------------------------------------------------------- */

function FAQItem({ item, isOpen, onToggle }: { item: typeof FAQS[0]; isOpen: boolean; onToggle: () => void }) {
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
            transition={{ duration: 0.3, ease: EASE_OUT_EXPO as unknown as [number, number, number, number] }}
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

function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="w-5 h-5 text-status-success mx-auto" />
    ) : (
      <Minus className="w-5 h-5 text-text-muted/40 mx-auto" />
    );
  }
  return <span className="text-body-sm text-text-primary font-semibold">{value}</span>;
}

/* -----------------------------------------------------------------------
   Main Component
   ----------------------------------------------------------------------- */

export default function GetPublishedContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const packagesRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLElement>(null);
  const tableRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);

  const packagesInView = useInView(packagesRef, { once: true, margin: '-80px' });
  const stepsInView = useInView(stepsRef, { once: true, margin: '-80px' });
  const tableInView = useInView(tableRef, { once: true, margin: '-80px' });
  const faqInView = useInView(faqRef, { once: true, margin: '-80px' });

  return (
    <>
      <Navbar />
      <main>
        {/* ===== HERO ===== */}
        <section
          className="relative overflow-hidden bg-surface-background"
          aria-labelledby="publish-hero-heading"
        >
          {/* Decorative */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-[0.06]"
              style={{
                background: 'radial-gradient(circle, var(--bl-brand-accent), transparent 70%)',
              }}
            />
            <motion.div
              className="absolute top-24 right-[15%] w-14 h-14 rounded-full border-2 border-brand-accent/20"
              animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute bottom-28 left-[10%] w-8 h-8 rounded-full bg-brand-primary/5"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />
          </div>

          <div className="container-bookleaf relative z-10 text-center py-20 md:py-28 lg:py-36">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-accent/30 bg-brand-accent/5 text-brand-accent mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-caption font-semibold tracking-wide uppercase">
                Publish in 14 Days
              </span>
            </motion.div>

            <motion.h1
              id="publish-hero-heading"
              className="font-display text-display-lg md:text-display-xl text-text-primary max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: EASE_OUT_EXPO }}
            >
              Start Your Publishing{' '}
              <span className="text-brand-accent">Journey</span>
            </motion.h1>

            <motion.p
              className="mt-6 text-body-lg md:text-heading-sm text-text-secondary max-w-2xl mx-auto font-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Choose a package, submit your manuscript, and we&apos;ll handle
              the rest — from professional editing to global distribution.
            </motion.p>
          </div>
        </section>

        {/* ===== PACKAGES ===== */}
        <section
          ref={packagesRef}
          className="section bg-surface-muted"
          aria-labelledby="packages-heading"
        >
          <div className="container-bookleaf">
            <motion.div
              className="text-center mb-14"
              variants={fadeUp}
              initial="hidden"
              animate={packagesInView ? 'visible' : 'hidden'}
            >
              <h2
                id="packages-heading"
                className="font-display text-display-sm md:text-display-md text-text-primary"
              >
                Choose Your{' '}
                <span className="text-brand-accent">Package</span>
              </h2>
              <p className="mt-4 text-body-lg text-text-muted max-w-2xl mx-auto font-body">
                Transparent pricing with no hidden fees. Every package includes
                100% royalty on author-driven sales.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto"
              variants={staggerContainer}
              initial="hidden"
              animate={packagesInView ? 'visible' : 'hidden'}
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
                    <p className="text-caption text-text-muted mt-1">
                      One-time payment
                    </p>

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
                      href="/contact"
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

        {/* ===== 5-STEP PROCESS ===== */}
        <section
          ref={stepsRef}
          className="section bg-surface-background"
          aria-labelledby="process-heading"
        >
          <div className="container-bookleaf">
            <motion.div
              className="text-center mb-14"
              variants={fadeUp}
              initial="hidden"
              animate={stepsInView ? 'visible' : 'hidden'}
            >
              <h2
                id="process-heading"
                className="font-display text-display-sm md:text-display-md text-text-primary"
              >
                How It <span className="text-brand-accent">Works</span>
              </h2>
              <p className="mt-4 text-body-lg text-text-muted max-w-xl mx-auto font-body">
                Five simple steps from manuscript to published book.
              </p>
            </motion.div>

            {/* Desktop timeline */}
            <motion.div
              className="hidden md:flex items-start justify-between relative"
              variants={staggerContainer}
              initial="hidden"
              animate={stepsInView ? 'visible' : 'hidden'}
            >
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

            {/* Mobile timeline */}
            <motion.div
              className="md:hidden flex flex-col gap-0 relative"
              variants={staggerContainer}
              initial="hidden"
              animate={stepsInView ? 'visible' : 'hidden'}
            >
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

        {/* ===== COMPARISON TABLE ===== */}
        <section
          ref={tableRef}
          className="section bg-surface-muted"
          aria-labelledby="compare-heading"
        >
          <div className="container-bookleaf">
            <motion.div
              className="text-center mb-14"
              variants={fadeUp}
              initial="hidden"
              animate={tableInView ? 'visible' : 'hidden'}
            >
              <h2
                id="compare-heading"
                className="font-display text-display-sm md:text-display-md text-text-primary"
              >
                Compare <span className="text-brand-accent">Packages</span>
              </h2>
              <p className="mt-4 text-body-lg text-text-muted max-w-xl mx-auto font-body">
                See what&apos;s included in every plan at a glance.
              </p>
            </motion.div>

            <motion.div
              className="overflow-x-auto -mx-6 px-6"
              variants={fadeUp}
              initial="hidden"
              animate={tableInView ? 'visible' : 'hidden'}
            >
              <table className="w-full min-w-[640px] card overflow-hidden">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-6 font-display text-body-md text-text-primary">
                      Feature
                    </th>
                    <th className="text-center py-4 px-4 font-display text-body-md text-text-primary">
                      Basic
                    </th>
                    <th className="text-center py-4 px-4 font-display text-body-md text-brand-accent">
                      Premium ⭐
                    </th>
                    <th className="text-center py-4 px-4 font-display text-body-md text-text-primary">
                      Professional
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_FEATURES.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={cn(
                        'border-b border-border-muted last:border-b-0',
                        i % 2 === 0 ? 'bg-surface-card' : 'bg-surface-muted'
                      )}
                    >
                      <td className="py-3.5 px-6 text-body-sm text-text-secondary font-body">
                        {row.feature}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <CellValue value={row.basic} />
                      </td>
                      <td className="py-3.5 px-4 text-center bg-brand-accent/[0.03]">
                        <CellValue value={row.premium} />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <CellValue value={row.professional} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section
          ref={faqRef}
          className="section bg-surface-background"
          aria-labelledby="publish-faq-heading"
        >
          <div className="container-bookleaf max-w-3xl">
            <motion.div
              className="text-center mb-14"
              variants={fadeUp}
              initial="hidden"
              animate={faqInView ? 'visible' : 'hidden'}
            >
              <h2
                id="publish-faq-heading"
                className="font-display text-display-sm md:text-display-md text-text-primary"
              >
                Frequently Asked{' '}
                <span className="text-brand-accent">Questions</span>
              </h2>
            </motion.div>

            <motion.div
              className="card p-6 md:p-8"
              variants={fadeUp}
              custom={1}
              initial="hidden"
              animate={faqInView ? 'visible' : 'hidden'}
            >
              {FAQS.map((faq, i) => (
                <FAQItem
                  key={i}
                  item={faq}
                  isOpen={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                />
              ))}
            </motion.div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="section-dark section" aria-label="Call to action">
          <div className="container-bookleaf text-center">
            <h2 className="font-display text-display-sm md:text-display-md">
              Ready to <span className="text-brand-accent">Publish?</span>
            </h2>
            <p className="mt-4 text-body-lg max-w-xl mx-auto opacity-80 font-body">
              Get in touch and let&apos;s bring your book to life.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-brand-accent text-brand-dark font-semibold text-body-md hover:bg-brand-accent-hover transition-colors duration-150 shadow-gold no-underline"
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
