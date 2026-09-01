"use client";

interface Category {
  id: string;
  key: string;
  label: string;
  emoji: string;
}

interface CategorySelectorProps {
  orgName?: string;
  categories: Category[];
  onSelect: (category: Category) => void;
  onAddClick: () => void;
}

export function CategorySelector({ categories, onSelect, onAddClick }: CategorySelectorProps) {
  return (
    <div className="app-fade flex w-full min-h-screen flex-col">
      <header className="px-6 pb-4 pt-8">
        <p className="mb-2 text-sm font-bold uppercase tracking-wider text-white drop-shadow-md">
          Directorio de servicios
        </p>
        <h1 className="mb-2 text-[28px] font-bold text-white drop-shadow-lg">¿Qué servicio necesitas?</h1>
        <span className="inline-block rounded-full bg-white/88 px-3.5 py-2 text-sm font-medium text-[color:var(--color-text-primary)] shadow-md">
          Selecciona una categoría para ver los contactos disponibles
        </span>
      </header>

      <div className="flex-1 px-6 pb-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat)}
              aria-label={`Ver contactos de ${cat.label}`}
              className="flex min-h-[110px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-transparent bg-white/92 px-3 py-5 text-center shadow-sm backdrop-blur transition-transform duration-150 hover:scale-[1.02] hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-light)] active:scale-[0.97]"
            >
              <span aria-hidden className="text-3xl leading-none">
                {cat.emoji}
              </span>
              <span className="text-sm font-medium text-[color:var(--color-text-primary)]">{cat.label}</span>
            </button>
          ))}

          <button
            type="button"
            onClick={onAddClick}
            aria-label="Agregar nuevo prestador de servicio"
            className="relative flex min-h-[110px] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-white/40 px-3 py-5 text-center text-white shadow-[0_6px_20px_color-mix(in_srgb,var(--color-whatsapp)_45%,transparent)]"
            style={{
              background:
                "linear-gradient(135deg, var(--color-whatsapp) 0%, var(--color-whatsapp-dark) 100%)",
            }}
          >
            <span
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgb(255_255_255_/_25%),transparent_60%)]"
            />
            <span
              aria-hidden
              className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-[38px] font-light"
            >
              ＋
            </span>
            <span className="text-sm font-bold leading-tight">Agregar prestador de servicio</span>
          </button>
        </div>
      </div>
    </div>
  );
}