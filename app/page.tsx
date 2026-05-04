import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PSYConnect – Encuentra un psicólogo con buen encaje para ti",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Navigation */}
      <nav className="px-6 py-5 flex items-center justify-between max-w-5xl mx-auto">
        <span
          className="text-xl font-semibold tracking-tight"
          style={{ fontFamily: "Lora, Georgia, serif", color: "#2f522f" }}
        >
          PSYConnect
        </span>
        <Link
          href="/profesionales"
          className="text-sm text-[#5a6b5a] hover:text-[#3a673a] transition-colors"
        >
          ¿Eres psicólogo?
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-20 text-center">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full text-sm text-[#3a673a] bg-[#e3ece3] font-medium">
          Orientación gratuita y confidencial
        </div>
        <h1
          className="text-4xl md:text-5xl font-semibold mb-6 text-[#1c2b1c] leading-tight"
          style={{ fontFamily: "Lora, Georgia, serif" }}
        >
          Encuentra un psicólogo con buen encaje para ti,{" "}
          <em className="font-normal italic text-[#4d824d]">sin dar vueltas.</em>
        </h1>
        <p className="text-lg text-[#5a6b5a] mb-10 max-w-xl mx-auto leading-relaxed">
          Responde unas preguntas breves, cuéntanos qué necesitas y te ayudamos
          a encontrar una opción adecuada para empezar terapia.
        </p>
        <Link
          href="/funnel"
          className="inline-block px-8 py-4 rounded-full text-white text-base font-medium transition-all hover:shadow-lg hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg, #4d824d, #3a673a)" }}
        >
          Encontrar mi psicólogo →
        </Link>
        <p className="mt-4 text-xs text-[#9aab9a]">
          Orientación gratuita y confidencial para pacientes. No sustituye servicios de urgencia.
        </p>
      </section>

      {/* Cómo funciona */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2
          className="text-2xl font-semibold text-center mb-12 text-[#1c2b1c]"
          style={{ fontFamily: "Lora, Georgia, serif" }}
        >
          Cómo funciona
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              n: "01",
              title: "Cuéntanos qué necesitas",
              desc: "Responde unas preguntas breves sobre lo que te trae aquí, tu disponibilidad y tus preferencias.",
            },
            {
              n: "02",
              title: "Revisamos tus respuestas",
              desc: "Nuestro equipo analiza la información para identificar qué tipo de profesional puede encajar mejor.",
            },
            {
              n: "03",
              title: "Recibes una recomendación",
              desc: "Te enviamos una opción personalizada y te acompañamos en el primer contacto con el profesional.",
            },
          ].map((step) => (
            <div key={step.n} className="text-center">
              <div
                className="text-4xl font-light mb-4"
                style={{ fontFamily: "Lora, Georgia, serif", color: "#c7d9c7" }}
              >
                {step.n}
              </div>
              <h3
                className="font-medium text-[#2f522f] mb-2"
                style={{ fontFamily: "Lora, Georgia, serif" }}
              >
                {step.title}
              </h3>
              <p className="text-sm text-[#5a6b5a] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bloques de confianza */}
      <section className="bg-[#f4f7f4] py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-2xl font-semibold text-center mb-10 text-[#1c2b1c]"
            style={{ fontFamily: "Lora, Georgia, serif" }}
          >
            Por qué PSYConnect
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              {
                icon: "✦",
                title: "Para ti es gratuito",
                desc: "No pagas nada por recibir orientación y una recomendación personalizada.",
              },
              {
                icon: "✦",
                title: "Psicólogos revisados",
                desc: "Trabajamos solo con profesionales verificados y con disponibilidad real.",
              },
              {
                icon: "✦",
                title: "Privacidad",
                desc: "Solo compartimos la información necesaria. Tus datos son confidenciales.",
              },
              {
                icon: "✦",
                title: "Sin urgencias",
                desc: "Este servicio es para orientación, no para crisis. Si necesitas ayuda urgente, llama al 112.",
              },
              {
                icon: "✦",
                title: "Criterio antes que catálogo",
                desc: "No te damos un listado interminable. Te ayudamos a elegir mejor.",
              },
              {
                icon: "✦",
                title: "Sin diagnósticos",
                desc: "PSYConnect orienta y conecta. No hacemos evaluaciones clínicas ni diagnósticos.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-6 border border-[#e3ece3]"
              >
                <div className="text-[#4d824d] text-xl mb-3">{item.icon}</div>
                <h3 className="font-medium text-[#2f522f] mb-1.5" style={{ fontFamily: "Lora, Georgia, serif" }}>
                  {item.title}
                </h3>
                <p className="text-sm text-[#5a6b5a] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Para quién es */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2
          className="text-2xl font-semibold text-center mb-8 text-[#1c2b1c]"
          style={{ fontFamily: "Lora, Georgia, serif" }}
        >
          ¿Para quién es PSYConnect?
        </h2>
        <div className="space-y-3 max-w-lg mx-auto">
          {[
            "Personas que quieren empezar terapia y no saben por dónde.",
            "Personas que no saben qué tipo de profesional buscar.",
            "Personas que quieren orientación antes de elegir.",
            "Personas que han tenido experiencias previas y quieren algo mejor.",
          ].map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 p-4 rounded-xl bg-[#f4f7f4]"
            >
              <span className="text-[#4d824d] mt-0.5 shrink-0">→</span>
              <span className="text-[#3a3a3a]">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Qué no hacemos */}
      <section className="bg-[#fdf9f5] py-12 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-xl font-semibold mb-6 text-[#5a6b5a]"
            style={{ fontFamily: "Lora, Georgia, serif" }}
          >
            Qué no hacemos
          </h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm text-[#5a6b5a]">
            {[
              "No somos un servicio de urgencias",
              "No hacemos diagnósticos clínicos",
              "No prometemos cura ni resultados garantizados",
              "No somos un directorio abierto de psicólogos",
            ].map((item) => (
              <div
                key={item}
                className="px-4 py-3 border border-[#e3ece3] rounded-xl text-left"
              >
                <span className="text-[#b48a5e] mr-2">×</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-6 py-16">
        <h2
          className="text-2xl font-semibold text-center mb-10 text-[#1c2b1c]"
          style={{ fontFamily: "Lora, Georgia, serif" }}
        >
          Preguntas frecuentes
        </h2>
        <div className="space-y-5">
          {[
            {
              q: "¿Por qué es gratis para mí?",
              a: "Para pacientes, PSYConnect es gratuito. Nuestro modelo funciona colaborando con psicólogos que quieren recibir pacientes mejor orientados y con mayor probabilidad de iniciar un proceso terapéutico real.",
            },
            {
              q: "¿Quién elige al psicólogo?",
              a: "PSYConnect te orienta y te envía una recomendación personalizada. La decisión final de contactar o agendar siempre es tuya.",
            },
            {
              q: "¿Qué pasa si no encajo en la primera sesión?",
              a: "Puede ocurrir. La primera sesión también sirve para comprobar encaje. Si no lo hay, podrás solicitar una nueva orientación bajo una política clara y limitada.",
            },
            {
              q: "¿Qué compartís con el psicólogo?",
              a: "Solo la información necesaria para que pueda entender tu solicitud y valorar si tiene disponibilidad y encaje. Los detalles concretos están definidos en nuestra política de privacidad.",
            },
            {
              q: "¿Sirve si necesito ayuda urgente?",
              a: "No. Si estás en riesgo inmediato, puedes hacerte daño o hay una emergencia, debes contactar con servicios de urgencia (112) o con el teléfono de atención a la conducta suicida (024).",
            },
            {
              q: "¿Puedo usarlo si soy menor de edad?",
              a: "En esta primera versión no procesamos solicitudes de menores sin intervención de un adulto responsable.",
            },
          ].map((item) => (
            <details
              key={item.q}
              className="group border border-[#e3ece3] rounded-2xl overflow-hidden"
            >
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer text-[#2f522f] font-medium list-none">
                {item.q}
                <span className="text-[#4d824d] group-open:rotate-45 transition-transform text-xl leading-none">+</span>
              </summary>
              <div className="px-6 pb-5 text-sm text-[#5a6b5a] leading-relaxed border-t border-[#e3ece3] pt-4">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 px-6 text-center bg-gradient-to-b from-[#f4f7f4] to-[#e3ece3]">
        <h2
          className="text-3xl font-semibold mb-4 text-[#1c2b1c]"
          style={{ fontFamily: "Lora, Georgia, serif" }}
        >
          ¿Listo para empezar?
        </h2>
        <p className="text-[#5a6b5a] mb-8 max-w-md mx-auto">
          Son unos minutos. Te ayudamos a orientarte y a encontrar una opción que pueda encajar contigo.
        </p>
        <Link
          href="/funnel"
          className="inline-block px-8 py-4 rounded-full text-white text-base font-medium transition-all hover:shadow-lg hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg, #4d824d, #3a673a)" }}
        >
          Encontrar mi psicólogo →
        </Link>
        <p className="mt-4 text-xs text-[#9aab9a]">
          Gratuito para pacientes · Sin registro previo · Confidencial
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e3ece3] py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#9aab9a]">
          <span style={{ fontFamily: "Lora, Georgia, serif" }}>PSYConnect</span>
          <div className="flex gap-6">
            <Link href="/legal/privacidad" className="hover:text-[#5a6b5a] transition-colors">
              Privacidad
            </Link>
            <Link href="/legal/terminos" className="hover:text-[#5a6b5a] transition-colors">
              Términos
            </Link>
            <Link href="/legal/emergencia" className="hover:text-[#e53e3e] transition-colors">
              Emergencia
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
