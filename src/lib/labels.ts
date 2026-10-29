import type { Enums } from "@/types/database"

export const POSITION_LABEL: Record<Enums<"position_pref">, string> = {
  goleiro: "Goleiro",
  zagueiro: "Zagueiro",
  meio: "Meio",
  atacante: "Atacante",
  tanto_faz: "Tanto faz",
}

export const LEVEL_LABEL: Record<Enums<"skill_level">, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
}

export const COURT_LABEL: Record<Enums<"court_type">, string> = {
  society: "Society",
  futsal: "Futsal",
  campo: "Campo",
  areia: "Areia",
}
