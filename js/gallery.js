/* ============================================================================
   ML Algo Studio — Visualizations Gallery (31 Live Interactive Topics)
   ============================================================================ */

(function () {
  const filterState = {
    query: '',
    category: 'All',
    difficulty: 'All'
  };

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function getFiltered() {
    if (!window.MLCatalog) return [];
    const q = filterState.query.trim().toLowerCase();
    return window.MLCatalog.ALGORITHMS.filter((a) => {
      if (filterState.category !== 'All' && a.category !== filterState.category) return false;
      if (filterState.difficulty !== 'All' && a.difficulty !== filterState.difficulty) return false;
      if (q) {
        const hit =
          a.title.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.teaches.some((t) => t.toLowerCase().includes(q));
        if (!hit) return false;
      }
      return true;
    });
  }

  function renderGalleryCards() {
    const grid = document.getElementById('galleryGrid');
    const countEl = document.getElementById('galleryCount');
    if (!grid || !window.MLCatalog) return;

    const all = window.MLCatalog.ALGORITHMS;
    const matches = getFiltered();
    if (countEl) countEl.innerHTML = `<strong>${matches.length}</strong> of ${all.length}`;

    if (!matches.length) {
      grid.innerHTML = `
        <div class="gallery-empty portal-card">
          <h3>No matching topics</h3>
          <button type="button" class="btn btn-primary btn-sm" id="galleryEmptyResetBtn">Reset filters</button>
        </div>
      `;
      const resetBtn = document.getElementById('galleryEmptyResetBtn');
      if (resetBtn) resetBtn.addEventListener('click', resetFilters);
      return;
    }

    grid.innerHTML = matches
      .map((algo) => {
        const thumb = window.MLThumbnails ? window.MLThumbnails.makeSVG(algo.svgType, algo.colorToken) : '';
        return `
          <button type="button" class="viz-card" data-open-algo="${escapeHtml(algo.id)}">
            <div class="viz-card-thumb">${thumb}</div>
            <div class="viz-card-body">
              <div class="viz-card-cat" style="color:${algo.colorToken};">${escapeHtml(algo.category)}</div>
              <h3 class="viz-card-title">${escapeHtml(algo.title)}</h3>
              <p class="viz-card-desc">${escapeHtml(algo.description)}</p>
              <div class="viz-card-meta">
                <span>${escapeHtml(algo.difficulty)}</span>
                <span class="viz-card-cta">Open &rarr;</span>
              </div>
            </div>
          </button>
        `;
      })
      .join('');

    grid.querySelectorAll('[data-open-algo]').forEach((btn) => {
      btn.addEventListener('click', () => window.MLPortal.openAlgorithm(btn.getAttribute('data-open-algo')));
    });
  }

  function syncFilterButtons() {
    document.querySelectorAll('[data-gal-cat]').forEach((b) => b.classList.toggle('active', b.getAttribute('data-gal-cat') === filterState.category));
    document.querySelectorAll('[data-gal-diff]').forEach((b) => b.classList.toggle('active', b.getAttribute('data-gal-diff') === filterState.difficulty));
  }

  function resetFilters() {
    filterState.query = '';
    filterState.category = 'All';
    filterState.difficulty = 'All';
    const input = document.getElementById('gallerySearchInput');
    if (input) input.value = '';
    syncFilterButtons();
    renderGalleryCards();
  }

  function renderGallery() {
    const root = document.getElementById('galleryRoot');
    if (!root || !window.MLCatalog) return;

    const catPills = window.MLCatalog.CATEGORIES.map(
      (cat) => `<button type="button" class="filter-pill ${cat === filterState.category ? 'active' : ''}" data-gal-cat="${escapeHtml(cat)}">${escapeHtml(cat)}</button>`
    ).join('');

    const diffPills = ['All', 'Beginner', 'Intermediate', 'Advanced']
      .map((d) => `<button type="button" class="filter-pill ${d === filterState.difficulty ? 'active' : ''}" data-gal-diff="${d}">${d}</button>`)
      .join('');

    root.innerHTML = `
      <div class="gallery-header">
        <div>
          <h1 class="page-title">Visualizations</h1>
          <p class="page-sub">${window.MLCatalog.ALGORITHMS.length} interactive algorithms — filter by topic or level.</p>
        </div>
        <button type="button" class="btn btn-sm" id="galleryResetTopBtn">Reset</button>
      </div>

      <div class="gallery-filters portal-card">
        <div class="gallery-search-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.34-4.34"></path>
          </svg>
          <input type="search" id="gallerySearchInput" class="gallery-search-input" placeholder="Filter algorithms or concepts...">
        </div>

        <div class="filter-pills">${catPills}</div>

        <div class="filter-footer-row">
          <div class="filter-pills">${diffPills}</div>
          <div class="gallery-count" id="galleryCount"></div>
        </div>
      </div>

      <div class="viz-grid" id="galleryGrid"></div>
    `;

    const input = document.getElementById('gallerySearchInput');
    if (input) input.addEventListener('input', (e) => { filterState.query = e.target.value; renderGalleryCards(); });

    const resetTop = document.getElementById('galleryResetTopBtn');
    if (resetTop) resetTop.addEventListener('click', resetFilters);

    root.querySelectorAll('[data-gal-cat]').forEach((btn) => {
      btn.addEventListener('click', () => { filterState.category = btn.getAttribute('data-gal-cat'); syncFilterButtons(); renderGalleryCards(); });
    });
    root.querySelectorAll('[data-gal-diff]').forEach((btn) => {
      btn.addEventListener('click', () => { filterState.difficulty = btn.getAttribute('data-gal-diff'); syncFilterButtons(); renderGalleryCards(); });
    });

    window.addEventListener('mlas:gallery-filter', (e) => {
      if (e.detail && e.detail.category) {
        filterState.category = e.detail.category;
        syncFilterButtons();
        renderGalleryCards();
      }
    });

    renderGalleryCards();
  }

  window.MLGallery = { renderGallery, resetFilters };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderGallery);
  else renderGallery();
})();
