import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { formatDistanceToNowStrict } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ArrowUpRight, Ban, PencilLine, UserMinus } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { MarkAllRead } from "@/components/notifications/mark-read"
import type { Enums } from "@/types/database"

export const metadata: Metadata = { title: "Avisos" }

const KIND: Record<Enums<"notification_kind">, { label: string; Icon: typeof Ban }> = {
  promovido: { label: "Subiu da espera", Icon: ArrowUpRight },
  cancelada: { label: "Cancelada", Icon: Ban },
  alterada: { label: "Mudou", Icon: PencilLine },
  removido: { label: "Fora da lista", Icon: UserMinus },
}

export default async function NotificationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/entrar?volta=/avisos")

  const { data } = await supabase
    .from("notifications")
    .select("id, kind, body, read_at, created_at, match:matches(code)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(60)
  const items = data ?? []
  const unread = items.filter((n) => !n.read_at).length

  return (
    <>
      <MarkAllRead unread={unread} />
      <div className="border-b-[3px] border-double border-ink pb-4">
        <h1 className="font-label text-3xl leading-none font-bold">Avisos</h1>
        <p className="mt-2 text-muted">
          {unread ? `${unread} ${unread === 1 ? "novo" : "novos"}` : "Quando alguma pelada sua mudar, aparece aqui."}
        </p>
      </div>

      {items.length ? (
        <ol>
          {items.map((n) => {
            const { label, Icon } = KIND[n.kind]
            const tone = n.kind === "promovido" ? "text-stamp" : n.kind === "cancelada" || n.kind === "removido" ? "text-ink" : "text-muted"
            return (
              <li key={n.id} className={`relative border-b border-rule py-3 ${n.read_at ? "" : "bg-paper-deep"} has-[a:hover]:bg-paper-deep`}>
                <div className="flex items-start gap-3 px-1">
                  <Icon aria-hidden className={`mt-0.5 size-5 shrink-0 ${tone}`} strokeWidth={2} />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-baseline justify-between gap-2">
                      <span className={`label-caps ${tone}`}>
                        {label}
                        {n.read_at ? null : <span className="sr-only"> (novo)</span>}
                      </span>
                      <time dateTime={n.created_at} className="shrink-0 text-xs text-muted">
                        há {formatDistanceToNowStrict(new Date(n.created_at), { locale: ptBR })}
                      </time>
                    </p>
                    <p className="mt-0.5">
                      {n.match ? (
                        <Link href={`/pelada/${n.match.code}`} className="text-ink no-underline after:absolute after:inset-0">
                          {n.body}
                        </Link>
                      ) : (
                        n.body
                      )}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      ) : (
        <p className="py-8 text-muted">Nenhum aviso ainda. Tá tudo em dia.</p>
      )}
    </>
  )
}
