/* ============================================================================
   ML Algo Studio — Learning Path, Searchable Glossary & About Page (Batch 5)
   ============================================================================ */

(function () {
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ---- 1. Curated Learning Path ---- */
  function renderLearningPath() {
    const root = document.getElementById('pathRoot');
    if (!root || !window.MLCatalog) return;

    const stagesHtml = window.MLCatalog.LEARNING_PATH.map((stage) => {
      const itemsHtml = stage.items
        .map((id) => {
          const algo = window.MLCatalog.getById(id);
          if (!algo) return '';
          if (algo.live && algo.studioId) {
            return `
              <button type="button" class="path-item-btn live" data-launch-studio="${escapeHtml(algo.studioId)}">
                <div class="path-item-main">
                  <span class="path-item-title">${escapeHtml(algo.title)}</span>
                  <span class="path-item-meta">${escapeHtml(algo.difficulty)} &middot; ${escapeHtml(algo.timeEstimate)}</span>
                </div>
                <span class="pill-badge pill-live">Launch &rarr;</span>
              </button>
            `;
          }
          return `
            <button type="button" class="path-item-btn soon" data-jump-gallery="${escapeHtml(algo.category)}">
              <div class="path-item-main">
                <span class="path-item-title">${escapeHtml(algo.title)}</span>
                <span class="path-item-meta">${escapeHtml(algo.difficulty)} &middot; ${escapeHtml(algo.timeEstimate)}</span>
              </div>
              <span class="pill-badge pill-soon">Coming Soon</span>
            </button>
          `;
        })
        .join('');

      return `
        <div class="path-stage">
          <div class="path-stage-marker" style="border-color:${stage.colorToken};color:${stage.colorToken};">${stage.num}</div>
          <div class="path-stage-card portal-card">
            <div class="path-stage-head">
              <h2 class="path-stage-title">${escapeHtml(stage.name)}</h2>
              <p class="path-stage-desc">${escapeHtml(stage.desc)}</p>
            </div>
            <div class="path-stage-list">${itemsHtml}</div>
          </div>
        </div>
      `;
    }).join('');

    root.innerHTML = `
      <div class="narrow-container">
        <div class="page-header-block">
          <h1 class="page-title">Curated Learning Path</h1>
          <p class="page-sub">
            Follow this 5-stage sequence from linear lines to neural networks. Click any <strong>Live</strong> item to launch it directly in the interactive Studio.
          </p>
        </div>
        <div class="path-timeline">${stagesHtml}</div>
      </div>
    `;

    root.querySelectorAll('[data-launch-studio]').forEach((btn) => {
      btn.addEventListener('click', () => window.MLPortal.openStudio(btn.getAttribute('data-launch-studio')));
    });
    root.querySelectorAll('[data-jump-gallery]').forEach((btn) => {
      btn.addEventListener('click', () => window.MLPortal.openGalleryWithFilter(btn.getAttribute('data-jump-gallery')));
    });
  }

  /* ---- 2. Searchable Glossary ---- */
  function renderGlossary() {
    const root = document.getElementById('glossaryRoot');
    if (!root || !window.MLCatalog) return;

    root.innerHTML = `
      <div class="narrow-container">
        <div class="page-header-block">
          <h1 class="page-title">Machine Learning Glossary</h1>
          <p class="page-sub">
            Plain-English definitions for core ML terms. Every entry links straight to a live interactive algorithm where you can see the concept in action.
          </p>
        </div>

        <div class="gallery-search-wrap" style="margin-bottom:20px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.34-4.34"></path>
          </svg>
          <input type="search" id="glossarySearchInput" class="gallery-search-input" placeholder="Filter glossary terms (e.g. sigmoid, Gini, inertia, eigenvector)...">
        </div>

        <div class="glossary-list" id="glossaryList"></div>
      </div>
    `;

    const input = document.getElementById('glossarySearchInput');
    const renderItems = (query) => {
      const listEl = document.getElementById('glossaryList');
      if (!listEl) return;
      const q = (query || '').trim().toLowerCase();
      const matches = window.MLCatalog.GLOSSARY.filter(
        (g) =>
          !q ||
          g.term.toLowerCase().includes(q) ||
          g.definition.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q)
      );

      if (!matches.length) {
        listEl.innerHTML = `<div class="portal-card" style="text-align:center;color:var(--text-muted);">No glossary terms match "${escapeHtml(query)}".</div>`;
        return;
      }

      listEl.innerHTML = matches
        .map(
          (item) => `
            <article class="glossary-card portal-card">
              <div class="glossary-card-head">
                <div>
                  <span class="pill-badge" style="margin-bottom:6px;">${escapeHtml(item.category)}</span>
                  <h2 class="glossary-term">${escapeHtml(item.term)}</h2>
                </div>
                <button type="button" class="btn btn-sm btn-primary" data-launch-studio="${escapeHtml(item.studioId)}">
                  Try in Studio &rarr;
                </button>
              </div>
              <p class="glossary-def">${escapeHtml(item.definition)}</p>
            </article>
          `
        )
        .join('');

      listEl.querySelectorAll('[data-launch-studio]').forEach((btn) => {
        btn.addEventListener('click', () => window.MLPortal.openStudio(btn.getAttribute('data-launch-studio')));
      });
    };

    if (input) {
      input.addEventListener('input', (e) => renderItems(e.target.value));
    }
    renderItems('');
  }

  /* ---- 3. About Page ---- */
  function renderAbout() {
    const root = document.getElementById('aboutRoot');
    if (!root || !window.MLCatalog) return;

    const liveCount = window.MLCatalog.getLiveAlgorithms().length;
    const soonCount = window.MLCatalog.getComingSoonAlgorithms().length;

    root.innerHTML = `
      <div class="narrow-container">
        <div class="page-header-block">
          <h1 class="page-title">About ML Algo Studio</h1>
          <p class="page-sub">
            A hands-on, zero-build-step visual lab that turns textbook machine learning equations into interactive 2D geometry you can touch, compare, and deliberately break.
          </p>
        </div>

        <div class="about-grid">
          <article class="portal-card about-card">
            <h2>Why Visual Intuition Matters</h2>
            <p>
              Machine learning textbooks are full of Greek notation—summations, gradients, and matrix inverses. Under the hood, every algorithm is geometric: lines slicing planes, margins pushing points apart, and clusters shifting toward centers.
            </p>
            <p>
              ML Algo Studio runs <strong>${liveCount} real algorithms</strong> directly in your browser using deterministic seeded math verified against NumPy, paired with KaTeX formulas and runnable Python code.
            </p>
          </article>

          <article class="portal-card about-card">
            <h2>The &ldquo;Break It on Purpose&rdquo; Philosophy</h2>
            <p>
              You only truly understand an algorithm once you see how it fails. Every live engine includes tailored one-click failure presets—high-leverage outliers, tiny K values, extreme RBF gamma, or non-linear rings on linear models—so you can watch failure modes happen live and fix them.
            </p>
          </article>

          <article class="portal-card about-card">
            <h2>Dual Visual Modes &amp; Accessibility</h2>
            <p>
              Switch anytime in the header between <strong>Soft mode</strong> (subtle elevation shadows and frosted blur) and <strong>Strict Flat mode</strong> (zero shadows, crisp 1px borders), plus <strong>Light</strong> and <strong>Dark</strong> themes with colorblind-safe Okabe–Ito palettes.
            </p>
          </article>

          <article class="portal-card about-card">
            <h2>What&rsquo;s Next on the Roadmap</h2>
            <p>
              Alongside the ${liveCount} live Studio engines, ${soonCount} additional topics—including Gradient Descent contours, Optimizer races, Ridge/Lasso regularization, DBSCAN, t-SNE, and Attention—are organized in the Gallery and tracked in <code>ROADMAP.md</code>.
            </p>
            <div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap;">
              <button type="button" class="btn btn-primary btn-sm" id="aboutOpenStudioBtn">Launch Studio</button>
              <button type="button" class="btn btn-sm" id="aboutOpenGalleryBtn">Explore Gallery</button>
            </div>
          </article>
        </div>
      </div>
    `;

    const sBtn = document.getElementById('aboutOpenStudioBtn');
    const gBtn = document.getElementById('aboutOpenGalleryBtn');
    if (sBtn) sBtn.addEventListener('click', () => window.MLPortal.openStudio('linear_reg'));
    if (gBtn) gBtn.addEventListener('click', () => window.MLPortal.setView('visualizations'));
  }

  function initPages() {
    renderLearningPath();
    renderGlossary();
    renderAbout();
  }

  window.MLPages = { renderLearningPath, renderGlossary, renderAbout };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPages);
  } else {
    initPages();
  }
})();
