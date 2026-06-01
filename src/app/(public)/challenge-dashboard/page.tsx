import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ChallengeDashboardClient from './challenge-dashboard-client';

export const metadata: Metadata = {
  title: 'My Writing Challenge — BookLeaf Publishing',
  description: 'Track your progress in the #TheWriteAngle writing challenge.',
};

export default async function ChallengeDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const registration = await prisma.writingChallengeRegistration.findFirst({
    where: { authorId: session.user.id, paymentStatus: 'PAID' },
    orderBy: { registeredAt: 'desc' },
    include: { challenge: true },
  });

  if (!registration) redirect('/writing-challenge');

  const poems = await prisma.dailyPoem.findMany({
    where: { registrationId: registration.id },
    orderBy: { dayNumber: 'asc' },
  });

  // Calculate challenge duration in days
  const startDate = new Date(registration.challenge.startDate);
  const endDate = new Date(registration.challenge.endDate);
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  // Serialize dates for client
  const serializedRegistration = {
    ...registration,
    registeredAt: registration.registeredAt.toISOString(),
    challenge: {
      ...registration.challenge,
      startDate: registration.challenge.startDate.toISOString(),
      endDate: registration.challenge.endDate.toISOString(),
      registrationDeadline: registration.challenge.registrationDeadline.toISOString(),
    },
  };

  const serializedPoems = poems.map((p) => ({
    ...p,
    lastSavedAt: p.lastSavedAt.toISOString(),
    submittedAt: p.submittedAt?.toISOString() || null,
  }));

  return (
    <div className="container-bookleaf py-12">
      <ChallengeDashboardClient
        registration={serializedRegistration as any}
        poems={serializedPoems as any}
        totalDays={totalDays}
      />
    </div>
  );
}
