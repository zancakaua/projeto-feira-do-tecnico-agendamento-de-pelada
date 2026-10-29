import type { Metadata } from "next"
import Link from "next/link"
import { AuthHeading } from "@/components/auth/auth-heading"
import { ResetRequestForm } from "@/components/auth/reset-forms"

export const metadata: Metadata = { title: "Recuperar senha" }

export default function ResetPage() {
  return (
    <>
      <AuthHeading title="Esqueci a senha">Manda seu e-mail que a gente envia um link pra criar uma senha nova.</AuthHeading>
      <ResetRequestForm />
      <p className="mt-8 text-[0.95rem]">
        Lembrou?{" "}
        <Link href="/entrar" className="font-semibold text-stamp underline">
          Voltar pra entrar
        </Link>
      </p>
    </>
  )
}
