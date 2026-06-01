'use client';

/**
 * Signup Page — BookLeaf Publishing
 *
 * Client-side form with validation. Calls POST /api/auth/signup
 * then auto-logs in via NextAuth signIn('credentials').
 */

import { useState, type FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function validate(): string | null {
    if (name.trim().length < 2) return 'Name must be at least 2 characters.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return 'Please enter a valid email address.';
    if (password.length < 8)
      return 'Password must be at least 8 characters.';
    if (password !== confirmPassword)
      return 'Passwords do not match.';
    return null;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      // 1. Create account via API
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone: phone || undefined, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Signup failed. Please try again.');
        setIsLoading(false);
        return;
      }

      // 2. Auto-login after successful signup
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        // Account created but auto-login failed — redirect to login
        window.location.href = '/login';
      } else {
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
          Start your publishing journey today
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
          {/* Full Name */}
          <div>
            <label
              htmlFor="signup-name"
              className="mb-1.5 block font-body text-body-sm font-medium text-text-primary"
            >
              Full Name
            </label>
            <input
              id="signup-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Austen"
              className={cn(
                'w-full rounded-lg border border-border bg-surface-background px-4 py-2.5',
                'font-body text-body-md text-text-primary placeholder:text-text-muted',
                'transition-all duration-200',
                'focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-border-focus/20',
              )}
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="signup-email"
              className="mb-1.5 block font-body text-body-sm font-medium text-text-primary"
            >
              Email Address
            </label>
            <input
              id="signup-email"
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

          {/* Phone (optional) */}
          <div>
            <label
              htmlFor="signup-phone"
              className="mb-1.5 block font-body text-body-sm font-medium text-text-primary"
            >
              Phone{' '}
              <span className="text-text-muted font-normal">(optional)</span>
            </label>
            <input
              id="signup-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
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
            <label
              htmlFor="signup-password"
              className="mb-1.5 block font-body text-body-sm font-medium text-text-primary"
            >
              Password
            </label>
            <input
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className={cn(
                'w-full rounded-lg border border-border bg-surface-background px-4 py-2.5',
                'font-body text-body-md text-text-primary placeholder:text-text-muted',
                'transition-all duration-200',
                'focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-border-focus/20',
              )}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="signup-confirm-password"
              className="mb-1.5 block font-body text-body-sm font-medium text-text-primary"
            >
              Confirm Password
            </label>
            <input
              id="signup-confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
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
              'w-full rounded-lg bg-brand-accent px-6 py-3',
              'font-body text-body-md font-semibold text-brand-dark',
              'transition-all duration-200',
              'hover:bg-brand-accent-hover hover:shadow-gold',
              'focus:outline-none focus:ring-2 focus:ring-border-accent focus:ring-offset-2',
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
                Creating account…
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-6 border-t border-border-muted pt-6 text-center">
          <p className="font-body text-body-sm text-text-muted">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-brand-primary hover:text-brand-primary-light transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
