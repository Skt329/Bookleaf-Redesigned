import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ ticketId: string }>;
}

/**
 * GET /api/author/tickets/[ticketId]/messages — List messages for a ticket
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { ticketId } = await params;

  const author = await prisma.author.findFirst({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!author) {
    return NextResponse.json({ error: 'Author not found' }, { status: 404 });
  }

  // Verify ticket belongs to this author
  const ticket = await prisma.supportTicket.findFirst({
    where: { id: ticketId, authorId: author.id },
    select: { id: true },
  });

  if (!ticket) {
    return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
  }

  const messages = await prisma.ticketMessage.findMany({
    where: { ticketId, isInternalNote: false },
    include: { sender: { select: { name: true } } },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json({ success: true, data: messages });
}

/**
 * POST /api/author/tickets/[ticketId]/messages — Add a reply to a ticket
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { ticketId } = await params;

  const author = await prisma.author.findFirst({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!author) {
    return NextResponse.json({ error: 'Author not found' }, { status: 404 });
  }

  // Verify ticket belongs to this author
  const ticket = await prisma.supportTicket.findFirst({
    where: { id: ticketId, authorId: author.id },
    select: { id: true, status: true },
  });

  if (!ticket) {
    return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
  }

  if (ticket.status === 'CLOSED') {
    return NextResponse.json({ error: 'Ticket is closed' }, { status: 400 });
  }

  const body = await request.json();
  const { content } = body;

  if (!content?.trim()) {
    return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
  }

  const message = await prisma.ticketMessage.create({
    data: {
      ticketId,
      senderId: session.user.id,
      senderRole: 'AUTHOR',
      content: content.trim(),
      isInternalNote: false,
    },
    include: { sender: { select: { name: true } } },
  });

  // Update ticket status to OPEN if it was RESOLVED
  if (ticket.status === 'RESOLVED') {
    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status: 'OPEN' },
    });
  }

  return NextResponse.json({ success: true, data: message }, { status: 201 });
}
