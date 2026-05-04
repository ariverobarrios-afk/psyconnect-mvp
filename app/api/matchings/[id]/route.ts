import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { trackEvent } from "@/lib/analytics";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const matching = await prisma.matching.findUnique({
      where: { id: params.id },
      include: {
        patient: true,
        psychologist: true,
        sessions: true,
      },
    });

    if (!matching) {
      return NextResponse.json({ error: "Matching no encontrado." }, { status: 404 });
    }

    return NextResponse.json(matching);
  } catch (error) {
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const matching = await prisma.matching.update({
      where: { id: params.id },
      data: {
        ...(body.status && { status: body.status }),
        ...(body.score !== undefined && { score: body.score }),
        ...(body.matchReason !== undefined && { matchReason: body.matchReason }),
        ...(body.internalNotes !== undefined && { internalNotes: body.internalNotes }),
      },
    });

    // Track key status events
    if (body.status === "SENT_TO_PATIENT") {
      await trackEvent("recommendation_sent", { patientId: matching.patientId, matchingId: matching.id });
    }

    return NextResponse.json(matching);
  } catch (error) {
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
