# Listamarilla

SaaS multi-tenant para juntas de condominio. Directorio de prestadores de servicios por edificio.

> **Diseño v2**: blanco + amarillo (#FACC15). Mantengo Inter como typeface. Animaciones CSS nativas. PWA para vecinos y admin.

## Stack

- **Next.js 16** (App Router) + **TypeScript strict**
- **Tailwind CSS 4** + CSS custom properties (theming por org)
- **Supabase** (Postgres + Auth + RLS + Storage + Realtime)
- **Vercel** (hosting + edge)
- ESLint + Prettier (prettier-plugin-tailwindcss)
- GitHub Actions keep-alive (cron cada 8h) para evitar pausa de Supabase Free

## Rutas

| Ruta | Quién | Descripción |
|---|---|---|
| `/` | Público | Landing SaaS con hero, features, pricing, FAQ |
| `/solicitar` | Público | Form "Solicitar mi edificio" |
| `/login` | Público | Login del admin (genérico) |
| `/o/[slug]` | Público (vecinos) | Portal del edificio (Disclaimer → Categorías → Contactos) |
| `/o/[slug]/panel/login` | Admin | Login del condominio |
| `/o/[slug]/panel` | Admin | Dashboard |
| `/o/[slug]/panel/contactos` | Admin | Ver/eliminar contactos |
| `/o/[slug]/panel/categorias` | Admin | CRUD de categorías |
| `/o/[slug]/panel/configuracion` | Admin | Configurar pisos y apartamentos |
| `/o/[slug]/panel/codigo-seguridad` | Admin | Cambiar código de seguridad |
| `/o/[slug]/panel/branding` | Admin | Nombre + paleta de colores |
| `/o/[slug]/panel/qr` | Admin | Generar QR imprimible |
| `/superadmin` | Owner | Gestión de orgs y suscripciones |

## Setup local

### 1. Clonar e instalar
```bash
pnpm install
```

### 2. Crear proyecto Supabase y aplicar migraciones
```bash
pnpm exec supabase login
pnpm exec supabase link --project-ref <REF>
pnpm exec supabase db push
```

Las migraciones están en `supabase/migrations/`:
- `20260101000001_init.sql` — 6 tablas + triggers
- `20260101000002_rls.sql` — Policies RLS
- `20260101000003_rpc.sql` — RPC `add_contact_resident`, `submit_vote`
- `20260101000004_admin_rpc.sql` — RPC `set_security_code`
- `20260101000005_fix_rpc_nullable.sql` — Fix nullable params
- `20260101000006_org_floor_config.sql` — Configuración dinámica de pisos

### 3. Variables de entorno
```bash
cp .env.example .env.local
# Completar con tus claves
```

### 4. Generar tipos
```bash
pnpm exec supabase gen types typescript --project-id <REF> > src/types/supabase.ts
```

### 5. Crear usuarios de prueba

Ver `USUARIOS_DE_PRUEBA.md` para el paso a paso completo. Resumen:

1. Crear 2 usuarios en **Authentication → Users** (Owner + Admin demo)
2. Copiar el archivo `supabase/seed/first-org.sql`, reemplazar los UUIDs
3. Correr en SQL Editor

### 6. Dev server
```bash
pnpm dev
```

## Deploy en Vercel

1. Conectar repo en [vercel.com](https://vercel.com)
2. Configurar env vars (las mismas que `.env.example`)
3. Deploy

## Keep-alive

Configurar secrets en GitHub → Settings → Secrets:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

El workflow `keep-alive.yml` corre cada 8h.

## Cómo convertirse en platform_owner (manual)

```sql
update auth.users
set raw_app_meta_data = raw_app_meta_data || '{"is_platform_owner": true}'::jsonb
where email = 'tu@email.com';
```

## Sistema de diseño

| Token | Valor | Uso |
|---|---|---|
| `--color-primary` | `250 204 21` (amarillo 400) | Botones, focus, acentos |
| `--color-primary-dark` | `202 138 4` (amarillo 600) | Hover |
| `--color-primary-light` | `254 249 195` (amarillo 100) | Fondos suaves |
| `--color-base` | `FFFFFF` (blanco) | Fondo principal |
| `--color-surface` | `249 250 251` (slate 50) | Cards |
| `--color-text-primary` | `15 23 42` (slate 900) | Texto principal |
| `--color-text-secondary` | `71 85 105` (slate 600) | Texto secundario

Animaciones: `fadeIn`, `slideUp`, `scaleIn`, `pulseYellow`, `shimmer`, `floatY` — todas CSS nativas con `@keyframes`. Respeta `prefers-reduced-motion`.