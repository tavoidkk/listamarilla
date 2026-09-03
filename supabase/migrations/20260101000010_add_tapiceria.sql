-- =====================================================================
-- Añadir categoría "Tapicería" a todas las organizaciones
-- =====================================================================

insert into public.categories (org_id, key, label, emoji, sort_order)
select o.id, 'tapiceria', 'Tapicería', '🛋️', 35
from public.organizations o
where not exists (
  select 1
  from public.categories c
  where c.org_id = o.id
    and c.key = 'tapiceria'
);
