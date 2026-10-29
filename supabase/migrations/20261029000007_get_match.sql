-- Abre a pelada pelo código do link. O código (10 caracteres aleatórios) funciona como convite:
-- quem tem o link vê a pelada, mesmo privada. Sem o código, a privada não aparece em lugar nenhum.
create or replace function public.get_match(p_code text) returns jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'match', to_jsonb(m) - 'search_text',
    'organizer', jsonb_build_object('nickname', o.nickname, 'full_name', o.full_name, 'avatar_url', o.avatar_url),
    'counts', jsonb_build_object(
      'linha', (select count(*) from public.match_participants where match_id = m.id and slot = 'linha' and status = 'confirmado'),
      'goleiro', (select count(*) from public.match_participants where match_id = m.id and slot = 'goleiro' and status = 'confirmado'),
      'espera', (select count(*) from public.match_participants where match_id = m.id and status = 'espera')
    ),
    'viewer', (select jsonb_build_object('status', mp.status, 'slot', mp.slot, 'paid', mp.paid)
               from public.match_participants mp where mp.match_id = m.id and mp.user_id = (select auth.uid())),
    'is_organizer', m.organizer_id = (select auth.uid())
  )
  from public.matches m
  join public.profiles o on o.id = m.organizer_id
  where m.code = p_code
$$;

revoke execute on function public.get_match(text) from public;
grant execute on function public.get_match(text) to anon, authenticated;
