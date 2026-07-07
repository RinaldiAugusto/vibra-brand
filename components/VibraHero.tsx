"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useMotionValue,
  useAnimationFrame,
  useTime,
} from "framer-motion";

import Image from "next/image";

const MotionImage = motion.create(Image);

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ramp = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));

/**
 * Hero scroll-driven, pinned — morph real entre 3 imagenes via video:
 *  1. hero_1 (el estallido) llena la pantalla y titila suave (brillo acotado
 *     para no opacar el wordmark; el scrim radial ayuda a la legibilidad).
 *  2. Al scrollear, un video generado con Higgsfield (Seedance start->end
 *     frame) se scrubbea con el scroll: el estallido se desarma en muchas
 *     estrellas de vidrio que se reagrupan hasta formar hero_2.
 *  3. Un segundo video morphea hero_2 -> hero_3 (el cluster compacto).
 *  4. hero_3 aparece girando rapido (12 s/vuelta) y queda como marca de
 *     agua girando detras del contenido.
 *
 * Los videos tienen el primer/ultimo frame identicos a las imagenes, asi que
 * los crossfades cortos en los bordes son invisibles. Todo usa
 * mix-blend-mode: screen sobre fondo negro, sin wrappers con opacity para
 * que el negro desaparezca contra el fondo de la pagina.
 *
 * Ventanas de scroll (progreso p de la seccion pinned de 240vh; el pin se
 * suelta en p~0.58, asi que los morphs viven antes y hero_3 aterriza de
 * marca de agua justo cuando entra el contenido):
 *   hero_1   [0    - 0.15]
 *   video A  [0.10 - 0.38]  scrub en [0.12, 0.35]
 *   hero_2   [0.34 - 0.46]
 *   video B  [0.42 - 0.66]  scrub en [0.44, 0.63]
 *   hero_3   [0.62 - 1   ]  gira rapido, termina al 20% de opacidad
 */
export default function VibraHero() {
  const ref = useRef<HTMLElement>(null);
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // titilacion de hero_1: brillo 1 -> 1.1 max, senoidal
  const time = useTime();
  const twinkle = useTransform(
    time,
    (t) => 1 + 0.05 + 0.05 * Math.sin((t / 3800) * Math.PI * 2)
  );
  const burstFilter = useMotionTemplate`brightness(${twinkle})`;

  // ---- hero_1: estallido titilando ----
  const burstOpacity = useTransform(scrollYProgress, [0, 0.1, 0.15], [1, 1, 0]);
  const burstScale = useTransform(scrollYProgress, [0, 0.15], [1, 1.05]);

  // ---- video A: estallido -> estrellas dispersas -> hero_2 ----
  const videoAOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.15, 0.34, 0.38],
    [0, 1, 1, 0]
  );

  // ---- hero_2: puente entre los dos videos ----
  const midOpacity = useTransform(
    scrollYProgress,
    [0.34, 0.38, 0.42, 0.46],
    [0, 1, 1, 0]
  );

  // ---- video B: hero_2 -> cluster compacto (hero_3) ----
  const videoBOpacity = useTransform(
    scrollYProgress,
    [0.42, 0.46, 0.62, 0.66],
    [0, 1, 1, 0]
  );

  // ---- hero_3: entra girando rapido -> marca de agua ----
  const clusterOpacity = useTransform(
    scrollYProgress,
    [0.62, 0.67, 1],
    [0, 1, 0.2]
  );
  const clusterScale = useTransform(scrollYProgress, [0.67, 1], [1, 0.66]);

  // scrub de videos + giro continuo, todo en un solo rAF
  const clusterRotate = useMotionValue(0);
  useAnimationFrame((_, delta) => {
    const p = scrollYProgress.get();

    const scrub = (
      video: HTMLVideoElement | null,
      from: number,
      to: number
    ) => {
      if (!video || !video.duration) return;
      const target = ramp(p, from, to) * (video.duration - 0.05);
      if (Math.abs(video.currentTime - target) > 0.02) {
        // persigue el target para absorber saltos bruscos del scroll
        video.currentTime += (target - video.currentTime) * 0.45;
      }
    };
    scrub(videoARef.current, 0.12, 0.35);
    scrub(videoBRef.current, 0.44, 0.63);

    // giro rapido (12 s/vuelta) apenas hero_3 se hace visible
    const degPerSec = 30 * ramp(p, 0.62, 0.67);
    clusterRotate.set((clusterRotate.get() + (degPerSec * delta) / 1000) % 360);
  });

  // titulo
  const titleOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.12], [0, -64]);
  const titleScale = useTransform(scrollYProgress, [0, 0.12], [1, 0.94]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  const fullscreenMedia = {
    position: "fixed" as const,
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    zIndex: 0,
    pointerEvents: "none" as const,
    mixBlendMode: "screen" as const,
  };

  return (
    <>
      {/* ---- hero_1: estallido ---- */}
      <MotionImage
        aria-hidden
        src="/hero_1.png"
        alt=""
        width={4096}
        height={2305}
        quality={100}
        sizes="100vw"
        priority
        style={{
          ...fullscreenMedia,
          scale: burstScale,
          opacity: burstOpacity,
          filter: burstFilter,
        }}
      />

      {/* ---- video A: hero_1 se desarma en estrellas -> hero_2 ---- */}
      <motion.video
        aria-hidden
        ref={videoARef}
        src="/hero_morph_1.mp4"
        muted
        playsInline
        preload="auto"
        style={{ ...fullscreenMedia, opacity: videoAOpacity }}
      />

      {/* ---- hero_2: cinco estrellas de vidrio ---- */}
      <MotionImage
        aria-hidden
        src="/hero_2.png"
        alt=""
        width={4096}
        height={2294}
        quality={100}
        sizes="100vw"
        priority
        style={{ ...fullscreenMedia, opacity: midOpacity }}
      />

      {/* ---- video B: hero_2 se reagrupa en el cluster (hero_3) ---- */}
      <motion.video
        aria-hidden
        ref={videoBRef}
        src="/hero_morph_2.mp4"
        muted
        playsInline
        preload="auto"
        style={{ ...fullscreenMedia, opacity: videoBOpacity }}
      />

      {/* ---- hero_3: cluster girando rapido -> marca de agua ----
           cuadrado centrado + object-fit cover: al girar, los bordes son
           negros y el blend screen los hace invisibles */}
      <MotionImage
        aria-hidden
        src="/hero_3.png"
        alt=""
        width={4096}
        height={2293}
        quality={100}
        sizes="110vmin"
        priority
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          width: "110vmin",
          height: "110vmin",
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none",
          mixBlendMode: "screen",
          x: "-50%",
          y: "-50%",
          opacity: clusterOpacity,
          scale: clusterScale,
          rotate: clusterRotate,
        }}
      />

      {/* ---- Seccion hero: pinned ---- */}
      <section ref={ref} style={{ position: "relative", height: "240vh", zIndex: 10 }}>
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
