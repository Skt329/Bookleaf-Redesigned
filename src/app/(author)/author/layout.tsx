import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { AuthorSidebar } from './author-sidebar';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Author Portal',
  description:
    'Manage your books, royalties, and publishing journey with BookLeaf.',
};

export default async function AuthorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Admin users should use the admin panel, not the author portal
  if (session.user.role === 'ADMIN') {
    redirect('/admin/dashboard');
  }

  const user = {
    name: session.user.name ?? 'Author',
    email: session.user.email ?? '',
    role: session.user.role,
  };

  return (
    <div className="flex min-h-screen bg-surface-background">
      <AuthorSidebar user={user} />
      <div className="flex flex-1 flex-col lg:ml-0">
        {/* Spacer for mobile top bar */}
        <div className="h-14 lg:hidden" />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
