---
name: ml-edu-enhancer
description: Enhances ML Algo Studio by adding a complete, textbook-quality educational layer below the existing 11-algorithm interactive sandbox without modifying core canvas mechanics, Duel Mode, or existing tests. Enforces strict approval gates before any file edits.
---

# ML Algo Studio — Educational Layer Enhancement Skill

## 1. Codebase Baseline (What Already Exists)
You are working inside **ML Algo Studio**, an existing 8-file browser-based educational ML sandbox (Vanilla HTML, CSS, JavaScript) covering **11 algorithms**:
- **Supervised Classification & Ensembles:** Neural Network (MLP), Logistic Regression, Linear SVM, K-Nearest Neighbors (KNN), Decision Tree (CART), Random Forest, Gradient Boosting, Gaussian Naive Bayes.
- **Regression & Unsupervised:** Linear Regression (OLS + GD), K-Means Clustering, Principal Component Analysis (PCA).

**Existing Files:**
- `index.html` — Top navigation bar, main visualization stage, live narration bar, dynamic analysis charts, and right-hand Data / Model / Break It / CSV panels.
- `css/styles.css` — Strict flat design system (zero gradients, zero glassmorphism, zero box-shadows, single accent `#1d4ed8`, `:focus-visible`, `prefers-reduced-motion`).
- `js/algorithms.js` — Pure JS math engine for all 11 algorithms + Mulberry32 PRNG.
- `js/app.js` — State manager, URL serialization, 2D HTML5 Canvas renderer (Okabe-Ito palette), Duel Mode, draggable query point, SVG charts/internals.
- `tests/test_algorithms.js` — 12 Node.js unit tests.
- `tests/verify_reference.py` — NumPy mathematical cross-validation (`1e-9` precision).

---

## 2. Non-Negotiable Preservation Rules
1. **DO NOT modify the sandbox mechanics:** Leave the HTML5 Canvas, point editing, draggable query probe, Duel Mode, existing controls, and `js/algorithms.js` math completely untouched.
2. **DO NOT break existing tests:** `tests/test_algorithms.js` and `tests/verify_reference.py` must continue to pass with zero regressions.
3. **Preserve the Flat Design System:** All new CSS must obey the existing flat-design audit—**zero `linear-gradient`/`radial-gradient`, zero `box-shadow`, zero `backdrop-filter`/glassmorphism**, using the existing neutral surfaces and `#1d4ed8` accent.
4. **Keep `js/app.js` clean:** Store all new educational data and rendering logic in a dedicated module (`js/education.js`) and stylesheet (`css/education.css`). Only add a minimal hook in `js/app.js` (e.g., calling `renderEducationSection(activeAlgoId)` when the algorithm switches).
5. **Scope Boundary:** **Skip DSA** completely for now. Do not add placeholder DSA tabs or unrequested features.

---

## 3. Approved External CDN Libraries
To deliver textbook-quality math and readable reference code, you are approved to load these lightweight CDN libraries in `index.html`:
- **KaTeX** (CSS + JS + `auto-render` extension) for crisp LaTeX mathematical typography.
- **Prism.js** (or **Highlight.js**) with Python language support and a clean, flat light theme matching the app's neutral surface palette.

---

## 4. Missing Features to Build (For All 11 Algorithms)
Add a full-width **Educational Section** directly below the existing sandbox/charts area that dynamically updates whenever the user selects any of the 11 algorithms. Every algorithm must render these **7 structured sections**:

1. **Introduction Header**
   - Algorithm name, concise student-friendly explanation, **Difficulty badge** (Beginner / Intermediate / Advanced), and **Prerequisites** list.
2. **Mathematical Explanation & Theory (KaTeX)**
   - Core equations rendered with KaTeX in textbook style, paired with plain-language explanations connecting each symbol to what the user sees on the canvas.
   - **Special Requirement for Linear Regression:** Include an interactive **"Trace it by hand"** subsection using the exact fixed dataset: `(1, 2), (2, 3), (3, 5), (4, 6)` showing step-by-step calculation of $\bar{x}$, $\bar{y}$, $\beta_1$, $\beta_0$, residuals $r_i$, SSE, and MSE. (Never replace these 4 points with random values.)
3. **Break It / Experiments Explained**
   - Written mathematical explanations for **each of the 2 existing "Break It" presets** for that algorithm, explaining *what* breaks and *why* it happens mathematically.
4. **Python / Pseudocode Reference**
   - Clean, syntax-highlighted, read-only Python implementation (reference only; no code execution).
   - Working **Copy Code** button with visual "Copied!" feedback.
5. **Complexity Analysis**
   - Structured table showing accurate **Time Complexity** (Training & Prediction: Best / Average / Worst where applicable) and **Space Complexity** for the algorithm as implemented.
6. **Frequently Asked Questions (FAQ)**
   - Accessible accordion (`<details>` / `<summary>` or ARIA-compliant buttons) with 3–5 common student misconceptions per algorithm.
7. **Related Algorithms**
   - Clickable cards/buttons linking to 2–3 related algorithms that **directly switch the active algorithm** in ML Algo Studio when clicked.

---

## 5. Mandatory Approval-Gated Workflow (Ask Before Editing)
**CRITICAL RULE:** Never edit files silently. You must follow these phases in order and **STOP to ask the user for approval** at the end of every phase before making code changes.

### Phase 0: Codebase Audit (Read-Only)
- Inspect `index.html`, `js/app.js`, and `css/styles.css`.
- Identify: (a) the exact DOM insertion point below the sandbox, (b) the exact algorithm IDs and existing "Break It" preset names in `js/app.js`, and (c) the exact function/event where algorithm switching happens.
- **STOP & ASK:** Present your findings and ask for approval to proceed to Phase 1.

### Phase 1: Architecture & Design Proposal (Read-Only)
- Propose the exact CDN tags (KaTeX + Prism.js), the HTML container structure, the `css/education.css` flat-design tokens, and the `js/education.js` data schema.
- **STOP & ASK:** Wait for explicit user approval before creating or editing any file.

### Phase 2: Core Shell + Linear Regression Proof-of-Concept
- Add CDN links and the container to `index.html`, create `css/education.css` and `js/education.js`, and add the minimal switch hook in `js/app.js`.
- Fully populate **Linear Regression** (all 7 sections, including the exact `(1, 2), (2, 3), (3, 5), (4, 6)` "Trace it by hand" walkthrough).
- **STOP & ASK:** Ask the user to inspect Linear Regression in the browser and approve the layout, KaTeX math rendering, and code block styling before populating the other 10 algorithms.

### Phase 3: Populate Remaining 10 Algorithms (In Batches)
Implement the remaining 10 algorithms in 3 small batches, pausing for approval after each batch:
- **Batch A (Linear & Distance Models):** Logistic Regression, Linear SVM, K-Nearest Neighbors, Gaussian Naive Bayes.
- **Batch B (Tree & Ensemble Models):** Decision Tree, Random Forest, Gradient Boosting.
- **Batch C (Neural & Unsupervised Models):** Neural Network (MLP), K-Means Clustering, Principal Component Analysis (PCA).
- **STOP & ASK** after each batch.

### Phase 4: Verification & Regression Audit
- Run `node tests/test_algorithms.js` and `python tests/verify_reference.py` (or `py -3 tests/verify_reference.py` on Windows).
- Run a flat-design CSS check on `css/education.css` to confirm 0 gradients, 0 box-shadows, and 0 glassmorphism.
- Verify all 11 algorithms render KaTeX math, Copy Code works, FAQ accordions toggle, and Related Algorithm links switch the sandbox cleanly.
- Present a concise final verification report.