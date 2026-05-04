import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { trackEvent } from "@/lib/analytics";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const patientId = searchParams.get("patientId");

    const where: any = {};
    if (status) where.status = status;
    if (patientId) where.patientId = patientId;

    const matchings = await prisma.matching.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        patient: { select: { id: true, name: true, email: true, status: true } },
        psychologist: { select: { id: true, name: true, city: true, specialties: true } },
      },
    });

    return NextResponse.json(matchings);
  } catch (error) {
    console.error("[GET /api/matchings]", error);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patientId, psychologistId, score, matchReason, internalNotes } = body;

    if (!patientId || !psychologistId) {
      return NextResponse.json(
        { error: "patientId y psychologistId son obligatorios." },
        { status: 400 }
      );
    }

    const matching = await prisma.matching.create({
      data: {
        patientId,
        psychologistId,
        score: score ? parseInt(score) : null,
        matchReason: matchReason || null,
        internalNotes: internalNotes || null,
        status: "PROPOSED_INTERNALLY",
      },
      include: {
        patient: true,
        psychologist: true,
      },
    });

    await trackEvent("matching_created", {
      patientId,
      matchingId: matching.id,
      metadata: { score, psychologistId },
    });

    return NextResponse.json(matching, { status: 201 });
  } catch (error) {
    console.error("[POST /api/matchings]", error);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
