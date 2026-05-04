import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const modality = searchParams.get("modality");
    const city = searchParams.get("city");
    const specialty = searchParams.get("specialty");
    const acceptsNew = searchParams.get("acceptsNew");

    const where: any = {};
    if (status) where.status = status;
    if (modality) where.modality = { has: modality };
    if (city) where.city = { contains: city, mode: "insensitive" };
    if (specialty) where.specialties = { has: specialty };
    if (acceptsNew === "true") where.acceptsNewPatients = true;

    const psychologists = await prisma.psychologist.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { matchings: true } },
      },
    });

    return NextResponse.json(psychologists);
  } catch (error) {
    console.error("[GET /api/psychologists]", error);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name, email, phone, city, modality, specialties, price,
      availability, languages, gender, experience, acceptsNewPatients,
      status, internalNotes,
    } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Nombre y email son obligatorios." }, { status: 400 });
    }

    const psychologist = await prisma.psychologist.create({
      data: {
        name, email,
        phone: phone || null,
        city: city || null,
        modality: modality || [],
        specialties: specialties || [],
        price: price ? parseInt(price) : null,
        availability: availability || [],
        languages: languages || [],
        gender: gender || null,
        experience: experience ? parseInt(experience) : null,
        acceptsNewPatients: acceptsNewPatients !== false,
        status: status || "PENDING_VALIDATION",
        internalNotes: internalNotes || null,
      },
    });

    return NextResponse.json(psychologist, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Ya existe un psicólogo con este email." }, { status: 409 });
    }
    console.error("[POST /api/psychologists]", error);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
