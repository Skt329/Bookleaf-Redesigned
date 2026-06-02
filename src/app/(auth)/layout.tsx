import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { FloatingDecorations } from '@/components/shared';

export const metadata: Metadata = {
  title: 'Sign In | BookLeaf Publishing',
  description:
    'Log in to your BookLeaf Publishing author dashboard to manage your books, royalties, and publishing journey.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative overflow-hidden flex min-h-screen items-center justify-center bg-surface-background px-4 py-12">
      <FloatingDecorations />
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-body-sm font-medium text-text-secondary hover:text-brand-primary transition-colors duration-150"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
      <div className="w-full max-w-md mt-6 relative z-10">{children}</div>
    </main>
  );
}
