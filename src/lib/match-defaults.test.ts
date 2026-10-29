import { describe, expect, it } from "vitest"
import { blankDefaults, matchToDefaults } from "./match-defaults"

const match = {
  title: "Racha de sexta",
  court_type: "society" as const,
  venue_name: "Arena Bom Pastor",
  address: "Rua Dr. Constantino Paleta, 300",
  neighborhood: "Bom Pastor",
  city: "Juiz de Fora",
  starts_at: "2026-10-30T23:00:00Z",
  duration_minutes: 90,
  field_slots: 14,
  goalkeeper_slots: 2,
  price_cents: 1550,
  pix_key: "thiago@exemplo.com",
  level: null,
  rules: "Chegar cedo",
  is_public: false,
  leave_deadline_hours: 6,
}

describe("matchToDefaults", () => {
  it("preenche o formulário de edição no horário local", () => {
    expect(matchToDefaults(match)).toMatchObject({
      date: "2026-10-30",
      time: "20:00",
      price: "15,50",
      level: "",
      rules: "Chegar cedo",
      isPublic: "false",
      durationMinutes: "90",
    })
  })

  it("duplicar joga a data uma semana pra frente e não repete", () => {
    const d = matchToDefaults(match, { duplicate: true })
    expect(d.date).toBe("2026-11-06")
    expect(d.time).toBe("20:00")
    expect(d.repeatWeeks).toBe("0")
  })
})

describe("blankDefaults", () => {
  it("começa com a cidade do perfil e valores comuns de pelada", () => {
    expect(blankDefaults("Juiz de Fora")).toMatchObject({
      city: "Juiz de Fora",
      time: "20:00",
      durationMinutes: "60",
      fieldSlots: "10",
      goalkeeperSlots: "2",
      isPublic: "true",
      organizerPlays: true,
    })
  })
})
