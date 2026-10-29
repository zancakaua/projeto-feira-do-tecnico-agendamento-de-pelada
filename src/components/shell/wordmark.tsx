import Link from "next/link"

export function Wordmark({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="font-label text-xl leading-none font-bold tracking-[0.22em] text-paper no-underline"
      aria-label="Racha, página inicial"
    >
      RACHA<span className="text-stamp">.</span>
    </Link>
  )
}
