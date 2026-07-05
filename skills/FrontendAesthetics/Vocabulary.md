# Vocabulary — pattern names to design with

Adapted from taste-skill. A vocabulary, not a component library: know these names, reach for them when the design read calls for one, and name the chosen pattern in the design brief so the build knows what to implement.

## Hero paradigms

**Asymmetric Split Hero** (text one side, asset the other, generous space) · **Editorial Manifesto Hero** (large type, no asset, almost-poster) · **Media Mask Hero** (type cut out as mask over video) · **Kinetic-Type Hero** (animated typography IS the visual) · **Curtain-Reveal Hero** (parts on scroll) · **Scroll-Pinned Hero** (pins while content scrolls behind).

## Navigation

**Magnetic Button** (pulls toward cursor) · **Dynamic Island** (morphing status pill) · **Mega Menu Reveal** (full-screen dropdown, staggered) · **Dock Magnification** (edge nav, fluid icon scale) · **Floating Speed Dial** (FAB springs into curved actions).

## Layout & grids

**Bento Grid** (asymmetric tiles, exact cell count) · **Masonry** (staggered, no fixed row height) · **Split-Screen Scroll** (halves slide opposite ways) · **Sticky-Stack Sections** (sections pin and stack on scroll) · **Chroma Grid** (tiles with subtle animating gradient borders).

## Cards & containers

**Parallax Tilt Card** (3D tilt tracks mouse) · **Spotlight Border Card** (border lights under cursor) · **Morphing Modal** (button expands into its own dialog) · **Glassmorphism Panel** (frosted, used sparingly, never everywhere).

## Scroll animations

**Sticky Scroll Stack** · **Horizontal Scroll Hijack** (vertical scroll pans horizontally) · **Sequence Scroll** (video/3D frames tied to scrollbar) · **Zoom Parallax** (background zooms on scroll) · **Scroll Progress Path** (SVG line draws along scroll).

## Typography & text

**Kinetic Marquee** (endless band, reverses on scroll — max one per page) · **Text Mask Reveal** (massive type as window to media) · **Text Scramble** (decode on load/hover) · **Circular Text Path** · **Gradient Stroke Animation** (outlined text, running gradient).

## Micro-interactions

**Directional Hover-Aware Button** (fill enters from cursor's side) · **Ripple Click** · **Skeleton Shimmer** · **Animated SVG Line Drawing** · **Particle Explosion Button** (on success, once) · **Lens Blur Depth** (background blurs to focus foreground action).

## Animation stack rules

- **Motion (`motion/react`)** — default for UI, bento, state-change motion.
- **GSAP + ScrollTrigger** — full-page scrolltelling and scroll hijacks; isolate in dedicated client-leaf components with `useEffect` cleanup.
- **Three.js / WebGL** — canvas backgrounds and 3D scenes; same isolation rule.
- Never mix GSAP/Three with Motion in one component tree — they fight over frames.
- Banned mechanics: `window.addEventListener("scroll", …)`, `window.scrollY` in React state, rAF loops touching React state. Use `useScroll()`/motion values, ScrollTrigger, IntersectionObserver, or CSS `animation-timeline: view()`.
- Animate only `transform` and `opacity`; `will-change` only on elements that actually animate.
