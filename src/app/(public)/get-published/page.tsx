import type { Metadata } from 'next';
import GetPublishedContent from './GetPublishedContent';

export const metadata: Metadata = {
  title: "Get Published — Self-Publishing Packages & Pricing",
  description:
    "Explore BookLeaf's self-publishing packages starting at ₹39,990. Professional editing, cover design, ISBN, and global distribution. Publish your book in 14 days.",
};

export default function GetPublishedPage() {
  return <GetPublishedContent />;
}
