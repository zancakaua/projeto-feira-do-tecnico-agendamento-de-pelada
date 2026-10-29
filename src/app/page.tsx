import { redirect } from "next/navigation"
import { Wordmark } from "@/components/shell/wordmark"
import { ButtonLink } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/supabase/server"

const STEPS = [
  ["Cria a pelada", "Data, quadra, vagas de linha e de goleiro, valor e chave Pix."],
  ["Manda o link no grupo", "Quem toca em “Tô dentro” entra na lista. Lotou, vai pra espera."],
  ["A lista se vira sozinha", "Alguém saiu? O primeiro da espera sobe e recebe aviso. Você só marca quem pagou."],
] as const

export default async function Home() {
  if (await getCurrentUser()) redirect("/minhas-peladas")

  return (
    <>
      <header className="bg-ink px-4 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Wordmark />
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-10 pb-16">
        <h1 className="max-w-[16ch] font-label text-5xl leading-[0.95] font-bold tracking-tight sm:text-6xl">
          A lista da pelada que se organiza sozinha.
        </h1>
        <p className="mt-4 max-w-[46ch] text-lg text-muted">
          Chega de editar lista no grupo do WhatsApp. Vagas, fila de espera, Pix e times num link só.
        </p>

        <ol className="mt-10 border-t-[3px] border-double border-ink">
          {STEPS.map(([title, body], i) => (
            <li key={title} className="grid grid-cols-[3rem_1fr] border-b border-rule py-4">
              <span className="typed text-2xl text-stamp">{i + 1}</span>
              <div>
                <h2 className="font-label text-xl font-bold">{title}</h2>
                <p className="mt-0.5 text-muted">{body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/cadastro">Criar conta</ButtonLink>
          <ButtonLink href="/entrar" variant="outline">
            Já tenho conta
          </ButtonLink>
        </div>
      </main>
    </>
  )
}
