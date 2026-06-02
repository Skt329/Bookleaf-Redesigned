import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Challenge — Join #TheWriteAngle | BookLeaf Publishing',
  description:
    'Sign up or log in to the BookLeaf Writing Challenge. 21 days, 21 poems, one published book.',
};

/**
 * Challenge Auth layout — minimal wrapper for /challenge/signup and /challenge/login.
 * Distraction-free, centered card layout with challenge branding.
 */
export default function ChallengeAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-surface-background px-4 py-12">
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-body-sm font-medium text-text-secondary hover:text-brand-primary transition-colors duration-150"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
      <div className="w-full max-w-md mt-6">{children}</div>
    </main>
  );
}
