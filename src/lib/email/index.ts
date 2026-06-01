/**
 * Email provider barrel export.
 *
 * Use `getEmailProvider()` to obtain the configured provider instance.
 * The active provider is controlled by the `EMAIL_PROVIDER` env var
 * (default: `console`).
 *
 * @example
 * ```ts
 * import { getEmailProvider } from '@/lib/email';
 *
 * const email = getEmailProvider();
 * await email.sendEmail({ to: 'a@b.com', subject: 'Hi', html: '<p>Hello</p>' });
 * ```
 */

export type { EmailOptions, EmailProvider, EmailResult } from './provider';
export { ConsoleEmailProvider } from './console';

import type { EmailProvider } from './provider';
import { ConsoleEmailProvider } from './console';

/** Singleton cache. */
let _instance: EmailProvider | null = null;

/**
 * Return the configured email provider.
 *
 * Reads `EMAIL_PROVIDER` from `process.env` on first call and caches the
 * result for the lifetime of the process.
 *
 * Supported values:
 * - `console` (default) – logs to stdout; suitable for development.
 *
 * @throws {Error} If the requested provider is unknown.
 */
export function getEmailProvider(): EmailProvider {
  if (_instance) return _instance;

  const provider = process.env.EMAIL_PROVIDER ?? 'console';

  switch (provider) {
    case 'console':
      _instance = new ConsoleEmailProvider();
      break;
    default:
      throw new Error(
        `[Email] Unknown provider "${provider}". Supported: console`,
      );
  }

  return _instance;
}
