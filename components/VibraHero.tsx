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
  cubicBezier,
} from "framer-motion";

import Image from "next/image";

const MotionImage = motion.create(Image);

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ramp = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));

// vuelo de hero_3 hacia el boton del header
const CLUSTER_SIZE = 64; // px — tamano final del logo
// posicion: sale rapido y sobrepasa apenas el destino antes de acoplarse
const flyEase = cubicBezier(0.3, 1.18, 0.32, 1);
// escala: encoge rapido al principio y asienta suave
const shrinkEase = cubicBezier(0.25, 0.9, 0.3, 1);

/**
 * Hero scroll-driven, pinned — morph real entre 3 imagenes via video:
 *  1. hero_1 (el estallido) llena la pantalla y titila organico: brillo con
 *     tres ondas superpuestas + una copia difuminada (bloom) cuya opacidad
 *     respira, asi el halo de la estrella se expande y contrae.
 *  2. Al scrollear, un video generado con Higgsfield (Seedance start->end
 *     frame) se scrubbea con el scroll: el estallido se desarma en muchas
 *     estrellas de vidrio que se reagrupan hasta formar hero_2.
 *  3. Un segundo video morphea hero_2 -> hero_3 (el cluster compacto).
 *  4. hero_3 empalma a pantalla completa con el frame final del video B y
 *     vuela hacia el header encogiendose — overshoot leve al acoplarse y
 *     giro acelerado en pleno vuelo — hasta quedar como logo girando
 *     (4 s/vuelta) al lado del boton "Agenda una Llamada".
 *
 * Los videos tienen el primer/ultimo frame identicos a las imagenes, asi que
 * los crossfades cortos en los bordes son invisibles. Todo usa
 * mix-blend-mode: screen sobre fondo negro, sin wrappers con opacity para
 * que el negro desaparezca contra el fondo de la pagina.
 *
 * Ventanas de scroll (progreso p de la seccion pinned de 160vh; el pin se
 * suelta en p~0.58, asi que los morphs viven antes y hero_3 aterriza de
 * marca de agua justo cuando entra el contenido):
 *   hero_1   [0    - 0.15]
 *   video A  [0.10 - 0.42]  scrub en [0.12, 0.36]
 *   video B  [0.38 - 0.66]  scrub en [0.44, 0.63]  (crossfade directo con A)
 *   hero_3   [0.62 - 0.80]  empalma grande con el video B y vuela [0.66-0.80]
 *                           hasta el lado del boton "Agenda una Llamada"
 */
export default function VibraHero() {
  const ref = useRef<HTMLElement>(null);
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // titilacion de hero_1: parpadeo organico — tres ondas superpuestas de
  // frecuencias distintas para que nunca se sienta mecanico
  const time = useTime();
  const twinkle = useTransform(time, (t) => {
    const s1 = Math.sin((t / 2600) * Math.PI * 2);
    const s2 = Math.sin((t / 1100) * Math.PI * 2 + 1.3);
    const s3 = Math.sin((t / 430) * Math.PI * 2 + 2.1);
    return 1.16 + 0.12 * s1 + 0.06 * s2 + 0.04 * s3;
  });
  const burstFilter = useMotionTemplate`brightness(${twinkle})`;

  // ---- hero_1: estallido titilando ----
  const burstOpacity = useTransform(scrollYProgress, [0, 0.1, 0.15], [1, 1, 0]);
  const burstScale = useTransform(scrollYProgress, [0, 0.15], [1, 1.05]);

  // bloom: la misma imagen difuminada como halo de luz que respira; con
  // blend screen sobre negro solo las zonas brillantes (la estrella y sus
  // rayos) aportan luz, asi que el halo emana de la propia iluminacion.
  // Ademas de la opacidad, la escala pulsa: el halo se expande fisicamente
  // cuando brilla, como si la luz empujara el espacio.
  const bloomPulse = useTransform(time, (t) => {
    const s1 = Math.sin((t / 2600) * Math.PI * 2);
    const s2 = Math.sin((t / 900) * Math.PI * 2 + 0.7);
    return 0.55 + 0.35 * s1 + 0.2 * s2;
  });
  const bloomOpacity = useTransform(
    [burstOpacity, bloomPulse],
    ([a, b]: number[]) => a * clamp01(b)
  );
  const bloomScale = useTransform(
    [burstScale, bloomPulse],
    ([s, b]: number[]) => s * (1 + 0.05 * clamp01(b))
  );

  // halo exterior: capa muy difuminada y lenta, desfasada del bloom, que
  // envuelve toda la escena en un resplandor espacial que va y viene
  const haloPulse = useTransform(time, (t) => {
    const s1 = Math.sin((t / 3400) * Math.PI * 2 + 2.4);
    const s2 = Math.sin((t / 1500) * Math.PI * 2);
    return 0.45 + 0.3 * s1 + 0.18 * s2;
  });
  const haloOpacity = useTransform(
    [burstOpacity, haloPulse],
    ([a, b]: number[]) => a * clamp01(b)
  );
  const haloScale = useTransform(
    [burstScale, haloPulse],
    ([s, b]: number[]) => s * (1 + 0.12 * clamp01(b))
  );

  // ---- video A: estallido -> estrellas dispersas -> hero_2 ----
  const videoAOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.15, 0.38, 0.42],
    [0, 1, 1, 0]
  );

  // ---- video B: hero_2 -> cluster compacto (hero_3) ----
  // crossfade directo con video A: ambos muestran el frame de hero_2 en ese
  // rango, asi que la transicion es invisible (sin imagen intermedia)
  const videoBOpacity = useTransform(
    scrollYProgress,
    [0.38, 0.42, 0.62, 0.66],
    [0, 1, 1, 0]
  );

  // ---- hero_3: vuelo animado hasta el lado del boton ----
  // Aparece a pantalla completa (empalma con el frame final del video B) y
  // vuela hacia el boton encogiendose, con overshoot leve al acoplarse y un
  // "whoosh" de giro extra durante el vuelo. dx/dy/scale se calculan en el
  // rAF porque dependen del tamano del viewport.
  const clusterOpacity = useTransform(scrollYProgress, [0.62, 0.66], [0, 1]);
  const clusterDX = useMotionValue(0);
  const clusterDY = useMotionValue(0);
  const clusterScale = useMotionValue(1);
  const clusterX = useMotionTemplate`calc(-50% + ${clusterDX}px)`;
  const clusterY = useMotionTemplate`calc(-50% + ${clusterDY}px)`;

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
    // el scrub de A termina antes del crossfade (0.38-0.42) para que ambos
    // videos muestren el frame de hero_2 durante la transicion
    scrub(videoARef.current, 0.12, 0.36);
    scrub(videoBRef.current, 0.44, 0.63);

    // vuelo de hero_3: de pantalla completa al lado del boton.
    // El destino replica el left/top fijos del style (mantener en sync).
    const f = ramp(p, 0.66, 0.8);
    const w = window.innerWidth;
    const h = window.innerHeight;
    // escala inicial: cubre 110vmin, igual que el frame final del video B
    const startScale = (1.1 * Math.min(w, h)) / CLUSTER_SIZE;
    const targetLeft = Math.min(w / 2 + 610, w - 40);
    clusterScale.set(startScale + (1 - startScale) * shrinkEase(f));
    clusterDX.set((w / 2 - targetLeft) * (1 - flyEase(f)));
    clusterDY.set((h / 2 - 47) * (1 - flyEase(f)));

    // giro base (4 s/vuelta) + whoosh: acelera en pleno vuelo y se asienta
    const degPerSec =
      90 * ramp(p, 0.62, 0.66) + 300 * Math.sin(Math.PI * f);
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

      {/* ---- bloom de hero_1: halo difuminado que respira sobre la luz
           de la estrella (blend screen: el negro no aporta nada) ---- */}
      <MotionImage
        aria-hidden
        src="/hero_1.png"
        alt=""
        width={4096}
        height={2305}
        quality={75}
        sizes="100vw"
        priority
        style={{
          ...fullscreenMedia,
          scale: bloomScale,
          opacity: bloomOpacity,
          filter: "blur(28px) saturate(1.4) brightness(1.15)",
        }}
      />

      {/* ---- halo exterior de hero_1: resplandor espacial amplio ---- */}
      <MotionImage
        aria-hidden
        src="/hero_1.png"
        alt=""
        width={4096}
        height={2305}
        quality={75}
        sizes="100vw"
        priority
        style={{
          ...fullscreenMedia,
          scale: haloScale,
          opacity: haloOpacity,
          filter: "blur(80px) saturate(1.6) brightness(1.3)",
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
          // centro vertical del boton: padding-top del header (24px) + medio
          // alto del boton (~23px)
          top: "47px",
          // centro del logo pegado a la derecha del boton: borde derecho del
          // boton (50vw + 600px - 2rem de padding del contenedor) + gap de
          // 10px + medio logo (32px) = 50vw + 610px. En pantallas angostas se
          // topa a 100vw - 40px para que nunca se salga del viewport.
          left: "calc(min(50vw + 610px, 100vw - 40px))",
          width: "64px",
          height: "64px",
          objectFit: "cover",
          zIndex: 60,
          pointerEvents: "none",
          mixBlendMode: "screen",
          x: clusterX,
          y: clusterY,
          opacity: clusterOpacity,
          scale: clusterScale,
          rotate: clusterRotate,
          willChange: "transform",
        }}
      />

      {/* ---- Seccion hero: pinned ---- */}
      <section ref={ref} style={{ position: "relative", height: "160vh", zIndex: 10 }}>
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
