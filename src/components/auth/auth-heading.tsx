import type { ReactNode } from "react"

// Cabeçalho de ficha: título grande + linha dupla de formulário
export function AuthHeading({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mb-6 border-b-[3px] border-double border-ink pb-4">
      <h1 className="font-label text-4xl leading-none font-bold tracking-tight">{title}</h1>
      {children ? <p className="mt-2 text-[0.95rem] text-muted">{children}</p> : null}
    </div>
  )
}

export function OrDivider() {
  return (
    <div className="my-6 flex items-center gap-3 text-muted" aria-hidden>
      <span className="h-px flex-1 bg-rule" />
      <span className="label-caps">ou</span>
      <span className="h-px flex-1 bg-rule" />
    </div>
  )
}
