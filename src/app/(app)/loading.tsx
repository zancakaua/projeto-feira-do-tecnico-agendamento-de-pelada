// Mostrado na hora em que se toca num link, enquanto o servidor monta a página:
// o cabeçalho continua no lugar e as linhas da súmula aparecem em branco.
export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="motion-safe:animate-pulse">
      <span className="sr-only">Carregando…</span>
      <div className="border-b-[3px] border-double border-ink pb-4">
        <div className="h-8 w-48 bg-paper-deep" />
        <div className="mt-3 h-4 w-64 max-w-full bg-paper-deep" />
      </div>
      <div className="mt-6 h-12 bg-paper-deep" />
      <ul className="mt-6 border-t-2 border-ink">
        {[0, 1, 2, 3, 4].map((i) => (
          <li key={i} className="flex items-center gap-3 border-b border-rule py-4">
            <div className="size-10 shrink-0 bg-paper-deep" />
            <div className="flex-1">
              <div className="h-4 w-2/3 bg-paper-deep" />
              <div className="mt-2 h-3 w-1/3 bg-paper-deep" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
