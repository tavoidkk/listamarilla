"use client";

import { useState, useTransition } from "react";
import { Modal } from "@/components/ui/Modal";
import { Plus, Pencil, Trash2, ShieldCheck, KeyRound, X, Copy, Check } from "lucide-react";
import { toast } from "@/components/ui/Toast";
import {
  createOwnerAction,
  updateOwnerAction,
  resetOwnerPasswordAction,
  deleteOwnerAction,
  updateOwnerMetaAction,
} from "@/app/(platform)/superadmin/actions";

interface OwnerRow {
  id: string;
  email: string;
  full_name: string | null;
  isPlatformOwner: boolean;
  created_at: string;
  last_sign_in_at: string | null;
}

function generatePasswordClient(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
  let pwd = "";
  for (let i = 0; i < 12; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
}

export function OwnersAdminPanel({ owners }: { owners: OwnerRow[] }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<OwnerRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<OwnerRow | null>(null);
  const [resetTarget, setResetTarget] = useState<OwnerRow | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          Total: <strong className="text-slate-900">{owners.length}</strong> usuario{owners.length === 1 ? "" : "s"}
        </p>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-slate-900 shadow-sm transition-all duration-200 hover:bg-amber-500 hover:shadow-md active:scale-95"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nuevo owner
        </button>
      </div>

      <CreateOwnerModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        startTransition={startTransition}
      />

      {editTarget ? (
        <EditOwnerModal
          owner={editTarget}
          onClose={() => setEditTarget(null)}
          startTransition={startTransition}
        />
      ) : null}

      {deleteTarget ? (
        <DeleteOwnerModal
          owner={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          startTransition={startTransition}
        />
      ) : null}

      {resetTarget ? (
        <ResetPasswordModal
          owner={resetTarget}
          onClose={() => setResetTarget(null)}
          startTransition={startTransition}
        />
      ) : null}

      {/* Tabla con todos los usuarios */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left">Usuario</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Tipo</th>
              <th className="hidden px-4 py-3 text-left md:table-cell">Ãšltimo acceso</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {owners.map((o) => (
              <OwnerRow
                key={o.id}
                owner={o}
                onEdit={(owner) => startTransition(() => setEditTarget(owner))}
                onDelete={(owner) => startTransition(() => setDeleteTarget(owner))}
                onResetPwd={(owner) => startTransition(() => setResetTarget(owner))}
                onToggleOwner={(owner) => {
                  const next = !owner.isPlatformOwner;
                  startTransition(async () => {
                    await updateOwnerMetaAction(owner.id, next);
                    if (next) {
                      toast({ kind: "success", message: `${owner.email} ahora es platform_owner` });
                    } else {
                      toast({ kind: "info", message: `${owner.email} ya no es platform_owner` });
                    }
                  });
                }}
                startTransition={startTransition}
              />
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

function OwnerRow({
  owner,
  onEdit,
  onDelete,
  onResetPwd,
  onToggleOwner,
  startTransition,
}: {
  owner: OwnerRow;
  onEdit: (o: OwnerRow) => void;
  onDelete: (o: OwnerRow) => void;
  onResetPwd: (o: OwnerRow) => void;
  onToggleOwner: (o: OwnerRow) => void;
  startTransition: (fn: () => void) => void;
}) {
  return (
    <tr className="hover:bg-slate-50">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
              owner.isPlatformOwner ? "bg-amber-400 text-slate-900" : "bg-slate-200 text-slate-700"
            }`}
          >
            {(owner.full_name ?? owner.email).charAt(0).toUpperCase()}
          </div>
          <span className="font-semibold text-slate-900">{owner.full_name ?? "â€”"}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-slate-700">
        <div className="flex items-center gap-1">
          <span className="font-mono text-xs">{owner.email || "â€”"}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        {owner.isPlatformOwner ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-800">
            <ShieldCheck className="h-3 w-3" aria-hidden="true" />
            Platform Owner
          </span>
        ) : (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Usuario
          </span>
        )}
      </td>
      <td className="hidden px-4 py-3 text-xs text-slate-500 md:table-cell">
        {owner.last_sign_in_at
          ? new Date(owner.last_sign_in_at).toLocaleDateString("es-VE")
          : "Nunca"}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(owner)}
            title="Editar"
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onResetPwd(owner)}
            title="Resetear contraseÃ±a"
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
          >
            <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onToggleOwner(owner)}
            title={owner.isPlatformOwner ? "Quitar flag owner" : "Hacer platform owner"}
            className={`rounded-lg px-2 py-1 text-xs font-bold transition-colors ${
              owner.isPlatformOwner
                ? "border border-amber-300 bg-white text-amber-800 hover:bg-amber-50"
                : "border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {owner.isPlatformOwner ? "Quitar" : "Hacer Owner"}
          </button>
          <button
            type="button"
            onClick={() => onDelete(owner)}
            title="Eliminar"
            className="rounded-lg border border-red-300 bg-red-50 px-2 py-1 text-xs font-bold text-red-700 transition-colors hover:bg-red-100"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </td>
    </tr>
  );
}

// =====================================================================
// MODAL CREAR OWNER
// =====================================================================

function CreateOwnerModal({
  open,
  onClose,
  startTransition,
}: {
  open: boolean;
  onClose: () => void;
  startTransition: (fn: () => void) => void;
}) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [createdEmail, setCreatedEmail] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function handleGenerate() {
    const pwd = generatePasswordClient();
    const input = document.getElementById("owner-password-create") as HTMLInputElement | null;
    if (input) input.value = pwd;
  }

  async function handleSubmit(formData: FormData) {
    setError("");
    setPending(true);
    try {
      const res = await createOwnerAction(formData);
      if (res.ok) {
        toast({
          kind: "success",
          message: `Owner creado: ${res.email}. Comparte la contraseÃ±a de forma segura.`,
          duration: 4000,
        });
        setGeneratedPassword(res.password);
        setCreatedEmail(res.email);
      } else {
        setError(res.error);
      }
    } finally {
      setPending(false);
    }
  }

  function handleClose() {
    setError("");
    setGeneratedPassword(null);
    setCreatedEmail(null);
    setCopied(false);
    onClose();
  }

  async function copyPassword() {
    if (!generatedPassword) return;
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ kind: "error", message: "No se pudo copiar al portapapeles" });
    }
  }

  return (
    <Modal open={open} onClose={handleClose} variant="center" hideCloseButton ariaLabel="Nuevo platform owner">
      <header className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-amber-600">Owner Console</p>
          <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-900">
            <ShieldCheck className="h-5 w-5 text-amber-500" aria-hidden="true" />
            Nuevo Platform Owner
          </h2>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </header>

      {generatedPassword ? (
        // Pantalla de Ã©xito con la contraseÃ±a generada
        <div className="space-y-4">
          <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-4">
            <p className="mb-2 text-sm font-bold text-emerald-900">âœ“ Owner creado exitosamente</p>
            <p className="text-sm text-emerald-800">
              <strong>{createdEmail}</strong> ya puede iniciar sesiÃ³n en{" "}
              <code className="rounded bg-emerald-100 px-1 font-mono text-xs">/login</code>
            </p>
          </div>

          <div className="rounded-lg border-2 border-amber-300 bg-amber-50 p-4">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-amber-700">
              ContraseÃ±a temporal (guÃ¡rdala, no se mostrarÃ¡ de nuevo)
            </p>
            <div className="mt-2 flex items-center gap-2">
              <code className="flex-1 break-all rounded-lg border border-amber-300 bg-white px-3 py-2.5 font-mono text-sm text-slate-900">
                {generatedPassword}
              </code>
              <button
                type="button"
                onClick={copyPassword}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-3 py-2.5 text-sm font-bold text-slate-900 transition-all hover:bg-amber-500 active:scale-95"
              >
                {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                {copied ? "Copiado" : "Copiar"}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-full rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-slate-900 transition-all hover:bg-amber-500"
          >
            Cerrar
          </button>
        </div>
      ) : (
        <form action={handleSubmit} className="space-y-3">
          {error ? (
            <div role="alert" className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
              {error}
            </div>
          ) : null}

          <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
            <p className="font-bold">âš¡ Importante</p>
            <p className="mt-1">
              El nuevo usuario serÃ¡ creado con la flag <code className="rounded bg-amber-100 px-1 font-mono">is_platform_owner = true</code> automÃ¡ticamente.
            </p>
          </div>

          <div className="space-y-1">
            <label htmlFor="owner-email-create" className="block text-sm font-semibold text-slate-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="owner-email-create"
              name="email"
              type="email"
              required
              disabled={pending}
              placeholder="owner@ejemplo.com"
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="owner-name-create" className="block text-sm font-semibold text-slate-700">
              Nombre completo
            </label>
            <input
              id="owner-name-create"
              name="full_name"
              disabled={pending}
              placeholder="Juan PÃ©rez"
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="owner-password-create" className="block text-sm font-semibold text-slate-700">
              ContraseÃ±a inicial
            </label>
            <div className="flex gap-2">
              <input
                id="owner-password-create"
                name="password"
                type="text"
                disabled={pending}
                placeholder="MÃ­nimo 8 caracteres"
                className="flex-1 rounded-xl border border-slate-300 px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleGenerate}
                className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800 transition-colors hover:bg-amber-100"
              >
                Generar
              </button>
            </div>
            <p className="text-xs text-slate-500">DÃ©jala vacÃ­a para generar una automÃ¡ticamente (12 caracteres)</p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={pending}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-slate-900 shadow-sm transition-all duration-200 hover:bg-amber-500 active:scale-95 disabled:opacity-60"
            >
              {pending ? "Creando..." : "Crear platform owner"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

// =====================================================================
// MODAL EDITAR OWNER
// =====================================================================

function EditOwnerModal({
  owner,
  onClose,
  startTransition,
}: {
  owner: OwnerRow;
  onClose: () => void;
  startTransition: (fn: () => void) => void;
}) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError("");
    setPending(true);
    try {
      const res = await updateOwnerAction(formData);
      if (res.ok) {
        toast({ kind: "success", message: "Owner actualizado" });
        onClose();
      } else {
        setError(res.error);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <Modal open onClose={onClose} variant="center" hideCloseButton ariaLabel="Editar owner">
      <header className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-amber-600">Owner Console</p>
          <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-900">
            <Pencil className="h-5 w-5 text-amber-500" aria-hidden="true" />
            Editar owner
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </header>

      <form action={handleSubmit} className="space-y-3">
        <input type="hidden" name="user_id" value={owner.id} />

        {error ? (
          <div role="alert" className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
            {error}
          </div>
        ) : null}

        <div className="space-y-1">
          <label htmlFor={`owner-email-${owner.id}`} className="block text-sm font-semibold text-slate-700">
            Email
          </label>
          <input
            id={`owner-email-${owner.id}`}
            name="email"
            type="email"
            required
            disabled={pending}
            defaultValue={owner.email}
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor={`owner-name-${owner.id}`} className="block text-sm font-semibold text-slate-700">
            Nombre completo
          </label>
          <input
            id={`owner-name-${owner.id}`}
            name="full_name"
            disabled={pending}
            defaultValue={owner.full_name ?? ""}
            placeholder="Juan PÃ©rez"
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          <p>
            <strong>Creado:</strong> {new Date(owner.created_at).toLocaleDateString("es-VE")}
            {owner.last_sign_in_at
              ? ` Â· Ãšltimo acceso: ${new Date(owner.last_sign_in_at).toLocaleDateString("es-VE")}`
              : " Â· Nunca ha iniciado sesiÃ³n"}
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-slate-900 shadow-sm transition-all duration-200 hover:bg-amber-500 active:scale-95 disabled:opacity-60"
          >
            {pending ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// =====================================================================
// MODAL ELIMINAR OWNER
// =====================================================================

function DeleteOwnerModal({
  owner,
  onClose,
  startTransition,
}: {
  owner: OwnerRow;
  onClose: () => void;
  startTransition: (fn: () => void) => void;
}) {
  const [error, setError] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [pending, setPending] = useState(false);

  async function handleConfirm() {
    if (confirmText !== owner.email) {
      setError(`Escribe exactamente "${owner.email}" para confirmar`);
      return;
    }
    setError("");
    setPending(true);
    try {
      const res = await deleteOwnerAction(owner.id);
      if (res.ok) {
        toast({ kind: "success", message: "Owner eliminado" });
        onClose();
      } else {
        setError(res.error);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <Modal open onClose={onClose} variant="center" hideCloseButton ariaLabel="Eliminar owner">
      <header className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-red-600">AcciÃ³n destructiva</p>
          <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-900">
            <Trash2 className="h-5 w-5 text-red-600" aria-hidden="true" />
            Eliminar owner
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </header>

      <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">
        <p className="font-bold">âš  Esto es irreversible</p>
        <p className="mt-1">
          El usuario serÃ¡ eliminado de auth.users, su perfil y todas sus membresÃ­as.
        </p>
      </div>

      <p className="mb-2 text-sm text-slate-700">
        Para confirmar, escribe el email <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">{owner.email}</code>:
      </p>
      <input
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        disabled={pending}
        placeholder={owner.email}
        className="mb-3 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
      />

      {error ? (
        <div role="alert" className="mb-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          disabled={pending}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={pending || confirmText !== owner.email}
          className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-red-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Eliminando..." : "Eliminar definitivamente"}
        </button>
      </div>
    </Modal>
  );
}

// =====================================================================
// MODAL RESETEAR CONTRASEÃ‘A
// =====================================================================

function ResetPasswordModal({
  owner,
  onClose,
  startTransition: _startTransition,
}: {
  owner: OwnerRow;
  onClose: () => void;
  startTransition: (fn: () => void) => void;
}) {
  const [pending, setPending] = useState(false);
  const [newPassword, setNewPassword] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleReset() {
    setError("");
    setPending(true);
    try {
      const res = await resetOwnerPasswordAction(owner.id);
      if (res.ok) {
        setNewPassword(res.password);
        toast({ kind: "success", message: `ContraseÃ±a de ${owner.email} reseteada` });
      } else {
        setError(res.error);
      }
    } finally {
      setPending(false);
    }
  }

  async function copyPassword() {
    if (!newPassword) return;
    try {
      await navigator.clipboard.writeText(newPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ kind: "error", message: "No se pudo copiar al portapapeles" });
    }
  }

  function handleClose() {
    setNewPassword(null);
    setError("");
    setCopied(false);
    onClose();
  }

  return (
    <Modal open onClose={handleClose} variant="center" ariaLabel="Resetear contraseÃ±a">
      <header className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-amber-600">Owner Console</p>
          <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-900">
            <KeyRound className="h-5 w-5 text-amber-500" aria-hidden="true" />
            Resetear contraseÃ±a
          </h2>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </header>

      {newPassword ? (
        <div className="space-y-4">
          <div className="rounded-lg border-2 border-amber-300 bg-amber-50 p-4">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-amber-700">
              Nueva contraseÃ±a temporal
            </p>
            <div className="mt-2 flex items-center gap-2">
              <code className="flex-1 break-all rounded-lg border border-amber-300 bg-white px-3 py-2.5 font-mono text-sm text-slate-900">
                {newPassword}
              </code>
              <button
                type="button"
                onClick={copyPassword}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-3 py-2.5 text-sm font-bold text-slate-900 transition-all hover:bg-amber-500 active:scale-95"
              >
                {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                {copied ? "Copiado" : "Copiar"}
              </button>
            </div>
            <p className="mt-2 text-xs text-amber-800">
              âš  No se mostrarÃ¡ de nuevo. CompÃ¡rtela con el owner de forma segura.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-full rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-slate-900 transition-all hover:bg-amber-500"
          >
            Cerrar
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-slate-700">
            Vas a resetear la contraseÃ±a de{" "}
            <strong className="text-slate-900">{owner.email}</strong>. Se generarÃ¡ una nueva contraseÃ±a aleatoria de 12 caracteres.
          </p>

          {error ? (
            <div role="alert" className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
              {error}
            </div>
          ) : null}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={pending}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={pending}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-slate-900 shadow-sm transition-all duration-200 hover:bg-amber-500 active:scale-95 disabled:opacity-60"
            >
              {pending ? "Reseteando..." : "Generar nueva contraseÃ±a"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
