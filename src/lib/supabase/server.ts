import { createServerClient } from "@supabase/ssr"
import { cache } from "react"
import { cookies } from "next/headers"
import type { Database } from "@/types/database"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Chamado de um Server Component: o proxy renova a sessão.
          }
        },
      },
    },
  )
}

// Valida o JWT da sessão localmente (chaves ES256 do projeto), sem ida ao servidor de Auth.
// O cache faz layout e página do mesmo request dividirem a mesma leitura.
export const getCurrentUser = cache(async () => {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  return data?.claims.sub ? { id: data.claims.sub } : null
})
