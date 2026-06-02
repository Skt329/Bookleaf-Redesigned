'use client';

/**
 * Login Page — BookLeaf Publishing
 *
 * Dual-purpose tab-selectable credentials-based login form.
 * Supports Author Portal and #TheWriteAngle Challenge login.
 */

import { useState, type FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { BookOpen, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [loginType, setLoginType] = useState<'author' | 'challenge'>('author');
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
        // Redirect based on role / selected portal
        window.location.href = loginType === 'challenge' 
          ? '/challenge/dashboard' 
          : '/author/dashboard';
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleTypeChange = (type: 'author' | 'challenge') => {
    setLoginType(type);
    setError('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="animate-fade-in relative">
      {/* ── Branding ── */}
      <div className="mb-8 text-center relative z-10">
        <Link href="/" className="inline-block">
          <div className="flex items-center justify-center gap-2">
            <h1 className="font-display text-display-sm text-brand-primary">
              BookLeaf
            </h1>
            {loginType === 'challenge' && (
              <span className="badge bg-brand-accent/20 text-brand-accent text-caption font-semibold">
                #TheWriteAngle
              </span>
            )}
          </div>
        </Link>
        <p className="mt-2 font-body text-body-sm text-text-muted">
          {loginType === 'challenge' 
            ? 'Sign in to your Writing Challenge account' 
            : 'Sign in to your Author account'}
        </p>
      </div>

      {/* ── Card ── */}
      <div 
        className={cn(
          "transition-all duration-500 ease-in-out p-8 relative overflow-hidden",
          loginType === 'challenge' ? "card-accent" : "card"
        )}
      >
        {/* Decorative corner gold wash */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-brand-accent/10 to-transparent pointer-events-none rounded-tr-lg" />

        {/* Tab Selector */}
        <div className="flex bg-surface-muted p-1 rounded-lg mb-6 relative z-10" role="tablist" aria-label="Portal type">
          <button
            role="tab"
            aria-selected={loginType === 'author'}
            onClick={() => handleTypeChange('author')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-body-sm font-semibold transition-all relative cursor-pointer border-0 outline-none focus:outline-none",
              loginType === 'author' 
                ? "bg-surface-card text-brand-primary shadow-sm" 
                : "text-text-muted hover:text-text-primary"
            )}
          >
            <BookOpen className="w-4 h-4" />
            Author Portal
          </button>
          <button
            role="tab"
            aria-selected={loginType === 'challenge'}
            onClick={() => handleTypeChange('challenge')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-body-sm font-semibold transition-all relative cursor-pointer border-0 outline-none focus:outline-none",
              loginType === 'challenge' 
                ? "bg-surface-card text-brand-primary shadow-sm" 
                : "text-text-muted hover:text-text-primary"
            )}
          >
            <Sparkles className="w-4 h-4 text-brand-accent" />
            Challenge Login
          </button>
        </div>

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
              'w-full rounded-lg px-6 py-3 shrink-0 cursor-pointer border-0 outline-none focus:outline-none',
              'font-body text-body-md font-semibold',
              'transition-all duration-200',
              'focus:ring-2 focus:ring-border-focus focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-60',
              loginType === 'challenge'
                ? 'bg-brand-accent hover:bg-brand-accent-hover text-brand-dark shadow-gold'
                : 'bg-brand-primary hover:bg-brand-primary-hover text-text-inverse hover:shadow-md'
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
            {loginType === 'challenge' ? (
              <>
                New to the challenge?{' '}
                <Link
                  href="/challenge/signup"
                  className="font-semibold text-brand-accent hover:text-brand-accent-hover transition-colors"
                >
                  Join the challenge
                </Link>
              </>
            ) : (
              <>
                Don&apos;t have an account?{' '}
                <Link
                  href="/signup"
                  className="font-semibold text-brand-accent hover:text-brand-accent-hover transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
