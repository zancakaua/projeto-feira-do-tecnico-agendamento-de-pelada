-- Busca do Explorar. Roda com as permissões de quem chama (RLS vale): só peladas públicas e abertas.
-- Cidade, bairro e texto ignoram acento e maiúsculas ("sao mateus" acha "São Mateus").
create or replace function public.explore_matches(
  p_city text,
  p_from timestamptz,
  p_to timestamptz default null,
  p_neighborhood text default null,
  p_courts public.court_type[] default null,
  p_level public.skill_level default null,
  p_max_price int default null,
  p_need_goalkeeper boolean default false,
  p_q text default null,
  p_limit int default 60
)
returns table (
  code text, title text, court_type public.court_type, venue_name text, neighborhood text, city text,
  starts_at timestamptz, duration_minutes int, field_slots int, goalkeeper_slots int, price_cents int,
  level public.skill_level, linha int, goleiro int, espera int
)
language sql stable security invoker set search_path = '' as $$
  select m.code, m.title, m.court_type, m.venue_name, m.neighborhood, m.city, m.starts_at, m.duration_minutes,
         m.field_slots, m.goalkeeper_slots, m.price_cents, m.level, c.linha, c.goleiro, c.espera
  from public.matches m
  cross join lateral (
    select count(*) filter (where p.slot = 'linha' and p.status = 'confirmado')::int as linha,
           count(*) filter (where p.slot = 'goleiro' and p.status = 'confirmado')::int as goleiro,
           count(*) filter (where p.status = 'espera')::int as espera
    from public.match_participants p where p.match_id = m.id
  ) c
  where m.is_public and m.status = 'aberta'
    and m.starts_at > greatest(p_from, now())
    and (p_to is null or m.starts_at < p_to)
    and public.f_unaccent(lower(m.city)) = public.f_unaccent(lower(trim(p_city)))
    and (p_neighborhood is null or public.f_unaccent(lower(m.neighborhood)) = public.f_unaccent(lower(trim(p_neighborhood))))
    and (p_courts is null or cardinality(p_courts) = 0 or m.court_type = any (p_courts))
    and (p_level is null or m.level is null or m.level = p_level)
    and (p_max_price is null or m.price_cents <= p_max_price)
    and (not p_need_goalkeeper or m.goalkeeper_slots > c.goleiro)
    and (p_q is null or m.search_text like '%' || public.f_unaccent(lower(trim(p_q))) || '%')
  order by m.starts_at
  limit least(greatest(p_limit, 1), 100)
$$;

grant execute on function public.explore_matches(text, timestamptz, timestamptz, text, public.court_type[], public.skill_level, int, boolean, text, int) to anon, authenticated;
