/**
 * NextAuth v5 configuration for BookLeaf Publishing.
 *
 * Uses Prisma adapter with JWT strategy. Credentials provider
 * authenticates against bcrypt-hashed passwords stored in the
 * `users` table. Role, ID, and authorId are forwarded into the
 * JWT/session so middleware and components can enforce RBAC.
 *
 * Supports three user roles:
 * - CHALLENGER: Writing challenge participants
 * - AUTHOR: Full author portal access
 * - ADMIN: Platform administration
 */

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';

import { prisma } from '@/lib/prisma';
import { authConfig } from './auth.config';

import type { UserRole } from '@prisma/client';

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: UserRole }).role;
      }

      if (
        (trigger === 'signIn' || !token.authorId) &&
        token.role === 'AUTHOR'
      ) {
        const author = await prisma.author.findFirst({
          where: { userId: token.id as string },
          select: { id: true },
        });
        token.authorId = author?.id ?? null;
      }

      return token;
    },
  },
});

// ---------------------------------------------------------------------------
// Module augmentation — extend NextAuth types with our custom fields
// ---------------------------------------------------------------------------

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      authorId?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    role?: UserRole;
  }
}
