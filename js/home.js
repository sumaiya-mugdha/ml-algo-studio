/* ============================================================================
   ML Algo Studio — Home View (Crisp Editorial Layout + Live 2D Classifier)
   ============================================================================ */

(function () {
  let heroPoints = [];
  let heroClass = 0;
  let heroW = { w1: 1.0, w2: -0.9, b: 0.0 };
  let heroCanvasEl = null;
  let heroRaf = null;
  let heroBound = false;

  function seedHeroPoints() {
    heroPoints = [
      { x: -2.6, y: 1.8, c: 0 }, { x: -2.0, y: 2.6, c: 0 }, { x: -1.4, y: 1.3, c: 0 },
      { x: -3.1, y: 0.9, c: 0 }, { x: -1.8, y: 3.1, c: 0 }, { x: -0.8, y: 2.3, c: 0 },
      { x: -2.4, y: 0.4, c: 0 }, { x: -0.5, y: 1.5, c: 0 },
      { x: 2.3, y: -1.6, c: 1 }, { x: 1.7, y: -2.5, c: 1 }, { x: 1.1, y: -1.1, c: 1 },
      { x: 3.0, y: -0.8, c: 1 }, { x: 1.9, y: -3.0, c: 1 }, { x: 0.7, y: -2.1, c: 1 },
      { x: 2.6, y: -0.3, c: 1 }, { x: 0.5, y: -1.4, c: 1 }
    ];
    fitHeroLogistic();
  }

  function fitHeroLogistic() {
    let w1 = 0.4, w2 = -0.4, b = 0;
    const lr = 0.22;
    const n = heroPoints.length || 1;
    for (let iter = 0; iter < 80; iter++) {
      let g1 = 0, g2 = 0, gb = 0;
      for (let i = 0; i < heroPoints.length; i++) {
        const p = heroPoints[i];
        const z = w1 * p.x + w2 * p.y + b;
        const pred = 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, z))));
        const err = pred - p.c;
        g1 += err * p.x; g2 += err * p.y; gb += err;
      }
      w1 -= (lr / n) * g1 + 0.004 * w1;
      w2 -= (lr / n) * g2 + 0.004 * w2;
      b -= (lr / n) * gb;
    }
    heroW = { w1, w2, b };
  }

  function drawHeroCanvas() {
    if (!heroCanvasEl) return;
    const rect = heroCanvasEl.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const dpr = window.devicePixelRatio || 1;
    const w = rect.width, h = rect.height;
    if (heroCanvasEl.width !== Math.round(w * dpr) || heroCanvasEl.height !== Math.round(h * dpr)) {
      heroCanvasEl.width = Math.round(w * dpr);
      heroCanvasEl.height = Math.round(h * dpr);
    }
    const ctx = heroCanvasEl.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    ctx.fillStyle = isDark ? '#0f131a' : '#ffffff';
    ctx.fillRect(0, 0, w, h);

    const toPx = (wx) => ((wx + 4.5) / 9) * w;
    const toPy = (wy) => h - ((wy + 4.5) / 9) * h;

    const step = 10;
    for (let px = 0; px < w; px += step) {
      for (let py = 0; py < h; py += step) {
        const wx = ((px + step * 0.5) / w) * 9 - 4.5;
        const wy = (1 - (py + step * 0.5) / h) * 9 - 4.5;
        const z = heroW.w1 * wx + heroW.w2 * wy + heroW.b;
        const prob = 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, z))));
        ctx.fillStyle = prob >= 0.5
          ? `rgba(230, 159, 0, ${0.05 + (prob - 0.5) * 0.22})`
          : `rgba(0, 114, 178, ${0.05 + (0.5 - prob) * 0.22})`;
        ctx.fillRect(px, py, step, step);
      }
    }

    ctx.strokeStyle = isDark ? '#1f2633' : '#f1f5f9';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(toPx(0), 0); ctx.lineTo(toPx(0), h);
    ctx.moveTo(0, toPy(0)); ctx.lineTo(w, toPy(0));
    ctx.stroke();

    if (Math.abs(heroW.w2) > 1e-4) {
      ctx.beginPath();
      ctx.moveTo(toPx(-4.5), toPy((-heroW.b - heroW.w1 * -4.5) / heroW.w2));
      ctx.lineTo(toPx(4.5), toPy((-heroW.b - heroW.w1 * 4.5) / heroW.w2));
      ctx.strokeStyle = isDark ? '#f4f4f5' : '#18181b';
      ctx.lineWidth = 2.2;
      ctx.stroke();
    }

    const borderStroke = isDark ? '#0f131a' : '#ffffff';
    for (const p of heroPoints) {
      ctx.beginPath();
      ctx.arc(toPx(p.x), toPy(p.y), 5.2, 0, Math.PI * 2);
      ctx.fillStyle = p.c === 0 ? '#0072b2' : '#e69f00';
      ctx.fill();
      ctx.strokeStyle = borderStroke;
      ctx.lineWidth = 1.6;
      ctx.stroke();
    }

    const accEl = document.getElementById('heroAccBadge');
    if (accEl && heroPoints.length > 0) {
      let ok = 0;
      for (const p of heroPoints) if ((heroW.w1 * p.x + heroW.w2 * p.y + heroW.b >= 0 ? 1 : 0) === p.c) ok++;
      accEl.textContent = `${Math.round((ok / heroPoints.length) * 100)}% accuracy · ${heroPoints.length} pts`;
    }
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function renderHome() {
    const root = document.getElementById('homeRoot');
    if (!root || !window.MLCatalog) return;

    const all = window.MLCatalog.ALGORITHMS;
    const featuredIds = ['linear-regression', 'gradient-descent', 'logistic-regression', 'decision-boundaries', 'support-vector-machines', 'decision-trees', 'k-means', 'neural-network'];
    const featured = featuredIds.map((id) => window.MLCatalog.getById(id)).filter(Boolean);

    const featuredCards = featured
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

    const pathStrip = window.MLCatalog.LEARNING_PATH.map(
      (stage) => `
        <a href="#path" class="path-teaser-step" data-nav-view="path">
          <span class="path-step-num" style="border-color:${stage.colorToken};color:${stage.colorToken};">${stage.num}</span>
          <div>
            <div class="path-step-name">${escapeHtml(stage.name)}</div>
            <div class="path-step-count">${stage.items.length} topics</div>
          </div>
        </a>
      `
    ).join('');

    root.innerHTML = `
      <div class="home-hero">
        <div class="home-hero-copy">
          <h1 class="home-headline">Machine learning, <span>made visual.</span></h1>
          <p class="home-lead">
            Explore ${all.length} interactive algorithms directly in your browser. Drag points, tune parameters, compare models side-by-side, and break them on purpose.
          </p>
          <div class="home-cta-row">
            <button type="button" class="btn btn-primary home-cta-btn" id="heroBrowseBtn">Browse ${all.length} Visualizations</button>
            <button type="button" class="btn home-cta-btn" id="heroOpenStudioBtn">Open Studio</button>
            <button type="button" class="btn home-cta-btn" id="heroPathBtn">Learning Path</button>
          </div>
        </div>

        <div class="home-hero-visual">
          <div class="hero-canvas-card portal-card">
            <div class="hero-canvas-bar">
              <span class="hero-canvas-title">Click to add points</span>
              <span class="coord-readout" id="heroAccBadge">100% accuracy</span>
            </div>
            <div class="hero-canvas-wrap">
              <canvas id="heroCanvas" tabindex="0" aria-label="Interactive 2D linear classifier canvas. Click to add points."></canvas>
            </div>
            <div class="hero-canvas-controls">
              <div class="hero-class-toggle" role="group" aria-label="Point class">
                <button type="button" class="btn btn-sm active" id="heroClassABtn">
                  <span class="dot-swatch" style="background:#0072b2;"></span> Class A
                </button>
                <button type="button" class="btn btn-sm" id="heroClassBBtn">
                  <span class="dot-swatch" style="background:#e69f00;"></span> Class B
                </button>
              </div>
              <button type="button" class="btn btn-sm" id="heroResetBtn">Reset</button>
            </div>
          </div>
        </div>
      </div>

      <section class="home-section">
        <div class="home-section-head">
          <h2 class="home-section-title">Learning Path</h2>
          <a href="#path" class="home-section-link" data-nav-view="path">Full roadmap &rarr;</a>
        </div>
        <div class="path-teaser-grid">${pathStrip}</div>
      </section>

      <section class="home-section">
        <div class="home-section-head">
          <h2 class="home-section-title">Featured Visualizations</h2>
          <a href="#visualizations" class="home-section-link" data-nav-view="visualizations">All ${all.length} topics &rarr;</a>
        </div>
        <div class="viz-grid">${featuredCards}</div>
      </section>
    `;

    const openStudioBtn = document.getElementById('heroOpenStudioBtn');
    if (openStudioBtn) openStudioBtn.addEventListener('click', () => window.MLPortal.openStudio('neural_net'));
    const browseBtn = document.getElementById('heroBrowseBtn');
    if (browseBtn) browseBtn.addEventListener('click', () => window.MLPortal.setView('visualizations'));
    const pathBtn = document.getElementById('heroPathBtn');
    if (pathBtn) pathBtn.addEventListener('click', () => window.MLPortal.setView('path'));

    root.querySelectorAll('[data-nav-view]').forEach((el) => {
      el.addEventListener('click', (e) => { e.preventDefault(); window.MLPortal.setView(el.getAttribute('data-nav-view')); });
    });
    root.querySelectorAll('[data-open-algo]').forEach((btn) => {
      btn.addEventListener('click', () => window.MLPortal.openAlgorithm(btn.getAttribute('data-open-algo')));
    });

    const classABtn = document.getElementById('heroClassABtn');
    const classBBtn = document.getElementById('heroClassBBtn');
    const resetBtn = document.getElementById('heroResetBtn');
    if (classABtn && classBBtn) {
      classABtn.addEventListener('click', () => { heroClass = 0; classABtn.classList.add('active'); classBBtn.classList.remove('active'); });
      classBBtn.addEventListener('click', () => { heroClass = 1; classBBtn.classList.add('active'); classABtn.classList.remove('active'); });
    }
    if (resetBtn) resetBtn.addEventListener('click', () => { seedHeroPoints(); drawHeroCanvas(); });

    heroCanvasEl = document.getElementById('heroCanvas');
    if (heroCanvasEl) {
      heroCanvasEl.addEventListener('click', (e) => {
        const rect = heroCanvasEl.getBoundingClientRect();
        heroPoints.push({
          x: ((e.clientX - rect.left) / rect.width) * 9 - 4.5,
          y: (1 - (e.clientY - rect.top) / rect.height) * 9 - 4.5,
          c: heroClass
        });
        fitHeroLogistic();
        drawHeroCanvas();
      });
    }

    seedHeroPoints();
    requestAnimationFrame(drawHeroCanvas);

    if (!heroBound) {
      heroBound = true;
      window.addEventListener('resize', () => { if (heroRaf) cancelAnimationFrame(heroRaf); heroRaf = requestAnimationFrame(drawHeroCanvas); });
      window.addEventListener('mlas:theme-change', () => requestAnimationFrame(drawHeroCanvas));
      window.addEventListener('mlas:view-change', (e) => { if (e.detail && e.detail.view === 'home') requestAnimationFrame(drawHeroCanvas); });
    }
  }

  window.MLHome = { renderHome, drawHeroCanvas };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderHome);
  else renderHome();
})();
