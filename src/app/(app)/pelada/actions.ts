"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { weeklyOccurrences } from "@/lib/schedule"
import { matchSchema, type MatchData, type MatchFormInput } from "@/lib/validations/match"

export type MatchResult = { error?: string; field?: string }

const GENERIC = "Não deu pra salvar agora. Tenta de novo em instantes."

function firstIssue(input: MatchFormInput) {
  const parsed = matchSchema().safeParse(input)
  if (parsed.success) return { data: parsed.data }
  const issue = parsed.error.issues[0]
  return { result: { error: issue.message, field: String(issue.path[0] ?? "") } satisfies MatchResult }
}

function columns(d: MatchData) {
  return {
    title: d.title,
    court_type: d.courtType,
    venue_name: d.venueName,
    address: d.address,
    neighborhood: d.neighborhood,
    city: d.city,
    duration_minutes: d.durationMinutes,
    field_slots: d.fieldSlots,
    goalkeeper_slots: d.goalkeeperSlots,
    price_cents: d.priceCents,
    pix_key: d.pixKey,
    level: d.level,
    rules: d.rules,
    is_public: d.isPublic,
    leave_deadline_hours: d.leaveDeadlineHours,
  }
}

async function requireUser(volta: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/entrar?volta=${encodeURIComponent(volta)}`)
  return { supabase, user }
}

export async function createMatchAction(input: MatchFormInput): Promise<MatchResult> {
  const { data, result } = firstIssue(input)
  if (!data) return result
  const { supabase, user } = await requireUser("/pelada/nova")

  let venueId: string | null = null
  if (data.saveVenue) {
    const { data: venue } = await supabase
      .from("venues")
      .insert({ owner_id: user.id, name: data.venueName, address: data.address, neighborhood: data.neighborhood, city: data.city })
      .select("id")
      .single()
    venueId = venue?.id ?? null
  }

  let seriesId: string | null = null
  if (data.repeatWeeks > 0) {
    const { data: series, error } = await supabase.from("match_series").insert({ organizer_id: user.id }).select("id").single()
    if (error) return { error: GENERIC }
    seriesId = series.id
  }

  const rows = weeklyOccurrences(data.startsAt, data.repeatWeeks).map((startsAt) => ({
    ...columns(data),
    organizer_id: user.id,
    series_id: seriesId,
    venue_id: venueId,
    starts_at: startsAt,
  }))
  const { data: created, error } = await supabase.from("matches").insert(rows).select("code, starts_at").order("starts_at")
  if (error || !created?.length) return { error: GENERIC }

  if (data.organizerPlays) {
    for (const m of created) await supabase.rpc("join_match", { p_code: m.code, p_slot: "linha" })
  }

  revalidatePath("/minhas-peladas")
  redirect(`/pelada/${created[0].code}?criada=${created.length}`)
}

export async function updateMatchAction(code: string, input: MatchFormInput): Promise<MatchResult> {
  const { data, result } = firstIssue(input)
  if (!data) return result
  const { supabase, user } = await requireUser(`/pelada/${code}/editar`)

  const { data: updated, error } = await supabase
    .from("matches")
    .update({ ...columns(data), starts_at: data.startsAt })
    .eq("code", code)
    .eq("organizer_id", user.id)
    .select("code")
  // Erros das regras do banco (ex.: menos vagas que confirmados) já vêm em português
  if (error) return { error: error.code === "P0001" ? error.message : GENERIC }
  if (!updated?.length) return { error: "Só quem organiza pode editar essa pelada." }

  revalidatePath(`/pelada/${code}`)
  redirect(`/pelada/${code}?salva=1`)
}

export async function cancelMatchAction(code: string, reason: string): Promise<MatchResult> {
  const { supabase } = await requireUser(`/pelada/${code}`)
  const { data: match } = await supabase.from("matches").select("id").eq("code", code).maybeSingle()
  if (!match) return { error: "Pelada não encontrada." }
  const { error } = await supabase.rpc("cancel_match", { p_match: match.id, p_reason: reason.slice(0, 300) })
  if (error) return { error: error.code === "42501" ? "Só quem organiza pode cancelar." : GENERIC }
  revalidatePath(`/pelada/${code}`)
  revalidatePath("/minhas-peladas")
  return {}
}
