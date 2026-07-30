import Link from "next/link";
import Image from "next/image";
import "./demo.css";

/**
 * Chrome de la demo: deliberadamente minimo. No lleva el header ni el footer
 * del sitio (viven en app/(site)) porque la demo es una pantalla, no una
 * seccion mas de la landing: cualquier navegacion de mas compite con el
 * recorrido de seis pasos.
 */
export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="demo-page">
      <header className="demo-topbar">
        <Link href="/" className="demo-volver">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="15 5 8 12 15 19" />
          </svg>
          Volver al sitio
        </Link>

        <Link href="/" className="demo-logo" aria-label="Vibra — inicio">
          <Image
            src="/vibra-logo-dark.png"
            alt="Vibra"
            width={1975}
            height={954}
            priority
            quality={100}
          />
        </Link>
      </header>

      <main id="contenido" className="demo-main">
        {children}
      </main>
    </div>
  );
}
