'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  AtSign,
  Briefcase,
  Camera,
  Clock,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Play,
  Send,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OFFICE_ADDRESSES, SOCIAL_LINKS, SUPPORT_HOURS } from '@/constants';
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

/* -----------------------------------------------------------------------
   Icon resolver
   ----------------------------------------------------------------------- */

const SOCIAL_ICON_MAP: Record<string, typeof Camera> = {
  Instagram: Camera,
  Facebook: Globe,
  Twitter: AtSign,
  Linkedin: Briefcase,
  Youtube: Play,
};

/* -----------------------------------------------------------------------
   Main Component
   ----------------------------------------------------------------------- */

export default function ContactContent() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const formRef = useRef<HTMLElement>(null);
  const formInView = useInView(formRef, { once: true, margin: '-60px' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClasses =
    'w-full bg-surface-card border border-border rounded-lg px-4 py-3 text-text-primary text-body-md font-body focus:border-border-focus focus:ring-1 focus:ring-border-focus outline-none transition-colors placeholder:text-text-muted';

  return (
    <>
      <Navbar />
      <main>
        {/* ===== HERO ===== */}
        <section
          className="relative overflow-hidden bg-surface-background"
          aria-labelledby="contact-hero-heading"
        >
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.05]"
              style={{
                background: 'radial-gradient(circle, var(--bl-brand-accent), transparent 70%)',
              }}
            />
            <motion.div
              className="absolute top-20 right-[18%] w-10 h-10 rounded-full border-2 border-brand-accent/20"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <div className="container-bookleaf relative z-10 text-center py-20 md:py-28">
            <motion.h1
              id="contact-hero-heading"
              className="font-display text-display-lg md:text-display-xl text-text-primary"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
            >
              Get in <span className="text-brand-accent">Touch</span>
            </motion.h1>
            <motion.p
              className="mt-6 text-body-lg text-text-secondary max-w-xl mx-auto font-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Have a question or want to get started? We&apos;d love to hear
              from you.
            </motion.p>
          </div>
        </section>

        {/* ===== CONTACT FORM + INFO ===== */}
        <section
          ref={formRef}
          className="section bg-surface-muted"
          aria-labelledby="contact-form-heading"
        >
          <div className="container-bookleaf">
            <h2 id="contact-form-heading" className="sr-only">
              Contact Form and Information
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 max-w-6xl mx-auto">
              {/* LEFT — Form */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate={formInView ? 'visible' : 'hidden'}
              >
                <div className="card p-6 md:p-8">
                  {submitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-status-success/10 flex items-center justify-center mx-auto mb-5">
                        <Send className="w-7 h-7 text-status-success" />
                      </div>
                      <h3 className="font-display text-heading-md text-text-primary">
                        Message Sent!
                      </h3>
                      <p className="mt-3 text-body-md text-text-secondary font-body">
                        Thank you for reaching out. We&apos;ll get back to you
                        within 24 hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-body-sm font-semibold text-text-primary mb-1.5"
                        >
                          Full Name <span className="text-status-danger">*</span>
                        </label>
                        <input
                          id="contact-name"
                          name="name"
                          type="text"
                          required
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          className={inputClasses}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-body-sm font-semibold text-text-primary mb-1.5"
                        >
                          Email Address <span className="text-status-danger">*</span>
                        </label>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className={inputClasses}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-phone"
                          className="block text-body-sm font-semibold text-text-primary mb-1.5"
                        >
                          Phone Number{' '}
                          <span className="text-text-muted font-normal">(optional)</span>
                        </label>
                        <input
                          id="contact-phone"
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className={inputClasses}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-subject"
                          className="block text-body-sm font-semibold text-text-primary mb-1.5"
                        >
                          Subject <span className="text-status-danger">*</span>
                        </label>
                        <select
                          id="contact-subject"
                          name="subject"
                          required
                          value={form.subject}
                          onChange={handleChange}
                          className={cn(inputClasses, !form.subject && 'text-text-muted')}
                        >
                          <option value="" disabled>
                            Select a subject
                          </option>
                          <option value="general">General Inquiry</option>
                          <option value="publishing">Publishing Query</option>
                          <option value="royalty">Royalty Question</option>
                          <option value="challenge">Writing Challenge</option>
                          <option value="partnership">Partnership</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="contact-message"
                          className="block text-body-sm font-semibold text-text-primary mb-1.5"
                        >
                          Message <span className="text-status-danger">*</span>
                        </label>
                        <textarea
                          id="contact-message"
                          name="message"
                          required
                          rows={5}
                          value={form.message}
                          onChange={handleChange}
                          placeholder="Tell us how we can help..."
                          className={cn(inputClasses, 'resize-y min-h-[120px]')}
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-brand-accent text-brand-dark font-semibold text-body-md hover:bg-brand-accent-hover transition-colors duration-150 shadow-gold cursor-pointer border-none"
                      >
                        Send Message
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>

              {/* RIGHT — Contact Info */}
              <motion.div
                className="space-y-6"
                variants={fadeUp}
                custom={1}
                initial="hidden"
                animate={formInView ? 'visible' : 'hidden'}
              >
                {/* Offices */}
                <div className="card p-6">
                  <h3 className="font-display text-heading-sm text-text-primary mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-brand-accent" />
                    Our Offices
                  </h3>
                  <div className="space-y-5">
                    {OFFICE_ADDRESSES.map((office) => (
                      <div key={office.name} className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <MapPin className="w-4 h-4 text-brand-primary" />
                        </div>
                        <div>
                          <p className="font-display text-body-sm text-text-primary font-semibold">
                            {office.name}
                          </p>
                          <p className="text-body-sm text-text-muted font-body">
                            {office.line1}, {office.line2}
                          </p>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-brand-accent/10 text-brand-accent text-caption font-semibold">
                            {office.country}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Support Hours */}
                <div className="card p-6">
                  <h3 className="font-display text-heading-sm text-text-primary mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-brand-accent" />
                    Support Hours
                  </h3>
                  <div className="space-y-2 text-body-sm font-body">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Mon – Fri</span>
                      <span className="text-text-primary font-semibold">
                        {SUPPORT_HOURS.weekdays}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Saturday</span>
                      <span className="text-text-primary font-semibold">
                        {SUPPORT_HOURS.saturday}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Sunday</span>
                      <span className="text-text-primary font-semibold">
                        {SUPPORT_HOURS.sunday}
                      </span>
                    </div>
                    <p className="mt-3 text-caption text-text-muted">
                      {SUPPORT_HOURS.responseTime}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="card p-6">
                  <h3 className="font-display text-heading-sm text-text-primary mb-3 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-brand-accent" />
                    Email Us
                  </h3>
                  <a
                    href={`mailto:${SUPPORT_HOURS.email}`}
                    className="text-body-md text-text-link hover:text-text-link-hover font-body font-semibold"
                  >
                    {SUPPORT_HOURS.email}
                  </a>
                </div>

                {/* Social Links */}
                <div className="card p-6">
                  <h3 className="font-display text-heading-sm text-text-primary mb-4 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-brand-accent" />
                    Follow Us
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {SOCIAL_LINKS.map((social) => {
                      const Icon = SOCIAL_ICON_MAP[social.icon] || Globe;
                      return (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center hover:bg-brand-accent/15 transition-colors duration-200 no-underline"
                          aria-label={social.label}
                        >
                          <Icon className="w-5 h-5 text-brand-primary hover:text-brand-accent transition-colors" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="section-dark section" aria-label="Call to action">
          <div className="container-bookleaf text-center">
            <h2 className="font-display text-display-sm md:text-display-md">
              Ready to <span className="text-brand-accent">Publish?</span>
            </h2>
            <p className="mt-4 text-body-lg max-w-xl mx-auto opacity-80 font-body">
              Start your self-publishing journey with BookLeaf today.
            </p>
            <Link
              href="/get-published"
              className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-brand-accent text-brand-dark font-semibold text-body-md hover:bg-brand-accent-hover transition-colors duration-150 shadow-gold no-underline"
            >
              Explore Packages
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
