// Opção de filtro com caixinha de formulário marcada com "×" (input nativo, funciona sem JS)
export function FilterOption({
  type,
  name,
  value,
  label,
  defaultChecked,
}: {
  type: "radio" | "checkbox"
  name: string
  value: string
  label: string
  defaultChecked?: boolean
}) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-2.5 bg-paper px-3 py-2 has-checked:bg-ink has-checked:text-paper has-focus-visible:outline-2 has-focus-visible:-outline-offset-4 has-focus-visible:outline-stamp">
      <input type={type} name={name} value={value} defaultChecked={defaultChecked} className="peer sr-only" />
      <span
        aria-hidden
        className="grid size-4 shrink-0 place-items-center border border-current font-typed text-[0.8rem] leading-none font-bold text-transparent peer-checked:text-stamp"
      >
        ×
      </span>
      <span className="font-label text-[0.95rem] leading-tight font-bold">{label}</span>
    </label>
  )
}

export function FilterGroup({ legend, children, cols = "grid-cols-2" }: { legend: string; children: React.ReactNode; cols?: string }) {
  return (
    <fieldset>
      <legend className="label-caps mb-1.5 text-muted">{legend}</legend>
      <div className={`grid ${cols} gap-px border border-ink bg-ink`}>{children}</div>
    </fieldset>
  )
}
