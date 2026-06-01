import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ChallengeSidebar } from './challenge-sidebar';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '#TheWriteAngle Challenge',
  description:
    'Your 21-day writing challenge dashboard. Write a poem daily and publish your book.',
};

export default async function ChallengeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/challenge/login');
  }

  // Admin goes to admin dashboard
  if (session.user.role === 'ADMIN') {
    redirect('/admin/dashboard');
  }

  // ─── Payment gate ───────────────────────────────────────────────
  // Only users with a PAID registration can access the challenge dashboard.
  // Unpaid users get redirected to the writing-challenge marketing page.
  const paidRegistration = await prisma.writingChallengeRegistration.findFirst({
    where: {
      userId: session.user.id,
      paymentStatus: 'PAID',
    },
    select: { id: true },
  });

  if (!paidRegistration) {
    redirect('/writing-challenge');
  }
  // ────────────────────────────────────────────────────────────────

  const user = {
    name: session.user.name ?? 'Challenger',
    email: session.user.email ?? '',
    role: session.user.role,
  };

  return (
    <div className="flex min-h-screen bg-surface-background">
      <ChallengeSidebar user={user} />
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
