-- =====================================================================
-- Migración: Rol "condo_admin" (Administrador de Condominio)
-- =====================================================================
-- Contexto:
--   Se redefine el modelo de acceso de las organizaciones. Antes una
--   organización tenía miembros con roles 'owner'/'admin'/'member'.
--   Ahora el único rol dentro de una organización es 'condo_admin'
--   (Administrador de Condominio), que controla el portal de su edificio.
--   El OWNER/ADMIN de la plataforma NO son miembros de ninguna org.
--
-- Cambios:
--   1. Aceptar el nuevo rol 'condo_admin' en memberships.role
--      (y descartar los roles heredados 'owner'/'admin'/'member').
--   2. Actualizar la función has_org_role para que 'condo_admin' tenga
--      los permisos de 'admin' dentro de su organización (RLS).
--   3. Migrar membresías existentes con rol 'admin'/'owner' heredado
--      hacia 'condo_admin' si pertenecen a un usuario de plataforma.
-- =====================================================================

-- 1. Recrear el constraint de role para aceptar condo_admin
alter table public.memberships
  drop constraint if exists memberships_role_check;
alter table public.memberships
  add constraint memberships_role_check check (role in ('condo_admin'));

-- 2. Limpiar roles heredados: ninguno coincide con condo_admin.
--    (En producción no debería haber filas 'owner'/'admin'/'member'; si las
--    hubiera, las dejamos marcadas para revisión o las convertimos.)
update public.memberships
set role = 'condo_admin'
where role in ('owner','admin','member');

-- 3. Actualizar has_org_role: 'condo_admin' tiene permisos de admin en su org,
--    y 'owner'/'admin' de la plataforma siguen sin depender de membresías.
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

-- current_membership_role: devuelve 'condo_admin' (o null) si el usuario es
-- administrador activo de esa org.
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
