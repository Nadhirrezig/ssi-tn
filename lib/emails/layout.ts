import 'server-only'

import { SITE_URL } from '@/lib/site'

/**
 * Escapes text for HTML element content and attribute values.
 *
 * Every value that came from a user — a name, a ticket message — goes through
 * this before it reaches a template. Without it, a client could put markup or
 * a phishing link into an email sent from SSI's own domain.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/* Brand values from tailwind.config.ts. Email clients ignore stylesheets and
   CSS variables, so they are repeated here as inline styles. */
const NAVY = '#15172E'
const PRIMARY = '#4F5BFF'
const BODY = '#5B5B6E' // slatebody, darkened for contrast on white in email clients
const SOFT = '#F7F8FD'
const FONT = "'Open Sans', Arial, Helvetica, sans-serif"

export type EmailContent = {
  /** Shown by inbox previews after the subject; never rendered in the body. */
  preheader: string
  heading: string
  /** Plain-text paragraphs. Escaped here — do not pass pre-escaped HTML. */
  paragraphs: string[]
  action?: { label: string; url: string }
  /** Small print under the button, e.g. link expiry or "ignore if not you". */
  footnote?: string
}

/**
 * Renders the shared SSI email shell: a table layout with inline styles, which
 * is what Outlook and Gmail reliably display. Returns both HTML and plain text.
 */
export function renderEmail(content: EmailContent): { html: string; text: string } {
  const { preheader, heading, paragraphs, action, footnote } = content

  const paragraphHtml = paragraphs
    .map(
      (p) =>
        `<p style="margin:0 0 16px;font-family:${FONT};font-size:15px;line-height:1.6;color:${BODY};">${escapeHtml(p).replace(/\n/g, '<br>')}</p>`
    )
    .join('')

  const actionHtml = action
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;"><tr><td style="border-radius:999px;background:${PRIMARY};">
        <a href="${escapeHtml(action.url)}" style="display:inline-block;padding:14px 28px;font-family:${FONT};font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px;">${escapeHtml(action.label)}</a>
      </td></tr></table>
      <p style="margin:0 0 16px;font-family:${FONT};font-size:12px;line-height:1.6;color:${BODY};">Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br><a href="${escapeHtml(action.url)}" style="color:${PRIMARY};word-break:break-all;">${escapeHtml(action.url)}</a></p>`
    : ''

  const footnoteHtml = footnote
    ? `<p style="margin:0;font-family:${FONT};font-size:12px;line-height:1.6;color:${BODY};">${escapeHtml(footnote)}</p>`
    : ''

  const html = `<!doctype html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(heading)}</title></head>
<body style="margin:0;padding:0;background:${SOFT};">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SOFT};padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:24px;">
      <tr><td style="padding:32px 32px 8px;">
        <p style="margin:0;font-family:${FONT};font-size:13px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${PRIMARY};">SSI</p>
      </td></tr>
      <tr><td style="padding:8px 32px 32px;">
        <h1 style="margin:0 0 20px;font-family:${FONT};font-size:22px;line-height:1.3;font-weight:700;color:${NAVY};">${escapeHtml(heading)}</h1>
        ${paragraphHtml}
        ${actionHtml}
        ${footnoteHtml}
      </td></tr>
    </table>
    <p style="margin:24px 0 0;font-family:${FONT};font-size:12px;line-height:1.6;color:${BODY};">
      SSI — Sécurité &amp; Solutions Informatiques · Tunis<br>
      <a href="${SITE_URL}" style="color:${BODY};">${SITE_URL.replace(/^https?:\/\//, '')}</a>
    </p>
  </td></tr>
</table>
</body>
</html>`

  const text = [
    heading,
    '',
    ...paragraphs.flatMap((p) => [p, '']),
    ...(action ? [`${action.label} : ${action.url}`, ''] : []),
    ...(footnote ? [footnote, ''] : []),
    '—',
    'SSI — Sécurité & Solutions Informatiques',
    SITE_URL,
  ].join('\n')

  return { html, text }
}
