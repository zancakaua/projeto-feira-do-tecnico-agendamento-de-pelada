import type { Tables } from "@/types/database"
import { LEVEL_LABEL, POSITION_LABEL } from "@/lib/labels"
import { MatchRow, type MatchRowData } from "@/components/match/match-row"
import { Avatar } from "./avatar"

type History = { played: MatchRowData[]; organized: MatchRowData[]; playedCount: number; organizedCount: number }

// Ficha do atleta: foto 3x4, identificação e números em células de formulário
export function PlayerSheet({
  profile,
  history,
}: {
  profile: Pick<Tables<"profiles">, "full_name" | "nickname" | "avatar_url" | "city" | "position" | "level">
  history: History
}) {
  const cells = [
    ["Cidade", profile.city],
    ["Posição", POSITION_LABEL[profile.position]],
    ["Nível", LEVEL_LABEL[profile.level]],
  ] as const

  return (
    <>
      <header className="flex items-end gap-4 border-b-[3px] border-double border-ink pb-4">
        <Avatar url={profile.avatar_url} name={profile.full_name} size="lg" />
        <div className="min-w-0 pb-1">
          <h1 className="font-label text-3xl leading-[1.05] font-bold break-words">{profile.full_name}</h1>
          <p className="typed mt-1 text-lg text-stamp">@{profile.nickname}</p>
        </div>
      </header>

      <dl className="mt-4 grid grid-cols-3 border border-ink">
        {cells.map(([label, value]) => (
          <div key={label} className="min-w-0 border-r border-ink px-2.5 py-2 last:border-r-0">
            <dt className="label-caps text-muted">{label}</dt>
            <dd className="typed truncate text-[1.05rem]">{value}</dd>
          </div>
        ))}
      </dl>
      <dl className="grid grid-cols-2 border-x border-b border-ink">
        <div className="border-r border-ink px-2.5 py-2">
          <dt className="label-caps text-muted">Jogou</dt>
          <dd className="typed text-4xl leading-none">{history.playedCount}</dd>
        </div>
        <div className="px-2.5 py-2">
          <dt className="label-caps text-muted">Organizou</dt>
          <dd className="typed text-4xl leading-none">{history.organizedCount}</dd>
        </div>
      </dl>

      <HistorySection title="Peladas jogadas" rows={history.played} tag="Jogou" empty="Nenhuma pelada jogada ainda." />
      {history.organized.length ? (
        <HistorySection title="Peladas organizadas" rows={history.organized} tag="Organizou" empty="" />
      ) : null}
    </>
  )
}

function HistorySection({ title, rows, tag, empty }: { title: string; rows: MatchRowData[]; tag: string; empty: string }) {
  return (
    <section className="mt-10">
      <h2 className="label-caps border-b-2 border-ink pb-1.5">{title}</h2>
      {rows.length ? (
        rows.map((m) => <MatchRow key={m.code} match={m} tag={{ label: tag, tone: "outline" }} />)
      ) : (
        <p className="py-5 text-muted">{empty}</p>
      )}
    </section>
  )
}
