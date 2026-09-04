-- =====================================================================
-- fix: search_path de add_contact_resident / create_organization
-- =====================================================================
-- Problema: ambas funciones llaman crypt(...) — viene de pgcrypto, que
-- Supabase instala en el schema "extensions". Con SET search_path =
-- public, Postgres NO busca en "extensions" y devuelve SQLSTATE 42883
-- (undefined_function: "function crypt(text, text) does not exist").
-- Solución: agregar "extensions" al search_path (igual que en 0014).
-- =====================================================================

DROP FUNCTION IF EXISTS public.add_contact_resident(
  text, text, text, text, text, text, text, text, boolean, text, text, int, text
) CASCADE;

CREATE OR REPLACE FUNCTION public.add_contact_resident(
  p_org_slug text,
  p_security_code text,
  p_phone text,
  p_phone_normalized text,
  p_name text,
  p_category_key text,
  p_category_label text,
  p_category_emoji text,
  p_new_category boolean,
  p_added_by_name text,
  p_added_by_session text,
  p_floor int default null,
  p_apartment text default null
)
RETURNS public.contacts
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_org public.organizations;
  v_category_id uuid;
  v_category_label text;
  v_category_emoji text;
  v_contact public.contacts;
BEGIN
  -- 1. Buscar org
  SELECT * INTO v_org
  FROM public.organizations
  WHERE slug = p_org_slug
    AND subscription_status IN ('trial','active')
  LIMIT 1;

  IF v_org.id IS NULL THEN
    RAISE EXCEPTION 'Organización no encontrada o inactiva' USING ERRCODE = 'P0001';
  END IF;

  -- 2. Validar código de seguridad
  IF v_org.security_code_hash IS NULL
     OR v_org.security_code_hash != crypt(p_security_code, v_org.security_code_hash) THEN
    RAISE EXCEPTION 'Código de seguridad incorrecto' USING ERRCODE = 'P0401';
  END IF;

  -- 3. Buscar o crear categoría
  IF p_new_category THEN
    INSERT INTO public.categories (org_id, key, label, emoji)
    VALUES (v_org.id, p_category_key, p_category_label, p_category_emoji)
    RETURNING id, label, emoji INTO v_category_id, v_category_label, v_category_emoji;
  ELSE
    SELECT id, label, emoji INTO v_category_id, v_category_label, v_category_emoji
    FROM public.categories
    WHERE org_id = v_org.id AND key = p_category_key
    LIMIT 1;

    IF v_category_id IS NULL THEN
      RAISE EXCEPTION 'Categoría no existe' USING ERRCODE = 'P0002';
    END IF;
  END IF;

  -- 4. Insertar contacto (UPSERT por org_id + phone_normalized)
  INSERT INTO public.contacts (
    org_id, phone, phone_normalized, name,
    category_id, category_label, category_emoji,
    added_by_name, added_by_session, floor, apartment
  )
  VALUES (
    v_org.id, p_phone, p_phone_normalized, p_name,
    v_category_id, v_category_label, v_category_emoji,
    p_added_by_name, p_added_by_session, p_floor, p_apartment
  )
  ON CONFLICT (org_id, phone_normalized) DO UPDATE SET
    name = excluded.name,
    category_id = excluded.category_id,
    category_label = excluded.category_label,
    category_emoji = excluded.category_emoji
  RETURNING * INTO v_contact;

  RETURN v_contact;
END $$;

GRANT EXECUTE ON FUNCTION public.add_contact_resident(
  text, text, text, text, text, text, text, text, boolean, text, text, int, text
) TO anon, authenticated;

DROP FUNCTION IF EXISTS public.create_organization(text, text, text, uuid) CASCADE;

CREATE OR REPLACE FUNCTION public.create_organization(
  p_slug text,
  p_name text,
  p_security_code text,
  p_owner_user_id uuid
)
RETURNS public.organizations
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_org public.organizations;
BEGIN
  -- Crear org
  INSERT INTO public.organizations (slug, name, security_code_hash)
  VALUES (
    p_slug,
    p_name,
    crypt(p_security_code, gen_salt('bf', 10))
  )
  RETURNING * INTO v_org;

  -- Crear membresía owner
  INSERT INTO public.memberships (user_id, org_id, role)
  VALUES (p_owner_user_id, v_org.id, 'owner');

  -- Seed categorías iniciales
  INSERT INTO public.categories (org_id, key, label, emoji, sort_order) VALUES
    (v_org.id, 'plomeria',          'Plomería',                    '🔧', 10),
    (v_org.id, 'electricidad',      'Electricidad',                '⚡', 20),
    (v_org.id, 'carpinteria',       'Carpintería',                 '🪚', 30),
    (v_org.id, 'mecanica',          'Mecánica automotriz',         '🚗', 40),
    (v_org.id, 'albanileria',       'Albañilería',                 '🧱', 50),
    (v_org.id, 'refrigeracion',     'Refrigeración / A/A',         '❄️', 60),
    (v_org.id, 'cerrajeria',        'Cerrajería',                  '🔑', 70),
    (v_org.id, 'tecnologia',        'Tecnología / PC',             '💻', 80),
    (v_org.id, 'pintura',           'Pintura',                     '🎨', 90),
    (v_org.id, 'papel-tapiz',       'Papel tapiz',                 '🖼️', 100),
    (v_org.id, 'limpieza',          'Limpieza del hogar',          '🧹', 110),
    (v_org.id, 'jardineria',        'Jardinería',                  '🌱', 120),
    (v_org.id, 'mudanzas',          'Mudanzas / Fletes',           '📦', 130),
    (v_org.id, 'electrodomesticos', 'Reparación de electrodomésticos','🔌', 140),
    (v_org.id, 'cocina',            'Reparación de cocina',        '🍳', 150),
    (v_org.id, 'gas',               'Instalaciones de gas',        '🔥', 160),
    (v_org.id, 'salud',             'Salud / Enfermería',          '🩺', 170),
    (v_org.id, 'belleza',           'Belleza / Peluquería',        '💇', 180),
    (v_org.id, 'mascotas',          'Cuidado de mascotas',         '🐶', 190),
    (v_org.id, 'otros',             'Otros',                       '➕', 999);

  RETURN v_org;
END $$;

GRANT EXECUTE ON FUNCTION public.create_organization(text, text, text, uuid) TO service_role;

NOTIFY pgrst, 'reload schema';