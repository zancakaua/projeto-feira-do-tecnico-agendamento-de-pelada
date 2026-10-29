import type { Metadata } from "next"
import Link from "next/link"
import { Search, SlidersHorizontal } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import {
  activeFilterCount,
  filtersToParams,
  parseFilters,
  WHEN_OPTIONS,
  type ExploreFilters,
  type When,
} from "@/lib/explore-filters"
import { COURT_TYPES } from "@/lib/validations/match"
import { LEVELS } from "@/lib/validations/profile"
import { COURT_LABEL, LEVEL_LABEL } from "@/lib/labels"
import { ExploreRow } from "@/components/explore/explore-row"
import { FilterGroup, FilterOption } from "@/components/explore/filter-option"
import { buttonClass } from "@/components/ui/button"

export const metadata: Metadata = { title: "Explorar peladas" }

const DEFAULT_CITY = "Juiz de Fora"
const WHEN_LABEL: Record<When, string> = { hoje: "Hoje", amanha: "Amanhã", semana: "Próximos 7 dias", fds: "Fim de semana" }
const PRICES = [
  { value: "", label: "Qualquer" },
  { value: "0", label: "Grátis" },
  { value: "15", label: "Até R$ 15" },
  { value: "25", label: "Até R$ 25" },
]

function withWhen(f: ExploreFilters, when: When | null, defaultCity: string) {
  const qs = filtersToParams({ ...f, when }, defaultCity)
  return qs ? `/explorar?${qs}` : "/explorar"
}

export default async function ExplorePage({ searchParams }: PageProps<"/explorar">) {
  const params = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  let defaultCity = DEFAULT_CITY
  if (user) {
    const { data } = await supabase.from("profiles").select("city").eq("id", user.id).single()
    if (data?.city) defaultCity = data.city
  }

  const f = parseFilters(params, { defaultCity })
  const [{ data: matches, error }, { data: hoods }] = await Promise.all([
    supabase.rpc("explore_matches", {
      p_city: f.city,
      p_from: f.from,
      p_to: f.to ?? undefined,
      p_neighborhood: f.neighborhood ?? undefined,
      p_courts: f.courts.length ? f.courts : undefined,
      p_level: f.level ?? undefined,
      p_max_price: f.maxPrice ?? undefined,
      p_need_goalkeeper: f.needGoalkeeper,
      p_q: f.q ?? undefined,
    }),
    supabase
      .from("matches")
      .select("neighborhood")
      .eq("is_public", true)
      .eq("status", "aberta")
      .ilike("city", f.city)
      .gt("starts_at", new Date().toISOString()),
  ])
  const neighborhoods = [...new Set((hoods ?? []).map((h) => h.neighborhood))].sort((a, b) => a.localeCompare(b, "pt-BR"))
  const active = activeFilterCount(f)
  const list = matches ?? []

  return (
    <>
      <div className="border-b-[3px] border-double border-ink pb-4">
        <h1 className="font-label text-3xl leading-none font-bold">Explorar</h1>
        <p className="mt-2 text-muted">
          Peladas abertas em <span className="font-semibold text-ink">{f.city}</span>
        </p>
      </div>

      <form action="/explorar" role="search" className="mt-5 flex">
        {/* Mantém os filtros ao buscar por texto */}
        {[...new URLSearchParams(filtersToParams({ ...f, q: null }, defaultCity)).entries()].map(([k, v], i) => (
          <input key={`${k}-${i}`} type="hidden" name={k} value={v} />
        ))}
        <label className="flex flex-1 items-center gap-2 border border-ink bg-paper px-3 focus-within:outline-2 focus-within:outline-stamp">
          <Search aria-hidden className="size-5 text-muted" />
          <span className="sr-only">Buscar pelada, local ou bairro</span>
          <input
            name="q"
            type="search"
            defaultValue={f.q ?? ""}
            placeholder="Pelada, local ou bairro"
            className="typed min-h-12 w-full bg-transparent text-base outline-none placeholder:font-normal placeholder:text-muted"
          />
        </label>
        <button type="submit" className={buttonClass("ink", "min-h-12 px-4 text-base")}>
          Buscar
        </button>
      </form>

      <nav aria-label="Quando" className="-mx-4 mt-4 overflow-x-auto px-4">
        <ul className="flex w-max gap-2">
          {[null, ...WHEN_OPTIONS].map((w) => {
            const current = f.when === w
            return (
              <li key={w ?? "todas"}>
                <Link
                  href={withWhen(f, w, defaultCity)}
                  aria-current={current ? "true" : undefined}
                  className={`inline-flex min-h-11 items-center border px-3 font-label text-[0.95rem] font-bold whitespace-nowrap no-underline ${
                    current ? "border-ink bg-ink text-paper" : "border-ink text-ink hover:bg-paper-deep"
                  }`}
                >
                  {w ? WHEN_LABEL[w] : "Qualquer dia"}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <details className="group mt-4 border border-ink">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-3 font-label text-[1.05rem] font-bold">
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal aria-hidden className="size-5" />
            Mais filtros
            {active ? <span className="bg-stamp px-1.5 font-sans text-sm text-white">{active}</span> : null}
          </span>
          <span aria-hidden className="typed text-xl group-open:rotate-45">+</span>
        </summary>
        <form action="/explorar" className="flex flex-col gap-5 border-t border-ink p-3">
          {f.q ? <input type="hidden" name="q" value={f.q} /> : null}
          {f.when ? <input type="hidden" name="quando" value={f.when} /> : null}
          <div className="grid grid-cols-2 gap-3">
            <label className="block border border-ink px-3 pt-2 pb-1.5 focus-within:outline-2 focus-within:outline-stamp">
              <span className="label-caps block text-muted">Cidade</span>
              <input name="cidade" defaultValue={f.city} className="typed w-full bg-transparent py-1 text-base outline-none" />
            </label>
            <label className="block border border-ink px-3 pt-2 pb-1.5 focus-within:outline-2 focus-within:outline-stamp">
              <span className="label-caps block text-muted">Bairro</span>
              <input
                name="bairro"
                list="bairros"
                defaultValue={f.neighborhood ?? ""}
                placeholder="Todos"
                className="typed w-full bg-transparent py-1 text-base outline-none placeholder:font-normal placeholder:text-muted"
              />
              <datalist id="bairros">
                {neighborhoods.map((n) => (
                  <option key={n} value={n} />
                ))}
              </datalist>
            </label>
          </div>
          <FilterGroup legend="Quadra" cols="grid-cols-2 sm:grid-cols-4">
            {COURT_TYPES.map((c) => (
              <FilterOption key={c} type="checkbox" name="quadra" value={c} label={COURT_LABEL[c]} defaultChecked={f.courts.includes(c)} />
            ))}
          </FilterGroup>
          <FilterGroup legend="Nível" cols="grid-cols-2 sm:grid-cols-4">
            <FilterOption type="radio" name="nivel" value="" label="Qualquer" defaultChecked={!f.level} />
            {LEVELS.map((l) => (
              <FilterOption key={l} type="radio" name="nivel" value={l} label={LEVEL_LABEL[l]} defaultChecked={f.level === l} />
            ))}
          </FilterGroup>
          <FilterGroup legend="Valor por pessoa" cols="grid-cols-2 sm:grid-cols-4">
            {PRICES.map((p) => (
              <FilterOption
                key={p.value || "any"}
                type="radio"
                name="preco"
                value={p.value}
                label={p.label}
                defaultChecked={(f.maxPrice === null ? "" : String(f.maxPrice / 100)) === p.value}
              />
            ))}
          </FilterGroup>
          <FilterGroup legend="Goleiro" cols="grid-cols-1">
            <FilterOption type="checkbox" name="goleiro" value="1" label="Só com vaga de goleiro" defaultChecked={f.needGoalkeeper} />
          </FilterGroup>
          <div className="flex gap-2">
            <button type="submit" className={buttonClass("primary", "flex-1")}>
              Aplicar
            </button>
            <Link href="/explorar" className={buttonClass("outline")}>
              Limpar
            </Link>
          </div>
        </form>
      </details>

      <section aria-live="polite" className="mt-6">
        <h2 className="label-caps flex items-baseline justify-between border-b-2 border-ink pb-1.5">
          {f.q ? `Resultado pra “${f.q}”` : "Próximas"}
          <span className="typed text-base tracking-normal">{list.length}</span>
        </h2>
        {error ? (
          <p className="py-6 text-stamp">Não deu pra carregar as peladas agora. Atualiza a página.</p>
        ) : list.length ? (
          list.map((m) => <ExploreRow key={m.code} m={m} />)
        ) : (
          <div className="py-8">
            <p className="font-label text-xl font-bold">Nenhuma pelada com esses filtros.</p>
            <p className="mt-1 text-muted">Tenta outro dia ou tira algum filtro. Ou marca a sua.</p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              {active || f.q ? (
                <Link href="/explorar" className={buttonClass("outline")}>
                  Limpar filtros
                </Link>
              ) : null}
              <Link href="/pelada/nova" className={buttonClass("primary")}>
                Criar pelada
              </Link>
            </div>
          </div>
        )}
      </section>
    </>
  )
}
