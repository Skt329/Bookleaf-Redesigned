import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { AdminSidebar } from './admin-sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/author/dashboard');

  return (
    <div className="min-h-screen bg-surface-background">
      <AdminSidebar user={{ name: session.user.name, email: session.user.email }} />
      <main className="lg:pl-64">
        <div className="px-4 py-8 sm:px-6 lg:px-8 pt-16 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
