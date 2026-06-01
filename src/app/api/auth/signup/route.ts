/**
 * Signup API Route
 *
 * POST /api/auth/signup
 *
 * Creates a new User (role: AUTHOR) and linked Author record.
 * Validates input with Zod, hashes password with bcryptjs.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

import { prisma } from '@/lib/prisma';

// ── Zod v4 schema ──
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Please enter a valid email address'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

/** Generate a sequential author ID like AUTH001 */
async function generateAuthorId(): Promise<string> {
  const count = await prisma.author.count();
  return `AUTH${String(count + 1).padStart(3, '0')}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? 'Validation failed' },
        { status: 400 },
      );
    }

    const { name, email, phone, password } = parsed.data;

    // Check for existing user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create User + Author in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const authorId = await generateAuthorId();

      const newUser = await tx.user.create({
        data: {
          name,
          email,
          phone: phone || null,
          password: hashedPassword,
          role: 'AUTHOR',
          author: {
            create: {
              authorId,
            },
          },
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });

      return newUser;
    });

    return NextResponse.json(
      { success: true, data: { id: user.id, email: user.email } },
      { status: 201 },
    );
  } catch (error) {
    console.error('[SIGNUP_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
