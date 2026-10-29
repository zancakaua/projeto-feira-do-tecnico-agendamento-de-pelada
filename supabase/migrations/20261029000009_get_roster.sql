-- Lista da pelada pelo código do link (mesma regra de acesso do get_match).
-- Pago: só quem organiza e a própria pessoa veem. Telefone: só quem organiza.
create or replace function public.get_roster(p_code text) returns jsonb
language sql stable security definer set search_path = '' as $$
  with m as (select id, organizer_id from public.matches where code = p_code),
       me as (select (select auth.uid()) as uid)
  select coalesce(jsonb_agg(jsonb_build_object(
      'user_id', p.user_id,
      'nickname', pr.nickname,
      'full_name', pr.full_name,
      'avatar_url', pr.avatar_url,
      'position', pr.position,
      'level', pr.level,
      'slot', p.slot,
      'status', p.status,
      'team', p.team,
      'is_me', p.user_id = me.uid,
      'paid', case when me.uid in (m.organizer_id, p.user_id) then p.paid end,
      'phone', case when me.uid = m.organizer_id then pp.phone end
    ) order by p.joined_at), '[]'::jsonb)
  from m
  cross join me
  join public.match_participants p on p.match_id = m.id and p.status in ('confirmado', 'espera')
  join public.profiles pr on pr.id = p.user_id
  left join public.profile_private pp on pp.user_id = p.user_id
$$;

revoke execute on function public.get_roster(text) from public;
grant execute on function public.get_roster(text) to anon, authenticated;
