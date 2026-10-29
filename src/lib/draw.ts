import type { Enums } from "@/types/database"

type Player = { user_id: string; level: Enums<"skill_level">; slot: Enums<"slot_kind"> }

const SCORE: Record<Enums<"skill_level">, number> = { iniciante: 1, intermediario: 2, avancado: 3 }

function shuffle<T>(items: T[], random: () => number) {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Sorteio equilibrado: goleiros um por time; linha em "serpentina" por nível (1,2,3,3,2,1...)
// O embaralhamento antes de ordenar faz quem tem o mesmo nível cair em times diferentes a cada sorteio.
export function drawTeams(players: Player[], teams: number, random: () => number = Math.random) {
  const assign: { user_id: string; team: number }[] = []

  const keepers = shuffle(
    players.filter((p) => p.slot === "goleiro"),
    random,
  ).sort((a, b) => SCORE[b.level] - SCORE[a.level])
  keepers.forEach((p, i) => assign.push({ user_id: p.user_id, team: (i % teams) + 1 }))

  const field = shuffle(
    players.filter((p) => p.slot === "linha"),
    random,
  ).sort((a, b) => SCORE[b.level] - SCORE[a.level])
  field.forEach((p, i) => {
    const round = Math.floor(i / teams)
    const pos = i % teams
    assign.push({ user_id: p.user_id, team: (round % 2 === 0 ? pos : teams - 1 - pos) + 1 })
  })

  return assign
}

export function teamStrength(players: Player[]) {
  return players.reduce((sum, p) => sum + SCORE[p.level], 0)
}
