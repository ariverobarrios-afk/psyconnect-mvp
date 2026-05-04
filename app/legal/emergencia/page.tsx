import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ayuda urgente – PSYConnect",
};

export default function EmergenciaPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-6 py-12">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🤝</div>
          <h1
            className="text-2xl font-semibold text-[#1c2b1c]"
            style={{ fontFamily: "Lora, Georgia, serif" }}
          >
            Si necesitas ayuda ahora
          </h1>
        </div>

        <div className="bg-white border-2 border-red-200 rounded-2xl p-6 mb-4">
          <h2 className="font-semibold text-red-700 mb-3">
            PSYConnect no es un servicio de emergencias.
          </h2>
          <p className="text-sm text-[#5a6b5a] leading-relaxed">
            Si estás en peligro inmediato o puedes hacerte daño, por favor
            contacta ahora con los servicios de emergencia o con alguien de
            confianza.
          </p>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex items-center justify-between p-5 rounded-2xl bg-red-50 border border-red-200">
            <div>
              <div className="font-semibold text-red-800">Emergencias</div>
              <div className="text-xs text-red-600">Peligro inmediato, accidente, violencia</div>
            </div>
            <a
              href="tel:112"
              className="text-3xl font-bold text-red-700 hover:text-red-900"
            >
              112
            </a>
          </div>

          <div className="flex items-center justify-between p-5 rounded-2xl bg-orange-50 border border-orange-200">
            <div>
              <div className="font-semibold text-orange-800">
                Atención a la conducta suicida
              </div>
              <div className="text-xs text-orange-600">
                24h disponible en España · Gratuito
              </div>
            </div>
            <a
              href="tel:024"
              className="text-3xl font-bold text-orange-700 hover:text-orange-900"
            >
              024
            </a>
          </div>

          <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200">
            <div className="font-semibold text-blue-800 mb-1">
              Si puedes, contacta con alguien de confianza
            </div>
            <div className="text-xs text-blue-600">
              Un familiar, amigo cercano, o cualquier persona que pueda acompañarte.
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-xs text-amber-700">
            <strong>Nota:</strong> Estos recursos corresponden a España. Si te encuentras
            en otro país, busca los servicios de emergencia y atención psicológica de crisis
            locales. Esta información debe revisarse antes del lanzamiento público.
          </p>
        </div>

        <p className="text-sm text-center text-[#9aab9a]">
          Si en otro momento quieres orientación para iniciar terapia,{" "}
          <Link href="/" className="text-[#4d824d] hover:underline">
            aquí estaremos.
          </Link>
        </p>
      </div>
    </div>
  );
}
