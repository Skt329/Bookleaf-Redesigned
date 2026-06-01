import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import TicketDetailClient from './ticket-detail-client';

export const metadata: Metadata = {
  title: 'Ticket Detail — BookLeaf Author Portal',
};

interface Props {
  params: Promise<{ ticketId: string }>;
}

export default async function TicketDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const { ticketId } = await params;

  const author = await prisma.author.findFirst({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!author) redirect('/login');

  const ticket = await prisma.supportTicket.findFirst({
    where: { id: ticketId, authorId: author.id },
    include: {
      book: { select: { title: true } },
      messages: {
        where: { isInternalNote: false },
        include: { sender: { select: { name: true } } },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!ticket) redirect('/author/tickets');

  const serialized = {
    ...ticket,
    createdAt: ticket.createdAt.toISOString(),
    updatedAt: ticket.updatedAt.toISOString(),
    messages: ticket.messages.map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
    })),
  };

  return (
    <div className="container-bookleaf py-8">
      <TicketDetailClient ticket={serialized as any} />
    </div>
  );
}
