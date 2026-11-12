'use client'

import type { KeyboardEvent, TextareaHTMLAttributes } from 'react'
import { MESSAGE_MAX_LENGTH } from '@/lib/ticket-status'

/**
 * Controlled textarea with a live character count. ⌘/Ctrl + Entrée submits the
 * surrounding form — the shortcut people expect from modern support tools.
 */
export default function MessageTextarea({
  id,
  value,
  onValueChange,
  className = '',
  'aria-describedby': describedBy,
  ...props
}: {
  id: string
  value: string
  onValueChange: (value: string) => void
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange' | 'id'>) {
  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  const nearLimit = value.length > MESSAGE_MAX_LENGTH * 0.9

  return (
    <div>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onKeyDown={onKeyDown}
        maxLength={MESSAGE_MAX_LENGTH}
        aria-describedby={[describedBy, `${id}-count`].filter(Boolean).join(' ')}
        className={`block w-full resize-y rounded-xl border border-black/10 bg-white px-4 py-3 text-[15px] leading-relaxed text-navy transition placeholder:text-slatebody/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60 ${className}`}
        {...props}
      />
      <p
        id={`${id}-count`}
        className={`mt-1.5 text-right text-xs ${nearLimit ? 'font-semibold text-navy' : 'text-slatebody'}`}
      >
        {value.length.toLocaleString('fr-FR')} / {MESSAGE_MAX_LENGTH.toLocaleString('fr-FR')}
      </p>
    </div>
  )
}
