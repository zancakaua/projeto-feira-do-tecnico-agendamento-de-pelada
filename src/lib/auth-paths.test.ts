import { describe, expect, it } from "vitest"
import { isProtectedPath, safeReturnPath } from "./auth-paths"

describe("isProtectedPath", () => {
  it("exige login para criar pelada", () => {
    expect(isProtectedPath("/pelada/nova")).toBe(true)
  })

  it("exige login para editar e gerenciar", () => {
    expect(isProtectedPath("/pelada/abc123/editar")).toBe(true)
    expect(isProtectedPath("/pelada/abc123/gerenciar")).toBe(true)
  })

  it("exige login no painel, avisos e perfil", () => {
    expect(isProtectedPath("/minhas-peladas")).toBe(true)
    expect(isProtectedPath("/avisos")).toBe(true)
    expect(isProtectedPath("/perfil/editar")).toBe(true)
  })

  it("deixa a página da pelada aberta para quem chega pelo link", () => {
    expect(isProtectedPath("/pelada/abc123")).toBe(false)
  })

  it("deixa explorar, perfil público e telas de auth abertos", () => {
    expect(isProtectedPath("/")).toBe(false)
    expect(isProtectedPath("/explorar")).toBe(false)
    expect(isProtectedPath("/jogador/tigrao")).toBe(false)
    expect(isProtectedPath("/entrar")).toBe(false)
    expect(isProtectedPath("/cadastro")).toBe(false)
  })
})

describe("safeReturnPath", () => {
  it("aceita caminho interno", () => {
    expect(safeReturnPath("/pelada/abc123")).toBe("/pelada/abc123")
  })

  it("recusa URL externa e protocolo relativo", () => {
    expect(safeReturnPath("https://golpe.com")).toBe("/minhas-peladas")
    expect(safeReturnPath("//golpe.com")).toBe("/minhas-peladas")
    expect(safeReturnPath("/\\golpe.com")).toBe("/minhas-peladas")
  })

  it("usa o painel quando não vem nada", () => {
    expect(safeReturnPath(null)).toBe("/minhas-peladas")
    expect(safeReturnPath(undefined)).toBe("/minhas-peladas")
    expect(safeReturnPath("")).toBe("/minhas-peladas")
  })
})
