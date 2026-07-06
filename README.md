# Vibra — Landing

Landing de una sola página para Vibra (agencia de IA). Next.js (App Router) + Framer Motion.

## Correr en local

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Hero (scroll-driven)

El hero vive en `components/VibraHero.tsx`:

1. **hero_1** (el estallido) llena la pantalla y **titila como estrella**.
2. El nombre `vibra` + `Agencia de IA` van encima; el tagline **pulsa en sync** con el titileo.
3. Al hacer scroll, la sección se **fija (pinned)**: hero_1 crece y se desvanece mientras **hero_2** (las estrellas) aparece y empieza a **girar**.
4. hero_2 se queda como **marca de agua giratoria y semitransparente de toda la página**, detrás del contenido.

### Reemplazar las imágenes

En `public/` hay **placeholders** generados. Reemplazalos por tus imágenes reales
con **el mismo nombre**:

- `public/hero_1.png` → tu estallido de luz
- `public/hero_2.png` → tus 5 estrellas

**Requisito:** ambas deben tener **fondo negro puro** (`#000`). Se integran con
`mix-blend-mode: screen`, que elimina el negro y funde solo la luz sobre el navy
de la marca. Tus dos imágenes ya cumplen esto.

### Perillas para ajustar (en `VibraHero.tsx`)

- `burstScale` / `burstOpacity` → cuánto crece y cuándo se desvanece hero_1.
- `clusterOpacity` `[..., 0.14]` → opacidad final de la marca de agua (subí/bajá el último valor).
- `clusterScale` `[..., 0.72]` → tamaño final de la marca de agua.
- `transition.rotate.duration: 44` → velocidad de giro (segundos por vuelta).
- Sección `height: "260vh"` → cuánto scroll dura la transición pinned.
- Animaciones (`starTwinkle`, `taglinePulse`) en `app/globals.css` → velocidad/intensidad del titileo.

## Marca

- Fondo `#101117` · texto `#FAFAFB` · acento cyan `#29D3EE` (el punto de la `i`).
- Tipografías: Geist + Geist Mono (Google Fonts).
- Sin coral en ningún lado.
- Assets del logo en `logo/` (versiones navy 4K y PNG transparente).
