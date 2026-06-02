import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOrderNumber } from '@/lib/utils';
import { stripe } from '@/lib/stripe';
import { z } from 'zod';

const checkoutSchema = z.object({
  guestName: z.string().min(1, 'Name is required'),
  guestEmail: z.string().email('Valid email is required'),
  guestPhone: z.string().min(10, 'Phone number is required'),
  paymentMethod: z.enum(['STRIPE', 'COD']),
  shippingAddress: z.object({
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    pincode: z.string().min(6).max(6),
  }),
  items: z
    .array(
      z.object({
        bookId: z.string(),
        quantity: z.number().int().positive(),
        unitPrice: z.number().int().nonnegative(),
        bookType: z.enum(['PAPERBACK', 'EBOOK']),
      }),
    )
    .min(1, 'At least one item is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Invalid data' },
        { status: 400 },
      );
    }

    const { guestName, guestEmail, guestPhone, paymentMethod, shippingAddress, items } = parsed.data;

    // Validate that all books exist and are published
    const bookIds = items.map((item) => item.bookId);
    const books = await prisma.book.findMany({
      where: { id: { in: bookIds }, status: 'PUBLISHED' },
      select: { id: true, mrp: true, title: true },
    });

    if (books.length !== bookIds.length) {
      return NextResponse.json(
        { success: false, error: 'One or more books are unavailable' },
        { status: 400 },
      );
    }

    // Calculate total from actual DB prices (prevent price manipulation)
    const totalAmount = items.reduce((sum, item) => {
      const book = books.find((b) => b.id === item.bookId);
      return sum + (book?.mrp ?? 0) * item.quantity;
    }, 0);

    const orderNumber = generateOrderNumber();

    // Determine URLs for Stripe
    const origin =
      request.headers.get('origin') ??
      request.headers.get('x-forwarded-host') ??
      'http://localhost:3000';
    const baseUrl = origin.startsWith('http') ? origin : `https://${origin}`;

    // Create order + items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          guestName,
          guestEmail: guestEmail.toLowerCase(),
          guestPhone,
          totalAmount,
          shippingAddress,
          status: paymentMethod === 'COD' ? 'CONFIRMED' : 'PENDING',
          stripePaymentStatus: paymentMethod === 'COD' ? 'COD' : 'PENDING',
          items: {
            create: items.map((item) => ({
              bookId: item.bookId,
              quantity: item.quantity,
              unitPrice: books.find((b) => b.id === item.bookId)?.mrp ?? 0,
              bookType: item.bookType,
            })),
          },
        },
        include: {
          items: { include: { book: { select: { title: true } } } },
        },
      });

      // Create admin notification
      await tx.adminNotification.create({
        data: {
          type: 'NEW_ORDER',
          title: paymentMethod === 'COD' ? 'New COD Order Placed' : 'New Order Initiated',
          message: `${guestName} placed order ${orderNumber} (Method: ${paymentMethod}) for ${items.length} item(s) totalling ₹${(totalAmount / 100).toFixed(2)}.`,
          referenceId: newOrder.id,
        },
      });

      return newOrder;
    });

    if (paymentMethod === 'STRIPE') {
      const stripeSession = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        currency: 'inr',
        line_items: items.map((item) => {
          const dbBook = books.find((b) => b.id === item.bookId);
          return {
            price_data: {
              currency: 'inr',
              product_data: {
                name: dbBook?.title || 'Book',
                description: `${item.bookType === 'EBOOK' ? 'eBook' : 'Paperback'} Edition`,
              },
              unit_amount: dbBook?.mrp ?? 0,
            },
            quantity: item.quantity,
          };
        }),
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber,
        },
        success_url: `${baseUrl}/bookstore/checkout?stripe_success=true&order=${order.orderNumber}&email=${guestEmail}`,
        cancel_url: `${baseUrl}/bookstore/cart`,
      });

      return NextResponse.json({
        success: true,
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          status: order.status,
          stripeUrl: stripeSession.url,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
        cod: true,
      },
    });
  } catch (error) {
    console.error('[API] POST /api/bookstore/checkout error:', error);
    return NextResponse.json(
      { success: false, error: 'Checkout failed. Please try again.' },
      { status: 500 },
    );
  }
}
