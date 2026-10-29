import Link from "next/link"
import { LoaderCircle } from "lucide-react"
import type { ComponentProps } from "react"

type Variant = "primary" | "ink" | "outline" | "ghost"

const base =
  "inline-flex min-h-13 items-center justify-center gap-2 px-5 font-label text-lg font-bold uppercase tracking-[0.06em] transition-colors disabled:cursor-not-allowed disabled:opacity-55"

const variants: Record<Variant, string> = {
  primary: "bg-stamp text-white hover:bg-stamp-deep active:bg-stamp-deep",
  ink: "bg-ink text-paper hover:bg-ink-soft",
  outline: "border border-ink bg-paper text-ink hover:bg-paper-deep",
  ghost: "text-ink underline decoration-1 underline-offset-4 hover:text-stamp",
}

export function buttonClass(variant: Variant = "primary", className = "") {
  return `${base} ${variants[variant]} ${className}`
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; pending?: boolean }

export function Button({ variant = "primary", pending, disabled, children, className, ...props }: ButtonProps) {
  return (
    <button
      className={buttonClass(variant, className)}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
      {...props}
    >
      {pending ? <LoaderCircle aria-hidden className="size-5 animate-spin" /> : null}
      {children}
    </button>
  )
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant }

export function ButtonLink({ variant = "primary", className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClass(variant, className)} {...props} />
}
