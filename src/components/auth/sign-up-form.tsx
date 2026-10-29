"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpAction } from "@/app/(auth)/actions"
import { signUpSchema, type SignUpInput } from "@/lib/validations/auth"
import { Field } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { FormAlert } from "@/components/ui/form-alert"

export function SignUpForm() {
  const [serverError, setServerError] = useState<string>()
  const [done, setDone] = useState<string>()
  const [pending, startTransition] = useTransition()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({ resolver: zodResolver(signUpSchema) })

  const onSubmit = handleSubmit((data) => {
    setServerError(undefined)
    startTransition(async () => {
      const result = await signUpAction(data)
      if (result?.error) setServerError(result.error)
      if (result?.ok) setDone(result.ok)
    })
  })

  if (done) return <FormAlert tone="ok">{done}</FormAlert>

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      {serverError ? <FormAlert>{serverError}</FormAlert> : null}
      <Field label="Nome" autoComplete="name" error={errors.fullName?.message} {...register("fullName")} />
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
        autoComplete="new-password"
        hint="Pelo menos 8 caracteres."
        error={errors.password?.message}
        {...register("password")}
      />
      <Button type="submit" pending={pending} className="mt-2 w-full">
        Criar conta
      </Button>
    </form>
  )
}
