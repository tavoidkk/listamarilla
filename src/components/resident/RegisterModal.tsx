"use client";

import { useEffect, useRef, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Field, FieldStatus } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { formatVenezuelanDisplay, countDigits, normalizeVenezuelanPhone } from "@/lib/phone";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Plus } from "lucide-react";

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
  initialCategoryKey?: string;
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

const CATEGORY_EMOJI_RULES: Array<{ terms: string[]; emoji: string }> = [
  { terms: ["agua", "plomer", "tuber", "grifer"], emoji: "🔧" },
  { terms: ["electric", "luz", "cable"], emoji: "⚡" },
  { terms: ["limpieza", "aseo", "lavander", "tintorer"], emoji: "🧹" },
  { terms: ["carpinter", "madera", "mueble", "ebanist"], emoji: "🪚" },
  { terms: ["mecan", "carro", "auto", "vehiculo", "caucho"], emoji: "🚗" },
  { terms: ["aire acondicionado", "refriger", "climat"], emoji: "❄️" },
  { terms: ["cerraj", "llave", "cerradura"], emoji: "🔑" },
  { terms: ["pint", "decor", "arte"], emoji: "🎨" },
  { terms: ["jardin", "planta", "paisaj", "vivero"], emoji: "🌱" },
  { terms: ["mascota", "perro", "gato", "veterin"], emoji: "🐶" },
  { terms: ["salud", "medic", "enferm", "terapia", "fisioter"], emoji: "🩺" },
  { terms: ["odont", "dental", "dentista"], emoji: "🦷" },
  { terms: ["psicolog", "psiquiatr"], emoji: "🧠" },
  { terms: ["belleza", "peluquer", "barber", "manicur", "estetic"], emoji: "💇" },
  { terms: ["comida", "restaurant", "cocina", "chef", "catering"], emoji: "🍽️" },
  { terms: ["panader", "pasteler", "reposter"], emoji: "🥐" },
  { terms: ["tecnolog", "comput", "laptop", "pc", "software"], emoji: "💻" },
  { terms: ["telefono", "celular", "movil"], emoji: "📱" },
  { terms: ["internet", "wifi", "redes"], emoji: "📶" },
  { terms: ["mudanza", "flete", "transporte", "encomienda"], emoji: "📦" },
  { terms: ["seguridad", "vigilancia", "camara", "alarma"], emoji: "🛡️" },
  { terms: ["albanil", "constru", "obra", "remodel"], emoji: "🧱" },
  { terms: ["gas"], emoji: "🔥" },
  { terms: ["piscina", "pileta"], emoji: "🏊" },
  { terms: ["fiesta", "evento", "animacion", "decoracion"], emoji: "🎉" },
  { terms: ["fotograf", "video"], emoji: "📷" },
  { terms: ["musica", "sonido", "dj"], emoji: "🎵" },
  { terms: ["educacion", "clase", "profesor", "tarea"], emoji: "📚" },
  { terms: ["idioma", "ingles", "traduccion"], emoji: "🗣️" },
  { terms: ["abogado", "legal", "derecho"], emoji: "⚖️" },
  { terms: ["contador", "contabilidad", "impuesto"], emoji: "🧾" },
  { terms: ["costura", "sastre", "ropa"], emoji: "🧵" },
  { terms: ["zapato", "calzado"], emoji: "👞" },
  { terms: ["gimnasio", "entrenador", "fitness", "ejercicio"], emoji: "🏋️" },
  { terms: ["fumig", "plaga", "insecto"], emoji: "🐜" },
  { terms: ["ascensor"], emoji: "🛗" },
  { terms: ["electrodomest", "nevera", "lavadora"], emoji: "🔌" },
  { terms: ["delivery", "domicilio", "reparto", "mensajer"], emoji: "🛵" },
  { terms: ["taxi", "traslado", "chofer"], emoji: "🚕" },
  { terms: ["mototaxi", "motorizado"], emoji: "🏍️" },
  { terms: ["farmacia", "medicamento"], emoji: "💊" },
  { terms: ["mercado", "supermercado", "abasto", "bodega"], emoji: "🛒" },
  { terms: ["fruta", "verdura", "hortaliza"], emoji: "🥬" },
  { terms: ["carnicer", "carne"], emoji: "🥩" },
  { terms: ["pescader", "pescado", "marisco"], emoji: "🐟" },
  { terms: ["florister", "flores"], emoji: "💐" },
  { terms: ["regalo", "detalle"], emoji: "🎁" },
  { terms: ["impresion", "fotocopia", "papeler"], emoji: "🖨️" },
  { terms: ["reloj", "relojer"], emoji: "⌚" },
  { terms: ["joya", "joyer"], emoji: "💍" },
  { terms: ["tapicer", "sofa"], emoji: "🛋️" },
  { terms: ["impermeabil", "filtracion", "gotera"], emoji: "☔" },
  { terms: ["herreria", "soldadura", "metal"], emoji: "⚒️" },
  { terms: ["vidrio", "cristal"], emoji: "🪟" },
  { terms: ["techo", "techado"], emoji: "🏠" },
  { terms: ["masaje", "spa"], emoji: "💆" },
  { terms: ["cuidador", "cuidado de adulto", "geriatr"], emoji: "🧑‍🦳" },
  { terms: ["ninera", "cuidado infantil", "babysitter"], emoji: "👶" },
  { terms: ["administracion", "gestoria", "tramite"], emoji: "📋" },
  { terms: ["inmobiliaria", "alquiler", "venta de inmueble"], emoji: "🏢" },
];

const LOWERCASE_CATEGORY_WORDS = new Set([
  "a",
  "de",
  "del",
  "e",
  "en",
  "la",
  "las",
  "los",
  "o",
  "para",
  "por",
  "y",
]);

function standardizeCategoryLabel(label: string): string {
  return label
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("es-VE")
    .split(" ")
    .map((word, index) =>
      index > 0 && LOWERCASE_CATEGORY_WORDS.has(word)
        ? word
        : `${word.charAt(0).toLocaleUpperCase("es-VE")}${word.slice(1)}`,
    )
    .join(" ");
}

function matchCategoryEmoji(label: string): string | null {
  const normalized = label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  return (
    CATEGORY_EMOJI_RULES.find(({ terms }) => terms.some((term) => normalized.includes(term)))
      ?.emoji ?? null
  );
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
  initialCategoryKey = "",
}: RegisterModalProps) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [categoryMode, setCategoryMode] = useState<"existing" | "new">("existing");
  const [categoryKey, setCategoryKey] = useState("");
  const [newCategoryLabel, setNewCategoryLabel] = useState("");
  const [customCategoryEmoji, setCustomCategoryEmoji] = useState("");
  const [addedBy, setAddedBy] = useState("");
  const [floor, setFloor] = useState("");
  const [apartment, setApartment] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [floorConfig, setFloorConfig] = useState<FloorConfig>(DEFAULT_FLOORS);
  const categoryLabelRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    queueMicrotask(() => {
      setCategoryMode("existing");
      setCategoryKey(initialCategoryKey);
    });
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
              (data as { special_floor_labels: Record<string, number> | null })
                .special_floor_labels ?? {},
          });
        }
      });
  }, [open, orgId, initialCategoryKey]);

  function reset() {
    setPhone("");
    setName("");
    setCategoryMode("existing");
    setCategoryKey(initialCategoryKey);
    setNewCategoryLabel("");
    setCustomCategoryEmoji("");
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
    if (requireSecurityCode && !/^\d{4,}$/.test(securityCode))
      next.securityCode = "Código del edificio (mínimo 4 números)";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      const isNew = categoryMode === "new";
      await onSubmit({
        phone: phone.trim(),
        phone_normalized: normalizeVenezuelanPhone(phone),
        name: name.trim(),
        category_key: isNew ? slugify(newCategoryLabel) : categoryKey,
        category_label: isNew ? standardizeCategoryLabel(newCategoryLabel) : "",
        category_emoji: isNew
          ? (matchCategoryEmoji(newCategoryLabel) ?? customCategoryEmoji.trim()) || "🛠️"
          : "",
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
      <h2 className="text-foreground mb-1 text-center text-2xl font-bold">Agregar contacto</h2>
      <p className="text-muted-foreground mb-6 text-center text-sm">
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
                !["Backspace", ",Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key)
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
              ref={categoryLabelRef}
              id="newCategoryLabel"
              label="Nombre de la nueva categoría"
              placeholder="Ej: Piletas, Fonoaudiólogo..."
              value={newCategoryLabel}
              onChange={(e) => {
                const v = e.target.value;
                setNewCategoryLabel(v);
                setCustomCategoryEmoji("");
                setError("newCategory", v.trim().length >= 3 ? "" : "Mínimo 3 caracteres");
              }}
              onBlur={() => setNewCategoryLabel((value) => standardizeCategoryLabel(value))}
              disabled={submitting}
              error={errors.newCategory}
              hint="Si tu servicio no encaja en ninguna categoría existente"
            />
            {matchCategoryEmoji(newCategoryLabel) ? (
              <div className="mb-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <span className="text-2xl" aria-hidden>
                  {matchCategoryEmoji(newCategoryLabel)}
                </span>
                <p className="text-sm font-bold text-slate-900">Emoji asignado automáticamente</p>
              </div>
            ) : newCategoryLabel.trim().length >= 3 ? (
              <Field
                id="customCategoryEmoji"
                label="No encontramos un emoji. Puedes elegir uno"
                placeholder="Ej: ✨"
                value={customCategoryEmoji}
                onChange={(event) => setCustomCategoryEmoji(event.target.value)}
                disabled={submitting}
              />
            ) : null}
          </>
        )}

        <button
          type="button"
          onClick={() =>
            setCategoryMode((mode) => {
              const next = mode === "existing" ? "new" : "existing";
              if (next === "new") requestAnimationFrame(() => categoryLabelRef.current?.focus());
              return next;
            })
          }
          className="mb-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-amber-400 bg-amber-50 px-4 py-2 text-sm font-bold text-slate-900 transition-colors hover:border-amber-500 hover:bg-amber-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 disabled:opacity-50"
          disabled={submitting}
        >
          {categoryMode === "existing" ? (
            <Plus size={18} aria-hidden />
          ) : (
            <ArrowLeft size={18} aria-hidden />
          )}
          {categoryMode === "existing" ? "Crear nueva categoría" : "Elegir categoría existente"}
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
                !["Backspace", ",Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key)
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
            placeholder="Ej: 4826"
            value={securityCode}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "");
              setSecurityCode(v);
              setError("securityCode", v.length >= 4 ? "" : "Mínimo 4 números");
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
