'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  CircleDollarSign,
  Clock,
  HelpCircle,
  Laptop,
  Leaf,
  MessageCircle,
  PenTool,
  Search,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
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
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

/* -----------------------------------------------------------------------
   FAQ data
   ----------------------------------------------------------------------- */

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  name: string;
  icon: typeof BookOpen;
  items: FAQItem[];
}

const FAQ_CATEGORIES: FAQCategory[] = [
  {
    name: 'Publishing Process',
    icon: BookOpen,
    items: [
      {
        question: 'How long does publishing take?',
        answer:
          'Typically 14 business days from manuscript submission to publication. This includes editing, cover design, typesetting, ISBN assignment, and distribution setup.',
      },
      {
        question: 'What formats do you publish in?',
        answer:
          'We publish in paperback, hardcover, and eBook (Kindle & ePub) formats. Your package determines which formats are included.',
      },
      {
        question: 'Can I make changes after publishing?',
        answer:
          'Yes, we offer post-publication revisions. Minor updates are free within the first 30 days. After that, revision charges may apply depending on the scope.',
      },
      {
        question: 'Do I retain copyright?',
        answer:
          'Absolutely. You retain 100% copyright and ownership of your work. BookLeaf never claims any rights over your intellectual property.',
      },
    ],
  },
  {
    name: 'Pricing & Payments',
    icon: CircleDollarSign,
    items: [
      {
        question: 'Are there any hidden fees?',
        answer:
          'No. Our packages are all-inclusive with transparent pricing. The price you see is the price you pay — no surprises.',
      },
      {
        question: 'What payment methods do you accept?',
        answer:
          'UPI, credit/debit cards, net banking, and bank transfers. We also offer EMI options for select packages through partner banks.',
      },
      {
        question: 'Is there a refund policy?',
        answer:
          'We offer a full refund if we haven\'t started production on your book. Once production begins, partial refunds may apply based on work completed.',
      },
    ],
  },
  {
    name: 'Royalties',
    icon: CircleDollarSign,
    items: [
      {
        question: 'How are royalties calculated?',
        answer:
          'Authors receive 80% of net revenue from platform sales. For author-driven sales (through your own referral link), you keep 100% of the royalty.',
      },
      {
        question: 'When are royalties paid out?',
        answer:
          'Royalties are settled quarterly, within 45 days after each quarter ends. You can track pending and paid royalties in your author dashboard.',
      },
      {
        question: 'Is there a minimum payout threshold?',
        answer:
          'Yes, the minimum accumulated amount for payout is ₹1,000. Any balance below this threshold rolls over to the next quarter.',
      },
    ],
  },
  {
    name: 'Writing Challenge',
    icon: PenTool,
    items: [
      {
        question: 'What is the Writing Challenge?',
        answer:
          'It\'s our 21-day guided writing program (#TheWriteAngle) where participants write daily with AI-powered feedback and get published in a curated anthology.',
      },
      {
        question: 'Do I need prior writing experience?',
        answer:
          'Not at all! The challenge is designed for beginners and experienced writers alike. Daily prompts guide you through the creative process.',
      },
      {
        question: 'What do I get at the end?',
        answer:
          'Your work is published in a curated anthology with an ISBN. You receive a published author certificate and complimentary copies of the anthology.',
      },
    ],
  },
  {
    name: 'Technical',
    icon: Settings,
    items: [
      {
        question: 'Can I track my book status?',
        answer:
          'Yes, your author dashboard provides real-time status updates for every stage of production — from manuscript received to published and distributed.',
      },
      {
        question: 'What file formats should I submit?',
        answer:
          'We accept .docx, .doc, and .pdf files. .docx is preferred for editing as it allows our editors to track changes seamlessly.',
      },
      {
        question: 'How do I access the author dashboard?',
        answer:
          'After signing up, you\'ll receive login credentials via email. The dashboard is accessible at any time from your browser — no app download needed.',
      },
    ],
  },
];

/* -----------------------------------------------------------------------
   Sub-components
   ----------------------------------------------------------------------- */

function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
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

export default function FAQContent() {
  const [openItems, setOpenItems] = useState<Record<string, number | null>>({});
  const faqRef = useRef<HTMLElement>(null);
  const faqInView = useInView(faqRef, { once: true, margin: '-60px' });

  const toggleItem = (categoryName: string, index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [categoryName]: prev[categoryName] === index ? null : index,
    }));
  };

  return (
    <>
      <Navbar />
      <main>
        {/* ===== HERO ===== */}
        <section
          className="relative overflow-hidden bg-surface-background"
          aria-labelledby="faq-hero-heading"
        >
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.05]"
              style={{
                background: 'radial-gradient(circle, var(--bl-brand-accent), transparent 70%)',
              }}
            />
          </div>

          <div className="container-bookleaf relative z-10 text-center py-20 md:py-28">
            <motion.h1
              id="faq-hero-heading"
              className="font-display text-display-lg md:text-display-xl text-text-primary"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
            >
              Frequently Asked{' '}
              <span className="text-brand-accent">Questions</span>
            </motion.h1>

            <motion.p
              className="mt-6 text-body-lg text-text-secondary max-w-xl mx-auto font-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Find answers to common questions about publishing, pricing,
              royalties, and more.
            </motion.p>

            {/* Decorative search */}
            <motion.div
              className="mt-10 max-w-md mx-auto"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              aria-hidden="true"
            >
              <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-surface-card border border-border shadow-sm">
                <Search className="w-5 h-5 text-text-muted" />
                <span className="text-body-md text-text-muted font-body">
                  Search for answers...
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== FAQ CATEGORIES ===== */}
        <section
          ref={faqRef}
          className="section bg-surface-muted"
          aria-labelledby="faq-categories-heading"
        >
          <div className="container-bookleaf max-w-3xl">
            <h2 id="faq-categories-heading" className="sr-only">
              FAQ Categories
            </h2>

            <motion.div
              className="space-y-8"
              variants={staggerContainer}
              initial="hidden"
              animate={faqInView ? 'visible' : 'hidden'}
            >
              {FAQ_CATEGORIES.map((category, catIdx) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    key={category.name}
                    custom={catIdx}
                    variants={fadeUp}
                  >
                    {/* Category header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-brand-primary" />
                      </div>
                      <h3 className="font-display text-heading-md text-text-primary">
                        {category.name}
                      </h3>
                    </div>

                    {/* Accordion */}
                    <div className="card p-5 md:p-7">
                      {category.items.map((item, itemIdx) => (
                        <FAQAccordionItem
                          key={itemIdx}
                          item={item}
                          isOpen={openItems[category.name] === itemIdx}
                          onToggle={() => toggleItem(category.name, itemIdx)}
                        />
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="section-dark section" aria-label="Call to action">
          <div className="container-bookleaf text-center">
            <MessageCircle className="w-10 h-10 text-brand-accent mx-auto mb-4" />
            <h2 className="font-display text-display-sm md:text-display-md">
              Still Have <span className="text-brand-accent">Questions?</span>
            </h2>
            <p className="mt-4 text-body-lg max-w-xl mx-auto opacity-80 font-body">
              Our team is here to help. Reach out and we&apos;ll get back to you
              within 24 hours.
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
