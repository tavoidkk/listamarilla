-- Fondo de la aplicación por edificio: bucket público para fotos (org-assets).
-- El admin del edificio puede subir/sobrescribir/sustituir fotos bajo la
-- carpeta {org_id}/. El público puede leer (bucket público => URL pública).

insert into storage.buckets (id, name, public)
values ('org-assets', 'org-assets', true)
on conflict (id) do nothing;

-- Acceso al helper de carpetas (idempotente)
drop policy if exists "org_assets_public_read" on storage.objects;
drop policy if exists "org_assets_admin_insert" on storage.objects;
drop policy if exists "org_assets_admin_update" on storage.objects;
drop policy if exists "org_assets_admin_delete" on storage.objects;

-- Solo el admin del edificio puede escribir en la carpeta de su org
create policy "org_assets_public_read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'org-assets');

create policy "org_assets_admin_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'org-assets'
    and (storage.foldername(name))[1] = (
      select m.org_id::text
      from public.memberships m
      where m.user_id = auth.uid()
        and m.role = 'condo_admin'
        and m.status = 'active'
      limit 1
    )
  );

create policy "org_assets_admin_update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'org-assets'
    and (storage.foldername(name))[1] = (
      select m.org_id::text
      from public.memberships m
      where m.user_id = auth.uid()
        and m.role = 'condo_admin'
        and m.status = 'active'
      limit 1
    )
  )
  with check (
    bucket_id = 'org-assets'
    and (storage.foldername(name))[1] = (
      select m.org_id::text
      from public.memberships m
      where m.user_id = auth.uid()
        and m.role = 'condo_admin'
        and m.status = 'active'
      limit 1
    )
  );

create policy "org_assets_admin_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'org-assets'
    and (storage.foldername(name))[1] = (
      select m.org_id::text
      from public.memberships m
      where m.user_id = auth.uid()
        and m.role = 'condo_admin'
        and m.status = 'active'
      limit 1
    )
  );