# Listamarilla 

PWA multi-tenant para juntas de condominio. Directorio de prestadores de servicios por edificio.

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS 4**
- **Supabase** (Postgres + Auth + RLS + Realtime + Storage)
- **Vercel** (hosting + edge)
- **PWA** instalable para vecinos y administradores
- ESLint + Prettier
- GitHub Actions keep-alive (cron cada 8h) para evitar pausa de Supabase Free

## Estructura

```
src/
├── app/
│   ├── (marketing)/          # Landing, login, solicitar
│   ├── (resident)/o/[slug]/  # Portal vecinos (sin login, por QR)
│   ├── (admin)/o/[slug]/panel/ # Panel admin (login email/pass)
│   ├── (platform)/superadmin/ # Owner
│   ├── manifest.ts           # PWA manifest
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Tailwind + tokens base
├── components/
│   ├── ui/                   # Button, Field, Modal, Toast, Spinner, StarRating
│   └── resident/             # Disclaimer, CategorySelector, ContactList, etc.
├── lib/
│   ├── supabase/             # server.ts, client.ts, service.ts
│   ├── theme.ts, phone.ts, session.ts, env.ts, sw-register.ts
├── types/                    # database.ts, supabase.ts
supabase/
├── 0001_init.sql             # Tablas
├── 0002_rls.sql              # Policies RLS
├── 0003_rpc.sql              # Funciones públicas (add_contact_resident, submit_vote)
└── 0004_admin_rpc.sql        # set_security_code
```

## Setup local

1. **Clonar e instalar**
   ```bash
   pnpm install
   ```

2. **Crear proyecto Supabase**
   - Crear nuevo proyecto en [supabase.com](https://supabase.com)
   - Anotar URL y claves (anon + service_role)

3. **Aplicar migraciones**
   - En Supabase SQL Editor, ejecutar en orden:
     - `supabase/0001_init.sql`
     - `supabase/0002_rls.sql`
     - `supabase/0003_rpc.sql`
     - `supabase/0004_admin_rpc.sql`

4. **Variables de entorno**
   ```bash
   cp .env.example .env.local
   # Completar con tus claves
   ```

5. **Generar tipos** (opcional pero recomendado)
   ```bash
   pnpm exec supabase gen types typescript --project-id <PROJECT_ID> > src/types/supabase.ts
   ```

6. **Crear primera organización** (manualmente desde SQL Editor)
   ```sql
   -- 1. Crear usuario admin via Auth dashboard (o usar el signup API)
   -- 2. Crear org vía service_role (requiere pgsql con service key)
   -- Alternativa: usar la página /superadmin cuando esté listo
   ```

7. **Dev server**
   ```bash
   pnpm dev
   ```

## Rutas

| Ruta | Quién | Descripción |
|---|---|---|
| `/` | Público | Landing del SaaS |
| `/solicitar` | Público | Formulario de solicitud |
| `/login` | Público | Login del admin (genérico) |
| `/o/[slug]` | Público (vecinos) | Portal del edificio (Disclaimer → Categorías → Contactos) |
| `/o/[slug]/panel/login` | Admin | Login del condominio |
| `/o/[slug]/panel` | Admin | Dashboard |
| `/o/[slug]/panel/contactos` | Admin | Ver/eliminar contactos |
| `/o/[slug]/panel/categorias` | Admin | CRUD de categorías |
| `/o/[slug]/panel/codigo-seguridad` | Admin | Cambiar código de seguridad |
| `/o/[slug]/panel/branding` | Admin | Nombre + paleta de colores |
| `/o/[slug]/panel/qr` | Admin | Generar QR imprimible |
| `/superadmin` | Owner | Gestión de orgs y suscripciones |

## Deploy en Vercel

1. Conectar repo en [vercel.com](https://vercel.com)
2. Configurar variables de entorno (las mismas que `.env.example`)
3. Deploy

## Keep-alive

Configurar secrets en GitHub (Settings → Secrets → Actions):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

El workflow `keep-alive.yml` corre cada 8h para evitar que Supabase Free pause el proyecto.

## Cómo convertirse en Platform Owner

En Supabase SQL Editor con service_role:

```sql
-- Asignar el claim is_platform_owner=true al user_id deseado
update auth.users
set raw_app_meta_data = raw_app_meta_data || '{"is_platform_owner": true}'::jsonb
where email = 'tu@email.com';
```
