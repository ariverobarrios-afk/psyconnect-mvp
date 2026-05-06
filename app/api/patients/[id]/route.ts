import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { trackEvent } from "@/lib/analytics";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    if (!patient) {
      return NextResponse.json({ error: "Paciente no encontrado." }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error("[GET /api/patients/[id]]", error);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, internalNotes } = body;

    const patient = await prisma.patient.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(internalNotes !== undefined && { internalNotes }),
      },
    });

    if (status) {
      await trackEvent("patient_status_updated", {
        patientId: patient.id,
        metadata: { newStatus: status },
      });
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error("[PATCH /api/patients/[id]]", error);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
