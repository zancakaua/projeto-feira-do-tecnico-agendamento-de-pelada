import { matchWhen, relativeDay } from "@/lib/dates"

export type MatchRowData = {
  code: string
  title: string
  starts_at: string
  duration_minutes: number
  venue_name: string
  neighborhood: string
  status: "aberta" | "cancelada"
}

type Role = "confirmado" | "espera" | "organizo"

const ROLE_LABEL: Record<Role, string> = {
  confirmado: "Tô dentro",
  espera: "Na espera",
  organizo: "Organizo",
}

// Linha da súmula: bloco de data datilografado + o quê/onde + carimbo de situação
export function MatchRow({ match, role }: { match: MatchRowData; role: Role }) {
  const when = matchWhen(match.starts_at, match.duration_minutes)
  const cancelled = match.status === "cancelada"
  return (
    <article className="grid grid-cols-[4.25rem_1fr] border-b border-rule py-3 last:border-b-0">
      <div className="border-r border-ink pr-3 text-center">
        <p className="label-caps text-muted">{when.weekday}</p>
        <p className="typed text-[2.1rem] leading-none">{when.day}</p>
        <p className="label-caps text-muted">{when.month}</p>
      </div>
      <div className="min-w-0 pl-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className={`font-label text-lg leading-tight font-bold ${cancelled ? "text-muted line-through" : ""}`}>
            {match.title}
          </h3>
          <span
            className={`shrink-0 border px-1.5 py-0.5 font-label text-[0.7rem] font-bold tracking-[0.1em] uppercase ${
              cancelled
                ? "border-stamp text-stamp"
                : role === "confirmado"
                  ? "border-stamp bg-stamp text-white"
                  : "border-ink text-ink"
            }`}
          >
            {cancelled ? "Cancelada" : ROLE_LABEL[role]}
          </span>
        </div>
        <p className="mt-0.5 text-[0.95rem]">
          <span className="typed">{when.start}</span> · {relativeDay(match.starts_at)}
        </p>
        <p className="truncate text-[0.95rem] text-muted">
          {match.venue_name} · {match.neighborhood}
        </p>
      </div>
    </article>
  )
}
