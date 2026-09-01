"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { StarRating, InteractiveStarRating } from "@/components/ui/StarRating";
import { toast } from "@/components/ui/Toast";

export interface ContactDetail {
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
}

interface ContactDetailModalProps {
  open: boolean;
  contact: ContactDetail | null;
  alreadyVoted: boolean;
  onClose: () => void;
  onSubmitVote: (rating: number) => Promise<void>;
}

export function ContactDetailModal({
  open,
  contact,
  alreadyVoted,
  onClose,
  onSubmitVote,
}: ContactDetailModalProps) {
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  if (!contact) return null;

  const wa = `https://wa.me/${contact.phone.replace(/\D/g, "")}`;

  async function handleVote() {
    if (rating === 0) {
      toast({ kind: "error", message: "Selecciona una calificación" });
      return;
    }
    setSubmitting(true);
    try {
      await onSubmitVote(rating);
      setRating(0);
      toast({ kind: "success", message: "¡Gracias por tu calificación!" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al registrar voto";
      toast({ kind: "error", message: msg });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} variant="bottom" ariaLabel="Detalle de contacto">
      <div className="mb-4 text-center">
        <div
          aria-hidden
          className="mx-auto mb-4 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[color:var(--color-primary-light)] text-[48px]"
        >
          {contact.category_emoji ?? "🔧"}
        </div>
        <h2 className="mb-2 break-words text-2xl font-bold text-[color:var(--color-text-primary)]">
          {contact.name}
        </h2>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-primary-light)] px-3.5 py-1.5 text-[13px] font-semibold text-[color:var(--color-primary)]">
          {contact.category_emoji ?? "🛠️"} {contact.category_label ?? "Servicio"}
        </span>
      </div>

      <div className="border-t border-[color:var(--color-border)] px-0 py-6">
        <div className="mb-4 flex items-center justify-between gap-4 px-0 text-sm">
          <span className="text-[color:var(--color-text-muted)]">Calificación</span>
          <StarRating
            value={Number(contact.avg_rating)}
            count={contact.rating_count}
            size="sm"
            showValue
          />
        </div>
        {contact.added_by_name ? (
          <div className="mb-4 flex items-center justify-between gap-4 text-sm">
            <span className="text-[color:var(--color-text-muted)]">Agregado por</span>
            <span className="text-right font-medium text-[color:var(--color-text-primary)]">
              {contact.added_by_name}
              {contact.floor || contact.apartment ? (
                <span className="block text-xs text-[color:var(--color-text-muted)]">
                  {contact.floor ? `P${contact.floor}` : ""}
                  {contact.floor && contact.apartment ? " · " : ""}
                  {contact.apartment ? `Apt ${contact.apartment}` : ""}
                </span>
              ) : null}
            </span>
          </div>
        ) : null}
      </div>

      {alreadyVoted ? (
        <p className="mb-2 text-center text-sm font-semibold text-[color:var(--color-success)]">
          Ya calificaste a este contacto
        </p>
      ) : (
        <div className="border-t border-[color:var(--color-border)] pt-6">
          <p className="mb-4 text-center text-sm font-semibold text-[color:var(--color-text-secondary)]">
            Califica este servicio
          </p>
          <InteractiveStarRating value={rating} onChange={setRating} disabled={submitting} />
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 border-t border-[color:var(--color-border)] pt-6">
        {!alreadyVoted ? (
          <Button variant="primary" onClick={handleVote} loading={submitting} disabled={rating === 0} fullWidth>
            Enviar calificación
          </Button>
        ) : null}
        <Button
          variant="whatsapp"
          onClick={() => window.open(wa, "_blank", "noopener,noreferrer")}
          fullWidth
        >
          💬 Abrir WhatsApp
        </Button>
        <Button variant="ghost" onClick={onClose} fullWidth>
          Cerrar
        </Button>
      </div>
    </Modal>
  );
}