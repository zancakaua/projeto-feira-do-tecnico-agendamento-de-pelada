"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { LoaderCircle, X } from "lucide-react"
import { removePlayerAction, setPaidAction } from "@/app/(app)/pelada/actions"

// Controles do organizador numa linha da lista: marcar Pix e tirar da lista
export function RowActions({
  code,
  userId,
  name,
  paid,
  confirmed,
}: {
  code: string
  userId: string
  name: string
  paid: boolean
  confirmed: boolean
}) {
  const [confirmRemove, setConfirmRemove] = useState(false)
  const [error, setError] = useState<string>()
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const run = (fn: () => Promise<{ error?: string }>) =>
    startTransition(async () => {
      const r = await fn()
      if (r.error) setError(r.error)
      else {
        setError(undefined)
        setConfirmRemove(false)
        router.refresh()
      }
    })

  if (confirmRemove)
    return (
      <div className="col-span-full mt-2 flex flex-wrap items-center gap-2 border border-stamp p-2 text-sm">
        <span className="mr-auto">Tirar {name} da lista? A vaga passa pro próximo da espera.</span>
        <button
          type="button"
          onClick={() => run(() => removePlayerAction(code, userId))}
          disabled={pending}
          className="min-h-10 bg-stamp px-3 font-label font-bold text-white uppercase"
        >
          {pending ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : "Tirar"}
        </button>
        <button type="button" onClick={() => setConfirmRemove(false)} className="min-h-10 border border-ink px-3 font-label font-bold uppercase">
          Voltar
        </button>
      </div>
    )

  return (
    <div className="flex items-center gap-1">
      {confirmed ? (
        <button
          type="button"
          aria-pressed={paid}
          aria-label={paid ? `${name} pagou. Desmarcar` : `Marcar que ${name} pagou`}
          onClick={() => run(() => setPaidAction(code, userId, !paid))}
          disabled={pending}
          className={`min-h-10 border px-2 font-label text-xs font-bold tracking-[0.1em] uppercase ${
            paid ? "border-ink bg-ink text-paper" : "border-dashed border-ink text-muted hover:text-ink"
          }`}
        >
          {pending ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : paid ? "Pago" : "Pix?"}
        </button>
      ) : null}
      <button
        type="button"
        aria-label={`Tirar ${name} da lista`}
        onClick={() => setConfirmRemove(true)}
        className="grid size-10 place-items-center text-muted hover:text-stamp"
      >
        <X aria-hidden className="size-5" />
      </button>
      {error ? (
        <p role="alert" className="col-span-full text-sm text-stamp">
          {error}
        </p>
      ) : null}
    </div>
  )
}
