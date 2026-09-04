"use client";

import { useEffect, useRef, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { StarRating, InteractiveStarRating } from "@/components/ui/StarRating";
import { Check, Copy, Phone } from "lucide-react";
import { toast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";

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

export type VotePayload = {
  rating: number;
  voterName: string;
  floor: number;
  apartment: string;
  comment?: string;
};

interface ContactDetailModalProps {
  open: boolean;
  contact: ContactDetail | null;
  orgId: string;
  alreadyVoted: boolean;
  onClose: () => void;
  onSubmitVote: (vote: VotePayload) => Promise<void>;
}

interface FloorConfig {
  total_floors: number;
  apartment_labels: string[];
  special_floor_labels: Record<string, number>;
}

const DEFAULT_FLOORS: FloorConfig = {
  total_floors: 13,
  apartment_labels: ["A", "B", "C"],
  special_floor_labels: {},
};

const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

export function ContactDetailModal({
  open,
  contact,
  orgId,
  alreadyVoted: alreadyVotedProp,
  onClose,
  onSubmitVote,
}: ContactDetailModalProps) {
  const [rating, setRating] = useState(0);
  const [voterName, setVoterName] = useState("");
  const [floor, setFloor] = useState("");
  const [apartment, setApartment] = useState("");
  const [comment, setComment] = useState("");
  const [alreadyVoted, setAlreadyVoted] = useState(alreadyVotedProp);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [floorConfig, setFloorConfig] = useState<FloorConfig>(DEFAULT_FLOORS);
  const floorConfigLoadedRef = useRef(false);

  useEffect(() => {
    if (!open) return;
    if (!floorConfigLoadedRef.current) {
      floorConfigLoadedRef.current = true;
      const supabase = createClient();
      void supabase
        .from("org_floor_config")
        .select("total_floors, apartment_labels, special_floor_labels")
        .eq("org_id", orgId)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            setFloorConfig({
              total_floors: (data as { total_floors: number }).total_floors,
              apartment_labels: (data as { apartment_labels: string[] }).apartment_labels,
              special_floor_labels:
                ((data as { special_floor_labels: Record<string, number> }).special_floor_labels ??
                  {}) ?? {},
            });
          }
        });
    }
  }, [open, orgId]);

  if (!contact) return null;

  const currentContact = contact;
  const wa = `https://wa.me/${contact.phone.replace(/\D/g, "")}`;

  const numberedFloors = Array.from({ length: floorConfig.total_floors }, (_, i) => i + 1);
  const voteFloorOptions = numberedFloors.map((f) => ({ value: String(f), label: String(f) }));

  function setError(field: string, msg: string) {
    setErrors((p) => {
      if (!msg) {
        const { [field]: _, ...rest } = p;
        return rest;
      }
      return { ...p, [field]: msg };
    });
  }

  async function handleCopy() {
    const number = currentContact.phone;
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

  async function handleVote() {
    const next: Record<string, string> = {};
    if (rating === 0) next.rating = "Selecciona una calificación";
    if (voterName.trim().length < 3 || !NAME_REGEX.test(voterName)) {
      next.voterName = "Ingresa tu nombre y apellido (mínimo 3 letras)";
    }
    if (!floor) next.floor = "Selecciona tu piso";
    if (!apartment) next.apartment = "Selecciona tu apartamento";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const floorNum = Number(floor);
    const supabase = createClient();

    // Un solo voto por unidad (piso + apt): verificar antes de enviar.
    const { data: existing } = await supabase
      .from("votes")
      .select("id")
      .eq("contact_id", currentContact.id)
      .eq("floor", floorNum)
      .eq("apartment", apartment)
      .maybeSingle();

    if (existing) {
      setAlreadyVoted(true);
      toast({ kind: "error", message: "Este piso/apartamento ya calificó a este contacto" });
      return;
    }

    setSubmitting(true);
    try {
      await onSubmitVote({
        rating,
        voterName: voterName.trim(),
        floor: floorNum,
        apartment: apartment.trim(),
        comment: comment.trim() || undefined,
      });
      setAlreadyVoted(true);
      setRating(0);
      setVoterName("");
      setFloor("");
      setApartment("");
      setComment("");
      toast({ kind: "success", message: "¡Gracias por tu calificación!" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al registrar voto";
      if (msg.includes("Ya calificaste") || msg.includes("piso/apartamento")) {
        setAlreadyVoted(true);
      }
      toast({ kind: "error", message: msg });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} variant="center" ariaLabel="Detalle de contacto">
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
        <p className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-black">
          <Phone className="h-4 w-4 text-[#25D366]" aria-hidden />
          <a
            href={`tel:${contact.phone.replace(/\D/g, "")}`}
            className="underline-offset-4 hover:underline"
          >
            {contact.phone}
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

      {contact.reviews.length > 0 ? (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Comentarios de vecinos
          </p>
          {contact.reviews.map((r) => (
            <div key={r.id} className="rounded-xl bg-surface p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-foreground">{r.voter_name}</span>
                <span className="text-xs text-muted-foreground">
                  {r.floor != null ? `Piso ${r.floor} · Apt ${r.apartment ?? "—"}` : "Vecino"}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <StarRating value={r.rating} size="sm" />
              </div>
              {r.comment ? (
                <p className="mt-1 text-sm text-muted-foreground">{r.comment}</p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {alreadyVoted ? (
        <div className="mt-5 rounded-xl bg-success-bg p-3 text-center text-sm font-semibold text-success">
          ✓ Ya calificaste este contacto desde tu piso/apartamento
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          <div>
            <p className="mb-3 text-center text-sm font-semibold text-muted-foreground">
              ¿Cómo te fue?
            </p>
            <InteractiveStarRating value={rating} onChange={setRating} disabled={submitting} />
            {errors.rating ? (
              <p className="mt-1 text-center text-[13px] font-medium text-danger">{errors.rating}</p>
            ) : null}
          </div>

          {rating > 0 ? (
            <>
              <Field
                id="voter-name"
                label="Tu nombre y apellido"
                placeholder="Ej: María García"
                autoComplete="name"
                value={voterName}
                onChange={(e) => {
                  const v = e.target.value;
                  setVoterName(v);
                  setError("voterName", v && !NAME_REGEX.test(v) ? "Solo letras y espacios" : "");
                }}
                disabled={submitting}
                error={errors.voterName}
              />

              <div className="grid grid-cols-2 gap-3">
                <Field
                  as="select"
                  id="vote-floor"
                  label="Tu piso"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  disabled={submitting}
                  error={errors.floor}
                  options={[
                    { value: "", label: "Piso" },
                    ...voteFloorOptions,
                  ]}
                />
                <Field
                  as="select"
                  id="vote-apartment"
                  label="Apartamento"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  disabled={submitting}
                  error={errors.apartment}
                  options={[
                    { value: "", label: "Apt" },
                    ...floorConfig.apartment_labels.map((a) => ({ value: a, label: a })),
                  ]}
                />
              </div>

              <Field
                as="textarea"
                id="vote-comment"
                label="Comentario"
                optional
                placeholder="Cuéntale a tus vecinos cómo te fue (opcional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={submitting}
                maxLength={280}
              />

              <Button
                variant="primary"
                size="lg"
                onClick={() => void handleVote()}
                loading={submitting}
                fullWidth
              >
                Enviar calificación
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Solo se permite una calificación por piso y apartamento.
              </p>
            </>
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