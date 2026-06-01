/**
 * Prisma client singleton.
 *
 * In development, Next.js hot-reloads modules on every change which would
 * create a new `PrismaClient` each time, eventually exhausting database
 * connections. We cache the instance on `globalThis` to prevent this.
 *
 * @example
 * ```ts
 * import { prisma } from '@/lib/prisma';
 *
 * const books = await prisma.book.findMany();
 * ```
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/** Shared Prisma client instance. */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'warn', 'error']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
