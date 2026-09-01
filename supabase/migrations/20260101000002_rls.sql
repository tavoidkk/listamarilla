-- =====================================================================
-- Row Level Security - multi-tenant
-- =====================================================================

-- Activar RLS en todas las tablas
alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.memberships enable row level security;
alter table public.categories enable row level security;
alter table public.contacts enable row level security;
alter table public.votes enable row level security;

-- =====================================================================
-- Helper: ¿es el usuario platform_owner (Owner global)?
-- Se setea vía custom claim en JWT (Supabase dashboard).
-- Como fallback leemos desde app_metadata.
-- =====================================================================

create or replace function public.is_platform_owner()
returns boolean
language sql
stable
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'is_platform_owner')::boolean,
    false
  );
$$;

-- =====================================================================
-- Helper: ¿el usuario actual tiene rol >= X en la org Y?
-- =====================================================================

create or replace function public.has_org_role(org uuid, min_role text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.memberships
    where org_id = org
      and user_id = auth.uid()
      and status = 'active'
      and case min_role
            when 'member' then role in ('member','admin','owner')
            when 'admin'  then role in ('admin','owner')
            when 'owner'  then role = 'owner'
            else false
          end
  );
$$;

-- =====================================================================
-- ORGANIZATIONS
-- =====================================================================

-- Lectura pública de columnas "no sensibles" (name, slug, logo, theme, status)
-- para que el portal de vecinos pueda cargar branding sin login.
create policy "organizations_public_read"
  on public.organizations for select
  using (
    subscription_status in ('trial','active')
  );

-- Lectura completa para miembros
create policy "organizations_member_read"
  on public.organizations for select
  using (public.has_org_role(id, 'member'));

-- Update solo admin+
create policy "organizations_admin_update"
  on public.organizations for update
  using (public.has_org_role(id, 'admin'))
  with check (public.has_org_role(id, 'admin'));

-- Insert: solo service_role (Owner crea la org desde superadmin)
-- No policy de insert con auth → solo service_role puede crear.

-- =====================================================================
-- PROFILES
-- =====================================================================

-- Lectura: un usuario puede leer su propio perfil y los perfiles de miembros de sus orgs
create policy "profiles_self_read"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_same_org_read"
  on public.profiles for select
  using (
    exists (
      select 1
      from public.memberships m1
      join public.memberships m2 on m1.org_id = m2.org_id
      where m1.user_id = auth.uid()
        and m1.status = 'active'
        and m2.user_id = profiles.id
    )
  );

-- Update solo de sí mismo
create policy "profiles_self_update"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- =====================================================================
-- MEMBERSHIPS
-- =====================================================================

create policy "memberships_self_read"
  on public.memberships for select
  using (user_id = auth.uid());

create policy "memberships_admin_read"
  on public.memberships for select
  using (public.has_org_role(org_id, 'admin'));

create policy "memberships_admin_write"
  on public.memberships for all
  using (public.has_org_role(org_id, 'admin'))
  with check (public.has_org_role(org_id, 'admin'));

-- =====================================================================
-- CATEGORIES
-- =====================================================================

-- Lectura pública para portal de vecinos (sin auth)
create policy "categories_public_read"
  on public.categories for select
  using (
    exists (
      select 1 from public.organizations o
      where o.id = categories.org_id
        and o.subscription_status in ('trial','active')
    )
  );

-- Lectura admin (ya cubierta arriba por la policy public)
-- Insert: admin+
create policy "categories_admin_write"
  on public.categories for all
  using (public.has_org_role(org_id, 'admin'))
  with check (public.has_org_role(org_id, 'admin'));

-- =====================================================================
-- CONTACTS
-- =====================================================================

-- Lectura pública (sin auth) para vecinos
create policy "contacts_public_read"
  on public.contacts for select
  using (
    exists (
      select 1 from public.organizations o
      where o.id = contacts.org_id
        and o.subscription_status in ('trial','active')
    )
  );

-- Inserción: portal de vecinos sin auth, validado vía RPC.
-- Insert directo requiere auth.uid() presente → se delega a RPC con SECURITY DEFINER.
-- Por ahora permitimos insert directo a usuarios autenticados (admins).
create policy "contacts_admin_insert"
  on public.contacts for insert
  with check (public.has_org_role(org_id, 'admin'));

create policy "contacts_admin_update"
  on public.contacts for update
  using (public.has_org_role(org_id, 'admin'))
  with check (public.has_org_role(org_id, 'admin'));

create policy "contacts_admin_delete"
  on public.contacts for delete
  using (public.has_org_role(org_id, 'admin'));

-- =====================================================================
-- VOTES
-- =====================================================================

-- Lectura de agregados ya viene vía contacts (rating_sum/count).
-- Lectura individual: el session_id puede ver sus propios votos.
create policy "votes_session_read"
  on public.votes for select
  using (
    -- session_id desde header x-session-id (vía set_config)
    session_id = current_setting('request.headers', true)::json->>'x-session-id'
  );

-- Inserción: solo vía RPC con SECURITY DEFINER (validación atómica)
-- Por defecto nadie inserta directo.

-- =====================================================================
-- PLATFORM OWNER (Owner global - bypass)
-- =====================================================================
-- El service_role key ya bypasea RLS. Las policies anteriores NO bloquean
-- a service_role. Para Owner vía anon key con custom claim JWT, usamos
-- is_platform_owner() cuando sea necesario.