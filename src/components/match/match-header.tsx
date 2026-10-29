import Link from "next/link"
import { MapPin } from "lucide-react"
import { matchWhen, relativeDay } from "@/lib/dates"
import { formatPrice } from "@/lib/money"
import { COURT_LABEL, LEVEL_LABEL } from "@/lib/labels"
import { matchPhase, spotsLeft, type MatchView } from "@/lib/match-view"

export function stampText(view: MatchView) {
  const phase = matchPhase(view)
  if (phase === "cancelada") return "Cancelada"
  if (phase === "encerrada") return "Encerrada"
  const left = spotsLeft(view).linha
  if (left === 0) return "Lotou"
  return `${left} ${left === 1 ? "vaga" : "vagas"}`
}

function Cell({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`min-w-0 border-ink px-3 py-2 ${className}`}>
      <p className="label-caps text-muted">{label}</p>
      {children}
    </div>
  )
}

// Cabeçalho da súmula: QUANDO, ONDE e QUANTAS VAGAS escaneáveis em 2 segundos
export function MatchHeader({ view }: { view: MatchView }) {
  const { match, counts, organizer } = view
  const when = matchWhen(match.starts_at, match.duration_minutes)
  const left = spotsLeft(view)
  const cancelled = match.status === "cancelada"
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${match.venue_name}, ${match.address}, ${match.neighborhood}, ${match.city}`,
  )}`

  return (
    <header>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="label-caps text-muted">
            Súmula nº <span className="typed tracking-normal">{match.code}</span>
          </p>
          <h1
            className={`mt-1 font-label text-[2rem] leading-[1.02] font-bold break-words ${cancelled ? "text-muted line-through" : ""}`}
          >
            {match.title}
          </h1>
          <p className="mt-1 text-[0.95rem] text-muted">
            Organiza{" "}
            <Link href={`/jogador/${organizer.nickname}`} className="font-semibold text-ink underline hover:text-stamp">
              {organizer.full_name}
            </Link>
          </p>
        </div>
        <p className={`stamp mt-2 shrink-0 text-lg ${cancelled ? "text-ink" : "text-stamp"}`}>{stampText(view)}</p>
      </div>

      <div className="mt-5 border border-ink">
        <div className="grid grid-cols-2 border-b border-ink">
          <Cell label="Data" className="border-r">
            <p className="typed text-[1.85rem] leading-tight">
              {when.day.padStart(2, "0")}/{when.month}
            </p>
            <p className="text-sm text-muted first-letter:uppercase">
              {/^\d/.test(relativeDay(match.starts_at)) ? when.dateLabel.split(",")[0] : relativeDay(match.starts_at)}
            </p>
          </Cell>
          <Cell label="Horário">
            <p className="typed text-[1.85rem] leading-tight">{when.start}</p>
            <p className="text-sm text-muted">até {when.end}</p>
          </Cell>
        </div>
        <Cell label="Local" className="border-b">
          <p className="typed text-lg leading-snug">{match.venue_name}</p>
          <p className="text-[0.95rem]">
            {match.address} · {match.neighborhood}, {match.city}
          </p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 -mb-1 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-stamp underline"
          >
            <MapPin aria-hidden className="size-4" />
            Abrir no mapa
          </a>
        </Cell>
        <div className="grid grid-cols-3">
          <Cell label="Quadra" className="border-r">
            <p className="typed">{COURT_LABEL[match.court_type]}</p>
          </Cell>
          <Cell label="Valor" className="border-r">
            <p className="typed">{formatPrice(match.price_cents)}</p>
          </Cell>
          <Cell label="Nível">
            <p className="typed truncate">{match.level ? LEVEL_LABEL[match.level] : "Qualquer"}</p>
          </Cell>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-3 border-y-2 border-ink py-3 text-center">
        <div>
          <dt className="label-caps text-muted">Linha</dt>
          <dd className="typed text-2xl">
            {counts.linha}
            <span className="text-muted">/{match.field_slots}</span>
          </dd>
          <dd className="text-sm">{left.linha ? `faltam ${left.linha}` : "lotou"}</dd>
        </div>
        <div className="border-x border-rule">
          <dt className="label-caps text-muted">Goleiro</dt>
          <dd className="typed text-2xl">
            {match.goalkeeper_slots ? (
              <>
                {counts.goleiro}
                <span className="text-muted">/{match.goalkeeper_slots}</span>
              </>
            ) : (
              "—"
            )}
          </dd>
          <dd className="text-sm">
            {match.goalkeeper_slots ? (left.goleiro ? `faltam ${left.goleiro}` : "completo") : "reveza"}
          </dd>
        </div>
        <div>
          <dt className="label-caps text-muted">Espera</dt>
          <dd className="typed text-2xl">{counts.espera}</dd>
          <dd className="text-sm">{counts.espera === 1 ? "pessoa" : "pessoas"}</dd>
        </div>
      </dl>
    </header>
  )
}
