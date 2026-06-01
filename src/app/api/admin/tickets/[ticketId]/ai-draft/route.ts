import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { draftTicketResponse } from '@/lib/ai/services';

interface RouteParams { params: Promise<{ ticketId: string }> }

/**
 * POST /api/admin/tickets/[ticketId]/ai-draft — Generate AI draft response
 */
export async function POST(_request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { ticketId } = await params;

  const ticket = await prisma.supportTicket.findUnique({
    where: { id: ticketId },
    include: {
      author: { include: { user: { select: { name: true } } } },
      messages: {
        where: { isInternalNote: false },
        orderBy: { createdAt: 'asc' },
        take: 10,
        select: { content: true, senderRole: true },
      },
    },
  });

  if (!ticket) {
    return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
  }

  const previousMessages = ticket.messages.map(
    (m) => `[${m.senderRole}]: ${m.content}`
  );

  const draft = await draftTicketResponse(
    ticket.subject,
    ticket.description,
    ticket.category,
    ticket.author.user.name || undefined,
    previousMessages.length > 0 ? previousMessages : undefined
  );

  // Save AI draft to ticket
  await prisma.supportTicket.update({
    where: { id: ticketId },
    data: { aiDraftResponse: draft },
  });

  return NextResponse.json({ success: true, draft });
}
