-- =====================================================================
-- Votos anónimos (sin nombre/piso/apt), uno por sesión de navegador
-- =====================================================================
-- Cambios:
--  1. submit_vote ya NO exige voter_name, floor ni apartment.
--  2. La unicidad vuelve a ser un voto por contact_id + session_id
--     (constraint unique(contact_id, session_id) creado en 0001).
--  3. Se elimina el índice único por unidad (contact_id, floor, apartment)
--     introducido en 0018; las columnas voter_name/floor/apartment quedan
--     nullable para preservar datos históricos.
-- =====================================================================

DROP INDEX IF EXISTS public.votes_contact_unit_idx;

DROP FUNCTION IF EXISTS public.submit_vote(uuid, text, int, text, int, text, text);
DROP FUNCTION IF EXISTS public.submit_vote(uuid, text, int);

CREATE OR REPLACE FUNCTION public.submit_vote(
  p_contact_id uuid,
  p_session_id text,
  p_rating int,
  p_comment text DEFAULT NULL
)
RETURNS public.contacts
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_contact public.contacts;
  v_vote public.votes;
BEGIN
  IF p_rating < 1 OR p_rating > 5 THEN
    RAISE EXCEPTION 'Rating debe estar entre 1 y 5' USING ERRCODE = 'P0400';
  END IF;

  IF p_session_id IS NULL OR btrim(p_session_id) = '' THEN
    RAISE EXCEPTION 'Sesión inválida' USING ERRCODE = 'P0400';
  END IF;

  -- Verificar contacto existe y pertenece a org activa
  SELECT * INTO v_contact
  FROM public.contacts c
  JOIN public.organizations o ON o.id = c.org_id
  WHERE c.id = p_contact_id
    AND o.subscription_status IN ('trial','active')
  LIMIT 1;

  IF v_contact.id IS NULL THEN
    RAISE EXCEPTION 'Contacto no encontrado' USING ERRCODE = 'P0001';
  END IF;

  -- Un solo voto por sesión de navegador (anónimo)
  INSERT INTO public.votes (
    contact_id, session_id, rating, comment
  )
  VALUES (
    p_contact_id, p_session_id, p_rating,
    NULLIF(btrim(COALESCE(p_comment, '')), '')
  )
  ON CONFLICT (contact_id, session_id) DO NOTHING
  RETURNING * INTO v_vote;

  IF v_vote.id IS NULL THEN
    RAISE EXCEPTION 'Ya calificaste este contacto' USING ERRCODE = 'P0402';
  END IF;

  -- Recalcular agregados
  UPDATE public.contacts c
  SET rating_sum = v.rating_sum,
      rating_count = v.rating_count,
      avg_rating = v.avg_rating
  FROM (
    SELECT
      SUM(rating)::int AS rating_sum,
      COUNT(*)::int AS rating_count,
      ROUND(AVG(rating)::numeric, 1) AS avg_rating
    FROM public.votes
    WHERE contact_id = p_contact_id
  ) v
  WHERE c.id = p_contact_id
  RETURNING * INTO v_contact;

  RETURN v_contact;
END $$;

GRANT EXECUTE ON FUNCTION public.submit_vote(uuid, text, int, text)
  TO anon, authenticated;

NOTIFY pgrst, 'reload schema';