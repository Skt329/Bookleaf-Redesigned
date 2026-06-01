import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import { BookCompiler } from '@/components/challenge/book-compiler';

export const metadata: Metadata = {
  title: 'My Book — #TheWriteAngle Challenge',
  description: 'Design your book cover and compile your 21-day poetry collection.',
};

export default async function BookPage() {
  const session = await auth();
  if (!session?.user) redirect('/challenge/login');

  const registration = await prisma.writingChallengeRegistration.findFirst({
    where: { userId: session.user.id, paymentStatus: 'PAID' },
    include: {
      challenge: { select: { durationDays: true, title: true } },
      dailyPoems: { orderBy: { dayNumber: 'asc' } },
      user: { select: { name: true, email: true } },
    },
  });

  if (!registration) redirect('/writing-challenge');

  const totalDays = registration.challenge.durationDays;
  const savedPoems = registration.dailyPoems.filter((p) => !p.isDraft);
  const allSaved = savedPoems.length >= totalDays;

  // Serialize poems for client component
  const poems = registration.dailyPoems.map((p) => ({
    dayNumber: p.dayNumber,
    title: p.title,
    content: p.content,
    wordCount: p.wordCount,
  }));

  return (
    <BookCompiler
      poems={poems}
      totalDays={totalDays}
      allSaved={allSaved}
      savedCount={savedPoems.length}
      authorName={registration.user.name || 'Unknown Author'}
      bookTitle={registration.bookTitle}
      bookSubtitle={registration.bookSubtitle}
      coverTemplate={registration.coverTemplate}
      dedication={registration.dedication}
      acknowledgments={registration.acknowledgments}
      authorBio={registration.authorBioForBook}
      registrationId={registration.id}
    />
  );
}
