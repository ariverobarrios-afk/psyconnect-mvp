import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import PsychologistEditor from "./PsychologistEditor";

export default async function PsychologistDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const psychologist = await prisma.psychologist.findUnique({
    where: { id: params.id },
    include: {
      matchings: {
        include: { patient: { select: { id: true, name: true, status: true } } },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { matchings: true, sessions: true } },
    },
  });

  if (!psychologist) notFound();

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/psicologos" className="text-xs text-[#4d824d] hover:underline">
          ← Psicólogos
        </Link>
        <h1
          className="text-2xl font-semibold text-[#1c2b1c] mt-2"
          style={{ fontFamily: "Lora, Georgia, serif" }}
        >
          {psychologist.name}
        </h1>
        <p className="text-sm text-[#5a6b5a]">{psychologist.email}</p>
        <div className="flex gap-4 mt-2 text-xs text-[#9aab9a]">
          <span>{psychologist._count.matchings} matchings</span>
          <span>{psychologist._count.sessions} sesiones</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <PsychologistEditor psychologist={psychologist} />

        {/* Matchings */}
        <div>
          <div className="bg-white rounded-2xl border border-[#e3ece3] p-6">
            <h2
              className="font-semibold text-[#1c2b1c] mb-4"
              style={{ fontFamily: "Lora, Georgia, serif" }}
            >
              Matchings asociados
            </h2>
            {psychologist.matchings.length === 0 ? (
              <p className="text-sm text-[#9aab9a]">Sin matchings todavía.</p>
            ) : (
              <div className="space-y-2">
                {psychologist.matchings.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#f4f7f4]"
                  >
                    <div>
                      <div className="text-sm font-medium text-[#2f522f]">
                        {m.patient.name}
                      </div>
                      <div className="text-xs text-[#9aab9a]">
                        {m.status.replace(/_/g, " ")}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
