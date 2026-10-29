import { Wordmark } from "@/components/shell/wordmark"
import { ButtonLink } from "@/components/ui/button"

export default function NotFound() {
  return (
    <>
      <header className="bg-ink px-4 py-4">
        <div className="mx-auto max-w-3xl">
          <Wordmark />
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-12 pb-16">
        <p className="stamp text-stamp">Não consta</p>
        <h1 className="mt-6 font-label text-4xl leading-none font-bold">Essa página não está na súmula.</h1>
        <p className="mt-3 max-w-[44ch] text-muted">
          O link pode estar errado ou a pelada foi apagada. Confere com quem te mandou.
        </p>
        <ButtonLink href="/" variant="ink" className="mt-8">
          Voltar pro início
        </ButtonLink>
      </main>
    </>
  )
}
