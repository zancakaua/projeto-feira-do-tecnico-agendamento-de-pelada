import { describe, expect, it } from "vitest"
import { matchWhen, relativeDay } from "./dates"

describe("matchWhen", () => {
  it("mostra data e hora no fuso de São Paulo", () => {
    // 23:00 UTC = 20:00 em Brasília
    const w = matchWhen("2026-10-30T23:00:00Z", 90)
    expect(w).toEqual({
      weekday: "sex",
      day: "30",
      month: "out",
      start: "20:00",
      end: "21:30",
      dateLabel: "sexta, 30 de outubro",
    })
  })

  it("vira o dia corretamente perto da meia-noite UTC", () => {
    // 02:30 UTC do dia 31 ainda é dia 30 às 23:30 em São Paulo
    expect(matchWhen("2026-10-31T02:30:00Z", 60).day).toBe("30")
    expect(matchWhen("2026-10-31T02:30:00Z", 60).end).toBe("00:30")
  })
})

describe("relativeDay", () => {
  const now = new Date("2026-10-29T15:00:00Z") // quinta, 12:00 em SP

  it("diz hoje, amanhã e ontem", () => {
    expect(relativeDay("2026-10-29T23:00:00Z", now)).toBe("Hoje")
    expect(relativeDay("2026-10-30T23:00:00Z", now)).toBe("Amanhã")
    expect(relativeDay("2026-10-28T23:00:00Z", now)).toBe("Ontem")
  })

  it("usa o dia da semana para os próximos 6 dias", () => {
    expect(relativeDay("2026-11-01T12:00:00Z", now)).toBe("Domingo")
  })

  it("usa a data para o resto", () => {
    expect(relativeDay("2026-11-20T12:00:00Z", now)).toBe("20/11")
  })
})
