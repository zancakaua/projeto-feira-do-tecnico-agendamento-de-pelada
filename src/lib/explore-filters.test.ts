import { describe, expect, it } from "vitest"
import { activeFilterCount, filtersToParams, parseFilters } from "./explore-filters"

// quinta, 29/10/2026, 12:00 em São Paulo
const now = new Date("2026-10-29T15:00:00Z")

describe("parseFilters", () => {
  it("usa a cidade padrão e não filtra data quando não vem nada", () => {
    expect(parseFilters({}, { defaultCity: "Juiz de Fora", now })).toEqual({
      city: "Juiz de Fora",
      neighborhood: null,
      when: null,
      from: "2026-10-29T15:00:00.000Z",
      to: null,
      courts: [],
      level: null,
      maxPrice: null,
      needGoalkeeper: false,
      q: null,
    })
  })

  it("hoje vai de agora até a meia-noite de São Paulo", () => {
    const f = parseFilters({ quando: "hoje" }, { defaultCity: "Juiz de Fora", now })
    expect(f.from).toBe("2026-10-29T15:00:00.000Z")
    expect(f.to).toBe("2026-10-30T03:00:00.000Z")
  })

  it("amanhã é o dia inteiro seguinte", () => {
    const f = parseFilters({ quando: "amanha" }, { defaultCity: "Juiz de Fora", now })
    expect(f.from).toBe("2026-10-30T03:00:00.000Z")
    expect(f.to).toBe("2026-10-31T03:00:00.000Z")
  })

  it("fim de semana vai de sábado 00h a segunda 00h", () => {
    const f = parseFilters({ quando: "fds" }, { defaultCity: "Juiz de Fora", now })
    expect(f.from).toBe("2026-10-31T03:00:00.000Z")
    expect(f.to).toBe("2026-11-02T03:00:00.000Z")
  })

  it("lê várias quadras, nível, preço, goleiro, bairro e busca", () => {
    const f = parseFilters(
      { quadra: ["society", "futsal", "xadrez"], nivel: "avancado", preco: "25", goleiro: "1", bairro: "Centro", q: "  arena " },
      { defaultCity: "Juiz de Fora", now },
    )
    expect(f.courts).toEqual(["society", "futsal"])
    expect(f.level).toBe("avancado")
    expect(f.maxPrice).toBe(2500)
    expect(f.needGoalkeeper).toBe(true)
    expect(f.neighborhood).toBe("Centro")
    expect(f.q).toBe("arena")
  })

  it("preço 0 significa só grátis; lixo é ignorado", () => {
    expect(parseFilters({ preco: "0" }, { defaultCity: "X", now }).maxPrice).toBe(0)
    expect(parseFilters({ preco: "abc", nivel: "craque" }, { defaultCity: "X", now })).toMatchObject({
      maxPrice: null,
      level: null,
    })
  })
})

describe("filtersToParams / activeFilterCount", () => {
  it("monta a URL só com o que foi escolhido e conta os filtros ativos", () => {
    const f = parseFilters({ quando: "fds", quadra: "areia", goleiro: "1", cidade: "Juiz de Fora" }, { defaultCity: "Juiz de Fora", now })
    expect(filtersToParams(f, "Juiz de Fora")).toBe("quando=fds&quadra=areia&goleiro=1")
    expect(activeFilterCount(f)).toBe(3)
  })
})
