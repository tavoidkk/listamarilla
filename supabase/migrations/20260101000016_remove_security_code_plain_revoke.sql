-- =====================================================================
-- fix: quitar el REVOKE column-level de security_code_plain
-- =====================================================================
-- Problema: el REVOKE SELECT (security_code_plain) de la migración 0015,
-- combinado con RLS habilitado en organizations, hacía que PostgREST
-- devolviera null para las queries del rol authenticated sobre la tabla,
-- rompiendo las sub-rutas del panel admin ("Edificio no encontrado").
-- Solución: restablecer el GRANT. La protección de la columna sensible
-- ya se delega al RPC SECURITY DEFINER get_org_security_code, que valida
-- auth.uid() + is_platform_owner() + rol condo_admin antes de devolverla.
-- =====================================================================

grant select (security_code_plain)
  on public.organizations to authenticated, anon;

notify pgrst, 'reload schema';
