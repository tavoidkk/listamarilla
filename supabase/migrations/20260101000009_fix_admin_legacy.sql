-- =====================================================================
-- fix: set_security_code + org_floor_config RLS para el rol condo_admin
-- =====================================================================
-- Problem 1: set_security_code (0004) valida `role in ('admin','owner')`,
--   pero 0008 cambió el constraint a solo 'condo_admin' → siempre falla P0403.
-- Problem 2: org_floor_config_admin_all (0006) llama a has_org_role(org_id,'admin'),
--   que fue reemplazada en 0008. Para platform_owner sin membership no pasa RLS → 42501.
-- =====================================================================

-- 1. set_security_code: usar has_org_role (que sí entiende condo_admin) + bypass platform_owner
create or replace function public.set_security_code(
  p_org_id uuid,
  p_code text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_is_platform_owner boolean := public.is_platform_owner();
begin
  if length(trim(p_code)) < 4 then
    raise exception 'El código debe tener al menos 4 caracteres' using errcode = 'P0400';
  end if;

  if not v_is_platform_owner and not public.has_org_role(p_org_id, 'admin') then
    raise exception 'Sin permisos para cambiar el código' using errcode = 'P0403';
  end if;

  update public.organizations
  set
    security_code_hash = crypt(p_code, gen_salt('bf', 10)),
    security_code_updated_at = now()
  where id = p_org_id;
end $$;

grant execute on function public.set_security_code(uuid, text) to authenticated, service_role;

-- 2. org_floor_config: recrear policy con bypass para platform_owner
drop policy if exists "org_floor_config_admin_all" on public.org_floor_config;

create policy "org_floor_config_admin_all"
  on public.org_floor_config for all
  using (
    public.is_platform_owner()
    OR public.has_org_role(org_id, 'admin')
  )
  with check (
    public.is_platform_owner()
    OR public.has_org_role(org_id, 'admin')
  );
