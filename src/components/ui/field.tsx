import { CircleAlert } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"

type Common = { label: string; error?: string; hint?: ReactNode }

function cellClass(error?: string) {
  return `block border bg-paper px-3 pt-2 pb-1.5 focus-within:outline-2 focus-within:outline-offset-0 focus-within:outline-stamp ${
    error ? "border-stamp" : "border-ink"
  }`
}

const valueClass =
  "typed block w-full bg-transparent py-1 text-lg text-ink outline-none placeholder:font-normal placeholder:text-muted"

function Help({ id, error, hint }: { id: string; error?: string; hint?: ReactNode }) {
  if (error)
    return (
      <p id={`${id}-erro`} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-stamp">
        <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" strokeWidth={2.25} />
        {error}
      </p>
    )
  if (hint)
    return (
      <p id={`${id}-dica`} className="mt-1.5 text-sm text-muted">
        {hint}
      </p>
    )
  return null
}

const describedBy = (id: string, error?: string, hint?: ReactNode) =>
  error ? `${id}-erro` : hint ? `${id}-dica` : undefined

// Campo de súmula: rótulo pequeno em cima, valor "datilografado" embaixo, a célula é a borda.
export function Field({
  label,
  error,
  hint,
  suffix,
  id,
  className,
  ...input
}: ComponentProps<"input"> & Common & { suffix?: string }) {
  const fieldId = id ?? input.name ?? label
  return (
    <div className={className}>
      <label htmlFor={fieldId} className={cellClass(error)}>
        <span className="label-caps block text-muted">{label}</span>
        <span className="flex items-baseline gap-2">
          <input
            id={fieldId}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy(fieldId, error, hint)}
            className={valueClass}
            {...input}
          />
          {suffix ? <span className="label-caps shrink-0 text-muted">{suffix}</span> : null}
        </span>
      </label>
      <Help id={fieldId} error={error} hint={hint} />
    </div>
  )
}

export function TextArea({ label, error, hint, id, className, ...input }: ComponentProps<"textarea"> & Common) {
  const fieldId = id ?? input.name ?? label
  return (
    <div className={className}>
      <label htmlFor={fieldId} className={cellClass(error)}>
        <span className="label-caps block text-muted">{label}</span>
        <textarea
          id={fieldId}
          rows={4}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(fieldId, error, hint)}
          className={`${valueClass} resize-y font-normal`}
          {...input}
        />
      </label>
      <Help id={fieldId} error={error} hint={hint} />
    </div>
  )
}

// Caixinha de formulário marcada com "×"
export function CheckField({ label, hint, ...input }: ComponentProps<"input"> & { label: string; hint?: string }) {
  return (
    <label className="flex min-h-12 cursor-pointer items-start gap-3 py-2 has-focus-visible:outline-2 has-focus-visible:outline-stamp">
      <input type="checkbox" className="peer sr-only" {...input} />
      <span
        aria-hidden
        className="mt-0.5 grid size-5 shrink-0 place-items-center border border-ink font-typed text-base leading-none font-bold text-transparent peer-checked:text-stamp"
      >
        ×
      </span>
      <span>
        <span className="block font-label text-[1.05rem] font-bold">{label}</span>
        {hint ? <span className="block text-sm text-muted">{hint}</span> : null}
      </span>
    </label>
  )
}
