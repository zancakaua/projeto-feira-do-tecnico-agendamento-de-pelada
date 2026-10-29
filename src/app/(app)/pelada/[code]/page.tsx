import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Copy, Pencil } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getMatchView, matchPhase, type MatchView } from "@/lib/match-view"
import { matchWhen } from "@/lib/dates"
import { MatchHeader } from "@/components/match/match-header"
import { CancelMatch } from "@/components/match/cancel-match"
import { ButtonLink } from "@/components/ui/button"
import { FormAlert } from "@/components/ui/form-alert"

// Quem organiza não recebe aviso do próprio cancelamento (ver matches_after_update no banco)
function notifiedOnCancel(view: MatchView) {
  const total = view.counts.linha + view.counts.goleiro + view.counts.espera
  const organizerListed = view.viewer && (view.viewer.status === "confirmado" || view.viewer.status === "espera")
  return total - (organizerListed ? 1 : 0)
}

export async function generateMetadata({ params }: PageProps<"/pelada/[code]">): Promise<Metadata> {
  const { code } = await params
  const view = await getMatchView(await createClient(), code)
  if (!view) return { title: "Pelada não encontrada" }
  const when = matchWhen(view.match.starts_at, view.match.duration_minutes)
  return {
    title: view.match.title,
    description: `${when.dateLabel}, ${when.start} · ${view.match.venue_name}, ${view.match.neighborhood}`,
  }
}

export default async function MatchPage({ params, searchParams }: PageProps<"/pelada/[code]">) {
  const { code } = await params
  const { criada, salva } = await searchParams
  const view = await getMatchView(await createClient(), code)
  if (!view) notFound()
  const { match } = view
  const open = matchPhase(view) === "aberta"
  const created = Number(criada)

  return (
    <>
      {created ? (
        <div className="mb-5">
          <FormAlert tone="ok">
            {created > 1 ? `Criamos ${created} peladas, uma por semana. Essa é a primeira.` : "Pelada criada."} Agora é mandar
            o link no grupo.
          </FormAlert>
        </div>
      ) : null}
      {salva ? (
        <div className="mb-5">
          <FormAlert tone="ok">Alterações salvas.</FormAlert>
        </div>
      ) : null}

      <MatchHeader view={view} />

      {match.status === "cancelada" ? (
        <div className="mt-6">
          <FormAlert>
            Essa pelada foi cancelada{match.cancel_reason ? `: ${match.cancel_reason}` : "."}
          </FormAlert>
        </div>
      ) : null}

      {match.rules ? (
        <section className="mt-8">
          <h2 className="label-caps border-b-2 border-ink pb-1.5">Observações</h2>
          <p className="mt-3 max-w-[65ch] whitespace-pre-line">{match.rules}</p>
        </section>
      ) : null}

      {match.price_cents > 0 && match.pix_key ? (
        <section className="mt-8">
          <h2 className="label-caps border-b-2 border-ink pb-1.5">Pix de quem organiza</h2>
          <p className="typed mt-3 text-lg break-all">{match.pix_key}</p>
        </section>
      ) : null}

      {view.is_organizer ? (
        <section className="mt-10 border-t border-rule pt-6" aria-label="Ações de quem organiza">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {open ? (
              <ButtonLink href={`/pelada/${code}/editar`} variant="ink">
                <Pencil aria-hidden className="size-4" />
                Editar
              </ButtonLink>
            ) : null}
            <ButtonLink href={`/pelada/nova?de=${code}`} variant="outline">
              <Copy aria-hidden className="size-4" />
              Duplicar
            </ButtonLink>
            {match.status === "aberta" ? (
              <CancelMatch code={code} listed={notifiedOnCancel(view)} />
            ) : null}
          </div>
        </section>
      ) : null}
    </>
  )
}
