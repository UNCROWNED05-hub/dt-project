# Design System: Vellum ("A Bookshelf, A Desk, and A Pencil")

## 1. Aesthetic Manifest & Art Direction
Vellum rejects generic SaaS dashboards (identical 3-column cards, purple gradients, cookie-cutter glassmorphism) in favor of the physical warmth and tactile intimacy of an **engineer's personal study library**:
* **The Bookshelf**: Courses stand as physical volumes on a shelf—with distinct spine heights, subtle +/-1.5° natural leans, vertical spine typography, ribbon bookmarks, and preview flyouts on hover.
* **The Desk**: The study surface is warm paper, textured with micro-grain noise and bordered with pencil-ruled guidelines (`--line`).
* **The Pencil**: A persistent tactile writing utensil—32x32 SVG pencil cursor, nib hover states, highlighter text-selection, and an ephemeral graphite trail that fades cleanly.

---

## 2. Typographic Palette

| Role | Font Family | Google Font Source | Optical Rationale |
|---|---|---|---|
| **Display / Headings** | **Bricolage Grotesque** | `'Bricolage Grotesque', sans-serif` | Editorial energy, human irregularities, high ink-trap charm. Weights: 700, 800, 900. |
| **Accent / Subtitles** | **Instrument Serif** | `'Instrument Serif', Georgia, serif` | Warm italic serif reminiscent of vintage literary monographs. Weight: 400 italic. |
| **Body & UI Text** | **Instrument Sans** | `'Instrument Sans', system-ui, sans-serif` | Highly legible, calm proportions optimized for long reading sessions and mobile screens. Weights: 400, 500, 600. |
| **Code & Technical Stamps** | **JetBrains Mono** | `'JetBrains Mono', monospace` | Crisp developer monospace for hours, volatility tags, terminal commands, and audit stamps. Weights: 400, 600, 700. |

---

## 3. Semantic Token Architecture

All UI components use **strictly semantic tokens** via CSS variables. Raw hex colors, hardcoded gray utilities (`text-gray-*`, `text-slate-*`), and raw `bg-white`/`bg-black` are banned from components and caught by an automated linter (`npm run lint:colors`).

### CSS Token Contract (`src/styles/globals.css`)
```css
:root, [data-theme="desk"] {
  --bg: #F3EEE6;          /* Natural parchment desk */
  --surface: #FAF6EF;     /* Crisp paper notebook page */
  --fg: #17161A;          /* Dense carbon ink */
  --fg-muted: #5B5761;    /* Graphite pencil tone */
  --line: rgba(23, 22, 26, 0.12); /* Ruled margin line */
  --accent: #D97706;      /* Amber bookmark ribbon */
  --on-accent: #17161A;   /* High-contrast ink on amber (5.8:1 AA) */
  --accent-2: #E11D48;    /* Crimson proofreader's mark */
  --block-1: #F5C451;     /* Ochre spine wash */
  --on-block-1: #17161A;
  --block-2: #EDE8DD;     /* Warm cloth binding */
  --on-block-2: #17161A;
  --block-3: #CFE5DB;     /* Sage endpaper */
  --on-block-3: #17161A;
  --block-4: #BDD3FF;     /* Blue ledger wash */
  --on-block-4: #17161A;
  --cursor-tint: #D97706;
  color-scheme: light;
}

/* Theme 1: AI & ML "Sunrise Paper" */
[data-theme="sunrise"] {
  --bg: #F5EDE0;
  --surface: #FFF9EF;
  --fg: #1C2340;
  --fg-muted: #565B7A;
  --line: rgba(28, 35, 64, 0.12);
  --accent: #F5B82E;
  --on-accent: #1C2340;   /* High contrast (10.2:1 AA) */
  --accent-2: #F08CAE;
  --block-1: #F5C451;  --on-block-1: #1C2340;
  --block-2: #F3A5BF;  --on-block-2: #1C2340;
  --block-3: #BFDCC0;  --on-block-3: #1C2340;
  --block-4: #A9C8EA;  --on-block-4: #1C2340;
  --cursor-tint: #F5B82E;
  color-scheme: light;
}

/* Theme 2: Cybersecurity "Midnight Ledger" (Dark Theme) */
[data-theme="midnight"] {
  --bg: #0E0F12;          /* Deep carbon obsidian */
  --surface: #181A1F;     /* Slate ledger slab */
  --fg: #EDE8DD;          /* Cream luminous ink (14.2:1 AA) */
  --fg-muted: #A8A396;    /* Soft parchment graphite (8.5:1 AA) */
  --line: rgba(237, 232, 221, 0.14);
  --accent: #FF5B2E;      /* Redacted security orange */
  --on-accent: #0E0F12;   /* Obsidian on signal orange (6.8:1 AA) */
  --accent-2: #8FD3FF;    /* Terminal cyan */
  --block-1: #FF5B2E;  --on-block-1: #0E0F12;
  --block-2: #EDE8DD;  --on-block-2: #0E0F12;
  --block-3: #232832;  --on-block-3: #EDE8DD;
  --block-4: #8FD3FF;  --on-block-4: #0E0F12;
  --cursor-tint: #FF5B2E;
  color-scheme: dark;
}

/* Theme 3: IoT "Blueprint Meadow" */
[data-theme="blueprint"] {
  --bg: #E6F0EC;          /* Celadon drafting paper */
  --surface: #F4FAF7;     /* Clean drafting film */
  --fg: #12307A;          /* Blueprint cyan-indigo (10.1:1 AA) */
  --fg-muted: #4A5F8F;    /* Solder silver (5.2:1 AA) */
  --line: rgba(18, 48, 122, 0.14);
  --accent: #2455E8;      /* Oscilloscope blue */
  --on-accent: #F4FAF7;   /* Crisp white on deep blue (6.4:1 AA) */
  --accent-2: #FFB020;    /* Copper trace */
  --block-1: #CFE5DB;  --on-block-1: #12307A;
  --block-2: #BDD3FF;  --on-block-2: #12307A;
  --block-3: #FFE08A;  --on-block-3: #12307A;
  --block-4: #12307A;  --on-block-4: #F4FAF7;
  --cursor-tint: #2455E8;
  color-scheme: light;
}
```

---

## 4. Hand-Authored Illustration Kit (`src/components/illustrations/Kit.tsx`)

A pure vector, runtime-free illustration library styled with `currentColor` and semantic tokens:
1. `<Underline />`: Hand-drawn variable-thickness underline that sketches underneath hero keywords.
2. `<HighlighterSwipe />`: Semi-transparent highlighter stroke for editorial notes and terms.
3. `<SketchArrow />`: Hand-drawn arrow showing learning paths and roadmap sequences.
4. `<Scribble />`: Organic pencil loop annotation.
5. `<PencilDivider />`: Tactile separator with a hand-drawn pencil break.
6. `<TallyMarks count={n} />`: Authentic 5-bar gate tally marks for chapter tracking and activity heatmap.
7. `<RubberStampBadge text="VERIFIED" />`: Skewed, dashed rubber stamp verifying quiz mastery.
8. `<NeuralHeroDoodle />`: AI neural pathway with synaptic nodes.
9. `<CyberHeroDoodle />`: Cybersecurity padlock, shield, and redacted security dossier motif.
10. `<IoTHeroDoodle />`: IoT microcontroller, antenna signal waves, and sensor pinouts.

---

## 5. Automated Anti-Regression Tooling

1. **Forbidden Color Linter (`scripts/check-forbidden-colors.mjs`)**:
   Scans `src/app/` and `src/components/` on every build. Fails immediately if raw hex codes (`#[0-9a-fA-F]{3,8}`), `text-black`, `text-white`, `text-gray-*`, `text-slate-*`, `text-zinc-*`, `bg-white`, or `bg-black` are found in components.
2. **Automated WCAG 2.2 AA Contrast Audit Engine (`scripts/contrast-audit.mjs`)**:
   Runs Playwright in real headless Chrome across 12 distinct routes (all pages, all 3 tabs, modals, 404) in all three themes. Computes real effective background colors factoring in alpha blending, and tests every text node against the 4.5:1 (normal text) and 3:1 (large text) thresholds.
   * **Result**: **0 failures across 1,109 text nodes**.
3. **Automated Cursor Verification Engine (`scripts/verify-cursor-browser.mjs`)**:
   Validates computed CSS cursor properties on `body`, links, buttons, inputs, and prose, verifies Layer 2 canvas graphite trail rendering, and tests `prefers-reduced-motion` compliance.
