"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = [
  "PROPOSED_INTERNALLY",
  "PSYCHOLOGIST_CONFIRMED",
  "SENT_TO_PATIENT",
  "ACCEPTED_BY_PATIENT",
  "REJECTED_BY_PATIENT",
  "NO_RESPONSE",
  "FIRST_SESSION_COMPLETED",
  "SECOND_SESSION_COMPLETED",
  "REMATCH_REQUESTED",
];

export default function MatchingActions({ matching }: { matching: any }) {
  const router = useRouter();
  const [status, setStatus] = useState(matching.status);
  const [score, setScore] = useState(matching.score?.toString() || "");
  const [reason, setReason] = useState(matching.matchReason || "");
  const [notes, setNotes] = useState(matching.internalNotes || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Session creation
  const [creatingSession, setCreatingSession] = useState(false);

  async function save() {
    setSaving(true);
    await fetch(`/api/matchings/${matching.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, score: score ? parseInt(score) : undefined, matchReason: reason, internalNotes: notes }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
  }

  async function createSession() {
    setCreatingSession(true);
    await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId: matching.patientId,
        psychologistId: matching.psychologistId,
        matchingId: matching.id,
      }),
    });
    setCreatingSession(false);
    router.refresh();
  }

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-[#e3ece3] bg-white text-sm text-[#2f522f] focus:outline-none focus:ring-2 focus:ring-[#4d824d]";

  return (
    <div className="bg-white rounded-2xl border border-[#e3ece3] p-6 space-y-4">
      <h2 className="font-semibold text-[#1c2b1c]" style={{ fontFamily: "Lora, Georgia, serif" }}>
        Gestionar matching
      </h2>

      <div>
        <label className="text-xs text-[#9aab9a] block mb-1">Estado</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs text-[#9aab9a] block mb-1">Score (0–100)</label>
        <input type="number" min="0" max="100" value={score} onChange={(e) => setScore(e.target.value)} className={inputCls} placeholder="85" />
        {score && (
          <div className={`text-xs mt-1 font-medium ${parseInt(score) >= 80 ? "text-green-600" : parseInt(score) >= 65 ? "text-yellow-600" : "text-red-400"}`}>
            {parseInt(score) >= 80 ? "Recomendación principal" : parseInt(score) >= 65 ? "Alternativa válida" : "No recomendar"}
          </div>
        )}
      </div>

      <div>
        <label className="text-xs text-[#9aab9a] block mb-1">Motivo del matching</label>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className={`${inputCls} resize-none`} placeholder="Por qué este psicólogo encaja..." />
      </div>

      <div>
        <label className="text-xs text-[#9aab9a] block mb-1">Notas internas</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={`${inputCls} resize-none`} />
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="w-full py-2.5 rounded-xl text-white text-sm font-medium disabled:opacity-50"
        style={{ background: "linear-gradient(135deg, #4d824d, #3a673a)" }}
      >
        {saved ? "✓ Guardado" : saving ? "Guardando..." : "Guardar cambios"}
      </button>

      <div className="border-t border-[#f4f7f4] pt-4">
        <button
          onClick={createSession}
          disabled={creatingSession}
          className="w-full py-2.5 rounded-xl border border-[#4d824d] text-[#4d824d] text-sm font-medium hover:bg-[#f4f7f4] transition-colors disabled:opacity-40"
        >
          {creatingSession ? "Creando..." : "+ Registrar sesión para este matching"}
        </button>
      </div>
    </div>
  );
}
