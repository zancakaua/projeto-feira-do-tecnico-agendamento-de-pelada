import { describe, expect, it } from "vitest"
import { leaveDeadline, rosterLines, whatsappLink } from "./roster"

describe("leaveDeadline", () => {
  const starts = "2026-10-30T23:00:00Z" // sex 20:00 em SP

  it("calcula o prazo no horário local", () => {
    const d = leaveDeadline(starts, 6, new Date("2026-10-30T12:00:00Z"))
    expect(d.label).toBe("sex 14:00")
    expect(d.passed).toBe(false)
  })

  it("marca como passado depois do prazo", () => {
    expect(leaveDeadline(starts, 6, new Date("2026-10-30T17:30:00Z")).passed).toBe(true)
  })

  it("prazo zero vai até a hora do jogo", () => {
    expect(leaveDeadline(starts, 0, new Date("2026-10-30T22:59:00Z")).passed).toBe(false)
  })
})

describe("rosterLines", () => {
  const people = [{ id: "a" }, { id: "b" }]

  it("preenche as linhas numeradas e deixa o resto em branco", () => {
    expect(rosterLines(people, 4)).toEqual([
      { n: 1, person: { id: "a" } },
      { n: 2, person: { id: "b" } },
      { n: 3, person: null },
      { n: 4, person: null },
    ])
  })

  it("nunca corta gente se tiver mais confirmados que vagas", () => {
    expect(rosterLines(people, 1)).toHaveLength(2)
  })
})

describe("whatsappLink", () => {
  it("põe o 55 do Brasil quando falta", () => {
    expect(whatsappLink("32988887777")).toBe("https://wa.me/5532988887777")
    expect(whatsappLink("5532988887777")).toBe("https://wa.me/5532988887777")
  })
})
