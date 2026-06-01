import type { EmailOptions, EmailProvider, EmailResult } from './provider';

/**
 * Development-only email provider that prints messages to the console
 * instead of sending them over the wire.
 *
 * Always returns `success: true` so calling code can proceed normally.
 */
export class ConsoleEmailProvider implements EmailProvider {
  async sendEmail(options: EmailOptions): Promise<EmailResult> {
    const recipients = Array.isArray(options.to)
      ? options.to.join(', ')
      : options.to;

    const divider = '─'.repeat(60);
    const preview = stripHtml(options.html).slice(0, 280);
    const messageId = `console-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    console.log(`
${divider}
📧  EMAIL (dev console)
${divider}
  From:     ${options.from ?? '(default sender)'}
  To:       ${recipients}
  Reply-To: ${options.replyTo ?? '(none)'}
  Subject:  ${options.subject}
${divider}
  ${preview}${options.html.length > 280 ? '…' : ''}
${divider}
  Message-ID: ${messageId}
${divider}
`);

    return { success: true, messageId };
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Naïve HTML-to-plain-text converter for preview purposes. */
function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
