import Link from "next/link"
import type { Database } from "@/types/database"
import { matchWhen, relativeDay } from "@/lib/dates"
import { formatPrice } from "@/lib/money"
import { COURT_LABEL, LEVEL_LABEL } from "@/lib/labels"

export type ExploreMatch = Database["public"]["Functions"]["explore_matches"]["Returns"][number]

// Linha do Explorar: data à esquerda, o quê/onde no meio, vagas que restam em destaque à direita
export function ExploreRow({ m }: { m: ExploreMatch }) {
  const when = matchWhen(m.starts_at, m.duration_minutes)
  const left = Math.max(0, m.field_slots - m.linha)
  const gkLeft = Math.max(0, m.goalkeeper_slots - m.goleiro)
  const meta = [COURT_LABEL[m.court_type], formatPrice(m.price_cents), m.level ? LEVEL_LABEL[m.level] : null]
    .filter(Boolean)
    .join(" · ")

  return (
    <article className="relative grid grid-cols-[3.75rem_1fr_4.5rem] items-stretch border-b border-rule py-3 has-[a:hover]:bg-paper-deep sm:grid-cols-[4.5rem_1fr_6rem]">
      <div className="border-r border-ink pr-2 text-center">
        <p className="label-caps text-muted">{when.weekday}</p>
        <p className="typed text-[1.9rem] leading-none">{when.day}</p>
        <p className="label-caps text-muted">{when.month}</p>
      </div>

      <div className="min-w-0 px-3">
        <h2 className="font-label text-lg leading-tight font-bold">
          <Link href={`/pelada/${m.code}`} className="no-underline after:absolute after:inset-0 hover:underline">
            {m.title}
          </Link>
        </h2>
        <p className="mt-0.5 text-[0.95rem]">
          <span className="typed">{when.start}</span> · {relativeDay(m.starts_at)}
        </p>
        <p className="truncate text-[0.95rem] text-muted">
          {m.venue_name} · {m.neighborhood}
        </p>
        <p className="mt-1 truncate text-sm text-muted">{meta}</p>
      </div>

      <div className="flex flex-col items-center justify-center border-l border-rule pl-2 text-center">
        {left > 0 ? (
          <>
            <p className="typed text-[2rem] leading-none text-stamp">{left}</p>
            <p className="label-caps text-ink">{left === 1 ? "vaga" : "vagas"}</p>
          </>
        ) : (
          <>
            <p className="font-label text-sm font-bold tracking-[0.1em] text-stamp uppercase">Lotou</p>
            <p className="mt-0.5 text-xs text-muted">{m.espera ? `${m.espera} na espera` : "tem espera"}</p>
          </>
        )}
        {gkLeft > 0 ? (
          <p className="mt-1 text-xs leading-tight font-semibold">
            +{gkLeft} {gkLeft === 1 ? "goleiro" : "goleiros"}
          </p>
        ) : null}
      </div>
    </article>
  )
}
