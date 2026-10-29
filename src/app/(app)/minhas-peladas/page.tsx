import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { MatchRow, type MatchRowData, type RowTag } from "@/components/match/match-row"
import { FormAlert } from "@/components/ui/form-alert"

export const metadata: Metadata = { title: "Minhas peladas" }

const ROLE_TAG: Record<"confirmado" | "espera" | "organizo", RowTag> = {
  confirmado: { label: "Tô dentro", tone: "stamp" },
  espera: { label: "Na espera", tone: "outline" },
  organizo: { label: "Organizo", tone: "ink" },
}

const MATCH_FIELDS ="code, title, starts_at, duration_minutes, venue_name, neighborhood, status"

export default async function MyMatchesPage({ searchParams }: PageProps<"/minhas-peladas">) {
  const { senha } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/entrar?volta=/minhas-peladas")

  const now = new Date().toISOString()
  const [{ data: profile }, { data: joined }, { data: organized }] = await Promise.all([
    supabase.from("profiles").select("nickname").eq("id", user.id).single(),
    supabase
      .from("match_participants")
      .select(`status, match:matches!inner(${MATCH_FIELDS})`)
      .eq("user_id", user.id)
      .in("status", ["confirmado", "espera"])
      .gte("match.starts_at", now),
    supabase.from("matches").select(MATCH_FIELDS).eq("organizer_id", user.id).gte("starts_at", now),
  ])

  type Row = { match: MatchRowData; role: "confirmado" | "espera" | "organizo" }
  const rows = new Map<string, Row>()
  for (const m of organized ?? []) rows.set(m.code, { match: m, role: "organizo" })
  for (const p of joined ?? []) {
    if (!rows.has(p.match.code)) rows.set(p.match.code, { match: p.match, role: p.status as "confirmado" | "espera" })
  }
  const upcoming = [...rows.values()].sort((a, b) => a.match.starts_at.localeCompare(b.match.starts_at))

  return (
    <>
      <h1 className="font-label text-3xl leading-none font-bold">Fala, {profile?.nickname ?? "craque"}</h1>
      {senha ? (
        <div className="mt-4">
          <FormAlert tone="ok">Senha trocada. Tá tudo certo.</FormAlert>
        </div>
      ) : null}

      <section aria-labelledby="proximas" className="mt-8">
        <h2 id="proximas" className="label-caps flex items-baseline justify-between border-b-2 border-ink pb-1.5">
          Próximas
          <span className="typed text-base tracking-normal">{upcoming.length}</span>
        </h2>
        {upcoming.length ? (
          upcoming.map(({ match, role }) => <MatchRow key={match.code} match={match} tag={ROLE_TAG[role]} />)
        ) : (
          <p className="py-6 text-muted">Nenhuma pelada marcada por enquanto.</p>
        )}
      </section>
    </>
  )
}
