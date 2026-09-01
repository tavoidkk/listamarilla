-- =====================================================================
-- RPC set_security_code
-- Actualiza el hash del código de seguridad de una organización.
-- Valida que el caller sea admin/owner de la org.
-- =====================================================================

create or replace function public.set_security_code(
  p_org_id uuid,
  p_code text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Validar longitud mínima
  if length(trim(p_code)) < 4 then
    raise exception 'El código debe tener al menos 4 caracteres' using errcode = 'P0400';
  end if;

  -- Validar que caller es admin/owner (bypasea RLS via SECURITY DEFINER)
  if not exists (
    select 1 from public.memberships
    where org_id = p_org_id
      and user_id = auth.uid()
      and status = 'active'
      and role in ('admin','owner')
  ) then
    raise exception 'Sin permisos para cambiar el código' using errcode = 'P0403';
  end if;

  update public.organizations
  set
    security_code_hash = crypt(p_code, gen_salt('bf', 10)),
    security_code_updated_at = now()
  where id = p_org_id;
end $$;

grant execute on function public.set_security_code to authenticated, service_role;