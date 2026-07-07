import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
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
        url: "/hero_1.jpeg",
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
    images: ["/hero_1.jpeg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
