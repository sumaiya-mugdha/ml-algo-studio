/* ============================================================================
   ML Algo Studio — Learning Path, A-Z Editorial Glossary & About Page
   ============================================================================ */

(function () {
  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ---- 1. Learning Path (All 31 Live) ---- */
  function renderLearningPath() {
    const root = document.getElementById('pathRoot');
    if (!root || !window.MLCatalog) return;

    const stagesHtml = window.MLCatalog.LEARNING_PATH.map((stage) => {
      const itemsHtml = stage.items
        .map((id) => {
          const algo = window.MLCatalog.getById(id);
          if (!algo) return '';
          return `
            <button type="button" class="path-item-btn live" data-open-algo="${escapeHtml(algo.id)}">
              <div class="path-item-main">
                <span class="path-item-title">${escapeHtml(algo.title)}</span>
                <span class="path-item-meta">${escapeHtml(algo.difficulty)}</span>
              </div>
              <span class="viz-card-cta">&rarr;</span>
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
        <div class="studio-breadcrumb" style="margin-bottom:14px;">
          <a href="#home" data-nav-view="home">Home</a>
          <span aria-hidden="true">/</span>
          <strong>Learning Path</strong>
        </div>
        <div class="page-header-block">
          <h1 class="page-title">Learning path</h1>
          <p class="page-sub">Five sequential stages from basic function fitting to neural networks and attention.</p>
        </div>
        <div class="path-timeline">${stagesHtml}</div>
      </div>
    `;

    root.querySelectorAll('[data-nav-view]').forEach((a) => {
      a.addEventListener('click', (e) => { e.preventDefault(); window.MLPortal.setView(a.getAttribute('data-nav-view')); });
    });
    root.querySelectorAll('[data-open-algo]').forEach((btn) => {
      btn.addEventListener('click', () => window.MLPortal.openAlgorithm(btn.getAttribute('data-open-algo')));
    });
  }

  /* ---- 2. Editorial A-Z Glossary ---- */
  function renderGlossary() {
    const root = document.getElementById('glossaryRoot');
    if (!root || !window.MLCatalog) return;

    const allEntries = [...window.MLCatalog.GLOSSARY].sort((a, b) => a.term.localeCompare(b.term));
    const letters = [...new Set(allEntries.map((e) => e.term[0].toUpperCase()))];

    root.innerHTML = `
      <div class="narrow-container">
        <div class="studio-breadcrumb" style="margin-bottom:14px;">
          <a href="#home" data-nav-view="home">Home</a>
          <span aria-hidden="true">/</span>
          <strong>Glossary</strong>
        </div>

        <header class="glossary-header">
          <h1 class="page-title">Machine learning glossary</h1>
          <p class="glossary-intro">
            Every term below is defined in plain language — and unlike a normal glossary, each one links to an interactive visualization where you can see the idea run on real numbers, drag the data around, and break the algorithm on purpose. If a definition feels abstract, click through and play with it: the concept usually clicks in under a minute.
          </p>
          <p class="glossary-intro">
            Definitions are ordered A&ndash;Z. Under each entry, the &ldquo;Covers&rdquo; line lists the specific skills that concept&rsquo;s page teaches, so you can jump straight to the visualization that explains the exact thing you&rsquo;re stuck on.
          </p>
        </header>

        <div class="glossary-toolbar">
          <nav class="alpha-bar" aria-label="Jump to letter">
            ${letters.map((L) => `<button type="button" class="alpha-btn" data-alpha="${L}">${L}</button>`).join('')}
          </nav>
          <div class="gallery-search-wrap glossary-filter-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.34-4.34"></path>
            </svg>
            <input type="search" id="glossarySearchInput" class="gallery-search-input" placeholder="Filter terms or skills...">
          </div>
        </div>

        <div class="glossary-az-list" id="glossaryList"></div>
      </div>
    `;

    root.querySelectorAll('[data-nav-view]').forEach((a) => {
      a.addEventListener('click', (e) => { e.preventDefault(); window.MLPortal.setView(a.getAttribute('data-nav-view')); });
    });

    const renderList = (query) => {
      const listEl = document.getElementById('glossaryList');
      if (!listEl) return;
      const q = (query || '').trim().toLowerCase();
      const filtered = allEntries.filter(
        (g) =>
          !q ||
          g.term.toLowerCase().includes(q) ||
          g.definition.toLowerCase().includes(q) ||
          (g.covers || []).some((c) => c.toLowerCase().includes(q))
      );

      if (!filtered.length) {
        listEl.innerHTML = `<p class="glossary-empty">No terms match &ldquo;${escapeHtml(query)}&rdquo;.</p>`;
        return;
      }

      const grouped = new Map();
      for (const entry of filtered) {
        const letter = entry.term[0].toUpperCase();
        if (!grouped.has(letter)) grouped.set(letter, []);
        grouped.get(letter).push(entry);
      }

      let html = '';
      for (const [letter, items] of grouped.entries()) {
        html += `
          <section class="glossary-letter-group" id="glossary-letter-${letter}">
            <h2 class="glossary-letter-heading">${letter}</h2>
            <div class="glossary-entries">
              ${items
                .map(
                  (item) => `
                    <article class="glossary-entry">
                      <h3 class="glossary-entry-term">${escapeHtml(item.term)}</h3>
                      <p class="glossary-entry-def">${escapeHtml(item.definition)}</p>
                      <div class="glossary-entry-covers">
                        <span>Covers:</span> ${(item.covers || []).map(escapeHtml).join(' &middot; ')}
                      </div>
                      <button type="button" class="glossary-entry-link" data-open-algo="${escapeHtml(item.targetId)}">
                        Explore the interactive &rarr;
                      </button>
                    </article>
                  `
                )
                .join('')}
            </div>
          </section>
        `;
      }

      listEl.innerHTML = html;
      listEl.querySelectorAll('[data-open-algo]').forEach((btn) => {
        btn.addEventListener('click', () => window.MLPortal.openAlgorithm(btn.getAttribute('data-open-algo')));
      });
    };

    root.querySelectorAll('[data-alpha]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const L = btn.getAttribute('data-alpha');
        const input = document.getElementById('glossarySearchInput');
        if (input && input.value) {
          input.value = '';
          renderList('');
        }
        const target = document.getElementById('glossary-letter-' + L);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    const input = document.getElementById('glossarySearchInput');
    if (input) input.addEventListener('input', (e) => renderList(e.target.value));
    renderList('');
  }

  /* ---- 3. About Page ---- */
  function renderAbout() {
    const root = document.getElementById('aboutRoot');
    if (!root || !window.MLCatalog) return;

    root.innerHTML = `
      <div class="narrow-container">
        <div class="studio-breadcrumb" style="margin-bottom:14px;">
          <a href="#home" data-nav-view="home">Home</a>
          <span aria-hidden="true">/</span>
          <strong>About</strong>
        </div>

        <div class="page-header-block">
          <h1 class="page-title">About ML Algo Studio</h1>
          <p class="page-sub">An interactive browser lab for building geometric intuition across ${window.MLCatalog.ALGORITHMS.length} machine learning algorithms.</p>
        </div>

        <div class="about-grid">
          <article class="portal-card about-card">
            <h2>Direct Manipulation</h2>
            <p>Every model runs live in your browser with deterministic seeded math verified against NumPy. Move data points, adjust hyperparameters, and inspect exact boundaries, residuals, and derivatives.</p>
          </article>
          <article class="portal-card about-card">
            <h2>Break It on Purpose</h2>
            <p>Understanding an algorithm means knowing where it breaks. Each engine includes one-click failure cases—leverage outliers, vanishing gradients, saddle points, and non-linear manifolds.</p>
          </article>
        </div>
      </div>
    `;

    root.querySelectorAll('[data-nav-view]').forEach((a) => {
      a.addEventListener('click', (e) => { e.preventDefault(); window.MLPortal.setView(a.getAttribute('data-nav-view')); });
    });
  }

  function initPages() {
    renderLearningPath();
    renderGlossary();
    renderAbout();
  }

  window.MLPages = { renderLearningPath, renderGlossary, renderAbout };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initPages);
  else initPages();
})();
