import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"
import type { MatchRowData } from "@/components/match/match-row"

const FIELDS = "code, title, starts_at, duration_minutes, venue_name, neighborhood, status"

// Histórico respeita o RLS: quem vê o perfil de outra pessoa só enxerga peladas públicas
export async function getPlayerHistory(supabase: SupabaseClient<Database>, userId: string, limit = 20) {
  const now = new Date().toISOString()
  const [played, organized, playedCount, organizedCount] = await Promise.all([
    // Parte de matches (não de match_participants) para ordenar e limitar pela data da pelada
    supabase
      .from("matches")
      .select(`${FIELDS}, match_participants!inner(user_id)`)
      .eq("match_participants.user_id", userId)
      .eq("match_participants.status", "confirmado")
      .eq("status", "aberta")
      .lt("starts_at", now)
      .order("starts_at", { ascending: false })
      .limit(limit),
    supabase
      .from("matches")
      .select(FIELDS)
      .eq("organizer_id", userId)
      .eq("status", "aberta")
      .lt("starts_at", now)
      .order("starts_at", { ascending: false })
      .limit(limit),
    supabase
      .from("match_participants")
      .select("id, match:matches!inner(id)", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "confirmado")
      .eq("match.status", "aberta")
      .lt("match.starts_at", now),
    supabase
      .from("matches")
      .select("id", { count: "exact", head: true })
      .eq("organizer_id", userId)
      .eq("status", "aberta")
      .lt("starts_at", now),
  ])

  return {
    played: (played.data ?? []).map(({ match_participants, ...m }) => m as MatchRowData),
    organized: (organized.data ?? []) as MatchRowData[],
    playedCount: playedCount.count ?? 0,
    organizedCount: organizedCount.count ?? 0,
  }
}
