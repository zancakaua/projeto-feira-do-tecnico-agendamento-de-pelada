"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, ClipboardList, Search, UserRound } from "lucide-react"

const TABS = [
  { href: "/minhas-peladas", label: "Peladas", Icon: ClipboardList },
  { href: "/explorar", label: "Explorar", Icon: Search },
  { href: "/avisos", label: "Avisos", Icon: Bell },
  { href: "/perfil", label: "Perfil", Icon: UserRound },
] as const

export function BottomNav({ unread }: { unread: number }) {
  const pathname = usePathname()
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-ink-soft bg-ink pb-[env(safe-area-inset-bottom)] md:static md:border-0 md:bg-transparent md:pb-0"
    >
      <ul className="mx-auto grid max-w-md grid-cols-4 md:flex md:max-w-none md:gap-1">
        {TABS.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`relative flex min-h-16 flex-col items-center justify-center gap-1 font-label text-[0.8rem] font-bold tracking-[0.08em] uppercase no-underline md:min-h-11 md:flex-row md:px-3 ${
                  active ? "text-paper" : "text-on-ink-muted hover:text-paper"
                }`}
              >
                {active ? <span aria-hidden className="absolute inset-x-5 top-0 h-[3px] bg-stamp md:inset-x-3 md:top-auto md:bottom-0" /> : null}
                <span className="relative">
                  <Icon aria-hidden className="size-6 md:size-5" strokeWidth={active ? 2.25 : 1.75} />
                  {label === "Avisos" && unread > 0 ? (
                    <span className="absolute -top-1.5 -right-2.5 min-w-5 bg-stamp px-1 text-center font-sans text-[0.7rem] leading-5 font-bold text-white tracking-normal">
                      {unread > 9 ? "9+" : unread}
                      <span className="sr-only"> avisos novos</span>
                    </span>
                  ) : null}
                </span>
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
