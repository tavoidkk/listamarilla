"use client";

import { ContactCard, type ContactItem } from "./ContactCard";
import { PageSpinner } from "@/components/ui/Spinner";

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
        <PageSpinner />
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="flex-1 px-6 pb-[120px] pt-4">
        <div className="py-8 text-center">
          <p aria-hidden className="mb-4 text-6xl opacity-70">
            🔍
          </p>
          <h3 className="mb-1 text-lg font-semibold text-[color:var(--color-primary-light)]">
            Aún no hay contactos en esta categoría
          </h3>
          <p className="mb-6 text-lg text-[color:var(--color-primary-light)]">Sé el primero en agregar uno</p>
          <button
            type="button"
            onClick={onAddClick}
            className="inline-flex h-12 items-center justify-center gap-1.5 rounded-full bg-[color:var(--color-primary-light)] px-6 text-[15px] font-semibold text-[color:var(--color-primary)] transition-colors hover:bg-[color:var(--color-primary)] hover:text-white"
          >
            + Agregar el primero
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