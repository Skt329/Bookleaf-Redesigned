import type { Metadata } from 'next';
import ContactContent from './ContactContent';

export const metadata: Metadata = {
  title: "Contact BookLeaf Publishing — Get in Touch",
  description:
    "Contact BookLeaf Publishing for publishing queries, support, or partnership opportunities. Offices in Wyoming, New Delhi, and Srinagar.",
};

export default function ContactPage() {
  return <ContactContent />;
}
