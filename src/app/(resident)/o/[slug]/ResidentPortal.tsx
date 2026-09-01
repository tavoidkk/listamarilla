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

function readDisclaimer(orgSlug: string): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(DISCLAIMER_KEY_PREFIX + orgSlug) === "1";
}

export function ResidentPortal({ orgId, orgSlug, orgName }: Props) {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState<boolean>(() => readDisclaimer(orgSlug));
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption | null>(null);
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [detailContact, setDetailContact] = useState<ContactDetail | null>(null);
  const [alreadyVoted, setAlreadyVoted] = useState(false);

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
    if (data) {
      setDetailContact(data as ContactDetail);
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
  }

  function handleAcceptDisclaimer() {
    sessionStorage.setItem(DISCLAIMER_KEY_PREFIX + orgSlug, "1");
    setDisclaimerAccepted(true);
  }

  async function handleSubmitContact(payload: NewContactPayload) {
    const supabase = createClient();
    const sessionId = getSessionId();
    if (!sessionId) throw new Error("No se pudo identificar la sesión del navegador");

    const { data, error } = await supabase.rpc("add_contact_resident", {
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
      p_floor: payload.floor,
      p_apartment: payload.apartment,
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
    return data;
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

    if (data) {
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
  }

  if (!disclaimerAccepted) {
    return <Disclaimer orgName={orgName} onAccept={handleAcceptDisclaimer} />;
  }

  if (!selectedCategory) {
    return (
      <>
        <CategorySelector
          categories={categories}
          onSelect={setSelectedCategory}
          onAddClick={() => setRegisterOpen(true)}
        />
        <RegisterModal
          open={registerOpen}
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
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/40 bg-[color:var(--color-base)]/82 px-6 py-4 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setSelectedCategory(null)}
          aria-label="Volver"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[22px] text-[color:var(--color-text-primary)] shadow-sm transition-transform active:scale-95"
        >
          ←
        </button>
        <div className="flex flex-1 flex-col items-center gap-[2px] text-center">
          <p className="text-sm font-semibold text-[color:var(--color-primary)]">{orgName}</p>
          <p className="inline-flex items-center gap-1.5 text-xs text-[color:var(--color-text-secondary)]">
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

      <button
        type="button"
        onClick={() => setRegisterOpen(true)}
        aria-label="Agregar contacto"
        className="fixed bottom-6 right-6 z-50 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[color:var(--color-primary)] text-[28px] font-light text-white shadow-lg transition-transform active:scale-[0.93]"
      >
        +
      </button>

      <RegisterModal
        open={registerOpen}
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