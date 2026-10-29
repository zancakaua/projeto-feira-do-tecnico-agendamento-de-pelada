import { TZDate } from "@date-fns/tz"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { TIMEZONE } from "./dates"

const HOUR_MS = 60 * 60 * 1000

// Até quando dá pra sair da lista confirmado (mesma regra do leave_match no banco)
export function leaveDeadline(startsAt: string, hours: number, now: Date = new Date()) {
  const deadline = new Date(new Date(startsAt).getTime() - hours * HOUR_MS)
  const local = new TZDate(deadline, TIMEZONE)
  const weekday = format(local, "EEEE", { locale: ptBR }).slice(0, 3)
  return {
    iso: deadline.toISOString(),
    label: `${weekday} ${format(local, "HH:mm")}`,
    passed: now.getTime() > deadline.getTime(),
  }
}

// Linhas numeradas da súmula: quem confirmou ocupa as primeiras, o resto fica em branco
export function rosterLines<T>(people: T[], capacity: number) {
  const total = Math.max(capacity, people.length)
  return Array.from({ length: total }, (_, i) => ({ n: i + 1, person: people[i] ?? null }))
}

export function whatsappLink(digits: string) {
  return `https://wa.me/${digits.startsWith("55") && digits.length > 11 ? digits : `55${digits}`}`
}
