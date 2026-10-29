import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { signOutAction } from "@/app/(auth)/actions"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = { title: "Perfil" }

const POSITION: Record<string, string> = {
  goleiro: "Goleiro",
  zagueiro: "Zagueiro",
  meio: "Meio",
  atacante: "Atacante",
  tanto_faz: "Tanto faz",
}
const LEVEL: Record<string, string> = { iniciante: "Iniciante", intermediario: "Intermediário", avancado: "Avançado" }

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/entrar?volta=/perfil")
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  if (!profile) redirect("/entrar")

  const rows = [
    ["Nome", profile.full_name],
    ["Apelido", `@${profile.nickname}`],
    ["Cidade", profile.city],
    ["Posição", POSITION[profile.position]],
    ["Nível", LEVEL[profile.level]],
  ]

  return (
    <>
      <h1 className="font-label text-3xl leading-none font-bold">Perfil</h1>
      <dl className="mt-6 border border-ink">
        {rows.map(([label, value]) => (
          <div key={label} className="border-b border-ink px-3 py-2 last:border-b-0">
            <dt className="label-caps text-muted">{label}</dt>
            <dd className="typed text-lg">{value}</dd>
          </div>
        ))}
      </dl>
      <form action={signOutAction} className="mt-8">
        <Button type="submit" variant="outline" className="w-full sm:w-auto">
          Sair da conta
        </Button>
      </form>
    </>
  )
}
