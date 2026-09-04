-- =====================================================================
-- fix: force-recreate set_security_code para invalidar cache PostgREST
-- =====================================================================
-- Problema: PostgREST retorna 42883 (undefined_function) al llamar
-- set_security_code via RPC, pero la función existe y funciona al
-- llamarla directamente desde SQL Editor.
-- Causa probable: cache interno de PostgREST desactualizado después
-- de CREATE OR REPLACE en migraciones 0009/0011.
-- Solución: DROP completo + CREATE desde cero + GRANT explícito.
-- =====================================================================

-- 1. DROP todas las versiones de set_security_code (de cualquier schema)
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT n.nspname, p.oid,
           pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE p.proname = 'set_security_code'
  LOOP
    EXECUTE format(
      'DROP FUNCTION IF EXISTS %I.%I(%s) CASCADE',
      r.nspname, 'set_security_code', r.args
    );
    RAISE NOTICE 'Dropped: %.%(%)', r.nspname, 'set_security_code', r.args;
  END LOOP;
END $$;

-- 2. CREATE desde cero (NO usar OR REPLACE)
CREATE FUNCTION public.set_security_code(
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

  -- Autorización:
  --   a) service_role (auth.uid() IS NULL) → siempre permitido
  --   b) platform_owner → siempre permitido
  --   c) condo_admin de esta org → permitido
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

-- 3. GRANT con firma explícita (más robusto que firma genérica)
GRANT EXECUTE ON FUNCTION public.set_security_code(p_org_id uuid, p_code text)
  TO authenticated, service_role, anon;

-- 4. Recargar schema cache de PostgREST
NOTIFY pgrst, 'reload schema';
