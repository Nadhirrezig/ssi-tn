import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white pb-10 pt-20">
      <div className="mx-auto max-w-content px-6">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link href="#home" className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 2 4.5 13.2c-.4.5 0 1.3.6 1.3H11l-1 7.5c-.1.7.8 1.1 1.2.5L19.5 11c.4-.5 0-1.3-.6-1.3H13l1-7.2c.1-.7-.8-1.1-1.2-.5Z" />
                </svg>
              </span>
              <span className="font-heading text-2xl font-bold text-navy">Base</span>
            </Link>
            <p className="mt-6 max-w-xs text-base leading-relaxed text-slatebody">
              A production-ready Next.js SaaS boilerplate with everything you need to launch your next product.
            </p>
            <div className="mt-6 flex gap-3">
              <SocialLink aria-label="Twitter" href="#">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 5.8a8 8 0 0 1-2.4.7 4 4 0 0 0 1.8-2.2 8 8 0 0 1-2.6 1A4 4 0 0 0 11.5 9 11.3 11.3 0 0 1 3.4 4.8 4 4 0 0 0 4.6 10 4 4 0 0 1 2.8 9.5v.1a4 4 0 0 0 3.2 3.9 4 4 0 0 1-1.8.1 4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 18.1 11.3 11.3 0 0 0 8.1 20c7.3 0 11.3-6 11.3-11.3v-.5A8 8 0 0 0 22 5.8Z" />
                </svg>
              </SocialLink>
              <SocialLink aria-label="LinkedIn" href="#">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3zM9 9h3.8v1.7h.1A4.2 4.2 0 0 1 16.6 9c4 0 4.4 2.4 4.4 5.6V21h-4v-5.5c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21H9z" />
                </svg>
              </SocialLink>
              <SocialLink aria-label="GitHub" href="#">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.4-2.2-.2-4.6-1.1-4.6-5a4 4 0 0 1 1-2.7c-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7a4 4 0 0 1 1 2.7c0 3.9-2.3 4.8-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" />
                </svg>
              </SocialLink>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-heading text-base font-bold text-navy">Product</h4>
            <ul className="mt-5 space-y-3 text-base">
              <li><Link href="#features" className="transition hover:text-primary">Features</Link></li>
              <li><Link href="#pricing" className="transition hover:text-primary">Pricing</Link></li>
              <li><Link href="#projects" className="transition hover:text-primary">Showcase</Link></li>
              <li><Link href="#" className="transition hover:text-primary">Changelog</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading text-base font-bold text-navy">Company</h4>
            <ul className="mt-5 space-y-3 text-base">
              <li><Link href="#why" className="transition hover:text-primary">About</Link></li>
              <li><Link href="#" className="transition hover:text-primary">Blog</Link></li>
              <li><Link href="#" className="transition hover:text-primary">Careers</Link></li>
              <li><Link href="#" className="transition hover:text-primary">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-heading text-base font-bold text-navy">Support</h4>
            <ul className="mt-5 space-y-3 text-base">
              <li><Link href="#faq" className="transition hover:text-primary">FAQ</Link></li>
              <li><Link href="#" className="transition hover:text-primary">Documentation</Link></li>
              <li><Link href="#" className="transition hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="#" className="transition hover:text-primary">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-black/5 pt-8 sm:flex-row">
          <p className="text-sm text-slatebody">© 2026 Base Template. All rights reserved.</p>
          <p className="text-sm text-slatebody">Designed for a Next.js + Tailwind build.</p>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({ href, children, 'aria-label': ariaLabel }: { href: string; children: React.ReactNode; 'aria-label': string }) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className="grid h-10 w-10 place-items-center rounded-full bg-soft text-slatebody transition hover:bg-primary hover:text-white"
    >
      {children}
    </Link>
  )
}
