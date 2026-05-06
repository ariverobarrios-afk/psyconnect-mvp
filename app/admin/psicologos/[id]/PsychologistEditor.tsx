"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputCls = "w-full px-3 py-2.5 rounded-xl border border-[#e3ece3] bg-white text-sm text-[#2f522f] focus:outline-none focus:ring-2 focus:ring-[#4d824d]";

export default function PsychologistEditor({ psychologist }: { psychologist: any }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: psychologist.name || "",
    email: psychologist.email || "",
    phone: psychologist.phone || "",
    city: psychologist.city || "",
    price: psychologist.price?.toString() || "",
    experience: psychologist.experience?.toString() || "",
    gender: psychologist.gender || "",
    modality: psychologist.modality || [],
    specialties: psychologist.specialties.join(", "),
    availability: psychologist.availability || [],
    languages: psychologist.languages.join(", "),
    acceptsNewPatients: psychologist.acceptsNewPatients,
    status: psychologist.status,
    internalNotes: psychologist.internalNotes || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function toggle(arr: string[], val: string) {
    return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
  }

  async function handleSave() {
    setSaving(true);
    await fetch(`/api/psychologists/${psychologist.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        specialties: form.specialties.split(",").map((s: string) => s.trim()).filter(Boolean),
        languages: form.languages.split(",").map((s: string) => s.trim()).filter(Boolean),
        price: form.price ? parseInt(form.price) : null,
        experience: form.experience ? parseInt(form.experience) : null,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e3ece3] p-6">
      <h2 className="font-semibold text-[#1c2b1c] mb-4" style={{ fontFamily: "Lora, Georgia, serif" }}>
        Datos del psicólogo
      </h2>
      <div className="space-y-3">
        {[
          { label: "Nombre", key: "name", type: "text" },
          { label: "Email", key: "email", type: "email" },
          { label: "Teléfono", key: "phone", type: "tel" },
          { label: "Ciudad", key: "city", type: "text" },
          { label: "Tarifa (€)", key: "price", type: "number" },
          { label: "Experiencia (años)", key: "experience", type: "number" },
        ].map((f) => (
          <div key={f.key}>
            <label className="text-xs text-[#9aab9a] block mb-1">{f.label}</label>
            <input
              type={f.type}
              value={(form as any)[f.key]}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              className={inputCls}
            />
          </div>
        ))}

        <div>
          <label className="text-xs text-[#9aab9a] block mb-1">Género</label>
          <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className={inputCls}>
            <option value="">Seleccionar...</option>
            <option value="mujer">Mujer</option>
            <option value="hombre">Hombre</option>
            <option value="no_binario">No binario</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-[#9aab9a] block mb-1">Estado</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputCls}>
            {["PENDING_VALIDATION","ACTIVE","LOW_AVAILABILITY","PAUSED_FULL_AGENDA","PAUSED_QUALITY","INACTIVE"].map(s => (
              <option key={s} value={s}>{s.replace(/_/g," ")}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-[#9aab9a] block mb-1">Especialidades (coma)</label>
          <input type="text" value={form.specialties} onChange={(e) => setForm({ ...form, specialties: e.target.value })} className={inputCls} />
        </div>

        <div>
          <label className="text-xs text-[#9aab9a] block mb-1">Idiomas (coma)</label>
          <input type="text" value={form.languages} onChange={(e) => setForm({ ...form, languages: e.target.value })} className={inputCls} />
        </div>

        <div>
          <label className="text-xs text-[#9aab9a] block mb-1">Modalidad</label>
          <div className="flex gap-3">
            {["online", "presencial"].map((m) => (
              <label key={m} className="flex items-center gap-1.5 text-sm text-[#5a6b5a] cursor-pointer">
                <input type="checkbox" checked={form.modality.includes(m)} onChange={() => setForm({ ...form, modality: toggle(form.modality, m) })} className="accent-[#4d824d]" />
                {m}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-[#5a6b5a] cursor-pointer">
            <input type="checkbox" checked={form.acceptsNewPatients} onChange={(e) => setForm({ ...form, acceptsNewPatients: e.target.checked })} className="accent-[#4d824d]" />
            Acepta nuevos pacientes
          </label>
        </div>

        <div>
          <label className="text-xs text-[#9aab9a] block mb-1">Notas internas</label>
          <textarea value={form.internalNotes} onChange={(e) => setForm({ ...form, internalNotes: e.target.value })} rows={3} className={`${inputCls} resize-none`} />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-2.5 rounded-xl text-white text-sm font-medium disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #4d824d, #3a673a)" }}
        >
          {saved ? "✓ Guardado" : saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
