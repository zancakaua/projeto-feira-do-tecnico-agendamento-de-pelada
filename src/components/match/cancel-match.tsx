"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { cancelMatchAction } from "@/app/(app)/pelada/actions"
import { Button } from "@/components/ui/button"
import { TextArea } from "@/components/ui/field"
import { FormAlert } from "@/components/ui/form-alert"

// Cancelar é irreversível: abre a confirmação no próprio lugar, com motivo opcional
export function CancelMatch({ code, listed }: { code: string; listed: number }) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [error, setError] = useState<string>()
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  if (!open)
    return (
      <Button variant="ghost" onClick={() => setOpen(true)} className="text-stamp">
        Cancelar pelada
      </Button>
    )

  return (
    <div className="w-full border-2 border-stamp p-4">
      <p className="font-label text-lg font-bold">Cancelar essa pelada?</p>
      <p className="mt-1 text-[0.95rem] text-muted">
        {listed
          ? `${listed} ${listed === 1 ? "pessoa recebe" : "pessoas recebem"} aviso no app. Não dá pra desfazer.`
          : "Ninguém na lista ainda. Não dá pra desfazer."}
      </p>
      <TextArea
        label="Motivo (opcional)"
        rows={2}
        maxLength={300}
        className="mt-3"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="A quadra fechou pra reforma."
      />
      {error ? (
        <div className="mt-3">
          <FormAlert>{error}</FormAlert>
        </div>
      ) : null}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button
          pending={pending}
          onClick={() =>
            startTransition(async () => {
              const result = await cancelMatchAction(code, reason)
              if (result.error) return setError(result.error)
              router.refresh()
            })
          }
        >
          Confirmar cancelamento
        </Button>
        <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
          Voltar
        </Button>
      </div>
    </div>
  )
}
