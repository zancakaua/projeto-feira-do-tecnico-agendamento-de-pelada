import { matchWhen } from "./dates"
import { formatPrice } from "./money"
import type { MatchView, RosterEntry } from "./match-view"

// Mensagem pronta pro grupo: quando, onde, vagas, valor, a lista atual e o link
export function shareText(view: MatchView, roster: RosterEntry[], url: string) {
  const { match, counts } = view
  const when = matchWhen(match.starts_at, match.duration_minutes)
  const left = Math.max(0, match.field_slots - counts.linha)
  const confirmed = roster.filter((p) => p.status === "confirmado")
  const day = when.dateLabel.charAt(0).toUpperCase() + when.dateLabel.slice(1)

  const lines = [
    `⚽ *${match.title}*`,
    `📅 ${day}, ${when.start} às ${when.end}`,
    `📍 ${match.venue_name}, ${match.neighborhood}`,
    left > 0 ? `🟥 Faltam ${left} ${left === 1 ? "vaga" : "vagas"} (${counts.linha}/${match.field_slots})` : `🟥 Lotou, mas tem lista de espera`,
    `💸 ${formatPrice(match.price_cents)}`,
  ]
  if (confirmed.length) {
    lines.push("", "*Lista:*")
    confirmed.forEach((p, i) => lines.push(`${i + 1}. ${p.full_name}${p.slot === "goleiro" ? " (gol)" : ""}`))
  }
  lines.push("", `Bora? Confirma aqui: ${url}`)
  return lines.join("\n")
}

export function whatsappShareUrl(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}
