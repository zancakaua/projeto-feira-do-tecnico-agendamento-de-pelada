import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { AuthHeading } from "@/components/auth/auth-heading"
import { SignUpForm } from "@/components/auth/sign-up-form"
import { getCurrentUser } from "@/lib/supabase/server"

export const metadata: Metadata = { title: "Criar conta" }

export default async function SignUpPage({ searchParams }: PageProps<"/cadastro">) {
  const { volta } = await searchParams
  const returnTo = typeof volta === "string" ? volta : undefined
  if (await getCurrentUser()) redirect("/minhas-peladas")

  return (
    <>
      <AuthHeading title="Criar conta">Um cadastro e você entra em qualquer lista com um toque.</AuthHeading>
      <SignUpForm />
      <p className="mt-8 text-[0.95rem]">
        Já tem conta?{" "}
        <Link href={returnTo ? `/entrar?volta=${encodeURIComponent(returnTo)}` : "/entrar"} className="font-semibold text-stamp underline">
          Entrar
        </Link>
      </p>
    </>
  )
}
