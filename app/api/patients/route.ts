import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { trackEvent } from "@/lib/analytics";
import { sendPatientConfirmation, sendNewPatientAlert } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      isAdult,
      reason,
      severity,
      previousTherapy,
      modality,
      location,
      budget,
      startTimeline,
      availability,
      preferences,
      consentAccepted,
    } = body;

    // Validation
    if (!name || !email || !consentAccepted) {
      return NextResponse.json(
        { error: "Nombre, email y consentimiento son obligatorios." },
        { status: 400 }
      );
    }

    if (!isAdult) {
      return NextResponse.json(
        { error: "Solo procesamos solicitudes de personas mayores de edad." },
        { status: 400 }
      );
    }

    // Check for immediate risk - don't create as standard patient
    const immediateRisk = severity === "crisis";
    if (immediateRisk) {
      await trackEvent("crisis_protocol_triggered", {
        metadata: { email: email.substring(0, 3) + "***" },
      });
      return NextResponse.json(
        {
          error:
            "Por tu seguridad, no podemos procesar esta solicitud. Por favor contacta con el 112 o el 024.",
        },
        { status: 400 }
      );
    }

    // Create patient
    const patient = await prisma.patient.create({
      data: {
        name,
        email,
        phone: phone || null,
        isAdult: isAdult !== false,
        reason: reason || null,
        severity: severity || null,
        immediateRisk,
        previousTherapy: previousTherapy || null,
        modality: modality || null,
        location: location || null,
        budget: budget || null,
        startTimeline: startTimeline || null,
        availability: Array.isArray(availability) ? availability : [],
        preferences: Array.isArray(preferences) ? preferences : [],
        consentAccepted: true,
        status: "NEW",
      },
    });

    // Track events
    await trackEvent("patient_created", {
      patientId: patient.id,
      metadata: { reason, modality, budget },
    });
    await trackEvent("funnel_completed", { patientId: patient.id });

    // Send emails (non-blocking)
    sendPatientConfirmation({ name, email }).catch(console.error);
    sendNewPatientAlert({ name, email, reason, modality, budget }).catch(
      console.error
    );

    return NextResponse.json({ success: true, patientId: patient.id });
  } catch (error: any) {
    if (error.code === "P2002") {
      // Unique constraint - email already exists
      return NextResponse.json(
        { error: "Ya existe una solicitud con este email." },
        { status: 409 }
      );
    }
    console.error("[POST /api/patients]", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          _count: { select: { matchings: true } },
        },
      }),
      prisma.patient.count({ where }),
    ]);

    return NextResponse.json({ patients, total, page, limit });
  } catch (error) {
    console.error("[GET /api/patients]", error);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
