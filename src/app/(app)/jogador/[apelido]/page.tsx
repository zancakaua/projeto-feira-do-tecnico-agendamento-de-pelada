import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getPlayerHistory } from "@/lib/player-history"
import { PlayerSheet } from "@/components/profile/player-sheet"

async function loadProfile(apelido: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, nickname, avatar_url, city, position, level")
    .eq("nickname", apelido.toLowerCase())
    .maybeSingle()
  return { supabase, profile: data }
}

export async function generateMetadata({ params }: PageProps<"/jogador/[apelido]">): Promise<Metadata> {
  const { apelido } = await params
  const { profile } = await loadProfile(apelido)
  return { title: profile ? `${profile.full_name} (@${profile.nickname})` : "Jogador não encontrado" }
}

export default async function PlayerPage({ params }: PageProps<"/jogador/[apelido]">) {
  const { apelido } = await params
  const { supabase, profile } = await loadProfile(apelido)
  if (!profile) notFound()
  const history = await getPlayerHistory(supabase, profile.id)
  return <PlayerSheet profile={profile} history={history} />
}
