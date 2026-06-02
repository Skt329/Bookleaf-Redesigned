import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { PUBLISHING_PACKAGES } from '@/constants';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { packageName } = await request.json();
    if (!packageName || !['BASIC', 'PREMIUM', 'PROFESSIONAL'].includes(packageName)) {
      return NextResponse.json({ error: 'Invalid or missing packageName' }, { status: 400 });
    }

    // Check if user has Author record, upgrade if they are a CHALLENGER
    let author = await prisma.author.findUnique({
      where: { userId: session.user.id },
    });

    if (!author) {
      author = await prisma.$transaction(async (tx) => {
        await tx.$executeRawUnsafe('LOCK TABLE authors IN EXCLUSIVE MODE;');

        const lastAuthor = await tx.author.findFirst({
          orderBy: { authorId: 'desc' },
          select: { authorId: true },
        });
        const lastNum = lastAuthor ? parseInt(lastAuthor.authorId.replace('AUTH', ''), 10) : 0;
        const newAuthorId = `AUTH${String(lastNum + 1).padStart(3, '0')}`;

        const newAuthor = await tx.author.create({
          data: {
            userId: session.user.id,
            authorId: newAuthorId,
            penName: session.user.name,
          },
        });

        await tx.user.update({
          where: { id: session.user.id },
          data: { role: 'AUTHOR' },
        });

        return newAuthor;
      });
    }

    if (!author) {
      return NextResponse.json({ error: 'Failed to configure author profile' }, { status: 500 });
    }

    // Lookup package in database, self-heal if missing
    let dbPackage = await prisma.publishingPackage.findUnique({
      where: { name: packageName },
    });

    if (!dbPackage) {
      const constantsPkg = PUBLISHING_PACKAGES.find(
        (p) => p.name.toUpperCase() === packageName,
      );
      if (!constantsPkg) {
        return NextResponse.json({ error: 'Package config not found' }, { status: 400 });
      }

      dbPackage = await prisma.publishingPackage.create({
        data: {
          name: packageName,
          price: constantsPkg.price,
          features: constantsPkg.features as any,
        },
      });
    }

    // Create pending purchase record
    const purchase = await prisma.packagePurchase.create({
      data: {
        authorId: author.id,
        packageId: dbPackage.id,
        status: 'PENDING',
      },
    });

    // Determine origin URL
    const origin =
      request.headers.get('origin') ??
      request.headers.get('x-forwarded-host') ??
      'http://localhost:3000';
    const baseUrl = origin.startsWith('http') ? origin : `https://${origin}`;

    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      currency: 'inr',
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `BookLeaf ${packageName.charAt(0) + packageName.slice(1).toLowerCase()} Publishing Package`,
              description: 'Includes professional editing, cover design, ISBN, and global distribution.',
            },
            unit_amount: dbPackage.price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        purchaseId: purchase.id,
        authorId: author.id,
        packageName: dbPackage.name,
      },
      success_url: `${baseUrl}/author/dashboard?package_success=true&package=${dbPackage.name}`,
      cancel_url: `${baseUrl}/get-published`,
    });

    return NextResponse.json({ success: true, url: stripeSession.url });
  } catch (error) {
    console.error('[API] POST /api/packages/checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
