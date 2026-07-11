import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MotionProvider from "@/components/MotionProvider";
import CalProvider from "@/components/cal-provider";

// Sistema tipografico:
//   Titulos (h1-h4) -> Plus Jakarta Sans  (sustituto de Google Sans)
//   Body / texto general -> Manrope
// Nota: "Google Sans" / "Google Sans Flex" no estan en next/font/google en
// esta version de Next; Google Sans es propietaria y no esta en Google Fonts.
// Plus Jakarta Sans es el reemplazo elegido para los headings.
const fontHeading = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const fontBody = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vibra.agency"),
  title: "Vibra — Agencia de IA",
  description:
    "Vibra construye sistemas de IA que de verdad se destacan: claros, seguros y hechos para producción.",
  openGraph: {
    title: "Vibra — Agencia de IA",
    description: "Vibra construye sistemas de IA que de verdad se destacan: claros, seguros y hechos para producción.",
    url: "https://vibra.agency",
    siteName: "Vibra",
    images: [
      {
        url: "/hero_1.png",
        width: 1200,
        height: 630,
        alt: "Vibra Agency - IA para producción",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibra — Agencia de IA",
    description: "Vibra construye sistemas de IA que de verdad se destacan: claros, seguros y hechos para producción.",
    images: ["/hero_1.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${fontHeading.variable} ${fontBody.variable}`}
      suppressHydrationWarning
    >
      <body>
        <CalProvider />
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        <MotionProvider>
          <Header />
          {children}
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
