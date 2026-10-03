# Phase Report P0: Baseline, Diagnosis & Architectural Plan

**Branch**: `v2-premium` | **Tag**: `pre-v2` | **Timestamp**: 2026-10-04T00:53:00+05:30

---

## 1. Safety Net & Git Initialization
* Initialized local git repository in `c:/Users/pacha/OneDrive/Desktop/dt model`.
* Created standard Next.js `.gitignore`.
* Committed initial baseline: `8cd393e ("chore: baseline before v2 premium")`.
* Created and checked out working branch `v2-premium`.
* Tagged baseline commit with `pre-v2`.

---

## 2. Baseline Verification Suite (Run & Recorded)

### A. Next.js Production Build (`npm run build`)
* **Status**: `✓ Compiled successfully` (42/42 static pages prerendered, 0 build errors).

### B. Strict Semantic Token Linter (`node scripts/check-forbidden-colors.mjs`)
* **Status**: `✅ Zero forbidden color classes detected!` (0 instances of raw hex or hardcoded gray/black/white utility classes in components).

### C. Automated WCAG 2.2 AA Contrast Audit Engine (`node scripts/contrast-audit.mjs`)
* **Status**: `✓ All 12 test routes passed WCAG AA!`
* **Results**: 1,109 text nodes evaluated across desktop, mobile, light/dark themes, and modals; **0 contrast failures**.

### D. Automated Browser Cursor Verification Engine (`node scripts/verify-cursor-browser.mjs`)
* **Status**: `🎉 ALL AUTOMATED VERIFICATION TESTS PASSED FLAWLESSLY!`
* **Results**: Layer 1 CSS cursors (pencil, nib, highlighter, text caret) and Layer 2 canvas graphite trail verified in real browser with 0 console errors and proper `prefers-reduced-motion` handling.

---

## 3. Bug Diagnoses & Failing Reproduction Tests

### Bug B1: Tier Navigation Fails on Curriculum Roadmap
* **Root Cause (2-3 sentences)**:
  In `src/components/course/RoadmapView.tsx`, the tier tabs are rendered as plain `<button>` elements that only update React state (`activeTier`) instead of in-page anchor links (`#beginner`, `#intermediate`, `#advanced`). Every course section is always present in the DOM simultaneously (`block` vs `opacity-90`), sections completely lack `id` attributes (`id="advanced"`), and no scroll mechanism (`lenis.scrollTo` or `scrollIntoView`) is called. Consequently, clicking "Advanced Tier" changes the tab highlight color, but the page never moves and continues displaying the Beginner tier at the top of the viewport.
* **Proving Test**: `tests/b1-tier-nav.spec.mjs`
* **Real Test Output**:
  ```text
  Testing Bug B1 (Tier Navigation)...
  Initial Scroll Y: 0
  New Scroll Y: 0
  URL Hash: ""
  Has #advanced section element: false

  ❌ B1 Reproduction Confirmed! Failures:
    - Page did NOT scroll to Advanced tier (scrollY remained 0)
    - URL hash was not updated to #advanced (current hash: "")
    - Target section does not have id="advanced" for anchor navigation
  ```
* **Status**: Reproducible failure confirmed. Fix scheduled for Phase P1.

### Bug B2: Floating Tilted "CANONICAL LEDGER" Card on Home Hero
* **Symptom**: A floating card with class `-rotate-1` displaying `"CANONICAL LEDGER"` sits in the right column of the Home hero (`src/app/page.tsx`, lines 96–107), violating the clean 3D hero composition.
* **Proving Test**: `tests/b2-no-hero-cards.spec.mjs`
* **Real Test Output**:
  ```text
  Testing Bug B2 (No floating/tilted CANONICAL LEDGER cards on hero)...
  DOM text instances of "CANONICAL LEDGER": 10
  Hero tilted/floating card elements: 1
  Code occurrences of "CANONICAL LEDGER": 1

  ❌ B2 Reproduction Confirmed: "CANONICAL LEDGER" or tilted hero cards are present!
  ```
* **Status**: Reproducible failure confirmed. Removal scheduled for Phase P1.

---

## 4. AI-Tells Audit Baseline Metrics (`scripts/ai-tells-audit.mjs`)

Audited 5 primary pages across 3 viewports (`desktop-1440`, `tablet-768`, `mobile-375`) at each 100svh scroll step:

| Page | Viewport | Max Uppercase Mono in View (Limit: 3) | Max Pill Chips in View (Limit: 4) | Serif-Italic Accents (Limit: 1) | Baseline Status |
|---|---|---|---|---|---|
| **Home** | desktop-1440 | 4 | 6 | 1 | ⚠️ Exceeds limits |
| **Home** | tablet-768 | 4 | 4 | 1 | ⚠️ Exceeds mono |
| **Home** | mobile-375 | 3 | 3 | 1 | ✓ Pass |
| **Course AI** | desktop-1440 | 3 | 5 | 1 | ⚠️ Exceeds pills |
| **Course AI** | tablet-768 | 3 | 5 | 1 | ⚠️ Exceeds pills |
| **Course AI** | mobile-375 | 2 | 2 | 1 | ✓ Pass |
| **Course Cyber** | desktop-1440 | 3 | 5 | 1 | ⚠️ Exceeds pills |
| **Course Cyber** | tablet-768 | 3 | 5 | 1 | ⚠️ Exceeds pills |
| **Course Cyber** | mobile-375 | 2 | 2 | 1 | ✓ Pass |
| **Course IoT** | desktop-1440 | 3 | 5 | 1 | ⚠️ Exceeds pills |
| **Course IoT** | tablet-768 | 3 | 5 | 1 | ⚠️ Exceeds pills |
| **Course IoT** | mobile-375 | 2 | 2 | 1 | ✓ Pass |
| **My Desk** | desktop-1440 | 12 | 5 | 0 | ⚠️ Exceeds mono & pills |
| **My Desk** | tablet-768 | 12 | 5 | 0 | ⚠️ Exceeds mono & pills |
| **My Desk** | mobile-375 | 7 | 3 | 0 | ⚠️ Exceeds mono |

*All baselines recorded; gates will be strictly enforced in P3 (for Home) and P5 (for all pages).*

---

## 5. Architectural Plan & Specifications

### A. Library Version Pinning (Matching React 18.3.1 & Next.js 14.2.15)
* `three@0.169.0`: Core WebGL 3D engine.
* `@types/three@0.169.0`: Strict TypeScript definitions for Three.js.
* `@react-three/fiber@8.17.10`: Declarative React 18 renderer for Three.js (pinned to v8 for React 18 compatibility).
* `@react-three/drei@9.114.0`: Low-level Drei helpers without barrel imports (pinned to v9 for R3F v8).
* `gsap@3.12.5`: High-precision animation engine & ScrollTrigger for timeline scrubbing.
* `lenis@1.1.18`: Modern smooth scrolling engine synchronized with GSAP ticker.

### B. 3D System Architecture (`<SceneRoot>`)
* Single persistent canvas mounted directly as a child of `<body>` in root layout (`position: fixed`, `inset: 0`, `pointer-events: none`).
* `frameloop="demand"` with manual invalidation on scroll and pointer updates.
* Quality tiers:
  * `full`: Desktop, DPR capped at 1.75, soft contact shadows, ~150 loose pages.
  * `lite`: Touch devices or sustained frame time > 22ms, DPR 1.0–1.25, ~60 pages, no shadows.
  * `static`: WebGL disabled, context lost, or `prefers-reduced-motion` enabled.
* Pre-rendered hero poster crossfading to WebGL canvas upon ready event.
* Test hook: `window.__scene = { tier, ready, progress, fps, canvases, geometries, textures }` (under `NEXT_PUBLIC_E2E=1`).

### C. Home Storyboard: "From Tab Chaos to a Library" (5 Keyframes)
1. **Keyframe 1 (0% – 15% scroll)**:
   * 3 closed books (AI amber, Cyber graphite with orange foil, IoT blueprint blue) in a loose arc under a warm key light.
   * ~150 loose tab pages drifting around in slow Brownian motion.
   * Subtle pointer parallax (camera yaw/pitch $\le 4^\circ$).
2. **Keyframe 2 (15% – 40% scroll)**:
   * Camera pulls back slightly; loose pages stream into the books via instanced easing.
   * Books visibly thicken.
   * HTML Beat 1: Video re-ranking simulation with +14% challenger card.
3. **Keyframe 3 (40% – 65% scroll)**:
   * Camera pushes in on the center book as it opens on its spine.
   * HTML Beat 2: Editorial notes page with active highlighter swipe.
4. **Keyframe 4 (65% – 85% scroll)**:
   * Camera orbits to side; HTML Beat 3: Scenario quiz answer inks in with rubber verification stamp.
5. **Keyframe 5 (85% – 100% scroll)**:
   * Three books align standing upright on a wooden study ledge with natural $\pm 1.5^\circ$ leans.
   * Hover lifts book 28px forward and slides out metadata preview. Click initiates 3D book-open transition.

---

## 6. Phase P0 Completion Status
* All deliverables for Phase P0 are complete.
* Ready to begin Phase P1 (Fixes & Shell: B1, B2, logo, nav, rail, and search overlay).
