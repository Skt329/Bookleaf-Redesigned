/**
 * BookLeaf Publishing — Middleware
 *
 * Enforces route protection and role-based access control.
 *
 * - `/author/*`  → AUTHOR or ADMIN only
 * - `/admin/*`   → ADMIN only
 * - `/login`, `/signup` → redirect authenticated users to their dashboard
 */

import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

import type { UserRole } from '@prisma/client';

export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;
  const isLoggedIn = !!session?.user;
  const role = session?.user?.role as UserRole | undefined;
  const pathname = nextUrl.pathname;

  // ── Auth pages: redirect logged-in users to their dashboard ──
  if (pathname === '/login' || pathname === '/signup') {
    if (isLoggedIn) {
      const dashboardUrl =
        role === 'ADMIN' ? '/admin/dashboard' : '/author/dashboard';
      return NextResponse.redirect(new URL(dashboardUrl, nextUrl));
    }
    return NextResponse.next();
  }

  // ── Protected: /author/* → must be AUTHOR or ADMIN ──
  if (pathname.startsWith('/author')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', nextUrl));
    }
    if (role !== 'AUTHOR' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', nextUrl));
    }
    return NextResponse.next();
  }

  // ── Protected: /admin/* → must be ADMIN ──
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', nextUrl));
    }
    if (role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', nextUrl));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/author/:path*',
    '/admin/:path*',
    '/login',
    '/signup',
  ],
};
