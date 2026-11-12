/**
 * Shown while a client-area page loads its data. Static shapes in the page's
 * own layout — no shimmer, in line with the site's quiet motion.
 */
export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Chargement…</span>
      <div className="bg-soft py-10 sm:py-14">
        <div className="mx-auto max-w-content px-6">
          <div className="h-3 w-24 rounded-full bg-navy/10" />
          <div className="mt-4 h-8 w-64 max-w-full rounded-full bg-navy/10" />
          <div className="mt-4 h-4 w-96 max-w-full rounded-full bg-navy/5" />
        </div>
      </div>
      <div className="mx-auto max-w-content px-6 py-10 sm:py-14">
        <div className="divide-y divide-black/5 rounded-[24px] border border-black/5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="px-6 py-6">
              <div className="h-3 w-28 rounded-full bg-navy/10" />
              <div className="mt-3 h-4 w-2/3 rounded-full bg-navy/10" />
              <div className="mt-2 h-3 w-1/3 rounded-full bg-navy/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
