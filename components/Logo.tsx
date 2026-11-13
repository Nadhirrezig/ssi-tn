'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { scrollToTopIfHome } from '@/lib/scroll'

/**
 * SSI brand lockup (shield + wordmark). Uses the real logo asset so the
 * brand reads consistently in the header and footer.
 */
export default function Logo({
  href = '/',
  imgClassName = 'h-11 w-auto',
  preload = false,
}: {
  href?: string
  imgClassName?: string
  preload?: boolean
}) {
  const pathname = usePathname()
  return (
    <Link
      href={href}
      onClick={(e) => scrollToTopIfHome(e, pathname, href)}
      aria-label="SSI — Sécurité et Solutions Informatiques, retour à l'accueil"
      className="inline-flex items-center transition-opacity hover:opacity-80"
    >
      <Image
        src="/logo.png"
        alt="SSI — Sécurité et Solutions Informatiques"
        width={578}
        height={277}
        preload={preload}
        className={imgClassName}
      />
    </Link>
  )
}
