'use client';

import { useEffect } from 'react';

interface SessionGuardProps {
  loginUrl: string;
}

export function SessionGuard({ loginUrl }: SessionGuardProps) {
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const session = await res.json();
        
        // If session is empty, null, or doesn't have a user, redirect
        if (!session || Object.keys(session).length === 0 || !session.user) {
          window.location.href = loginUrl;
        }
      } catch (error) {
        console.error('Failed to check session:', error);
      }
    };

    // 1. Check on mount (initial page load)
    checkSession();

    // 2. Check on pageshow event (handles back/forward cache / bfcache restoration)
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        checkSession();
      }
    };

    // 3. Check on visibilitychange (when user switches back to the tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkSession();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loginUrl]);

  return null;
}
