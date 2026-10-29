-- Racha: regras da lista no banco (vagas, fila, notificações)

-- Perfil criado junto com a conta -------------------------------------------
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  v_name text := coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
                          nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
                          split_part(new.email, '@', 1));
  v_base text := left(regexp_replace(lower(public.f_unaccent(split_part(coalesce(new.email, 'jogador'), '@', 1))), '[^a-z0-9_]', '', 'g'), 18);
  v_nick text;
begin
  if char_length(v_base) < 3 then v_base := 'jogador'; end if;
  v_nick := v_base;
  while exists (select 1 from public.profiles where nickname = v_nick) loop
    v_nick := v_base || '_' || substr(md5(random()::text), 1, 4);
  end loop;

  insert into public.profiles (id, full_name, nickname, avatar_url)
  values (new.id, left(v_name, 80), v_nick, new.raw_user_meta_data ->> 'avatar_url');
  insert into public.profile_private (user_id) values (new.id);
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Utilitários internos ------------------------------------------------------
create or replace function public.notify(p_user uuid, p_match uuid, p_kind public.notification_kind, p_body text)
returns void language sql security definer set search_path = '' as $$
  insert into public.notifications (user_id, match_id, kind, body) values (p_user, p_match, p_kind, p_body);
$$;

create or replace function public.slot_capacity(p_match uuid, p_slot public.slot_kind) returns int
language sql stable security definer set search_path = '' as $$
  select case when p_slot = 'linha' then field_slots else goalkeeper_slots end
  from public.matches where id = p_match;
$$;

-- Sobe quem está na espera enquanto houver vaga no slot
create or replace function public.promote_next(p_match uuid, p_slot public.slot_kind) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_cap int := public.slot_capacity(p_match, p_slot);
  v_title text;
  v_next record;
begin
  select title into v_title from public.matches where id = p_match and status = 'aberta';
  if not found then return; end if;

  loop
    exit when (select count(*) from public.match_participants
               where match_id = p_match and slot = p_slot and status = 'confirmado') >= v_cap;
    select id, user_id into v_next from public.match_participants
      where match_id = p_match and slot = p_slot and status = 'espera'
      order by joined_at limit 1 for update skip locked;
    exit when not found;
    update public.match_participants set status = 'confirmado' where id = v_next.id;
    perform public.notify(v_next.user_id, p_match, 'promovido',
      'Abriu vaga e você saiu da espera: tá confirmado em "' || v_title || '".');
  end loop;
end $$;

create or replace function public.assert_organizer(p_match uuid) returns public.matches
language plpgsql security definer set search_path = '' as $$
declare m public.matches;
begin
  select * into m from public.matches where id = p_match for update;
  if not found then raise exception 'Pelada não encontrada.' using errcode = 'P0002'; end if;
  if m.organizer_id is distinct from auth.uid() then
    raise exception 'Só quem organiza pode fazer isso.' using errcode = '42501';
  end if;
  return m;
end $$;

-- Participação --------------------------------------------------------------
create or replace function public.join_match(p_code text, p_slot public.slot_kind default 'linha')
returns public.participant_status
language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
  m public.matches;
  p public.match_participants;
  v_taken int;
  v_status public.participant_status;
begin
  if v_uid is null then raise exception 'Entre na sua conta para confirmar presença.' using errcode = '28000'; end if;

  select * into m from public.matches where code = p_code for update;
  if not found then raise exception 'Pelada não encontrada.' using errcode = 'P0002'; end if;
  if m.status <> 'aberta' then raise exception 'Essa pelada foi cancelada.' using errcode = 'P0001'; end if;
  if m.starts_at <= now() then raise exception 'Essa pelada já começou.' using errcode = 'P0001'; end if;
  if p_slot = 'goleiro' and m.goalkeeper_slots = 0 then
    raise exception 'Essa pelada não tem vaga separada de goleiro.' using errcode = 'P0001';
  end if;

  select * into p from public.match_participants where match_id = m.id and user_id = v_uid for update;
  if found then
    if p.status = 'removido' then
      raise exception 'O organizador tirou você dessa lista.' using errcode = '42501';
    end if;
    if p.status in ('confirmado', 'espera') and p.slot = p_slot then return p.status; end if;
  end if;

  select count(*) into v_taken from public.match_participants
    where match_id = m.id and slot = p_slot and status = 'confirmado' and user_id <> v_uid;
  v_status := case when v_taken < public.slot_capacity(m.id, p_slot) then 'confirmado' else 'espera' end;

  if p.id is not null then
    update public.match_participants
      set slot = p_slot, status = v_status, team = null, joined_at = now()
      where id = p.id;
    -- trocou de linha para goleiro (ou vice-versa) e liberou a vaga antiga
    if p.status = 'confirmado' and p.slot <> p_slot then
      perform public.promote_next(m.id, p.slot);
    end if;
  else
    insert into public.match_participants (match_id, user_id, slot, status)
      values (m.id, v_uid, p_slot, v_status);
  end if;
  return v_status;
end $$;

create or replace function public.leave_match(p_code text) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
  m public.matches;
  p public.match_participants;
begin
  if v_uid is null then raise exception 'Entre na sua conta.' using errcode = '28000'; end if;
  select * into m from public.matches where code = p_code for update;
  if not found then raise exception 'Pelada não encontrada.' using errcode = 'P0002'; end if;

  select * into p from public.match_participants where match_id = m.id and user_id = v_uid for update;
  if not found or p.status not in ('confirmado', 'espera') then
    raise exception 'Você não está nessa lista.' using errcode = 'P0001';
  end if;
  if p.status = 'confirmado' and m.status = 'aberta'
     and now() > m.starts_at - make_interval(hours => m.leave_deadline_hours) then
    raise exception 'Passou do prazo pra desistir (até % h antes). Fala com quem organiza.', m.leave_deadline_hours
      using errcode = 'P0001';
  end if;

  update public.match_participants set status = 'saiu', team = null where id = p.id;
  if p.status = 'confirmado' then perform public.promote_next(m.id, p.slot); end if;
end $$;

-- Ações do organizador ------------------------------------------------------
create or replace function public.remove_participant(p_match uuid, p_user uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare
  m public.matches := public.assert_organizer(p_match);
  p public.match_participants;
begin
  select * into p from public.match_participants where match_id = m.id and user_id = p_user for update;
  if not found or p.status not in ('confirmado', 'espera') then
    raise exception 'Essa pessoa não está na lista.' using errcode = 'P0001';
  end if;
  update public.match_participants set status = 'removido', team = null where id = p.id;
  if p_user <> m.organizer_id then
    perform public.notify(p_user, m.id, 'removido', 'Quem organiza tirou você da lista de "' || m.title || '".');
  end if;
  if p.status = 'confirmado' then perform public.promote_next(m.id, p.slot); end if;
end $$;

create or replace function public.set_paid(p_match uuid, p_user uuid, p_paid boolean) returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform public.assert_organizer(p_match);
  update public.match_participants set paid = p_paid
    where match_id = p_match and user_id = p_user and status = 'confirmado';
  if not found then raise exception 'Só dá pra marcar pagamento de quem está confirmado.' using errcode = 'P0001'; end if;
end $$;

create or replace function public.cancel_match(p_match uuid, p_reason text default null) returns void
language plpgsql security definer set search_path = '' as $$
declare m public.matches := public.assert_organizer(p_match);
begin
  if m.status = 'cancelada' then return; end if;
  update public.matches set status = 'cancelada', cancel_reason = nullif(trim(p_reason), '') where id = m.id;
end $$;

-- p_assign: [{"user_id": "...", "team": 1}, ...]
create or replace function public.save_teams(p_match uuid, p_assign jsonb) returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform public.assert_organizer(p_match);
  update public.match_participants set team = null where match_id = p_match;
  update public.match_participants mp set team = (a ->> 'team')::smallint
    from jsonb_array_elements(p_assign) a
    where mp.match_id = p_match and mp.user_id = (a ->> 'user_id')::uuid and mp.status = 'confirmado';
  update public.matches set teams_drawn_at = now() where id = p_match;
end $$;

-- Gatilhos de pelada --------------------------------------------------------
create or replace function public.matches_guard() returns trigger
language plpgsql set search_path = '' as $$
declare v_line int; v_gk int;
begin
  if new.code <> old.code or new.organizer_id <> old.organizer_id then
    raise exception 'Esse campo não pode ser alterado.' using errcode = '42501';
  end if;
  if old.status = 'cancelada' and new.status = 'aberta' then
    raise exception 'Pelada cancelada não volta. Duplique para marcar de novo.' using errcode = 'P0001';
  end if;
  select count(*) filter (where slot = 'linha'), count(*) filter (where slot = 'goleiro')
    into v_line, v_gk
    from public.match_participants where match_id = new.id and status = 'confirmado';
  if new.field_slots < v_line or new.goalkeeper_slots < v_gk then
    raise exception 'Já tem mais gente confirmada do que as vagas novas. Tire alguém da lista antes.'
      using errcode = 'P0001';
  end if;
  return new;
end $$;

create trigger matches_guard before update on public.matches
  for each row execute function public.matches_guard();

create or replace function public.matches_after_update() returns trigger
language plpgsql security definer set search_path = '' as $$
declare r record;
begin
  if old.status = 'aberta' and new.status = 'cancelada' then
    for r in select user_id from public.match_participants
             where match_id = new.id and status in ('confirmado', 'espera') and user_id <> new.organizer_id loop
      perform public.notify(r.user_id, new.id, 'cancelada',
        '"' || new.title || '" foi cancelada.' || coalesce(' Motivo: ' || new.cancel_reason, ''));
    end loop;
  elsif new.status = 'aberta' and (
        new.starts_at <> old.starts_at or new.duration_minutes <> old.duration_minutes
     or new.venue_name <> old.venue_name or new.address <> old.address or new.price_cents <> old.price_cents) then
    for r in select user_id from public.match_participants
             where match_id = new.id and status in ('confirmado', 'espera') and user_id <> new.organizer_id loop
      perform public.notify(r.user_id, new.id, 'alterada',
        'Mudou alguma coisa em "' || new.title || '" (horário, local ou valor). Confere antes de ir.');
    end loop;
  end if;

  if new.status = 'aberta' then
    if new.field_slots > old.field_slots then perform public.promote_next(new.id, 'linha'); end if;
    if new.goalkeeper_slots > old.goalkeeper_slots then perform public.promote_next(new.id, 'goleiro'); end if;
  end if;
  return null;
end $$;

create trigger matches_after_update after update on public.matches
  for each row execute function public.matches_after_update();

-- Funções internas não ficam expostas na API
revoke execute on function public.notify(uuid, uuid, public.notification_kind, text) from public, anon, authenticated;
revoke execute on function public.promote_next(uuid, public.slot_kind) from public, anon, authenticated;
revoke execute on function public.assert_organizer(uuid) from public, anon, authenticated;
revoke execute on function public.slot_capacity(uuid, public.slot_kind) from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.join_match(text, public.slot_kind) from public, anon;
revoke execute on function public.leave_match(text) from public, anon;
revoke execute on function public.remove_participant(uuid, uuid) from public, anon;
revoke execute on function public.set_paid(uuid, uuid, boolean) from public, anon;
revoke execute on function public.cancel_match(uuid, text) from public, anon;
revoke execute on function public.save_teams(uuid, jsonb) from public, anon;
grant execute on function public.join_match(text, public.slot_kind) to authenticated;
grant execute on function public.leave_match(text) to authenticated;
grant execute on function public.remove_participant(uuid, uuid) to authenticated;
grant execute on function public.set_paid(uuid, uuid, boolean) to authenticated;
grant execute on function public.cancel_match(uuid, text) to authenticated;
grant execute on function public.save_teams(uuid, jsonb) to authenticated;
