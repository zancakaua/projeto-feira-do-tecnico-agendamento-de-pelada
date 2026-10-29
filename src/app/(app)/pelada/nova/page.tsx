import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { MatchForm } from "@/components/match/match-form"
import { blankDefaults, matchToDefaults } from "@/lib/match-defaults"
import { getMatchView } from "@/lib/match-view"

export const metadata: Metadata = { title: "Nova pelada" }

export default async function NewMatchPage({ searchParams }: PageProps<"/pelada/nova">) {
  const { de } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/entrar?volta=/pelada/nova")

  const [{ data: profile }, { data: venues }] = await Promise.all([
    supabase.from("profiles").select("city").eq("id", user.id).single(),
    supabase.from("venues").select("id, name, address, neighborhood, city").eq("owner_id", user.id).order("created_at"),
  ])

  // Duplicar: só a partir de uma pelada que a própria pessoa organiza
  const source = typeof de === "string" ? await getMatchView(supabase, de) : null
  const duplicating = source?.is_organizer ? source.match : null
  const defaults = duplicating
    ? matchToDefaults(duplicating, { duplicate: true })
    : blankDefaults(profile?.city ?? "Juiz de Fora")

  return (
    <>
      <div className="mb-8 border-b-[3px] border-double border-ink pb-4">
        <h1 className="font-label text-3xl leading-none font-bold">{duplicating ? "Duplicar pelada" : "Nova pelada"}</h1>
        <p className="mt-2 text-muted">
          {duplicating
            ? "Tudo igual, uma semana depois. Ajusta o que mudou."
            : "Preenche a súmula. Depois é só mandar o link no grupo."}
        </p>
      </div>
      <MatchForm mode="create" defaults={defaults} venues={venues ?? []} />
    </>
  )
}
