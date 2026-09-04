"use client";

import { useState, useOptimistic, useTransition, startTransition } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { UserCheck, UserX, Trash2, Plus, Pencil, X, Mail } from "lucide-react";
import { toast } from "@/components/ui/Toast";
import {
  updateMemberAction,
  updateProfileAction,
  updateUserEmailAction,
  createCondoAdminAction,
} from "@/app/(platform)/superadmin/actions";

interface Member {
  id: string;
  user_id: string;
  role: string;
  status: string;
  profiles: { full_name: string | null } | null;
  email: string | null;
}

interface MembersAdminPanelProps {
  orgId: string;
  members: Member[];
  suspendAction: (membershipId: string) => Promise<void>;
  reactivateAction: (membershipId: string) => Promise<void>;
  removeAction: (membershipId: string) => Promise<void>;
}

export function MembersAdminPanel({
  orgId,
  members,
  suspendAction,
  reactivateAction,
  removeAction,
}: MembersAdminPanelProps) {
  const router = useRouter();

  // Estado optimista para acciones de fila (suspender / reactivar / quitar)
  const [optimisticMembers, reduceMembers] = useOptimistic(
    members,
    (state: Member[], action: { type: "status" | "remove"; id: string; status?: string }) => {
      if (action.type === "remove") {
        return state.filter((m) => m.id !== action.id);
      }
      return state.map((m) =>
        m.id === action.id ? { ...m, status: action.status ?? m.status } : m,
      );
    },
  );

  function handleSuspend(m: Member) {
    reduceMembers({ type: "status", id: m.id, status: "suspended" });
    startTransition(async () => {
      await suspendAction(m.id);
      router.refresh();
    });
    toast({ kind: "info", message: "Administrador suspendido" });
  }

  function handleReactivate(m: Member) {
    reduceMembers({ type: "status", id: m.id, status: "active" });
    startTransition(async () => {
      await reactivateAction(m.id);
      router.refresh();
    });
    toast({ kind: "success", message: "Administrador reactivado" });
  }

  function handleRemove(m: Member) {
    if (!confirm(`¿Quitar a ${m.email ?? m.user_id} de la organización?`)) return;
    reduceMembers({ type: "remove", id: m.id });
    startTransition(async () => {
      await removeAction(m.id);
      router.refresh();
    });
  }

  return (
    <>
      {/* Administradores de condominio actuales */}
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-bold text-slate-900">
            Administradores de condominio ({optimisticMembers.length})
          </h2>
        </div>
        {optimisticMembers.length === 0 ? (
          <p className="p-5 text-center text-sm italic text-slate-500">
            Esta organización aún no tiene administradores. Crea uno abajo.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {optimisticMembers.map((m) => (
              <MemberRow
                key={m.id}
                member={m}
                onSuspend={() => handleSuspend(m)}
                onReactivate={() => handleReactivate(m)}
                onRemove={() => handleRemove(m)}
              />
            ))}
          </ul>
        )}
      </section>

      {/* Crear nuevo administrador de condominio */}
      <AddCondoAdminSection orgId={orgId} />
    </>
  );
}

// =====================================================================
// FILA DE MIEMBRO
// =====================================================================

function MemberRow({
  member,
  onSuspend,
  onReactivate,
  onRemove,
}: {
  member: Member;
  onSuspend: () => void;
  onReactivate: () => void;
  onRemove: () => void | Promise<void>;
}) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <li className="flex flex-wrap items-center gap-3 px-5 py-4">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
        <span className="text-sm font-bold">
          {(member.profiles?.full_name ?? member.email ?? member.user_id.slice(0, 8)).charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-slate-900">
          {member.profiles?.full_name ?? member.email ?? member.user_id.slice(0, 8)}
        </p>
        <p className="flex items-center gap-1 truncate text-xs text-slate-500">
          <Mail className="h-3 w-3" aria-hidden="true" />
          {member.email ?? "—"}
        </p>
      </div>
      <span
        className={[
          "rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider",
          member.role === "condo_admin"
            ? "bg-blue-100 text-blue-800"
            : "bg-slate-200 text-slate-700",
        ].join(" ")}
      >
        Condo Admin
      </span>
      <span
        className={[
          "rounded-full px-2 py-0.5 text-[11px] font-bold",
          member.status === "active"
            ? "bg-emerald-100 text-emerald-700"
            : member.status === "invited"
              ? "bg-amber-100 text-amber-700"
              : "bg-red-100 text-red-700",
        ].join(" ")}
      >
        {member.status}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          title="Editar info del usuario"
          className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800 transition-colors hover:bg-amber-100"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          Editar
        </button>
        {member.status === "active" ? (
          <button
            type="button"
            onClick={onSuspend}
            title="Suspender"
            className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800 transition-colors hover:bg-amber-100"
          >
            <UserX className="h-3.5 w-3.5" aria-hidden="true" />
            Suspender
          </button>
        ) : (
          <button
            type="button"
            onClick={onReactivate}
            title="Reactivar"
            className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
          >
            <UserCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Reactivar
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            if (confirm(`¿Quitar a ${member.email ?? member.user_id} de la organización?`)) {
              void onRemove();
              toast({ kind: "info", message: "Miembro quitado" });
            }
          }}
          title="Quitar de la organización"
          className="inline-flex items-center gap-1 rounded-lg border border-red-300 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          Quitar
        </button>
      </div>

      {editOpen ? (
        <EditMemberModal member={member} onClose={() => setEditOpen(false)} />
      ) : null}
    </li>
  );
}

// =====================================================================
// MODAL EDITAR MIEMBRO
// =====================================================================

function EditMemberModal({
  member,
  onClose,
}: {
  member: Member;
  onClose: () => void;
}) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [, startTransition] = useTransition();

  async function handleSaveMembership(formData: FormData) {
    setError("");
    setPending(true);
    try {
      const res = await updateMemberAction(formData);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      toast({ kind: "success", message: "Membresía actualizada" });
      onClose();
    } finally {
      setPending(false);
    }
  }

  async function handleSaveProfile(formData: FormData) {
    setError("");
    setPending(true);
    try {
      const res = await updateProfileAction(formData);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      toast({ kind: "success", message: "Perfil actualizado" });
    } finally {
      setPending(false);
    }
  }

  async function handleSaveEmail(formData: FormData) {
    setError("");
    setPending(true);
    try {
      const res = await updateUserEmailAction(formData);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      toast({ kind: "success", message: "Email actualizado" });
      onClose();
    } finally {
      setPending(false);
    }
  }

  return (
    <Modal open onClose={onClose} variant="center" hideCloseButton ariaLabel="Editar miembro">
      <header className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-amber-600">Owner Console</p>
          <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-900">
            <Pencil className="h-5 w-5 text-amber-500" aria-hidden="true" />
            Editar miembro
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

      {error ? (
        <div role="alert" className="mb-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      <div className="space-y-4">
        {/* Sección email */}
        <form action={handleSaveEmail} className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/50 p-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Email (auth.users)</p>
          <input
            type="hidden"
            name="user_id"
            value={member.user_id}
          />
          <input
            name="email"
            type="email"
            required
            disabled={pending}
            defaultValue={member.email ?? ""}
            placeholder="usuario@ejemplo.com"
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-1 rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-900 transition-colors hover:bg-amber-500 active:scale-95 disabled:opacity-60"
          >
            Actualizar email
          </button>
        </form>

        {/* Sección nombre */}
        <form action={handleSaveProfile} className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/50 p-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Nombre (profiles)</p>
          <input
            type="hidden"
            name="user_id"
            value={member.user_id}
          />
          <input
            name="full_name"
            disabled={pending}
            defaultValue={member.profiles?.full_name ?? ""}
            placeholder="Juan Pérez"
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
          <input
            name="phone"
            disabled={pending}
            placeholder="Teléfono (opcional)"
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-1 rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-900 transition-colors hover:bg-amber-500 active:scale-95 disabled:opacity-60"
          >
            Actualizar perfil
          </button>
        </form>

        {/* Sección membresía */}
        <form action={handleSaveMembership} className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/50 p-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Membresía</p>
          <input
            type="hidden"
            name="membership_id"
            value={member.id}
          />
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Status</label>
            <select
              name="status"
              defaultValue={member.status}
              disabled={pending}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="active">Active</option>
              <option value="invited">Invited</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-1 rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-900 transition-colors hover:bg-amber-500 active:scale-95 disabled:opacity-60"
          >
            Actualizar membresía
          </button>
        </form>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          disabled={pending}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
        >
          Cerrar
        </button>
      </div>
    </Modal>
  );
}

// =====================================================================
// CREAR NUEVO ADMINISTRADOR DE CONDOMINIO
// =====================================================================

function AddCondoAdminSection({ orgId }: { orgId: string }) {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <Plus className="h-4 w-4 text-amber-500" aria-hidden="true" />
            Crear administrador de condominio
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Crea un usuario nuevo que tendrá acceso exclusivo al panel de esta organización. No se reutilizan usuarios entre edificios.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-900 transition-all hover:bg-amber-500 active:scale-95"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Nuevo administrador
        </button>
      </div>

      {addOpen ? (
        <CreateCondoAdminModal orgId={orgId} onClose={() => setAddOpen(false)} />
      ) : null}
    </section>
  );
}

function CreateCondoAdminModal({
  orgId,
  onClose,
}: {
  orgId: string;
  onClose: () => void;
}) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const res = await createCondoAdminAction(orgId, formData);
      if (res.ok) {
        toast({ kind: "success", message: `${res.email ?? "Administrador"} creado correctamente` });
        onClose();
        router.refresh();
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <Modal
      open
      onClose={onClose}
      variant="center"
      hideCloseButton
      ariaLabel="Crear administrador de condominio"
    >
      <header className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-amber-600">Owner Console</p>
          <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-900">
            <Plus className="h-5 w-5 text-amber-500" aria-hidden="true" />
            Nuevo administrador
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Este usuario tendrá acceso solo a esta organización.
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
          <label htmlFor="ca-name" className="block text-sm font-semibold text-slate-700">
            Nombre completo
          </label>
          <input
            id="ca-name"
            name="name"
            required
            disabled={pending}
            placeholder="Ej: María González"
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="ca-email" className="block text-sm font-semibold text-slate-700">
            Email
          </label>
          <input
            id="ca-email"
            name="email"
            type="email"
            required
            disabled={pending}
            placeholder="admin@condominio.com"
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="ca-password" className="block text-sm font-semibold text-slate-700">
            Contraseña
          </label>
          <input
            id="ca-password"
            name="password"
            type="password"
            required
            disabled={pending}
            minLength={8}
            placeholder="Mínimo 8 caracteres"
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
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
            {pending ? "Creando..." : "Crear administrador"}
          </button>
        </div>
      </form>
    </Modal>
  );
}