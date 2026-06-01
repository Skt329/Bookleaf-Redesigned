import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams { params: Promise<{ ticketId: string }> }

/** PUT /api/admin/tickets/[ticketId] — Update ticket status/priority */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { ticketId } = await params;
  const { status, priority } = await request.json();

  const data: Record<string, string> = {};
  if (status) data.status = status;
  if (priority) data.priority = priority;

  const ticket = await prisma.supportTicket.update({
    where: { id: ticketId },
    data: { ...data, assignedAdminId: session.user.id },
  });

  return NextResponse.json({ success: true, data: ticket });
}
