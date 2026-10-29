import { TZDate } from "@date-fns/tz"
import { format } from "date-fns"
import { TIMEZONE } from "./dates"

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

// "2026-10-30" + "20:00" no horário de São Paulo -> ISO em UTC
export function toStartsAt(date: string, time: string) {
  const [y, m, d] = date.split("-").map(Number)
  const [h, min] = time.split(":").map(Number)
  return new Date(new TZDate(y, m - 1, d, h, min, TIMEZONE).getTime()).toISOString()
}

export function localParts(iso: string) {
  const local = new TZDate(new Date(iso), TIMEZONE)
  return { date: format(local, "yyyy-MM-dd"), time: format(local, "HH:mm") }
}

// O Brasil não tem horário de verão desde 2019: somar 7 dias exatos mantém o horário local
export function weeklyOccurrences(startsAt: string, extraWeeks: number) {
  const first = new Date(startsAt).getTime()
  return Array.from({ length: extraWeeks + 1 }, (_, i) => new Date(first + i * WEEK_MS).toISOString())
}
