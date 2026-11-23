# Changelog

## What Changed and Why

### 1. Live Loss Curve and Query Probe Explanations (Borrowed & Adapted)
- **Added a live SVG loss/metric chart** (`renderCurve` in `js/app.js`) that tracks training progress step-by-step for Neural Networks, Logistic Regression, Linear SVM, Linear Regression (Gradient Descent), K-Means (inertia), and Gradient Boosting (stage-by-stage log loss).
- **Added a plain-language Query Probe banner** (`explainProbe` in `js/algorithms.js`) so clicking any spot in **Test Query** mode explains *why* the model chose that class (probabilities, margin score, decision tree path, or neighbor vote counts) instead of only drawing a square.

### 2. Side-by-Side Algorithm Duel Mode (Novel Feature)
- **Added Duel Mode** (`Duel Mode: Off/On` in the top bar) to run two different algorithms side-by-side on the exact same dataset.
- **Synchronized controls**: Adding or erasing a point updates both models immediately, **Train / Step / Reset** advance both models in lockstep, and the loss chart plots both curves together so learners can compare how different algorithms behave on identical data.

### 3. Audit Fixes (Determinism, Calm Design, & Math Verification)
- **Deterministic randomness & shareable URLs**: Replaced `Math.random()` with a seeded Mulberry32 PRNG (`createPRNG`), added a **Reseed** button, and synced algorithm, duel mode, seed, and preset to URL query parameters (`Copy Link`).
- **Strict flat, accessible layout**: Removed all CSS gradients, glassmorphism (`backdrop-filter`), heavy shadows, and neon colors. Switched to one neutral palette, one accent color (`#1d4ed8`), colorblind-safe Okabe-Ito class colors, one font family, keyboard `:focus-visible` outlines, `prefers-reduced-motion` support, and a collapsible Data/CSV drawer so the visualization stays the hero on laptop and mobile.
- **Plain-language teaching copy**: Replaced dense formulas with a one-sentence intuition and a short **What to notice** note on every algorithm.
- **Verified math & tests**: Fixed KNN tie-breaking to be deterministic, tightened SVM support-vector detection, and added `tests/test_algorithms.js` (12 unit tests) and `tests/verify_reference.py` (NumPy reference check for OLS and PCA).


## v3.0 — Unified Multi-View Portal + Studio Master Merge
- **App Shell & Navigation (`js/portal.js`, `css/portal.css`, `index.html`)**:
  - Added sticky top navigation bar (`Home`, `Visualizations`, `Studio`, `Learning Path`, `Glossary`, `About`), responsive mobile menu drawer, global footer, and hash routing that preserves shareable Studio URLs (`?algo=...&preset=...&seed=...`).
  - Added keyboard-accessible **Search Modal** (`Ctrl+K` / `Esc`) filtering all 31 topics across titles, categories, descriptions, and concepts taught.
  - Added **Light / Dark Theme Toggle** (saved in `localStorage`, respects `prefers-color-scheme`, dark-mode-aware Studio & Hero canvases).
  - Added **Soft / Flat Surface Mode Toggle** (`data-surface="soft"` vs `data-surface="flat"`, saved in `localStorage`) to switch instantly between subtle soft shadows + frosted blur and strict flat 1px borders.
- **Home Page (`js/home.js`, `js/thumbnails.js`)**:
  - Built landing hero with a live interactive 2D logistic classifier canvas (click to drop Class A / Class B points, live accuracy readout, Reset), project stats strip, 5-stage Learning Path preview, and 8 featured live algorithm cards with custom vector SVG thumbnails.
- **Visualizations Gallery & Roadmap (`js/gallery.js`, `js/catalog.js`, `ROADMAP.md`)**:
  - Built filterable catalog with live search, status pills (`All`, `Live Interactive`, `Coming Soon`), category pills, difficulty pills (`Beginner`, `Intermediate`, `Advanced`), result counter, and empty-state reset.
  - Showcases all 11 live Studio engines alongside 20 clearly labeled **Coming Soon** topics, documented in `ROADMAP.md` with planned post-merge features.
- **Studio Upgrades (`js/app.js`, `js/algorithms.js`, `css/styles.css`)**:
  - Merged Round 2 Studio enhancements: Dynamic Analysis Charts for all 11 algorithms, Data / Model / Break It control panels, 2 tailored one-click **Break It on Purpose** failure presets + dismissible failure explanation banner + Reset Defaults, Spread/Noise slider, Playback Speed (`0.5× / 1× / 2×`), Live Step Narration, Draggable Query Point, and **Prerequisites / What's Next** study navigation—while keeping Duel Mode, Seeded PRNG, SVG Tree/NN internals, and the 7-section KaTeX + Prism Education Layer intact.
- **Learning Path, Glossary & About (`js/pages.js`)**:
  - Added 5-stage sequential Learning Path roadmap, live-searchable 14-term ML Glossary linking straight to Studio engines, and About page.
- **Verification**:
  - Passed `tests/test_algorithms.js` (12/12), `tests/verify_reference.py` (NumPy OLS + PCA exact to `1e-9`), `tests/audit_phase4.js` (11/11 algorithms × 7 education sections), and `tests/test_portal_merge.js`.
