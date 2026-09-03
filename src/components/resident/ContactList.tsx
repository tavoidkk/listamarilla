"use client";

import { Plus, Inbox } from "lucide-react";
import { ContactCard, type ContactItem } from "./ContactCard";
import { CardSkeleton } from "@/components/ui/Spinner";

export type { ContactItem };

interface ContactListProps {
  contacts: ContactItem[];
  loading: boolean;
  onCardTap: (c: ContactItem) => void;
  onAddClick: () => void;
}

export function ContactList({ contacts, loading, onCardTap, onAddClick }: ContactListProps) {
  if (loading) {
    return (
      <div className="flex-1 px-6 pb-[120px] pt-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="flex-1 px-6 pb-[120px] pt-8">
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
          <div
            aria-hidden
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm"
          >
            <Inbox className="h-7 w-7 text-amber-500" />
          </div>
          <h3 className="mb-1 text-lg font-bold text-slate-900">Aún no hay contactos aquí</h3>
          <p className="mb-5 text-sm text-slate-500">Sé el primero en compartir uno</p>
          <button
            type="button"
            onClick={onAddClick}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 text-sm font-bold text-slate-900 shadow-sm transition-all duration-200 hover:bg-amber-500 hover:shadow-md active:scale-95"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Agregar el primero
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 px-6 pb-[120px] pt-4">
      {contacts.map((c) => (
        <ContactCard key={c.id} contact={c} onTap={() => onCardTap(c)} />
      ))}
    </div>
  );
}