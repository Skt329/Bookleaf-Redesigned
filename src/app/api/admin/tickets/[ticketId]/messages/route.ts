import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams { params: Promise<{ ticketId: string }> }

/** POST /api/admin/tickets/[ticketId]/messages — Admin reply */
export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { ticketId } = await params;
  const { content } = await request.json();

  if (!content?.trim()) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }

  const message = await prisma.ticketMessage.create({
    data: {
      ticketId,
      senderId: session.user.id,
      senderRole: 'ADMIN',
      content: content.trim(),
      isInternalNote: false,
    },
    include: { sender: { select: { name: true } } },
  });

  // Auto-update ticket to IN_PROGRESS if OPEN
  await prisma.supportTicket.updateMany({
    where: { id: ticketId, status: 'OPEN' },
    data: { status: 'IN_PROGRESS', assignedAdminId: session.user.id },
  });

  return NextResponse.json({ success: true, data: message }, { status: 201 });
}
