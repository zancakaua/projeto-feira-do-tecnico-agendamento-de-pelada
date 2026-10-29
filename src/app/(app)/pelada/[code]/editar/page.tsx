import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { MatchForm } from "@/components/match/match-form"
import { matchToDefaults } from "@/lib/match-defaults"
import { getMatchView } from "@/lib/match-view"

export const metadata: Metadata = { title: "Editar pelada" }

export default async function EditMatchPage({ params }: PageProps<"/pelada/[code]/editar">) {
  const { code } = await params
  const supabase = await createClient()
  const view = await getMatchView(supabase, code)
  if (!view) notFound()
  if (!view.is_organizer || view.match.status === "cancelada") redirect(`/pelada/${code}`)

  const { data: venues } = await supabase
    .from("venues")
    .select("id, name, address, neighborhood, city")
    .eq("owner_id", view.match.organizer_id)
    .order("created_at")

  return (
    <>
      <div className="mb-8 border-b-[3px] border-double border-ink pb-4">
        <h1 className="font-label text-3xl leading-none font-bold">Editar pelada</h1>
        <p className="mt-2 text-muted">Se mudar horário, local ou valor, todo mundo da lista recebe aviso.</p>
      </div>
      <MatchForm mode="edit" code={code} defaults={matchToDefaults(view.match)} venues={venues ?? []} />
    </>
  )
}
