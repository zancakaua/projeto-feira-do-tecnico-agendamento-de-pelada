import { describe, expect, it } from "vitest"
import { signInSchema, signUpSchema, resetRequestSchema, newPasswordSchema } from "./auth"

describe("signUpSchema", () => {
  const ok = { fullName: "Ana Clara Reis", email: "ana@exemplo.com", password: "bolanarede10" }

  it("aceita cadastro válido e limpa espaços", () => {
    const r = signUpSchema.safeParse({ ...ok, fullName: "  Ana Clara Reis ", email: " ANA@exemplo.com " })
    expect(r.success).toBe(true)
    expect(r.data).toEqual({ fullName: "Ana Clara Reis", email: "ana@exemplo.com", password: "bolanarede10" })
  })

  it("pede nome com pelo menos 2 letras", () => {
    const r = signUpSchema.safeParse({ ...ok, fullName: "A" })
    expect(r.error?.issues[0].message).toBe("Coloca seu nome (pelo menos 2 letras).")
  })

  it("recusa e-mail inválido", () => {
    const r = signUpSchema.safeParse({ ...ok, email: "ana@" })
    expect(r.error?.issues[0].message).toBe("Esse e-mail não parece certo.")
  })

  it("exige senha de 8 caracteres", () => {
    const r = signUpSchema.safeParse({ ...ok, password: "1234567" })
    expect(r.error?.issues[0].message).toBe("A senha precisa de pelo menos 8 caracteres.")
  })
})

describe("signInSchema", () => {
  it("exige senha preenchida", () => {
    const r = signInSchema.safeParse({ email: "ana@exemplo.com", password: "" })
    expect(r.error?.issues[0].message).toBe("Digita sua senha.")
  })
})

describe("resetRequestSchema", () => {
  it("só pede o e-mail", () => {
    expect(resetRequestSchema.safeParse({ email: "ana@exemplo.com" }).success).toBe(true)
  })
})

describe("newPasswordSchema", () => {
  it("exige que as duas senhas batam", () => {
    const r = newPasswordSchema.safeParse({ password: "bolanarede10", confirm: "bolanarede11" })
    expect(r.error?.issues[0].message).toBe("As senhas não batem.")
    expect(r.error?.issues[0].path).toEqual(["confirm"])
  })
})
