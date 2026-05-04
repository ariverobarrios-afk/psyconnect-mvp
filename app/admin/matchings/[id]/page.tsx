import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import MatchingActions from "./MatchingActions";

export default async function MatchingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const matching = await prisma.matching.findUnique({
    where: { id: params.id },
    include: {
      patient: true,
      psychologist: true,
      sessions: true,
    },
  });

  if (!matching) notFound();

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <Link href="/admin/matchings" className="text-xs text-[#4d824d] hover:underline">
          ← Matchings
        </Link>
        <h1
          className="text-2xl font-semibold text-[#1c2b1c] mt-2"
          style={{ fontFamily: "Lora, Georgia, serif" }}
        >
          Matching #{matching.id.slice(-6)}
        </h1>
        <div className="flex gap-4 mt-1 text-sm text-[#5a6b5a]">
          <span>{matching.patient.name}</span>
          <span>→</span>
          <span>{matching.psychologist.name}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Info */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#e3ece3] p-5">
            <h2 className="font-semibold text-[#1c2b1c] mb-3" style={{ fontFamily: "Lora, Georgia, serif" }}>
              Paciente
            </h2>
            <div className="text-sm space-y-1">
              <div className="text-[#2f522f] font-medium">{matching.patient.name}</div>
              <div className="text-[#5a6b5a]">{matching.patient.email}</div>
              <div className="text-[#9aab9a] text-xs capitalize">{matching.patient.reason?.replace(/_/g, " ")} · {matching.patient.modality}</div>
            </div>
            <Link href={`/admin/pacientes/${matching.patient.id}`} className="text-xs text-[#4d824d] hover:underline mt-3 block">
              Ver ficha →
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-[#e3ece3] p-5">
            <h2 className="font-semibold text-[#1c2b1c] mb-3" style={{ fontFamily: "Lora, Georgia, serif" }}>
              Psicólogo
            </h2>
            <div className="text-sm space-y-1">
              <div className="text-[#2f522f] font-medium">{matching.psychologist.name}</div>
              <div className="text-[#5a6b5a]">{matching.psychologist.email}</div>
              <div className="text-[#9aab9a] text-xs">{matching.psychologist.city} · {matching.psychologist.price}€/sesión</div>
            </div>
            <Link href={`/admin/psicologos/${matching.psychologist.id}`} className="text-xs text-[#4d824d] hover:underline mt-3 block">
              Ver ficha →
            </Link>
          </div>
        </div>

        {/* Actions */}
        <MatchingActions matching={matching} />
      </div>

      {/* Sessions */}
      {matching.sessions.length > 0 && (
        <div className="mt-6 bg-white rounded-2xl border border-[#e3ece3] p-6">
          <h2 className="font-semibold text-[#1c2b1c] mb-4" style={{ fontFamily: "Lora, Georgia, serif" }}>
            Sesiones
          </h2>
          {matching.sessions.map((s) => (
            <div key={s.id} className="p-3 rounded-xl bg-[#f4f7f4] text-sm space-y-1">
              <div className="flex gap-4">
                <span className={s.firstSessionCompleted ? "text-green-600" : "text-[#9aab9a]"}>
                  1ª sesión {s.firstSessionCompleted ? "✓ realizada" : s.firstSessionBooked ? "agendada" : "pendiente"}
                </span>
                <span className={s.secondSessionCompleted ? "text-emerald-600" : "text-[#9aab9a]"}>
                  2ª sesión {s.secondSessionCompleted ? "✓ realizada" : s.secondSessionBooked ? "agendada" : "pendiente"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
