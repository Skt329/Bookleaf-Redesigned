import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ProfileClient from './profile-client';

export const metadata: Metadata = {
  title: 'My Profile — BookLeaf Author Portal',
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, phone: true, city: true },
  });

  const author = await prisma.author.findFirst({
    where: { userId: session.user.id },
    select: { penName: true, authorBio: true },
  });

  if (!user) redirect('/login');

  return (
    <div className="container-bookleaf py-8">
      <h1 className="font-display text-heading-lg text-text-primary mb-8">
        My Profile
      </h1>
      <ProfileClient
        initial={{
          name: user.name || '',
          email: user.email,
          phone: user.phone || '',
          city: user.city || '',
          penName: author?.penName || '',
          authorBio: author?.authorBio || '',
        }}
      />
    </div>
  );
}
