-- =====================================================================
-- SEED: primera organización + 2 usuarios (Owner + Admin demo)
--
-- IMPORTANTE:
-- 1. Crear los 2 usuarios en Supabase Dashboard → Authentication → Users:
--    - Owner: tu email + password
--    - Admin demo: admin-demo@paginas-amarillas.app + password
--    (Ambos con "Auto Confirm User" marcado)
--
-- 2. Anotar el User UID de cada uno (Aparece en la lista de usuarios)
--
-- 3. Reemplazar los 2 UUIDs en este script (ver constantes más abajo)
--
-- 4. Correr este script en SQL Editor
-- =====================================================================

do $$
declare
  v_owner_user_id    uuid := '29140dd5-a392-4fa2-9559-4ba307eebfd8';          -- tu user (uid)
  v_admin_user_id    uuid := '8ba6a257-4166-4820-9086-889a83990cae';      -- admin demo (uid)
  v_org_slug         text := 'colina-del-este';
  v_org_name         text := 'Edificio Colina Del Este';
  v_security_code    text := 'COLINA-2026';
  v_org_id           uuid;
  v_admin_demo_email text := 'admin-demo@paginas-amarillas.app';
begin
  -- 1. Crear la organización con código hasheado
  insert into public.organizations (slug, name, security_code_hash)
  values (
    v_org_slug,
    v_org_name,
    crypt(v_security_code, gen_salt('bf', 10))
  )
  returning id into v_org_id;

  -- 2. Crear membresías
  insert into public.memberships (user_id, org_id, role) values
    (v_owner_user_id, v_org_id, 'owner'),
    (v_admin_user_id, v_org_id, 'admin');

  -- 3. Marcar al Owner como platform_owner
  update auth.users
  set raw_app_meta_data = raw_app_meta_data || '{"is_platform_owner": true}'::jsonb
  where id = v_owner_user_id;

  -- 4. Seed de configuración de pisos (13 pisos, apartamentos A/B/C)
  insert into public.org_floor_config (org_id, total_floors, apartment_labels, special_floor_labels)
  values (
    v_org_id,
    13,
    ARRAY['A', 'B', 'C'],
    '{"PB": 0}'::jsonb
  );

  -- 5. Seed de categorías iniciales
  insert into public.categories (org_id, key, label, emoji, sort_order) values
    (v_org_id, 'plomeria',          'Plomería',                    '🔧', 10),
    (v_org_id, 'electricidad',      'Electricidad',                '⚡', 20),
    (v_org_id, 'carpinteria',       'Carpintería',                 '🪚', 30),
    (v_org_id, 'tapiceria',         'Tapicería',                   '🛋️', 35),
    (v_org_id, 'mecanica',          'Mecánica automotriz',         '🚗', 40),
    (v_org_id, 'albanileria',       'Albañilería',                 '🧱', 50),
    (v_org_id, 'refrigeracion',     'Refrigeración / A/A',         '❄️', 60),
    (v_org_id, 'cerrajeria',        'Cerrajería',                  '🔑', 70),
    (v_org_id, 'tecnologia',        'Tecnología / PC',             '💻', 80),
    (v_org_id, 'pintura',           'Pintura',                     '🎨', 90),
    (v_org_id, 'papel-tapiz',       'Papel tapiz',                 '🖼️', 100),
    (v_org_id, 'limpieza',          'Limpieza del hogar',          '🧹', 110),
    (v_org_id, 'jardineria',        'Jardinería',                  '🌱', 120),
    (v_org_id, 'mudanzas',          'Mudanzas / Fletes',           '📦', 130),
    (v_org_id, 'electrodomesticos', 'Reparación de electrodomésticos','🔌', 140),
    (v_org_id, 'cocina',            'Reparación de cocina',        '🍳', 150),
    (v_org_id, 'gas',               'Instalaciones de gas',        '🔥', 160),
    (v_org_id, 'salud',             'Salud / Enfermería',          '🩺', 170),
    (v_org_id, 'belleza',           'Belleza / Peluquería',        '💇', 180),
    (v_org_id, 'mascotas',          'Cuidado de mascotas',         '🐶', 190),
    (v_org_id, 'otros',             'Otros',                       '➕', 999);

  raise notice '✅ Organización creada: % (id: %)', v_org_slug, v_org_id;
  raise notice '✅ Código de seguridad inicial: %', v_security_code;
  raise notice '✅ Owner asignado al user: %', v_owner_user_id;
  raise notice '✅ Admin demo asignado al user: % (email: %)', v_admin_user_id, v_admin_demo_email;
  raise notice '✅ Configuración: 13 pisos, apartamentos A/B/C, PB como piso especial';
  raise notice '✅ 21 categorías seed creadas';
end $$;

-- Verificación
select
  o.slug,
  o.name,
  o.subscription_status,
  count(distinct c.id) as categorias,
  count(distinct ct.id) as contactos,
  count(distinct m.id) as miembros
from public.organizations o
left join public.categories c on c.org_id = o.id
left join public.contacts ct on ct.org_id = o.id
left join public.memberships m on m.org_id = o.id
where o.slug = 'colina-del-este'
group by o.id, o.slug, o.name, o.subscription_status;

-- Verificar claim platform_owner
select id, email, raw_app_meta_data->>'is_platform_owner' as is_owner
from auth.users
where id in ('29140dd5-a392-4fa2-9559-4ba307eebfd8', '8ba6a257-4166-4820-9086-889a83990cae');