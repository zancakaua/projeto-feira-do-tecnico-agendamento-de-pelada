"use client"

import Link from "next/link"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { joinMatchAction, leaveMatchAction } from "@/app/(app)/pelada/actions"
import { Button, buttonClass } from "@/components/ui/button"

type Viewer = { status: "confirmado" | "espera" | "saiu" | "removido"; slot: "linha" | "goleiro" } | null

// Barra fixa no polegar: o "Tô dentro" e a saída da lista
export function JoinBar({
  code,
  loggedIn,
  viewer,
  hasGoalkeeperSlots,
  full,
  waitPosition,
  deadline,
}: {
  code: string
  loggedIn: boolean
  viewer: Viewer
  hasGoalkeeperSlots: boolean
  full: boolean
  waitPosition: number | null
  deadline: { label: string; passed: boolean }
}) {
  const [confirmLeave, setConfirmLeave] = useState(false)
  const [error, setError] = useState<string>()
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const join = (slot: "linha" | "goleiro") =>
    startTransition(async () => {
      const r = await joinMatchAction(code, slot)
      if (r?.error) setError(r.error)
    })
  const leave = () =>
    startTransition(async () => {
      const r = await leaveMatchAction(code)
      if (r.error) setError(r.error)
      else {
        setConfirmLeave(false)
        router.refresh()
      }
    })

  const listed = viewer && (viewer.status === "confirmado" || viewer.status === "espera")

  let content: React.ReactNode
  if (!loggedIn) {
    content = (
      <Link href={`/entrar?volta=${encodeURIComponent(`/pelada/${code}`)}`} className={buttonClass("primary", "flex-1")}>
        {full ? "Entrar na espera" : "Tô dentro"}
      </Link>
    )
  } else if (viewer?.status === "removido") {
    content = <p className="py-2 text-paper">Quem organiza tirou você dessa lista.</p>
  } else if (listed && confirmLeave) {
    content = (
      <>
        <Button onClick={leave} pending={pending} className="flex-1">
          {viewer.status === "espera" ? "Sair da espera" : "Confirmar saída"}
        </Button>
        <button type="button" onClick={() => setConfirmLeave(false)} className={buttonClass("outline", "border-paper bg-transparent text-paper hover:bg-ink-soft")}>
          Fico
        </button>
      </>
    )
  } else if (listed) {
    const blocked = viewer.status === "confirmado" && deadline.passed
    content = (
      <div className="flex flex-1 items-center justify-between gap-3">
        <p className="leading-tight text-paper">
          <span className="block font-label text-lg font-bold">
            {viewer.status === "confirmado" ? (viewer.slot === "goleiro" ? "Você tá no gol" : "Você tá dentro") : `Você é o ${waitPosition}º da espera`}
          </span>
          <span className="text-sm text-on-ink-muted">
            {blocked
              ? `Prazo pra sair acabou (${deadline.label}). Fala com quem organiza.`
              : viewer.status === "confirmado"
                ? `Pode sair até ${deadline.label}.`
                : "Abriu vaga, você sobe sozinho e recebe aviso."}
          </span>
        </p>
        {!blocked ? (
          <button
            type="button"
            onClick={() => setConfirmLeave(true)}
            className="min-h-12 shrink-0 border border-paper px-3 font-label font-bold tracking-[0.06em] text-paper uppercase hover:bg-ink-soft"
          >
            Saí da lista
          </button>
        ) : null}
      </div>
    )
  } else {
    content = (
      <>
        <Button onClick={() => join("linha")} pending={pending} className="flex-1">
          {full ? "Entrar na espera" : "Tô dentro"}
        </Button>
        {hasGoalkeeperSlots ? (
          <button
            type="button"
            onClick={() => join("goleiro")}
            disabled={pending}
            className="min-h-13 shrink-0 border border-paper px-4 font-label text-lg font-bold tracking-[0.06em] text-paper uppercase hover:bg-ink-soft"
          >
            Sou goleiro
          </button>
        ) : null}
      </>
    )
  }

  return (
    <div className={`fixed inset-x-0 z-20 border-t-2 border-stamp bg-ink px-4 py-3 md:bottom-0 ${loggedIn ? "bottom-[calc(4rem+env(safe-area-inset-bottom))]" : "bottom-0 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"}`}>
      <div className="mx-auto flex max-w-3xl items-center gap-2">{content}</div>
      {error ? (
        <p role="alert" className="mx-auto mt-2 max-w-3xl text-sm font-semibold text-[#ff8a83]">
          {error}
        </p>
      ) : null}
    </div>
  )
}
