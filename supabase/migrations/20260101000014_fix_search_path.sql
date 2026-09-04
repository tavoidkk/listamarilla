-- =====================================================================
-- fix: search_path de update_org_security_code debe incluir "extensions"
-- =====================================================================
-- Problema: la función llama crypt(p_code, gen_salt('bf',10)) sin
-- calificar el schema. crypt/gen_salt vienen de pgcrypto, instalado en
-- el schema "extensions". Con SET search_path = public, Postgres NO
-- busca en "extensions" y devuelve SQLSTATE 42883 (undefined_function).
-- Solución: agregar "extensions" al search_path.
-- =====================================================================

-- DROP y CREATE con search_path correcto
DROP FUNCTION IF EXISTS public.update_org_security_code(uuid, text) CASCADE;

CREATE FUNCTION public.update_org_security_code(
  p_org_id uuid,
  p_code text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
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

GRANT EXECUTE ON FUNCTION public.update_org_security_code(p_org_id uuid, p_code text)
  TO authenticated, service_role, anon;

NOTIFY pgrst, 'reload schema';
