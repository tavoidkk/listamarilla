# CSS Layout Rules — Páginas Amarillas

> Reglas de oro para la maquetación de la aplicación.
> Consultar en CADA iteración de desarrollo UI.

---

## REGLA 1: Contenedor Principal Obligatorio

**NUNCA dejes una sección sin un contenedor `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` para forzar el centrado.**

En caso de que las utilidades de Tailwind no se apliquen, usar la clase pura `.site-container`:

```tsx
<div className="site-container">
  {/* contenido */}
</div>
```

Equivalente CSS en `globals.css`:

```css
.site-container {
  width: 100%;
  max-width: 80rem !important;
  margin-left: auto !important;
  margin-right: auto !important;
  padding-left: 1.5rem !important;
  padding-right: 1.5rem !important;
}
```

---

## REGLA 2: Verificación de Tailwind v4

Verifica que `@import "tailwindcss";` esté al inicio de `src/app/globals.css`
y que `@tailwindcss/postcss` esté configurado en `postcss.config.mjs`.

Si las utilidades de Tailwind no se generan, agregar clases CSS puras como fallback
(en `globals.css`) para garantizar el centrado y padding.

---

## REGLA 3: Tarjetas con Padding Interno Explícito

Las tarjetas DEBEN tener siempre padding interno explícito e interlineado spacing:

```tsx
<div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm space-y-4">
  {/* contenido */}
</div>
```

- **Padding base**: `p-6` (móvil) / `p-8` (desktop)
- **Espaciado interno**: `space-y-4` mínimo
- **Nunca** dejar texto pegado al borde de la tarjeta

---

## REGLA 4: Landing Page Simétrica y Responsive

La landing page DEBE estar estructurada con un diseño simétrico, centrado y responsive
en todos los breakpoints:

- **Hero**: `site-container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`
- **Features/Steps**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`
- **Pricing**: Dentro de `flex justify-center` con `w-full max-w-lg mx-auto`
- **Spacing secciones**: `py-16 md:py-24`
- **Textos**: Jerarquía clara `text-3xl sm:text-4xl lg:text-5xl leading-tight`

---

## REGLA 5: `body` Global Sano

```css
body {
  overflow-x: hidden;
  width: 100%;
}
```

Evita desbordes horizontales accidentales en cualquier viewport.
