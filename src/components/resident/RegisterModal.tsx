"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Field, FieldStatus } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { formatVenezuelanDisplay, countDigits } from "@/lib/phone";
import { createClient } from "@/lib/supabase/client";

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

interface FloorConfig {
  total_floors: number;
  apartment_labels: string[];
  special_floor_labels: Record<string, number>;
}

interface RegisterModalProps {
  open: boolean;
  orgId: string;
  categories: CategoryOption[];
  onClose: () => void;
  onSubmit: (payload: NewContactPayload) => Promise<void>;
  requireSecurityCode: boolean;
}

const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
const PHONE_REGEX = /^[+0-9\s\-]+$/;

function isValidName(v: string) {
  return v.trim().length >= 3 && NAME_REGEX.test(v);
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

const DEFAULT_FLOORS: FloorConfig = {
  total_floors: 13,
  apartment_labels: ["A", "B", "C"],
  special_floor_labels: {},
};

export function RegisterModal({
  open,
  orgId,
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
  const [floorConfig, setFloorConfig] = useState<FloorConfig>(DEFAULT_FLOORS);

  useEffect(() => {
    if (!open) return;
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
              ((data as { special_floor_labels: Record<string, number> }).special_floor_labels ?? {}) ??
              {},
          });
        }
      });
  }, [open, orgId]);

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

  function setError(field: string, msg: string) {
    setErrors((p) => {
      if (!msg) {
        const { [field]: _, ...rest } = p;
        return rest;
      }
      return { ...p, [field]: msg };
    });
  }

  function validatePhone(v: string): string {
    if (!v) return "";
    if (countDigits(v) < 7) return "Mínimo 7 dígitos";
    if (!PHONE_REGEX.test(v)) return "Solo números, espacios, + y guiones";
    return "";
  }
  function validateName(v: string): string {
    if (!v) return "";
    if (!isValidName(v)) return "Solo letras y espacios, mínimo 3 caracteres";
    return "";
  }
  function validateAddedBy(v: string): string {
    if (!v) return "";
    if (!isValidName(v)) return "Ingresa tu nombre (mínimo 3 letras)";
    return "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (countDigits(phone) < 7) next.phone = "Mínimo 7 dígitos";
    if (!isValidName(name)) next.name = "Solo letras y espacios, mínimo 3 caracteres";
    if (categoryMode === "existing" && !categoryKey) next.category = "Selecciona una categoría";
    if (categoryMode === "new" && newCategoryLabel.trim().length < 3)
      next.newCategory = "Mínimo 3 caracteres";
    if (!isValidName(addedBy)) next.addedBy = "Ingresa tu nombre (mínimo 3 letras)";
    if (requireSecurityCode && securityCode.length < 4)
      next.securityCode = "Código del edificio (mínimo 4 caracteres)";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      const isNew = categoryMode === "new";
      await onSubmit({
        phone: phone.trim(),
        phone_normalized: phone.replace(/\D/g, ""),
        name: name.trim(),
        category_key: isNew ? slugify(newCategoryLabel) : categoryKey,
        category_label: isNew ? newCategoryLabel.trim() : "",
        category_emoji: isNew ? newCategoryEmoji.trim() || "🔧" : "",
        new_category: isNew,
        added_by_name: addedBy.trim(),
        floor: floor ? Number(floor) : null,
        apartment: apartment || null,
        security_code: securityCode,
      });
      toast({
        kind: "success",
        message: isNew ? "¡Categoría y contacto creados!" : "¡Contacto agregado!",
      });
      reset();
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al registrar";
      toast({ kind: "error", message: msg });
    } finally {
      setSubmitting(false);
    }
  }

  const phoneOk = phone && !errors.phone;
  const nameOk = name && !errors.name;
  const addedByOk = addedBy && !errors.addedBy;

  const specialLabels = Object.entries(floorConfig.special_floor_labels);
  const numberedFloors = Array.from({ length: floorConfig.total_floors }, (_, i) => i + 1);

  return (
    <Modal open={open} onClose={handleClose} variant="bottom" ariaLabel="Agregar contacto">
      <h2 className="mb-1 text-center text-2xl font-bold text-foreground">Agregar contacto</h2>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        Comparte un contacto de confianza con tus vecinos
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="relative">
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
              setError("phone", validatePhone(v));
            }}
            disabled={submitting}
            error={errors.phone}
          />
          {phone && (
            <div className="absolute right-3 top-[42px]">
              <FieldStatus status={errors.phone ? "warn" : phoneOk ? "ok" : null} />
            </div>
          )}
        </div>

        <div className="relative">
          <Field
            id="name"
            label="Nombre del prestador"
            placeholder="Ej: Juan Pérez"
            autoComplete="off"
            value={name}
            onChange={(e) => {
              const v = e.target.value;
              setName(v);
              setError("name", validateName(v));
            }}
            onKeyDown={(e) => {
              if (
                e.key.length === 1 &&
                !NAME_REGEX.test(e.key) &&
                !["Backspace",",Delete","Tab","ArrowLeft","ArrowRight"].includes(e.key)
              ) {
                e.preventDefault();
              }
            }}
            disabled={submitting}
            error={errors.name}
          />
          {name && (
            <div className="absolute right-3 top-[42px]">
              <FieldStatus status={errors.name ? "warn" : nameOk ? "ok" : null} />
            </div>
          )}
        </div>

        {categoryMode === "existing" ? (
          <Field
            as="select"
            id="category"
            label="Categoría del servicio"
            value={categoryKey}
            onChange={(e) => {
              const v = e.target.value;
              setCategoryKey(v);
              setError("category", v ? "" : "Selecciona una categoría");
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
                const v = e.target.value;
                setNewCategoryLabel(v);
                setError("newCategory", v.trim().length >= 3 ? "" : "Mínimo 3 caracteres");
              }}
              disabled={submitting}
              error={errors.newCategory}
              hint="Si tu servicio no encaja en ninguna categoría existente"
            />
            <Field
              id="newCategoryEmoji"
              label="Emoji representativo"
              placeholder="🔧"
              value={newCategoryEmoji}
              onChange={(e) => setNewCategoryEmoji(e.target.value)}
              disabled={submitting}
              maxLength={2}
            />
          </>
        )}

        <button
          type="button"
          onClick={() => setCategoryMode((m) => (m === "existing" ? "new" : "existing"))}
          className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-dark underline-offset-4 hover:underline"
          disabled={submitting}
        >
          {categoryMode === "existing" ? "+ Crear nueva categoría" : "← Elegir categoría existente"}
        </button>

        <div className="relative">
          <Field
            id="addedBy"
            label="Tu nombre (quien lo agrega)"
            placeholder="Ej: María García"
            autoComplete="name"
            value={addedBy}
            onChange={(e) => {
              const v = e.target.value;
              setAddedBy(v);
              setError("addedBy", validateAddedBy(v));
            }}
            onKeyDown={(e) => {
              if (
                e.key.length === 1 &&
                !NAME_REGEX.test(e.key) &&
                !["Backspace",",Delete","Tab","ArrowLeft","ArrowRight"].includes(e.key)
              ) {
                e.preventDefault();
              }
            }}
            disabled={submitting}
            error={errors.addedBy}
            hint="Tu nombre aparece como referencia para tus vecinos"
          />
          {addedBy && (
            <div className="absolute right-3 top-[42px]">
              <FieldStatus status={errors.addedBy ? "warn" : addedByOk ? "ok" : null} />
            </div>
          )}
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <Field
            as="select"
            id="floor"
            label="Tu piso"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            disabled={submitting}
            options={[
              { value: "", label: "Piso" },
              ...specialLabels.map(([label]) => ({ value: label, label })),
              ...numberedFloors.map((f) => ({ value: String(f), label: String(f) })),
            ]}
          />
          <Field
            as="select"
            id="apartment"
            label="Tu apartamento"
            value={apartment}
            onChange={(e) => setApartment(e.target.value)}
            disabled={submitting}
            options={[
              { value: "", label: "Apt" },
              ...floorConfig.apartment_labels.map((a) => ({ value: a, label: a })),
            ]}
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
              const v = e.target.value;
              setSecurityCode(v);
              setError("securityCode", v.length >= 4 ? "" : "Mínimo 4 caracteres");
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