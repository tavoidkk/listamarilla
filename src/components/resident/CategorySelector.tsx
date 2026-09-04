"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

interface Category {
  id: string;
  key: string;
  label: string;
  emoji: string;
}

interface CategorySelectorProps {
  categories: Category[];
  orgName?: string;
  onSelect: (category: Category) => void;
  onAddClick: () => void;
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function CategorySelector({ categories, orgName, onSelect, onAddClick }: CategorySelectorProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = normalizeText(query);
    if (!q) return categories;
    return categories.filter((c) => normalizeText(c.label).includes(q));
  }, [categories, query]);

  return (
    <div className="flex w-full min-h-screen flex-col bg-white">
      <header className="relative overflow-hidden bg-amber-400 px-6 pb-8 pt-10 md:pt-12 shadow-md">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(ellipse_at_top_right,_#fff_0%,_transparent_55%)]"
        />
        <div className="relative">
          <p className="mb-1 text-center text-xs font-extrabold uppercase tracking-[0.35em] text-black">
            LISTAMARILLA
          </p>
          {orgName ? (
            <p className="mb-3 text-center text-xs font-semibold text-orange-500/100">{orgName}</p>
          ) : null}
          <h1 className="mb-5 text-center text-3xl font-black tracking-tight text-slate-850 md:text-4xl drop-shadow-sm">
            ¿Qué servicio necesitas?
          </h1>

          <div className="relative mx-auto max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar plomería, electricista, pintura..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 w-full rounded-xl border border-amber-500/30 bg-white/95 backdrop-blur-sm pl-11 pr-10 text-[15px] font-medium text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-amber-500 focus:shadow-md focus:outline-none"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Limpiar búsqueda"
                className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <div className="flex-1 px-6 pb-8 pt-6">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-10 text-center">
            <p className="text-sm font-semibold text-slate-500">
              Sin resultados para &ldquo;{query.trim()}&rdquo;
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-3 text-sm font-bold text-amber-600 underline-offset-4 hover:underline"
            >
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {filtered.map((cat) => (
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

            {!query.trim() ? (
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
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
