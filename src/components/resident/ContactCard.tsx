"use client";

import { StarRating } from "@/components/ui/StarRating";

export interface ContactItem {
  id: string;
  name: string;
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
      className="mb-3 flex w-full cursor-pointer flex-col gap-4 rounded-xl bg-white/96 p-4 text-left shadow-sm backdrop-blur transition-transform duration-100 hover:shadow-md active:scale-[0.98]"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[color:var(--color-primary-light)] text-3xl"
        >
          {contact.category_emoji ?? "🔧"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="mb-[2px] truncate text-lg font-semibold text-[color:var(--color-text-primary)]">
            {contact.name}
          </p>
          <p className="text-[13px] text-[color:var(--color-text-secondary)]">
            {contact.category_label ?? "Servicio"}
          </p>
        </div>
        <span aria-hidden className="text-lg text-[color:var(--color-text-muted)]">
          →
        </span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
          {contact.rating_count > 0 ? (
            <StarRating value={Number(contact.avg_rating)} count={contact.rating_count} size="sm" />
          ) : (
            <p className="text-[13px] italic text-[color:var(--color-text-muted)]">Sin calificaciones aún</p>
          )}
          {contact.added_by_name ? (
            <p className="truncate text-xs text-[color:var(--color-text-muted)]">
              Agregado por: {contact.added_by_name}
            </p>
          ) : null}
        </div>
      </div>
    </button>
  );
}