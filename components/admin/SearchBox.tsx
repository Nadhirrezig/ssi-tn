import type { ReactNode } from 'react'

/**
 * Plain GET search form: the query lives in the URL, so a search can be
 * shared and survives reloads. `children` carries hidden fields to keep.
 */
export default function SearchBox({
  action,
  defaultValue,
  label,
  placeholder,
  children,
}: {
  action: string
  defaultValue?: string
  /** Screen-reader label. */
  label: string
  placeholder: string
  children?: ReactNode
}) {
  return (
    <form role="search" action={action} className="relative w-full lg:w-80">
      {children}
      <label htmlFor="q" className="sr-only">
        {label}
      </label>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slatebody"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        id="q"
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-11 pr-4 text-sm text-navy placeholder:text-slatebody/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </form>
  )
}
