import Link from "next/link"
import { Wordmark } from "@/components/shell/wordmark"
import { BottomNav } from "@/components/shell/bottom-nav"
import { createClient, getCurrentUser } from "@/lib/supabase/server"

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const supabase = await createClient()
  const user = await getCurrentUser()

  let unread = 0
  if (user) {
    const { count } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .is("read_at", null)
    unread = count ?? 0
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-ink px-4">
        <div className="mx-auto flex min-h-14 max-w-3xl items-center justify-between gap-4">
          <Wordmark href={user ? "/minhas-peladas" : "/"} />
          <div className="hidden md:block">{user ? <BottomNav unread={unread} /> : null}</div>
          {user ? null : (
            <Link href="/entrar" className="font-label text-sm font-bold tracking-[0.1em] text-paper uppercase underline-offset-4 hover:underline">
              Entrar
            </Link>
          )}
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-6 pb-28 md:pb-16">{children}</main>
      {user ? (
        <div className="md:hidden">
          <BottomNav unread={unread} />
        </div>
      ) : null}
    </>
  )
}
