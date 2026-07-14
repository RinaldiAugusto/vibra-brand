"use client";

import { useCallback, useRef } from "react";
import type { PointerEvent } from "react";

// Pointer-tracking para el efecto BorderGlow: borde que brilla siguiendo el
// cursor e intensifica al acercarse a los bordes. Portado de react-bits
// (BorderGlow-JS-CSS) a un hook liviano, sin dependencias ni Tailwind, para
// encajar con el CSS plano del proyecto.
//
// Calcula dos valores y los expone como custom properties que consume el CSS
// (.border-glow en globals.css):
//   --edge-proximity : 0 en el centro, 100 pegado a cualquier borde.
//   --cursor-angle   : ángulo del cursor respecto del centro (0deg = arriba).
export function useBorderGlow<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  const onPointerMove = useCallback((e: PointerEvent<T>) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = x - cx;
    const dy = y - cy;

    // Proximidad al borde: proyecta el cursor sobre el eje más cercano.
    let kx = Infinity;
    let ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);

    // Ángulo del cursor (0deg = arriba, sentido horario).
    let deg = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (deg < 0) deg += 360;

    el.style.setProperty("--edge-proximity", (edge * 100).toFixed(2));
    el.style.setProperty("--cursor-angle", `${deg.toFixed(2)}deg`);
  }, []);

  return { ref, onPointerMove };
}
