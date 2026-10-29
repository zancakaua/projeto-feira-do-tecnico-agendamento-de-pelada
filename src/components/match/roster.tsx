import Link from "next/link"
import { Phone } from "lucide-react"
import { LEVEL_LABEL, POSITION_LABEL } from "@/lib/labels"
import { rosterLines, whatsappLink } from "@/lib/roster"
import type { RosterEntry } from "@/lib/match-view"
import { RowActions } from "./row-actions"

type Ctx = { code: string; isOrganizer: boolean; justJoined: boolean; editable: boolean }

function PersonLine({ n, p, ctx }: { n: string; p: RosterEntry; ctx: Ctx }) {
  return (
    <li
      className={`grid grid-cols-[2.25rem_1fr_auto] items-center gap-x-1 border-b border-rule py-1.5 ${p.is_me ? "bg-paper-deep" : ""}`}
    >
      <span className="label-caps text-center text-muted">{n}</span>
      <div className="min-w-0">
        <p className={`typed truncate text-[1.05rem] ${p.is_me ? "text-stamp" : ""} ${p.is_me && ctx.justJoined ? "type-in" : ""}`}>
          <Link href={`/jogador/${p.nickname}`} className="no-underline hover:underline">
            {p.full_name}
          </Link>
          {p.is_me ? <span className="ml-1.5 font-sans text-xs font-semibold tracking-normal">(você)</span> : null}
        </p>
        <p className="truncate text-xs text-muted">
          {POSITION_LABEL[p.position]} · {LEVEL_LABEL[p.level]}
          {ctx.isOrganizer && p.phone ? (
            <>
              {" · "}
              <a href={whatsappLink(p.phone)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-ink underline">
                <Phone aria-hidden className="size-3" />
                zap
              </a>
            </>
          ) : null}
        </p>
      </div>
      {ctx.isOrganizer && ctx.editable ? (
        <RowActions code={ctx.code} userId={p.user_id} name={p.full_name} paid={!!p.paid} confirmed={p.status === "confirmado"} />
      ) : p.paid ? (
        <span className="border border-ink px-1.5 font-label text-xs font-bold tracking-[0.1em] uppercase">Pago</span>
      ) : (
        <span />
      )}
    </li>
  )
}

function BlankLine({ n }: { n: string }) {
  return (
    <li className="grid grid-cols-[2.25rem_1fr] items-center border-b border-rule py-1.5" aria-label="Vaga aberta">
      <span className="label-caps text-center text-muted">{n}</span>
      <span aria-hidden className="mr-8 h-5 border-b border-dashed border-rule" />
    </li>
  )
}

function Section({ title, count, children }: { title: string; count: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="label-caps flex items-baseline justify-between border-b-2 border-ink pb-1.5">
        {title}
        <span className="typed text-base tracking-normal">{count}</span>
      </h2>
      <ol>{children}</ol>
    </section>
  )
}

const pad = (n: number) => String(n).padStart(2, "0")

// Relação de atletas: linha, goleiros e reservas (lista de espera), no formato da súmula
export function Roster({
  roster,
  fieldSlots,
  goalkeeperSlots,
  ctx,
}: {
  roster: RosterEntry[]
  fieldSlots: number
  goalkeeperSlots: number
  ctx: Ctx
}) {
  const line = roster.filter((p) => p.status === "confirmado" && p.slot === "linha")
  const keepers = roster.filter((p) => p.status === "confirmado" && p.slot === "goleiro")
  const waiting = roster.filter((p) => p.status === "espera")

  return (
    <>
      <Section title="Relação de atletas · linha" count={`${line.length}/${fieldSlots}`}>
        {rosterLines(line, fieldSlots).map(({ n, person }) =>
          person ? <PersonLine key={person.user_id} n={pad(n)} p={person} ctx={ctx} /> : <BlankLine key={`b${n}`} n={pad(n)} />,
        )}
      </Section>

      {goalkeeperSlots > 0 ? (
        <Section title="Goleiros" count={`${keepers.length}/${goalkeeperSlots}`}>
          {rosterLines(keepers, goalkeeperSlots).map(({ n, person }) =>
            person ? <PersonLine key={person.user_id} n={`G${n}`} p={person} ctx={ctx} /> : <BlankLine key={`g${n}`} n={`G${n}`} />,
          )}
        </Section>
      ) : null}

      {waiting.length ? (
        <Section title="Reservas · lista de espera" count={String(waiting.length)}>
          {waiting.map((p, i) => (
            <PersonLine key={p.user_id} n={`${i + 1}º`} p={p} ctx={ctx} />
          ))}
        </Section>
      ) : null}
    </>
  )
}
