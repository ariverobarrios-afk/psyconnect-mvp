import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const [
      totalPatients,
      newPatients,
      inReviewPatients,
      crisisPatients,
      recommendationSent,
      firstSessionBooked,
      firstSessionCompleted,
      secondSessionCompleted,
      rematchRequested,
      totalMatchings,
      sentMatchings,
      totalPsychologists,
      activePsychologists,
    ] = await Promise.all([
      prisma.patient.count(),
      prisma.patient.count({ where: { status: "NEW" } }),
      prisma.patient.count({ where: { status: "IN_REVIEW" } }),
      prisma.patient.count({ where: { status: "CRISIS_NOT_PROCESSABLE" } }),
      prisma.patient.count({ where: { status: "RECOMMENDATION_SENT" } }),
      prisma.patient.count({ where: { status: "FIRST_SESSION_BOOKED" } }),
      prisma.patient.count({ where: { status: "FIRST_SESSION_COMPLETED" } }),
      prisma.patient.count({ where: { status: "SECOND_SESSION_COMPLETED" } }),
      prisma.patient.count({ where: { status: "REMATCH_REQUESTED" } }),
      prisma.matching.count(),
      prisma.matching.count({ where: { status: "SENT_TO_PATIENT" } }),
      prisma.psychologist.count(),
      prisma.psychologist.count({ where: { status: "ACTIVE" } }),
    ]);

    const processablePatients = totalPatients - crisisPatients;
    const continuityRate =
      firstSessionCompleted > 0
        ? Math.round((secondSessionCompleted / firstSessionCompleted) * 100)
        : 0;

    return NextResponse.json({
      patients: {
        total: totalPatients,
        new: newPatients,
        inReview: inReviewPatients,
        crisis: crisisPatients,
        processable: processablePatients,
        recommendationSent,
        firstSessionBooked,
        firstSessionCompleted,
        secondSessionCompleted,
        rematchRequested,
      },
      matchings: {
        total: totalMatchings,
        sent: sentMatchings,
      },
      psychologists: {
        total: totalPsychologists,
        active: activePsychologists,
      },
      kpis: {
        continuityRate,
        conversionToFirstSession:
          processablePatients > 0
            ? Math.round((firstSessionCompleted / processablePatients) * 100)
            : 0,
      },
    });
  } catch (error) {
    console.error("[GET /api/metrics]", error);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
