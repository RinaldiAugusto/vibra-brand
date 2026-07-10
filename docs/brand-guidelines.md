# Vibra — Guía de marca

> Vibra es una agencia de IA. Construimos sistemas de IA que se destacan:
> **claros, seguros y hechos para producción.** El sistema visual es un
> dark mode profundo con un único acento cyan luminoso ("glow").

Fuente de verdad de los tokens: [`app/globals.css`](../app/globals.css) (`:root`).
Todo componente debe consumir tokens vía `var(--…)`, nunca hex/rgba crudo.

---

## 1. Color

### Primitives (valores crudos)

| Token | Valor | Uso |
|-------|-------|-----|
| `--navy-900` | `#101117` | Fondo base de toda la app |
| `--navy-800` | `#0b0c12` | Superficie elevada (frame de mockups) |
| `--white-050` | `#fafafb` | Texto principal |
| `--gray-400` | `#adaeb4` | Texto atenuado / secundario |
| `--cyan-400` | `#29d3ee` | Acento de marca (único color saturado) |

### Tripletas RGB (para opacidades)

Permiten componer transparencias sin duplicar el color:
`rgba(var(--accent-rgb), 0.4)`.

| Token | Valor |
|-------|-------|
| `--accent-rgb` | `41, 211, 238` |
| `--foreground-rgb` | `255, 255, 255` |
| `--background-rgb` | `16, 17, 23` |
| `--shadow-rgb` | `0, 0, 0` |

### Semantic (alias por propósito)

| Token | Deriva de | Propósito |
|-------|-----------|-----------|
| `--background` | `--navy-900` | Fondo de página |
| `--background-elevated` | `--navy-800` | Superficies elevadas |
| `--foreground` | `--white-050` | Texto principal |
| `--muted` | `--gray-400` | Texto atenuado |
| `--accent` | `--cyan-400` | Acento sólido (botones, líneas, números) |
| `--surface-1` | blanco 3% | Fondo de card por defecto |
| `--surface-2` | blanco 5% | Fondo de card / hover |
| `--border-faint` | blanco 6% | Bordes muy sutiles |
| `--border-subtle` | blanco 10% | Borde de card por defecto |
| `--border-accent-soft` | cyan 20% | Borde de card acentuada suave |
| `--border-accent` | cyan 40% | Borde de card destacada |
| `--accent-tint-soft` | cyan 5% | Relleno de gradiente muy leve |
| `--accent-tint` | cyan 8% | Relleno de gradiente de card destacada |
| `--accent-glow` | cyan 40% | Glow / sombra de acento (reposo) |
| `--accent-glow-strong` | cyan 70% | Glow de acento (hover / activo) |

### Reglas de color

- **Un solo acento.** El cyan es el único color saturado. No introducir
  segundos acentos (verde, naranja) sin actualizar esta guía.
- El acento se reserva para: CTAs, líneas de luz, números de proceso,
  bordes de elementos destacados y glows. No para texto de párrafo largo.
- Jerarquía de superficies: `--background` → card `--surface-1` +
  `--border-subtle` → card destacada gradiente `--accent-tint` +
  `--border-accent`.

---

## 2. Tipografía

Cargadas vía `next/font/google` en [`app/layout.tsx`](../app/layout.tsx).

| Rol | Familia | Token | Notas |
|-----|---------|-------|-------|
| Títulos (h1–h6) | **Plus Jakarta Sans** | `--font-heading` | Sustituto de Google Sans |
| Body / general | **Manrope** | `--font-body` | Default del `<body>` |

### Escala y tratamiento

| Elemento | Tamaño | Peso | Tracking |
|----------|--------|------|----------|
| Título de sección (`h2`, `.lamp-title`) | `clamp(2rem, 5vw, 3.25rem)` | 600 | `-0.03em` |
| Título CTA | `clamp(2rem, 4vw, 3rem)` | 700 | `-0.03em` |
| Tagline / eyebrow | `0.72rem` | 500 | `0.28em`, UPPERCASE |
| Body | `1.125rem` | 400 | line-height `1.7` |

- Los títulos usan tracking negativo (`-0.03em`) para densidad premium.
- Los eyebrows/taglines usan tracking amplio (`0.28em`) + mayúsculas +
  color de acento.

---

## 3. Radios

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius-sm` | `10px` | Sub-bloques, chips |
| `--radius-md` | `16px` | Cards (servicios, FAQ, proceso, team) |
| `--radius-lg` | `24px` | Contenedores grandes (CTA, garantía) |
| `--radius-pill` | `9999px` | Botones, badges |

Radios one-off de los mockups (65px teléfono, 14px desktop) se mantienen
literales por ser específicos del dispositivo simulado.

---

## 4. Sombras

| Token | Valor | Uso |
|-------|-------|-----|
| `--shadow-card` | `0 15px 30px negro 30%` | Hover de cards |
| `--shadow-elevated` | `0 20px 40px negro 40%` | Contenedores destacados |
| `--shadow-accent` | `0 0 20px cyan 15%` | Glow ambiental de card destacada |

Para glows de acento directos (botones, líneas lamp) se usa
`--accent-glow` / `--accent-glow-strong` en `box-shadow`.

---

## 5. Estados de componentes

### Botón primario (`.btn-primary`)

| Propiedad | Reposo | Hover |
|-----------|--------|-------|
| Fondo | `--accent` | `--accent` |
| Texto | `--background` | `--background` |
| Radio | `--radius-pill` | — |
| Sombra | `0 0 15px --accent-glow` | `0 0 25px --accent-glow-strong` |

### Card (patrón general)

| Variante | Fondo | Borde | Sombra hover |
|----------|-------|-------|--------------|
| Default | `--surface-1` | `--border-subtle` | `--shadow-card` |
| Destacada | gradiente `--accent-tint` | `--border-accent` | glow `--accent-glow` |

Interacción hover estándar: `translateY(-5px)` + sombra.

---

## 6. Voz y tono

- **Claro antes que ingenioso.** Frases directas, sin jerga vacía de IA.
- **Orientado a producción.** Hablamos de "seguro", "para producción",
  "que se destaca" — no de promesas mágicas.
- Español rioplatense (`locale: es_AR`).
- Copy de referencia (metadata): *"Vibra construye sistemas de IA que de
  verdad se destacan: claros, seguros y hechos para producción."*

---

## 7. Cómo usar los tokens

```css
/* ✅ Correcto */
.mi-card {
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
}

/* ❌ Incorrecto — hex/rgba crudo */
.mi-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(41, 211, 238, 0.4);
  border-radius: 16px;
}
```

Al agregar un componente nuevo: reutilizá los tokens existentes. Si un
valor no existe todavía, agregalo primero en `:root` (capa semantic) y
después consumilo — nunca hardcodees en el componente.
