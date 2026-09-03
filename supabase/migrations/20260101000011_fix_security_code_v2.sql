-- =====================================================================
-- fix: set_security_code v2 — bypass directo para service_role
-- + recrear has_org_role para asegurar que acepta condo_admin
-- =====================================================================
-- Problema residual de 0009: set_security_code usaba has_org_role()
-- que retorna false cuando auth.uid() es NULL (service_role).
-- Cuando el action hace fallback con service_role client, siempre falla.
-- =====================================================================

-- 1. has_org_role: recrear para asegurar que acepta condo_admin
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
      and role = 'condo_admin'
      and case min_role
            when 'member' then true
            when 'admin'  then true
            when 'owner'  then false
            else false
          end
  );
$$;

-- 2. set_security_code: bypass directo para service_role (auth.uid() IS NULL)
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
  v_caller uuid := auth.uid();
  v_is_platform boolean := public.is_platform_owner();
  v_allowed boolean := false;
begin
  if length(trim(p_code)) < 4 then
    raise exception 'El código debe tener al menos 4 caracteres' using errcode = 'P0400';
  end if;

  -- Autorización:
  --   a) service_role (auth.uid() IS NULL) → siempre permitido
  --   b) platform_owner → siempre permitido
  --   c) condo_admin de esta org → permitido
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
    raise exception 'Sin permisos para cambiar el código' using errcode = 'P0403';
  end if;

  update public.organizations
  set
    security_code_hash = crypt(p_code, gen_salt('bf', 10)),
    security_code_updated_at = now()
    where id = p_org_id;
end $$;

grant execute on function public.set_security_code(uuid, text) to authenticated, service_role;

-- 3. org_floor_config policy: recrear con bypass service_role explícito
drop policy if exists "org_floor_config_admin_all" on public.org_floor_config;

create policy "org_floor_config_admin_all"
  on public.org_floor_config for all
  using (
    public.is_platform_owner()
    OR auth.uid() IS NULL
    OR public.has_org_role(org_id, 'admin')
  )
  with check (
    public.is_platform_owner()
    OR auth.uid() IS NULL
    OR public.has_org_role(org_id, 'admin')
  );
