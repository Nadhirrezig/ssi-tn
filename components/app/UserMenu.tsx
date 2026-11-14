'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronDown, LogOut } from 'lucide-react'
import Avatar from '@/components/tickets/Avatar'
import { useSignOut } from '@/components/auth/useSignOut'

const ITEM =
  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left font-heading text-sm font-bold text-navy transition hover:bg-soft focus-visible:bg-soft focus-visible:outline-none'

/**
 * Who is signed in, top right of the app bar: avatar (and name from md up)
 * opening a small panel with the account, a way back to the site and
 * sign-out. A disclosure (button + panel), closed by Esc or a click outside.
 */
export default function UserMenu({ name, detail }: { name: string; detail: string }) {
  const id = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const { signOut, pending } = useSignOut()

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      buttonRef.current?.focus()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        aria-label={`Mon compte : ${name}`}
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 transition hover:bg-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
          open ? 'bg-soft' : ''
        }`}
      >
        <Avatar name={name} size="sm" />
        <span className="hidden max-w-[10rem] truncate font-heading text-sm font-bold text-navy md:block">{name}</span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`text-slatebody transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open ? (
        <div
          id={`${id}-panel`}
          className="absolute right-0 top-full z-50 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-black/5 bg-white p-2 shadow-card"
        >
          <div className="flex items-center gap-3 px-3 pb-3 pt-2">
            <Avatar name={name} />
            <div className="min-w-0">
              <p className="truncate font-heading text-sm font-bold text-navy">{name}</p>
              <p className="truncate text-xs text-slatebody">{detail}</p>
            </div>
          </div>
          <div className="border-t border-black/5 pt-2">
            <Link href="/" className={ITEM} onClick={() => setOpen(false)}>
              <ArrowLeft size={18} aria-hidden="true" className="text-slatebody" />
              Retour au site
            </Link>
            <button type="button" onClick={signOut} disabled={pending} className={`${ITEM} disabled:opacity-60`}>
              <LogOut size={18} aria-hidden="true" className={`text-slatebody ${pending ? 'animate-pulse' : ''}`} />
              {pending ? 'Déconnexion…' : 'Se déconnecter'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
