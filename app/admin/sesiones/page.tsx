import { prisma } from "@/lib/db";
import SessionsManager from "./SessionsManager";

export default async function AdminSesionesPage() {
  const sessions = await prisma.session.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      patient: { select: { id: true, name: true } },
      psychologist: { select: { id: true, name: true } },
      matching: { select: { id: true, score: true } },
    },
  });

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1
          className="text-2xl font-semibold text-[#1c2b1c]"
          style={{ fontFamily: "Lora, Georgia, serif" }}
        >
          Sesiones
        </h1>
        <p className="text-sm text-[#5a6b5a] mt-0.5">
          Seguimiento de primeras y segundas sesiones.
        </p>
      </div>

      <SessionsManager sessions={sessions} />
    </div>
  );
}
