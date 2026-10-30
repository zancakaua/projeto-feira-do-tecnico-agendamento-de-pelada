"use server"

import { revalidatePath } from "next/cache"
import { createClient, getCurrentUser } from "@/lib/supabase/server"

export async function markAllReadAction() {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return
  await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("user_id", user.id).is("read_at", null)
  revalidatePath("/", "layout")
}
