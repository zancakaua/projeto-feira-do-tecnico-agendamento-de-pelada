import { CircleAlert } from "lucide-react"
import type { UseFormRegisterReturn } from "react-hook-form"

type Option = { value: string; label: string }

// Quadrinhos de formulário: a opção marcada leva um "X" de caneta
export function ChoiceGroup({
  legend,
  options,
  registration,
  error,
  columns = 3,
}: {
  legend: string
  options: Option[]
  registration: UseFormRegisterReturn
  error?: string
  columns?: 2 | 3 | 5
}) {
  const cols = { 2: "grid-cols-2", 3: "grid-cols-3", 5: "grid-cols-2 sm:grid-cols-5" }[columns]
  return (
    <fieldset aria-invalid={error ? true : undefined}>
      <legend className="label-caps mb-1.5 text-muted">{legend}</legend>
      <div className={`grid ${cols} gap-px border border-ink bg-ink`}>
        {options.map((o) => (
          <label
            key={o.value}
            className="group relative flex min-h-12 cursor-pointer items-center gap-2.5 bg-paper px-3 py-2 has-checked:bg-ink has-checked:text-paper has-focus-visible:outline-2 has-focus-visible:-outline-offset-4 has-focus-visible:outline-stamp"
          >
            <input type="radio" value={o.value} className="peer sr-only" {...registration} />
            <span
              aria-hidden
              className="grid size-4 shrink-0 place-items-center border border-current font-typed text-[0.8rem] leading-none font-bold text-transparent peer-checked:text-stamp"
            >
              ×
            </span>
            <span className="font-label text-[0.95rem] leading-tight font-bold">{o.label}</span>
          </label>
        ))}
      </div>
      {error ? (
        <p className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-stamp">
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" strokeWidth={2.25} />
          {error}
        </p>
      ) : null}
    </fieldset>
  )
}
