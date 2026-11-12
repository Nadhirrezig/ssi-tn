/** Phone fallback for urgent issues — a ticket is not the right channel for "everything is down". */
export default function HelpCard() {
  return (
    <div className="rounded-[24px] bg-navy p-5 sm:p-6">
      <p className="font-heading text-xs font-bold uppercase tracking-[0.12em] text-accentYellow">
        Urgence
      </p>
      <p className="mt-3 font-heading text-lg font-bold leading-snug text-white">
        Service bloqué ou incident de sécurité ?
      </p>
      <p className="mt-2 text-sm leading-relaxed text-white/70">
        Appelez directement notre support, nous intervenons en priorité.
      </p>
      <a
        href="tel:+21628290350"
        className="mt-4 inline-flex items-center gap-2 font-heading text-base font-bold text-white transition hover:text-accentYellow"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z" />
        </svg>
        +216 28 290 350
      </a>
    </div>
  )
}
