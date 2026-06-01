import { redirect } from 'next/navigation';

/**
 * Legacy challenge-dashboard route.
 * Redirects to the new challenge dashboard at /challenge/dashboard.
 */
export default function LegacyChallengeDashboard() {
  redirect('/challenge/dashboard');
}
