import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { isProtectedPath } from "@/lib/auth-paths"

// Renova a sessão do Supabase a cada request e protege as rotas que exigem login.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    },
  )

  // getClaims valida o JWT localmente (chaves ES256), sem ida ao servidor de Auth a cada request
  const { data } = await supabase.auth.getClaims()
  const user = data?.claims.sub ? { id: data.claims.sub } : null

  if (!user && isProtectedPath(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = "/entrar"
    url.search = `?volta=${encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search)}`
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons/|manifest.webmanifest|sw.js|.*\\.(?:png|jpg|jpeg|svg|webp|woff2)$).*)"],
}
