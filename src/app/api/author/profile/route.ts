import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

/**
 * GET /api/author/profile — Get current author's profile
 */
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      phone: true,
      city: true,
      avatarUrl: true,
    },
  });

  const author = await prisma.author.findFirst({
    where: { userId: session.user.id },
    select: {
      penName: true,
      authorBio: true,
      socialLinks: true,
      authorId: true,
    },
  });

  return NextResponse.json({
    success: true,
    data: { user, author },
  });
}

/**
 * PUT /api/author/profile — Update profile
 */
export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { section } = body;

  if (section === 'personal') {
    const { name, phone, city } = body;
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(city !== undefined && { city }),
      },
    });
    return NextResponse.json({ success: true, message: 'Personal info updated' });
  }

  if (section === 'author') {
    const { penName, authorBio } = body;
    await prisma.author.updateMany({
      where: { userId: session.user.id },
      data: {
        ...(penName !== undefined && { penName }),
        ...(authorBio !== undefined && { authorBio }),
      },
    });
    return NextResponse.json({ success: true, message: 'Author info updated' });
  }

  if (section === 'password') {
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Both passwords required' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (!user?.password) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashed },
    });

    return NextResponse.json({ success: true, message: 'Password updated' });
  }

  return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
}
