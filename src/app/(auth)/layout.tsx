import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sign In | BookLeaf Publishing',
  description:
    'Log in to your BookLeaf Publishing author dashboard to manage your books, royalties, and publishing journey.',
};

/**
 * Auth layout — minimal wrapper for /login and /signup.
 * No navbar/footer for a clean, distraction-free experience.
 */
export default function AuthLayout({
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
