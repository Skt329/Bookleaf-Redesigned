import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const trackSchema = z.object({
  orderNumber: z.string().min(1),
  email: z.string().email(),
});

/**
 * POST /api/bookstore/track
 *
 * Public order tracking API. Looks up an order by orderNumber + email.
 * No authentication required — validated by email match.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = trackSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid order number and email.' },
        { status: 400 },
      );
    }

    const { orderNumber, email } = parsed.data;

    const order = await prisma.order.findFirst({
      where: {
        orderNumber,
        OR: [
          { guestEmail: email.toLowerCase() },
          { customer: { email: email.toLowerCase() } },
        ],
      },
      select: {
        orderNumber: true,
        status: true,
        totalAmount: true,
        guestName: true,
        trackingNumber: true,
        shippingAddress: true,
        createdAt: true,
        updatedAt: true,
        customer: {
          select: { name: true },
        },
        items: {
          select: {
            id: true,
            quantity: true,
            unitPrice: true,
            bookType: true,
            book: {
              select: { title: true },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'No order found with that combination.' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: order.totalAmount,
        guestName: order.guestName ?? order.customer?.name ?? 'Customer',
        trackingNumber: order.trackingNumber,
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        items: order.items.map((item) => ({
          id: item.id,
          bookTitle: item.book.title,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          bookType: item.bookType,
        })),
      },
    });
  } catch (error) {
    console.error('[API] POST /api/bookstore/track error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to look up order.' },
      { status: 500 },
    );
  }
}
