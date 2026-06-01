import type { Metadata } from 'next';

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
    <main className="flex min-h-screen items-center justify-center bg-surface-background px-4 py-12">
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}
