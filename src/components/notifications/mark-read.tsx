"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { markAllReadAction } from "@/app/(app)/avisos/actions"

// Abriu a tela de avisos = leu. Marca depois de renderizar e atualiza o contador da navegação.
export function MarkAllRead({ unread }: { unread: number }) {
  const router = useRouter()
  useEffect(() => {
    if (!unread) return
    markAllReadAction().then(() => router.refresh())
  }, [unread, router])
  return null
}
