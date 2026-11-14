import type { InputHTMLAttributes, ReactNode } from 'react'

/** Shared link style for the small print around the forms. */
export const AUTH_LINK = 'font-semibold text-primary underline-offset-2 hover:underline'

/** Label above, input, optional helper text below — or the field's error in its place. */
export function Field({
  label,
  optional = false,
  hint,
  error,
  id,
  ...input
}: {
  label: string
  /** Adds "(facultatif)" after the label. */
  optional?: boolean
  hint?: string
  error?: string
  id: string
} & InputHTMLAttributes<HTMLInputElement>) {
  const note = error ?? hint
  return (
    <div>
      <label htmlFor={id} className="block font-heading text-sm font-bold text-navy">
        {label}
        {optional ? <span className="ml-1 font-body text-xs font-normal text-slatebody">(facultatif)</span> : null}
      </label>
      <input
        id={id}
        className={`${FIELD_INPUT} ${error ? 'border-accentCoral' : 'border-black/10'}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={note ? `${id}-note` : undefined}
        {...input}
      />
      {note ? (
        <p id={`${id}-note`} className={`mt-1.5 text-xs ${error ? 'font-semibold text-[#B4234A]' : 'text-slatebody'}`}>
          {note}
        </p>
      ) : null}
    </div>
  )
}

/** Input look shared by Field and custom inputs (password with buttons). Border colour is added by the caller. */
export const FIELD_INPUT =
  'mt-2 block w-full rounded-xl border bg-white px-4 py-3 text-base text-navy transition placeholder:text-slatebody/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60'

export function SubmitButton({ pending, children }: { pending: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="inline-flex w-full items-center justify-center rounded-full bg-primary px-8 py-3.5 font-heading text-base font-bold text-white transition hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  )
}

/**
 * Inline message above the submit button. role="alert" for errors so screen
 * readers announce them; role="status" for confirmations.
 */
export function FormMessage({ tone, children }: { tone: 'error' | 'success'; children: ReactNode }) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={
        tone === 'error'
          ? 'rounded-xl bg-accentCoral/10 px-4 py-3 text-sm leading-relaxed text-navy'
          : 'rounded-xl bg-primary-50 px-4 py-3 text-sm leading-relaxed text-navy'
      }
    >
      {children}
    </div>
  )
}
