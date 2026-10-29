"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Shuffle } from "lucide-react"
import { saveTeamsAction } from "@/app/(app)/pelada/actions"
import { drawTeams, teamStrength } from "@/lib/draw"
import type { RosterEntry } from "@/lib/match-view"
import { Button } from "@/components/ui/button"

// Times sorteados (todos veem) + controle de sortear (só quem organiza)
export function Teams({ code, roster, canDraw }: { code: string; roster: RosterEntry[]; canDraw: boolean }) {
  const confirmed = roster.filter((p) => p.status === "confirmado")
  const drawn = confirmed.some((p) => p.team)
  const [n, setN] = useState(2)
  const [error, setError] = useState<string>()
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  if (!drawn && !canDraw) return null

  const teamNumbers = [...new Set(confirmed.map((p) => p.team).filter((t): t is number => !!t))].sort()

  const draw = () =>
    startTransition(async () => {
      const r = await saveTeamsAction(code, drawTeams(confirmed, n))
      if (r.error) setError(r.error)
      else {
        setError(undefined)
        router.refresh()
      }
    })

  return (
    <section className="mt-8">
      <h2 className="label-caps border-b-2 border-ink pb-1.5">Times</h2>
      {drawn ? (
        <div className={`mt-3 grid gap-px border border-ink bg-ink ${teamNumbers.length > 2 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2"}`}>
          {teamNumbers.map((t) => {
            const members = confirmed.filter((p) => p.team === t).sort((a, b) => (a.slot === "goleiro" ? -1 : b.slot === "goleiro" ? 1 : 0))
            return (
              <div key={t} className="bg-paper p-3">
                <p className="flex items-baseline justify-between">
                  <span className="font-label text-lg font-bold">Time {t}</span>
                  <span className="label-caps text-muted" title="Soma dos níveis">
                    força {teamStrength(members)}
                  </span>
                </p>
                <ol className="mt-1.5">
                  {members.map((p) => (
                    <li key={p.user_id} className={`typed truncate text-[0.95rem] ${p.is_me ? "text-stamp" : ""}`}>
                      {p.full_name}
                      {p.slot === "goleiro" ? <span className="label-caps ml-1.5 font-sans text-muted">gol</span> : null}
                    </li>
                  ))}
                </ol>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="mt-3 text-muted">Ninguém sorteado ainda. O sorteio equilibra pelo nível de cada um.</p>
      )}
      {canDraw ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <fieldset className="flex border border-ink">
            <legend className="sr-only">Quantos times</legend>
            {[2, 3, 4].map((v) => (
              <label key={v} className="flex min-h-12 min-w-12 cursor-pointer items-center justify-center border-r border-ink px-3 font-label font-bold last:border-r-0 has-checked:bg-ink has-checked:text-paper has-focus-visible:outline-2 has-focus-visible:outline-stamp">
                <input type="radio" name="times" value={v} checked={n === v} onChange={() => setN(v)} className="sr-only" />
                {v} times
              </label>
            ))}
          </fieldset>
          <Button variant="ink" onClick={draw} pending={pending} disabled={confirmed.length < 2}>
            <Shuffle aria-hidden className="size-5" />
            {drawn ? "Sortear de novo" : "Sortear times"}
          </Button>
          {error ? (
            <p role="alert" className="w-full text-sm text-stamp">
              {error}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
