-- Racha: Row Level Security em todas as tabelas
alter table public.profiles enable row level security;
alter table public.profile_private enable row level security;
alter table public.venues enable row level security;
alter table public.match_series enable row level security;
alter table public.matches enable row level security;
alter table public.match_participants enable row level security;
alter table public.notifications enable row level security;

-- Perfis são públicos (página de jogador); só o dono edita
create policy "perfis visíveis" on public.profiles for select to anon, authenticated using (true);
create policy "dono edita perfil" on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "dono lê dados privados" on public.profile_private for select to authenticated
  using (user_id = (select auth.uid()));
create policy "dono edita dados privados" on public.profile_private for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy "dono gerencia locais" on public.venues for all to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));

create policy "organizador lê séries" on public.match_series for select to authenticated
  using (organizer_id = (select auth.uid()));
create policy "organizador cria séries" on public.match_series for insert to authenticated
  with check (organizer_id = (select auth.uid()));

-- Pelada pública: todo mundo vê. Privada: organizador e quem está na lista
-- (quem só tem o link acessa pela função get_match, que exige o código).
create or replace function public.is_in_match(p_match uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.match_participants
                 where match_id = p_match and user_id = (select auth.uid()));
$$;
revoke execute on function public.is_in_match(uuid) from public, anon;
grant execute on function public.is_in_match(uuid) to authenticated;

create policy "peladas visíveis" on public.matches for select to anon, authenticated
  using (is_public or organizer_id = (select auth.uid()) or public.is_in_match(id));
create policy "organizador cria pelada" on public.matches for insert to authenticated
  with check (organizer_id = (select auth.uid()));
create policy "organizador edita pelada" on public.matches for update to authenticated
  using (organizer_id = (select auth.uid())) with check (organizer_id = (select auth.uid()));

-- Lista: leitura segue a pelada; escrita só pelas funções (join/leave/...)
create policy "lista visível" on public.match_participants for select to anon, authenticated
  using (
    user_id = (select auth.uid())
    or exists (select 1 from public.matches m
               where m.id = match_id and (m.is_public or m.organizer_id = (select auth.uid())))
  );

create policy "dono lê avisos" on public.notifications for select to authenticated
  using (user_id = (select auth.uid()));
create policy "dono marca aviso como lido" on public.notifications for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- Privilégios de coluna: o cliente só mexe no que faz sentido
revoke insert, update, delete on public.match_participants from anon, authenticated;
revoke insert, delete on public.notifications from anon, authenticated;
revoke update on public.notifications from anon, authenticated;
grant update (read_at) on public.notifications to authenticated;
revoke insert, delete on public.profiles from anon, authenticated;
revoke update on public.profiles from anon;
revoke update on public.profiles from authenticated;
grant update (full_name, nickname, avatar_url, city, position, level) on public.profiles to authenticated;
revoke all on public.profile_private from anon;
revoke insert, delete on public.profile_private from authenticated;
revoke update on public.profile_private from authenticated;
grant update (phone) on public.profile_private to authenticated;
revoke all on public.venues, public.match_series from anon;
revoke insert, update, delete on public.matches from anon;
revoke delete on public.matches from authenticated;

-- Fotos de perfil
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "avatar: dono envia" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "avatar: dono troca" on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "avatar: dono apaga" on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
