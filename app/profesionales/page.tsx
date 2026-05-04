import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Para psicólogos – PSYConnect",
  description:
    "Recibe pacientes mejor orientados, no leads sin contexto. PSYConnect busca mejorar el encaje entre paciente y psicólogo.",
};

export default function ProfesionalesPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Nav */}
      <nav className="px-6 py-5 flex items-center justify-between max-w-5xl mx-auto border-b border-[#e3ece3]">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight"
          style={{ fontFamily: "Lora, Georgia, serif", color: "#2f522f" }}
        >
          PSYConnect
        </Link>
        <Link
          href="/funnel"
          className="text-sm text-[#5a6b5a] hover:text-[#3a673a] transition-colors"
        >
          ¿Buscas psicólogo?
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full text-sm text-[#3a673a] bg-[#e3ece3] font-medium">
          Para profesionales de la salud mental
        </div>
        <h1
          className="text-4xl font-semibold mb-5 text-[#1c2b1c] leading-tight"
          style={{ fontFamily: "Lora, Georgia, serif" }}
        >
          Recibe pacientes mejor orientados,{" "}
          <em className="font-normal italic text-[#4d824d]">no leads sin contexto.</em>
        </h1>
        <p className="text-lg text-[#5a6b5a] mb-8 max-w-xl mx-auto leading-relaxed">
          PSYConnect busca mejorar el encaje entre paciente y psicólogo, aumentando
          la probabilidad de continuidad terapéutica.
        </p>
        <a
          href="mailto:psicologos@psyconnect.es?subject=Quiero%20formar%20parte%20de%20la%20red"
          className="inline-block px-8 py-4 rounded-full text-white text-base font-medium transition-all hover:shadow-lg hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg, #4d824d, #3a673a)" }}
        >
          Quiero formar parte de la red
        </a>
      </section>

      {/* Qué problema resolvemos */}
      <section className="bg-[#f4f7f4] py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-2xl font-semibold mb-8 text-[#1c2b1c]"
            style={{ fontFamily: "Lora, Georgia, serif" }}
          >
            El problema que resolvemos
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                label: "Sin PSYConnect",
                items: [
                  "Pacientes que llegan sin saber qué esperan de la terapia",
                  "Alta tasa de abandono tras la primera sesión",
                  "Mucho tiempo invertido en contactos poco adecuados",
                  "Expectativas desalineadas desde el inicio",
                ],
                negative: true,
              },
              {
                label: "Con PSYConnect",
                items: [
                  "Pacientes orientados antes de la primera sesión",
                  "Mayor probabilidad de pasar de 1.ª a 2.ª sesión",
                  "Encaje previo en modalidad, presupuesto y motivo",
                  "Menos fricción comercial y administrativa",
                ],
                negative: false,
              },
            ].map((col) => (
              <div
                key={col.label}
                className={`rounded-2xl p-6 ${
                  col.negative ? "bg-white border border-[#e3ece3]" : "border-2 border-[#4d824d]"
                }`}
              >
                <div
                  className={`text-sm font-medium mb-4 ${
                    col.negative ? "text-[#9aab9a]" : "text-[#3a673a]"
                  }`}
                >
                  {col.label}
                </div>
                <ul className="space-y-3">
                  {col.items.map((item) => (
                    <li
                      key={item}
                      className={`flex items-start gap-2 text-sm ${
                        col.negative ? "text-[#9aab9a]" : "text-[#3a3a3a]"
                      }`}
                    >
                      <span className={col.negative ? "text-red-300" : "text-[#4d824d]"}>
                        {col.negative ? "×" : "✓"}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2
          className="text-2xl font-semibold mb-8 text-[#1c2b1c]"
          style={{ fontFamily: "Lora, Georgia, serif" }}
        >
          Cómo funciona para ti
        </h2>
        <div className="space-y-4">
          {[
            {
              n: "01",
              title: "Validamos tu perfil",
              desc: "Revisamos tu formación, especialidades, disponibilidad y tarifas antes de incluirte en la red.",
            },
            {
              n: "02",
              title: "El paciente completa un funnel de orientación",
              desc: "Antes de cualquier contacto, el paciente responde preguntas sobre su motivo, expectativas, modalidad y presupuesto.",
            },
            {
              n: "03",
              title: "Confirmamos encaje antes de enviártelo",
              desc: "Solo te consultamos disponibilidad cuando el perfil del paciente encaja con tu especialidad y condiciones.",
            },
            {
              n: "04",
              title: "Confirmas y el paciente recibe la recomendación",
              desc: "El paciente recibe tu perfil con contexto claro. La primera sesión sirve para verificar el encaje.",
            },
          ].map((step) => (
            <div key={step.n} className="flex gap-5 p-5 rounded-2xl bg-white border border-[#e3ece3]">
              <div
                className="text-2xl font-light shrink-0"
                style={{ fontFamily: "Lora, Georgia, serif", color: "#c7d9c7" }}
              >
                {step.n}
              </div>
              <div>
                <h3
                  className="font-medium text-[#2f522f] mb-1"
                  style={{ fontFamily: "Lora, Georgia, serif" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-[#5a6b5a] leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Por qué no somos leads */}
      <section className="bg-[#f4f7f4] py-12 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-xl font-semibold mb-4 text-[#1c2b1c]"
            style={{ fontFamily: "Lora, Georgia, serif" }}
          >
            Por qué no somos una plataforma de leads
          </h2>
          <p className="text-[#5a6b5a] leading-relaxed">
            No vendemos contactos sin contexto. El paciente llega orientado, con
            expectativas claras y con mayor probabilidad de continuar en terapia.
            Pagas cuando hay valor real: cuando la primera sesión se realiza.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-xl mx-auto px-6 py-16 text-center">
        <h2
          className="text-2xl font-semibold mb-4 text-[#1c2b1c]"
          style={{ fontFamily: "Lora, Georgia, serif" }}
        >
          ¿Te interesa formar parte?
        </h2>
        <p className="text-[#5a6b5a] mb-8">
          Estamos construyendo una red inicial de psicólogos. Si quieres más
          información o unirte al piloto, escríbenos.
        </p>
        <a
          href="mailto:psicologos@psyconnect.es?subject=Quiero%20formar%20parte%20de%20la%20red"
          className="inline-block px-8 py-4 rounded-full text-white text-base font-medium transition-all hover:shadow-lg hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg, #4d824d, #3a673a)" }}
        >
          Contactar con PSYConnect
        </a>
        <p className="mt-4 text-xs text-[#9aab9a]">psicologos@psyconnect.es</p>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e3ece3] py-6 px-6 text-center text-sm text-[#9aab9a]">
        <Link href="/" className="hover:text-[#5a6b5a] transition-colors">
          ← Volver al inicio para pacientes
        </Link>
      </footer>
    </div>
  );
}
