'use client'

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

export type DropdownOption<V extends string> = {
  value: V
  label: string
  /** Short second line under the label. */
  hint?: string
  /** Leading visual (a status dot, an icon). Carries the colour; labels stay navy for contrast. */
  icon?: ReactNode
}

/** Rough menu height, to decide whether it fits below the button. */
const MENU_ROOM = 300

/**
 * Select-only dropdown, styled like the rest of the site — replaces the
 * native <select>, whose menu is drawn by the OS and ignores the design.
 *
 * Accessibility follows the WAI-ARIA listbox pattern: the button announces
 * the current choice and opens a listbox; ↑/↓, Home/End move, Enter/Space
 * pick, Esc and Tab close; focus returns to the button. A hidden input carries
 * the value, so the surrounding <form> submits it like a native field.
 *
 * The menu opens upwards when there is not enough room below (reply boxes sit
 * at the bottom of long pages).
 */
export default function Dropdown<V extends string>({
  name,
  value,
  options,
  onChange,
  label,
  disabled = false,
  className = '',
}: {
  /** Form field name for the hidden input. */
  name?: string
  value: V
  options: DropdownOption<V>[]
  onChange: (value: V) => void
  /** Accessible name of the control. */
  label: string
  disabled?: boolean
  className?: string
}) {
  const id = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [upward, setUpward] = useState(false)

  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value))
  const selected = options[selectedIndex]

  // Close on a click or tap anywhere else.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  // Move focus into the list once it is on screen.
  useEffect(() => {
    if (open) listRef.current?.focus()
  }, [open])

  function openMenu(at = selectedIndex) {
    if (disabled) return
    const rect = buttonRef.current?.getBoundingClientRect()
    setUpward(rect ? window.innerHeight - rect.bottom < MENU_ROOM && rect.top > MENU_ROOM : false)
    setActive(at)
    setOpen(true)
  }

  function close(refocus = true) {
    setOpen(false)
    if (refocus) buttonRef.current?.focus()
  }

  function pick(index: number) {
    onChange(options[index].value)
    close()
  }

  function onButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault()
      openMenu(event.key === 'ArrowUp' ? Math.max(0, selectedIndex - 1) : selectedIndex)
    }
  }

  function onListKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    const last = options.length - 1
    const moves: Record<string, () => void> = {
      ArrowDown: () => setActive((i) => Math.min(last, i + 1)),
      ArrowUp: () => setActive((i) => Math.max(0, i - 1)),
      Home: () => setActive(0),
      End: () => setActive(last),
      Enter: () => pick(active),
      ' ': () => pick(active),
      Escape: () => close(),
    }
    if (event.key === 'Tab') {
      close(false)
      return
    }
    const move = moves[event.key]
    if (move) {
      event.preventDefault()
      move()
    }
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {name ? <input type="hidden" name={name} value={value} /> : null}

      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={`${label} : ${selected?.label ?? ''}`}
        disabled={disabled}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={onButtonKeyDown}
        className={`flex w-full items-center gap-2.5 rounded-full border bg-white py-2.5 pl-4 pr-3 text-left font-heading text-sm font-bold text-navy transition hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60 ${
          open ? 'border-primary ring-2 ring-primary/20' : 'border-black/10'
        }`}
      >
        {selected?.icon}
        <span className="min-w-0 flex-1 truncate">{selected?.label}</span>
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 text-slatebody transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          aria-activedescendant={`${id}-opt-${active}`}
          onKeyDown={onListKeyDown}
          className={`absolute left-0 z-30 min-w-full overflow-hidden rounded-2xl border border-black/5 bg-white p-1.5 shadow-card focus:outline-none sm:min-w-[18rem] ${
            upward ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
        >
          {options.map((option, i) => {
            const isSelected = option.value === value
            return (
              <li
                key={option.value}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={isSelected}
                onPointerEnter={() => setActive(i)}
                onClick={() => pick(i)}
                className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                  i === active ? 'bg-soft' : ''
                }`}
              >
                <span className="grid w-3 shrink-0 place-items-center">{option.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-heading text-sm font-bold text-navy">{option.label}</span>
                  {option.hint ? <span className="mt-0.5 block text-xs text-slatebody">{option.hint}</span> : null}
                </span>
                {isSelected ? (
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-primary">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : null}
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
