"use client";

import { useEffect, useState } from "react";
import { Disclaimer } from "@/components/resident/Disclaimer";
import { CategorySelector } from "@/components/resident/CategorySelector";
import { ContactList, type ContactItem } from "@/components/resident/ContactList";
import { ContactDetailModal, type ContactDetail } from "@/components/resident/ContactDetailModal";
import {
  RegisterModal,
  type CategoryOption,
  type NewContactPayload,
} from "@/components/resident/RegisterModal";
import { createClient } from "@/lib/supabase/client";
import { getSessionId } from "@/lib/session";

const DISCLAIMER_KEY_PREFIX = "pa:disclaimer-accepted:";

interface Props {
  orgId: string;
  orgSlug: string;
  orgName: string;
}

export function ResidentPortal({ orgId, orgSlug, orgName }: Props) {
  // Inicializamos como null para evitar mismatch de hidratación: SSR siempre muestra
  // el Disclaimer, y en el cliente se ajusta si ya fue aceptado.
  const [disclaimerAccepted, setDisclaimerAccepted] = useState<boolean | null>(null);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption | null>(null);
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [detailContact, setDetailContact] = useState<ContactDetail | null>(null);
  const [alreadyVoted, setAlreadyVoted] = useState(false);

  // Hidratar el estado del disclaimer desde sessionStorage SOLO en cliente
  useEffect(() => {
    if (typeof window === "undefined") return;
    const accepted = sessionStorage.getItem(DISCLAIMER_KEY_PREFIX + orgSlug) === "1";
    setDisclaimerAccepted(accepted);
  }, [orgSlug]);

  useEffect(() => {
    let cancelled = false;
    async function loadCategories() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("categories")
        .select("id, key, label, emoji, sort_order")
        .eq("org_id", orgId)
        .order("sort_order", { ascending: true });
      if (cancelled) return;
      if (!error && data) setCategories(data as CategoryOption[]);
    }
    void loadCategories();
    return () => {
      cancelled = true;
    };
  }, [orgId]);

  useEffect(() => {
    if (!selectedCategory) return;
    const category = selectedCategory;
    let cancelled = false;
    async function loadContacts() {
      setContactsLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("contacts")
        .select("id, name, category_emoji, category_label, avg_rating, rating_count, added_by_name")
        .eq("org_id", orgId)
        .eq("category_id", category.id)
        .order("avg_rating", { ascending: false });
      if (cancelled) return;
      setContactsLoading(false);
      if (!error && data) setContacts(data as ContactItem[]);
      else setContacts([]);
    }
    void loadContacts();
    return () => {
      cancelled = true;
    };
  }, [orgId, selectedCategory]);

  async function loadContactDetail(contact: ContactItem) {
    const supabase = createClient();
    const { data } = await supabase
      .from("contacts")
      .select(
        "id, name, phone, category_emoji, category_label, avg_rating, rating_count, added_by_name, floor, apartment",
      )
      .eq("id", contact.id)
      .single();
    if (!data) return;
    const d = data as {
      id: string;
      name: string;
      phone: string;
      category_emoji: string | null;
      category_label: string | null;
      avg_rating: number;
      rating_count: number;
      added_by_name: string | null;
      floor: number | null;
      apartment: string | null;
    };
    setDetailContact({
      id: d.id,
      name: d.name,
      phone: d.phone,
      category_emoji: d.category_emoji,
      category_label: d.category_label,
      avg_rating: d.avg_rating,
      rating_count: d.rating_count,
      added_by_name: d.added_by_name,
      floor: d.floor,
      apartment: d.apartment,
    });
    const sessionId = getSessionId();
    if (sessionId) {
      const { data: vote } = await supabase
        .from("votes")
        .select("id")
        .eq("contact_id", contact.id)
        .eq("session_id", sessionId)
        .maybeSingle();
      setAlreadyVoted(Boolean(vote));
    } else {
      setAlreadyVoted(false);
    }
  }

  function handleAcceptDisclaimer() {
    sessionStorage.setItem(DISCLAIMER_KEY_PREFIX + orgSlug, "1");
    setDisclaimerAccepted(true);
  }

  async function handleSubmitContact(payload: NewContactPayload): Promise<void> {
    const supabase = createClient();
    const sessionId = getSessionId();
    if (!sessionId) throw new Error("No se pudo identificar la sesión del navegador");

    const { error } = await supabase.rpc("add_contact_resident", {
      p_org_slug: orgSlug,
      p_security_code: payload.security_code,
      p_phone: payload.phone,
      p_phone_normalized: payload.phone_normalized,
      p_name: payload.name,
      p_category_key: payload.category_key,
      p_category_label: payload.category_label,
      p_category_emoji: payload.category_emoji,
      p_new_category: payload.new_category,
      p_added_by_name: payload.added_by_name,
      p_added_by_session: sessionId,
      p_floor: payload.floor ?? undefined,
      p_apartment: payload.apartment ?? undefined,
    });
    if (error) throw error;

    if (payload.new_category) {
      const { data: cats } = await supabase
        .from("categories")
        .select("id, key, label, emoji, sort_order")
        .eq("org_id", orgId)
        .order("sort_order", { ascending: true });
      if (cats) setCategories(cats as CategoryOption[]);
    }
    if (selectedCategory && selectedCategory.key === payload.category_key) {
      setContactsLoading(true);
      const { data: refreshed } = await supabase
        .from("contacts")
        .select("id, name, category_emoji, category_label, avg_rating, rating_count, added_by_name")
        .eq("org_id", orgId)
        .eq("category_id", selectedCategory.id)
        .order("avg_rating", { ascending: false });
      setContactsLoading(false);
      if (refreshed) setContacts(refreshed as ContactItem[]);
    }
  }

  async function handleVote(rating: number) {
    if (!detailContact) return;
    const sessionId = getSessionId();
    if (!sessionId) throw new Error("No se pudo identificar la sesión del navegador");

    const supabase = createClient();
    const { data, error } = await supabase.rpc("submit_vote", {
      p_contact_id: detailContact.id,
      p_session_id: sessionId,
      p_rating: rating,
    });
    if (error) throw error;

    if (!data) return;
    const updated = data as unknown as ContactDetail;
    setDetailContact((prev) =>
      prev
        ? {
            ...prev,
            avg_rating: Number(updated.avg_rating),
            rating_count: updated.rating_count,
          }
        : prev,
    );
    setContacts((prev) =>
      prev.map((c) =>
        c.id === updated.id
          ? {
              ...c,
              avg_rating: Number(updated.avg_rating),
              rating_count: updated.rating_count,
            }
          : c,
      ),
    );
    setAlreadyVoted(true);
  }

  if (disclaimerAccepted !== true) {
    return <Disclaimer orgName={orgName} onAccept={handleAcceptDisclaimer} />;
  }

  if (!selectedCategory) {
    return (
      <>
        <CategorySelector
          categories={categories}
          orgName={orgName}
          onSelect={setSelectedCategory}
          onAddClick={() => setRegisterOpen(true)}
        />
        <RegisterModal
          open={registerOpen}
          orgId={orgId}
          categories={categories}
          onClose={() => setRegisterOpen(false)}
          onSubmit={handleSubmitContact}
          requireSecurityCode
        />
      </>
    );
  }

  return (
    <>
      {/* Header amarillo cuando estás dentro de una categoría */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-amber-500/30 bg-amber-400 px-6 py-4 shadow-md">
        <button
          type="button"
          onClick={() => setSelectedCategory(null)}
          aria-label="Volver"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-amber-600/20 bg-white text-xl text-slate-900 shadow-sm transition-all duration-200 hover:bg-amber-50 active:scale-95"
        >
          ←
        </button>
        <div className="flex flex-1 flex-col items-center gap-0.5 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-900/80">{orgName}</p>
          <p className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-900">
            <span aria-hidden>{selectedCategory.emoji}</span>
            {selectedCategory.label}
          </p>
        </div>
        <span className="h-11 w-11" aria-hidden />
      </header>

      <ContactList
        contacts={contacts}
        loading={contactsLoading}
        onCardTap={loadContactDetail}
        onAddClick={() => setRegisterOpen(true)}
      />

      {/* Botón flotante + agregar en amarillo */}
      <button
        type="button"
        onClick={() => setRegisterOpen(true)}
        aria-label="Agregar contacto"
        className="fixed bottom-6 right-6 z-50 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-amber-400 text-3xl font-light text-slate-900 shadow-xl ring-4 ring-amber-400/20 transition-all duration-200 hover:scale-105 hover:bg-amber-500 hover:shadow-2xl active:scale-[0.93]"
      >
        +
      </button>

      <RegisterModal
        open={registerOpen}
        orgId={orgId}
        categories={categories}
        onClose={() => setRegisterOpen(false)}
        onSubmit={handleSubmitContact}
        requireSecurityCode
      />

      <ContactDetailModal
        open={detailContact !== null}
        contact={detailContact}
        alreadyVoted={alreadyVoted}
        onClose={() => setDetailContact(null)}
        onSubmitVote={handleVote}
      />
    </>
  );
}