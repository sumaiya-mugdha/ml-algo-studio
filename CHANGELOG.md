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
