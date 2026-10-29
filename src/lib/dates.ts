import { TZDate } from "@date-fns/tz"
import { addMinutes, differenceInCalendarDays, format } from "date-fns"
import { ptBR } from "date-fns/locale"

export const TIMEZONE = "America/Sao_Paulo"

const inSaoPaulo = (value: string | Date) => new TZDate(new Date(value), TIMEZONE)

// "sexta-feira" -> "sexta"; sábado e domingo ficam iguais
const weekdayName = (d: Date) => format(d, "EEEE", { locale: ptBR }).split("-")[0]

export function matchWhen(startsAt: string, durationMinutes: number) {
  const start = inSaoPaulo(startsAt)
  const end = addMinutes(start, durationMinutes)
  const weekday = weekdayName(start)
  return {
    weekday: weekday.slice(0, 3),
    day: format(start, "d"),
    month: format(start, "MMM", { locale: ptBR }).replace(".", ""),
    start: format(start, "HH:mm"),
    end: format(end, "HH:mm"),
    dateLabel: `${weekday}, ${format(start, "d 'de' MMMM", { locale: ptBR })}`,
  }
}

export function relativeDay(startsAt: string, now: Date = new Date()) {
  const date = inSaoPaulo(startsAt)
  const diff = differenceInCalendarDays(date, inSaoPaulo(now))
  if (diff === 0) return "Hoje"
  if (diff === 1) return "Amanhã"
  if (diff === -1) return "Ontem"
  if (diff > 1 && diff < 7) {
    const name = weekdayName(date)
    return name.charAt(0).toUpperCase() + name.slice(1)
  }
  return format(date, "dd/MM")
}
