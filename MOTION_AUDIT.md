# MOTION_AUDIT.md — Site-Wide Motion & Timer Audit

**Date:** 2026-10-13  
**Policy:** Strict Manual-Only Content Policy (Whole Site)  
**Standard:** Content changes ONLY from direct user input (click, tap, swipe/drag, keyboard). Zero timers, zero autoplay, zero auto-advancing steppers/tickers/carousels.

---

## 1. Audit Methodology
Every file in `src/` was scanned for:
- `setInterval`
- Looping `setTimeout`
- `autoplay`
- `repeat: -1`
- `animation-iteration-count: infinite`
- Marquee / ticker code
- `requestAnimationFrame` loops
- "demo cycle" or auto-advance logic

---

## 2. Inventory of Motion & Timers

| Element / Location | Type | Original Behavior | Verdict | Action Taken |
|---|---|---|---|---|
| `src/app/page.tsx` (lines 42–47) | `setInterval` (5500ms) | Auto-advanced `activeStep` (1 -> 2 -> 3) through the Three-Part Chapter System. | **(C) Content changes on its own** | **REMOVED.** Converted to manual 3D deck driven strictly by tabs, arrow buttons, card taps, swipe/drag, and keyboard. |
| `src/app/page.tsx` (Hero badge dot) | CSS `animate-ping` | Infinite pulsing dot on hero monograph badge. | **(C) Unsolicited infinite animation** | **REMOVED.** Replaced with static solid accent dot. |
| `src/app/page.tsx` (Fresh This Week) | Ticker / overflow row | Changelog ticker section. | **(C) Content motion** | **CONVERTED.** Built as a manual scroll-snap track with explicit Prev/Next arrow buttons, drag-to-scroll, and course filter chips. |
| `src/components/motion/PencilTrail.tsx` | `requestAnimationFrame` | Renders graphite cursor trail in high-DPI `<canvas>`. | **(A) User-driven** | **KEEP.** Runs only when pointer moves. Halts completely (`isRunning = false`) the instant trail points fade to 0. Paused under `prefers-reduced-motion`. |
| `src/components/chapter/ReadNotes.tsx` | `setTimeout` (2000ms) | Resets "Copied" feedback badge to "Copy Code". | **(A) User-driven** | **KEEP.** Single-shot timer triggered only by explicit user copy click. |
| `src/components/chapter/WatchFacade.tsx` | `autoplay=1` (iframe param) | Starts YouTube video after clicking facade. | **(A) User-driven** | **KEEP.** The iframe is not mounted until the user explicitly clicks the play button facade. |
| `src/components/course/RoadmapView.tsx` | `setTimeout` | Debounces scroll-spy during programmatic smooth scrolling. | **(A) User-driven** | **KEEP.** Single-shot timer triggered only when user clicks a tier anchor link. |
| `src/components/search/CommandPalette.tsx` | `setTimeout` (40ms) | Focuses input after modal portal opens. | **(A) User-driven** | **KEEP.** Single-shot timer triggered only when user opens search. |
| `src/components/illustrations/Kit.tsx` (IoT Doodle) | CSS `animate-ping` | Infinite pulsing beacon circle on IoT sensor schematic. | **(C) Unsolicited infinite animation** | **REMOVED.** Replaced with static solid accent circle. |
| `src/components/desk/MyDeskView.tsx` (Streak flame) | CSS `animate-pulse` | Infinite pulsing flame icon on day streak badge. | **(C) Unsolicited infinite animation** | **REMOVED.** Converted to static filled accent icon. |
| Hero Books Ribbon | Ambient decoration | Subtle 4px float / ribbon sway. | **(B) Ambient decoration** | **KEEP WITH GUARDS.** Maximum amplitude $\le 4$px; paused when off-screen via IntersectionObserver; disabled under `prefers-reduced-motion` and Calm mode. |

---

## 3. Allowed Infinite Animations Allow-List
The Playwright Idle Test (`tests/idle-motion.spec.mjs`) asserts `document.getAnimations()` during 20 seconds of zero user interaction.
**Permitted infinite animations:**
1. `hero-ribbon-sway` (if present, max $\le 4$px amplitude, paused in calm mode/reduced motion).
All other infinite CSS or JS animations are strictly forbidden.
