"use client"

import Link from "next/link"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signInAction } from "@/app/(auth)/actions"
import { signInSchema, type SignInInput } from "@/lib/validations/auth"
import { Field } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { FormAlert } from "@/components/ui/form-alert"

export function SignInForm({ volta }: { volta?: string }) {
  const [serverError, setServerError] = useState<string>()
  const [pending, startTransition] = useTransition()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({ resolver: zodResolver(signInSchema) })

  const onSubmit = handleSubmit((data) => {
    setServerError(undefined)
    startTransition(async () => {
      const result = await signInAction(data, volta)
      if (result?.error) setServerError(result.error)
    })
  })

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      {serverError ? <FormAlert>{serverError}</FormAlert> : null}
      <Field
        label="E-mail"
        type="email"
        autoComplete="email"
        inputMode="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Field
        label="Senha"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <Link href="/recuperar-senha" className="-my-2 self-start py-2.5 text-sm text-ink underline hover:text-stamp">
        Esqueci a senha
      </Link>
      <Button type="submit" pending={pending} className="mt-2 w-full">
        Entrar
      </Button>
    </form>
  )
}
