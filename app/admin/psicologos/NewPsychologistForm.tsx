"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPsychologistForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    price: "",
    experience: "",
    gender: "",
    modality: [] as string[],
    specialties: "",
    availability: [] as string[],
    languages: "",
    acceptsNewPatients: true,
    status: "PENDING_VALIDATION",
    internalNotes: "",
  });

  function toggle(arr: string[], val: string) {
    return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
  }

  async function handleSave() {
    if (!form.name || !form.email) return;
    setSaving(true);
    const res = await fetch("/api/psychologists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        specialties: form.specialties.split(",").map((s) => s.trim()).filter(Boolean),
        languages: form.languages.split(",").map((s) => s.trim()).filter(Boolean),
        price: form.price || null,
        experience: form.experience || null,
      }),
    });
    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      router.push(`/admin/psicologos/${data.id}`);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e3ece3] p-6 mb-6">
      <h2
        className="font-semibold text-[#1c2b1c] mb-5"
        style={{ fontFamily: "Lora, Georgia, serif" }}
      >
        Nuevo psicólogo
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Nombre *">
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ana García" className={inputCls} />
        </Field>
        <Field label="Email *">
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="ana@ejemplo.com" className={inputCls} />
        </Field>
        <Field label="Teléfono">
          <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+34 600..." className={inputCls} />
        </Field>
        <Field label="Ciudad">
          <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Madrid" className={inputCls} />
        </Field>
        <Field label="Tarifa (€/sesión)">
          <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="65" className={inputCls} />
        </Field>
        <Field label="Años de experiencia">
          <input type="number" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="8" className={inputCls} />
        </Field>
        <Field label="Género">
          <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className={inputCls}>
            <option value="">Seleccionar...</option>
            <option value="mujer">Mujer</option>
            <option value="hombre">Hombre</option>
            <option value="no_binario">No binario</option>
          </select>
        </Field>
        <Field label="Estado">
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputCls}>
            <option value="PENDING_VALIDATION">Pendiente de validación</option>
            <option value="ACTIVE">Activo</option>
            <option value="INACTIVE">Inactivo</option>
          </select>
        </Field>
        <Field label="Especialidades (separadas por coma)">
          <input type="text" value={form.specialties} onChange={(e) => setForm({ ...form, specialties: e.target.value })} placeholder="ansiedad, depresion, pareja" className={inputCls} />
        </Field>
        <Field label="Idiomas (separados por coma)">
          <input type="text" value={form.languages} onChange={(e) => setForm({ ...form, languages: e.target.value })} placeholder="español, inglés" className={inputCls} />
        </Field>

        <Field label="Modalidad">
          <div className="flex gap-3">
            {["online", "presencial"].map((m) => (
              <label key={m} className="flex items-center gap-1.5 text-sm text-[#5a6b5a] cursor-pointer">
                <input type="checkbox" checked={form.modality.includes(m)} onChange={() => setForm({ ...form, modality: toggle(form.modality, m) })} className="accent-[#4d824d]" />
                {m}
              </label>
            ))}
          </div>
        </Field>

        <Field label="Disponibilidad">
          <div className="flex gap-3 flex-wrap">
            {["mañanas", "tardes", "noches", "fines_de_semana"].map((d) => (
              <label key={d} className="flex items-center gap-1.5 text-sm text-[#5a6b5a] cursor-pointer capitalize">
                <input type="checkbox" checked={form.availability.includes(d)} onChange={() => setForm({ ...form, availability: toggle(form.availability, d) })} className="accent-[#4d824d]" />
                {d.replace("_", " ")}
              </label>
            ))}
          </div>
        </Field>

        <div className="md:col-span-2">
          <Field label="Acepta nuevos pacientes">
            <label className="flex items-center gap-2 text-sm text-[#5a6b5a] cursor-pointer">
              <input type="checkbox" checked={form.acceptsNewPatients} onChange={(e) => setForm({ ...form, acceptsNewPatients: e.target.checked })} className="accent-[#4d824d]" />
              Sí, acepta nuevos pacientes
            </label>
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label="Notas internas">
            <textarea value={form.internalNotes} onChange={(e) => setForm({ ...form, internalNotes: e.target.value })} rows={3} className={`${inputCls} resize-none`} placeholder="Observaciones del equipo..." />
          </Field>
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        <button
          onClick={handleSave}
          disabled={!form.name || !form.email || saving}
          className="px-6 py-2.5 rounded-xl text-white text-sm font-medium disabled:opacity-40 transition-colors"
          style={{ background: "linear-gradient(135deg, #4d824d, #3a673a)" }}
        >
          {saving ? "Guardando..." : "Guardar psicólogo"}
        </button>
        <a href="/admin/psicologos" className="px-6 py-2.5 rounded-xl border border-[#e3ece3] text-sm text-[#5a6b5a] hover:bg-[#f4f7f4] transition-colors">
          Cancelar
        </a>
      </div>
    </div>
  );
}

const inputCls = "w-full px-3 py-2.5 rounded-xl border border-[#e3ece3] bg-white text-sm text-[#2f522f] focus:outline-none focus:ring-2 focus:ring-[#4d824d]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-[#9aab9a] block mb-1">{label}</label>
      {children}
    </div>
  );
}
