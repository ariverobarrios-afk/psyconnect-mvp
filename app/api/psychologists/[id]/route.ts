import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    if (!psychologist) {
      return NextResponse.json({ error: "Psicólogo no encontrado." }, { status: 404 });
    }

    return NextResponse.json(psychologist);
  } catch (error) {
    console.error("[GET /api/psychologists/[id]]", error);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const psychologist = await prisma.psychologist.update({
      where: { id: params.id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.email && { email: body.email }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.city !== undefined && { city: body.city }),
        ...(body.modality && { modality: body.modality }),
        ...(body.specialties && { specialties: body.specialties }),
        ...(body.price !== undefined && { price: body.price ? parseInt(body.price) : null }),
        ...(body.availability && { availability: body.availability }),
        ...(body.languages && { languages: body.languages }),
        ...(body.gender !== undefined && { gender: body.gender }),
        ...(body.experience !== undefined && { experience: body.experience }),
        ...(body.acceptsNewPatients !== undefined && { acceptsNewPatients: body.acceptsNewPatients }),
        ...(body.status && { status: body.status }),
        ...(body.internalNotes !== undefined && { internalNotes: body.internalNotes }),
      },
    });

    return NextResponse.json(psychologist);
  } catch (error) {
    console.error("[PATCH /api/psychologists/[id]]", error);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
