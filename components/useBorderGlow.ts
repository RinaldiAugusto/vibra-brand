"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import type { PointerEvent } from "react";

// Pointer-tracking + órbita en reposo para el efecto BorderGlow (borde que
// brilla). Portado de react-bits (BorderGlow-JS-CSS) a un hook liviano, sin
// dependencias ni Tailwind.
//
// Maneja DOS estados y en ambos setea las mismas custom properties inline, que
// consume el CSS (.border-glow en globals.css):
//   --edge-proximity : 0 centro → 100 pegado al borde (controla intensidad).
//   --cursor-angle   : ángulo del glow (0deg = arriba, horario).
//
//   Reposo (sin hover): un loop de requestAnimationFrame hace orbitar
//     --cursor-angle a velocidad constante con una proximidad baja fija → glow
//     tenue viajando por el borde.
//   Hover: la órbita se pausa y el movimiento del cursor maneja el efecto
//     default a intensidad plena.
//
// Se hace todo en JS (y no con animación CSS de @property) porque animar un
// custom property consumido dentro de un mask no interpola de forma fiable en
// todos los motores/bundlers.

const IDLE_PROXIMITY = 64; // intensidad del glow en reposo (más marcada)
const ORBIT_DEG_PER_SEC = 45; // 45°/s ≈ una vuelta cada 8s

export function useBorderGlow<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const hovering = useRef(false);
  const angle = useRef(Math.random() * 360); // desfasa las cartas entre sí

  const onPointerMove = useCallback((e: PointerEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    hovering.current = true;

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
    angle.current = deg; // así la órbita retoma desde acá al salir

    el.style.setProperty("--edge-proximity", (edge * 100).toFixed(2));
    el.style.setProperty("--cursor-angle", `${deg.toFixed(2)}deg`);
  }, []);

  const onPointerLeave = useCallback(() => {
    hovering.current = false;
    const el = ref.current;
    if (el) el.style.setProperty("--edge-proximity", String(IDLE_PROXIMITY));
  }, []);

  // Loop de órbita en reposo.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // Estado inicial: glow tenue en reposo.
    el.style.setProperty("--edge-proximity", String(IDLE_PROXIMITY));
    el.style.setProperty("--cursor-angle", `${angle.current.toFixed(2)}deg`);

    if (reduced) return; // sin órbita: glow estático tenue

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!hovering.current) {
        angle.current = (angle.current + ORBIT_DEG_PER_SEC * dt) % 360;
        el.style.setProperty("--cursor-angle", `${angle.current.toFixed(2)}deg`);
        el.style.setProperty("--edge-proximity", String(IDLE_PROXIMITY));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handlers = useMemo(
    () => ({ onPointerMove, onPointerLeave }),
    [onPointerMove, onPointerLeave]
  );

  return { ref, handlers };
}
