"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Session {
  id: string;
  firstSessionBooked: boolean;
  firstSessionCompleted: boolean;
  secondSessionBooked: boolean;
  secondSessionCompleted: boolean;
  firstSessionDate: string | null;
  secondSessionDate: string | null;
  noContinuityReason: string | null;
  patientFeedback: string | null;
  psychologistFeedback: string | null;
  patient: { id: string; name: string };
  psychologist: { id: string; name: string };
  matching: { id: string; score: number | null } | null;
}

export default function SessionsManager({ sessions }: { sessions: Session[] }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  async function updateSession(id: string, data: Partial<Session>) {
    setUpdating(id);
    await fetch("/api/sessions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    });
    setUpdating(null);
    router.refresh();
  }

  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#e3ece3] p-12 text-center text-[#9aab9a] text-sm">
        No hay sesiones registradas. Las sesiones se crean desde la ficha de matching.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((s) => (
        <div key={s.id} className="bg-white rounded-2xl border border-[#e3ece3] overflow-hidden">
          {/* Header */}
          <div
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#faf8f5] transition-colors"
            onClick={() => setExpanded(expanded === s.id ? null : s.id)}
          >
            <div>
              <span className="font-medium text-[#2f522f] text-sm">{s.patient.name}</span>
              <span className="text-[#9aab9a] text-xs ml-2">→ {s.psychologist.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className={`text-xs px-2 py-0.5 rounded-full ${s.firstSessionCompleted ? "bg-green-100 text-green-700" : s.firstSessionBooked ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-500"}`}>
                  1ª {s.firstSessionCompleted ? "✓" : s.firstSessionBooked ? "agendada" : "pendiente"}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${s.secondSessionCompleted ? "bg-emerald-100 text-emerald-700" : s.secondSessionBooked ? "bg-teal-100 text-teal-700" : "bg-gray-100 text-gray-400"}`}>
                  2ª {s.secondSessionCompleted ? "✓" : s.secondSessionBooked ? "agendada" : "—"}
                </span>
              </div>
              <span className="text-[#9aab9a] text-xs">{expanded === s.id ? "▲" : "▼"}</span>
            </div>
          </div>

          {/* Expanded */}
          {expanded === s.id && (
            <div className="border-t border-[#f4f7f4] p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Primera sesión */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-[#5a6b5a] uppercase tracking-wide">Primera sesión</div>
                  <label className="flex items-center gap-2 text-sm text-[#5a6b5a] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={s.firstSessionBooked}
                      onChange={(e) => updateSession(s.id, { firstSessionBooked: e.target.checked })}
                      className="accent-[#4d824d]"
                    />
                    Agendada
                  </label>
                  <label className="flex items-center gap-2 text-sm text-[#5a6b5a] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={s.firstSessionCompleted}
                      onChange={(e) => updateSession(s.id, { firstSessionCompleted: e.target.checked })}
                      className="accent-[#4d824d]"
                    />
                    <strong className="text-[#2f522f]">Realizada ✓</strong>
                  </label>
                </div>

                {/* Segunda sesión */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-[#5a6b5a] uppercase tracking-wide">Segunda sesión</div>
                  <label className="flex items-center gap-2 text-sm text-[#5a6b5a] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={s.secondSessionBooked}
                      onChange={(e) => updateSession(s.id, { secondSessionBooked: e.target.checked })}
                      className="accent-[#4d824d]"
                    />
                    Agendada
                  </label>
                  <label className="flex items-center gap-2 text-sm text-[#5a6b5a] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={s.secondSessionCompleted}
                      onChange={(e) => updateSession(s.id, { secondSessionCompleted: e.target.checked })}
                      className="accent-[#4d824d]"
                    />
                    <strong className="text-emerald-700">Realizada ✓ (métrica norte)</strong>
                  </label>
                </div>
              </div>

              {/* Feedback */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-[#5a6b5a] uppercase tracking-wide">Feedback</div>
                <div>
                  <label className="text-xs text-[#9aab9a] block mb-1">Feedback del paciente</label>
                  <FeedbackField
                    value={s.patientFeedback || ""}
                    onSave={(v) => updateSession(s.id, { patientFeedback: v })}
                  />
                </div>
                <div>
                  <label className="text-xs text-[#9aab9a] block mb-1">Feedback del psicólogo</label>
                  <FeedbackField
                    value={s.psychologistFeedback || ""}
                    onSave={(v) => updateSession(s.id, { psychologistFeedback: v })}
                  />
                </div>
                {!s.secondSessionCompleted && (
                  <div>
                    <label className="text-xs text-[#9aab9a] block mb-1">Motivo de no continuidad</label>
                    <FeedbackField
                      value={s.noContinuityReason || ""}
                      onSave={(v) => updateSession(s.id, { noContinuityReason: v })}
                    />
                  </div>
                )}
              </div>

              {updating === s.id && (
                <p className="text-xs text-[#4d824d]">Guardando...</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function FeedbackField({
  value,
  onSave,
}: {
  value: string;
  onSave: (v: string) => void;
}) {
  const [text, setText] = useState(value);

  return (
    <div className="flex gap-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        className="flex-1 px-3 py-2 rounded-xl border border-[#e3ece3] bg-white text-sm text-[#2f522f] focus:outline-none focus:ring-2 focus:ring-[#4d824d] resize-none"
        placeholder="..."
      />
      {text !== value && (
        <button
          onClick={() => onSave(text)}
          className="px-3 py-1 rounded-xl text-xs text-white"
          style={{ background: "linear-gradient(135deg, #4d824d, #3a673a)" }}
        >
          Guardar
        </button>
      )}
    </div>
  );
}
