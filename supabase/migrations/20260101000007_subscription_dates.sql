-- =====================================================================
-- Migración: ampliar planes y fechas de suscripción + RPCs para superadmin
-- =====================================================================
-- Cambios:
-- 1. Renombrar check constraint de plan para aceptar 'trial' | 'pro' solamente.
-- 2. Añadir columna subscription_ends_at para fecha de corte del plan activo.
-- 3. Inicializar subscription_ends_at = created_at + 1 año en Trial (default).
-- 4. RPC para hashear códigos de organización (usado por createOrgAction).
-- =====================================================================

-- Quitar constraint antiguo si existe y recrearlo
alter table public.organizations
  drop constraint if exists organizations_plan_check;
alter table public.organizations
  add constraint organizations_plan_check check (plan in ('trial','pro'));

-- Nueva columna para fecha de fin de suscripción
alter table public.organizations
  add column if not exists subscription_ends_at timestamptz;

-- Backfill: si la org está en trial y no tiene trial_ends_at, asignar created_at + 365d
update public.organizations
set trial_ends_at = coalesce(trial_ends_at, created_at + interval '365 days')
where subscription_status in ('trial','active');

-- Si está activa sin subscription_ends_at, asignar created_at + 365d
update public.organizations
set subscription_ends_at = coalesce(subscription_ends_at, created_at + interval '365 days')
where subscription_status = 'active' and subscription_ends_at is null;

-- Comentarios
comment on column public.organizations.subscription_ends_at is
  'Fecha de corte (ISO). Para trial: trial_ends_at. Para pro: subscription_ends_at + 1 año desde el pago.';
comment on column public.organizations.trial_ends_at is
  'Fecha de fin del trial. El owner puede extenderla manualmente o desactivarla.';

-- =====================================================================
-- RPC: crypt_org_code(code text)
-- Hashea el código de seguridad de una organización con bcrypt (bf).
-- Necesario para createOrgAction en el panel del superadmin.
-- SECURITY DEFINER: se ejecuta con privilegios del owner, que tiene
-- acceso a la extensión pgcrypto (crypt() y gen_salt()).
-- =====================================================================
create or replace function public.crypt_org_code(code text)
returns text
language sql
stable
security definer
set search_path = public, extensions
as $$
  select crypt(code, gen_salt('bf', 10));
$$;

comment on function public.crypt_org_code(text) is
  'Hashea el código de seguridad de una organización con bcrypt (bf). Usado por el superadmin al crear nuevas organizaciones.';

-- Dar permisos de ejecución a usuarios autenticados
grant execute on function public.crypt_org_code(text) to authenticated;
grant execute on function public.crypt_org_code(text) to anon;