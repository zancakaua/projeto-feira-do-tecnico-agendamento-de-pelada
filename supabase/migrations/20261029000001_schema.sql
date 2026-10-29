-- Racha: schema base
create extension if not exists unaccent with schema extensions;
create extension if not exists pg_trgm with schema extensions;

create type public.position_pref as enum ('goleiro', 'zagueiro', 'meio', 'atacante', 'tanto_faz');
create type public.skill_level as enum ('iniciante', 'intermediario', 'avancado');
create type public.court_type as enum ('society', 'futsal', 'campo', 'areia');
create type public.slot_kind as enum ('linha', 'goleiro');
create type public.participant_status as enum ('confirmado', 'espera', 'saiu', 'removido');
create type public.match_status as enum ('aberta', 'cancelada');
create type public.notification_kind as enum ('promovido', 'cancelada', 'alterada', 'removido');

-- unaccent não é immutable; o wrapper permite usar em coluna gerada e índice
create or replace function public.f_unaccent(text) returns text
language sql immutable parallel safe strict
set search_path = ''
as $$ select extensions.unaccent('extensions.unaccent'::regdictionary, $1) $$;

create or replace function public.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- Perfis --------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 80),
  nickname text not null check (nickname ~ '^[a-z0-9_]{3,24}$'),
  avatar_url text,
  city text not null default 'Juiz de Fora' check (char_length(city) between 2 and 80),
  position public.position_pref not null default 'tanto_faz',
  level public.skill_level not null default 'intermediario',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index profiles_nickname_key on public.profiles (nickname);
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Dados privados do perfil (só o dono lê; organizador vê via RPC da pelada)
create table public.profile_private (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  phone text check (phone is null or phone ~ '^\+?[0-9]{10,13}$'),
  updated_at timestamptz not null default now()
);
create trigger profile_private_updated_at before update on public.profile_private
  for each row execute function public.set_updated_at();

-- Locais reutilizáveis ------------------------------------------------------
create table public.venues (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null check (char_length(name) between 2 and 80),
  address text not null check (char_length(address) between 5 and 160),
  neighborhood text not null check (char_length(neighborhood) between 2 and 60),
  city text not null check (char_length(city) between 2 and 80),
  created_at timestamptz not null default now()
);
create index venues_owner_idx on public.venues (owner_id);

-- Peladas -------------------------------------------------------------------
create table public.match_series (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  code text not null default substr(replace(gen_random_uuid()::text, '-', ''), 1, 10),
  organizer_id uuid not null references public.profiles (id) on delete cascade,
  series_id uuid references public.match_series (id) on delete set null,
  venue_id uuid references public.venues (id) on delete set null,
  title text not null check (char_length(title) between 3 and 80),
  court_type public.court_type not null,
  venue_name text not null check (char_length(venue_name) between 2 and 80),
  address text not null check (char_length(address) between 5 and 160),
  neighborhood text not null check (char_length(neighborhood) between 2 and 60),
  city text not null check (char_length(city) between 2 and 80),
  starts_at timestamptz not null,
  duration_minutes int not null check (duration_minutes between 30 and 300),
  field_slots int not null check (field_slots between 2 and 40),
  goalkeeper_slots int not null default 0 check (goalkeeper_slots between 0 and 4),
  price_cents int not null default 0 check (price_cents between 0 and 100000),
  pix_key text check (pix_key is null or char_length(pix_key) <= 140),
  level public.skill_level, -- null = qualquer nível
  rules text check (rules is null or char_length(rules) <= 1500),
  is_public boolean not null default true,
  leave_deadline_hours int not null default 2 check (leave_deadline_hours between 0 and 72),
  status public.match_status not null default 'aberta',
  cancel_reason text check (cancel_reason is null or char_length(cancel_reason) <= 300),
  teams_drawn_at timestamptz,
  search_text text generated always as (
    public.f_unaccent(lower(title || ' ' || venue_name || ' ' || neighborhood || ' ' || city))
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index matches_code_key on public.matches (code);
create index matches_explore_idx on public.matches (city, starts_at) where status = 'aberta' and is_public;
create index matches_organizer_idx on public.matches (organizer_id, starts_at);
create index matches_series_idx on public.matches (series_id);
create index matches_search_trgm on public.matches using gin (search_text extensions.gin_trgm_ops);
create trigger matches_updated_at before update on public.matches
  for each row execute function public.set_updated_at();

create table public.match_participants (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  slot public.slot_kind not null,
  status public.participant_status not null,
  paid boolean not null default false,
  team smallint check (team is null or team between 1 and 6),
  joined_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (match_id, user_id)
);
create index match_participants_queue_idx on public.match_participants (match_id, slot, status, joined_at);
create index match_participants_user_idx on public.match_participants (user_id, status);
create trigger match_participants_updated_at before update on public.match_participants
  for each row execute function public.set_updated_at();

-- Notificações --------------------------------------------------------------
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  match_id uuid references public.matches (id) on delete cascade,
  kind public.notification_kind not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index notifications_user_idx on public.notifications (user_id, created_at desc);
