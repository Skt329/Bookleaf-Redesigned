/**
 * Provider-agnostic email sending abstraction.
 *
 * Implementations wrap a specific transport (SMTP, SES, Resend, console, …)
 * behind a single `sendEmail` method so the rest of the application never
 * couples to a particular vendor.
 */

/** Options for composing and sending a single email. */
export interface EmailOptions {
  /** Recipient address(es). */
  to: string | string[];
  /** Email subject line. */
  subject: string;
  /** HTML body content. */
  html: string;
  /** Sender address override (falls back to a provider-level default). */
  from?: string;
  /** Reply-to address override. */
  replyTo?: string;
}

/** Result returned after attempting to send an email. */
export interface EmailResult {
  /** Whether the email was accepted by the transport. */
  success: boolean;
  /** Provider-assigned message identifier (if available). */
  messageId?: string;
  /** Human-readable error description on failure. */
  error?: string;
}

/** Interface that every email provider must implement. */
export interface EmailProvider {
  /**
   * Send a single email.
   *
   * @param options - Addressing, subject, and body details.
   * @returns A result indicating success or failure.
   */
  sendEmail(options: EmailOptions): Promise<EmailResult>;
}
