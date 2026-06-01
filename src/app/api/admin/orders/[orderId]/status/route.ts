import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { OrderStatus } from '@prisma/client';

interface RouteParams { params: Promise<{ orderId: string }> }

/** Valid status transitions map */
const VALID_TRANSITIONS: Record<string, OrderStatus[]> = {
  PENDING:    ['CONFIRMED', 'CANCELLED'],
  CONFIRMED:  ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED:    ['DELIVERED'],
  DELIVERED:  [],
  CANCELLED:  ['REFUNDED'],
  REFUNDED:   [],
};

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { orderId } = await params;
  const { status, trackingNumber } = await request.json();

  if (!status) {
    return NextResponse.json({ error: 'Status is required' }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  const allowed = VALID_TRANSITIONS[order.status] || [];
  if (!allowed.includes(status as OrderStatus)) {
    return NextResponse.json(
      { error: `Cannot transition from ${order.status} to ${status}` },
      { status: 400 }
    );
  }

  const updateData: Record<string, unknown> = { status };
  if (status === 'SHIPPED' && trackingNumber) {
    updateData.trackingNumber = trackingNumber;
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: updateData,
  });

  return NextResponse.json({ success: true, data: updated });
}
