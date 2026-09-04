-- =====================================================================
-- fix: update_org_security_code (nombre nuevo para evitar cache PostgREST)
-- =====================================================================
-- Problema persistente: set_security_code sigue dando 42883 después de
-- DROP + CREATE + NOTIFY pgrst. La firma está cacheada con algún problema
-- que solo se resuelve cambiando el nombre completamente.
-- Solución: crear update_org_security_code como función nueva y dejar
-- set_security_code obsoleta (DROP final).
-- =====================================================================

-- 1. DROP la función vieja (ya no la usamos)
DROP FUNCTION IF EXISTS public.set_security_code(uuid, text) CASCADE;

-- 2. CREATE desde cero con nombre nuevo
CREATE FUNCTION public.update_org_security_code(
  p_org_id uuid,
  p_code text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller uuid := auth.uid();
  v_is_platform boolean := public.is_platform_owner();
  v_allowed boolean := false;
BEGIN
  IF length(trim(p_code)) < 4 THEN
    RAISE EXCEPTION 'El código debe tener al menos 4 caracteres'
      USING ERRCODE = 'P0400';
  END IF;

  IF v_caller IS NULL THEN
    v_allowed := true;
  ELSIF v_is_platform THEN
    v_allowed := true;
  ELSE
    SELECT EXISTS (
      SELECT 1
      FROM public.memberships
      WHERE org_id = p_org_id
        AND user_id = v_caller
        AND status = 'active'
        AND role = 'condo_admin'
    ) INTO v_allowed;
  END IF;

  IF NOT v_allowed THEN
    RAISE EXCEPTION 'Sin permisos para cambiar el código'
      USING ERRCODE = 'P0403';
  END IF;

  UPDATE public.organizations
  SET
    security_code_hash = crypt(p_code, gen_salt('bf', 10)),
    security_code_updated_at = now()
  WHERE id = p_org_id;
END $$;

-- 3. GRANT con firma explícita
GRANT EXECUTE ON FUNCTION public.update_org_security_code(p_org_id uuid, p_code text)
  TO authenticated, service_role, anon;

-- 4. Reload cache PostgREST
NOTIFY pgrst, 'reload schema';
