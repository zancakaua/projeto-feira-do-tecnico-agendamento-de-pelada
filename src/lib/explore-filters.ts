import { TZDate } from "@date-fns/tz"
import { addDays, startOfDay } from "date-fns"
import type { Enums } from "@/types/database"
import { TIMEZONE } from "./dates"
import { COURT_TYPES } from "./validations/match"
import { LEVELS } from "./validations/profile"

export const WHEN_OPTIONS = ["hoje", "amanha", "semana", "fds"] as const
export type When = (typeof WHEN_OPTIONS)[number]

export type ExploreFilters = {
  city: string
  neighborhood: string | null
  when: When | null
  from: string
  to: string | null
  courts: Enums<"court_type">[]
  level: Enums<"skill_level"> | null
  maxPrice: number | null
  needGoalkeeper: boolean
  q: string | null
}

type Params = Record<string, string | string[] | undefined>

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() || null
const many = (v: string | string[] | undefined) => (Array.isArray(v) ? v : v ? [v] : [])

function range(when: When | null, now: Date): { from: Date; to: Date | null } {
  const today = startOfDay(new TZDate(now, TIMEZONE))
  switch (when) {
    case "hoje":
      return { from: now, to: addDays(today, 1) }
    case "amanha":
      return { from: addDays(today, 1), to: addDays(today, 2) }
    case "semana":
      return { from: now, to: addDays(now, 7) }
    case "fds": {
      const dow = today.getDay()
      const saturday = dow === 0 ? addDays(today, -1) : addDays(today, (6 - dow + 7) % 7)
      const from = saturday.getTime() > now.getTime() ? saturday : now
      return { from, to: addDays(saturday, 2) }
    }
    default:
      return { from: now, to: null }
  }
}

const iso = (d: Date) => new Date(d.getTime()).toISOString()

export function parseFilters(params: Params, opts: { defaultCity: string; now?: Date }): ExploreFilters {
  const now = opts.now ?? new Date()
  const whenRaw = one(params.quando)
  const when = WHEN_OPTIONS.includes(whenRaw as When) ? (whenRaw as When) : null
  const { from, to } = range(when, now)
  const levelRaw = one(params.nivel)
  const priceRaw = one(params.preco)
  const price = priceRaw !== null && /^\d{1,4}$/.test(priceRaw) ? Number(priceRaw) * 100 : null

  return {
    city: one(params.cidade) ?? opts.defaultCity,
    neighborhood: one(params.bairro),
    when,
    from: iso(from),
    to: to ? iso(to) : null,
    courts: many(params.quadra).filter((c): c is Enums<"court_type"> => (COURT_TYPES as readonly string[]).includes(c)),
    level: (LEVELS as readonly string[]).includes(levelRaw ?? "") ? (levelRaw as Enums<"skill_level">) : null,
    maxPrice: price,
    needGoalkeeper: one(params.goleiro) === "1",
    q: one(params.q)?.slice(0, 80) ?? null,
  }
}

export function filtersToParams(f: ExploreFilters, defaultCity: string) {
  const p = new URLSearchParams()
  if (f.city !== defaultCity) p.set("cidade", f.city)
  if (f.neighborhood) p.set("bairro", f.neighborhood)
  if (f.when) p.set("quando", f.when)
  for (const c of f.courts) p.append("quadra", c)
  if (f.level) p.set("nivel", f.level)
  if (f.maxPrice !== null) p.set("preco", String(f.maxPrice / 100))
  if (f.needGoalkeeper) p.set("goleiro", "1")
  if (f.q) p.set("q", f.q)
  return p.toString()
}

export function activeFilterCount(f: ExploreFilters) {
  return [f.neighborhood, f.when, f.courts.length > 0, f.level, f.maxPrice !== null, f.needGoalkeeper].filter(Boolean).length
}
