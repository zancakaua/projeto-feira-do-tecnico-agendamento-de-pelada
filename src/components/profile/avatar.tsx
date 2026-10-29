import Image from "next/image"

const SIZES = {
  sm: { box: "h-12 w-9", text: "text-base", px: 48 },
  md: { box: "h-20 w-15", text: "text-2xl", px: 80 },
  lg: { box: "h-32 w-24", text: "text-4xl", px: 128 },
} as const

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase()
}

// Foto 3x4 de ficha: moldura de tinta, sem cantos arredondados
export function Avatar({ url, name, size = "md" }: { url: string | null; name: string; size?: keyof typeof SIZES }) {
  const s = SIZES[size]
  return (
    <div className={`${s.box} relative shrink-0 overflow-hidden border border-ink bg-paper-deep`}>
      {url ? (
        <Image src={url} alt={`Foto de ${name}`} fill sizes={`${s.px}px`} className="object-cover grayscale-[15%]" />
      ) : (
        <span aria-hidden className={`typed absolute inset-0 grid place-items-center ${s.text} text-muted`}>
          {initials(name)}
        </span>
      )}
    </div>
  )
}
