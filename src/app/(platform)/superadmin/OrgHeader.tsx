"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";
import { toast } from "@/components/ui/Toast";
import { createOrgAction } from "./actions";
import { CreateOrgModal } from "./CreateOrgModal";

interface OrgHeaderProps {
  stats: { total: number; active: number; trial: number; expired: number };
}

export function OrgHeader({ stats }: OrgHeaderProps) {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="mb-6">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">Owner Console</p>
          <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-slate-900">
            <Building2 className="h-7 w-7 text-amber-500" aria-hidden="true" />
            Organizaciones
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Gestiona los edificios, planes y accesos de las juntas de condominio.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-900 shadow-sm transition-all duration-200 hover:bg-amber-500 hover:shadow-md active:scale-95"
        >
          <span className="text-lg leading-none">+</span>
          Nueva organización
        </button>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Pro activas" value={stats.active} accent="green" />
        <StatCard label="En trial" value={stats.trial} accent="amber" />
        <StatCard label="Expiradas" value={stats.expired} accent="red" />
      </div>

      <CreateOrgModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(id) => {
          toast({ kind: "success", message: `Organización creada (ID: ${id?.slice(0, 8) ?? "?"}...)` });
          setCreateOpen(false);
        }}
      />
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: "green" | "amber" | "red" }) {
  const colors = {
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">{value}</p>
      <p
        className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${
          accent ? colors[accent] : "bg-slate-100 text-slate-500"
        }`}
      >
        {label}
      </p>
    </div>
  );
}
