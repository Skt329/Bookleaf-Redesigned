import type { Metadata } from 'next';

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
    <main className="flex min-h-screen items-center justify-center bg-surface-background px-4 py-12">
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}
