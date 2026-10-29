"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Camera, LoaderCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { setAvatarAction } from "@/app/(app)/perfil/actions"
import { avatarFileError } from "@/lib/validations/profile"
import { Avatar } from "./avatar"

export function AvatarUpload({ userId, url, name }: { userId: string; url: string | null; name: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string>()
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function onPick(file: File | undefined) {
    if (!file) return
    const problem = avatarFileError(file)
    if (problem) return setError(problem)
    setError(undefined)

    startTransition(async () => {
      const path = `${userId}/avatar`
      const { error: uploadError } = await createClient()
        .storage.from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type, cacheControl: "3600" })
      if (uploadError) return setError("Não deu pra enviar a foto. Tenta de novo.")
      const result = await setAvatarAction(path)
      if (result.error) return setError(result.error)
      router.refresh()
    })
  }

  return (
    <div className="flex items-end gap-4">
      <Avatar url={url} name={name} size="lg" />
      <div className="pb-1">
        <label
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 border border-ink px-3 font-label text-sm font-bold tracking-[0.08em] uppercase hover:bg-paper-deep has-focus-visible:outline-2 has-focus-visible:outline-stamp"
          aria-busy={pending || undefined}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            id="foto"
            disabled={pending}
            onChange={(e) => onPick(e.target.files?.[0])}
          />
          {pending ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : <Camera aria-hidden className="size-4" />}
          {pending ? "Enviando…" : url ? "Trocar foto" : "Pôr foto"}
        </label>
        <p className="mt-1.5 text-sm text-muted">JPG, PNG ou WebP, até 2 MB.</p>
        {error ? (
          <p role="alert" className="mt-1 text-sm font-medium text-stamp">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  )
}
