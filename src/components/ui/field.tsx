import { CircleAlert } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"

type FieldProps = ComponentProps<"input"> & {
  label: string
  error?: string
  hint?: ReactNode
}

// Campo de súmula: rótulo pequeno em cima, valor "datilografado" embaixo, a célula é a borda.
export function Field({ label, error, hint, id, className, ...input }: FieldProps) {
  const fieldId = id ?? input.name
  const describedBy = error ? `${fieldId}-erro` : hint ? `${fieldId}-dica` : undefined
  return (
    <div className={className}>
      <label
        htmlFor={fieldId}
        className={`block border bg-paper px-3 pt-2 pb-1.5 focus-within:outline-2 focus-within:outline-offset-0 focus-within:outline-stamp ${
          error ? "border-stamp" : "border-ink"
        }`}
      >
        <span className="label-caps block text-muted">{label}</span>
        <input
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className="typed block w-full bg-transparent py-1 text-lg text-ink outline-none placeholder:font-normal placeholder:text-muted"
          {...input}
        />
      </label>
      {error ? (
        <p id={`${fieldId}-erro`} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-stamp">
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" strokeWidth={2.25} />
          {error}
        </p>
      ) : hint ? (
        <p id={`${fieldId}-dica`} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
