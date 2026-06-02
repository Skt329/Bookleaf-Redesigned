import type { Metadata } from 'next';
import { OFFICE_ADDRESSES, SUPPORT_HOURS } from '@/constants';
import { Navbar, Footer } from '@/components/layout';
import { PageHeader } from '@/components/shared';

/* -----------------------------------------------------------------------
   SEO Metadata
   ----------------------------------------------------------------------- */

export const metadata: Metadata = {
  title: 'Terms of Service — BookLeaf Publishing',
  description:
    "Read BookLeaf Publishing's Terms of Service. Learn about your rights, obligations, and the rules governing Libresco Feeds Pvt Ltd self-publishing services.",
};

/* -----------------------------------------------------------------------
   Static Data
   ----------------------------------------------------------------------- */

const SECTIONS = [
  {
    id: 'agreement-to-terms',
    title: 'Agreement to Terms',
    content: `Welcome to BookLeaf Publishing. By accessing or using our website, author dashboard, publishing platform, or services operated by Libresco Feeds Pvt Ltd, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.`,
  },
  {
    id: 'author-accounts',
    title: 'Author Accounts & Eligibility',
    content: `To utilize our publishing services, you must register for an author account. You agree to provide accurate, current, and complete details during registration and keep them updated. You are entirely responsible for protecting your account credentials and all activities that occur under your account.`,
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property & Ownership',
    content: `**Author Retains 100% Rights**: Unlike traditional publishing houses, BookLeaf Publishing does not take ownership of your manuscript. You retain full intellectual property rights, copyright, and ownership of your written work.
    
    **License Grant**: By submitting your manuscript for publishing, you grant Libresco Feeds Pvt Ltd a non-exclusive, worldwide, royalty-free license to print, distribute, publish, format, and sell your book across our retail channels (including Amazon, Flipkart, and the BookLeaf Bookstore) as selected in your publishing package.
    
    **Content Guidelines**: You represent and warrant that your work is original, does not infringe on copyrighted material, and does not contain defamatory, hateful, plagiarized, or illegal content. We reserve the right to decline publishing any manuscript that violates our content policies.`,
  },
  {
    id: 'pricing-and-royalties',
    title: 'Pricing, Sales & Royalty Splits',
    content: `**Publishing Packages**: Fees for our publishing packages (Basic, Premium, Professional) are paid upfront and are subject to the Refund Policy.
    
    **Printing Costs**: Printing costs are calculated dynamically based on page count, paper size, ink, and binding type. These costs are deducted from the book's retail price to calculate net sales.
    
    **Royalty Distribution**: BookLeaf pays 100% royalty on net profits for direct author-driven bookstore sales, and 80% on net profits for retail marketplace distributions (e.g., Amazon, Flipkart) in accordance with the Royalty Policy. Payments are processed quarterly after crossing the minimum threshold.`,
  },
  {
    id: 'limitation-of-liability',
    title: 'Limitation of Liability',
    content: `Libresco Feeds Pvt Ltd and its subsidiaries will not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of our website or publishing services, to the maximum extent permitted by law.`,
  },
  {
    id: 'governing-law',
    title: 'Governing Law',
    content: `These Terms of Service shall be governed by and construed in accordance with the laws of India. Any disputes arising under or in connection with these terms shall be subject to the exclusive jurisdiction of the courts in Srinagar, Jammu & Kashmir, India.`,
  },
  {
    id: 'contact',
    title: 'Contact Information',
    content: `If you have questions regarding these Terms of Service, please reach out to our team:
    
    **Email**: ${SUPPORT_HOURS.email}
    **Response Time**: ${SUPPORT_HOURS.responseTime}
    
    **Registered Entity**:
    Libresco Feeds Pvt Ltd
    ${OFFICE_ADDRESSES[1].line1}, ${OFFICE_ADDRESSES[1].line2}
    CIN: U22100JK2019PTC010936`,
  },
];

/* -----------------------------------------------------------------------
   Page Component
   ----------------------------------------------------------------------- */

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          title="Terms of Service"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Terms of Service' },
          ]}
        />

        <section className="section bg-surface-background" aria-labelledby="terms-heading">
          <div className="container-bookleaf">
            <div className="max-w-3xl mx-auto">
              {/* Last Updated */}
              <div className="mb-10 pb-6 border-b border-border">
                <p className="text-body-sm text-text-muted font-body">
                  Last updated: January 1, 2025
                </p>
                <p className="mt-2 text-body-md text-text-secondary font-body">
                  These Terms of Service govern your access to and use of the
                  website and services operated by{' '}
                  <strong className="text-text-primary">
                    Libresco Feeds Pvt Ltd
                  </strong>{' '}
                  (BookLeaf Publishing).
                </p>
              </div>

              <h2 id="terms-heading" className="sr-only">
                Terms of Service Sections
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
