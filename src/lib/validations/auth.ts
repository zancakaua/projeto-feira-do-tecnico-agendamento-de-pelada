import { z } from "zod"

const email = z.string().trim().toLowerCase().pipe(z.email("Esse e-mail não parece certo."))
const newPassword = z.string().min(8, "A senha precisa de pelo menos 8 caracteres.").max(72, "Senha longa demais.")

export const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Coloca seu nome (pelo menos 2 letras).").max(80, "Nome longo demais."),
  email,
  password: newPassword,
})

export const signInSchema = z.object({
  email,
  password: z.string().min(1, "Digita sua senha."),
})

export const resetRequestSchema = z.object({ email })

export const newPasswordSchema = z
  .object({ password: newPassword, confirm: z.string() })
  .refine((v) => v.password === v.confirm, { message: "As senhas não batem.", path: ["confirm"] })

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type ResetRequestInput = z.infer<typeof resetRequestSchema>
export type NewPasswordInput = z.infer<typeof newPasswordSchema>
