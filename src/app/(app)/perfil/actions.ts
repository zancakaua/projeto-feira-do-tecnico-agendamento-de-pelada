"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { profileSchema, type ProfileInput } from "@/lib/validations/profile"

export type ProfileResult = { error?: string; nicknameTaken?: boolean }

export async function updateProfileAction(input: ProfileInput, novo?: boolean): Promise<ProfileResult> {
  const parsed = profileSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/entrar?volta=/perfil/editar")

  const { fullName, nickname, city, position, level, phone } = parsed.data
  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, nickname, city, position, level })
    .eq("id", user.id)
  if (error) {
    if (error.code === "23505") return { nicknameTaken: true }
    return { error: "Não deu pra salvar agora. Tenta de novo em instantes." }
  }

  const { error: phoneError } = await supabase.from("profile_private").update({ phone }).eq("user_id", user.id)
  if (phoneError) return { error: "Salvamos o perfil, mas o telefone não foi. Tenta de novo." }

  revalidatePath("/", "layout")
  redirect(novo ? "/minhas-peladas" : "/perfil?salvo=1")
}

// A foto sobe direto do navegador para o Storage (pasta do próprio usuário, garantida pela política);
// aqui só gravamos a URL pública, conferindo que o arquivo é dele.
export async function setAvatarAction(path: string): Promise<ProfileResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Entra de novo na sua conta." }
  if (!path.startsWith(`${user.id}/`)) return { error: "Foto inválida." }

  const { data } = supabase.storage.from("avatars").getPublicUrl(path)
  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: `${data.publicUrl}?v=${Date.now()}` })
    .eq("id", user.id)
  if (error) return { error: "Não deu pra salvar a foto. Tenta de novo." }

  revalidatePath("/", "layout")
  return {}
}
