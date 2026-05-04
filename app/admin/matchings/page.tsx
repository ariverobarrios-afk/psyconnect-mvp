import { prisma } from "@/lib/db";
import Link from "next/link";

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  PROPOSED_INTERNALLY: { label: "Propuesto internamente", cls: "bg-yellow-100 text-yellow-700" },
  PSYCHOLOGIST_CONFIRMED: { label: "Psicólogo confirmado", cls: "bg-blue-100 text-blue-700" },
  SENT_TO_PATIENT: { label: "Enviado al paciente", cls: "bg-purple-100 text-purple-700" },
  ACCEPTED_BY_PATIENT: { label: "Aceptado", cls: "bg-green-100 text-green-700" },
  REJECTED_BY_PATIENT: { label: "Rechazado", cls: "bg-red-100 text-red-700" },
  NO_RESPONSE: { label: "Sin respuesta", cls: "bg-gray-100 text-gray-500" },
  FIRST_SESSION_COMPLETED: { label: "1ª sesión ✓", cls: "bg-green-100 text-green-700" },
  SECOND_SESSION_COMPLETED: { label: "2ª sesión ✓", cls: "bg-emerald-100 text-emerald-700" },
  REMATCH_REQUESTED: { label: "Rematch", cls: "bg-rose-100 text-rose-700" },
};

export default async function AdminMatchingsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const statusFilter = searchParams.status || undefined;

  const matchings = await prisma.matching.findMany({
    where: statusFilter ? { status: statusFilter as any } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      patient: { select: { id: true, name: true } },
      psychologist: { select: { id: true, name: true } },
    },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-2xl font-semibold text-[#1c2b1c]"
            style={{ fontFamily: "Lora, Georgia, serif" }}
          >
            Matchings
          </h1>
          <p className="text-sm text-[#5a6b5a] mt-0.5">{matchings.length} registros</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {[
          { value: "", label: "Todos" },
          { value: "PROPOSED_INTERNALLY", label: "Pendientes" },
          { value: "SENT_TO_PATIENT", label: "Enviados" },
          { value: "FIRST_SESSION_COMPLETED", label: "1ª sesión ✓" },
          { value: "SECOND_SESSION_COMPLETED", label: "2ª sesión ✓" },
        ].map((opt) => (
          <Link
            key={opt.value}
            href={opt.value ? `/admin/matchings?status=${opt.value}` : "/admin/matchings"}
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

      <div className="bg-white rounded-2xl border border-[#e3ece3] overflow-hidden">
        {matchings.length === 0 ? (
          <div className="text-center py-16 text-[#9aab9a] text-sm">
            No hay matchings con este filtro.
            <div className="mt-3 text-xs">
              Los matchings se crean desde la ficha de cada paciente.
            </div>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e3ece3] bg-[#f4f7f4]">
                <th className="text-left px-4 py-3 text-xs text-[#5a6b5a] font-medium">Paciente</th>
                <th className="text-left px-4 py-3 text-xs text-[#5a6b5a] font-medium">Psicólogo</th>
                <th className="text-left px-4 py-3 text-xs text-[#5a6b5a] font-medium">Score</th>
                <th className="text-left px-4 py-3 text-xs text-[#5a6b5a] font-medium">Estado</th>
                <th className="text-left px-4 py-3 text-xs text-[#5a6b5a] font-medium">Fecha</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {matchings.map((m) => {
                const badge = STATUS_LABELS[m.status] || { label: m.status, cls: "bg-gray-100 text-gray-500" };
                return (
                  <tr key={m.id} className="border-b border-[#f4f7f4] hover:bg-[#faf8f5] transition-colors">
                    <td className="px-4 py-3 font-medium text-[#2f522f]">{m.patient.name}</td>
                    <td className="px-4 py-3 text-[#5a6b5a]">{m.psychologist.name}</td>
                    <td className="px-4 py-3">
                      {m.score !== null ? (
                        <span className={`text-xs font-bold ${m.score >= 80 ? "text-green-600" : m.score >= 65 ? "text-yellow-600" : "text-red-400"}`}>
                          {m.score}/100
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#9aab9a] text-xs">
                      {new Date(m.createdAt).toLocaleDateString("es-ES")}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/matchings/${m.id}`} className="text-xs text-[#4d824d] hover:underline">
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
