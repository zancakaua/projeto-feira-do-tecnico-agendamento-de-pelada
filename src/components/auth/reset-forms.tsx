"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { newPasswordAction, requestResetAction } from "@/app/(auth)/actions"
import {
  newPasswordSchema,
  resetRequestSchema,
  type NewPasswordInput,
  type ResetRequestInput,
} from "@/lib/validations/auth"
import { Field } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { FormAlert } from "@/components/ui/form-alert"

export function ResetRequestForm() {
  const [serverError, setServerError] = useState<string>()
  const [done, setDone] = useState<string>()
  const [pending, startTransition] = useTransition()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetRequestInput>({ resolver: zodResolver(resetRequestSchema) })

  const onSubmit = handleSubmit((data) => {
    setServerError(undefined)
    startTransition(async () => {
      const result = await requestResetAction(data)
      if (result?.error) setServerError(result.error)
      if (result?.ok) setDone(result.ok)
    })
  })

  if (done) return <FormAlert tone="ok">{done}</FormAlert>

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      {serverError ? <FormAlert>{serverError}</FormAlert> : null}
      <Field
        label="E-mail da conta"
        type="email"
        autoComplete="email"
        inputMode="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Button type="submit" pending={pending} className="mt-2 w-full">
        Mandar link
      </Button>
    </form>
  )
}

export function NewPasswordForm() {
  const [serverError, setServerError] = useState<string>()
  const [pending, startTransition] = useTransition()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordInput>({ resolver: zodResolver(newPasswordSchema) })

  const onSubmit = handleSubmit((data) => {
    setServerError(undefined)
    startTransition(async () => {
      const result = await newPasswordAction(data)
      if (result?.error) setServerError(result.error)
    })
  })

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      {serverError ? <FormAlert>{serverError}</FormAlert> : null}
      <Field
        label="Senha nova"
        type="password"
        autoComplete="new-password"
        hint="Pelo menos 8 caracteres."
        error={errors.password?.message}
        {...register("password")}
      />
      <Field
        label="Repete a senha"
        type="password"
        autoComplete="new-password"
        error={errors.confirm?.message}
        {...register("confirm")}
      />
      <Button type="submit" pending={pending} className="mt-2 w-full">
        Salvar senha
      </Button>
    </form>
  )
}
