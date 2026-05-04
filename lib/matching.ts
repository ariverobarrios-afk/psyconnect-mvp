// PSYConnect - Matching Engine v1.1
// Este módulo sugiere candidatos. La decisión final siempre es manual desde /admin.

export interface PatientProfile {
  isAdult: boolean;
  immediateRisk: boolean;
  reason: string | null;
  modality: string | null;
  location: string | null;
  budget: string | null;
  startTimeline: string | null;
  availability: string[];
  preferences: string[];
  previousTherapy: string | null;
}

export interface PsychologistProfile {
  id: string;
  name: string;
  city: string | null;
  modality: string[];
  specialties: string[];
  price: number | null;
  availability: string[];
  languages: string[];
  gender: string | null;
  experience: number | null;
  acceptsNewPatients: boolean;
  status: string;
}

export interface HardFilterResult {
  passed: boolean;
  reason?: string;
}

export interface MatchingScore {
  total: number;
  breakdown: {
    specialtyMatch: number;
    modalityMatch: number;
    budgetMatch: number;
    availabilityMatch: number;
    preferencesMatch: number;
    styleMatch: number;
  };
  recommendation: "primary" | "alternative" | "not_recommended";
  label: string;
}

// ──────────────────────────────────────────────
// HARD FILTERS
// ──────────────────────────────────────────────
export function evaluateHardFilters(
  patient: PatientProfile,
  psychologist: PsychologistProfile
): HardFilterResult {
  if (!patient.isAdult) {
    return {
      passed: false,
      reason: "Paciente menor de edad sin adulto responsable y protocolo específico.",
    };
  }

  if (patient.immediateRisk) {
    return {
      passed: false,
      reason: "Riesgo inmediato detectado. No entra en flujo comercial estándar.",
    };
  }

  if (!psychologist.acceptsNewPatients || psychologist.status !== "ACTIVE") {
    return {
      passed: false,
      reason: "El psicólogo no acepta nuevos pacientes o no está activo.",
    };
  }

  // Modalidad incompatible
  if (patient.modality === "presencial" || patient.modality === "indiferente") {
    const hasPresencial = psychologist.modality.includes("presencial");
    if (patient.modality === "presencial" && !hasPresencial) {
      return {
        passed: false,
        reason: "Modalidad incompatible: paciente exige presencial pero psicólogo solo hace online.",
      };
    }
  }

  // Ubicación incompatible (presencial)
  if (
    patient.modality === "presencial" &&
    patient.location &&
    psychologist.city
  ) {
    const patientCity = patient.location.toLowerCase().trim();
    const psychCity = psychologist.city.toLowerCase().trim();
    if (patientCity !== psychCity && !patientCity.includes(psychCity) && !psychCity.includes(patientCity)) {
      return {
        passed: false,
        reason: `Ubicación incompatible: paciente en ${patient.location}, psicólogo en ${psychologist.city}.`,
      };
    }
  }

  // Presupuesto incompatible
  if (patient.budget && patient.budget !== "no_lo_se" && psychologist.price) {
    const budgetMap: Record<string, [number, number]> = {
      "menos_50": [0, 50],
      "50-70": [50, 70],
      "70-90": [70, 90],
      "mas_90": [90, 999],
    };
    const range = budgetMap[patient.budget];
    if (range && (psychologist.price < range[0] || psychologist.price > range[1] * 1.1)) {
      // Only hard-fail if price is clearly above max (allow 10% tolerance)
      if (psychologist.price > range[1] * 1.15) {
        return {
          passed: false,
          reason: `Presupuesto incompatible: paciente hasta ${range[1]}€, psicólogo cobra ${psychologist.price}€.`,
        };
      }
    }
  }

  return { passed: true };
}

// ──────────────────────────────────────────────
// SCORING (100 puntos)
// ──────────────────────────────────────────────
export function calculateMatchingScore(
  patient: PatientProfile,
  psychologist: PsychologistProfile
): MatchingScore {
  let specialtyMatch = 0; // 30pts
  let modalityMatch = 0;  // 20pts
  let budgetMatch = 0;    // 15pts
  let availabilityMatch = 0; // 15pts
  let preferencesMatch = 0;  // 10pts
  let styleMatch = 0;        // 10pts

  // Especialidad / motivo (30pts)
  const reasonToSpecialty: Record<string, string[]> = {
    ansiedad: ["ansiedad", "estrés"],
    estado_animo_bajo: ["depresion", "estado_animo", "ansiedad"],
    relaciones_pareja: ["pareja", "relaciones"],
    autoestima: ["autoestima", "desarrollo_personal"],
    duelo_perdida: ["duelo", "trauma"],
    familia: ["familia"],
    trabajo_burnout: ["burnout", "trabajo", "estrés"],
    desarrollo_personal: ["desarrollo_personal", "autoestima"],
    no_tengo_claro: [],
    otro: [],
  };
  const targetSpecialties = patient.reason
    ? reasonToSpecialty[patient.reason] || []
    : [];
  if (targetSpecialties.length === 0) {
    specialtyMatch = 20; // neutral
  } else {
    const matchedSpecialties = psychologist.specialties.filter((s) =>
      targetSpecialties.some((t) => s.toLowerCase().includes(t))
    );
    specialtyMatch = matchedSpecialties.length > 0 ? 30 : 5;
  }

  // Modalidad / ubicación (20pts)
  const patientModality = patient.modality || "indiferente";
  if (patientModality === "indiferente") {
    modalityMatch = 20;
  } else if (psychologist.modality.includes(patientModality)) {
    modalityMatch = 20;
  } else {
    modalityMatch = 0;
  }

  // Presupuesto (15pts)
  const budgetMap: Record<string, [number, number]> = {
    "menos_50": [0, 50],
    "50-70": [50, 70],
    "70-90": [70, 90],
    "mas_90": [90, 999],
    "no_lo_se": [0, 999],
  };
  const budgetKey = patient.budget || "no_lo_se";
  const budgetRange = budgetMap[budgetKey] || [0, 999];
  if (!psychologist.price) {
    budgetMatch = 10;
  } else if (
    psychologist.price >= budgetRange[0] &&
    psychologist.price <= budgetRange[1]
  ) {
    budgetMatch = 15;
  } else if (psychologist.price <= budgetRange[1] * 1.1) {
    budgetMatch = 8;
  } else {
    budgetMatch = 2;
  }

  // Disponibilidad (15pts)
  if (patient.availability.length === 0) {
    availabilityMatch = 10;
  } else {
    const matchedSlots = patient.availability.filter((slot) =>
      psychologist.availability.some((pSlot) =>
        pSlot.toLowerCase().includes(slot.toLowerCase())
      )
    );
    availabilityMatch = Math.round((matchedSlots.length / patient.availability.length) * 15);
  }

  // Preferencias (10pts)
  const genderPref = patient.preferences.find(
    (p) => p.includes("psicologa_mujer") || p.includes("psicologo_hombre")
  );
  if (!genderPref) {
    preferencesMatch = 10;
  } else if (
    (genderPref.includes("psicologa_mujer") && psychologist.gender === "mujer") ||
    (genderPref.includes("psicologo_hombre") && psychologist.gender === "hombre")
  ) {
    preferencesMatch = 10;
  } else {
    preferencesMatch = 3;
  }

  // Estilo / experiencia (10pts)
  const expYears = psychologist.experience || 0;
  if (expYears >= 8) styleMatch = 10;
  else if (expYears >= 4) styleMatch = 7;
  else styleMatch = 5;

  const total =
    specialtyMatch +
    modalityMatch +
    budgetMatch +
    availabilityMatch +
    preferencesMatch +
    styleMatch;

  return {
    total,
    breakdown: {
      specialtyMatch,
      modalityMatch,
      budgetMatch,
      availabilityMatch,
      preferencesMatch,
      styleMatch,
    },
    recommendation: getRecommendationType(total),
    label: getMatchingRecommendationLabel(total),
  };
}

function getRecommendationType(score: number): "primary" | "alternative" | "not_recommended" {
  if (score >= 80) return "primary";
  if (score >= 65) return "alternative";
  return "not_recommended";
}

export function getMatchingRecommendationLabel(score: number): string {
  if (score >= 80) return "Recomendación principal";
  if (score >= 65) return "Alternativa válida";
  return "No recomendar";
}
