import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hemos recibido tus respuestas – PSYConnect",
};

export default function GraciasPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div
          className="text-5xl mb-6"
          style={{ fontFamily: "Lora, Georgia, serif", color: "#4d824d" }}
        >
          ✦
        </div>
        <h1
          className="text-3xl font-semibold text-[#1c2b1c] mb-4"
          style={{ fontFamily: "Lora, Georgia, serif" }}
        >
          Hemos recibido tus respuestas.
        </h1>
        <p className="text-[#5a6b5a] mb-8 leading-relaxed">
          Revisaremos la información para buscar una opción que pueda encajar contigo.
          Te contactaremos lo antes posible.
        </p>

        <div className="bg-[#f4f7f4] rounded-2xl p-6 text-left space-y-4 mb-8">
          <h2
            className="font-semibold text-[#2f522f]"
            style={{ fontFamily: "Lora, Georgia, serif" }}
          >
            ¿Qué pasa ahora?
          </h2>
          <div className="space-y-3 text-sm text-[#5a6b5a]">
            <div className="flex items-start gap-3">
              <span className="text-[#4d824d] mt-0.5">01.</span>
              <span>Nuestro equipo revisa tus respuestas.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#4d824d] mt-0.5">02.</span>
              <span>Buscamos un psicólogo que encaje con tu situación, preferencias y disponibilidad.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#4d824d] mt-0.5">03.</span>
              <span>Te enviamos la recomendación por email en breve.</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-[#9aab9a] mb-8 p-4 border border-[#e3ece3] rounded-xl">
          <strong>Recuerda:</strong> PSYConnect no es un servicio de urgencias.
          Si en cualquier momento necesitas ayuda inmediata, llama al{" "}
          <strong>112</strong> o al{" "}
          <strong>024</strong> (atención a la conducta suicida en España).
        </div>

        <p className="text-sm text-[#9aab9a]">
          ¿Tienes alguna duda?{" "}
          <a
            href="mailto:hola@psyconnect.es"
            className="text-[#4d824d] hover:underline"
          >
            hola@psyconnect.es
          </a>
        </p>

        <Link
          href="/"
          className="inline-block mt-6 text-sm text-[#9aab9a] hover:text-[#5a6b5a] transition-colors"
        >
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}
