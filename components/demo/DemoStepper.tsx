"use client";

import Link from "next/link";
import { PASOS, TOTAL_PASOS } from "./script";

function Chevron({ dir }: { dir: "izq" | "der" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={dir === "izq" ? { transform: "scaleX(-1)" } : undefined}
    >
      <polyline points="9 5 16 12 9 19" />
    </svg>
  );
}

/**
 * Controles de la demo. Los puntos no son decorativos: cada uno es un boton con
 * el nombre del paso, asi se puede saltar directo a la parte que interesa (y un
 * lector de pantalla lee "El CRM" en vez de "punto 5").
 *
 * En la ultima pantalla el boton de avanzar se convierte en el CTA: el
 * visitante llega al final del recorrido justo cuando entendio el sistema.
 */
export default function DemoStepper({
  paso,
  ir,
  ctaHref,
}: {
  paso: number;
  ir: (n: number) => void;
  ctaHref: string;
}) {
  const ultimo = paso === TOTAL_PASOS - 1;

  return (
    <div className="demo-stepper">
      <button
        type="button"
        className="demo-nav-btn"
        onClick={() => ir(paso - 1)}
        disabled={paso === 0}
      >
        <Chevron dir="izq" />
        Anterior
      </button>

      <ol className="demo-dots">
        {PASOS.map((p, i) => (
          <li key={p.chip}>
            <button
              type="button"
              className={`demo-dot${i === paso ? " demo-dot-active" : ""}${
                i < paso ? " demo-dot-done" : ""
              }`}
              onClick={() => ir(i)}
              aria-current={i === paso ? "step" : undefined}
            >
              <span className="demo-dot-mark" aria-hidden />
              <span className="demo-dot-label">{p.chip}</span>
              <span className="demo-sr-only">
                Paso {i + 1} de {TOTAL_PASOS}
              </span>
            </button>
          </li>
        ))}
      </ol>

      {ultimo ? (
        <div className="demo-end-actions">
          <button
            type="button"
            className="demo-nav-btn demo-nav-btn-ghost"
            onClick={() => ir(0)}
          >
            Volver a empezar
          </button>
          <Link href={ctaHref} className="demo-cta">
            Quiero esto en mi negocio
            <Chevron dir="der" />
          </Link>
        </div>
      ) : (
        <button
          type="button"
          className="demo-nav-btn demo-nav-btn-next"
          onClick={() => ir(paso + 1)}
        >
          Siguiente
          <Chevron dir="der" />
        </button>
      )}
    </div>
  );
}
