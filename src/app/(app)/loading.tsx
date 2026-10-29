// Esqueleto de súmula enquanto a página carrega
export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite" className="animate-pulse motion-reduce:animate-none">
      <span className="sr-only">Carregando…</span>
      <div className="h-3 w-28 bg-rule" />
      <div className="mt-3 h-8 w-2/3 bg-rule" />
      <div className="mt-6 border border-rule">
        <div className="grid grid-cols-2 border-b border-rule">
          <div className="h-20 border-r border-rule" />
          <div className="h-20" />
        </div>
        <div className="h-20 border-b border-rule" />
        <div className="h-14" />
      </div>
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex items-center gap-3 border-b border-rule py-3">
          <div className="h-4 w-6 bg-rule" />
          <div className="h-4 flex-1 bg-rule" />
        </div>
      ))}
    </div>
  )
}
