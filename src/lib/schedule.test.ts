import { describe, expect, it } from "vitest"
import { localParts, toStartsAt, weeklyOccurrences } from "./schedule"

describe("toStartsAt", () => {
  it("converte data e hora de São Paulo para UTC", () => {
    expect(toStartsAt("2026-10-30", "20:00")).toBe("2026-10-30T23:00:00.000Z")
  })

  it("passa da meia-noite UTC sem errar o dia", () => {
    expect(toStartsAt("2026-10-30", "22:30")).toBe("2026-10-31T01:30:00.000Z")
  })
})

describe("localParts", () => {
  it("volta de UTC para data e hora locais (usado no editar)", () => {
    expect(localParts("2026-10-31T01:30:00Z")).toEqual({ date: "2026-10-30", time: "22:30" })
  })
})

describe("weeklyOccurrences", () => {
  it("gera a primeira mais as semanas seguintes", () => {
    expect(weeklyOccurrences("2026-10-30T23:00:00.000Z", 3)).toEqual([
      "2026-10-30T23:00:00.000Z",
      "2026-11-06T23:00:00.000Z",
      "2026-11-13T23:00:00.000Z",
      "2026-11-20T23:00:00.000Z",
    ])
  })

  it("sem repetição é só a primeira", () => {
    expect(weeklyOccurrences("2026-10-30T23:00:00.000Z", 0)).toEqual(["2026-10-30T23:00:00.000Z"])
  })
})
