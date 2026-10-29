import { z } from "zod"

export const POSITIONS = ["goleiro", "zagueiro", "meio", "atacante", "tanto_faz"] as const
export const LEVELS = ["iniciante", "intermediario", "avancado"] as const

const PHONE_MESSAGE = "Telefone com DDD, tipo (32) 98888-7777."

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Coloca seu nome (pelo menos 2 letras).").max(80, "Nome longo demais."),
  nickname: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9_]{3,24}$/, "Use de 3 a 24 letras sem acento, números ou _."),
  city: z.string().trim().min(2, "Qual cidade?").max(80, "Nome de cidade longo demais."),
  position: z.enum(POSITIONS, "Escolhe uma posição."),
  level: z.enum(LEVELS, "Escolhe um nível."),
  phone: z
    .string()
    .trim()
    .transform((v) => (v ? v.replace(/\D/g, "") : null))
    .refine((v) => v === null || /^(55)?\d{10,11}$/.test(v), PHONE_MESSAGE),
})

export type ProfileInput = z.input<typeof profileSchema>
export type ProfileData = z.output<typeof profileSchema>

export function formatPhone(digits: string) {
  const local = digits.length > 11 && digits.startsWith("55") ? digits.slice(2) : digits
  const ddd = local.slice(0, 2)
  const rest = local.slice(2)
  const cut = rest.length - 4
  return `(${ddd}) ${rest.slice(0, cut)}-${rest.slice(cut)}`
}

export const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"]
export const AVATAR_MAX_BYTES = 2 * 1024 * 1024

export function avatarFileError(file: { type: string; size: number }) {
  if (!AVATAR_TYPES.includes(file.type)) return "Manda a foto em JPG, PNG ou WebP."
  if (file.size > AVATAR_MAX_BYTES) return "Foto grande demais. O limite é 2 MB."
  return null
}
