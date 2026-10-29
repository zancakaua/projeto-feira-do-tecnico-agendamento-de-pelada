import { describe, expect, it } from "vitest"
import { formatPrice, parseBRL } from "./money"

describe("parseBRL", () => {
  it("entende vírgula, ponto de milhar e R$", () => {
    expect(parseBRL("20")).toBe(2000)
    expect(parseBRL("20,00")).toBe(2000)
    expect(parseBRL("R$ 15,50")).toBe(1550)
    expect(parseBRL("1.200,00")).toBe(120000)
    expect(parseBRL("17.5")).toBe(1750)
  })

  it("vazio é gratuito", () => {
    expect(parseBRL("")).toBe(0)
    expect(parseBRL("  ")).toBe(0)
  })

  it("devolve null para texto que não é valor", () => {
    expect(parseBRL("vinte")).toBeNull()
    expect(parseBRL("-5")).toBeNull()
  })
})

describe("formatPrice", () => {
  it("mostra Grátis para zero", () => {
    expect(formatPrice(0)).toBe("Grátis")
  })

  it("mostra reais sem centavos quando redondo", () => {
    expect(formatPrice(2000)).toBe("R$ 20")
    expect(formatPrice(1550)).toBe("R$ 15,50")
  })
})
