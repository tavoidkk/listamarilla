-- =====================================================================
-- feat: guardar el código de seguridad en claro para consultarlo después
-- =====================================================================
-- 1. Agregar security_code_plain a organizations (el admin lo consulta).
-- 2. Restringir lectura directa de esa columna a anon/authenticated
--    (solo se accede vía el RPC SECURITY DEFINER get_org_security_code).
-- 3. Actualizar update_org_security_code para guardar también el plain.
-- 4. Crear RPC get_org_security_code para que el admin lo lea.
-- =====================================================================

-- 1. Nueva columna (nullable hasta que se defina un código)
alter table public.organizations
  add column if not exists security_code_plain text;

comment on column public.organizations.security_code_plain is
  'Código en claro para que el admin lo consulta. No expuesto vía RLS.';

-- 2. Restringir lectura directa de la columna sensible.
--    (RLS permite la fila, pero esta columna solo se lee vía RPC SECURITY DEFINER)
revoke select (security_code_plain)
  on public.organizations from anon, authenticated;

-- 3. update_org_security_code: guardar también el código en claro
drop function if exists public.update_org_security_code(uuid, text) cascade;

create function public.update_org_security_code(
  p_org_id uuid,
  p_code text
)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_caller uuid := auth.uid();
  v_is_platform boolean := public.is_platform_owner();
  v_allowed boolean := false;
begin
  if length(trim(p_code)) < 4 then
    raise exception 'El código debe tener al menos 4 caracteres'
      using errcode = 'P0400';
  end if;

  if v_caller is null then
    v_allowed := true;
  elsif v_is_platform then
    v_allowed := true;
  else
    select exists (
      select 1
      from public.memberships
      where org_id = p_org_id
        and user_id = v_caller
        and status = 'active'
        and role = 'condo_admin'
    ) into v_allowed;
  end if;

  if not v_allowed then
    raise exception 'Sin permisos para cambiar el código'
      using errcode = 'P0403';
  end if;

  update public.organizations
  set
    security_code_hash = crypt(p_code, gen_salt('bf', 10)),
    security_code_plain = p_code,
    security_code_updated_at = now()
  where id = p_org_id;
end $$;

grant execute on function public.update_org_security_code(uuid, text)
  to authenticated, service_role, anon;

-- 4. RPC para que el admin lea el código actual
create or replace function public.get_org_security_code(
  p_org_id uuid
)
returns text
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_caller uuid := auth.uid();
  v_code text;
begin
  if v_caller is null then
    raise exception 'No autenticado'
      using errcode = 'P0403';
  end if;

  if not public.is_platform_owner()
     and not exists (
       select 1
       from public.memberships
       where org_id = p_org_id
         and user_id = v_caller
         and status = 'active'
         and role = 'condo_admin'
     ) then
    raise exception 'Sin permisos para ver el código'
      using errcode = 'P0403';
  end if;

  select security_code_plain into v_code
  from public.organizations
  where id = p_org_id;

  return v_code;
end $$;

grant execute on function public.get_org_security_code(p_org_id uuid)
  to authenticated, service_role;

notify pgrst, 'reload schema';
