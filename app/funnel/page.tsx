"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type FunnelData = {
  step0: "continue" | "urgent" | null;
  isAdult: "yes" | "no" | null;
  reason: string;
  severity: string;
  previousTherapy: string;
  modality: string;
  location: string;
  budget: string;
  startTimeline: string;
  availability: string[];
  preferences: string[];
  name: string;
  email: string;
  phone: string;
  consentAccepted: boolean;
};

const TOTAL_STEPS = 12;

export default function FunnelPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<FunnelData>({
    step0: null,
    isAdult: null,
    reason: "",
    severity: "",
    previousTherapy: "",
    modality: "",
    location: "",
    budget: "",
    startTimeline: "",
    availability: [],
    preferences: [],
    name: "",
    email: "",
    phone: "",
    consentAccepted: false,
  });

  const [showCrisis, setShowCrisis] = useState(false);
  const [showMinor, setShowMinor] = useState(false);

  function getActualStep() {
    // Skip location if online
    if (step === 6 && data.modality === "online") return step + 1;
    return step;
  }

  function nextStep() {
    setStep((s) => s + 1);
  }

  function prevStep() {
    setStep((s) => Math.max(0, s - 1));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Error al enviar");
      router.push("/gracias");
    } catch {
      setError("Ha ocurrido un error. Por favor inténtalo de nuevo.");
      setSubmitting(false);
    }
  }

  const progressPercent = Math.round((step / (TOTAL_STEPS - 1)) * 100);

  if (showCrisis) {
    return <CrisisScreen />;
  }

  if (showMinor) {
    return <MinorScreen />;
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-[#e3ece3]">
        <Link
          href="/"
          className="text-sm text-[#5a6b5a] hover:text-[#3a673a] flex items-center gap-1"
        >
          ← PSYConnect
        </Link>
        <span className="text-xs text-[#9aab9a]">{progressPercent}% completado</span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-[#e3ece3]">
        <div
          className="h-full bg-[#4d824d] transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          {/* Step 0 - Antes de empezar */}
          {step === 0 && (
            <StepCard
              title="Antes de empezar"
              subtitle="Este cuestionario no es un servicio de urgencias. Si estás en peligro inmediato, contacta con emergencias."
            >
              <div className="space-y-3">
                <OptionButton
                  selected={false}
                  onClick={() => {
                    setData({ ...data, step0: "continue" });
                    nextStep();
                  }}
                >
                  Quiero orientarme para empezar terapia
                </OptionButton>
                <OptionButton
                  selected={false}
                  urgent
                  onClick={() => setShowCrisis(true)}
                >
                  Necesito ayuda urgente
                </OptionButton>
              </div>
            </StepCard>
          )}

          {/* Step 1 - Edad */}
          {step === 1 && (
            <StepCard title="¿Tienes 18 años o más?">
              <div className="space-y-3">
                <OptionButton
                  selected={data.isAdult === "yes"}
                  onClick={() => {
                    setData({ ...data, isAdult: "yes" });
                    nextStep();
                  }}
                >
                  Sí, tengo 18 años o más
                </OptionButton>
                <OptionButton
                  selected={data.isAdult === "no"}
                  onClick={() => {
                    setData({ ...data, isAdult: "no" });
                    setShowMinor(true);
                  }}
                >
                  No, soy menor de 18
                </OptionButton>
              </div>
              <BackButton onClick={prevStep} />
            </StepCard>
          )}

          {/* Step 2 - Motivo */}
          {step === 2 && (
            <StepCard title="¿Qué te trae por aquí hoy?">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "ansiedad", label: "Ansiedad o estrés" },
                  { value: "estado_animo_bajo", label: "Estado de ánimo bajo" },
                  { value: "relaciones_pareja", label: "Relaciones o pareja" },
                  { value: "autoestima", label: "Autoestima" },
                  { value: "duelo_perdida", label: "Duelo o pérdida" },
                  { value: "familia", label: "Familia" },
                  { value: "trabajo_burnout", label: "Trabajo o burnout" },
                  { value: "desarrollo_personal", label: "Desarrollo personal" },
                  { value: "no_tengo_claro", label: "No lo tengo claro" },
                  { value: "otro", label: "Otro" },
                ].map((opt) => (
                  <OptionButton
                    key={opt.value}
                    selected={data.reason === opt.value}
                    onClick={() => {
                      setData({ ...data, reason: opt.value });
                      nextStep();
                    }}
                    small
                  >
                    {opt.label}
                  </OptionButton>
                ))}
              </div>
              <BackButton onClick={prevStep} />
            </StepCard>
          )}

          {/* Step 3 - Severidad */}
          {step === 3 && (
            <StepCard title="¿Cómo está afectando esto a tu día a día?">
              <div className="space-y-3">
                {[
                  { value: "quiero_empezar_sin_urgencia", label: "Quiero empezar terapia, sin urgencia" },
                  { value: "me_afecta_bastante", label: "Me afecta bastante" },
                  { value: "necesito_ayuda_esta_semana", label: "Necesito ayuda esta semana" },
                  { value: "crisis", label: "Estoy en crisis o podría hacerme daño", urgent: true },
                ].map((opt) => (
                  <OptionButton
                    key={opt.value}
                    selected={data.severity === opt.value}
                    urgent={opt.urgent}
                    onClick={() => {
                      if (opt.value === "crisis") {
                        setData({ ...data, severity: opt.value });
                        setShowCrisis(true);
                      } else {
                        setData({ ...data, severity: opt.value });
                        nextStep();
                      }
                    }}
                  >
                    {opt.label}
                  </OptionButton>
                ))}
              </div>
              <BackButton onClick={prevStep} />
            </StepCard>
          )}

          {/* Step 4 - Terapia previa */}
          {step === 4 && (
            <StepCard title="¿Has ido a terapia antes?">
              <div className="space-y-3">
                {[
                  { value: "si", label: "Sí" },
                  { value: "no", label: "No" },
                  { value: "lo_intente", label: "Lo intenté, pero no continué" },
                  { value: "prefiero_no_decir", label: "Prefiero no decirlo" },
                ].map((opt) => (
                  <OptionButton
                    key={opt.value}
                    selected={data.previousTherapy === opt.value}
                    onClick={() => {
                      setData({ ...data, previousTherapy: opt.value });
                      nextStep();
                    }}
                  >
                    {opt.label}
                  </OptionButton>
                ))}
              </div>
              <BackButton onClick={prevStep} />
            </StepCard>
          )}

          {/* Step 5 - Modalidad */}
          {step === 5 && (
            <StepCard title="¿Cómo prefieres hacer las sesiones?">
              <div className="space-y-3">
                {[
                  { value: "online", label: "Online (videollamada)" },
                  { value: "presencial", label: "Presencial" },
                  { value: "indiferente", label: "Me da igual" },
                ].map((opt) => (
                  <OptionButton
                    key={opt.value}
                    selected={data.modality === opt.value}
                    onClick={() => {
                      setData({ ...data, modality: opt.value });
                      nextStep();
                    }}
                  >
                    {opt.label}
                  </OptionButton>
                ))}
              </div>
              <BackButton onClick={prevStep} />
            </StepCard>
          )}

          {/* Step 6 - Ubicación (solo si presencial) */}
          {step === 6 && data.modality !== "online" && (
            <StepCard
              title="¿En qué ciudad o zona te gustaría hacer terapia presencial?"
            >
              <input
                type="text"
                placeholder="Ej. Madrid, Barcelona, Valencia..."
                value={data.location}
                onChange={(e) => setData({ ...data, location: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#e3ece3] bg-white text-[#2f522f] placeholder-[#9aab9a] focus:outline-none focus:ring-2 focus:ring-[#4d824d] focus:border-transparent text-base"
              />
              <button
                onClick={nextStep}
                disabled={!data.location}
                className="w-full mt-4 px-6 py-3 rounded-full text-white font-medium disabled:opacity-40 transition-all"
                style={{ background: "linear-gradient(135deg, #4d824d, #3a673a)" }}
              >
                Continuar
              </button>
              <BackButton onClick={prevStep} />
            </StepCard>
          )}

          {/* Skip step 6 if online */}
          {step === 6 && data.modality === "online" && (() => { nextStep(); return null; })()}

          {/* Step 7 - Presupuesto */}
          {step === 7 && (
            <StepCard title="¿Cuál es tu presupuesto aproximado por sesión?">
              <div className="space-y-3">
                {[
                  { value: "menos_50", label: "Menos de 50 €" },
                  { value: "50-70", label: "50–70 €" },
                  { value: "70-90", label: "70–90 €" },
                  { value: "mas_90", label: "Más de 90 €" },
                  { value: "no_lo_se", label: "No lo sé todavía" },
                ].map((opt) => (
                  <OptionButton
                    key={opt.value}
                    selected={data.budget === opt.value}
                    onClick={() => {
                      setData({ ...data, budget: opt.value });
                      nextStep();
                    }}
                  >
                    {opt.label}
                  </OptionButton>
                ))}
              </div>
              <BackButton onClick={prevStep} />
            </StepCard>
          )}

          {/* Step 8 - Cuándo empezar */}
          {step === 8 && (
            <StepCard title="¿Cuándo te gustaría empezar?">
              <div className="space-y-3">
                {[
                  { value: "esta_semana", label: "Esta semana" },
                  { value: "proximas_2_semanas", label: "En las próximas 2 semanas" },
                  { value: "este_mes", label: "Este mes" },
                  { value: "solo_explorando", label: "Solo estoy explorando" },
                ].map((opt) => (
                  <OptionButton
                    key={opt.value}
                    selected={data.startTimeline === opt.value}
                    onClick={() => {
                      setData({ ...data, startTimeline: opt.value });
                      nextStep();
                    }}
                  >
                    {opt.label}
                  </OptionButton>
                ))}
              </div>
              <BackButton onClick={prevStep} />
            </StepCard>
          )}

          {/* Step 9 - Disponibilidad */}
          {step === 9 && (
            <StepCard
              title="¿Cuándo sueles tener disponibilidad?"
              subtitle="Puedes elegir varias opciones."
            >
              <div className="space-y-2">
                {[
                  { value: "mañanas", label: "Mañanas" },
                  { value: "tardes", label: "Tardes" },
                  { value: "noches", label: "Noches" },
                  { value: "fines_de_semana", label: "Fines de semana" },
                  { value: "flexible", label: "Soy flexible" },
                ].map((opt) => (
                  <OptionButton
                    key={opt.value}
                    selected={data.availability.includes(opt.value)}
                    onClick={() => {
                      const newAvail = data.availability.includes(opt.value)
                        ? data.availability.filter((a) => a !== opt.value)
                        : [...data.availability, opt.value];
                      setData({ ...data, availability: newAvail });
                    }}
                  >
                    {opt.label}
                  </OptionButton>
                ))}
              </div>
              <button
                onClick={nextStep}
                disabled={data.availability.length === 0}
                className="w-full mt-4 px-6 py-3 rounded-full text-white font-medium disabled:opacity-40 transition-all"
                style={{ background: "linear-gradient(135deg, #4d824d, #3a673a)" }}
              >
                Continuar
              </button>
              <BackButton onClick={prevStep} />
            </StepCard>
          )}

          {/* Step 10 - Preferencias */}
          {step === 10 && (
            <StepCard
              title="¿Hay algo importante que debamos tener en cuenta?"
              subtitle="Puedes elegir varias opciones o ninguna."
            >
              <div className="space-y-2">
                {[
                  { value: "prefiero_psicologa_mujer", label: "Preferiría psicóloga mujer" },
                  { value: "prefiero_psicologo_hombre", label: "Preferiría psicólogo hombre" },
                  { value: "genero_da_igual", label: "El género me da igual" },
                  { value: "experiencia_motivo", label: "Me gustaría que tenga experiencia en mi motivo de consulta" },
                  { value: "otro_idioma", label: "Necesito atención en otro idioma" },
                  { value: "estilo_practico", label: "Prefiero un estilo más práctico" },
                  { value: "estilo_exploratorio", label: "Prefiero un estilo más exploratorio" },
                  { value: "otra_preferencia", label: "Otra preferencia" },
                  { value: "ninguna", label: "Ninguna en particular" },
                ].map((opt) => (
                  <OptionButton
                    key={opt.value}
                    selected={data.preferences.includes(opt.value)}
                    small
                    onClick={() => {
                      const newPref =
                        opt.value === "ninguna"
                          ? ["ninguna"]
                          : data.preferences.includes(opt.value)
                          ? data.preferences.filter((p) => p !== opt.value)
                          : [...data.preferences.filter((p) => p !== "ninguna"), opt.value];
                      setData({ ...data, preferences: newPref });
                    }}
                  >
                    {opt.label}
                  </OptionButton>
                ))}
              </div>
              <button
                onClick={nextStep}
                className="w-full mt-4 px-6 py-3 rounded-full text-white font-medium transition-all"
                style={{ background: "linear-gradient(135deg, #4d824d, #3a673a)" }}
              >
                Continuar
              </button>
              <BackButton onClick={prevStep} />
            </StepCard>
          )}

          {/* Step 11 - Datos de contacto */}
          {step === 11 && (
            <StepCard
              title="¿Dónde te enviamos tu recomendación?"
              subtitle="Solo utilizaremos tus datos para enviarte la orientación."
            >
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#e3ece3] bg-white text-[#2f522f] placeholder-[#9aab9a] focus:outline-none focus:ring-2 focus:ring-[#4d824d] text-base"
                />
                <input
                  type="email"
                  placeholder="Tu email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#e3ece3] bg-white text-[#2f522f] placeholder-[#9aab9a] focus:outline-none focus:ring-2 focus:ring-[#4d824d] text-base"
                />
                <input
                  type="tel"
                  placeholder="Teléfono (opcional)"
                  value={data.phone}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#e3ece3] bg-white text-[#2f522f] placeholder-[#9aab9a] focus:outline-none focus:ring-2 focus:ring-[#4d824d] text-base"
                />
                <label className="flex items-start gap-3 p-4 rounded-xl bg-[#f4f7f4] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.consentAccepted}
                    onChange={(e) =>
                      setData({ ...data, consentAccepted: e.target.checked })
                    }
                    className="mt-1 accent-[#4d824d]"
                  />
                  <span className="text-xs text-[#5a6b5a] leading-relaxed">
                    Acepto que PSYConnect trate mis respuestas para orientarme y enviarme una recomendación de psicólogo/a. Entiendo que PSYConnect no presta atención psicológica, no realiza diagnóstico y no sustituye servicios de urgencia. He leído y acepto la{" "}
                    <Link href="/legal/privacidad" className="text-[#4d824d] underline" target="_blank">
                      Política de Privacidad
                    </Link>{" "}
                    y las{" "}
                    <Link href="/legal/terminos" className="text-[#4d824d] underline" target="_blank">
                      Condiciones del Servicio
                    </Link>
                    .
                  </span>
                </label>
              </div>
              {error && (
                <p className="text-sm text-red-500 mt-3">{error}</p>
              )}
              <button
                onClick={handleSubmit}
                disabled={
                  !data.name ||
                  !data.email ||
                  !data.consentAccepted ||
                  submitting
                }
                className="w-full mt-4 px-6 py-3 rounded-full text-white font-medium disabled:opacity-40 transition-all"
                style={{ background: "linear-gradient(135deg, #4d824d, #3a673a)" }}
              >
                {submitting ? "Enviando..." : "Enviar mis respuestas"}
              </button>
              <BackButton onClick={prevStep} />
            </StepCard>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Componentes de UI del funnel ──

function StepCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2
        className="text-2xl font-semibold text-[#1c2b1c] mb-2"
        style={{ fontFamily: "Lora, Georgia, serif" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-[#5a6b5a] mb-6">{subtitle}</p>
      )}
      {!subtitle && <div className="mb-6" />}
      {children}
    </div>
  );
}

function OptionButton({
  children,
  selected,
  onClick,
  urgent,
  small,
}: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  urgent?: boolean;
  small?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
        urgent
          ? "border-red-200 text-red-600 hover:bg-red-50"
          : selected
          ? "border-[#4d824d] bg-[#f4f7f4] text-[#2f522f]"
          : "border-[#e3ece3] bg-white text-[#3a3a3a] hover:border-[#4d824d] hover:bg-[#f4f7f4]"
      } ${small ? "text-xs py-2.5" : ""}`}
    >
      {selected && !urgent && (
        <span className="mr-2 text-[#4d824d]">✓</span>
      )}
      {children}
    </button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full mt-3 text-sm text-[#9aab9a] hover:text-[#5a6b5a] transition-colors"
    >
      ← Volver
    </button>
  );
}

function CrisisScreen() {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="text-4xl mb-6">🤝</div>
        <h2
          className="text-2xl font-semibold text-[#1c2b1c] mb-4"
          style={{ fontFamily: "Lora, Georgia, serif" }}
        >
          Necesitas apoyo ahora
        </h2>
        <p className="text-[#5a6b5a] mb-6 leading-relaxed">
          PSYConnect no es un servicio de emergencias. Si estás en peligro inmediato
          o puedes hacerte daño, por favor contacta ahora con alguien que pueda
          ayudarte.
        </p>
        <div className="space-y-3 text-left">
          <div className="p-4 rounded-xl bg-red-50 border border-red-100">
            <strong className="text-red-700">Emergencias:</strong>
            <span className="text-red-600 ml-2 text-xl font-bold">112</span>
          </div>
          <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
            <strong className="text-orange-700">Atención a la conducta suicida:</strong>
            <span className="text-orange-600 ml-2 text-xl font-bold">024</span>
            <p className="text-xs text-orange-500 mt-1">Disponible las 24 horas en España</p>
          </div>
        </div>
        <p className="mt-6 text-sm text-[#9aab9a]">
          Si en otro momento quieres orientación para empezar terapia, aquí estaremos.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 text-sm text-[#4d824d] hover:underline"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

function MinorScreen() {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <h2
          className="text-2xl font-semibold text-[#1c2b1c] mb-4"
          style={{ fontFamily: "Lora, Georgia, serif" }}
        >
          Necesitamos un adulto responsable
        </h2>
        <p className="text-[#5a6b5a] mb-6 leading-relaxed">
          En esta primera versión de PSYConnect, necesitamos que la solicitud la
          complete un adulto responsable. No procesaremos esta solicitud como
          orientación estándar sin ese paso.
        </p>
        <p className="text-sm text-[#9aab9a]">
          Si un adulto de confianza puede completar el formulario en tu nombre,
          puede volver al inicio y hacerlo.
        </p>
        <Link
          href="/"
          className="inline-block mt-6 text-sm text-[#4d824d] hover:underline"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
