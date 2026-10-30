import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Pencil } from "lucide-react"
import { createClient, getCurrentUser } from "@/lib/supabase/server"
import { signOutAction } from "@/app/(auth)/actions"
import { getPlayerHistory } from "@/lib/player-history"
import { PlayerSheet } from "@/components/profile/player-sheet"
import { Button, ButtonLink } from "@/components/ui/button"
import { FormAlert } from "@/components/ui/form-alert"

export const metadata: Metadata = { title: "Perfil" }

export default async function ProfilePage({ searchParams }: PageProps<"/perfil">) {
  const { salvo } = await searchParams
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) redirect("/entrar?volta=/perfil")
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, nickname, avatar_url, city, position, level")
    .eq("id", user.id)
    .single()
  if (!profile) redirect("/entrar")
  const history = await getPlayerHistory(supabase, user.id)

  return (
    <>
      {salvo ? (
        <div className="mb-5">
          <FormAlert tone="ok">Perfil salvo.</FormAlert>
        </div>
      ) : null}
      <PlayerSheet profile={profile} history={history} />
      <div className="mt-10 flex flex-col gap-3 border-t border-rule pt-6 sm:flex-row">
        <ButtonLink href="/perfil/editar" variant="ink">
          <Pencil aria-hidden className="size-4" />
          Editar perfil
        </ButtonLink>
        <ButtonLink href={`/jogador/${profile.nickname}`} variant="outline">
          Ver como os outros veem
        </ButtonLink>
        <form action={signOutAction} className="sm:ml-auto">
          <Button type="submit" variant="ghost" className="w-full">
            Sair da conta
          </Button>
        </form>
      </div>
    </>
  )
}
