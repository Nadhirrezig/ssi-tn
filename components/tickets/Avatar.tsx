/** Initials disc for a client; the SSI mark for the team. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0] ?? '?').slice(0, 2)
  return letters.toUpperCase()
}

export default function Avatar({
  name,
  team = false,
  size = 'md',
}: {
  name: string
  team?: boolean
  size?: 'sm' | 'md'
}) {
  const box = size === 'sm' ? 'h-8 w-8 text-[11px]' : 'h-10 w-10 text-xs'
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full font-heading font-bold ${box} ${
        team ? 'bg-navy text-white' : 'bg-primary-50 text-primary'
      }`}
    >
      {team ? 'SSI' : initials(name)}
    </span>
  )
}
