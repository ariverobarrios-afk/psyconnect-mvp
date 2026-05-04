import { prisma } from "@/lib/db";

export default async function AdminDashboard() {
  const [
    newPatients,
    inReview,
    matchingsPending,
    recommendationSent,
    firstBooked,
    firstCompleted,
    secondCompleted,
    rematch,
    crisis,
  ] = await Promise.all([
    prisma.patient.count({ where: { status: "NEW" } }),
    prisma.patient.count({ where: { status: "IN_REVIEW" } }),
    prisma.matching.count({ where: { status: "PROPOSED_INTERNALLY" } }),
    prisma.matching.count({ where: { status: "SENT_TO_PATIENT" } }),
    prisma.patient.count({ where: { status: "FIRST_SESSION_BOOKED" } }),
    prisma.patient.count({ where: { status: "FIRST_SESSION_COMPLETED" } }),
    prisma.patient.count({ where: { status: "SECOND_SESSION_COMPLETED" } }),
    prisma.patient.count({ where: { status: "REMATCH_REQUESTED" } }),
    prisma.patient.count({ where: { status: "CRISIS_NOT_PROCESSABLE" } }),
  ]);

  const continuityRate =
    firstCompleted > 0
      ? Math.round((secondCompleted / firstCompleted) * 100)
      : 0;

  const recentPatients = await prisma.patient.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, name: true, status: true, reason: true, createdAt: true },
  });

  const cards = [
    { label: "Nuevos", value: newPatients, color: "bg-blue-50 border-blue-200 text-blue-700", href: "/admin/pacientes?status=NEW" },
    { label: "En revisión", value: inReview, color: "bg-yellow-50 border-yellow-200 text-yellow-700", href: "/admin/pacientes?status=IN_REVIEW" },
    { label: "Matchings pendientes", value: matchingsPending, color: "bg-orange-50 border-orange-200 text-orange-700", href: "/admin/matchings?status=PROPOSED_INTERNALLY" },
    { label: "Recomendaciones enviadas", value: recommendationSent, color: "bg-purple-50 border-purple-200 text-purple-700", href: "/admin/matchings" },
    { label: "1.ª sesión agendada", value: firstBooked, color: "bg-indigo-50 border-indigo-200 text-indigo-700", href: "/admin/sesiones" },
    { label: "1.ª sesión realizada", value: firstCompleted, color: "bg-green-50 border-green-200 text-green-700", href: "/admin/sesiones" },
    { label: "2.ª sesión realizada", value: secondCompleted, color: "bg-emerald-50 border-emerald-200 text-emerald-700", href: "/admin/sesiones" },
    { label: "Rematches", value: rematch, color: "bg-rose-50 border-rose-200 text-rose-700", href: "/admin/pacientes?status=REMATCH_REQUESTED" },
    { label: "Casos sensibles", value: crisis, color: "bg-red-50 border-red-200 text-red-700", href: "/admin/pacientes?status=CRISIS_NOT_PROCESSABLE" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-2xl font-semibold text-[#1c2b1c]"
          style={{ fontFamily: "Lora, Georgia, serif" }}
        >
          Dashboard
        </h1>
        <p className="text-sm text-[#5a6b5a] mt-1">
          Vista general del estado operativo de PSYConnect.
        </p>
      </div>

      {/* KPI principal */}
      <div className="mb-6 p-5 rounded-2xl bg-[#1c2b1c] text-white flex items-center justify-between">
        <div>
          <div className="text-xs text-[#6e9f6e] uppercase tracking-wider mb-1">
            Métrica norte · Tasa de continuidad
          </div>
          <div className="text-4xl font-light" style={{ fontFamily: "Lora, Georgia, serif" }}>
            {continuityRate}%
          </div>
          <div className="text-xs text-[#4d824d] mt-1">
            1.ª sesión → 2.ª sesión
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-[#6e9f6e]">{firstCompleted} completadas</div>
          <div className="text-sm text-[#4d824d]">{secondCompleted} con continuidad</div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <a
            key={card.label}
            href={card.href}
            className={`block p-5 rounded-2xl border ${card.color} hover:shadow-sm transition-shadow`}
          >
            <div className="text-3xl font-light mb-1" style={{ fontFamily: "Lora, Georgia, serif" }}>
              {card.value}
            </div>
            <div className="text-xs font-medium">{card.label}</div>
          </a>
        ))}
      </div>

      {/* Recent patients */}
      <div className="bg-white rounded-2xl border border-[#e3ece3] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2
            className="font-semibold text-[#1c2b1c]"
            style={{ fontFamily: "Lora, Georgia, serif" }}
          >
            Pacientes recientes
          </h2>
          <a
            href="/admin/pacientes"
            className="text-xs text-[#4d824d] hover:underline"
          >
            Ver todos →
          </a>
        </div>
        <div className="space-y-2">
          {recentPatients.length === 0 ? (
            <p className="text-sm text-[#9aab9a] text-center py-4">
              Aún no hay pacientes.
            </p>
          ) : (
            recentPatients.map((p) => (
              <a
                key={p.id}
                href={`/admin/pacientes/${p.id}`}
                className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[#f4f7f4] transition-colors"
              >
                <div>
                  <span className="text-sm font-medium text-[#2f522f]">{p.name}</span>
                  {p.reason && (
                    <span className="text-xs text-[#9aab9a] ml-2">{p.reason}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={p.status} />
                  <span className="text-xs text-[#9aab9a]">
                    {new Date(p.createdAt).toLocaleDateString("es-ES")}
                  </span>
                </div>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    NEW: "bg-blue-100 text-blue-700",
    IN_REVIEW: "bg-yellow-100 text-yellow-700",
    RECOMMENDATION_SENT: "bg-purple-100 text-purple-700",
    FIRST_SESSION_COMPLETED: "bg-green-100 text-green-700",
    SECOND_SESSION_COMPLETED: "bg-emerald-100 text-emerald-700",
    CRISIS_NOT_PROCESSABLE: "bg-red-100 text-red-700",
    CLOSED_SUCCESS: "bg-gray-100 text-gray-600",
  };
  const labels: Record<string, string> = {
    NEW: "Nuevo",
    IN_REVIEW: "Revisión",
    RECOMMENDATION_SENT: "Enviado",
    FIRST_SESSION_COMPLETED: "1ª sesión ✓",
    SECOND_SESSION_COMPLETED: "2ª sesión ✓",
    CRISIS_NOT_PROCESSABLE: "Crisis",
    CLOSED_SUCCESS: "Cerrado",
  };

  const cls = map[status] || "bg-gray-100 text-gray-500";
  const label = labels[status] || status.replace(/_/g, " ").toLowerCase();

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>
      {label}
    </span>
  );
}
