"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Luz orbitando el borde del boton primario (adaptacion del
 * HoverBorderGradient de Aceternity al sistema de la landing: CSS propio y
 * tokens de marca, sin Tailwind ni shadcn).
 *
 * No es un wrapper: se monta DENTRO de `.btn-primary`, que es quien aporta el
 * pill, el hover y el foco. Las tres capas del efecto:
 *
 *   .btn-primary      contenedor. Su fondo tenue ES el anillo en reposo.
 *     .btn-beam       la luz, difuminada, ocupando toda la caja.
 *     .btn-surface    el relleno cyan, inset 2px: tapa el centro y deja a la
 *                     vista solo la franja de 2px del borde.
 *     .btn-label      el contenido, por encima de todo.
 *
 * Reposo: el punto de luz salta TOP -> RIGHT -> BOTTOM -> LEFT, un lado por
 * segundo, y el `transition` de framer hace el viaje entre saltos (4s/vuelta).
 * Activo (hover o foco): el punto se disuelve en un resplandor cyan que
 * enciende el anillo entero, y la orbita se pausa.
 *
 * Los gradientes van con numeros literales a proposito. Framer interpola
 * `background` token a token, asi que los dos extremos tienen que compartir
 * forma y cantidad de numeros — un `var(--accent-rgb)` adentro romperia la
 * interpolacion y el cambio saldria como un corte seco.
 */

type Direction = "TOP" | "RIGHT" | "BOTTOM" | "LEFT";

// Orden antihorario: avanzar restando indice da la vuelta en sentido horario.
const DIRECTIONS: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];

const BEAM: Record<Direction, string> = {
  TOP: "radial-gradient(20.7% 50% at 50% 0%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%)",
  RIGHT:
    "radial-gradient(16.2% 41.2% at 100% 50%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%)",
  BOTTOM:
    "radial-gradient(20.7% 50% at 50% 100%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%)",
  LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%)",
};

// rgb(41, 211, 238) = --cyan-400 (--accent). Literal por lo dicho arriba.
const HIGHLIGHT =
  "radial-gradient(75% 181.2% at 50% 50%, rgba(41, 211, 238, 1) 0%, rgba(255, 255, 255, 0) 100%)";

interface HoverBorderGradientProps {
  /** Hover del puntero o foco de teclado sobre el boton contenedor. */
  active: boolean;
  /** Segundos por lado. La vuelta completa son 4x este valor. */
  duration?: number;
}

export default function HoverBorderGradient({
  active,
  duration = 1,
}: HoverBorderGradientProps) {
  const reducedMotion = useReducedMotion();
  const [direction, setDirection] = useState<Direction>("TOP");

  // La orbita solo corre en reposo: con el boton activo el anillo ya esta
  // encendido entero y seguir rotando no se veria. MotionConfig no alcanza
  // para frenarla, porque reducedMotion="user" solo desactiva transforms.
  useEffect(() => {
    if (active || reducedMotion) return;

    const id = setInterval(() => {
      setDirection((prev) => {
        const i = DIRECTIONS.indexOf(prev);
        return DIRECTIONS[(i - 1 + DIRECTIONS.length) % DIRECTIONS.length];
      });
    }, duration * 1000);

    return () => clearInterval(id);
  }, [active, reducedMotion, duration]);

  return (
    <>
      <motion.span
        className="btn-beam"
        aria-hidden
        initial={{ background: BEAM[direction] }}
        animate={{ background: active ? HIGHLIGHT : BEAM[direction] }}
        transition={{ ease: "linear", duration: reducedMotion ? 0 : duration }}
      />
      <span className="btn-surface" aria-hidden />
    </>
  );
}
