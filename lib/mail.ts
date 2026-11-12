import 'server-only'

import nodemailer, { type Transporter } from 'nodemailer'

/** A rendered message, ready to send. Templates in lib/emails build these. */
export type MailMessage = {
  to: string
  subject: string
  html: string
  /** Plain-text alternative — some clients and most spam filters read it. */
  text: string
}

let transport: Transporter | undefined

/**
 * One SMTP transport per server instance, created on first send so a missing
 * variable surfaces as a send failure rather than a crash at import time.
 *
 * cPanel mail servers accept implicit TLS on 465 (the default here) and
 * STARTTLS on 587; `secure` follows the port. Any other port (a local mail
 * catcher on 1025, say) is plain SMTP, and SMTP_USER/SMTP_PASS may be left
 * empty there.
 */
function getTransport(): Transporter {
  if (transport) return transport

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (!SMTP_HOST) {
    throw new Error(
      'SMTP is not configured — expected SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS in the environment.'
    )
  }

  const port = Number(SMTP_PORT ?? 465)
  transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    // A serverless function has a hard time limit; fail fast instead of
    // hanging on an unreachable mail server until the platform kills it.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  })
  return transport
}

/**
 * Sends one message through the cPanel SMTP server.
 *
 * Callers run this after the response (Better Auth through its background-task
 * handler, Server Actions through `after()`), so nobody is waiting on it — a
 * failure is logged with enough context to find the message, then rethrown.
 */
export async function sendMail(message: MailMessage): Promise<void> {
  const from = process.env.MAIL_FROM
  if (!from) throw new Error('MAIL_FROM is not set — expected e.g. "SSI <support@ssi-tn.com>".')

  try {
    await getTransport().sendMail({ from, ...message })
  } catch (error) {
    console.error(`[mail] failed to send "${message.subject}" to ${message.to}:`, error)
    throw error
  }
}
