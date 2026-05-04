import { prisma } from "@/lib/db";
import Link from "next/link";
import NewPsychologistForm from "./NewPsychologistForm";

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  PENDING_VALIDATION: { label: "Pendiente", cls: "bg-yellow-100 text-yellow-700" },
  ACTIVE: { label: "Activo", cls: "bg-green-100 text-green-700" },
  LOW_AVAILABILITY: { label: "Baja disponib.", cls: "bg-orange-100 text-orange-700" },
  PAUSED_FULL_AGENDA: { label: "Agenda llena", cls: "bg-red-100 text-red-700" },
  PAUSED_QUALITY: { label: "Pausa calidad", cls: "bg-red-100 text-red-700" },
  INACTIVE: { label: "Inactivo", cls: "bg-gray-100 text-gray-500" },
};

export default async function AdminPsicologosPage({
  searchParams,
}: {
  searchParams: { status?: string; new?: string };
}) {
  const statusFilter = searchParams.status || undefined;
  const showForm = searchParams.new === "1";

  const psychologists = await prisma.psychologist.findMany({
    where: statusFilter ? { status: statusFilter as any } : undefined,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { matchings: true } } },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-2xl font-semibold text-[#1c2b1c]"
            style={{ fontFamily: "Lora, Georgia, serif" }}
          >
            Psicólogos
          </h1>
          <p className="text-sm text-[#5a6b5a] mt-0.5">{psychologists.length} registrados</p>
        </div>
        <Link
          href="/admin/psicologos?new=1"
          className="px-4 py-2 rounded-full text-white text-sm font-medium"
          style={{ background: "linear-gradient(135deg, #4d824d, #3a673a)" }}
        >
          + Añadir psicólogo
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {[
          { value: "", label: "Todos" },
          { value: "ACTIVE", label: "Activos" },
          { value: "PENDING_VALIDATION", label: "Pendientes" },
          { value: "LOW_AVAILABILITY", label: "Baja disponib." },
          { value: "PAUSED_FULL_AGENDA", label: "Agenda llena" },
          { value: "INACTIVE", label: "Inactivos" },
        ].map((opt) => (
          <Link
            key={opt.value}
            href={opt.value ? `/admin/psicologos?status=${opt.value}` : "/admin/psicologos"}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              statusFilter === opt.value || (!statusFilter && !opt.value)
                ? "bg-[#2f522f] text-white"
                : "bg-white border border-[#e3ece3] text-[#5a6b5a] hover:border-[#4d824d]"
            }`}
          >
            {opt.label}
          </Link>
        ))}
      </div>

      {/* New form */}
      {showForm && <NewPsychologistForm />}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#e3ece3] overflow-hidden">
        {psychologists.length === 0 ? (
          <div className="text-center py-16 text-[#9aab9a] text-sm">
            No hay psicólogos con este filtro.
            {!showForm && (
              <div className="mt-3">
                <Link href="/admin/psicologos?new=1" className="text-[#4d824d] hover:underline">
                  Añadir el primero
                </Link>
              </div>
            )}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e3ece3] bg-[#f4f7f4]">
                <th className="text-left px-4 py-3 text-xs text-[#5a6b5a] font-medium">Nombre</th>
                <th className="text-left px-4 py-3 text-xs text-[#5a6b5a] font-medium">Ciudad</th>
                <th className="text-left px-4 py-3 text-xs text-[#5a6b5a] font-medium">Modalidad</th>
                <th className="text-left px-4 py-3 text-xs text-[#5a6b5a] font-medium">Especialidades</th>
                <th className="text-left px-4 py-3 text-xs text-[#5a6b5a] font-medium">Tarifa</th>
                <th className="text-left px-4 py-3 text-xs text-[#5a6b5a] font-medium">Estado</th>
                <th className="text-left px-4 py-3 text-xs text-[#5a6b5a] font-medium">Acepta</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {psychologists.map((p) => {
                const badge = STATUS_LABELS[p.status] || { label: p.status, cls: "bg-gray-100 text-gray-500" };
                return (
                  <tr key={p.id} className="border-b border-[#f4f7f4] hover:bg-[#faf8f5] transition-colors">
                    <td className="px-4 py-3 font-medium text-[#2f522f]">{p.name}</td>
                    <td className="px-4 py-3 text-[#5a6b5a]">{p.city || "—"}</td>
                    <td className="px-4 py-3 text-[#5a6b5a] capitalize">{p.modality.join(", ") || "—"}</td>
                    <td className="px-4 py-3 text-[#5a6b5a] text-xs">
                      {p.specialties.slice(0, 3).join(", ")}
                      {p.specialties.length > 3 && " ..."}
                    </td>
                    <td className="px-4 py-3 text-[#5a6b5a]">
                      {p.price ? `${p.price}€` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${p.acceptsNewPatients ? "text-green-600" : "text-red-400"}`}>
                        {p.acceptsNewPatients ? "Sí" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/psicologos/${p.id}`} className="text-xs text-[#4d824d] hover:underline">
                        Ver →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
