import 'server-only'

import { LOGO_CID, LOGO_DATA_URI, logoAttachment } from '@/lib/emails/logo'
import { EMAIL_ICONS, type EmailIcon } from '@/lib/emails/icons'

/**
 * Inline images for emails. Templates point at `cid:` addresses; sendMail
 * attaches exactly the images a message references, so a short email does
 * not carry every icon.
 */

const iconCid = (name: string) => `icon-${name}@ssi-tn.com`

/** `src` for an icon in a template. */
export const iconSrc = (name: EmailIcon) => `cid:${iconCid(name)}`

type InlineImage = ReturnType<typeof logoAttachment>

export function inlineImages(html: string): InlineImage[] {
  const images: InlineImage[] = html.includes(`cid:${LOGO_CID}`) ? [logoAttachment()] : []
  for (const [name, icon] of Object.entries(EMAIL_ICONS)) {
    const cid = iconCid(name)
    if (!html.includes(`cid:${cid}`)) continue
    images.push({
      filename: `${name}.png`,
      content: Buffer.from(icon.base64, 'base64'),
      contentType: 'image/png',
      cid,
      contentDisposition: 'inline',
    })
  }
  return images
}

/** The same images as data: URIs — for previews outside a mail client. */
export function withDataUris(html: string): string {
  let out = html.replaceAll(`cid:${LOGO_CID}`, LOGO_DATA_URI)
  for (const [name, icon] of Object.entries(EMAIL_ICONS)) {
    out = out.replaceAll(`cid:${iconCid(name)}`, `data:image/png;base64,${icon.base64}`)
  }
  return out
}
