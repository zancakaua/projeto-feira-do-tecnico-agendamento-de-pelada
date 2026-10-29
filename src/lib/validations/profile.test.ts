import { describe, expect, it } from "vitest"
import { avatarFileError, formatPhone, profileSchema } from "./profile"

const ok = {
  fullName: "Ana Clara Reis",
  nickname: "anaclara",
  city: "Juiz de Fora",
  position: "meio",
  level: "intermediario",
  phone: "",
}

describe("profileSchema", () => {
  it("aceita perfil válido sem telefone e guarda telefone como null", () => {
    const r = profileSchema.safeParse(ok)
    expect(r.success).toBe(true)
    expect(r.data?.phone).toBeNull()
  })

  it("normaliza o apelido para minúsculas e sem espaços nas pontas", () => {
    expect(profileSchema.parse({ ...ok, nickname: "  AnaClara " }).nickname).toBe("anaclara")
  })

  it("recusa apelido com espaço, acento ou curto demais", () => {
    for (const nickname of ["ana clara", "joão", "ab"]) {
      const r = profileSchema.safeParse({ ...ok, nickname })
      expect(r.error?.issues[0].message).toBe("Use de 3 a 24 letras sem acento, números ou _.")
    }
  })

  it("limpa a máscara do telefone e guarda só os dígitos", () => {
    expect(profileSchema.parse({ ...ok, phone: "(32) 98888-7777" }).phone).toBe("32988887777")
    expect(profileSchema.parse({ ...ok, phone: "+55 32 3215-1000" }).phone).toBe("553232151000")
  })

  it("recusa telefone sem DDD", () => {
    const r = profileSchema.safeParse({ ...ok, phone: "98888-7777" })
    expect(r.error?.issues[0].message).toBe("Telefone com DDD, tipo (32) 98888-7777.")
  })

  it("recusa posição que não existe", () => {
    expect(profileSchema.safeParse({ ...ok, position: "ponta" }).success).toBe(false)
  })
})

describe("formatPhone", () => {
  it("formata celular e fixo com DDD", () => {
    expect(formatPhone("32988887777")).toBe("(32) 98888-7777")
    expect(formatPhone("3232151000")).toBe("(32) 3215-1000")
  })

  it("tira o 55 do país na exibição", () => {
    expect(formatPhone("5532988887777")).toBe("(32) 98888-7777")
  })
})

describe("avatarFileError", () => {
  it("aceita jpg, png e webp até 2 MB", () => {
    expect(avatarFileError({ type: "image/jpeg", size: 500_000 })).toBeNull()
    expect(avatarFileError({ type: "image/webp", size: 2 * 1024 * 1024 })).toBeNull()
  })

  it("recusa outros formatos", () => {
    expect(avatarFileError({ type: "image/gif", size: 1000 })).toBe("Manda a foto em JPG, PNG ou WebP.")
  })

  it("recusa arquivo maior que 2 MB", () => {
    expect(avatarFileError({ type: "image/png", size: 2 * 1024 * 1024 + 1 })).toBe("Foto grande demais. O limite é 2 MB.")
  })
})
