"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ALL_STATUSES = [
  { value: "NEW", label: "Nuevo" },
  { value: "IN_REVIEW", label: "En revisión" },
  { value: "WAITING_PSYCHOLOGIST_CONFIRMATION", label: "Esperando confirmación psicólogo" },
  { value: "RECOMMENDATION_SENT", label: "Recomendación enviada" },
  { value: "FIRST_SESSION_BOOKED", label: "1ª sesión agendada" },
  { value: "FIRST_SESSION_COMPLETED", label: "1ª sesión realizada" },
  { value: "SECOND_SESSION_BOOKED", label: "2ª sesión agendada" },
  { value: "SECOND_SESSION_COMPLETED", label: "2ª sesión realizada" },
  { value: "REMATCH_REQUESTED", label: "Rematch solicitado" },
  { value: "NO_MATCH_AVAILABLE", label: "Sin match disponible" },
  { value: "CRISIS_NOT_PROCESSABLE", label: "Crisis / no procesable" },
  { value: "CLOSED_SUCCESS", label: "Cerrado (éxito)" },
  { value: "CLOSED_NO_RESPONSE", label: "Cerrado (sin respuesta)" },
  { value: "CLOSED_NO_FIT", label: "Cerrado (sin encaje)" },
];

interface Props {
  patient: {
    id: string;
    status: string;
    internalNotes: string | null;
  };
  psychologists: {
    id: string;
    name: string;
    city: string | null;
    specialties: string[];
  }[];
}

export default function PatientActions({ patient, psychologists }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(patient.status);
  const [notes, setNotes] = useState(patient.internalNotes || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Matching form
  const [showMatchForm, setShowMatchForm] = useState(false);
  const [matchPsychId, setMatchPsychId] = useState("");
  const [matchScore, setMatchScore] = useState("");
  const [matchReason, setMatchReason] = useState("");
  const [creatingMatch, setCreatingMatch] = useState(false);

  async function saveChanges() {
    setSaving(true);
    await fetch(`/api/patients/${patient.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, internalNotes: notes }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
  }

  async function createMatching() {
    if (!matchPsychId) return;
    setCreatingMatch(true);
    await fetch("/api/matchings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId: patient.id,
        psychologistId: matchPsychId,
        score: matchScore || null,
        matchReason: matchReason || null,
      }),
    });
    setCreatingMatch(false);
    setShowMatchForm(false);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {/* Status */}
      <div className="bg-white rounded-2xl border border-[#e3ece3] p-6">
        <h2
          className="font-semibold text-[#1c2b1c] mb-4"
          style={{ fontFamily: "Lora, Georgia, serif" }}
        >
          Estado y notas
        </h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[#9aab9a] block mb-1">Estado</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#e3ece3] bg-white text-sm text-[#2f522f] focus:outline-none focus:ring-2 focus:ring-[#4d824d]"
            >
              {ALL_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-[#9aab9a] block mb-1">Notas internas</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2.5 rounded-xl border border-[#e3ece3] bg-white text-sm text-[#2f522f] focus:outline-none focus:ring-2 focus:ring-[#4d824d] resize-none"
              placeholder="Observaciones internas del equipo..."
            />
          </div>
          <button
            onClick={saveChanges}
            disabled={saving}
            className="w-full py-2.5 rounded-xl text-white text-sm font-medium transition-colors disabled:opacity-50"
            style={{ background: saving ? "#9dbf9d" : "linear-gradient(135deg, #4d824d, #3a673a)" }}
          >
            {saved ? "✓ Guardado" : saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>

      {/* Create matching */}
      <div className="bg-white rounded-2xl border border-[#e3ece3] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2
            className="font-semibold text-[#1c2b1c]"
            style={{ fontFamily: "Lora, Georgia, serif" }}
          >
            Crear matching
          </h2>
          <button
            onClick={() => setShowMatchForm(!showMatchForm)}
            className="text-xs text-[#4d824d] hover:underline"
          >
            {showMatchForm ? "Cancelar" : "+ Nuevo matching"}
          </button>
        </div>

        {showMatchForm && (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-[#9aab9a] block mb-1">Psicólogo</label>
              <select
                value={matchPsychId}
                onChange={(e) => setMatchPsychId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#e3ece3] bg-white text-sm text-[#2f522f] focus:outline-none focus:ring-2 focus:ring-[#4d824d]"
              >
                <option value="">Seleccionar psicólogo...</option>
                {psychologists.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.city ? `(${p.city})` : ""} — {p.specialties.slice(0, 2).join(", ")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-[#9aab9a] block mb-1">Score (0–100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={matchScore}
                onChange={(e) => setMatchScore(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#e3ece3] bg-white text-sm text-[#2f522f] focus:outline-none focus:ring-2 focus:ring-[#4d824d]"
                placeholder="85"
              />
            </div>
            <div>
              <label className="text-xs text-[#9aab9a] block mb-1">Motivo del matching</label>
              <textarea
                value={matchReason}
                onChange={(e) => setMatchReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl border border-[#e3ece3] bg-white text-sm text-[#2f522f] focus:outline-none focus:ring-2 focus:ring-[#4d824d] resize-none"
                placeholder="Por qué este psicólogo encaja con este paciente..."
              />
            </div>
            <button
              onClick={createMatching}
              disabled={!matchPsychId || creatingMatch}
              className="w-full py-2.5 rounded-xl text-white text-sm font-medium disabled:opacity-40 transition-colors"
              style={{ background: "linear-gradient(135deg, #4d824d, #3a673a)" }}
            >
              {creatingMatch ? "Creando..." : "Crear matching"}
            </button>
          </div>
        )}

        {!showMatchForm && (
          <p className="text-xs text-[#9aab9a]">
            La decisión final de matching siempre es manual.
          </p>
        )}
      </div>
    </div>
  );
}
