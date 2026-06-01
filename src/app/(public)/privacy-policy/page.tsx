import type { Metadata } from 'next';
import { OFFICE_ADDRESSES, SUPPORT_HOURS } from '@/constants';
import { Navbar, Footer } from '@/components/layout';
import { PageHeader } from '@/components/shared';

/* -----------------------------------------------------------------------
   SEO Metadata
   ----------------------------------------------------------------------- */

export const metadata: Metadata = {
  title: 'Privacy Policy — BookLeaf Publishing',
  description:
    "Read BookLeaf Publishing's privacy policy. Learn how Libresco Feeds Pvt Ltd collects, uses, and protects your personal information.",
};

/* -----------------------------------------------------------------------
   Static Data
   ----------------------------------------------------------------------- */

const SECTIONS = [
  {
    id: 'information-we-collect',
    title: 'Information We Collect',
    content: `When you use BookLeaf Publishing's services, we may collect the following types of information:

**Personal Information:** Your name, email address, phone number, and mailing address provided during account registration or when submitting a manuscript for publishing.

**Manuscript Data:** The manuscripts, cover art, author biographies, and related content you submit for publishing. This content remains your intellectual property at all times.

**Payment Information:** Billing details, bank account information for royalty payouts, and transaction history. Payment processing is handled by PCI-compliant third-party processors — we do not store full card numbers on our servers.

**Usage Data:** Information about how you interact with our website and author dashboard, including pages visited, features used, session duration, and device information. This helps us improve our platform.

**Communications:** Records of your correspondence with our support team, publishing managers, and any feedback you provide.`,
  },
  {
    id: 'how-we-use',
    title: 'How We Use Your Information',
    content: `We use the information we collect for the following purposes:

**Publishing Services:** To process, produce, and distribute your books across our partner platforms including Amazon, Flipkart, and the BookLeaf Store.

**Communication:** To send you updates about your publishing progress, royalty statements, and important service announcements. We will also communicate about new features and opportunities that may benefit your publishing journey.

**Payment Processing:** To process royalty payments, generate sales reports, and maintain accurate financial records as required by Indian tax law.

**Service Improvement:** To understand how authors use our platform and identify areas where we can improve the publishing experience, develop new features, and resolve technical issues.

**Marketing:** With your consent, we may send you newsletters, writing tips, and promotional offers. You can opt out of marketing communications at any time by clicking the unsubscribe link in any email or contacting our support team.`,
  },
  {
    id: 'information-sharing',
    title: 'Information Sharing',
    content: `We take your privacy seriously and limit information sharing to what is necessary for our services:

**Service Providers:** We share relevant information with trusted third-party partners who assist in printing, distribution, and delivery of your books. These partners are contractually bound to protect your data.

**Payment Processors:** Your payment information is shared with our banking and payment processing partners solely for the purpose of processing royalty payouts and transactions.

**Retail Platforms:** Basic book metadata (title, author name, description, ISBN) is shared with distribution platforms such as Amazon and Flipkart as part of the publishing process.

**Legal Requirements:** We may disclose your information if required by law, court order, or government regulation, or if we believe disclosure is necessary to protect our rights, safety, or the safety of others.

**We never sell your personal data to third parties for advertising or marketing purposes.**`,
  },
  {
    id: 'data-security',
    title: 'Data Security',
    content: `Protecting your data is a top priority at BookLeaf Publishing:

We employ industry-standard encryption (TLS/SSL) for all data transmitted between your browser and our servers. Your manuscripts and personal files are stored on encrypted, access-controlled cloud infrastructure.

Access to personal data is strictly limited to authorised team members who require it for their job functions. All team members undergo data protection training and are bound by confidentiality agreements.

We conduct regular security audits and vulnerability assessments to identify and address potential risks. Our infrastructure is monitored around the clock for unusual activity.

While no system can guarantee absolute security, we are committed to implementing and maintaining robust security measures that meet or exceed industry standards.`,
  },
  {
    id: 'cookies',
    title: 'Cookies',
    content: `Our website uses cookies and similar technologies to enhance your experience:

**Essential Cookies:** Required for the website and author dashboard to function properly. These cannot be disabled without affecting core functionality, such as login sessions and form submissions.

**Analytics Cookies:** Help us understand how visitors interact with our website so we can improve navigation, content, and performance. We use privacy-respecting analytics tools that do not track you across other websites.

**Preference Cookies:** Remember your settings and preferences (such as language, theme, and dashboard layout) so you don't have to set them each time you visit.

You can manage cookie preferences through your browser settings. Most browsers allow you to block or delete cookies, though this may affect your experience on our platform. For more granular control, look for the cookie settings option in your browser's privacy menu.`,
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    content: `As a user of BookLeaf Publishing, you have the following rights regarding your personal data:

**Access:** You can request a copy of the personal data we hold about you at any time by contacting our support team.

**Correction:** If any of your personal information is inaccurate or incomplete, you can update it through your author dashboard or by contacting us.

**Deletion:** You can request the deletion of your personal data, subject to legal and contractual obligations (such as maintaining financial records as required by law).

**Data Portability:** You can request a machine-readable export of your personal data.

**Opt-Out:** You can opt out of marketing communications at any time. This will not affect service-related communications about your published books or royalties.

**Complaint:** If you believe your data protection rights have been violated, you have the right to lodge a complaint with the relevant data protection authority in India.

To exercise any of these rights, please contact us at ${SUPPORT_HOURS.email}.`,
  },
  {
    id: 'childrens-privacy',
    title: "Children's Privacy",
    content: `BookLeaf Publishing's services are not directed at individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have inadvertently collected data from a minor, we will take steps to delete that information promptly.

If you are a parent or guardian and believe your child has provided us with personal information, please contact us at ${SUPPORT_HOURS.email} so we can take appropriate action.`,
  },
  {
    id: 'changes',
    title: 'Changes to This Policy',
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will notify you by email and update the "Last updated" date at the top of this page.

We encourage you to review this page periodically to stay informed about how we protect your information. Your continued use of our services after any changes constitutes acceptance of the updated policy.`,
  },
  {
    id: 'contact',
    title: 'Contact Us',
    content: `If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

**Email:** ${SUPPORT_HOURS.email}
**Response Time:** ${SUPPORT_HOURS.responseTime}

**Registered Company:**
Libresco Feeds Pvt Ltd
${OFFICE_ADDRESSES[1].line1}, ${OFFICE_ADDRESSES[1].line2}

**Global Office:**
${OFFICE_ADDRESSES[0].line1}
${OFFICE_ADDRESSES[0].line2}, ${OFFICE_ADDRESSES[0].country}`,
  },
];

/* -----------------------------------------------------------------------
   Page Component
   ----------------------------------------------------------------------- */

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          title="Privacy Policy"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Privacy Policy' },
          ]}
        />

        <section className="section bg-surface-background" aria-labelledby="privacy-heading">
          <div className="container-bookleaf">
            <div className="max-w-3xl mx-auto">
              {/* Last Updated */}
              <div className="mb-10 pb-6 border-b border-border">
                <p className="text-body-sm text-text-muted font-body">
                  Last updated: January 1, 2025
                </p>
                <p className="mt-2 text-body-md text-text-secondary font-body">
                  This Privacy Policy describes how{' '}
                  <strong className="text-text-primary">
                    Libresco Feeds Pvt Ltd
                  </strong>{' '}
                  (operating as BookLeaf Publishing) collects, uses, and
                  protects your personal information when you use our website
                  and services.
                </p>
              </div>

              <h2 id="privacy-heading" className="sr-only">
                Privacy Policy Sections
              </h2>

              {/* Sections */}
              <div className="space-y-10">
                {SECTIONS.map((section, index) => (
                  <article
                    key={section.id}
                    id={section.id}
                    className="pl-5 border-l-2 border-brand-accent/30"
                  >
                    <h3 className="font-display text-heading-lg text-text-primary mb-4">
                      {index + 1}. {section.title}
                    </h3>
                    <div className="text-body-md text-text-secondary font-body leading-relaxed whitespace-pre-line">
                      {section.content.split('\n\n').map((paragraph, i) => {
                        // Handle bold markers
                        const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
                        return (
                          <p key={i} className="mb-4 last:mb-0">
                            {parts.map((part, j) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                return (
                                  <strong key={j} className="text-text-primary font-semibold">
                                    {part.slice(2, -2)}
                                  </strong>
                                );
                              }
                              return <span key={j}>{part}</span>;
                            })}
                          </p>
                        );
                      })}
                    </div>
                  </article>
                ))}
              </div>

              {/* Footer Note */}
              <div className="mt-12 pt-6 border-t border-border text-center">
                <p className="text-body-sm text-text-muted font-body">
                  © {new Date().getFullYear()} Libresco Feeds Pvt Ltd. All rights
                  reserved.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
