import type { Metadata } from 'next';
import { OFFICE_ADDRESSES, SUPPORT_HOURS } from '@/constants';
import { Navbar, Footer } from '@/components/layout';
import { PageHeader } from '@/components/shared';

/* -----------------------------------------------------------------------
   SEO Metadata
   ----------------------------------------------------------------------- */

export const metadata: Metadata = {
  title: 'Refund Policy — BookLeaf Publishing',
  description:
    "Read BookLeaf Publishing's Refund Policy. Learn about our 100% money-back guarantee on publishing packages and bookstore refund terms.",
};

/* -----------------------------------------------------------------------
   Static Data
   ----------------------------------------------------------------------- */

const SECTIONS = [
  {
    id: 'money-back-guarantee',
    title: '100% Money-Back Guarantee',
    content: `We offer a **14-day 100% money-back guarantee** on all our publishing packages (Basic, Premium, Professional). If you change your mind or are unsatisfied with the setup process, you can request a full refund within 14 days of purchase.`,
  },
  {
    id: 'refund-eligibility',
    title: 'Refund Eligibility Conditions',
    content: `To be eligible for a 100% refund, the refund request must be made within the 14-day window and **before** our team has initiated any editing, proofreading, pagination, layout formatting, customized cover design, or ISBN registration work.
    
    If our team has already commenced custom work on your book, you may only be eligible for a **partial refund** covering the remaining unperformed services, or no refund if the publishing cycle has entered final distribution stages.`,
  },
  {
    id: 'bookstore-refunds',
    title: 'Bookstore Orders & Damaged Items',
    content: `**Print on Demand Policy**: Books purchased through the BookLeaf Bookstore are printed on demand. Consequently, bookstore orders cannot be cancelled or modified once they have entered the printing queue.
    
    **Damaged or Misprinted Books**: If your order arrives damaged, defective, or misprinted (e.g., upside-down pages, missing cover, blurred print), we will send you a **free replacement** or process a **100% refund**. To claim a replacement or refund, you must email a clear photograph of the defect to our support team within 7 days of delivery.`,
  },
  {
    id: 'refund-processing',
    title: 'Processing of Refunds',
    content: `Approved refunds are processed immediately.
    
    **Online Card Payments**: Refunds will be credited back to the original card or payment instrument via our Stripe gateway. Stripe refunds typically take 5-10 business days to appear on your bank statement.
    
    **Cash on Delivery (COD) & Direct Transfers**: If you paid via COD or direct bank transfer, our billing team will request your bank account details (IFS Code, Account Number, Holder Name) to issue a secure direct bank transfer. Direct transfers are completed within 7 business days of receiving account details.`,
  },
  {
    id: 'contact',
    title: 'How to Request a Refund',
    content: `To request a refund or report a damaged bookstore order, please email our support team:
    
    **Email**: ${SUPPORT_HOURS.email}
    **Subject**: "Refund Request - [Order / Invoice Number]"
    **Response Time**: ${SUPPORT_HOURS.responseTime}
    
    Please provide your registered account details and the reason for the refund to help us process your request faster.`,
  },
];

/* -----------------------------------------------------------------------
   Page Component
   ----------------------------------------------------------------------- */

export default function RefundPolicyPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          title="Refund Policy"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Refund Policy' },
          ]}
        />

        <section className="section bg-surface-background" aria-labelledby="refund-heading">
          <div className="container-bookleaf">
            <div className="max-w-3xl mx-auto">
              {/* Last Updated */}
              <div className="mb-10 pb-6 border-b border-border">
                <p className="text-body-sm text-text-muted font-body">
                  Last updated: January 1, 2025
                </p>
                <p className="mt-2 text-body-md text-text-secondary font-body">
                  This Refund Policy outlines the terms and conditions under which refunds are issued for publishing packages and bookstore orders by{' '}
                  <strong className="text-text-primary">
                    Libresco Feeds Pvt Ltd
                  </strong>{' '}
                  (BookLeaf Publishing).
                </p>
              </div>

              <h2 id="refund-heading" className="sr-only">
                Refund Policy Sections
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
