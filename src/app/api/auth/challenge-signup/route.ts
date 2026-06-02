/**
 * Challenge Signup API Route
 *
 * POST /api/auth/challenge-signup
 *
 * Creates a new User with role: CHALLENGER.
 * Does NOT create an Author record (challengers aren't authors yet).
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

import { prisma } from '@/lib/prisma';

const challengeSignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Please enter a valid email address'),
  phone: z.string().optional(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = challengeSignupSchema.safeParse(body);
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

    // Create User with CHALLENGER role (no Author record)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        password: hashedPassword,
        role: 'CHALLENGER',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return NextResponse.json(
      { success: true, data: { id: user.id, email: user.email } },
      { status: 201 },
    );
  } catch (error) {
    console.error('[CHALLENGE_SIGNUP_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
