"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Motor de animacion de cada pantalla de la demo.
 *
 * Cada paso describe su secuencia como una funcion async que va soltando
 * estados con `wait(ms)` entre medio — el mismo patron alive/timers que ya usan
 * los mockups del landing (ver components/AgentsFanMockup.tsx), extraido acá
 * para no repetirlo seis veces.
 *
 * El ciclo de vida lo maneja el montaje: DemoPlayer renderiza cada paso con
 * key={paso}, asi que volver a una pantalla la remonta y la secuencia arranca
 * de cero sola. No hace falta ninguna logica de "reset".
 *
 * Bajo prefers-reduced-motion la secuencia NO corre: se llama a `skipTo`, que
 * deja la pantalla en su estado final (legible y completa, pero quieta).
 */

export type StepContext = {
  /** Pausa la secuencia. Resuelve solo si el paso sigue montado. */
  wait: (ms: number) => Promise<void>;
  /** false cuando el paso se desmontó: cortar loops largos con esto. */
  alive: () => boolean;
};

export type StepScript = (ctx: StepContext) => void | Promise<void>;

export function useStepPlayer(play: StepScript, skipTo: () => void) {
  const reduce = useReducedMotion();

  // Por refs: las secuencias se redefinen en cada render (son closures sobre
  // los setters), y no queremos que eso reinicie la animacion.
  const playRef = useRef(play);
  const skipRef = useRef(skipTo);
  playRef.current = play;
  skipRef.current = skipTo;

  useEffect(() => {
    if (reduce) {
      skipRef.current();
      return;
    }

    let alive = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((res) => timers.push(setTimeout(res, ms)));

    void playRef.current({ wait, alive: () => alive });

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
    };
  }, [reduce]);

  return reduce;
}

/**
 * Count-up de un numero con ease-out cubico sobre rAF. Se resuelve al llegar
 * al target, asi encadena con `await` dentro de una secuencia.
 */
export function countUp(
  target: number,
  set: (n: number) => void,
  alive: () => boolean,
  dur = 1200
) {
  return new Promise<void>((res) => {
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = () => {
      if (!alive()) return res();
      const t = Math.min(1, (performance.now() - start) / dur);
      set(Math.round(target * ease(t)));
      if (t < 1) requestAnimationFrame(tick);
      else res();
    };
    requestAnimationFrame(tick);
  });
}

/**
 * Escribe un texto caracter por caracter. Igual que countUp, se puede esperar.
 */
export async function typewriter(
  text: string,
  set: (s: string) => void,
  ctx: StepContext,
  msPorCaracter = 12
) {
  for (let i = 1; i <= text.length; i++) {
    if (!ctx.alive()) return;
    set(text.slice(0, i));
    await ctx.wait(msPorCaracter);
  }
}
