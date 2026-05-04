import Link from "next/link";

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-sm text-[#4d824d] hover:underline mb-8 block">
          ← Volver
        </Link>
        <h1
          className="text-3xl font-semibold text-[#1c2b1c] mb-4"
          style={{ fontFamily: "Lora, Georgia, serif" }}
        >
          Condiciones del Servicio
        </h1>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
          <p className="text-sm text-amber-700">
            <strong>⚠️ Documento en revisión legal.</strong> Este texto es un placeholder
            provisional. Antes del lanzamiento público debe ser revisado y validado por
            asesoría legal especializada.
          </p>
        </div>
        <div className="prose prose-sm text-[#5a6b5a] space-y-4">
          <p>
            PSYConnect es una plataforma de orientación y matching psicológico. No presta
            servicios de atención psicológica, no realiza diagnósticos clínicos y no
            sustituye a ningún servicio sanitario.
          </p>
          <p>
            El uso del servicio de orientación es gratuito para pacientes. El cliente
            económico es el profesional, no el paciente.
          </p>
          <p>
            PSYConnect no es un servicio de urgencias. En situaciones de riesgo inmediato,
            el usuario debe contactar con los servicios de emergencia (112) o con el
            teléfono de atención a la conducta suicida (024).
          </p>
          <p>
            PSYConnect no garantiza el encaje entre paciente y psicólogo ni el éxito
            del proceso terapéutico. La recomendación es personalizada pero orientativa.
          </p>
          <p>
            Para cualquier consulta:{" "}
            <a href="mailto:hola@psyconnect.es" className="text-[#4d824d]">
              hola@psyconnect.es
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
