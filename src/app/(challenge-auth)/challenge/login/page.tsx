'use client';

/**
 * Challenge Login Page — #TheWriteAngle
 *
 * Uses NextAuth signIn('credentials') and redirects to /challenge/dashboard.
 */

import { useState, type FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ChallengeLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

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
        window.location.href = '/challenge/dashboard';
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
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-brand-accent shadow-gold">
            <Sparkles className="size-7 text-brand-dark" />
          </div>
          <h1 className="font-display text-display-sm text-brand-primary">
            #TheWriteAngle
          </h1>
        </Link>
        <p className="mt-2 font-body text-body-sm text-text-muted">
          Welcome back — continue your writing journey
        </p>
      </div>

      {/* ── Card ── */}
      <div className="card-accent p-8">
        {error && (
          <div
            className="mb-6 rounded-lg border border-status-danger/20 bg-status-danger/5 px-4 py-3 text-body-sm text-status-danger"
            role="alert"
            id="challenge-login-error"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Email */}
          <div>
            <Label htmlFor="challenge-login-email">Email Address</Label>
            <Input
              id="challenge-login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <Label htmlFor="challenge-login-password" className="mb-0">
                Password
              </Label>
              <Link
                href="#"
                className="font-body text-caption text-brand-accent transition-colors hover:text-brand-accent-hover"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="challenge-login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="accent"
            size="lg"
            disabled={isLoading}
            className="w-full"
            id="challenge-login-submit"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in…
              </span>
            ) : (
              'Log In'
            )}
          </Button>
        </form>

        {/* Links */}
        <div className="mt-6 border-t border-border-muted pt-6 text-center">
          <p className="font-body text-body-sm text-text-muted">
            New here?{' '}
            <Link
              href="/challenge/signup"
              className="font-semibold text-brand-accent transition-colors hover:text-brand-accent-hover"
            >
              Join the challenge
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
