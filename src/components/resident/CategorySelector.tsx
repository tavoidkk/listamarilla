"use client";

import { Hand } from "lucide-react";

interface Category {
  id: string;
  key: string;
  label: string;
  emoji: string;
}

interface CategorySelectorProps {
  categories: Category[];
  onSelect: (category: Category) => void;
  onAddClick: () => void;
}

export function CategorySelector({ categories, onSelect, onAddClick }: CategorySelectorProps) {
  return (
    <div className="app-fade flex w-full min-h-screen flex-col bg-white">
      {/* Header amarillo - contraste con fondo blanco de cards */}
      <header className="bg-amber-400 px-6 pb-8 pt-8 md:pt-10 shadow-md">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-amber-900/80">
          Directorio de servicios
        </p>
        <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          ¿Qué servicio necesitas?
        </h1>
        <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm border border-amber-500/20">
          <Hand className="h-4 w-4 text-amber-600" aria-hidden="true" />
          Toca una categoría para ver los contactos
        </span>
      </header>

      <div className="flex-1 px-6 pb-8 pt-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat)}
              aria-label={`Ver contactos de ${cat.label}`}
              className="group flex min-h-[130px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-slate-200 bg-white px-3 py-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-400 hover:bg-amber-50/30 hover:shadow-lg active:scale-[0.97] focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:outline-none"
            >
              <span
                aria-hidden
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-4xl transition-all duration-300 group-hover:bg-amber-400 group-hover:scale-110 group-hover:shadow-md"
              >
                {cat.emoji}
              </span>
              <span className="text-sm font-bold text-slate-900 leading-tight">{cat.label}</span>
            </button>
          ))}

          {/* Card "Agregar prestador" - amarillo destacada */}
          <button
            type="button"
            onClick={onAddClick}
            aria-label="Agregar nuevo prestador de servicio"
            className="group relative flex min-h-[130px] cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 border-amber-400 bg-amber-400 px-3 py-5 text-center text-slate-900 shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-amber-500 hover:shadow-xl active:scale-[0.97] focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:outline-none"
          >
            <span
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgb(255_255_255_/_30%),transparent_60%)]"
            />
            <span
              aria-hidden
              className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl font-light text-amber-500 shadow-md transition-transform duration-300 group-hover:scale-110"
            >
              +
            </span>
            <span className="relative text-sm font-extrabold leading-tight text-slate-900">
              Agregar prestador
              <br />
              de servicio
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}