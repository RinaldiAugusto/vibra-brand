"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useAnimationFrame,
  useTime,
  useReducedMotion,
  cubicBezier,
} from "framer-motion";

import Image from "next/image";
import Galaxy from "./Galaxy";

const MotionImage = motion.create(Image);

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ramp = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));

// vuelo de hero_3 hacia el boton del header
const CLUSTER_SIZE = 48; // px — tamano final del logo
const CLUSTER_ASPECT = 4096 / 2293; // proporcion de hero_3.png
// posicion: sale rapido y sobrepasa apenas el destino antes de acoplarse
const flyEase = cubicBezier(0.3, 1.18, 0.32, 1);
// escala: encoge rapido al principio y asienta suave
const shrinkEase = cubicBezier(0.25, 0.9, 0.3, 1);

/**
 * Hero scroll-driven, pinned — morph real entre 3 imagenes via video:
 *  0. Un campo de estrellas WebGL (Galaxy) es el telon de fondo de toda la
 *     escena: deriva y titila solo, sin reaccionar al mouse, para no
 *     competir con el morph, que lo maneja el scroll. Una mascara radial le
 *     abre un hueco en el centro para que el campo nunca se apoye sobre la
 *     estrella principal; el hueco respira con el mismo latido del halo.
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
 *   galaxy   [0    - 0.85]  se apaga en [0.66, 0.85], acompanando el vuelo
 */
export default function VibraHero() {
  const ref = useRef<HTMLElement>(null);
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);

  // Los videos NO se muestran: son la fuente de frames de dos <canvas>, que
  // son las capas visibles del morph. Cuando un <video> se esta
  // REPRODUCIENDO, iOS lo promueve a un plano de composicion de hardware que
  // ignora mix-blend-mode, la mascara y hasta el orden de apilado: el
  // rectangulo crudo del video aparecia con sus bandas negras (el "marco"
  // arriba y abajo) y seguia pintando encima de la seccion siguiente
  // (verificado en grabacion de iPhone real). Un canvas es una capa normal:
  // blend, mascara y opacity se respetan siempre.
  const canvasARef = useRef<HTMLCanvasElement>(null);
  const canvasBRef = useRef<HTMLCanvasElement>(null);
  const ctxRefs = useRef<(CanvasRenderingContext2D | null)[]>([null, null]);
  const lastDrawnT = useRef<number[]>([-1, -1]);

  // Respeta prefers-reduced-motion: congela los bucles autoplay (titileo,
  // bloom/halo pulsante, giro continuo del logo). El morph sigue atado al
  // scroll (lo controla el usuario), pero sin animaciones que se muevan solas.
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // ---- Destino del logo dockeado ----
  // Se mide del header real en vez de hardcodear coordenadas: el control que
  // ocupa la derecha cambia con el breakpoint (hamburguesa en mobile, boton
  // CTA desde 768px) y su alto/padding tambien, asi que cualquier constante
  // queda desfasada al tocar el header.
  const [dock, setDock] = useState({ left: 0, top: 47 });

  // Ancho al que se renderiza el arte del hero, en px. Lo define --hero-art-w
  // en globals.css (una sola medida para las seis capas, ver el bloque
  // .hero-media). Se lee de la caja ya maquetada del canvas B en vez de
  // reimplementar la formula aca: si el breakpoint cambia, esto la sigue sola.
  // offsetWidth y no getBoundingClientRect: da el ancho de layout, sin el
  // transform inline de framer-motion.
  const artW = useRef(0);

  useEffect(() => {
    const measure = () => {
      artW.current =
        canvasBRef.current?.offsetWidth ||
        Math.max(window.innerWidth, (window.innerHeight * 16) / 9);

      const header = document.querySelector<HTMLElement>(".header");
      const toggle = document.querySelector<HTMLElement>(".nav-toggle");
      const cta = document.querySelector<HTMLElement>(".nav-cta");
      // offsetParent null => display:none (la hamburguesa desde 768px)
      const onToggle = !!toggle && toggle.offsetParent !== null;
      const anchor = onToggle ? toggle : cta;
      if (!header || !anchor) return;

      // Restar el rect del header cancela su transform de entrada (motion
      // anima y: -100 -> 0): si midieramos en crudo durante esa animacion el
      // destino saldria 100px arriba.
      const a = anchor.getBoundingClientRect();
      const h = header.getBoundingClientRect();
      const half = CLUSTER_SIZE / 2;

      setDock({
        // mobile: a la izquierda de la hamburguesa, si no la tapa.
        // desktop: pegado a la derecha del CTA, como estaba.
        left: onToggle
          ? a.left - h.left - 10 - half
          : Math.min(a.right - h.left + half, window.innerWidth - 24 - half),
        top: a.top - h.top + a.height / 2,
      });
    };

    measure();
    // el header entra con una animacion de 0.8s: se remide al asentarse
    const settle = window.setTimeout(measure, 900);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // ---- Arranque del decoder de video ----
  // iOS Safari no pinta ni un frame de un <video> que nunca se reprodujo:
  // preload="auto" le baja los bytes, pero hasta que no hubo un play() el
  // elemento queda en negro y los seeks del scrub no rinden imagen. Un play()
  // mudo seguido de pause() alcanza para que decodifique y a partir de ahi el
  // scrub funciona. muted + playsInline habilita el play sin gesto del
  // usuario; si aun asi lo bloquea (modo de bajo consumo, ahorro de datos),
  // se reintenta con el primer toque.
  useEffect(() => {
    const videos = [videoARef.current, videoBRef.current];
    let primed = false;

    const prime = () => {
      if (primed) return;
      primed = true;
      Promise.all(
        videos.map((v) => {
          if (!v) return undefined;
          const started = v.play();
          if (started && typeof started.then === "function") {
            return started.then(() => v.pause());
          }
          v.pause();
          return undefined;
        })
      ).catch(() => {
        primed = false; // autoplay bloqueado: que lo reintente el primer toque
      });
    };

    prime();
    window.addEventListener("touchstart", prime, { passive: true });
    window.addEventListener("pointerdown", prime);
    return () => {
      window.removeEventListener("touchstart", prime);
      window.removeEventListener("pointerdown", prime);
    };
  }, []);

  // ---- Viewport vertical (celular) ----
  // Como motion value y no como estado de React: los transforms de framer
  // capturan su funcion una sola vez, asi que un boolean de useState no los
  // haria recalcular al montar ni al rotar. Suscribiendolos a este MV, el
  // cambio de orientacion propaga solo.
  const portraitMV = useMotionValue(0);
  useEffect(() => {
    const mq = window.matchMedia("(max-aspect-ratio: 1 / 1)");
    const update = () => portraitMV.set(mq.matches ? 1 : 0);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [portraitMV]);

  // Zoom de entrada en vertical. El arte del hero es 16:9: encuadrado a la
  // franja (--hero-art-w) el morph empalma perfecto, pero la primera
  // impresion al abrir la pagina quedaba chica — una banda flotando en el
  // medio, nada que ver con el desktop donde la estrella llena la pantalla.
  // Aca hero_1 arranca 1.55x mas grande (la estrella llena el alto del
  // telefono) y se repliega a la escala de la franja durante [0, 0.1] con
  // easeOut, justo ANTES de que el video A empiece a aparecer (0.10-0.15):
  // cuando hay crossfade las escalas ya coinciden y el morph no salta.
  // En landscape es 1 constante: desktop intacto.
  const introZoom = useTransform(
    [scrollYProgress, portraitMV],
    ([p, ptr]: number[]) => {
      if (!ptr) return 1;
      const t = clamp01(p / 0.1);
      const e = 1 - Math.pow(1 - t, 3); // easeOutCubic
      return 1.55 + (1 - 1.55) * e;
    }
  );

  // titilacion de hero_1: parpadeo organico — tres ondas superpuestas de
  // frecuencias distintas para que nunca se sienta mecanico
  const time = useTime();
  const twinkle = useTransform(time, (t) => {
    if (reduce) return 1; // brillo estable, sin titileo
    const s1 = Math.sin((t / 2600) * Math.PI * 2);
    const s2 = Math.sin((t / 1100) * Math.PI * 2 + 1.3);
    const s3 = Math.sin((t / 430) * Math.PI * 2 + 2.1);
    return 0.5 + 0.06 * s1 + 0.03 * s2 + 0.02 * s3;
  });
  const burstFilter = useMotionTemplate`brightness(${twinkle})`;

  // ---- hero_1: estallido titilando ----
  const burstOpacity = useTransform(scrollYProgress, [0, 0.1, 0.15], [1, 1, 0]);
  const burstScaleBase = useTransform(scrollYProgress, [0, 0.15], [1, 1.05]);
  // el zoom de entrada (vertical) multiplica a la respiracion de siempre;
  // en landscape introZoom es 1 y esto es identico a antes
  const burstScale = useTransform(
    [burstScaleBase, introZoom],
    ([s, z]: number[]) => s * z
  );

  // bloom: la misma imagen difuminada como halo de luz que respira; con
  // blend screen sobre negro solo las zonas brillantes (la estrella y sus
  // rayos) aportan luz, asi que el halo emana de la propia iluminacion.
  // Ademas de la opacidad, la escala pulsa: el halo se expande fisicamente
  // cuando brilla, como si la luz empujara el espacio.
  const bloomPulse = useTransform(time, (t) => {
    if (reduce) return 0.7; // halo estable, sin respiracion
    const s1 = Math.sin((t / 2600) * Math.PI * 2);
    const s2 = Math.sin((t / 900) * Math.PI * 2 + 0.7);
    return 0.55 + 0.35 * s1 + 0.2 * s2;
  });
  // Cola de luz ambiente, solo en vertical. En desktop los videos del morph
  // cubren la pantalla y el glow puede morir con hero_1; en el celular el
  // arte es una franja y, si la luz se apaga en p=0.15, la franja queda
  // flotando sobre negro plano el resto del morph — el "marco". La cola
  // mantiene el resplandor difuminado de fondo durante los videos y lo apaga
  // junto con el campo de estrellas, cuando arranca el vuelo del cluster.
  const glowTail = useTransform(
    [scrollYProgress, portraitMV],
    ([p, ptr]: number[]) => {
      if (!ptr) return 0;
      if (p < 0.15) return 0.6;
      if (p < 0.55) return 0.6 - 0.15 * ramp(p, 0.15, 0.55);
      return 0.45 * (1 - ramp(p, 0.55, 0.72));
    }
  );
  const bloomOpacity = useTransform(
    [burstOpacity, glowTail, bloomPulse],
    ([a, t, b]: number[]) => Math.max(a, t) * clamp01(b)
  );
  // sobre burstScaleBase, no burstScale: el glow ya tiene su propio encuadre
  // grande (--hero-glow-w) y sumarle el zoom de entrada lo convertia en un
  // lavado blanco que se comia el navy del fondo
  const bloomScale = useTransform(
    [burstScaleBase, bloomPulse],
    ([s, b]: number[]) => s * (1 + 0.05 * clamp01(b))
  );

  // halo exterior: capa muy difuminada y lenta, desfasada del bloom, que
  // envuelve toda la escena en un resplandor espacial que va y viene
  const haloPulse = useTransform(time, (t) => {
    if (reduce) return 0.6; // resplandor exterior estable
    const s1 = Math.sin((t / 3400) * Math.PI * 2 + 2.4);
    const s2 = Math.sin((t / 1500) * Math.PI * 2);
    return 0.45 + 0.3 * s1 + 0.18 * s2;
  });
  const haloOpacity = useTransform(
    [burstOpacity, glowTail, haloPulse],
    ([a, t, b]: number[]) => Math.max(a, t) * clamp01(b)
  );
  const haloScale = useTransform(
    [burstScaleBase, haloPulse],
    ([s, b]: number[]) => s * (1 + 0.12 * clamp01(b))
  );

  // ---- campo de estrellas: telon de fondo de la escena ----
  // Se apaga junto al vuelo de hero_3: cuando el cluster termina de dockear
  // en el header ya no queda espacio en pantalla y entra la LampSection.
  const starsOpacity = useTransform(scrollYProgress, [0.66, 0.85], [1, 0]);

  // Pasado el fade la capa es invisible: se congela el render en vez de
  // desmontarla, asi volver arriba no recrea el contexto WebGL.
  const [starsPaused, setStarsPaused] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setStarsPaused(p >= 0.85);
  });

  // Hueco en el centro: la estrella principal manda, el campo de fondo no se
  // le apoya encima. Con blend screen la luz se suma aunque las estrellas
  // esten debajo, asi que no alcanza con el orden del DOM — hay que recortar.
  // El centroide de la luz del estallido cae en 53%/48% del encuadre, no en
  // el centro exacto. El radio respira con haloPulse: el mismo latido del halo,
  // sin sumar una onda nueva, asi el vacio se expande cuando la luz brilla —
  // literalmente la luz empujando el espacio. Bajo prefers-reduced-motion
  // haloPulse ya es constante, asi que el hueco queda quieto solo.
  //
  // El radio va como fraccion de --hero-art-w, no en vmin: el hueco tiene que
  // seguir al tamano del estallido, y en vertical el estallido ya no ocupa la
  // pantalla entera. Con vmin el hueco quedaba enorme al lado del arte y el
  // campo de estrellas desaparecia de medio hero.
  const starsVoid = useTransform(haloPulse, (b) => 0.29 + 0.06 * clamp01(b));
  const starsMask = useMotionTemplate`radial-gradient(circle calc(var(--hero-art-w) * ${starsVoid}) at 53% 48%, transparent 0%, transparent 30%, rgba(0, 0, 0, 0.55) 60%, #000 100%)`;

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
  // timestamp del ultimo seek pedido por video: es el escape del guard de
  // `seeking` (ver scrub)
  const seekStamps = useRef(new WeakMap<HTMLVideoElement, number>());
  const prevPRef = useRef(0);
  useAnimationFrame((_, delta) => {
    const p = scrollYProgress.get();

    // Re-despertar los videos cada vez que ENTRAN a su ventana de
    // visibilidad, vengan de donde vengan. Mientras un video esta en
    // opacity 0, el navegador descarta su imagen — y iOS ademas suelta el
    // decoder: los seeks "resuelven" pero no pintan nada. Se veia en dos
    // recorridos:
    //  - reversa: bajar del todo y volver a subir al morph;
    //  - segunda pasada: bajar, subir hasta arriba y volver a bajar — el
    //    morph entero quedaba invisible (solo el glow de fondo), verificado
    //    en una grabacion de pantalla de iPhone real.
    // Dos mecanismos lo reviven al cruzar hacia adentro de la ventana:
    //  1. play() mudo + pause(): re-engancha el decoder.
    //  2. Un nudge de seek al MISMO frame (-0.0001s): si el target del
    //     scrub coincide con el currentTime que ya tenia, el umbral de 0.02
    //     no dispara ningun seek y nada redibuja la imagen (verificado en
    //     WebKit); el nudge fuerza el redecode y repintado.
    // Las ventanas van un poco mas anchas que las de opacidad (0.10-0.42 y
    // 0.38-0.66) para que el despertar llegue ANTES del primer frame
    // visible.
    const prevP = prevPRef.current;
    prevPRef.current = p;
    const wake = (video: HTMLVideoElement | null, lo: number, hi: number) => {
      const inside = p >= lo && p < hi;
      const wasInside = prevP >= lo && prevP < hi;
      if (!inside || wasInside || !video) return;
      const started = video.play();
      if (started && typeof started.then === "function") {
        started
          .then(() => {
            video.pause();
            video.currentTime = Math.max(0, video.currentTime - 0.0001);
          })
          .catch(() => {});
      }
    };
    wake(videoARef.current, 0.06, 0.44);
    wake(videoBRef.current, 0.34, 0.68);

    // Scrub de video: solo durante los morphs (p < 0.66). Pasado ese punto
    // ambos videos tienen opacity 0, asi que seguir buscando frames era
    // trabajo puro desperdiciado en cada frame.
    //
    // HIBRIDO reproducir/seekear. El scrub por seeks serializados rendia
    // pocos frames por segundo en iOS (cada seek espera su pipeline entero:
    // el morph se veia como un slideshow congelado — verificado en grabacion
    // de iPhone real). En cambio REPRODUCIR es el camino feliz del decoder
    // por hardware. Asi que:
    //  - hacia adelante con el target cerca: play() con playbackRate
    //    acompasado a la distancia — el video persigue al scroll suave;
    //  - hacia atras o salto grande: seek serializado (con escape de 300ms
    //    para seeks que iOS nunca resuelve);
    //  - target alcanzado: pause en el frame exacto.
    // Los videos son all-intra: reproducir a 4x tambien es fluido (Safari
    // pasa a "solo keyframes" en rates altos y aca TODO frame es keyframe).
    if (p < 0.66) {
      const scrub = (
        video: HTMLVideoElement | null,
        from: number,
        to: number
      ) => {
        if (!video || !video.duration) return; // metadata sin cargar
        const target = ramp(p, from, to) * (video.duration - 0.05);
        const diff = target - video.currentTime;

        // Tolerancia asimetrica: la reproduccion puede pasarse ~1 frame del
        // target antes de que el proximo tick la pause; sin el margen
        // negativo eso disparaba un micro-seek hacia atras (jitter visible).
        // Un retroceso real del scroll acumula diff negativo enseguida y si
        // supera el margen, seekea.
        if (diff <= 0.03 && diff > -0.15) {
          if (!video.paused) video.pause();
          return;
        }

        if (diff > 0 && diff < 1.2) {
          // adelante y cerca: reproducir persiguiendo al scroll.
          // rate = alcanzar el target en ~180ms, acotado a [0.5, 4].
          const rate = Math.min(4, Math.max(0.5, diff / 0.18));
          if (Math.abs(video.playbackRate - rate) > 0.15) {
            video.playbackRate = rate;
          }
          if (video.paused) video.play().catch(() => {});
          return;
        }

        // atras o salto grande: seek serializado. seeking es true mientras
        // hay un seek en vuelo — pisarlo lo aborta en iOS. El timeout de
        // 300ms es el escape para seeks que nunca resuelven (sin el, el
        // scrub quedaba bloqueado para siempre al volver en reversa).
        // currentTime y NO fastSeek: WebKit no repinta el frame de un video
        // pausado despues de fastSeek.
        if (!video.paused) video.pause();
        const now = performance.now();
        if (video.seeking && now - (seekStamps.current.get(video) ?? 0) < 300)
          return;
        seekStamps.current.set(video, now);
        video.currentTime = target;
      };
      // el scrub de A termina antes del crossfade (0.38-0.42) para que ambos
      // videos muestren el frame de hero_2 durante la transicion
      scrub(videoARef.current, 0.12, 0.36);
      scrub(videoBRef.current, 0.44, 0.63);
    } else {
      // fuera del morph ningun video puede quedar reproduciendo solo
      for (const v of [videoARef.current, videoBRef.current]) {
        if (v && !v.paused) v.pause();
      }
    }

    // Copia el frame vigente de cada video a su canvas visible, solo
    // mientras la capa esta en su ventana (fuera de ella opacity es 0 y
    // dibujar seria trabajo desperdiciado) y solo si el frame AVANZO:
    // reproduciendo, currentTime cambia en cada tick y se dibuja; quieto en
    // un stop del scroll, no se re-dibuja lo mismo 60 veces por segundo (en
    // iOS el drawImage de video no es gratis).
    const draw = (
      video: HTMLVideoElement | null,
      canvas: HTMLCanvasElement | null,
      slot: number
    ) => {
      if (!video || !canvas || video.readyState < 2) return;
      if (lastDrawnT.current[slot] === video.currentTime) return;
      let ctx = ctxRefs.current[slot];
      if (!ctx) {
        ctx = canvas.getContext("2d");
        ctxRefs.current[slot] = ctx;
      }
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      lastDrawnT.current[slot] = video.currentTime;
    };
    if (p >= 0.06 && p < 0.46) draw(videoARef.current, canvasARef.current, 0);
    if (p >= 0.34 && p < 0.68) draw(videoBRef.current, canvasBRef.current, 1);

    const f = ramp(p, 0.66, 0.8);

    // Vuelo de hero_3: de pantalla completa al lado del boton. Se recalcula
    // desde p>=0.6 (antes el cluster es invisible). Sin limite superior: para
    // p>=0.8 el ease clampea a 1 y devuelve siempre la posicion final
    // dockeada, asi un flick rapido que saltee la ventana no deja el logo
    // clavado a mitad de vuelo. El costo es trivial (unas ops + sets).
    if (p >= 0.6) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Escala inicial: hero_3 tiene que empalmar con el frame final del video
      // B, asi que arranca del mismo encuadre (--hero-art-w) y no de una
      // medida propia. Es una caja cuadrada de CLUSTER_SIZE con object-fit:
      // cover, asi que el arte que rinde mide lado * CLUSTER_ASPECT; se
      // despeja la escala que iguala ese ancho al del encuadre, con el mismo
      // +10% de sobredimension que ya tenia en desktop.
      const startScale =
        (artW.current * 1.1) / (CLUSTER_SIZE * CLUSTER_ASPECT);
      // En vertical las capas .hero-media van corridas para centrar el
      // nucleo de la estrella (margins -0.53/-0.48 en globals.css): el vuelo
      // arranca desde ese mismo punto para empalmar con el frame final del
      // video B sin saltar.
      const portrait = portraitMV.get() === 1;
      const bx = portrait ? -0.03 * artW.current : 0;
      const by = portrait ? 0.02 * (artW.current / (16 / 9)) : 0;
      clusterScale.set(startScale + (1 - startScale) * shrinkEase(f));
      clusterDX.set((w / 2 + bx - dock.left) * (1 - flyEase(f)));
      clusterDY.set((h / 2 + by - dock.top) * (1 - flyEase(f)));
    }

    // Giro continuo del logo dockeado (4 s/vuelta) + whoosh en pleno vuelo.
    // Es una animacion autoplay: se omite entera bajo prefers-reduced-motion.
    if (!reduce) {
      const degPerSec =
        90 * ramp(p, 0.62, 0.66) + 300 * Math.sin(Math.PI * f);
      clusterRotate.set(
        (clusterRotate.get() + (degPerSec * delta) / 1000) % 360
      );
    }
  });

  // titulo
  const titleOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.12], [0, -64]);
  const titleScale = useTransform(scrollYProgress, [0, 0.12], [1, 0.94]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  // La caja (position/inset/tamano/object-fit) vive en .hero-media
  // (globals.css) porque depende del aspect-ratio del viewport y un estilo
  // inline le ganaria al media query. Aca solo queda lo que no varia.
  const fullscreenMedia = {
    zIndex: 0,
    pointerEvents: "none" as const,
    mixBlendMode: "screen" as const,
  };

  return (
    <>
      {/* ---- campo de estrellas: primera capa del stack ----
           mismo z-index que el resto de las capas del hero; va primera en el
           DOM, asi el estallido y los videos pintan encima. Blend screen
           sobre el navy del body, igual que las demas. La mascara le abre el
           hueco donde vive la estrella principal. */}
      <motion.div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          mixBlendMode: "screen",
          opacity: starsOpacity,
          maskImage: starsMask,
          WebkitMaskImage: starsMask,
        }}
      >
        <Galaxy
          // Canvas opaco, no transparente. El modo transparente emite
          // vec4(col / lum, lum): color normalizado por su propia luminancia,
          // y deja que el compositor lo vuelva a multiplicar por el alfa. Con
          // eso el 63% del canvas queda guardado como RGB casi a fondo (>200)
          // detras de un alfa de 0-2/255 — invisible solo mientras el
          // compositor respete ese alfa con precision. Safari en iOS no lo
          // hace sobre un canvas WebGL con mix-blend-mode, pinta el color
          // guardado a fondo y el dither del shader sale como ruido de sal y
          // pimienta tapando todo el hero.
          //
          // Opaco no depende de nada de eso: el shader emite vec4(col, 1.0) y
          // el mix-blend-mode: screen del wrapper hace el trabajo aditivo.
          // screen(fondo, 0) = fondo, asi que el negro del canvas desaparece
          // igual que antes, sin alfa de por medio.
          transparent={false}
          mouseInteraction={false}
          mouseRepulsion={false}
          disableAnimation={!!reduce}
          paused={starsPaused}
          density={1.15}
          glowIntensity={0.95}
          twinkleIntensity={0.45}
          saturation={0.55}
          starSpeed={0.3}
          speed={0.8}
          rotationSpeed={0.03}
        />
      </motion.div>

      {/* ---- hero_1: estallido ---- */}
      <MotionImage
        aria-hidden
        src="/hero_1.png"
        alt=""
        width={4096}
        height={2305}
        quality={100}
        // En vertical el arte NO se renderiza a 100vw: la caja es 180vw
        // (--hero-art-w) y el zoom de entrada la lleva a ~280vw. Con
        // sizes="100vw" el navegador pedia una imagen 2.8x mas chica que lo
        // que pintaba y la estrella salia borrosa en el celular.
        sizes="(max-aspect-ratio: 1 / 1) 280vw, 100vw"
        priority
        className="hero-media"
        style={{
          ...fullscreenMedia,
          scale: burstScale,
          opacity: burstOpacity,
          filter: burstFilter,
        }}
      />

      {/* ---- bloom de hero_1: halo difuminado que respira sobre la luz
           de la estrella (blend screen: el negro no aporta nada).
           Dos gemelas por capa: la "live" usa filter: blur() del navegador
           (solo landscape) y la "baked" un JPG con el desenfoque ya horneado
           (solo portrait) — blur en vivo a pantalla completa saturaba el GPU
           del telefono y el video del morph no llegaba a pintar frames.
           Comparten los mismos motion values, asi pulsan identico. ---- */}
      <MotionImage
        aria-hidden
        src="/hero_1.png"
        alt=""
        width={4096}
        height={2305}
        quality={45}
        sizes="55vw"
        loading="eager"
        className="hero-media hero-media-glow hero-glow-live"
        style={{
          ...fullscreenMedia,
          scale: bloomScale,
          opacity: bloomOpacity,
          filter: "blur(28px) saturate(1.4) brightness(0.6)",
        }}
      />
      <motion.img
        aria-hidden
        src="/hero_1_bloom.jpg"
        alt=""
        loading="eager"
        className="hero-media hero-media-glow hero-glow-baked"
        style={{
          ...fullscreenMedia,
          scale: bloomScale,
          opacity: bloomOpacity,
        }}
      />

      {/* ---- halo exterior de hero_1: resplandor espacial amplio ---- */}
      <MotionImage
        aria-hidden
        src="/hero_1.png"
        alt=""
        width={4096}
        height={2305}
        quality={35}
        sizes="40vw"
        loading="eager"
        className="hero-media hero-media-glow hero-glow-live"
        style={{
          ...fullscreenMedia,
          scale: haloScale,
          opacity: haloOpacity,
          filter: "blur(80px) saturate(1.6) brightness(0.68)",
        }}
      />
      <motion.img
        aria-hidden
        src="/hero_1_halo.jpg"
        alt=""
        loading="eager"
        className="hero-media hero-media-glow hero-glow-baked"
        style={{
          ...fullscreenMedia,
          scale: haloScale,
          opacity: haloOpacity,
        }}
      />

      {/* ---- videos del morph: fuentes de frames, NUNCA visibles ----
           2x2px y opacity ~0 (no display:none: iOS no decodifica un video
           display:none). Los canvas de abajo son las capas visibles; ver el
           comentario de canvasARef por que. */}
      <video
        aria-hidden
        ref={videoARef}
        src="/hero_morph_1.mp4"
        muted
        playsInline
        preload="auto"
        style={{
          position: "fixed",
          left: 0,
          bottom: 0,
          width: 2,
          height: 2,
          opacity: 0.01,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <video
        aria-hidden
        ref={videoBRef}
        src="/hero_morph_2.mp4"
        muted
        playsInline
        preload="auto"
        style={{
          position: "fixed",
          left: 0,
          bottom: 0,
          width: 2,
          height: 2,
          opacity: 0.01,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ---- canvas A: hero_1 se desarma en estrellas -> hero_2 ---- */}
      <motion.canvas
        aria-hidden
        ref={canvasARef}
        width={1280}
        height={720}
        className="hero-media"
        style={{ ...fullscreenMedia, opacity: videoAOpacity }}
      />

      {/* ---- canvas B: hero_2 se reagrupa en el cluster (hero_3) ---- */}
      <motion.canvas
        aria-hidden
        ref={canvasBRef}
        width={1280}
        height={720}
        className="hero-media"
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
        quality={90}
        sizes="110vmin"
        style={{
          position: "fixed",
          // destino medido del header (ver el efecto de `dock` arriba):
          // centro vertical del control y, en mobile, a su izquierda para no
          // tapar la hamburguesa
          top: `${dock.top}px`,
          left: `${dock.left}px`,
          width: "48px",
          height: "48px",
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
            <h1 className="wordmark">
              <Image
                className="wordmark-img"
                src="/vibra-logo-dark.png"
                alt="Vibra"
                width={1975}
                height={954}
                priority
                quality={100}
              />
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
