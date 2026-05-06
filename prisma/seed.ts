import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Seed psychologists
  const psych1 = await prisma.psychologist.upsert({
    where: { email: "ana.garcia@example.com" },
    update: {},
    create: {
      name: "Ana García López",
      email: "ana.garcia@example.com",
      phone: "+34 600 111 222",
      city: "Madrid",
      modality: ["online", "presencial"],
      specialties: ["ansiedad", "depresion", "autoestima", "relaciones"],
      price: 65,
      availability: ["tardes", "fines_de_semana"],
      languages: ["español", "inglés"],
      gender: "mujer",
      experience: 8,
      acceptsNewPatients: true,
      status: "ACTIVE",
      internalNotes: "Especialista en TCC. Excelente feedback de pacientes.",
    },
  });

  const psych2 = await prisma.psychologist.upsert({
    where: { email: "carlos.ruiz@example.com" },
    update: {},
    create: {
      name: "Carlos Ruiz Martínez",
      email: "carlos.ruiz@example.com",
      phone: "+34 600 333 444",
      city: "Barcelona",
      modality: ["online"],
      specialties: ["duelo", "trauma", "ansiedad", "burnout"],
      price: 75,
      availability: ["mañanas", "tardes"],
      languages: ["español", "catalán"],
      gender: "hombre",
      experience: 12,
      acceptsNewPatients: true,
      status: "ACTIVE",
      internalNotes: "Enfoque humanista-integrativo. Muy recomendado.",
    },
  });

  const psych3 = await prisma.psychologist.upsert({
    where: { email: "laura.fernandez@example.com" },
    update: {},
    create: {
      name: "Laura Fernández Sanz",
      email: "laura.fernandez@example.com",
      phone: "+34 600 555 666",
      city: "Valencia",
      modality: ["online", "presencial"],
      specialties: ["pareja", "familia", "autoestima", "desarrollo_personal"],
      price: 60,
      availability: ["tardes", "noches"],
      languages: ["español"],
      gender: "mujer",
      experience: 5,
      acceptsNewPatients: true,
      status: "ACTIVE",
    },
  });

  // Seed patients
  const patient1 = await prisma.patient.upsert({
    where: { email: "maria.ejemplo@test.com" },
    update: {},
    create: {
      name: "María Ejemplo",
      email: "maria.ejemplo@test.com",
      phone: "+34 611 000 001",
      isAdult: true,
      reason: "ansiedad",
      severity: "me_afecta_bastante",
      immediateRisk: false,
      previousTherapy: "si",
      modality: "online",
      budget: "50-70",
      startTimeline: "proximas_2_semanas",
      availability: ["tardes", "noches"],
      preferences: ["prefiero_psicologa_mujer"],
      consentAccepted: true,
      status: "IN_REVIEW",
      internalNotes: "Paciente con buena motivación. Revisar disponibilidad de Ana García.",
    },
  });

  const patient2 = await prisma.patient.upsert({
    where: { email: "juan.prueba@test.com" },
    update: {},
    create: {
      name: "Juan Prueba",
      email: "juan.prueba@test.com",
      isAdult: true,
      reason: "burnout",
      severity: "necesito_ayuda_esta_semana",
      immediateRisk: false,
      previousTherapy: "no",
      modality: "online",
      budget: "70-90",
      startTimeline: "esta_semana",
      availability: ["mañanas"],
      preferences: [],
      consentAccepted: true,
      status: "RECOMMENDATION_SENT",
    },
  });

  // Seed matching
  const matching1 = await prisma.matching.upsert({
    where: { id: "seed-matching-001" },
    update: {},
    create: {
      id: "seed-matching-001",
      patientId: patient2.id,
      psychologistId: psych2.id,
      score: 85,
      matchReason:
        "Buena coincidencia en disponibilidad matutina, modalidad online y especialidad en burnout. Carlos tiene experiencia en primeras terapias.",
      status: "SENT_TO_PATIENT",
      internalNotes: "Enviado el 27/04. Seguimiento el 29/04.",
    },
  });

  console.log("✅ Seed completado:");
  console.log(`   ${[psych1, psych2, psych3].length} psicólogos`);
  console.log(`   ${[patient1, patient2].length} pacientes`);
  console.log(`   1 matching`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
