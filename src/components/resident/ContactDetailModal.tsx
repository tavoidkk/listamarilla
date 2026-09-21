"use client";

import { useState } from "react";
import { Check, Copy, Phone } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { StarRating, InteractiveStarRating } from "@/components/ui/StarRating";
import { toast } from "@/components/ui/Toast";
import { normalizeVenezuelanPhone, toVenezuelanE164 } from "@/lib/phone";

export interface VoteReview {
  id: string;
  voter_name: string | null;
  floor: number | null;
  apartment: string | null;
  comment: string | null;
  rating: number;
  created_at: string;
}

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
  reviews: VoteReview[];
}

interface ContactDetailModalProps {
  open: boolean;
  contact: ContactDetail | null;
  alreadyVoted: boolean;
  onClose: () => void;
  onSubmitVote: (rating: number, comment?: string) => Promise<void>;
}

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null && "message" in err) {
    const m = (err as { message?: unknown }).message;
    if (typeof m === "string" && m.trim()) return m;
  }
  if (typeof err === "string" && err.trim()) return err;
  return "No se pudo registrar la calificación. Inténtalo de nuevo.";
}

export function ContactDetailModal({
  open,
  contact,
  alreadyVoted,
  onClose,
  onSubmitVote,
}: ContactDetailModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [voted, setVoted] = useState(alreadyVoted);

  if (!contact) return null;

  const currentContact = contact;
  const normalizedPhone = normalizeVenezuelanPhone(contact.phone);
  const displayPhone = toVenezuelanE164(contact.phone);
  const wa = `https://wa.me/${normalizedPhone}`;

  async function handleVote(value: number, text?: string) {
    if (submitting || value === 0) return;
    setSubmitting(true);
    setRating(value);
    try {
      await onSubmitVote(value, text?.trim() || undefined);
      setVoted(true);
      toast({ kind: "success", message: "¡Gracias por tu calificación!" });
    } catch (err) {
      const msg = getErrorMessage(err);
      if (msg.toLowerCase().includes("ya calificaste")) {
        setVoted(true);
      }
      toast({ kind: "error", message: msg });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCopy() {
    const number = toVenezuelanE164(currentContact.phone);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(number);
      } else {
        const ta = document.createElement("textarea");
        ta.value = number;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      toast({ kind: "success", message: "Número copiado" });
    } catch {
      toast({ kind: "error", message: "No se pudo copiar el número" });
    }
  }

  return (
    <Modal open={open} onClose={onClose} variant="center" ariaLabel="Detalle de contacto">
      <div className="mb-5 text-center">
        <div
          aria-hidden
          className="bg-primary-light mx-auto mb-4 flex h-[80px] w-[80px] items-center justify-center rounded-2xl text-5xl"
        >
          {contact.category_emoji ?? "🔧"}
        </div>
        <h2 className="mb-2 break-words text-2xl font-bold text-black">{contact.name}</h2>
        <span className="bg-primary-light text-primary-dark inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold">
          {contact.category_emoji ?? "🛠️"} {contact.category_label ?? "Servicio"}
        </span>
        <p className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-black">
          <Phone className="h-4 w-4 text-[#25D366]" aria-hidden />
          <a href={`tel:${displayPhone}`} className="underline-offset-4 hover:underline">
            {displayPhone}
          </a>
          <button
            type="button"
            onClick={() => void handleCopy()}
            aria-label="Copiar número de teléfono"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 active:scale-90"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </p>
      </div>

      <div className="border-border space-y-3 border-y py-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground text-sm font-medium">Calificación</span>
          {contact.rating_count > 0 ? (
            <StarRating
              value={Number(contact.avg_rating)}
              count={contact.rating_count}
              size="sm"
              showValue
            />
          ) : (
            <span className="text-muted-foreground text-sm italic">Sin votos</span>
          )}
        </div>
        {contact.added_by_name ? (
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-muted-foreground">Recomendado por</span>
            <span className="text-right font-medium text-black">
              {contact.added_by_name}
              {contact.floor || contact.apartment ? (
                <span className="text-muted-foreground block text-xs">
                  {contact.floor ? `Piso ${contact.floor}` : ""}
                  {contact.floor && contact.apartment ? " · " : ""}
                  {contact.apartment ? `Apt ${contact.apartment}` : ""}
                </span>
              ) : null}
            </span>
          </div>
        ) : null}
      </div>

      {contact.reviews.length > 0 ? (
        <div className="mt-4 space-y-2">
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
            Comentarios de vecinos
          </p>
          {contact.reviews.map((r) => (
            <div key={r.id} className="bg-surface rounded-xl p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-black">
                  {r.voter_name ?? "Vecino anónimo"}
                </span>
                <span className="text-muted-foreground text-xs">
                  {r.floor != null ? `Piso ${r.floor} · Apt ${r.apartment ?? "—"}` : ""}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <StarRating value={r.rating} size="sm" />
                {r.comment ? <span className="text-muted-foreground text-xs">·</span> : null}
              </div>
              {r.comment ? <p className="text-muted-foreground mt-1 text-sm">{r.comment}</p> : null}
            </div>
          ))}
        </div>
      ) : null}

      {voted ? (
        <div className="bg-success-bg text-success mt-5 rounded-xl p-3 text-center text-sm font-semibold">
          ✓ Ya calificaste este contacto
        </div>
      ) : (
        <div className="mt-5 text-center">
          <p className="text-muted-foreground mb-3 text-sm font-semibold">¿Cómo te fue?</p>
          <InteractiveStarRating
            value={rating}
            onChange={(n) => {
              setRating(n);
              setComment("");
              setCopied(false);
            }}
            disabled={submitting}
          />
          {rating > 0 ? (
            <div className="mt-4 space-y-3 text-left">
              <textarea
                id="vote-comment"
                placeholder="Cuéntale a tus vecinos cómo te fue (opcional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={submitting}
                maxLength={280}
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
              <Button
                variant="primary"
                size="lg"
                onClick={() => void handleVote(rating, comment)}
                loading={submitting}
                fullWidth
              >
                Enviar calificación
              </Button>
              <p className="text-muted-foreground text-center text-xs">
                Voto anónimo · un voto por navegador
              </p>
            </div>
          ) : null}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3">
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
