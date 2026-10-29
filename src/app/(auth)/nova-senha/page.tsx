import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { AuthHeading } from "@/components/auth/auth-heading"
import { NewPasswordForm } from "@/components/auth/reset-forms"
import { getCurrentUser } from "@/lib/supabase/server"

export const metadata: Metadata = { title: "Senha nova" }

// Só chega aqui com a sessão aberta pelo link de recuperação
export default async function NewPasswordPage() {
  if (!(await getCurrentUser())) redirect("/entrar?erro=link")
  return (
    <>
      <AuthHeading title="Senha nova">Escolhe a senha nova e pronto.</AuthHeading>
      <NewPasswordForm />
    </>
  )
}
