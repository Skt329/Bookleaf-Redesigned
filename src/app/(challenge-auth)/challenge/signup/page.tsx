'use client';

/**
 * Challenge Signup Page — #TheWriteAngle
 *
 * Creates a CHALLENGER user via /api/auth/challenge-signup,
 * then auto-signs in via NextAuth credentials.
 */

import { useState, type FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ChallengeSignupPage() {
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
    if (!/[A-Z]/.test(password))
      return 'Password must contain at least one uppercase letter.';
    if (!/[0-9]/.test(password))
      return 'Password must contain at least one number.';
    if (!/[^A-Za-z0-9]/.test(password))
      return 'Password must contain at least one special character.';
    if (password !== confirmPassword) return 'Passwords do not match.';
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
      const res = await fetch('/api/auth/challenge-signup', {
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

      // Auto-login after signup
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        window.location.href = '/challenge/login';
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
          21 Days. 21 Poems. One Published Book.
        </p>
      </div>

      {/* ── Card ── */}
      <div className="card-accent p-8">
        {error && (
          <div
            className="mb-6 rounded-lg border border-status-danger/20 bg-status-danger/5 px-4 py-3 text-body-sm text-status-danger"
            role="alert"
            id="challenge-signup-error"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Name */}
          <div>
            <Label htmlFor="challenge-signup-name">Full Name</Label>
            <Input
              id="challenge-signup-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Rumi Tagore"
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="challenge-signup-email">Email Address</Label>
            <Input
              id="challenge-signup-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          {/* Phone (optional) */}
          <div>
            <Label htmlFor="challenge-signup-phone">
              Phone <span className="font-normal text-text-muted">(optional)</span>
            </Label>
            <Input
              id="challenge-signup-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
            />
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="challenge-signup-password">Password</Label>
            <Input
              id="challenge-signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
            />
            <p className="mt-1.5 text-[11px] text-text-muted">
              Must be at least 8 characters, with 1 uppercase letter, 1 number, and 1 special character.
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <Label htmlFor="challenge-signup-confirm-password">
              Confirm Password
            </Label>
            <Input
              id="challenge-signup-confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="accent"
            size="lg"
            disabled={isLoading}
            className="w-full"
            id="challenge-signup-submit"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating account…
              </span>
            ) : (
              <>
                <Sparkles className="size-4" />
                Join the Challenge
              </>
            )}
          </Button>
        </form>

        {/* Links */}
        <div className="mt-6 space-y-3 border-t border-border-muted pt-6 text-center">
          <p className="font-body text-body-sm text-text-muted">
            Already have an account?{' '}
            <Link
              href="/challenge/login"
              className="font-semibold text-brand-primary transition-colors hover:text-brand-primary-light"
            >
              Log in
            </Link>
          </p>
          <p className="font-body text-caption text-text-muted">
            Want to publish a book instead?{' '}
            <Link
              href="/signup"
              className="font-semibold text-brand-accent transition-colors hover:text-brand-accent-hover"
            >
              Sign up as Author
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
