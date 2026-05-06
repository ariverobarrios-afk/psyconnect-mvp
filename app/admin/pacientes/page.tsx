import { prisma } from "@/lib/db";
import Link from "next/link";

const STATUS_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "NEW", label: "Nuevo" },
  { value: "IN_REVIEW", label: "En revisión" },
  { value: "WAITING_PSYCHOLOGIST_CONFIRMATION", label: "Esperando psicólogo" },
  { value: "RECOMMENDATION_SENT", label: "Recomendación enviada" },
  { value: "FIRST_SESSION_BOOKED", label: "1ª sesión agendada" },
  { value: "FIRST_SESSION_COMPLETED", label: "1ª sesión realizada" },
  { value: "SECOND_SESSION_BOOKED", label: "2ª sesión agendada" },
  { value: "SECOND_SESSION_COMPLETED", label: "2ª sesión realizada" },
  { value: "REMATCH_REQUESTED", label: "Rematch" },
  { value: "CRISIS_NOT_PROCESSABLE", label: "Crisis" },
  { value: "CLOSED_SUCCESS", label: "Cerrado (éxito)" },
  { value: "CLOSED_NO_FIT", label: "Cerrado (sin encaje)" },
];

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  NEW: { label: "Nuevo", cls: "bg-blue-100 text-blue-700" },
  IN_REVIEW: { label: "Revisión", cls: "bg-yellow-100 text-yellow-700" },
  WAITING_PSYCHOLOGIST_CONFIRMATION: { label: "Esperando", cls: "bg-orange-100 text-orange-700" },
  RECOMMENDATION_SENT: { label: "Enviado", cls: "bg-purple-100 text-purple-700" },
  FIRST_SESSION_BOOKED: { label: "1ª agendada", cls: "bg-indigo-100 text-indigo-700" },
  FIRST_SESSION_COMPLETED: { label: "1ª realizada ✓", cls: "bg-green-100 text-green-700" },
  SECOND_SESSION_BOOKED: { label: "2ª agendada", cls: "bg-teal-100 text-teal-700" },
  SECOND_SESSION_COMPLETED: { label: "2ª realizada ✓", cls: "bg-emerald-100 text-emerald-700" },
  REMATCH_REQUESTED: { label: "Rematch", cls: "bg-rose-100 text-rose-700" },
  CRISIS_NOT_PROCESSABLE: { label: "Crisis", cls: "bg-red-100 text-red-700" },
  MINOR_REQUIRES_ADULT: { label: "Menor", cls: "bg-gray-100 text-gray-600" },
  CLOSED_SUCCESS: { label: "Cerrado ✓", cls: "bg-gray-100 text-gray-600" },
  CLOSED_NO_FIT: { label: "Sin encaje", cls: "bg-gray-100 text-gray-500" },
  CLOSED_NO_RESPONSE: { label: "Sin respuesta", cls: "bg-gray-100 text-gray-500" },
};

export default async function AdminPacientesPage({
  searchParams,
}: {
  searchParams: { status?: string; search?: string };
}) {
  const statusFilter = searchParams.status || undefined;

  const where: any = {};
  if (statusFilter) where.status = statusFilter;

  const patients = await prisma.patient.findMany({
    where,
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
            Pacientes
          </h1>
          <p className="text-sm text-[#5a6b5a] mt-0.5">{patients.length} resultados</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {STATUS_OPTIONS.map((opt) => (
          <Link
            key={opt.value}
            href={opt.value ? `/admin/pacientes?status=${opt.value}` : "/admin/pacientes"}
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

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#e3ece3] overflow-hidden">
        {patients.length === 0 ? (
          <div className="text-center py-16 text-[#9aab9a] text-sm">
            No hay pacientes con este filtro.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e3ece3] bg-[#f4f7f4]">
                <th className="text-left px-4 py-3 text-xs text-[#5a6b5a] font-medium">Nombre</th>
                <th className="text-left px-4 py-3 text-xs text-[#5a6b5a] font-medium">Email</th>
                <th className="text-left px-4 py-3 text-xs text-[#5a6b5a] font-medium">Motivo</th>
                <th className="text-left px-4 py-3 text-xs text-[#5a6b5a] font-medium">Modalidad</th>
                <th className="text-left px-4 py-3 text-xs text-[#5a6b5a] font-medium">Estado</th>
                <th className="text-left px-4 py-3 text-xs text-[#5a6b5a] font-medium">Fecha</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => {
                const badge = STATUS_LABELS[p.status] || { label: p.status, cls: "bg-gray-100 text-gray-500" };
                return (
                  <tr
                    key={p.id}
                    className="border-b border-[#f4f7f4] hover:bg-[#faf8f5] transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-[#2f522f]">{p.name}</td>
                    <td className="px-4 py-3 text-[#5a6b5a]">{p.email}</td>
                    <td className="px-4 py-3 text-[#5a6b5a] capitalize">
                      {p.reason?.replace(/_/g, " ") || "—"}
                    </td>
                    <td className="px-4 py-3 text-[#5a6b5a] capitalize">
                      {p.modality || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#9aab9a] text-xs">
                      {new Date(p.createdAt).toLocaleDateString("es-ES")}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/pacientes/${p.id}`}
                        className="text-xs text-[#4d824d] hover:underline"
                      >
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
