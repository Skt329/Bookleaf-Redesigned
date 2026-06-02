/**
 * BookLeaf Publishing — Middleware
 *
 * Enforces route protection and role-based access control.
 *
 * - `/author/*`    → AUTHOR or ADMIN only
 * - `/admin/*`     → ADMIN only
 * - `/challenge/*` → CHALLENGER or AUTHOR (dashboard area; not auth pages)
 * - `/login`, `/signup` → redirect authenticated users to their dashboard
 * - `/challenge/login`, `/challenge/signup` → redirect authenticated challengers
 */

import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from '@/lib/auth.config';

const { auth } = NextAuth(authConfig);

type UserRole = 'CHALLENGER' | 'AUTHOR' | 'ADMIN';

export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;
  const isLoggedIn = !!session?.user;
  const role = session?.user?.role as UserRole | undefined;
  const pathname = nextUrl.pathname;

  // Helper to create a response with cache control headers
  const nextWithCacheControl = () => {
    const res = NextResponse.next();
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.headers.set('Pragma', 'no-cache');
    res.headers.set('Expires', '0');
    return res;
  };

  // ── Challenge auth pages: redirect logged-in users ──
  if (
    pathname === '/challenge/login' ||
    pathname === '/challenge/signup'
  ) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/challenge/dashboard', nextUrl));
    }
    return NextResponse.next();
  }

  // ── Auth pages: redirect logged-in users to their dashboard ──
  if (pathname === '/login' || pathname === '/signup') {
    if (isLoggedIn) {
      const dashboardUrl =
        role === 'ADMIN'
          ? '/admin/dashboard'
          : role === 'CHALLENGER'
            ? '/challenge/dashboard'
            : '/author/dashboard';
      return NextResponse.redirect(new URL(dashboardUrl, nextUrl));
    }
    return NextResponse.next();
  }

  // ── Protected: /challenge/* (dashboard area) → CHALLENGER or AUTHOR ──
  if (
    pathname.startsWith('/challenge/dashboard') ||
    pathname.startsWith('/challenge/poems') ||
    pathname.startsWith('/challenge/progress') ||
    pathname.startsWith('/challenge/payment') ||
    pathname.startsWith('/challenge/book')
  ) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/challenge/login', nextUrl));
    }
    if (role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', nextUrl));
    }
    // Allow CHALLENGER and AUTHOR
    return nextWithCacheControl();
  }

  // General fallback check for any other /challenge/* routes (excluding login/signup)
  if (
    pathname.startsWith('/challenge') &&
    pathname !== '/challenge/login' &&
    pathname !== '/challenge/signup'
  ) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/challenge/login', nextUrl));
    }
    if (role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', nextUrl));
    }
    return nextWithCacheControl();
  }

  // ── Protected: /author/* → must be AUTHOR (ADMIN → redirect to admin panel) ──
  if (pathname.startsWith('/author')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', nextUrl));
    }
    if (role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', nextUrl));
    }
    if (role !== 'AUTHOR') {
      return NextResponse.redirect(new URL('/', nextUrl));
    }
    return nextWithCacheControl();
  }

  // ── Protected: /admin/* → must be ADMIN ──
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', nextUrl));
    }
    if (role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', nextUrl));
    }
    return nextWithCacheControl();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/author/:path*',
    '/admin/:path*',
    '/challenge/:path*',
    '/login',
    '/signup',
  ],
};
