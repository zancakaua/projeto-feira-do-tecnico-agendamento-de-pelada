"use client"

import { Button } from "@/components/ui/button"

export default function AppError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="pt-6">
      <p className="stamp text-stamp">Falta</p>
      <h1 className="mt-6 font-label text-3xl leading-none font-bold">Deu ruim aqui do nosso lado.</h1>
      <p className="mt-3 max-w-[44ch] text-muted">
        Pode ser a conexão ou o servidor. Tenta de novo; se continuar, espera uns minutos.
      </p>
      <Button variant="ink" onClick={reset} className="mt-8">
        Tentar de novo
      </Button>
    </div>
  )
}
