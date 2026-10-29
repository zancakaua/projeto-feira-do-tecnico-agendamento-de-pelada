"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { authErrorMessage } from "@/lib/auth-errors"
import { safeReturnPath } from "@/lib/auth-paths"
import {
  newPasswordSchema,
  resetRequestSchema,
  signInSchema,
  signUpSchema,
  type NewPasswordInput,
  type ResetRequestInput,
  type SignInInput,
  type SignUpInput,
} from "@/lib/validations/auth"

export type ActionResult = { error?: string; ok?: string }

async function siteOrigin() {
  const h = await headers()
  return h.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
}

function callbackUrl(origin: string, next: string) {
  return `${origin}/auth/callback?next=${encodeURIComponent(next)}`
}

export async function signInAction(input: SignInInput, volta?: string): Promise<ActionResult> {
  const parsed = signInSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)
  if (error) return { error: authErrorMessage(error.code) }
  redirect(safeReturnPath(volta))
}

export async function signUpAction(input: SignUpInput): Promise<ActionResult> {
  const parsed = signUpSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
      emailRedirectTo: callbackUrl(await siteOrigin(), "/perfil/editar?novo=1"),
    },
  })
  if (error) return { error: authErrorMessage(error.code) }
  // Com confirmação de e-mail ligada, a sessão só vem depois do link
  if (data.session) redirect("/perfil/editar?novo=1")
  return { ok: `Mandamos um link pra ${parsed.data.email}. Abre ele pra ativar sua conta.` }
}

export async function googleAction(volta?: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: callbackUrl(await siteOrigin(), safeReturnPath(volta)) },
  })
  if (error || !data.url) redirect("/entrar?erro=google")
  redirect(data.url)
}

export async function requestResetAction(input: ResetRequestInput): Promise<ActionResult> {
  const parsed = resetRequestSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: callbackUrl(await siteOrigin(), "/nova-senha"),
  })
  if (error) return { error: authErrorMessage(error.code) }
  // Mesma resposta exista ou não a conta, pra não entregar quem tem cadastro
  return { ok: `Se tiver conta com ${parsed.data.email}, o link pra trocar a senha já está a caminho.` }
}

export async function newPasswordAction(input: NewPasswordInput): Promise<ActionResult> {
  const parsed = newPasswordSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password })
  if (error) return { error: authErrorMessage(error.code) }
  redirect("/minhas-peladas?senha=1")
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}
