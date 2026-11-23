/* ============================================================================
   ML Algo Studio — Portal Router, Search Modal, Theme & Surface Controller
   ============================================================================ */

(function () {
  const THEME_KEY = 'mlas_theme';
  const SURFACE_KEY = 'mlas_surface';
  const VALID_VIEWS = ['home', 'visualizations', 'studio', 'lab', 'path', 'glossary', 'about'];

  const state = {
    view: 'home',
    labId: null,
    theme: 'light',
    surface: 'soft',
    searchOpen: false,
    mobileMenuOpen: false
  };

  const getEl = (id) => document.getElementById(id);

  function applyTheme(theme) {
    state.theme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', state.theme);
    try { localStorage.setItem(THEME_KEY, state.theme); } catch (_) {}

    const btn = getEl('themeToggleBtn');
    if (btn) {
      btn.setAttribute('aria-pressed', String(state.theme === 'dark'));
      const label = btn.querySelector('.mode-btn-text');
      const icon = btn.querySelector('.mode-icon');
      if (label) label.textContent = state.theme === 'dark' ? 'Dark' : 'Light';
      if (icon) {
        icon.innerHTML = state.theme === 'dark'
          ? '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>'
          : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
      }
    }
    window.dispatchEvent(new CustomEvent('mlas:theme-change', { detail: { theme: state.theme } }));
  }

  function applySurface(surface) {
    state.surface = surface === 'flat' ? 'flat' : 'soft';
    document.documentElement.setAttribute('data-surface', state.surface);
    try { localStorage.setItem(SURFACE_KEY, state.surface); } catch (_) {}

    const btn = getEl('surfaceToggleBtn');
    if (btn) {
      btn.setAttribute('aria-pressed', String(state.surface === 'flat'));
      const label = btn.querySelector('.mode-btn-text');
      if (label) label.textContent = state.surface === 'flat' ? 'Flat' : 'Soft';
    }
    window.dispatchEvent(new CustomEvent('mlas:surface-change', { detail: { surface: state.surface } }));
  }

  function initPreferences() {
    let savedTheme = null, savedSurface = null;
    try {
      savedTheme = localStorage.getItem(THEME_KEY);
      savedSurface = localStorage.getItem(SURFACE_KEY);
    } catch (_) {}
    if (!savedTheme) {
      savedTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    applyTheme(savedTheme);
    applySurface(savedSurface || 'soft');
  }

  function parseRouteFromLocation() {
    const clean = (window.location.hash || '').replace(/^#\/?/, '');
    const parts = clean.split('/');
    const head = (parts[0] || '').split('?')[0].toLowerCase();
    if (head === 'lab' && parts[1]) {
      return { view: 'lab', labId: parts[1] };
    }
    if (VALID_VIEWS.includes(head) && head !== 'lab') {
      return { view: head, labId: null };
    }
    const params = new URLSearchParams(window.location.search);
    if (params.has('algo') || params.has('preset') || params.has('duel')) {
      return { view: 'studio', labId: null };
    }
    return { view: 'home', labId: null };
  }

  function setView(viewName, options) {
    const opts = options || {};
    const target = VALID_VIEWS.includes(viewName) ? viewName : 'home';
    state.view = target;

    VALID_VIEWS.forEach((v) => {
      const section = getEl('view-' + v);
      if (section) section.classList.toggle('hidden', v !== target);
    });

    const navHighlight = target === 'lab' ? 'visualizations' : target;
    document.querySelectorAll('[data-nav-view]').forEach((link) => {
      const isActive = link.getAttribute('data-nav-view') === navHighlight;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    if (state.mobileMenuOpen) toggleMobileMenu(false);

    if (!opts.skipHash) {
      const desiredHash = target === 'lab' && state.labId ? `#lab/${state.labId}` : `#${target}`;
      if (window.location.hash !== desiredHash) {
        window.history.pushState(null, '', window.location.pathname + window.location.search + desiredHash);
      }
    }

    if (target === 'studio') {
      requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
    }

    window.dispatchEvent(new CustomEvent('mlas:view-change', { detail: { view: target } }));
    if (!opts.keepScroll) window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function openStudio(studioId) {
    setView('studio');
    if (studioId) {
      const select = getEl('algoSelect');
      if (select && select.value !== studioId) {
        select.value = studioId;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }

  function openAlgorithm(algoId) {
    if (!window.MLCatalog) return;
    const item = window.MLCatalog.getById(algoId) || window.MLCatalog.getByStudioId(algoId);
    if (!item) {
      setView('visualizations');
      return;
    }
    if (item.mode === 'studio' && item.studioId) {
      openStudio(item.studioId);
    } else {
      state.labId = item.id;
      setView('lab');
      if (window.MLLabRunner) window.MLLabRunner.openLab(item.id);
    }
  }

  function openGalleryWithFilter(category) {
    setView('visualizations');
    window.dispatchEvent(new CustomEvent('mlas:gallery-filter', { detail: { category: category || 'All' } }));
  }

  function toggleMobileMenu(force) {
    state.mobileMenuOpen = typeof force === 'boolean' ? force : !state.mobileMenuOpen;
    const drawer = getEl('mobileDrawer');
    const btn = getEl('mobileMenuBtn');
    if (drawer) drawer.classList.toggle('hidden', !state.mobileMenuOpen);
    if (btn) btn.setAttribute('aria-expanded', String(state.mobileMenuOpen));
  }

  function openSearch() {
    state.searchOpen = true;
    const modal = getEl('searchModal');
    const input = getEl('searchModalInput');
    if (modal) modal.classList.remove('hidden');
    if (input) {
      input.value = '';
      renderSearchResults('');
      setTimeout(() => input.focus(), 10);
    }
  }

  function closeSearch() {
    state.searchOpen = false;
    const modal = getEl('searchModal');
    if (modal) modal.classList.add('hidden');
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function renderSearchResults(query) {
    const container = getEl('searchModalResults');
    if (!container || !window.MLCatalog) return;

    const q = (query || '').trim().toLowerCase();
    const list = window.MLCatalog.ALGORITHMS;
    const matches = q
      ? list.filter((a) =>
          a.title.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.teaches.some((t) => t.toLowerCase().includes(q))
        )
      : list.slice(0, 12);

    if (!matches.length) {
      container.innerHTML = `<div class="search-empty">No algorithms matching &ldquo;${escapeHtml(query)}&rdquo;.</div>`;
      return;
    }

    container.innerHTML = matches
      .map((algo) => `
        <button type="button" class="search-result-item" data-search-id="${escapeHtml(algo.id)}">
          <div class="search-result-main">
            <div class="search-result-title-row">
              <span class="search-result-title">${escapeHtml(algo.title)}</span>
              <span class="pill-badge">${escapeHtml(algo.category)}</span>
            </div>
            <div class="search-result-desc">${escapeHtml(algo.description)}</div>
          </div>
          <span aria-hidden="true" style="color:var(--text-muted);font-size:14px;">&rarr;</span>
        </button>
      `)
      .join('');

    container.querySelectorAll('[data-search-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-search-id');
        closeSearch();
        openAlgorithm(id);
      });
    });
  }

  function bindEvents() {
    document.querySelectorAll('[data-nav-view]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        setView(el.getAttribute('data-nav-view'));
      });
    });

    document.querySelectorAll('[data-footer-category]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openGalleryWithFilter(el.getAttribute('data-footer-category'));
      });
    });

    const themeBtn = getEl('themeToggleBtn');
    if (themeBtn) themeBtn.addEventListener('click', () => applyTheme(state.theme === 'dark' ? 'light' : 'dark'));

    const surfaceBtn = getEl('surfaceToggleBtn');
    if (surfaceBtn) surfaceBtn.addEventListener('click', () => applySurface(state.surface === 'flat' ? 'soft' : 'flat'));

    const mobileBtn = getEl('mobileMenuBtn');
    if (mobileBtn) mobileBtn.addEventListener('click', () => toggleMobileMenu());

    const openSearchBtn = getEl('openSearchBtn');
    if (openSearchBtn) openSearchBtn.addEventListener('click', openSearch);

    const closeSearchBtn = getEl('closeSearchBtn');
    if (closeSearchBtn) closeSearchBtn.addEventListener('click', closeSearch);

    const searchOverlay = getEl('searchModal');
    if (searchOverlay) searchOverlay.addEventListener('click', (e) => { if (e.target === searchOverlay) closeSearch(); });

    const searchInput = getEl('searchModalInput');
    if (searchInput) searchInput.addEventListener('input', (e) => renderSearchResults(e.target.value));

    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        state.searchOpen ? closeSearch() : openSearch();
      } else if (e.key === 'Escape' && state.searchOpen) {
        closeSearch();
      }
    });

    window.addEventListener('hashchange', () => {
      const r = parseRouteFromLocation();
      if (r.view === 'lab' && r.labId) {
        state.labId = r.labId;
        setView('lab', { skipHash: true });
        if (window.MLLabRunner) window.MLLabRunner.openLab(r.labId);
      } else {
        setView(r.view, { skipHash: true });
      }
    });

    const algoSelect = getEl('algoSelect');
    const crumbName = getEl('studioCrumbAlgo');
    const syncCrumb = () => {
      if (!algoSelect || !crumbName) return;
      const opt = algoSelect.options[algoSelect.selectedIndex];
      if (opt) crumbName.textContent = opt.textContent;
    };
    if (algoSelect) {
      algoSelect.addEventListener('change', syncCrumb);
      setTimeout(syncCrumb, 50);
    }
  }

  function init() {
    initPreferences();
    bindEvents();
    const r = parseRouteFromLocation();
    if (r.view === 'lab' && r.labId) {
      state.labId = r.labId;
      setView('lab', { skipHash: true, keepScroll: true });
      if (window.MLLabRunner) window.MLLabRunner.openLab(r.labId);
    } else {
      setView(r.view, { skipHash: true, keepScroll: true });
    }
  }

  window.MLPortal = {
    setView,
    openStudio,
    openAlgorithm,
    openGalleryWithFilter,
    openSearch,
    closeSearch,
    applyTheme,
    applySurface,
    getState: () => ({ ...state })
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
