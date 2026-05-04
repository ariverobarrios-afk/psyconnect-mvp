import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { trackEvent } from "@/lib/analytics";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");

    const where: any = {};
    if (patientId) where.patientId = patientId;

    const sessions = await prisma.session.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        patient: { select: { id: true, name: true } },
        psychologist: { select: { id: true, name: true } },
        matching: { select: { id: true, score: true } },
      },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patientId, psychologistId, matchingId } = body;

    if (!patientId || !psychologistId) {
      return NextResponse.json(
        { error: "patientId y psychologistId son obligatorios." },
        { status: 400 }
      );
    }

    const session = await prisma.session.create({
      data: { patientId, psychologistId, matchingId: matchingId || null },
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) return NextResponse.json({ error: "id requerido." }, { status: 400 });

    const session = await prisma.session.update({
      where: { id },
      data: {
        ...(updates.firstSessionDate && { firstSessionDate: new Date(updates.firstSessionDate) }),
        ...(updates.firstSessionBooked !== undefined && { firstSessionBooked: updates.firstSessionBooked }),
        ...(updates.firstSessionCompleted !== undefined && { firstSessionCompleted: updates.firstSessionCompleted }),
        ...(updates.secondSessionDate && { secondSessionDate: new Date(updates.secondSessionDate) }),
        ...(updates.secondSessionBooked !== undefined && { secondSessionBooked: updates.secondSessionBooked }),
        ...(updates.secondSessionCompleted !== undefined && { secondSessionCompleted: updates.secondSessionCompleted }),
        ...(updates.noContinuityReason !== undefined && { noContinuityReason: updates.noContinuityReason }),
        ...(updates.patientFeedback !== undefined && { patientFeedback: updates.patientFeedback }),
        ...(updates.psychologistFeedback !== undefined && { psychologistFeedback: updates.psychologistFeedback }),
      },
    });

    if (updates.firstSessionCompleted) {
      await trackEvent("first_session_completed", { patientId: session.patientId });
    }
    if (updates.secondSessionCompleted) {
      await trackEvent("second_session_completed", { patientId: session.patientId });
    }

    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
