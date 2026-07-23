"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Color, Triangle } from "ogl";

/**
 * Campo de estrellas WebGL — port a TS de "Galaxy" (React Bits, variante
 * JS-CSS). El proyecto no usa shadcn/Tailwind, asi que en vez de correr
 * `npx shadcn add @react-bits/Galaxy-JS-CSS` se vendorea el componente aca.
 *
 * Se conserva la estructura del registry (capas de profundidad, celdas con
 * hash, deriva y rotacion) pero el dibujo de la estrella esta reescrito: el
 * original renderizaba manchas 1/d con cruces de `1 - abs(x*y*1000)` que
 * salian escalonadas, tamano uniforme y una estrella por celda — leia como
 * suciedad en rejilla, no como cielo. Ahora:
 *
 *  - nucleo gaussiano de tamano constante en pixeles + halo lorentziano;
 *  - magnitudes con ley de potencia (muchas debiles, pocas brillantes);
 *  - ~55% de celdas ocupadas con jitter completo -> huecos y grumos;
 *  - puntas de difraccion suaves solo en las mas brillantes;
 *  - color por temperatura estelar (azul-blanco -> ambar), sin atan/hsv;
 *  - centelleo con frecuencia propia por estrella, solo sobre el nucleo;
 *  - salida aditiva real (color normalizado + alfa = luminancia) y dither.
 *
 * En el hero se usa como telon de fondo (mouseInteraction=false): el
 * protagonismo es del morph atado al scroll, las estrellas solo respiran.
 */

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform bool uTransparent;

varying vec2 vUv;

#define NUM_LAYER 4.0
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}

// escala de la capa que se esta dibujando: 1 unidad de celda = 1/gScale
// alturas de pantalla. Global porque cambia por capa, no por frame.
float gScale = 1.0;
// multiplicador de radio de la capa (unico rastro de parallax en el tamano)
float gRadiusMul = 1.0;

/**
 * Perfil de una estrella. p va en unidades de celda; radius y la distancia
 * se convierten a alturas de pantalla para que el punto mida siempre lo mismo
 * en pixeles sin importar la capa de profundidad (una estrella es una fuente
 * puntual: la parallax cambia densidad y brillo, no tamano).
 *
 *  - nucleo: gaussiana apretada -> punto nitido, no la mancha del 1/d.
 *  - halo: lorentziana ancha y barata, cola suave que se apaga sola.
 *  - puntas de difraccion: dos brazos lorentzianos cruzados (largo en un eje,
 *    angosto en el otro) en vez del 1 - abs(x*y*1000) que salia escalonado.
 */
float Star(vec2 p, float radius, float haloAmt, float flare, float twinkle) {
  float d = length(p) / gScale;
  float x = d / radius;

  float core = exp(-x * x) * twinkle;
  // el halo se paga con brillo: las debiles quedan como puntos limpios en vez
  // de manchitas difusas, que era la mitad de la "suciedad" del original
  float halo = haloAmt / (1.0 + x * x * 0.06);
  float m = core + halo;

  if (flare > 0.0) {
    vec2 s = abs(p) / (gScale * radius);
    // brazo horizontal y vertical
    m += flare * (1.0 / (1.0 + s.x * s.x * 0.04)) * (1.0 / (1.0 + s.y * s.y * 8.0));
    m += flare * (1.0 / (1.0 + s.y * s.y * 0.04)) * (1.0 / (1.0 + s.x * s.x * 8.0));
    // par a 45 grados, mas corto y tenue
    vec2 q = abs(p * MAT45) / (gScale * radius);
    m += flare * 0.22 * (1.0 / (1.0 + q.x * q.x * 0.16)) * (1.0 / (1.0 + q.y * q.y * 10.0));
    m += flare * 0.22 * (1.0 / (1.0 + q.y * q.y * 0.16)) * (1.0 / (1.0 + q.x * q.x * 10.0));
  }

  // corta antes de d=1 (celda) para que no queden costuras entre celdas
  return m * smoothstep(1.0, 0.25, length(p));
}

/**
 * Rotacion de tono barata (matriz YIQ) — reemplaza al par atan()+hsv2rgb que
 * el shader original evaluaba por celda. Se aplica una sola vez sobre el color
 * ya sumado: al ser una matriz es lineal, asi que rotar cada estrella y sumar
 * da identico a sumar y rotar, pero cuesta 36 veces menos.
 */
vec3 hueRotate(vec3 c, float deg) {
  float a = radians(deg);
  float cs = cos(a);
  float sn = sin(a);
  return max(mat3(
    0.299 + 0.701 * cs + 0.168 * sn, 0.587 - 0.587 * cs + 0.330 * sn, 0.114 - 0.114 * cs - 0.497 * sn,
    0.299 - 0.299 * cs - 0.328 * sn, 0.587 + 0.413 * cs + 0.035 * sn, 0.114 - 0.114 * cs + 0.292 * sn,
    0.299 - 0.300 * cs + 1.250 * sn, 0.587 - 0.588 * cs - 1.050 * sn, 0.114 + 0.886 * cs - 0.203 * sn
  ) * c, 0.0);
}

vec3 StarLayer(vec2 uv) {
  vec3 col = vec3(0.0);

  vec2 gv = fract(uv) - 0.5;
  vec2 id = floor(uv);

  // un pixel expresado en alturas de pantalla: piso de radio para que ninguna
  // estrella caiga por debajo del pixel y titile por aliasing
  float pxRadius = 1.15 / uResolution.y;

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + offset;

      float seed = Hash21(si);
      float alt = Hash21(si + 41.7);

      // ~55% de celdas ocupadas: rompe la rejilla y deja huecos y grumos
      float present = step(fract(seed * 7.31), 0.55);

      // magnitud con ley de potencia: muchisimas debiles, muy pocas brillantes.
      // La distribucion uniforme original llenaba todo de estrellas medias, que
      // es lo que leia como ruido sucio.
      float mag = fract(seed * 137.0);
      mag = mag * mag * mag;

      float radius = max(mix(0.0013, 0.0032, mag) * gRadiusMul, pxRadius);
      float bright = mix(0.10, 1.0, mag) * present;
      float haloAmt = mix(0.006, 0.06, mag);
      float flare = smoothstep(0.74, 1.0, mag) * 0.16;

      // centelleo con frecuencia propia por estrella (scintillation, no un
      // parpadeo al unisono) y solo sobre el nucleo: el halo queda estable
      float tw = sin(uTime * uSpeed * (0.7 + alt * 2.1) + seed * 43.0) * 0.5 + 0.5;
      tw = mix(1.0, 0.5 + 0.8 * tw, uTwinkleIntensity);

      // posicion: jitter fijo en toda la celda + una deriva minima que respira
      vec2 jitter = vec2(fract(alt * 191.0), fract(alt * 331.0)) - 0.5;
      vec2 drift = vec2(
        tris(seed * 34.0 + uTime * uSpeed / 14.0),
        tris(alt * 38.0 + uTime * uSpeed / 26.0)
      ) - 0.5;
      vec2 pos = jitter * 0.9 + drift * 0.1;

      // color por temperatura estelar: mayoria blanco-azuladas, unas pocas
      // calidas. uSaturation interpola de blanco puro a tinte pleno.
      float temp = fract(alt * 53.0);
      vec3 tint = temp < 0.62
        ? mix(vec3(0.62, 0.79, 1.0), vec3(1.0, 0.99, 0.97), temp / 0.62)
        : mix(vec3(1.0, 0.99, 0.97), vec3(1.0, 0.83, 0.64), (temp - 0.62) / 0.38);
      tint = mix(vec3(1.0), tint, uSaturation);

      col += Star(gv - offset - pos, radius, haloAmt, flare, tw) * bright * tint;
    }
  }

  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;

  vec2 mouseNorm = uMouse - vec2(0.5);

  if (uAutoCenterRepulsion > 0.0) {
    vec2 centerUV = vec2(0.0, 0.0);
    float centerDist = length(uv - centerUV);
    vec2 repulsion = normalize(uv - centerUV) * (uAutoCenterRepulsion / (centerDist + 0.1));
    uv += repulsion * 0.05;
  } else if (uMouseRepulsion) {
    vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
    float mouseDist = length(uv - mousePosUV);
    vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));
    uv += repulsion * 0.05 * uMouseActiveFactor;
  } else {
    vec2 mouseOffset = mouseNorm * 0.1 * uMouseActiveFactor;
    uv += mouseOffset;
  }

  float autoRotAngle = uTime * uRotationSpeed;
  mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
  uv = autoRot * uv;

  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;

  vec3 col = vec3(0.0);

  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed * uSpeed);
    gScale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    // las capas cercanas rinden estrellas apenas mas gruesas: el tamano ya no
    // escala con la profundidad, asi que este es el unico resto de parallax
    gRadiusMul = mix(0.85, 1.5, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += StarLayer(uv * gScale + i * 453.32) * fade;
  }

  col = hueRotate(col, uHueShift) * uGlowIntensity;

  // dither: sin esto los halos tenues bandean sobre el navy con blend screen
  col += (Hash21(gl_FragCoord.xy + fract(uTime)) - 0.5) / 255.0;
  col = max(col, vec3(0.0));

  if (uTransparent) {
    // El canvas se compone con mix-blend-mode: screen sobre el fondo. Se emite
    // color normalizado + alfa = luminancia para que el navegador, al
    // premultiplicar (premultipliedAlpha: false), reconstruya col exacto:
    // brillo aditivo real, sin el umbral duro que recortaba las estrellas
    // debiles del shader original.
    float lum = clamp(max(max(col.r, col.g), col.b), 0.0, 1.0);
    gl_FragColor = vec4(col / max(lum, 1e-4), lum);
  } else {
    gl_FragColor = vec4(col, 1.0);
  }
}
`;

type GalaxyProps = {
  focal?: [number, number];
  rotation?: [number, number];
  starSpeed?: number;
  density?: number;
  /** Grados de rotacion de tono sobre el tinte por temperatura. */
  hueShift?: number;
  disableAnimation?: boolean;
  speed?: number;
  mouseInteraction?: boolean;
  glowIntensity?: number;
  /** 0 = estrellas blancas, 1 = tinte de temperatura pleno. */
  saturation?: number;
  mouseRepulsion?: boolean;
  repulsionStrength?: number;
  twinkleIntensity?: number;
  rotationSpeed?: number;
  autoCenterRepulsion?: number;
  transparent?: boolean;
  /**
   * Congela el render sin desmontar el contexto WebGL. Pensado para cuando la
   * capa queda invisible (opacity 0) y seguir dibujando seria trabajo puro
   * desperdiciado, pero desmontar costaria recrear el contexto al volver.
   */
  paused?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export default function Galaxy({
  focal = [0.5, 0.5],
  rotation = [1.0, 0.0],
  starSpeed = 0.5,
  density = 1,
  hueShift = 0,
  disableAnimation = false,
  speed = 1.0,
  mouseInteraction = true,
  glowIntensity = 1.0,
  saturation = 0.5,
  mouseRepulsion = true,
  repulsionStrength = 2,
  twinkleIntensity = 0.5,
  rotationSpeed = 0.1,
  autoCenterRepulsion = 0,
  transparent = true,
  paused = false,
  ...rest
}: GalaxyProps) {
  const ctnDom = useRef<HTMLDivElement>(null);
  const targetMousePos = useRef({ x: 0.5, y: 0.5 });
  const smoothMousePos = useRef({ x: 0.5, y: 0.5 });
  const targetMouseActive = useRef(0.0);
  const smoothMouseActive = useRef(0.0);

  // via ref: si `paused` entrara en las deps del efecto, cada pausa recrearia
  // el contexto WebGL entero en vez de saltear un render.
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  // focal/rotation son literales: sin serializar, cada render los ve como
  // arrays nuevos y recrearia el contexto WebGL entero.
  const focalKey = focal.join(",");
  const rotationKey = rotation.join(",");

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    const renderer = new Renderer({
      alpha: transparent,
      premultipliedAlpha: false,
    });
    const gl = renderer.gl;

    if (transparent) {
      // Sin blending: es un unico triangulo a pantalla completa sobre un buffer
      // limpio, no hay nada contra que mezclar. Ademas el shader emite color
      // normalizado + alfa = luminancia, y un SRC_ALPHA aca lo multiplicaria
      // una segunda vez (los halos se irian a negro).
      gl.disable(gl.BLEND);
      gl.clearColor(0, 0, 0, 0);
    } else {
      gl.clearColor(0, 0, 0, 1);
    }

    function resize() {
      renderer.setSize(ctn!.offsetWidth, ctn!.offsetHeight);
      program.uniforms.uResolution.value = new Color(
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width / gl.canvas.height
      );
    }

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: new Color(
            gl.canvas.width,
            gl.canvas.height,
            gl.canvas.width / gl.canvas.height
          ),
        },
        uFocal: { value: new Float32Array(focal) },
        uRotation: { value: new Float32Array(rotation) },
        uStarSpeed: { value: starSpeed },
        uDensity: { value: density },
        uHueShift: { value: hueShift },
        uSpeed: { value: speed },
        uMouse: {
          value: new Float32Array([
            smoothMousePos.current.x,
            smoothMousePos.current.y,
          ]),
        },
        uGlowIntensity: { value: glowIntensity },
        uSaturation: { value: saturation },
        uMouseRepulsion: { value: mouseRepulsion },
        uTwinkleIntensity: { value: twinkleIntensity },
        uRotationSpeed: { value: rotationSpeed },
        uRepulsionStrength: { value: repulsionStrength },
        uMouseActiveFactor: { value: 0.0 },
        uAutoCenterRepulsion: { value: autoCenterRepulsion },
        uTransparent: { value: transparent },
      },
    });

    resize();
    window.addEventListener("resize", resize, false);

    const mesh = new Mesh(gl, { geometry, program });
    let animateId: number;

    function update(t: number) {
      animateId = requestAnimationFrame(update);
      if (pausedRef.current) return;
      if (!disableAnimation) {
        program.uniforms.uTime.value = t * 0.001;
        program.uniforms.uStarSpeed.value = (t * 0.001 * starSpeed) / 10.0;
      }

      const lerpFactor = 0.05;
      smoothMousePos.current.x +=
        (targetMousePos.current.x - smoothMousePos.current.x) * lerpFactor;
      smoothMousePos.current.y +=
        (targetMousePos.current.y - smoothMousePos.current.y) * lerpFactor;
      smoothMouseActive.current +=
        (targetMouseActive.current - smoothMouseActive.current) * lerpFactor;

      program.uniforms.uMouse.value[0] = smoothMousePos.current.x;
      program.uniforms.uMouse.value[1] = smoothMousePos.current.y;
      program.uniforms.uMouseActiveFactor.value = smoothMouseActive.current;

      renderer.render({ scene: mesh });
    }
    animateId = requestAnimationFrame(update);
    ctn.appendChild(gl.canvas);

    function handleMouseMove(e: MouseEvent) {
      const rect = ctn!.getBoundingClientRect();
      targetMousePos.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: 1.0 - (e.clientY - rect.top) / rect.height,
      };
      targetMouseActive.current = 1.0;
    }

    function handleMouseLeave() {
      targetMouseActive.current = 0.0;
    }

    if (mouseInteraction) {
      ctn.addEventListener("mousemove", handleMouseMove);
      ctn.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener("resize", resize);
      if (mouseInteraction) {
        ctn.removeEventListener("mousemove", handleMouseMove);
        ctn.removeEventListener("mouseleave", handleMouseLeave);
      }
      gl.canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    focalKey,
    rotationKey,
    starSpeed,
    density,
    hueShift,
    disableAnimation,
    speed,
    mouseInteraction,
    glowIntensity,
    saturation,
    mouseRepulsion,
    twinkleIntensity,
    rotationSpeed,
    repulsionStrength,
    autoCenterRepulsion,
    transparent,
  ]);

  return <div ref={ctnDom} className="galaxy-container" {...rest} />;
}
