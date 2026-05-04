import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import PatientActions from "./PatientActions";

export default async function PatientDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const patient = await prisma.patient.findUnique({
    where: { id: params.id },
    include: {
      matchings: {
        include: { psychologist: true },
        orderBy: { createdAt: "desc" },
      },
      sessions: {
        include: { psychologist: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!patient) notFound();

  const psychologists = await prisma.psychologist.findMany({
    where: { status: "ACTIVE", acceptsNewPatients: true },
    select: { id: true, name: true, city: true, specialties: true },
    orderBy: { name: "asc" },
  });

  const funnelData = [
    { label: "Motivo", value: patient.reason?.replace(/_/g, " ") },
    { label: "Severidad", value: patient.severity?.replace(/_/g, " ") },
    { label: "Terapia previa", value: patient.previousTherapy?.replace(/_/g, " ") },
    { label: "Modalidad", value: patient.modality },
    { label: "Ubicación", value: patient.location },
    { label: "Presupuesto", value: patient.budget?.replace(/_/g, " ") },
    { label: "Cuándo empezar", value: patient.startTimeline?.replace(/_/g, " ") },
    { label: "Disponibilidad", value: patient.availability.join(", ") },
    { label: "Preferencias", value: patient.preferences.join(", ") },
  ];

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <Link
          href="/admin/pacientes"
          className="text-xs text-[#4d824d] hover:underline"
        >
          ← Pacientes
        </Link>
        <h1
          className="text-2xl font-semibold text-[#1c2b1c] mt-2"
          style={{ fontFamily: "Lora, Georgia, serif" }}
        >
          {patient.name}
        </h1>
        <p className="text-sm text-[#5a6b5a]">{patient.email}</p>
        {patient.phone && (
          <p className="text-sm text-[#5a6b5a]">{patient.phone}</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Funnel data */}
        <div className="bg-white rounded-2xl border border-[#e3ece3] p-6">
          <h2
            className="font-semibold text-[#1c2b1c] mb-4"
            style={{ fontFamily: "Lora, Georgia, serif" }}
          >
            Respuestas del funnel
          </h2>
          <dl className="space-y-3">
            {funnelData.map((item) => (
              <div key={item.label}>
                <dt className="text-xs text-[#9aab9a] uppercase tracking-wide">{item.label}</dt>
                <dd className="text-sm text-[#2f522f] mt-0.5 capitalize">
                  {item.value || "—"}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Actions */}
        <div>
          <PatientActions
            patient={patient}
            psychologists={psychologists}
          />
        </div>
      </div>

      {/* Matchings */}
      {patient.matchings.length > 0 && (
        <div className="mt-6 bg-white rounded-2xl border border-[#e3ece3] p-6">
          <h2
            className="font-semibold text-[#1c2b1c] mb-4"
            style={{ fontFamily: "Lora, Georgia, serif" }}
          >
            Matchings asociados
          </h2>
          <div className="space-y-3">
            {patient.matchings.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#f4f7f4]"
              >
                <div>
                  <div className="text-sm font-medium text-[#2f522f]">
                    {m.psychologist.name}
                  </div>
                  <div className="text-xs text-[#9aab9a]">
                    Score: {m.score ?? "—"} · {m.status.replace(/_/g, " ")}
                  </div>
                </div>
                <Link
                  href={`/admin/matchings/${m.id}`}
                  className="text-xs text-[#4d824d] hover:underline"
                >
                  Ver →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
