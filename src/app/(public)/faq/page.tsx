import type { Metadata } from 'next';
import FAQContent from './FAQContent';

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions About Self-Publishing",
  description:
    "Find answers to common questions about BookLeaf's self-publishing process, pricing, royalties, writing challenge, and more.",
};

export default function FAQPage() {
  return <FAQContent />;
}
