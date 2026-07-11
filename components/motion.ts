import type { Variants, Transition } from "framer-motion";

/**
 * Sistema de movimiento compartido de la landing.
 *
 * Un solo lenguaje de animación para todo el sitio: mismas curvas, mismos
 * tiempos, mismo "peso". Así las entradas de cada sección y el feedback de
 * hover se sienten parte de la misma marca en vez de animaciones sueltas.
 *
 * MotionProvider aplica reducedMotion="user", así que estos transforms se
 * desactivan solos cuando el usuario pide menos movimiento — acá no hay que
 * hacer nada extra.
 */

// Curva "expo-out": arranca rápido y asienta muy suave. Es la sensación
// apple-ish de "algo que llega y se acomoda" — se usa para las entradas.
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

// Spring corto y con cuerpo para el feedback de hover/tap: responde al toque
// sin rebotar de más. Interrumpible, así que entrar/salir del hover rápido
// nunca deja la card a mitad de camino.
export const HOVER_SPRING: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 28,
  mass: 0.6,
};

// Spring un pelín más elástico para elementos chicos (íconos, badges, botones)
// donde un micro-overshoot se siente vivo en vez de nervioso.
export const POP_SPRING: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 17,
};

// Entrada estándar: aparece subiendo unos px con fade. La base de casi todo.
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

// Contenedor que escalona a sus hijos (usar con `fadeUp`/`fadeItem` en los
// hijos). El stagger corto mantiene el ritmo sin que se sienta lento.
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

// Item pensado para vivir dentro de `staggerContainer` (hereda el timing del
// padre, no define su propia duración de delay).
export const fadeItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
};

// Viewport por defecto para las entradas on-scroll: se dispara una vez, un
// poco antes de que el bloque entre del todo, para que nunca se vea el "salto".
export const viewportOnce = { once: true, margin: "-80px" } as const;
