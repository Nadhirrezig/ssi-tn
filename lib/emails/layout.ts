import 'server-only'

import { SITE_URL } from '@/lib/site'
import { LOGO_CID, LOGO_HEIGHT, LOGO_WIDTH } from '@/lib/emails/logo'
import { iconSrc } from '@/lib/emails/images'
import type { EmailIcon } from '@/lib/emails/icons'

/**
 * Escapes text for HTML element content and attribute values.
 *
 * Every value that came from a user — a name, a ticket title — goes through
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

/* Email palette. Royal blue, close to the logo's, rather than the site's
   indigo. Email clients ignore stylesheets and CSS variables, so every value
   is written inline. White on BLUE is 6:1 (WCAG AA). */
const BLUE = '#2453E6'
const BLUE_DARK = '#1D43C8'
const BLUE_50 = '#E6EDFF'
const CARD = '#F2F5FE'
const NAVY = '#15172E'
const BODY = '#55596E'
const MUTED = '#7C8096'
const LINE = '#E4E8F2'
const PAGE = '#F4F6FB'
const FONT = "'Open Sans', 'Segoe UI', Arial, Helvetica, sans-serif"
const HEADING_FONT = "'Quicksand', 'Segoe UI', Arial, Helvetica, sans-serif"

const PHONE_DISPLAY = '+216 28 290 350'
const PHONE_HREF = 'tel:+21628290350'
const CONTACT_EMAIL = 'contact@ssi-tn.com'

const LOGO_DISPLAY_WIDTH = 140
const LOGO_DISPLAY_HEIGHT = Math.round((LOGO_DISPLAY_WIDTH * LOGO_HEIGHT) / LOGO_WIDTH)

/** The big round icon above the heading: what kind of news this is, at a glance. */
const TONE_ICON = { success: 'check', info: 'mail', security: 'key', neutral: 'info' } as const satisfies Record<
  string,
  EmailIcon
>
export type EmailTone = keyof typeof TONE_ICON

/** Status pill colours — the site's status palette, as email-safe pairs (AA contrast). */
const PILLS = {
  blue: { background: '#DCE5FF', color: BLUE_DARK, dot: BLUE },
  yellow: { background: '#FFF1C2', color: '#6B5000', dot: '#F2B600' },
  navy: { background: '#E6E8F0', color: NAVY, dot: NAVY },
  coral: { background: '#FFE1E8', color: '#AE1F3E', dot: '#FF5C7C' },
} as const
export type PillTone = keyof typeof PILLS

/** One line of the details card: an icon, a label and its value — or a status pill. */
export type DetailRow =
  | { icon: 'ticket' | 'calendar' | 'user'; label: string; value: string }
  | { pill: PillTone; label: string; value: string }

export type EmailContent = {
  /** Shown by inbox previews after the subject; never rendered in the body. */
  preheader: string
  tone?: EmailTone
  heading: string
  /** "Bonjour Amine," — on its own line above the text. */
  greeting?: string
  /** Plain-text paragraphs. Escaped here — do not pass pre-escaped HTML. */
  paragraphs: string[]
  /** The details card: ticket number, date, status… */
  details?: DetailRow[]
  action?: { label: string; url: string }
  /** Small print under the button, e.g. link expiry or "ignore if not you". */
  footnote?: string
}

/** Escaped text with line breaks; "e-mail" is kept on one line (phones would break it at the hyphen). */
const text = (value: string) =>
  escapeHtml(value)
    .replace(/\n/g, '<br>')
    .replace(/\be-mail/g, '<span style="white-space:nowrap;">e-mail</span>')

const img = (src: string, size: number, alt = '') =>
  `<img src="${src}" width="${size}" height="${size}" alt="${alt}" style="display:block;border:0;outline:none;width:${size}px;height:${size}px;">`

function header() {
  return `<tr><td class="ssi-pad" style="padding:28px 40px 24px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td valign="middle">
        <img class="ssi-logo" src="cid:${LOGO_CID}" width="${LOGO_DISPLAY_WIDTH}" height="${LOGO_DISPLAY_HEIGHT}" alt="SSI — Société des Sécurités et Solutions Informatiques" style="display:block;border:0;outline:none;width:${LOGO_DISPLAY_WIDTH}px;height:auto;">
      </td>
      <td valign="middle" align="right">
        <table role="presentation" cellpadding="0" cellspacing="0" align="right"><tr>
          <td class="ssi-tagline" style="border-left:2px solid ${BLUE};padding:2px 0 2px 14px;font-family:${FONT};font-size:13px;line-height:1.5;color:${BODY};text-align:left;">À vos côtés,<br>pour une assistance fiable.</td>
        </tr></table>
      </td>
    </tr></table>
  </td></tr>
  <tr><td height="3" style="height:3px;background:${BLUE};font-size:0;line-height:0;">&nbsp;</td></tr>`
}

function badge(tone: EmailTone) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto;"><tr>
    <td width="96" height="96" align="center" valign="middle" style="width:96px;height:96px;border-radius:48px;background:${BLUE_50};">
      <table role="presentation" cellpadding="0" cellspacing="0" align="center"><tr><td>${img(iconSrc(TONE_ICON[tone]), tone === 'success' ? 44 : 40)}</td></tr></table>
    </td>
  </tr></table>`
}

function detailsCard(rows: DetailRow[]) {
  const items = rows
    .map((row, i) => {
      const lead =
        'pill' in row
          ? `<div style="width:12px;height:12px;border-radius:6px;background:${PILLS[row.pill].dot};margin:0 auto;font-size:0;line-height:0;">&nbsp;</div>`
          : `<table role="presentation" cellpadding="0" cellspacing="0" align="center"><tr><td>${img(iconSrc(row.icon), 26)}</td></tr></table>`
      const value =
        'pill' in row
          ? `<span style="display:inline-block;margin-top:4px;padding:5px 14px;border-radius:999px;background:${PILLS[row.pill].background};color:${PILLS[row.pill].color};font-family:${HEADING_FONT};font-size:15px;font-weight:700;line-height:1.3;">${escapeHtml(row.value)}</span>`
          : `<p style="margin:2px 0 0;font-family:${HEADING_FONT};font-size:18px;font-weight:700;line-height:1.35;color:${NAVY};word-break:break-word;">${escapeHtml(row.value)}</p>`
      return `<tr>
        <td width="44" valign="middle" style="width:44px;padding:${i ? 18 : 0}px 0 0;">${lead}</td>
        <td valign="middle" style="padding:${i ? 18 : 0}px 0 0 14px;">
          <p style="margin:0;font-family:${FONT};font-size:14px;line-height:1.4;color:${MUTED};">${escapeHtml(row.label)}</p>
          ${value}
        </td>
      </tr>`
    })
    .join('')
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:12px 0 32px;"><tr>
    <td class="ssi-card-pad" style="background:${CARD};border-radius:18px;padding:26px 28px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${items}</table>
    </td>
  </tr></table>`
}

function actionButton({ label, url }: { label: string; url: string }) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:4px auto 0;"><tr>
    <td align="center" style="border-radius:999px;background:${BLUE};box-shadow:0 14px 28px -14px rgba(36,83,230,0.65);">
      <a href="${escapeHtml(url)}" style="display:inline-block;padding:16px 38px;font-family:${HEADING_FONT};font-size:17px;font-weight:700;line-height:1.2;color:#ffffff;text-decoration:none;border-radius:999px;">${escapeHtml(label)}&nbsp;&nbsp;→</a>
    </td>
  </tr></table>`
}

function footer(site: string) {
  const item = (icon: EmailIcon, href: string, label: string) =>
    `<td class="ssi-foot-item" align="center" valign="middle" style="padding:0 8px;">
      <a href="${href}" style="color:#ffffff;text-decoration:none;font-family:${FONT};font-size:14px;line-height:20px;white-space:nowrap;">
        <img src="${iconSrc(icon)}" width="18" height="18" alt="" style="display:inline-block;vertical-align:middle;border:0;width:18px;height:18px;margin-right:10px;"><span style="vertical-align:middle;">${label}</span>
      </a>
    </td>`
  const sep = `<td class="ssi-foot-sep" width="1" style="width:1px;padding:0;"><div style="width:1px;height:28px;background:rgba(255,255,255,0.35);font-size:0;line-height:0;">&nbsp;</div></td>`
  return `<tr><td class="ssi-foot-wrap" style="background:${NAVY};padding:24px 24px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      ${item('phone', PHONE_HREF, PHONE_DISPLAY)}
      ${sep}
      ${item('footer-mail', `mailto:${CONTACT_EMAIL}`, CONTACT_EMAIL)}
      ${sep}
      ${item('globe', SITE_URL, escapeHtml(site))}
    </tr></table>
  </td></tr>`
}

/**
 * Renders the SSI email: logo and tagline over a blue rule, a round icon and
 * a centred headline, the greeting and text, an optional details card, a
 * centred button, the sign-off, and a navy band with phone, email and site.
 * Table layout with inline styles — what Outlook and Gmail reliably display.
 *
 * Images are `cid:` references; sendMail attaches the ones used (see
 * lib/emails/images.ts), previews swap them for data URIs.
 */
export function renderEmail(content: EmailContent): { html: string; text: string } {
  const { preheader, tone = 'info', heading, greeting, paragraphs, details, action, footnote } = content
  const site = SITE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '')

  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(heading)}</title>
<style>
  @media (max-width: 600px) {
    .ssi-pad { padding-left: 24px !important; padding-right: 24px !important; }
    .ssi-h1 { font-size: 24px !important; }
    .ssi-logo { width: 112px !important; }
    .ssi-tagline { font-size: 11px !important; padding-left: 10px !important; }
    .ssi-card-pad { padding: 20px 18px !important; }
    .ssi-foot-wrap { padding: 20px 24px !important; }
    .ssi-foot-item { display: block !important; width: 100% !important; text-align: left !important; padding: 6px 0 !important; }
    .ssi-foot-sep { display: none !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${PAGE};-webkit-text-size-adjust:100%;">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;color:${PAGE};">${escapeHtml(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAGE};">
  <tr><td align="center" style="padding:32px 12px 40px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:24px;border-collapse:separate;overflow:hidden;box-shadow:0 16px 48px -16px rgba(21,23,46,0.16);">
      ${header()}

      <tr><td class="ssi-pad" style="padding:44px 48px 0;">
        ${badge(tone)}
        <h1 class="ssi-h1" style="margin:28px 0 32px;text-align:center;font-family:${HEADING_FONT};font-size:30px;line-height:1.25;font-weight:700;color:${NAVY};">${escapeHtml(heading)}</h1>
        ${greeting ? `<p style="margin:0 0 14px;font-family:${HEADING_FONT};font-size:18px;font-weight:700;line-height:1.4;color:${NAVY};">${escapeHtml(greeting)}</p>` : ''}
        ${paragraphs
          .map((p) => `<p style="margin:0 0 16px;font-family:${FONT};font-size:16px;line-height:1.7;color:${BODY};">${text(p)}</p>`)
          .join('')}
        ${details?.length ? detailsCard(details) : '<div style="height:16px;font-size:0;line-height:0;">&nbsp;</div>'}
        ${action ? actionButton(action) : ''}
        ${footnote ? `<p style="margin:20px 0 0;text-align:center;font-family:${FONT};font-size:13px;line-height:1.6;color:${MUTED};">${text(footnote)}</p>` : ''}

        <p style="margin:36px 0 4px;font-family:${FONT};font-size:16px;line-height:1.6;color:${BODY};">Merci pour votre confiance.</p>
        <p style="margin:0;font-family:${HEADING_FONT};font-size:18px;font-weight:700;color:${NAVY};">L’équipe SSI</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;"><tr><td style="border-top:1px solid ${LINE};height:36px;font-size:0;line-height:0;">&nbsp;</td></tr></table>
      </td></tr>

      ${footer(site)}
    </table>
  </td></tr>
</table>
</body>
</html>`

  const plain = [
    heading,
    '',
    ...(greeting ? [greeting, ''] : []),
    ...paragraphs.flatMap((p) => [p, '']),
    ...(details?.length ? [...details.map((row) => `${row.label} : ${row.value}`), ''] : []),
    ...(action ? [`${action.label} : ${action.url}`, ''] : []),
    ...(footnote ? [footnote, ''] : []),
    'Merci pour votre confiance.',
    'L’équipe SSI',
    '',
    `${PHONE_DISPLAY} · ${CONTACT_EMAIL} · ${site}`,
  ].join('\n')

  return { html, text: plain }
}
