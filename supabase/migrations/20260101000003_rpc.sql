-- =====================================================================
-- RPC functions - expuestas a usuarios anónimos (vecinos)
-- SECURITY DEFINER: bypasean RLS pero validan reglas de negocio.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. add_contact_resident
--    Un vecino anónimo agrega un contacto.
--    Requiere: org_slug, security_code (en claro, se valida contra hash),
--              phone, name, category_key (o crea nueva), added_by_*,
--              session_id (browser).
-- ---------------------------------------------------------------------

create or replace function public.add_contact_resident(
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
  p_floor int,
  p_apartment text
)
returns public.contacts
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org public.organizations;
  v_category_id uuid;
  v_category_label text;
  v_category_emoji text;
  v_contact public.contacts;
begin
  -- 1. Buscar org
  select * into v_org
  from public.organizations
  where slug = p_org_slug
    and subscription_status in ('trial','active')
  limit 1;

  if v_org.id is null then
    raise exception 'Organización no encontrada o inactiva' using errcode = 'P0001';
  end if;

  -- 2. Validar código de seguridad (hash con crypt, blowfish)
  if v_org.security_code_hash is null
     or v_org.security_code_hash != crypt(p_security_code, v_org.security_code_hash) then
    raise exception 'Código de seguridad incorrecto' using errcode = 'P0401';
  end if;

  -- 3. Buscar o crear categoría
  if p_new_category then
    insert into public.categories (org_id, key, label, emoji)
    values (v_org.id, p_category_key, p_category_label, p_category_emoji)
    returning id, label, emoji into v_category_id, v_category_label, v_category_emoji;
  else
    select id, label, emoji into v_category_id, v_category_label, v_category_emoji
    from public.categories
    where org_id = v_org.id and key = p_category_key
    limit 1;

    if v_category_id is null then
      raise exception 'Categoría no existe' using errcode = 'P0002';
    end if;
  end if;

  -- 4. Insertar contacto (UPSERT por org_id+phone_normalized)
  insert into public.contacts (
    org_id, phone, phone_normalized, name,
    category_id, category_label, category_emoji,
    added_by_name, added_by_session, floor, apartment
  )
  values (
    v_org.id, p_phone, p_phone_normalized, p_name,
    v_category_id, v_category_label, v_category_emoji,
    p_added_by_name, p_added_by_session, p_floor, p_apartment
  )
  on conflict (org_id, phone_normalized) do update set
    name = excluded.name,
    category_id = excluded.category_id,
    category_label = excluded.category_label,
    category_emoji = excluded.category_emoji
  returning * into v_contact;

  return v_contact;
end $$;

grant execute on function public.add_contact_resident to anon, authenticated;

-- ---------------------------------------------------------------------
-- 2. submit_vote
--    Un vecino anónimo vota. Atómico: update contactos + insert voto.
-- ---------------------------------------------------------------------

create or replace function public.submit_vote(
  p_contact_id uuid,
  p_session_id text,
  p_rating int
)
returns public.contacts
language plpgsql
security definer
set search_path = public
as $$
declare
  v_contact public.contacts;
begin
  if p_rating < 1 or p_rating > 5 then
    raise exception 'Rating debe estar entre 1 y 5' using errcode = 'P0400';
  end if;

  -- Verificar contacto existe y pertenece a org activa
  select * into v_contact
  from public.contacts c
  join public.organizations o on o.id = c.org_id
  where c.id = p_contact_id
    and o.subscription_status in ('trial','active')
  limit 1;

  if v_contact.id is null then
    raise exception 'Contacto no encontrado' using errcode = 'P0001';
  end if;

  -- Upsert voto (1 por session_id)
  insert into public.votes (contact_id, session_id, rating)
  values (p_contact_id, p_session_id, p_rating)
  on conflict (contact_id, session_id) do update
    set rating = excluded.rating
  returning rating into p_rating;

  -- Recalcular agregados
  update public.contacts c
  set rating_sum = v.rating_sum,
      rating_count = v.rating_count,
      avg_rating = v.avg_rating
  from (
    select
      sum(rating)::int as rating_sum,
      count(*)::int as rating_count,
      round(avg(rating)::numeric, 1) as avg_rating
    from public.votes
    where contact_id = p_contact_id
  ) v
  where c.id = p_contact_id
  returning * into v_contact;

  return v_contact;
end $$;

grant execute on function public.submit_vote to anon, authenticated;

-- ---------------------------------------------------------------------
-- 3. create_organization (solo service_role - usado por Owner)
-- ---------------------------------------------------------------------

create or replace function public.create_organization(
  p_slug text,
  p_name text,
  p_security_code text,
  p_owner_user_id uuid
)
returns public.organizations
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org public.organizations;
begin
  -- Crear org
  insert into public.organizations (slug, name, security_code_hash)
  values (
    p_slug,
    p_name,
    crypt(p_security_code, gen_salt('bf', 10))
  )
  returning * into v_org;

  -- Crear membresía owner
  insert into public.memberships (user_id, org_id, role)
  values (p_owner_user_id, v_org.id, 'owner');

  -- Seed categorías iniciales
  insert into public.categories (org_id, key, label, emoji, sort_order) values
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

  return v_org;
end $$;

grant execute on function public.create_organization to service_role;