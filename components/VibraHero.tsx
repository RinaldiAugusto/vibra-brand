"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from "framer-motion";

import Image from "next/image";

const MotionImage = motion.create(Image);

/**
 * Hero scroll-driven, pinned:
 *  - hero_1 (el estallido) titila suave y llena la pantalla. Un scrim radial
 *    detras del texto mantiene el logo legible sin tapar los rayos del estallido.
 *  - Al scrollear, hero_1 crece, se desenfoca y se desvanece; hero_2 (las estrellas)
 *    entra "enfocandose" (blur -> nitido), escala y gira -> queda como marca de agua.
 *
 * mix-blend-mode: screen + todas las animaciones van sobre la MISMA <img>
 * (sin wrappers con opacity/transform) para que el negro del PNG desaparezca.
 */
export default function VibraHero() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // hero_1 — el estallido: crece, desenfoca y se va
  const burstScale = useTransform(scrollYProgress, [0, 0.55], [1, 1.4]);
  const burstOpacity = useTransform(scrollYProgress, [0, 0.28, 0.5], [1, 0.9, 0]);
  const burstBlurPx = useTransform(scrollYProgress, [0.15, 0.5], [0, 12]);
  const burstFilter = useMotionTemplate`blur(${burstBlurPx}px)`;

  // hero_2 — las estrellas: entra enfocandose, gira, -> marca de agua
  const clusterOpacity = useTransform(
    scrollYProgress,
    [0.18, 0.5, 1],
    [0, 1, 0.16]
  );
  const clusterScale = useTransform(
    scrollYProgress,
    [0.18, 0.5, 1],
    [0.55, 1, 0.7]
  );
  const clusterBlurPx = useTransform(scrollYProgress, [0.18, 0.5], [22, 0]);
  const clusterFilter = useMotionTemplate`blur(${clusterBlurPx}px)`;

  // titulo
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.32], [0, -64]);
  const titleScale = useTransform(scrollYProgress, [0, 0.32], [1, 0.94]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  return (
    <>
      {/* ---- hero_1: estallido ---- */}
      <MotionImage
        aria-hidden
        src="/hero_1.jpeg"
        alt=""
        width={2560}
        height={1440}
        quality={100}
        priority
        className="star-twinkle"
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none",
          mixBlendMode: "screen",
          scale: burstScale,
          opacity: burstOpacity,
          filter: burstFilter,
        }}
      />

      {/* ---- hero_2: estrellas girando -> marca de agua ---- */}
      <MotionImage
        aria-hidden
        src="/hero_3.jpeg"
        alt=""
        width={1280}
        height={720}
        quality={100}
        priority
        animate={{ rotate: 360 }}
        transition={{ rotate: { duration: 48, ease: "linear", repeat: Infinity } }}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          width: "82vmin",
          height: "82vmin",
          objectFit: "contain",
          zIndex: 0,
          pointerEvents: "none",
          mixBlendMode: "screen",
          x: "-50%",
          y: "-50%",
          opacity: clusterOpacity,
          scale: clusterScale,
          filter: clusterFilter,
        }}
      />

      {/* ---- Seccion hero: pinned ---- */}
      <section ref={ref} style={{ position: "relative", height: "260vh", zIndex: 10 }}>
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <motion.div
            style={{
              position: "relative",
              opacity: titleOpacity,
              y: titleY,
              scale: titleScale,
              textAlign: "center",
            }}
          >
            <div className="title-scrim" aria-hidden />
            <h1 className="wordmark">
              vibra<span className="dot" />
            </h1>
            <p className="tagline tagline-pulse">Agencia de IA</p>
          </motion.div>

          <motion.div className="scroll-hint" style={{ opacity: hintOpacity }}>
            <span>Scroll</span>
            <span>&#8595;</span>
          </motion.div>
        </div>
      </section>
    </>
  );
}
