import { Wordmark } from "@/components/shell/wordmark"

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <header className="bg-ink px-4 py-4">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <Wordmark />
        </div>
      </header>
      <main className="mx-auto w-full max-w-md flex-1 px-4 pt-8 pb-16">{children}</main>
    </>
  )
}
