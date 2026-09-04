"use client";

import { ChevronRight, Phone } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";

export interface ContactItem {
  id: string;
  name: string;
  phone: string;
  category_emoji: string | null;
  category_label: string | null;
  avg_rating: number;
  rating_count: number;
  added_by_name: string | null;
}

interface ContactCardProps {
  contact: ContactItem;
  onTap: () => void;
}

export function ContactCard({ contact, onTap }: ContactCardProps) {
  return (
    <button
      type="button"
      onClick={onTap}
      className="group mb-3 flex w-full cursor-pointer flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-md active:scale-[0.98] focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:outline-none"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-50 text-2xl transition-transform duration-200 group-hover:scale-105"
        >
          {contact.category_emoji ?? "🔧"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="mb-1 truncate text-base font-bold text-slate-900">{contact.name}</p>
          <p className="truncate text-sm text-slate-500">
            {contact.category_label ?? "Servicio"}
          </p>
          <p className="mt-1 flex items-center gap-1 truncate text-sm font-semibold text-slate-700">
            <Phone className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" aria-hidden />
            {contact.phone}
          </p>
        </div>
        <span
          aria-hidden
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-base text-slate-500 transition-all duration-200 group-hover:bg-amber-100 group-hover:text-amber-700"
        >
          <ChevronRight className="h-4 w-4" />
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <div className="flex flex-col gap-0.5">
          {contact.rating_count > 0 ? (
            <StarRating value={Number(contact.avg_rating)} count={contact.rating_count} size="sm" />
          ) : (
            <p className="text-sm italic text-slate-400">Sin calificaciones aún</p>
          )}
          {contact.added_by_name ? (
            <p className="truncate text-xs text-slate-500">
              Agregado por {contact.added_by_name}
            </p>
          ) : null}
        </div>
      </div>
    </button>
  );
}