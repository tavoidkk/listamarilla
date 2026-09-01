-- =====================================================================
-- Paginas Amarillas SaaS - Schema inicial multi-tenant
-- Postgres + Row Level Security
-- =====================================================================

-- Extensions
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- =====================================================================
-- 1. ORGANIZATIONS (un edificio = una org)
-- =====================================================================

create table public.organizations (
  id                       uuid primary key default gen_random_uuid(),
  slug                     text UNIQUE NOT NULL check (slug ~ '^[a-z0-9-]+$'),
  name                     text NOT NULL,
  logo_url                 text,
  background_url           text,
  theme                    jsonb not null default '{
    "primary":        "99 85 184",
    "primaryDark":    "78 64 154",
    "primaryLight":   "237 233 248",
    "base":           "223 211 194",
    "surface":        "255 255 255",
    "textPrimary":    "28 24 48",
    "textSecondary":  "74 68 104"
  }'::jsonb,
  plan                     text not null default 'trial' check (plan in ('trial','basic','pro')),
  subscription_status      text not null default 'trial' check (subscription_status in ('trial','active','expired','suspended')),
  trial_ends_at            timestamptz,
  -- Código de seguridad para que vecinos puedan agregar contactos.
  -- Se guarda HASH (nunca en claro). El admin lo define desde el panel.
  security_code_hash       text not null,
  security_code_updated_at timestamptz not null default now(),
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create index organizations_slug_idx on public.organizations (slug);

-- Trigger updated_at
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger organizations_touch
  before update on public.organizations
  for each row execute function public.touch_updated_at();

-- =====================================================================
-- 2. PROFILES (extiende auth.users)
-- =====================================================================

create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  phone      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_touch
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- Auto-crear perfil al crear usuario en auth.users
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- 3. MEMBERSHIPS (vincula un usuario a una org con un rol)
-- =====================================================================

create table public.memberships (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  org_id     uuid not null references public.organizations(id) on delete cascade,
  role       text not null check (role in ('owner','admin','member')),
  status     text not null default 'active' check (status in ('active','invited','suspended')),
  created_at timestamptz not null default now(),
  unique (user_id, org_id)
);

create index memberships_user_idx on public.memberships (user_id);
create index memberships_org_idx on public.memberships (org_id);

-- =====================================================================
-- 4. CATEGORIES (categorías de servicios - personalizables por org)
-- =====================================================================

create table public.categories (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid not null references public.organizations(id) on delete cascade,
  key        text not null,
  label      text not null,
  emoji      text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (org_id, key)
);

create index categories_org_idx on public.categories (org_id);

-- =====================================================================
-- 5. CONTACTS (prestadores de servicios)
-- =====================================================================

create table public.contacts (
  id               uuid primary key default gen_random_uuid(),
  org_id           uuid not null references public.organizations(id) on delete cascade,
  phone            text not null,
  phone_normalized text not null,
  name             text not null,
  category_id      uuid references public.categories(id) on delete set null,
  -- Snapshot del nombre/emoji al momento de agregar (por si luego se renombra/borra la categoría)
  category_label   text,
  category_emoji   text,
  added_by_name    text,
  -- session_id del navegador que agregó (no requiere login)
  added_by_session text not null,
  floor            int,
  apartment        text,
  rating_sum       int not null default 0,
  rating_count     int not null default 0,
  avg_rating       numeric(3,1) not null default 0,
  created_at       timestamptz not null default now(),
  unique (org_id, phone_normalized)
);

create index contacts_org_idx on public.contacts (org_id);
create index contacts_category_idx on public.contacts (category_id);

-- =====================================================================
-- 6. VOTES (calificaciones anónimas por session_id)
-- =====================================================================

create table public.votes (
  id         uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts(id) on delete cascade,
  -- En lugar de user_id, usamos session_id del navegador
  session_id text not null,
  rating     int not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  unique (contact_id, session_id)
);

create index votes_contact_idx on public.votes (contact_id);

-- =====================================================================
-- Helper: obtener rol del usuario actual en una org
-- =====================================================================

create or replace function public.current_membership_role(org uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.memberships
  where org_id = org
    and user_id = auth.uid()
    and status = 'active'
  limit 1;
$$;

-- =====================================================================
-- Comentarios de tablas
-- =====================================================================

comment on table public.organizations is 'Una fila por edificio/condominio (tenant).';
comment on table public.profiles is 'Datos públicos de cada usuario autenticado.';
comment on table public.memberships is 'Relación usuario-org con rol y estado.';
comment on table public.categories is 'Categorías de servicios, personalizables por org.';
comment on table public.contacts is 'Prestadores de servicios agregados por vecinos.';
comment on table public.votes is 'Calificaciones anónimas (sin login, por session_id).';