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
      toast({ kind: "error", message: "Selecciona una calificación primero" });
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
      <div className="mb-5 text-center">
        <div
          aria-hidden
          className="mx-auto mb-4 flex h-[80px] w-[80px] items-center justify-center rounded-2xl bg-primary-light text-5xl"
        >
          {contact.category_emoji ?? "🔧"}
        </div>
        <h2 className="mb-2 break-words text-2xl font-bold text-foreground">{contact.name}</h2>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-4 py-1.5 text-sm font-semibold text-primary-dark">
          {contact.category_emoji ?? "🛠️"} {contact.category_label ?? "Servicio"}
        </span>
      </div>

      <div className="space-y-3 border-y border-border py-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-muted-foreground">Calificación</span>
          {contact.rating_count > 0 ? (
            <StarRating
              value={Number(contact.avg_rating)}
              count={contact.rating_count}
              size="sm"
              showValue
            />
          ) : (
            <span className="text-sm italic text-muted-foreground">Sin votos</span>
          )}
        </div>
        {contact.added_by_name ? (
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-muted-foreground">Recomendado por</span>
            <span className="text-right font-medium text-foreground">
              {contact.added_by_name}
              {contact.floor || contact.apartment ? (
                <span className="block text-xs text-muted-foreground">
                  {contact.floor ? `Piso ${contact.floor}` : ""}
                  {contact.floor && contact.apartment ? " · " : ""}
                  {contact.apartment ? `Apt ${contact.apartment}` : ""}
                </span>
              ) : null}
            </span>
          </div>
        ) : null}
      </div>

      {alreadyVoted ? (
        <div className="mt-5 rounded-xl bg-success-bg p-3 text-center text-sm font-semibold text-success">
          ✓ Ya calificaste este contacto
        </div>
      ) : (
        <div className="mt-5">
          <p className="mb-3 text-center text-sm font-semibold text-muted-foreground">¿Cómo te fue?</p>
          <InteractiveStarRating value={rating} onChange={setRating} disabled={submitting} />
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {!alreadyVoted ? (
          <Button variant="primary" size="lg" onClick={handleVote} loading={submitting} disabled={rating === 0} fullWidth>
            Enviar calificación
          </Button>
        ) : null}
        <Button
          variant="whatsapp"
          size="lg"
          onClick={() => window.open(wa, "_blank", "noopener,noreferrer")}
          fullWidth
        >
          💬 Abrir WhatsApp
        </Button>
        <Button variant="ghost" size="md" onClick={onClose} fullWidth>
          Cerrar
        </Button>
      </div>
    </Modal>
  );
}