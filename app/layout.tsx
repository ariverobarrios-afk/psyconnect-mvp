import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PSYConnect – Encuentra un psicólogo con buen encaje para ti",
  description:
    "Orientación gratuita y confidencial para encontrar un psicólogo adecuado. Matching psicológico personalizado. No sustituye servicios de urgencia.",
  keywords: "psicólogo, terapia, psicología, orientación psicológica, España",
  openGraph: {
    title: "PSYConnect – Encuentra un psicólogo con buen encaje para ti",
    description:
      "Orientación gratuita y confidencial. Te ayudamos a encontrar una opción adecuada para empezar terapia.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
