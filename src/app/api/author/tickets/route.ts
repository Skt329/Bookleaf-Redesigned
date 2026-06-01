import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { triageTicket } from '@/lib/ai/services';

/**
 * GET /api/author/tickets — List tickets for the authenticated author
 */
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const author = await prisma.author.findFirst({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!author) {
    return NextResponse.json({ error: 'Author not found' }, { status: 404 });
  }

  const tickets = await prisma.supportTicket.findMany({
    where: { authorId: author.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      ticketNumber: true,
      subject: true,
      category: true,
      priority: true,
      status: true,
      createdAt: true,
      book: { select: { title: true } },
    },
  });

  return NextResponse.json({ success: true, data: tickets });
}

/**
 * POST /api/author/tickets — Create a new support ticket
 * Includes AI triage for auto-categorization and priority suggestion.
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const author = await prisma.author.findFirst({
    where: { userId: session.user.id },
    include: { user: { select: { name: true } } },
  });

  if (!author) {
    return NextResponse.json({ error: 'Author not found' }, { status: 404 });
  }

  const body = await request.json();
  const { subject, category, description, bookId } = body;

  if (!subject || !category || !description) {
    return NextResponse.json(
      { error: 'Missing required fields: subject, category, description' },
      { status: 400 }
    );
  }

  // AI triage (runs in parallel with ticket number generation)
  const [triage, count] = await Promise.all([
    triageTicket(subject, description, author.user.name || undefined),
    prisma.supportTicket.count(),
  ]);

  const ticketNumber = `TKT-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

  const ticket = await prisma.supportTicket.create({
    data: {
      ticketNumber,
      authorId: author.id,
      bookId: bookId || null,
      subject,
      category,
      description,
      priority: triage.suggestedPriority, // Use AI-suggested priority
      status: 'OPEN',
      aiSuggestedCategory: triage.suggestedCategory,
      aiSuggestedPriority: triage.suggestedPriority,
    },
  });

  return NextResponse.json({
    success: true,
    data: ticket,
    aiTriage: triage,
  }, { status: 201 });
}
