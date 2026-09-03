-- =====================================================================
-- org_floor_config: configuración dinámica de pisos y apartamentos
-- Permite que cada edificio defina su estructura (ej: 13 pisos, A/B/C)
-- =====================================================================

create table public.org_floor_config (
  org_id uuid primary key references public.organizations(id) on delete cascade,
  total_floors int not null default 13 check (total_floors > 0 and total_floors <= 100),
  apartment_labels text[] not null default '{A,B,C}',
  -- Pisos con etiqueta especial (ej: {"PB": 0, "Mezzanina": 0.5, "PH": 14})
  special_floor_labels jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

comment on table public.org_floor_config is 'Configuración dinámica de pisos y apartamentos por organización.';
comment on column public.org_floor_config.total_floors is 'Cantidad total de pisos del edificio.';
comment on column public.org_floor_config.apartment_labels is 'Array de letras/números de apartamentos por piso (ej: {A,B,C}).';
comment on column public.org_floor_config.special_floor_labels is 'JSON con etiquetas especiales de pisos (PB=0, Mezzanina, PH, etc.).';

-- RLS: lectura pública para orgs activas, escritura admin+
alter table public.org_floor_config enable row level security;

create policy "org_floor_config_public_read"
  on public.org_floor_config for select
  using (
    exists (
      select 1 from public.organizations o
      where o.id = org_floor_config.org_id
        and o.subscription_status in ('trial','active')
    )
  );

create policy "org_floor_config_admin_all"
  on public.org_floor_config for all
  using (public.has_org_role(org_id, 'admin'))
  with check (public.has_org_role(org_id, 'admin'));

-- Trigger updated_at
create trigger org_floor_config_touch
  before update on public.org_floor_config
  for each row execute function public.touch_updated_at();