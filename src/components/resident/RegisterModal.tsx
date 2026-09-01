"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { formatVenezuelanDisplay } from "@/lib/phone";

export interface CategoryOption {
  id: string;
  key: string;
  label: string;
  emoji: string;
}

export interface NewContactPayload {
  phone: string;
  phone_normalized: string;
  name: string;
  category_key: string;
  category_label: string;
  category_emoji: string;
  new_category: boolean;
  added_by_name: string;
  floor: number | null;
  apartment: string | null;
  security_code: string;
}

interface RegisterModalProps {
  open: boolean;
  categories: CategoryOption[];
  onClose: () => void;
  onSubmit: (payload: NewContactPayload) => Promise<void>;
  requireSecurityCode: boolean;
}

const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
const PHONE_REGEX = /^[+0-9\s\-]+$/;
const FLOORS = Array.from({ length: 30 }, (_, i) => i + 1);
const APARTMENTS = ["A", "B", "C", "D", "E"];

function isValidName(v: string) {
  return v.trim().length >= 3 && NAME_REGEX.test(v);
}

function countDigits(s: string) {
  return (s || "").replace(/[^0-9]/g, "").length;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

export function RegisterModal({
  open,
  categories,
  onClose,
  onSubmit,
  requireSecurityCode,
}: RegisterModalProps) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [categoryMode, setCategoryMode] = useState<"existing" | "new">("existing");
  const [categoryKey, setCategoryKey] = useState("");
  const [newCategoryLabel, setNewCategoryLabel] = useState("");
  const [newCategoryEmoji, setNewCategoryEmoji] = useState("🔧");
  const [addedBy, setAddedBy] = useState("");
  const [floor, setFloor] = useState("");
  const [apartment, setApartment] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setPhone("");
    setName("");
    setCategoryMode("existing");
    setCategoryKey("");
    setNewCategoryLabel("");
    setNewCategoryEmoji("🔧");
    setAddedBy("");
    setFloor("");
    setApartment("");
    setSecurityCode("");
    setErrors({});
  }

  function handleClose() {
    if (submitting) return;
    reset();
    onClose();
  }

  function validate() {
    const next: Record<string, string> = {};
    if (countDigits(phone) < 7) next.phone = "Ingresa un número válido (mínimo 7 dígitos)";
    if (!isValidName(name)) next.name = "Solo letras y espacios, mínimo 3 caracteres";
    if (categoryMode === "existing" && !categoryKey) next.category = "Selecciona una categoría";
    if (categoryMode === "new") {
      if (!newCategoryLabel.trim() || newCategoryLabel.trim().length < 3)
        next.newCategory = "Mínimo 3 caracteres";
      if (!newCategoryEmoji.trim()) next.newCategoryEmoji = "Selecciona un emoji";
    }
    if (!isValidName(addedBy)) next.addedBy = "Ingresa tu nombre (mínimo 3 letras)";
    if (requireSecurityCode && securityCode.length < 4)
      next.securityCode = "Código del edificio (mínimo 4 caracteres)";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const isNew = categoryMode === "new";
      const key = isNew ? slugify(newCategoryLabel) : categoryKey;
      const label = isNew ? newCategoryLabel.trim() : "";
      const emoji = isNew ? newCategoryEmoji.trim() || "🔧" : "";
      await onSubmit({
        phone: phone.trim(),
        phone_normalized: phone.replace(/\D/g, ""),
        name: name.trim(),
        category_key: key,
        category_label: label,
        category_emoji: emoji,
        new_category: isNew,
        added_by_name: addedBy.trim(),
        floor: floor ? Number(floor) : null,
        apartment: apartment || null,
        security_code: securityCode,
      });
      toast({ kind: "success", message: isNew ? "¡Categoría y contacto creados!" : "¡Contacto agregado!" });
      reset();
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al registrar";
      toast({ kind: "error", message: msg });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} variant="bottom" ariaLabel="Agregar contacto">
      <h2 className="mb-1 text-center text-xl font-bold">Agregar contacto</h2>
      <p className="mb-6 text-center text-sm text-[color:var(--color-text-secondary)]">
        Comparte un contacto de confianza con tus vecinos
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <Field
          id="phone"
          label="Número de teléfono"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+58 412 123 4567"
          value={formatVenezuelanDisplay(phone)}
          onChange={(e) => {
            const v = e.target.value;
            if (v !== "" && !PHONE_REGEX.test(v)) return;
            setPhone(v);
            setErrors((p) => ({ ...p, phone: "" }));
          }}
          disabled={submitting}
          error={errors.phone}
        />

        <Field
          id="name"
          label="Nombre del prestador"
          placeholder="Ej: Juan Pérez"
          autoComplete="off"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((p) => ({ ...p, name: "" }));
          }}
          onKeyDown={(e) => {
            if (
              e.key.length === 1 &&
              !NAME_REGEX.test(e.key) &&
              !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key)
            ) {
              e.preventDefault();
            }
          }}
          disabled={submitting}
          error={errors.name}
        />

        {categoryMode === "existing" ? (
          <Field
            as="select"
            id="category"
            label="Categoría del servicio"
            value={categoryKey}
            onChange={(e) => {
              setCategoryKey(e.target.value);
              setErrors((p) => ({ ...p, category: "" }));
            }}
            disabled={submitting}
            error={errors.category}
            options={[
              { value: "", label: "Selecciona una categoría" },
              ...categories.map((c) => ({ value: c.key, label: `${c.emoji} ${c.label}` })),
            ]}
          />
        ) : (
          <>
            <Field
              id="newCategoryLabel"
              label="Nombre de la nueva categoría"
              placeholder="Ej: Piletas, Fonoaudiólogo..."
              value={newCategoryLabel}
              onChange={(e) => {
                setNewCategoryLabel(e.target.value);
                setErrors((p) => ({ ...p, newCategory: "" }));
              }}
              disabled={submitting}
              error={errors.newCategory}
              hint="Si tu servicio no encaja en ninguna categoría existente, crea una nueva"
            />
            <Field
              id="newCategoryEmoji"
              label="Emoji representativo"
              placeholder="🔧"
              value={newCategoryEmoji}
              onChange={(e) => {
                setNewCategoryEmoji(e.target.value);
                setErrors((p) => ({ ...p, newCategoryEmoji: "" }));
              }}
              disabled={submitting}
              error={errors.newCategoryEmoji}
              maxLength={2}
            />
          </>
        )}

        <button
          type="button"
          onClick={() => setCategoryMode((m) => (m === "existing" ? "new" : "existing"))}
          className="mb-4 text-sm font-semibold text-[color:var(--color-primary)] underline"
          disabled={submitting}
        >
          {categoryMode === "existing"
            ? "+ Crear nueva categoría"
            : "← Elegir categoría existente"}
        </button>

        <Field
          id="addedBy"
          label="Tu nombre (quien lo agrega)"
          placeholder="Ej: María García"
          autoComplete="name"
          value={addedBy}
          onChange={(e) => {
            setAddedBy(e.target.value);
            setErrors((p) => ({ ...p, addedBy: "" }));
          }}
          onKeyDown={(e) => {
            if (
              e.key.length === 1 &&
              !NAME_REGEX.test(e.key) &&
              !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key)
            ) {
              e.preventDefault();
            }
          }}
          disabled={submitting}
          error={errors.addedBy}
          hint="Tu nombre aparecerá como referencia para tus vecinos"
        />

        <div className="mb-4 grid grid-cols-2 gap-3">
          <Field
            as="select"
            id="floor"
            label="Tu piso"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            disabled={submitting}
            options={[{ value: "", label: "Piso" }, ...FLOORS.map((f) => ({ value: String(f), label: String(f) }))]}
          />
          <Field
            as="select"
            id="apartment"
            label="Tu apartamento"
            value={apartment}
            onChange={(e) => setApartment(e.target.value)}
            disabled={submitting}
            options={[{ value: "", label: "Apt" }, ...APARTMENTS.map((a) => ({ value: a, label: a }))]}
          />
        </div>

        {requireSecurityCode ? (
          <Field
            id="securityCode"
            label="Código de seguridad del edificio"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            placeholder="Código que te dio la Junta"
            value={securityCode}
            onChange={(e) => {
              setSecurityCode(e.target.value);
              setErrors((p) => ({ ...p, securityCode: "" }));
            }}
            disabled={submitting}
            error={errors.securityCode}
            hint="La Junta de Condominio te lo proporciona"
          />
        ) : null}

        <Button type="submit" variant="primary" size="lg" loading={submitting} fullWidth>
          Registrar contacto
        </Button>
      </form>
    </Modal>
  );
}