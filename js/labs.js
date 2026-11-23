/* ============================================================================
   ML Algo Studio — Interactive Lab Runner (Powers the 20 Additional Visualizers)
   ============================================================================ */

(function () {
  let activeId = null;
  let activeState = {};
  let activeBreakNote = '';

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function defaultsFor(def) {
    const out = {};
    (def.controls || []).forEach((c) => {
      out[c.id] = c.value;
    });
    return out;
  }

  function renderMetrics(items) {
    const el = document.getElementById('labMetrics');
    if (!el) return;
    el.innerHTML = items
      .map(
        (m) => `
          <div class="metric-card">
            <div class="metric-label">${escapeHtml(m.label)}</div>
            <div class="metric-value">${escapeHtml(m.value)}</div>
          </div>
        `
      )
      .join('');
  }

  function redraw() {
    if (!activeId || !window.MLLabsRegistry) return;
    const def = window.MLLabsRegistry[activeId];
    const canvas = document.getElementById('labCanvas');
    if (!def || !canvas) return;
    def.render(canvas, activeState, { setMetrics: renderMetrics });
  }

  function syncControlsUI(def) {
    (def.controls || []).forEach((c) => {
      const input = document.getElementById('lab-ctrl-' + c.id);
      if (input) input.value = activeState[c.id];
      const valEl = document.getElementById('lab-val-' + c.id);
      if (valEl) valEl.textContent = typeof activeState[c.id] === 'number' ? String(activeState[c.id]) : '';
    });
  }

  function openLab(id) {
    const root = document.getElementById('labRoot');
    const reg = window.MLLabsRegistry || {};
    const def = reg[id];
    const meta = window.MLCatalog ? window.MLCatalog.getById(id) : null;
    if (!root || !def || !meta) return;

    activeId = id;
    activeState = defaultsFor(def);
    activeBreakNote = '';

    const controlsHtml = (def.controls || [])
      .map((c) => {
        if (c.type === 'select') {
          const opts = c.options
            .map(([v, lbl]) => `<option value="${escapeHtml(v)}" ${v === activeState[c.id] ? 'selected' : ''}>${escapeHtml(lbl)}</option>`)
            .join('');
          return `
            <div class="control-row">
              <label class="control-label" for="lab-ctrl-${c.id}"><span>${escapeHtml(c.label)}</span></label>
              <select id="lab-ctrl-${c.id}" data-lab-ctrl="${c.id}">${opts}</select>
            </div>
          `;
        }
        return `
          <div class="control-row">
            <label class="control-label" for="lab-ctrl-${c.id}">
              <span>${escapeHtml(c.label)}</span>
              <span class="control-val" id="lab-val-${c.id}">${activeState[c.id]}</span>
            </label>
            <input type="range" id="lab-ctrl-${c.id}" data-lab-ctrl="${c.id}" min="${c.min}" max="${c.max}" step="${c.step}" value="${activeState[c.id]}">
          </div>
        `;
      })
      .join('');

    const navChips = (ids, arrow) =>
      (ids || [])
        .map((nid) => {
          const target = window.MLCatalog.getById(nid);
          if (!target) return '';
          return `<button type="button" class="studio-nav-chip live" data-open-algo="${escapeHtml(target.id)}">${arrow} ${escapeHtml(target.title)}</button>`;
        })
        .filter(Boolean)
        .join('');

    root.innerHTML = `
      <div class="lab-shell">
        <div class="studio-breadcrumb" style="margin-bottom:14px;">
          <a href="#home" data-nav-view="home">Home</a>
          <span aria-hidden="true">/</span>
          <a href="#visualizations" data-nav-view="visualizations">Visualizations</a>
          <span aria-hidden="true">/</span>
          <strong>${escapeHtml(meta.title)}</strong>
        </div>

        <div class="lab-head">
          <div>
            <div class="viz-card-cat" style="color:${meta.colorToken};margin-bottom:4px;">${escapeHtml(meta.category)} &middot; ${escapeHtml(meta.difficulty)}</div>
            <h1 class="page-title">${escapeHtml(meta.title)}</h1>
            <p class="page-sub">${escapeHtml(meta.hook || meta.description)}</p>
          </div>
        </div>

        <div class="break-banner hidden" id="labBreakBanner" role="alert" style="margin-bottom:14px;"></div>

        <div class="lab-grid">
          <div class="lab-stage-col">
            <div class="canvas-card lab-canvas-card">
              <div class="lab-canvas-wrap">
                <canvas id="labCanvas" aria-label="${escapeHtml(meta.title)} interactive canvas"></canvas>
              </div>
            </div>
            <div class="metrics-grid" id="labMetrics" style="margin-top:14px;"></div>
          </div>

          <aside class="lab-controls-col">
            <div class="panel-card">
              <h2 class="section-label">Controls</h2>
              ${controlsHtml}
            </div>

            ${
              def.breakIt
                ? `
              <div class="panel-card break-card">
                <div class="card-header-row compact-row">
                  <h2 class="section-label">Break It</h2>
                  <button type="button" class="btn btn-sm" id="labResetBtn">Reset</button>
                </div>
                <button type="button" class="btn btn-sm lab-break-btn" id="labBreakBtn">${escapeHtml(def.breakIt.label)}</button>
              </div>
            `
                : ''
            }

            <div class="panel-card">
              <h2 class="section-label">Covers</h2>
              <div class="lab-covers-tags">
                ${meta.teaches.map((t) => `<span class="pill-badge">${escapeHtml(t)}</span>`).join('')}
              </div>
            </div>
          </aside>
        </div>

        <div class="studio-path-nav" style="padding:0;margin-top:24px;">
          <div class="studio-path-col">
            <span class="studio-path-label">Prerequisites</span>
            <div class="studio-path-chips">${navChips(meta.prerequisites, '&larr;') || '<span class="studio-path-none">Great starting point</span>'}</div>
          </div>
          <div class="studio-path-col">
            <span class="studio-path-label">Next</span>
            <div class="studio-path-chips">${navChips(meta.next, '&rarr;') || '<span class="studio-path-none">Explore the Gallery</span>'}</div>
          </div>
        </div>
      </div>
    `;

    root.querySelectorAll('[data-nav-view]').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        window.MLPortal.setView(a.getAttribute('data-nav-view'));
      });
    });

    root.querySelectorAll('[data-open-algo]').forEach((b) => {
      b.addEventListener('click', () => window.MLPortal.openAlgorithm(b.getAttribute('data-open-algo')));
    });

    root.querySelectorAll('[data-lab-ctrl]').forEach((el) => {
      const cid = el.getAttribute('data-lab-ctrl');
      const evt = el.tagName === 'SELECT' ? 'change' : 'input';
      el.addEventListener(evt, () => {
        activeState[cid] = el.tagName === 'SELECT' ? el.value : Number(el.value);
        const valEl = document.getElementById('lab-val-' + cid);
        if (valEl) valEl.textContent = String(activeState[cid]);
        redraw();
      });
    });

    const breakBtn = document.getElementById('labBreakBtn');
    const resetBtn = document.getElementById('labResetBtn');
    const banner = document.getElementById('labBreakBanner');

    if (breakBtn && def.breakIt) {
      breakBtn.addEventListener('click', () => {
        def.breakIt.apply(activeState);
        syncControlsUI(def);
        activeBreakNote = def.breakIt.note;
        if (banner) {
          banner.innerHTML = `
            <div class="break-banner-text">
              <strong>${escapeHtml(def.breakIt.label)}</strong>
              <span>${escapeHtml(activeBreakNote)}</span>
            </div>
            <button type="button" class="btn btn-sm" id="labDismissBreak">Dismiss</button>
          `;
          banner.classList.remove('hidden');
          const d = document.getElementById('labDismissBreak');
          if (d) d.addEventListener('click', () => banner.classList.add('hidden'));
        }
        redraw();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        activeState = defaultsFor(def);
        syncControlsUI(def);
        if (banner) banner.classList.add('hidden');
        redraw();
      });
    }

    requestAnimationFrame(redraw);
  }

  window.addEventListener('resize', () => {
    if (activeId) requestAnimationFrame(redraw);
  });
  window.addEventListener('mlas:theme-change', () => {
    if (activeId) requestAnimationFrame(redraw);
  });

  window.MLLabRunner = { openLab, redraw };
})();
