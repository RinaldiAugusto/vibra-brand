# Graph Report - .  (2026-07-08)

## Corpus Check
- 21 files · ~345,598 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 130 nodes · 150 edges · 13 communities (11 shown, 2 thin omitted)
- Extraction: 80% EXTRACTED · 20% INFERRED · 0% AMBIGUOUS · INFERRED: 30 edges (avg confidence: 0.81)
- Token cost: 313,000 input · 6,000 output

## Community Hubs (Navigation)
- TypeScript Config
- NPM Package & Dependencies
- Page & UI Components
- Hero Mechanics & Landing Concepts
- Vibra Logo (Dark) Design
- Hero 2 Artwork - Glass Stars
- Hero 1 Artwork - Light Burst
- Hero 3 Artwork - Glossy Blue Stars
- Vibra Logo (Transparent) Design
- Layout, Header & Footer
- VibraHero Scroll Animation
- Next.js Config
- Next.js Env Types

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `Hero 1 Artwork` - 9 edges
3. `Hero 2 Artwork` - 7 edges
4. `Hero 3 Artwork - Glossy Blue Stars Cluster` - 6 edges
5. `VibraHero()` - 5 edges
6. `Button()` - 4 edges
7. `scripts` - 4 edges
8. `Vibra Landing` - 4 edges
9. `VibraHero Component` - 4 edges
10. `Scroll-Driven Hero` - 4 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Pinned scroll transition: hero_1 burst grows and fades while hero_2 stars rotate into a page-wide watermark** — readme_scroll_driven_hero, readme_hero_1_burst, readme_hero_2_stars, readme_hero_tuning_knobs [EXTRACTED 1.00]

## Communities (13 total, 2 thin omitted)

### Community 0 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "NPM Package & Dependencies"
Cohesion: 0.11
Nodes (17): dependencies, framer-motion, next, react, react-dom, devDependencies, @types/node, @types/react (+9 more)

### Community 2 - "Page & UI Components"
Cohesion: 0.24
Nodes (5): Button(), ButtonProps, CtaSection(), SectionFeature(), SectionFeatureProps

### Community 3 - "Hero Mechanics & Landing Concepts"
Cohesion: 0.20
Nodes (12): Vibra Brand Identity, Framer Motion, Geist + Geist Mono Fonts, globals.css Animations (starTwinkle, taglinePulse), hero_1 (Estallido de Luz), hero_2 (Estrellas / Marca de Agua), Hero Tuning Knobs, mix-blend-mode: screen (+4 more)

### Community 4 - "Vibra Logo (Dark) Design"
Cohesion: 0.24
Nodes (11): Vibra (Brand), Cyan Accent Color, Dark Navy Background, Radial Glow Halo Effect, Glowing Cyan Dot (i-tittle), Vibra Logo (Dark 4K), Lowercase Geometric Sans-Serif, Minimal Modern Tech Aesthetic (+3 more)

### Community 5 - "Hero 2 Artwork - Glass Stars"
Cohesion: 0.25
Nodes (11): Hero 2 Artwork, 3D Rendered Style, AI / Magic Symbolism, Pure Black Background, Blue Color Palette, Futuristic Premium Mood, Translucent Glass Material, Glass Four-Pointed Star (+3 more)

### Community 6 - "Hero 1 Artwork - Light Burst"
Cohesion: 0.29
Nodes (10): Hero 1 Artwork, Abstract Minimalist Style, Cosmic Stellar Theme, Deep Dark Blue Background, Energy and Radiance Message, Ethereal Futuristic Mood, Bright Glowing White Core, Iridescent Purple-Pink Gradient (+2 more)

### Community 7 - "Hero 3 Artwork - Glossy Blue Stars"
Cohesion: 0.24
Nodes (10): Hero 3 Artwork - Glossy Blue Stars Cluster, Aspiration and Ambition Message, Pure Black Background, Electric Blue Color Palette, Vibra Brand Identity Motif, Cosmic Dreamy Mood, Glossy 3D Rendered Style, Iridescent Glass-Like Sheen (+2 more)

### Community 8 - "Vibra Logo (Transparent) Design"
Cohesion: 0.36
Nodes (8): Vibra Logo (Transparent 4K), Vibra Brand, Cyan/Turquoise Luminous Glow, Cyan Glowing Orb (i-dot), Light / Energy / Vibration Motif, Overlay / Watermark Usage Intent, Transparent Background Variant, Lowercase 'vibra' Wordmark

### Community 9 - "Layout, Header & Footer"
Cohesion: 0.38
Nodes (3): metadata, Footer(), Header()

### Community 10 - "VibraHero Scroll Animation"
Cohesion: 0.52
Nodes (6): clamp01(), flyEase, MotionImage, ramp(), shrinkEase, VibraHero()

## Knowledge Gaps
- **53 isolated node(s):** `metadata`, `ButtonProps`, `SectionFeatureProps`, `MotionImage`, `nextConfig` (+48 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 4 inferred relationships involving `Hero 1 Artwork` (e.g. with `Abstract Minimalist Style` and `Cosmic Stellar Theme`) actually correct?**
  _`Hero 1 Artwork` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Hero 2 Artwork` (e.g. with `3D Rendered Style` and `Futuristic Premium Mood`) actually correct?**
  _`Hero 2 Artwork` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `metadata`, `ButtonProps`, `SectionFeatureProps` to the rest of the system?**
  _55 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `NPM Package & Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._