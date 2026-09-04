-- =====================================================================
-- Lectura pública de votos para el portal de vecinos
-- =====================================================================
-- El portal muestra comentarios/calificaciones de todos los vecinos y
-- verifica en el cliente si la unidad (piso+apt) ya votó. La política
-- existente "votes_session_read" solo expone los votos del propio
-- session_id (y este se pasa por parámetro, no por header), así que
-- los SELECT desde el cliente del navegador no verían nada.
-- Esta política replica "contacts_public_read": votos (anónimos sin
-- login) de contactos de organizaciones activas.
-- =====================================================================

create policy "votes_public_read"
  on public.votes for select
  using (
    exists (
      select 1
      from public.contacts c
      join public.organizations o on o.id = c.org_id
      where c.id = votes.contact_id
        and o.subscription_status in ('trial','active')
    )
  );