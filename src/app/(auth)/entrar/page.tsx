import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { AuthHeading, OrDivider } from "@/components/auth/auth-heading"
import { GoogleButton } from "@/components/auth/google-button"
import { SignInForm } from "@/components/auth/sign-in-form"
import { FormAlert } from "@/components/ui/form-alert"
import { getCurrentUser } from "@/lib/supabase/server"
import { safeReturnPath } from "@/lib/auth-paths"

export const metadata: Metadata = { title: "Entrar" }

const LINK_ERRORS: Record<string, string> = {
  link: "Esse link expirou ou já foi usado. Pede outro ou entra com a senha.",
  google: "Não deu pra entrar com o Google agora. Tenta de novo ou usa e-mail e senha.",
}

export default async function SignInPage({ searchParams }: PageProps<"/entrar">) {
  const { volta, erro } = await searchParams
  const returnTo = typeof volta === "string" ? volta : undefined
  if (await getCurrentUser()) redirect(safeReturnPath(returnTo))

  const linkError = typeof erro === "string" ? LINK_ERRORS[erro] : undefined
  const signUpHref = returnTo ? `/cadastro?volta=${encodeURIComponent(returnTo)}` : "/cadastro"

  return (
    <>
      <AuthHeading title="Entrar">
        {returnTo?.startsWith("/pelada/") ? "Entra pra confirmar presença na lista." : "Bora organizar o racha."}
      </AuthHeading>
      {linkError ? (
        <div className="mb-4">
          <FormAlert>{linkError}</FormAlert>
        </div>
      ) : null}
      <SignInForm volta={returnTo} />
      <OrDivider />
      <GoogleButton volta={returnTo} />
      <p className="mt-8 text-[0.95rem]">
        Primeira vez aqui?{" "}
        <Link href={signUpHref} className="font-semibold text-stamp underline">
          Criar conta
        </Link>
      </p>
    </>
  )
}
