import { describe, expect, it } from "vitest"
import { matchSchema } from "./match"

const now = new Date("2026-10-29T15:00:00Z")
const ok = {
  title: "Racha de sexta",
  courtType: "society",
  venueName: "Arena Bom Pastor",
  address: "Rua Dr. Constantino Paleta, 300",
  neighborhood: "Bom Pastor",
  city: "Juiz de Fora",
  date: "2026-10-30",
  time: "20:00",
  durationMinutes: "90",
  fieldSlots: "14",
  goalkeeperSlots: "2",
  price: "20,00",
  pixKey: "thiago@exemplo.com",
  level: "",
  rules: "",
  isPublic: "true",
  leaveDeadlineHours: "6",
  repeatWeeks: "0",
  organizerPlays: true,
  saveVenue: false,
}

const parse = (v: object) => matchSchema(now).safeParse({ ...ok, ...v })

describe("matchSchema", () => {
  it("converte o formulário para os campos do banco", () => {
    const r = parse({})
    expect(r.success).toBe(true)
    expect(r.data).toMatchObject({
      startsAt: "2026-10-30T23:00:00.000Z",
      durationMinutes: 90,
      fieldSlots: 14,
      goalkeeperSlots: 2,
      priceCents: 2000,
      level: null,
      rules: null,
      isPublic: true,
      repeatWeeks: 0,
    })
  })

  it("não deixa marcar pelada no passado", () => {
    const r = parse({ date: "2026-10-29", time: "11:00" })
    expect(r.error?.issues[0].message).toBe("Esse horário já passou.")
    expect(r.error?.issues[0].path).toEqual(["time"])
  })

  it("pelada paga precisa de chave Pix", () => {
    const r = parse({ pixKey: "" })
    expect(r.error?.issues[0].message).toBe("Pelada paga precisa da chave Pix pra galera pagar.")
  })

  it("pelada grátis não precisa de Pix e guarda null", () => {
    const r = parse({ price: "", pixKey: "" })
    expect(r.success).toBe(true)
    expect(r.data?.priceCents).toBe(0)
    expect(r.data?.pixKey).toBeNull()
  })

  it("recusa valor que não é dinheiro", () => {
    expect(parse({ price: "vinte" }).error?.issues[0].message).toBe("Valor tipo 20 ou 17,50.")
  })

  it("limita vagas de linha e de goleiro", () => {
    expect(parse({ fieldSlots: "1" }).error?.issues[0].message).toBe("De 2 a 40 vagas de linha.")
    expect(parse({ goalkeeperSlots: "5" }).error?.issues[0].message).toBe("De 0 a 4 goleiros.")
  })

  it("aceita nível específico", () => {
    expect(parse({ level: "avancado" }).data?.level).toBe("avancado")
  })

  it("limita a repetição a 12 semanas", () => {
    expect(parse({ repeatWeeks: "13" }).success).toBe(false)
  })
})
