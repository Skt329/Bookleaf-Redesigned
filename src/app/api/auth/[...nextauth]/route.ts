/**
 * NextAuth.js catch-all API route.
 *
 * Exposes GET and POST handlers at `/api/auth/*` for OAuth callbacks,
 * session endpoints, CSRF token, etc.
 */

import { handlers } from '@/lib/auth';

export const { GET, POST } = handlers;
