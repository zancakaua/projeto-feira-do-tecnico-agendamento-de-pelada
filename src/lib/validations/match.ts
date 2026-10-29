import { z } from "zod"
import { parseBRL } from "@/lib/money"
import { toStartsAt } from "@/lib/schedule"
import { LEVELS } from "./profile"

export const COURT_TYPES = ["society", "futsal", "campo", "areia"] as const

const int = (min: number, max: number, message: string) =>
  z.coerce.number({ error: message }).int(message).min(min, message).max(max, message)

const optionalText = (max: number, message: string) =>
  z
    .string()
    .trim()
    .max(max, message)
    .transform((v) => v || null)

const boolish = z.union([z.boolean(), z.string()]).transform((v) => v === true || v === "true")

const baseSchema = z.object({
  title: z.string().trim().min(3, "Dá um nome pra pelada (3 letras ou mais).").max(80, "Nome longo demais."),
  courtType: z.enum(COURT_TYPES, "Escolhe o tipo de quadra."),
  venueName: z.string().trim().min(2, "Qual o nome do lugar?").max(80, "Nome longo demais."),
  address: z.string().trim().min(5, "Coloca o endereço com número.").max(160, "Endereço longo demais."),
  neighborhood: z.string().trim().min(2, "Qual o bairro?").max(60, "Bairro longo demais."),
  city: z.string().trim().min(2, "Qual a cidade?").max(80, "Cidade longa demais."),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Escolhe a data."),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Escolhe o horário."),
  durationMinutes: int(30, 300, "Duração entre 30 min e 5 h."),
  fieldSlots: int(2, 40, "De 2 a 40 vagas de linha."),
  goalkeeperSlots: int(0, 4, "De 0 a 4 goleiros."),
  price: z.string(),
  pixKey: optionalText(140, "Chave Pix longa demais."),
  level: z.union([z.enum(LEVELS), z.literal("")]).transform((v) => v || null),
  rules: optionalText(1500, "Regras longas demais (até 1500 caracteres)."),
  isPublic: boolish,
  leaveDeadlineHours: int(0, 72, "Prazo de 0 a 72 horas."),
  repeatWeeks: int(0, 12, "Repete no máximo 12 semanas."),
  organizerPlays: boolish,
  saveVenue: boolish,
})

export type MatchFormInput = z.input<typeof baseSchema>

export function matchSchema(now: Date = new Date()) {
  return baseSchema
    .superRefine((v, ctx) => {
      const priceCents = parseBRL(v.price)
      if (priceCents === null) {
        ctx.addIssue({ code: "custom", path: ["price"], message: "Valor tipo 20 ou 17,50." })
      } else if (priceCents > 100000) {
        ctx.addIssue({ code: "custom", path: ["price"], message: "Valor máximo de R$ 1.000 por pessoa." })
      } else if (priceCents > 0 && !v.pixKey) {
        ctx.addIssue({ code: "custom", path: ["pixKey"], message: "Pelada paga precisa da chave Pix pra galera pagar." })
      }
      if (new Date(toStartsAt(v.date, v.time)).getTime() <= now.getTime()) {
        ctx.addIssue({ code: "custom", path: ["time"], message: "Esse horário já passou." })
      }
    })
    .transform(({ date, time, price, ...rest }) => ({
      ...rest,
      startsAt: toStartsAt(date, time),
      priceCents: parseBRL(price) ?? 0,
    }))
}

export type MatchData = z.output<ReturnType<typeof matchSchema>>
