-- =====================================================================
-- Fix: add_contact_resident debe permitir null en p_floor y p_apartment
-- PostgREST infiere `number` (no-null) por defecto. Cambiamos defaults.
-- =====================================================================

do $$
begin
  -- Drop si existe
  if exists (select 1 from pg_proc where proname = 'add_contact_resident') then
    drop function public.add_contact_resident(
      text, text, text, text, text, text, text, text, boolean, text, text, int, text
    );
  end if;
end $$;

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
  p_floor int default null,
  p_apartment text default null
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

  -- 2. Validar código de seguridad
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

  -- 4. Insertar contacto
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