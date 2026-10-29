"use client"

import { useState, useTransition, type ReactNode } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { MapPin } from "lucide-react"
import { createMatchAction, updateMatchAction } from "@/app/(app)/pelada/actions"
import { COURT_TYPES, matchSchema, type MatchData, type MatchFormInput } from "@/lib/validations/match"
import { LEVELS } from "@/lib/validations/profile"
import { COURT_LABEL, LEVEL_LABEL } from "@/lib/labels"
import { CheckField, Field, TextArea } from "@/components/ui/field"
import { ChoiceGroup } from "@/components/ui/choice-group"
import { Button } from "@/components/ui/button"
import { FormAlert } from "@/components/ui/form-alert"

export type SavedVenue = { id: string; name: string; address: string; neighborhood: string; city: string }

type Props = { defaults: MatchFormInput; venues: SavedVenue[] } & (
  | { mode: "create" }
  | { mode: "edit"; code: string }
)

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="label-caps border-b-2 border-ink pb-1.5 text-ink">{title}</h2>
      {children}
    </section>
  )
}

export function MatchForm(props: Props) {
  const { defaults, venues, mode } = props
  const [serverError, setServerError] = useState<string>()
  const [pending, startTransition] = useTransition()
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    getValues,
    formState: { errors },
  } = useForm<MatchFormInput, unknown, MatchData>({ resolver: zodResolver(matchSchema()), defaultValues: defaults })

  // A action valida de novo com o mesmo schema, então mandamos os valores crus do formulário
  const onSubmit = handleSubmit(() => {
    const input = getValues()
    setServerError(undefined)
    startTransition(async () => {
      const result = props.mode === "create" ? await createMatchAction(input) : await updateMatchAction(props.code, input)
      if (!result?.error) return
      if (result.field && result.field in defaults) setError(result.field as keyof MatchFormInput, { message: result.error })
      else setServerError(result.error)
    })
  })

  function applyVenue(v: SavedVenue) {
    setValue("venueName", v.name, { shouldValidate: true })
    setValue("address", v.address, { shouldValidate: true })
    setValue("neighborhood", v.neighborhood, { shouldValidate: true })
    setValue("city", v.city, { shouldValidate: true })
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-10">
      {serverError ? <FormAlert>{serverError}</FormAlert> : null}

      <Block title="Pelada">
        <Field label="Nome" placeholder="Racha de sexta" error={errors.title?.message} {...register("title")} />
        <ChoiceGroup
          legend="Quadra"
          columns={4}
          options={COURT_TYPES.map((v) => ({ value: v, label: COURT_LABEL[v] }))}
          registration={register("courtType")}
          error={errors.courtType?.message}
        />
      </Block>

      <Block title="Quando">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Data" type="date" error={errors.date?.message} {...register("date")} />
          <Field label="Início" type="time" error={errors.time?.message} {...register("time")} />
        </div>
        <Field
          label="Duração"
          type="number"
          inputMode="numeric"
          min={30}
          max={300}
          step={15}
          suffix="min"
          error={errors.durationMinutes?.message}
          {...register("durationMinutes")}
        />
        {mode === "create" ? (
          <Field
            label="Repetir nas próximas semanas"
            type="number"
            inputMode="numeric"
            min={0}
            max={12}
            suffix="semanas"
            hint="Mesmo dia e horário. Cada semana tem a própria lista. 0 = só essa."
            error={errors.repeatWeeks?.message}
            {...register("repeatWeeks")}
          />
        ) : null}
      </Block>

      <Block title="Onde">
        {venues.length ? (
          <div>
            <p className="label-caps mb-1.5 text-muted">Locais salvos</p>
            <div className="flex flex-wrap gap-2">
              {venues.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => applyVenue(v)}
                  className="inline-flex min-h-11 items-center gap-1.5 border border-ink px-3 font-label text-sm font-bold hover:bg-paper-deep"
                >
                  <MapPin aria-hidden className="size-4" />
                  {v.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <Field label="Local" placeholder="Arena Bom Pastor" error={errors.venueName?.message} {...register("venueName")} />
        <Field
          label="Endereço"
          autoComplete="street-address"
          placeholder="Rua, número"
          error={errors.address?.message}
          {...register("address")}
        />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Bairro" error={errors.neighborhood?.message} {...register("neighborhood")} />
          <Field label="Cidade" error={errors.city?.message} {...register("city")} />
        </div>
        {mode === "create" ? (
          <CheckField label="Salvar esse local" hint="Pra marcar a próxima com um toque." {...register("saveVenue")} />
        ) : null}
      </Block>

      <Block title="Vagas">
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Linha"
            type="number"
            inputMode="numeric"
            min={2}
            max={40}
            error={errors.fieldSlots?.message}
            {...register("fieldSlots")}
          />
          <Field
            label="Goleiro"
            type="number"
            inputMode="numeric"
            min={0}
            max={4}
            hint="0 se goleiro reveza."
            error={errors.goalkeeperSlots?.message}
            {...register("goalkeeperSlots")}
          />
        </div>
        <ChoiceGroup
          legend="Nível esperado"
          columns={4}
          options={[{ value: "", label: "Qualquer" }, ...LEVELS.map((v) => ({ value: v, label: LEVEL_LABEL[v] }))]}
          registration={register("level")}
          error={errors.level?.message}
        />
      </Block>

      <Block title="Valor">
        <Field
          label="Por pessoa"
          inputMode="decimal"
          placeholder="20,00"
          suffix="R$"
          hint="Deixa vazio se for de graça."
          error={errors.price?.message}
          {...register("price")}
        />
        <Field
          label="Chave Pix"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="CPF, celular, e-mail ou chave aleatória"
          error={errors.pixKey?.message}
          {...register("pixKey")}
        />
      </Block>

      <Block title="Regras">
        <Field
          label="Prazo pra desistir"
          type="number"
          inputMode="numeric"
          min={0}
          max={72}
          suffix="h antes"
          hint="Depois disso, quem está confirmado não sai pelo app."
          error={errors.leaveDeadlineHours?.message}
          {...register("leaveDeadlineHours")}
        />
        <TextArea
          label="Observações"
          placeholder="Colete por conta da casa. Chegar 10 min antes."
          error={errors.rules?.message}
          {...register("rules")}
        />
        <ChoiceGroup
          legend="Quem vê"
          columns={2}
          options={[
            { value: "true", label: "Aberta, aparece no Explorar" },
            { value: "false", label: "Privada, só com o link" },
          ]}
          registration={register("isPublic")}
          error={errors.isPublic?.message}
        />
        {mode === "create" ? (
          <CheckField label="Eu também jogo" hint="Você já entra como o primeiro da lista." {...register("organizerPlays")} />
        ) : null}
      </Block>

      <Button type="submit" pending={pending} className="w-full sm:w-auto sm:self-start">
        {mode === "create" ? "Criar pelada" : "Salvar alterações"}
      </Button>
    </form>
  )
}
