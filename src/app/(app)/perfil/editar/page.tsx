import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/profile/profile-form"
import { AvatarUpload } from "@/components/profile/avatar-upload"
import { formatPhone } from "@/lib/validations/profile"

export const metadata: Metadata = { title: "Editar perfil" }

export default async function EditProfilePage({ searchParams }: PageProps<"/perfil/editar">) {
  const { novo } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/entrar?volta=/perfil/editar")

  const [{ data: profile }, { data: priv }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("profile_private").select("phone").eq("user_id", user.id).maybeSingle(),
  ])
  if (!profile) redirect("/entrar")
  const isNew = novo === "1"

  return (
    <>
      <div className="mb-6 border-b-[3px] border-double border-ink pb-4">
        <h1 className="font-label text-3xl leading-none font-bold">{isNew ? "Sua ficha" : "Editar perfil"}</h1>
        {isNew ? (
          <p className="mt-2 text-muted">Confere seus dados. Posição e nível ajudam a sortear times equilibrados.</p>
        ) : null}
      </div>
      <div className="mb-8">
        <AvatarUpload userId={user.id} url={profile.avatar_url} name={profile.full_name} />
      </div>
      <ProfileForm
        novo={isNew}
        defaults={{
          fullName: profile.full_name,
          nickname: profile.nickname,
          city: profile.city,
          position: profile.position,
          level: profile.level,
          phone: priv?.phone ? formatPhone(priv.phone) : "",
        }}
      />
    </>
  )
}
