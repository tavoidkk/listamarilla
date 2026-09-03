"use client";

import { useState, useTransition } from "react";
import { Modal } from "@/components/ui/Modal";
import { Building2, X } from "lucide-react";
import { createOrgAction } from "./actions";

export function CreateOrgModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (id?: string) => void;
}) {
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const res = await createOrgAction(formData);
      if (res.ok) {
        onCreated(res.id);
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <Modal open={open} onClose={onClose} variant="center" hideCloseButton ariaLabel="Nueva organización">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-amber-600">Owner Console</p>
          <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-900">
            <Building2 className="h-5 w-5 text-amber-500" aria-hidden="true" />
            Nueva organización
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Al crearla se generará un administrador de condominio con acceso exclusivo a esta organización.
          </p>
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
        {error ? (
          <div role="alert" className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
            {error}
          </div>
        ) : null}

        <div className="space-y-1">
          <label htmlFor="org-name" className="block text-sm font-semibold text-slate-700">
            Nombre del edificio
          </label>
          <input
            id="org-name"
            name="name"
            required
            disabled={pending}
            placeholder="Ej: Edificio Colina Del Este"
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="org-slug" className="block text-sm font-semibold text-slate-700">
            Slug (URL)
          </label>
          <input
            id="org-slug"
            name="slug"
            required
            disabled={pending}
            placeholder="colina-del-este"
            pattern="[a-z0-9-]+"
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
          <p className="text-xs text-slate-500">URL: /o/<strong>colina-del-este</strong>/panel</p>
        </div>

        <div className="space-y-1">
          <label htmlFor="org-code" className="block text-sm font-semibold text-slate-700">
            Código de seguridad inicial
          </label>
          <input
            id="org-code"
            name="security_code"
            required
            disabled={pending}
            minLength={4}
            placeholder="COLINA-2026"
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
          <p className="text-xs text-slate-500">Lo compartirás con los vecinos para que puedan registrarse</p>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-blue-700">
            Administrador de condominio (obligatorio)
          </p>
          <p className="mb-3 text-xs text-blue-800/80">
            Se creará un usuario nuevo exclusivo de esta organización.
          </p>
          <div className="space-y-2">
            <input
              name="admin_name"
              required
              disabled={pending}
              placeholder="Nombre completo del administrador"
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
            <input
              name="admin_email"
              type="email"
              required
              disabled={pending}
              placeholder="admin@condominio.com"
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
            <input
              name="admin_password"
              type="password"
              required
              disabled={pending}
              minLength={8}
              placeholder="Contraseña (mín. 8 caracteres)"
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>
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
            {pending ? "Creando..." : "Crear organización"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
