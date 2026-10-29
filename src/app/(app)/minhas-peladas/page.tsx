import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { MatchRow, type MatchRowData, type RowTag } from "@/components/match/match-row"
import { FormAlert } from "@/components/ui/form-alert"
import { ButtonLink } from "@/components/ui/button"

export const metadata: Metadata = { title: "Minhas peladas" }

const TABS = [
  { id: "proximas", label: "Próximas" },
  { id: "passadas", label: "Passadas" },
  { id: "organizo", label: "Organizo" },
] as const
type Tab = (typeof TABS)[number]["id"]

const ROLE_TAG: Record<"confirmado" | "espera" | "organizo" | "jogou", RowTag> = {
  confirmado: { label: "Tô dentro", tone: "stamp" },
  espera: { label: "Na espera", tone: "outline" },
  organizo: { label: "Organizo", tone: "ink" },
  jogou: { label: "Jogou", tone: "outline" },
}

const FIELDS = "code, title, starts_at, duration_minutes, venue_name, neighborhood, status"
type Row = { match: MatchRowData; role: keyof typeof ROLE_TAG }

const EMPTY: Record<Tab, string> = {
  proximas: "Nenhuma pelada marcada por enquanto. Procura uma no Explorar ou cria a sua.",
  passadas: "Ainda não tem pelada no histórico.",
  organizo: "Você ainda não organizou nenhuma pelada.",
}

export default async function MyMatchesPage({ searchParams }: PageProps<"/minhas-peladas">) {
  const { senha, aba } = await searchParams
  const tab: Tab = TABS.some((t) => t.id === aba) ? (aba as Tab) : "proximas"
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/entrar?volta=/minhas-peladas")

  const now = new Date().toISOString()
  const { data: profile } = await supabase.from("profiles").select("nickname").eq("id", user.id).single()

  const rows: Row[] = []
  if (tab === "organizo") {
    const { data } = await supabase.from("matches").select(FIELDS).eq("organizer_id", user.id).order("starts_at", { ascending: false }).limit(60)
    for (const m of data ?? []) rows.push({ match: m, role: "organizo" })
  } else {
    const upcoming = tab === "proximas"
    const [{ data: joined }, { data: organized }] = await Promise.all([
      supabase
        .from("match_participants")
        .select(`status, match:matches!inner(${FIELDS})`)
        .eq("user_id", user.id)
        .in("status", upcoming ? ["confirmado", "espera"] : ["confirmado"])
        [upcoming ? "gte" : "lt"]("match.starts_at", now),
      supabase.from("matches").select(FIELDS).eq("organizer_id", user.id)[upcoming ? "gte" : "lt"]("starts_at", now),
    ])
    const byCode = new Map<string, Row>()
    for (const m of organized ?? []) byCode.set(m.code, { match: m, role: "organizo" })
    for (const p of joined ?? []) {
      if (!byCode.has(p.match.code))
        byCode.set(p.match.code, { match: p.match, role: upcoming ? (p.status as "confirmado" | "espera") : "jogou" })
    }
    rows.push(...byCode.values())
    rows.sort((a, b) => (upcoming ? 1 : -1) * a.match.starts_at.localeCompare(b.match.starts_at))
  }

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <h1 className="font-label text-3xl leading-none font-bold">Fala, {profile?.nickname ?? "craque"}</h1>
        <ButtonLink href="/pelada/nova" className="hidden sm:inline-flex">
          <Plus aria-hidden className="size-5" />
          Nova pelada
        </ButtonLink>
      </div>
      <ButtonLink href="/pelada/nova" className="mt-5 w-full sm:hidden">
        <Plus aria-hidden className="size-5" />
        Nova pelada
      </ButtonLink>
      {senha ? (
        <div className="mt-4">
          <FormAlert tone="ok">Senha trocada. Tá tudo certo.</FormAlert>
        </div>
      ) : null}

      <nav aria-label="Minhas peladas" className="mt-8 grid grid-cols-3 border border-ink">
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={t.id === "proximas" ? "/minhas-peladas" : `/minhas-peladas?aba=${t.id}`}
            aria-current={tab === t.id ? "page" : undefined}
            className={`flex min-h-12 items-center justify-center border-r border-ink font-label text-[0.95rem] font-bold no-underline last:border-r-0 ${
              tab === t.id ? "bg-ink text-paper" : "hover:bg-paper-deep"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      <section aria-label={TABS.find((t) => t.id === tab)?.label} className="mt-4">
        <p className="label-caps flex justify-between border-b-2 border-ink pb-1.5 text-muted">
          {rows.length === 1 ? "1 pelada" : `${rows.length} peladas`}
        </p>
        {rows.length ? (
          rows.map(({ match, role }) => <MatchRow key={match.code} match={match} tag={ROLE_TAG[role]} />)
        ) : (
          <div className="py-8">
            <p className="text-muted">{EMPTY[tab]}</p>
            {tab === "proximas" ? (
              <ButtonLink href="/explorar" variant="outline" className="mt-4">
                Ir pro Explorar
              </ButtonLink>
            ) : null}
          </div>
        )}
      </section>
    </>
  )
}
