## What's New
- **31 Live Interactive Algorithms (Zero Build Step):** Combines 11 full 2D Studio engines (with Duel Mode, Query Probe, SVG internals, KaTeX math, and Python code) and 20 new bespoke Interactive Labs covering Foundations, Regularization (Ridge/Lasso/Elastic Net), 4-Way Decision Boundaries, 3D Kernel Trick, Bagging, AdaBoost, DBSCAN, t-SNE, Perceptron, Activation Functions, Backpropagation, and Attention.
- **A–Z Interactive Glossary:** Added a 48-term alphabetical glossary with a letter jump bar (`A–W`), live search filter, `Covers:` skill tags, and direct links to interactive visualizations.
- **Multi-View Portal & Search:** Added a sticky header (`Home`, `Visualizations`, `Studio`, `Learning Path`, `Glossary`, `About`), live clickable 2D classifier on Home, filterable Gallery, 5-stage Learning Path, and `Ctrl+K` Search Modal.
- **Dual Theme & Surface Toggles:** Switch between **Light / Dark** themes and **Soft (shadows + blur) / Flat (crisp 1px borders)** modes from the top bar, persisted in `localStorage`.

## Studio & UI Improvements
- Added Dynamic Analysis Charts for all 11 Studio algorithms, split controls into **Data**, **Model**, and **Break It**, and added dismissible failure-mode banners.
- Added playback speed controls (`0.5× / 1× / 2×`), Spread/Noise slider, live step narration, draggable query point, and Prerequisites / Next navigation.
- Trimmed redundant text and tightened spacing and typography across all views.

## Verification
- `node tests/test_algorithms.js` — 12/12 unit tests passing
- `python3 tests/verify_reference.py` — OLS and PCA verified against NumPy (`1e-9`)
- `node tests/audit_phase4.js` — 11/11 algorithms × 7 education sections verified
- `node tests/test_portal_merge.js` — all 31 live algorithms and 48 glossary links verified
