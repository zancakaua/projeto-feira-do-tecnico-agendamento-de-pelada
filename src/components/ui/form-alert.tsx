import { CircleAlert, MailCheck } from "lucide-react"
import type { ReactNode } from "react"

export function FormAlert({ tone = "error", children }: { tone?: "error" | "ok"; children: ReactNode }) {
  const Icon = tone === "error" ? CircleAlert : MailCheck
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex items-start gap-2.5 border px-3 py-2.5 text-[0.95rem] ${
        tone === "error" ? "border-stamp text-stamp" : "border-ink bg-paper-deep text-ink"
      }`}
    >
      <Icon aria-hidden className="mt-0.5 size-5 shrink-0" strokeWidth={2} />
      <div>{children}</div>
    </div>
  )
}
