"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateProfileAction } from "@/app/(app)/perfil/actions"
import {
  LEVELS,
  POSITIONS,
  profileSchema,
  type ProfileData,
  type ProfileInput,
} from "@/lib/validations/profile"
import { LEVEL_LABEL, POSITION_LABEL } from "@/lib/labels"
import { Field } from "@/components/ui/field"
import { ChoiceGroup } from "@/components/ui/choice-group"
import { Button } from "@/components/ui/button"
import { FormAlert } from "@/components/ui/form-alert"

export function ProfileForm({ defaults, novo }: { defaults: ProfileInput; novo?: boolean }) {
  const [serverError, setServerError] = useState<string>()
  const [pending, startTransition] = useTransition()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ProfileInput, unknown, ProfileData>({ resolver: zodResolver(profileSchema), defaultValues: defaults })

  const onSubmit = handleSubmit((data) => {
    setServerError(undefined)
    startTransition(async () => {
      // A action valida de novo; o telefone volta como texto pra passar no mesmo schema
      const result = await updateProfileAction({ ...data, phone: data.phone ?? "" }, novo)
      if (result?.nicknameTaken) setError("nickname", { message: "Esse apelido já tem dono. Tenta outro." })
      else if (result?.error) setServerError(result.error)
    })
  })

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      {serverError ? <FormAlert>{serverError}</FormAlert> : null}
      <Field label="Nome" autoComplete="name" error={errors.fullName?.message} {...register("fullName")} />
      <Field
        label="Apelido"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        hint="É assim que você aparece na lista. Letras sem acento, números ou _."
        error={errors.nickname?.message}
        {...register("nickname")}
      />
      <Field label="Cidade" autoComplete="address-level2" error={errors.city?.message} {...register("city")} />
      <ChoiceGroup
        legend="Posição"
        columns={5}
        options={POSITIONS.map((v) => ({ value: v, label: POSITION_LABEL[v] }))}
        registration={register("position")}
        error={errors.position?.message}
      />
      <ChoiceGroup
        legend="Nível"
        options={LEVELS.map((v) => ({ value: v, label: LEVEL_LABEL[v] }))}
        registration={register("level")}
        error={errors.level?.message}
      />
      <Field
        label="Telefone (opcional)"
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder="(32) 98888-7777"
        hint="Só aparece pra quem organiza as peladas em que você entrar."
        error={errors.phone?.message}
        {...register("phone")}
      />
      <Button type="submit" pending={pending} className="mt-2 w-full sm:w-auto sm:self-start">
        {novo ? "Salvar e continuar" : "Salvar perfil"}
      </Button>
    </form>
  )
}
