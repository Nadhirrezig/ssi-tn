import Image from 'next/image'
import Link from 'next/link'

/**
 * SSI brand lockup (shield + wordmark). Uses the real logo asset so the
 * brand reads consistently in the header and footer.
 */
export default function Logo({
  href = '/#home',
  imgClassName = 'h-11 w-auto',
  priority = false,
}: {
  href?: string
  imgClassName?: string
  priority?: boolean
}) {
  return (
    <Link
      href={href}
      aria-label="SSI — Sécurité et Solutions Informatiques, retour à l'accueil"
      className="inline-flex items-center transition-opacity hover:opacity-80"
    >
      <Image
        src="/logo.png"
        alt="SSI — Sécurité et Solutions Informatiques"
        width={578}
        height={277}
        priority={priority}
        className={imgClassName}
      />
    </Link>
  )
}
