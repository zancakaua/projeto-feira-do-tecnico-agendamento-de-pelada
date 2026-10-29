import type { Tables } from "@/types/database"
import type { MatchFormInput } from "@/lib/validations/match"
import { priceInput } from "./money"
import { localParts } from "./schedule"

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

type MatchFields = Pick<
  Tables<"matches">,
  | "title"
  | "court_type"
  | "venue_name"
  | "address"
  | "neighborhood"
  | "city"
  | "starts_at"
  | "duration_minutes"
  | "field_slots"
  | "goalkeeper_slots"
  | "price_cents"
  | "pix_key"
  | "level"
  | "rules"
  | "is_public"
  | "leave_deadline_hours"
>

export function matchToDefaults(m: MatchFields, opts: { duplicate?: boolean } = {}): MatchFormInput {
  const start = opts.duplicate ? new Date(new Date(m.starts_at).getTime() + WEEK_MS).toISOString() : m.starts_at
  const { date, time } = localParts(start)
  return {
    title: m.title,
    courtType: m.court_type,
    venueName: m.venue_name,
    address: m.address,
    neighborhood: m.neighborhood,
    city: m.city,
    date,
    time,
    durationMinutes: String(m.duration_minutes),
    fieldSlots: String(m.field_slots),
    goalkeeperSlots: String(m.goalkeeper_slots),
    price: priceInput(m.price_cents),
    pixKey: m.pix_key ?? "",
    level: m.level ?? "",
    rules: m.rules ?? "",
    isPublic: String(m.is_public),
    leaveDeadlineHours: String(m.leave_deadline_hours),
    repeatWeeks: "0",
    organizerPlays: true,
    saveVenue: false,
  }
}

export function blankDefaults(city: string): MatchFormInput {
  return {
    title: "",
    courtType: "society",
    venueName: "",
    address: "",
    neighborhood: "",
    city,
    date: "",
    time: "20:00",
    durationMinutes: "60",
    fieldSlots: "10",
    goalkeeperSlots: "2",
    price: "",
    pixKey: "",
    level: "",
    rules: "",
    isPublic: "true",
    leaveDeadlineHours: "2",
    repeatWeeks: "0",
    organizerPlays: true,
    saveVenue: false,
  }
}
