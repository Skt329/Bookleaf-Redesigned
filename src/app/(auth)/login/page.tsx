'use client';

/**
 * Login Page — BookLeaf Publishing
 *
 * Credentials-based login form using NextAuth v5 `signIn` from
 * `next-auth/react`. Semantic design tokens, no direct colors.
 */

import { useState, type FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password. Please try again.');
      } else {
        // Successful login — redirect based on role handled by middleware
        window.location.href = '/author/dashboard';
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="animate-fade-in">
      {/* ── Branding ── */}
      <div className="mb-8 text-center">
        <Link href="/" className="inline-block">
          <h1 className="font-display text-display-sm text-brand-primary">
            BookLeaf
          </h1>
        </Link>
        <p className="mt-2 font-body text-body-sm text-text-muted">
          Welcome back — sign in to your account
        </p>
      </div>

      {/* ── Card ── */}
      <div className="card p-8">
        {/* Error Message */}
        {error && (
          <div
            className="mb-6 rounded-lg border border-status-danger/20 bg-status-danger/5 px-4 py-3 text-body-sm text-status-danger"
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Email */}
          <div>
            <label
              htmlFor="login-email"
              className="mb-1.5 block font-body text-body-sm font-medium text-text-primary"
            >
              Email Address
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={cn(
                'w-full rounded-lg border border-border bg-surface-background px-4 py-2.5',
                'font-body text-body-md text-text-primary placeholder:text-text-muted',
                'transition-all duration-200',
                'focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-border-focus/20',
              )}
            />
          </div>

          {/* Password */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label
                htmlFor="login-password"
                className="block font-body text-body-sm font-medium text-text-primary"
              >
                Password
              </label>
              <Link
                href="#"
                className="font-body text-caption text-brand-accent hover:text-brand-accent-hover transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={cn(
                'w-full rounded-lg border border-border bg-surface-background px-4 py-2.5',
                'font-body text-body-md text-text-primary placeholder:text-text-muted',
                'transition-all duration-200',
                'focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-border-focus/20',
              )}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              'w-full rounded-lg bg-brand-primary px-6 py-3',
              'font-body text-body-md font-semibold text-text-inverse',
              'transition-all duration-200',
              'hover:bg-brand-primary-hover hover:shadow-md',
              'focus:outline-none focus:ring-2 focus:ring-border-focus focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-60',
            )}
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Signing in…
              </span>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-6 border-t border-border-muted pt-6 text-center">
          <p className="font-body text-body-sm text-text-muted">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="font-semibold text-brand-accent hover:text-brand-accent-hover transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
