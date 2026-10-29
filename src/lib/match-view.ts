import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database, Enums, Tables } from "@/types/database"

export type MatchView = {
  match: Omit<Tables<"matches">, "search_text">
  organizer: { nickname: string; full_name: string; avatar_url: string | null }
  counts: { linha: number; goleiro: number; espera: number }
  viewer: { status: Enums<"participant_status">; slot: Enums<"slot_kind">; paid: boolean } | null
  is_organizer: boolean
}

// Lê pelo código do link (funciona para peladas privadas também; ver get_match no banco)
export async function getMatchView(supabase: SupabaseClient<Database>, code: string) {
  if (!/^[a-z0-9]{6,32}$/.test(code)) return null
  const { data } = await supabase.rpc("get_match", { p_code: code })
  return (data as MatchView | null) ?? null
}

// aberta = ainda vai acontecer; encerrada = horário já passou
export function matchPhase(v: MatchView, now: number = Date.now()) {
  if (v.match.status === "cancelada") return "cancelada" as const
  return new Date(v.match.starts_at).getTime() > now ? ("aberta" as const) : ("encerrada" as const)
}

export function spotsLeft(v: MatchView) {
  return {
    linha: Math.max(0, v.match.field_slots - v.counts.linha),
    goleiro: Math.max(0, v.match.goalkeeper_slots - v.counts.goleiro),
  }
}
