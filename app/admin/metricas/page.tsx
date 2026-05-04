import { prisma } from "@/lib/db";

export default async function AdminMetricasPage() {
  const [
    totalPatients,
    crisisPatients,
    minorPatients,
    recommendationSent,
    firstCompleted,
    secondCompleted,
    rematch,
    noMatch,
    totalMatchings,
    totalPsych,
    activePsych,
    pausedPsych,
    recentEvents,
  ] = await Promise.all([
    prisma.patient.count(),
    prisma.patient.count({ where: { status: "CRISIS_NOT_PROCESSABLE" } }),
    prisma.patient.count({ where: { status: "MINOR_REQUIRES_ADULT" } }),
    prisma.patient.count({ where: { status: "RECOMMENDATION_SENT" } }),
    prisma.patient.count({ where: { status: "FIRST_SESSION_COMPLETED" } }),
    prisma.patient.count({ where: { status: "SECOND_SESSION_COMPLETED" } }),
    prisma.patient.count({ where: { status: "REMATCH_REQUESTED" } }),
    prisma.patient.count({ where: { status: "NO_MATCH_AVAILABLE" } }),
    prisma.matching.count(),
    prisma.psychologist.count(),
    prisma.psychologist.count({ where: { status: "ACTIVE" } }),
    prisma.psychologist.count({
      where: { status: { in: ["PAUSED_FULL_AGENDA", "PAUSED_QUALITY"] } },
    }),
    prisma.metricEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { eventName: true, createdAt: true, patientId: true },
    }),
  ]);

  const notProcessable = crisisPatients + minorPatients;
  const processable = totalPatients - notProcessable;
  const continuityRate = firstCompleted > 0
    ? Math.round((secondCompleted / firstCompleted) * 100)
    : 0;
  const conversionToFirst = processable > 0
    ? Math.round((firstCompleted / processable) * 100)
    : 0;
  const rematchRate = processable > 0
    ? Math.round((rematch / processable) * 100)
    : 0;
  const noMatchRate = processable > 0
    ? Math.round((noMatch / processable) * 100)
    : 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1c2b1c]" style={{ fontFamily: "Lora, Georgia, serif" }}>
          Métricas
        </h1>
        <p className="text-sm text-[#5a6b5a] mt-0.5">Vista semanal del estado del piloto.</p>
      </div>

      {/* Métrica norte */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-1 p-6 rounded-2xl bg-[#1c2b1c] text-white">
          <div className="text-xs text-[#6e9f6e] uppercase tracking-wider mb-2">Métrica norte</div>
          <div className="text-5xl font-light mb-1" style={{ fontFamily: "Lora, Georgia, serif" }}>
            {continuityRate}%
          </div>
          <div className="text-xs text-[#4d824d]">1ª sesión → 2ª sesión</div>
          <div className="text-xs text-[#6e9f6e] mt-2">
            {firstCompleted} → {secondCompleted} pacientes
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#e3ece3]">
          <div className="text-xs text-[#9aab9a] uppercase tracking-wider mb-2">Conversión a 1ª sesión</div>
          <div className="text-4xl font-light text-[#4d824d]" style={{ fontFamily: "Lora, Georgia, serif" }}>
            {conversionToFirst}%
          </div>
          <div className="text-xs text-[#9aab9a] mt-1">{firstCompleted} de {processable} procesables</div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#e3ece3]">
          <div className="text-xs text-[#9aab9a] uppercase tracking-wider mb-2">Rematch rate</div>
          <div className="text-4xl font-light text-[#b48a5e]" style={{ fontFamily: "Lora, Georgia, serif" }}>
            {rematchRate}%
          </div>
          <div className="text-xs text-[#9aab9a] mt-1">{rematch} rematches solicitados</div>
        </div>
      </div>

      {/* Pacientes */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-[#e3ece3] p-6">
          <h2 className="font-semibold text-[#1c2b1c] mb-4" style={{ fontFamily: "Lora, Georgia, serif" }}>Pacientes</h2>
          <div className="space-y-2">
            {[
              { label: "Total recibidos", value: totalPatients },
              { label: "Procesables", value: processable, cls: "text-[#2f522f]" },
              { label: "No procesables (crisis/menor)", value: notProcessable, cls: "text-red-500" },
              { label: "Recomendaciones enviadas", value: recommendationSent },
              { label: "1ª sesión realizada", value: firstCompleted, cls: "text-green-600" },
              { label: "2ª sesión realizada", value: secondCompleted, cls: "text-emerald-600" },
              { label: "Sin match disponible", value: noMatch },
              { label: "No-match rate", value: `${noMatchRate}%` },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-[#f4f7f4] last:border-0">
                <span className="text-sm text-[#5a6b5a]">{row.label}</span>
                <span className={`text-sm font-semibold ${row.cls || "text-[#2f522f]"}`}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {/* Matchings */}
          <div className="bg-white rounded-2xl border border-[#e3ece3] p-6">
            <h2 className="font-semibold text-[#1c2b1c] mb-4" style={{ fontFamily: "Lora, Georgia, serif" }}>Matchings</h2>
            <div className="space-y-2">
              {[
                { label: "Total matchings creados", value: totalMatchings },
                { label: "Recomendaciones enviadas", value: recommendationSent },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-[#f4f7f4] last:border-0">
                  <span className="text-sm text-[#5a6b5a]">{row.label}</span>
                  <span className="text-sm font-semibold text-[#2f522f]">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Psicólogos */}
          <div className="bg-white rounded-2xl border border-[#e3ece3] p-6">
            <h2 className="font-semibold text-[#1c2b1c] mb-4" style={{ fontFamily: "Lora, Georgia, serif" }}>Red de psicólogos</h2>
            <div className="space-y-2">
              {[
                { label: "Total registrados", value: totalPsych },
                { label: "Activos", value: activePsych, cls: "text-green-600" },
                { label: "Pausados", value: pausedPsych, cls: "text-red-400" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-[#f4f7f4] last:border-0">
                  <span className="text-sm text-[#5a6b5a]">{row.label}</span>
                  <span className={`text-sm font-semibold ${row.cls || "text-[#2f522f]"}`}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent events */}
      <div className="bg-white rounded-2xl border border-[#e3ece3] p-6">
        <h2 className="font-semibold text-[#1c2b1c] mb-4" style={{ fontFamily: "Lora, Georgia, serif" }}>
          Eventos recientes
        </h2>
        {recentEvents.length === 0 ? (
          <p className="text-sm text-[#9aab9a]">Sin eventos registrados todavía.</p>
        ) : (
          <div className="space-y-1">
            {recentEvents.map((e, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[#f4f7f4] last:border-0">
                <span className="text-xs font-mono text-[#5a6b5a]">{e.eventName}</span>
                <span className="text-xs text-[#9aab9a]">
                  {new Date(e.createdAt).toLocaleDateString("es-ES")}{" "}
                  {new Date(e.createdAt).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
