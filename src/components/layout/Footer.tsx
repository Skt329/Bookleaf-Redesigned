import Link from 'next/link';
import { Leaf, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { SOCIAL_LINKS, OFFICE_ADDRESSES, SUPPORT_HOURS } from '@/constants';

// ---------------------------------------------------------------------------
// Social icon SVGs (lucide-react doesn't ship brand icons)
// ---------------------------------------------------------------------------

const SOCIAL_SVG: Record<string, React.ReactNode> = {
  Instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  ),
  Facebook: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  Twitter: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  ),
  Linkedin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  Youtube: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  ),
};

// ---------------------------------------------------------------------------
// Footer link groups
// ---------------------------------------------------------------------------

const QUICK_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Get Published', href: '/get-published' },
  { label: 'Writing Challenge', href: '/writing-challenge' },
  { label: 'Bookstore', href: '/bookstore' },
  { label: 'Royalty Calculator', href: '/royalty-calculator' },
  { label: 'Careers', href: '/careers' },
] as const;

const RESOURCE_LINKS = [
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms-of-service' },
  { label: 'Refund Policy', href: '/refund-policy' },
  { label: 'Sitemap', href: '/sitemap.xml' },
] as const;

// ---------------------------------------------------------------------------
// Footer — Server Component (static content)
// ---------------------------------------------------------------------------

export function Footer() {
  return (
    <footer className="section-dark" role="contentinfo">
      <div className="container-bookleaf">
        {/* ---- Four-column grid ---- */}
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Column 1 — Brand */}
          <div className="space-y-5">
            <Link
              href="/"
              className="group inline-flex items-center gap-2"
              aria-label="BookLeaf — go to homepage"
            >
              <Leaf
                className="h-7 w-7 text-brand-accent transition-transform duration-500 group-hover:rotate-12"
                aria-hidden="true"
              />
              <span className="font-display text-heading-sm font-bold tracking-tight text-text-inverse">
                Book<span className="text-brand-accent">Leaf</span>
              </span>
            </Link>

            <p className="text-body-sm leading-relaxed text-text-inverse/80">
              India&apos;s Best Self-Publishing Platform
            </p>

            <p className="inline-block rounded-md border border-brand-accent/30 bg-brand-accent/10 px-3 py-1.5 text-caption font-semibold text-brand-accent">
              🦈 Featured on Shark Tank India
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 pt-1">
              {SOCIAL_LINKS.map((social) => {
                const icon = SOCIAL_SVG[social.icon];
                if (!icon) return null;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow BookLeaf on ${social.label}`}
                    className="grid h-9 w-9 place-items-center rounded-md text-text-inverse/60 transition-colors duration-150 hover:bg-brand-accent/15 hover:text-brand-accent"
                  >
                    {icon}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h3 className="mb-4 font-body text-body-sm font-semibold uppercase tracking-wider text-text-inverse">
              Quick Links
            </h3>
            <ul className="space-y-2.5" role="list">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-text-inverse/70 transition-colors duration-150 hover:text-brand-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Resources */}
          <div>
            <h3 className="mb-4 font-body text-body-sm font-semibold uppercase tracking-wider text-text-inverse">
              Resources
            </h3>
            <ul className="space-y-2.5" role="list">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-text-inverse/70 transition-colors duration-150 hover:text-brand-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h3 className="mb-4 font-body text-body-sm font-semibold uppercase tracking-wider text-text-inverse">
              Contact
            </h3>
            <ul className="space-y-4" role="list">
              {/* Email */}
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" aria-hidden="true" />
                <a
                  href={`mailto:${SUPPORT_HOURS.email}`}
                  className="text-body-sm text-text-inverse/70 transition-colors duration-150 hover:text-brand-accent"
                >
                  {SUPPORT_HOURS.email}
                </a>
              </li>

              {/* WhatsApp */}
              {SUPPORT_HOURS.whatsapp && (
                <li className="flex items-start gap-2.5">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" aria-hidden="true" />
                  <span className="text-body-sm text-text-inverse/70">
                    WhatsApp support available
                  </span>
                </li>
              )}

              {/* Office addresses */}
              {OFFICE_ADDRESSES.map((office) => (
                <li key={office.name} className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" aria-hidden="true" />
                  <div>
                    <span className="block text-body-sm font-medium text-text-inverse/90">
                      {office.name}
                    </span>
                    <span className="text-caption text-text-inverse/60">
                      {office.line1}, {office.line2}
                    </span>
                  </div>
                </li>
              ))}

              {/* Support hours */}
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" aria-hidden="true" />
                <div className="text-caption text-text-inverse/60">
                  <span className="block">Mon–Fri: {SUPPORT_HOURS.weekdays}</span>
                  <span className="block">Sat: {SUPPORT_HOURS.saturday}</span>
                  <span className="block">Sun: {SUPPORT_HOURS.sunday}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* ---- Bottom bar ---- */}
        <div className="border-t border-text-inverse/10 py-6">
          <div className="flex flex-col items-center justify-between gap-2 text-caption text-text-inverse/50 sm:flex-row">
            <p>&copy; 2025 Libresco Feeds Pvt Ltd. All rights reserved.</p>
            <p>Made with ♥ in India</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
