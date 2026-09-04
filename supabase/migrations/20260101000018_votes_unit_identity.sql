-- =====================================================================
-- Votos con identidad de unidad + comentario opcional
-- =====================================================================
-- Cambios:
--  1. Nuevas columnas en votes: voter_name, floor, apartment, comment.
--  2. Un único voto por contacto POR UNIDAD (piso + apartamento),
--     reemplaza la regla previa de session_id.
--  3. submit_vote recibe nombre, piso, apartamento y comentario opcional.
--     Si la unidad ya votó ese contacto, devuelve error P0402.
-- =====================================================================

ALTER TABLE public.votes
  ADD COLUMN voter_name text,
  ADD COLUMN floor int,
  ADD COLUMN apartment text,
  ADD COLUMN comment text;

-- Restricción: un voto por contacto y por unidad (piso + apt).
-- NOTA: Postgres trata los NULL como distintos, por lo que los votos
-- antiguos (sin piso/apt) no bloquean ni son bloqueados; el RPC exige
-- piso y apt para los votos nuevos.
CREATE UNIQUE INDEX IF NOT EXISTS votes_contact_unit_idx
  ON public.votes (contact_id, floor, apartment);

CREATE INDEX IF NOT EXISTS votes_contact_created_idx
  ON public.votes (contact_id, created_at DESC);

DROP FUNCTION IF EXISTS public.submit_vote(uuid, text, int);

CREATE OR REPLACE FUNCTION public.submit_vote(
  p_contact_id uuid,
  p_session_id text,
  p_rating int,
  p_voter_name text,
  p_floor int,
  p_apartment text,
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

  IF p_voter_name IS NULL OR btrim(p_voter_name) = '' THEN
    RAISE EXCEPTION 'Ingresa tu nombre y apellido' USING ERRCODE = 'P0400';
  END IF;

  IF p_floor IS NULL THEN
    RAISE EXCEPTION 'Selecciona tu piso' USING ERRCODE = 'P0400';
  END IF;

  IF p_apartment IS NULL OR btrim(p_apartment) = '' THEN
    RAISE EXCEPTION 'Selecciona tu apartamento' USING ERRCODE = 'P0400';
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

  -- Un solo voto por unidad (piso + apartamento)
  INSERT INTO public.votes (
    contact_id, session_id, rating, voter_name, floor, apartment, comment
  )
  VALUES (
    p_contact_id, p_session_id, p_rating,
    btrim(p_voter_name), p_floor, btrim(p_apartment),
    NULLIF(btrim(COALESCE(p_comment, '')), '')
  )
  ON CONFLICT (contact_id, floor, apartment) DO NOTHING
  RETURNING * INTO v_vote;

  IF v_vote.id IS NULL THEN
    RAISE EXCEPTION 'Ya calificaste este contacto desde ese piso/apartamento'
      USING ERRCODE = 'P0402';
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

GRANT EXECUTE ON FUNCTION public.submit_vote(uuid, text, int, text, int, text, text)
  TO anon, authenticated;

NOTIFY pgrst, 'reload schema';