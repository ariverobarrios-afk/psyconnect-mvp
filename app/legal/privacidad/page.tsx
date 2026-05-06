import Link from "next/link";

export default function PrivacidadPage() {
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
          Política de Privacidad
        </h1>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
          <p className="text-sm text-amber-700">
            <strong>⚠️ Documento en revisión legal.</strong> Este texto es un placeholder
            provisional. Antes del lanzamiento público debe ser revisado y validado por
            asesoría legal especializada en protección de datos (RGPD) y salud.
          </p>
        </div>
        <div className="prose prose-sm text-[#5a6b5a] space-y-4">
          <p>
            PSYConnect trata los datos personales que recoge a través del formulario
            de orientación con el único propósito de facilitar el matching entre
            paciente y psicólogo.
          </p>
          <p>
            Los datos no se ceden a terceros salvo al psicólogo recomendado, y únicamente
            la información necesaria para valorar el encaje.
          </p>
          <p>
            <strong>Datos que tratamos:</strong> nombre, email, teléfono (opcional),
            motivo de consulta, modalidad de preferencia, presupuesto, disponibilidad
            y preferencias relacionales.
          </p>
          <p>
            <strong>Base legal:</strong> consentimiento explícito otorgado al completar
            el formulario.
          </p>
          <p>
            <strong>Conservación:</strong> los datos se conservarán durante el tiempo
            necesario para prestar el servicio y los plazos legales aplicables.
          </p>
          <p>
            Puedes ejercer tus derechos de acceso, rectificación, supresión y portabilidad
            escribiendo a{" "}
            <a href="mailto:privacidad@psyconnect.es" className="text-[#4d824d]">
              privacidad@psyconnect.es
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
