/* ============================================================================
   ML Algo Studio — Portal Shell Controller (Routing, Search Modal, Theme & Surface)
   ============================================================================ */

(function () {
  const THEME_KEY = 'mlas_theme';
  const SURFACE_KEY = 'mlas_surface';
  const VALID_VIEWS = ['home', 'visualizations', 'studio', 'path', 'glossary', 'about'];

  const state = {
    view: 'home',
    theme: 'light',
    surface: 'soft',
    searchOpen: false,
    mobileMenuOpen: false
  };

  function getEl(id) {
    return document.getElementById(id);
  }

  /* ---- Theme & Surface Mode ---- */
  function applyTheme(theme) {
    state.theme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', state.theme);
    try {
      localStorage.setItem(THEME_KEY, state.theme);
    } catch (_) {}

    const btn = getEl('themeToggleBtn');
    if (btn) {
      btn.setAttribute('aria-pressed', String(state.theme === 'dark'));
      btn.setAttribute('title', state.theme === 'dark' ? 'Switch to Light theme' : 'Switch to Dark theme');
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
    try {
      localStorage.setItem(SURFACE_KEY, state.surface);
    } catch (_) {}

    const btn = getEl('surfaceToggleBtn');
    if (btn) {
      btn.setAttribute('aria-pressed', String(state.surface === 'flat'));
      btn.setAttribute(
        'title',
        state.surface === 'flat'
          ? 'Flat mode active — click for Soft shadows & blur'
          : 'Soft mode active — click for Strict Flat design'
      );
      const label = btn.querySelector('.mode-btn-text');
      if (label) label.textContent = state.surface === 'flat' ? 'Flat' : 'Soft';
    }
    window.dispatchEvent(new CustomEvent('mlas:surface-change', { detail: { surface: state.surface } }));
  }

  function initPreferences() {
    let savedTheme = null;
    let savedSurface = null;
    try {
      savedTheme = localStorage.getItem(THEME_KEY);
      savedSurface = localStorage.getItem(SURFACE_KEY);
    } catch (_) {}

    if (!savedTheme) {
      savedTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    applyTheme(savedTheme);
    applySurface(savedSurface || 'soft');
  }

  /* ---- Routing ---- */
  function parseRouteFromLocation() {
    const rawHash = (window.location.hash || '').replace(/^#\/?/, '').split('?')[0].toLowerCase();
    if (VALID_VIEWS.includes(rawHash)) {
      return rawHash;
    }
    const params = new URLSearchParams(window.location.search);
    if (params.has('algo') || params.has('preset') || params.has('duel')) {
      return 'studio';
    }
    return 'home';
  }

  function setView(viewName, options) {
    const opts = options || {};
    const target = VALID_VIEWS.includes(viewName) ? viewName : 'home';
    state.view = target;

    VALID_VIEWS.forEach((v) => {
      const section = getEl('view-' + v);
      if (section) {
        section.classList.toggle('hidden', v !== target);
      }
    });

    document.querySelectorAll('[data-nav-view]').forEach((link) => {
      const isActive = link.getAttribute('data-nav-view') === target;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    if (state.mobileMenuOpen) {
      toggleMobileMenu(false);
    }

    if (!opts.skipHash) {
      const desiredHash = '#' + target;
      if (window.location.hash !== desiredHash) {
        window.history.pushState(null, '', window.location.pathname + window.location.search + desiredHash);
      }
    }

    if (target === 'studio') {
      // Trigger resize so canvases measure cleanly after becoming visible
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event('resize'));
      });
    }

    window.dispatchEvent(new CustomEvent('mlas:view-change', { detail: { view: target } }));
    if (!opts.keepScroll) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
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

  function openGalleryWithFilter(category) {
    setView('visualizations');
    window.dispatchEvent(new CustomEvent('mlas:gallery-filter', { detail: { category: category || 'All' } }));
  }

  /* ---- Mobile Drawer ---- */
  function toggleMobileMenu(force) {
    state.mobileMenuOpen = typeof force === 'boolean' ? force : !state.mobileMenuOpen;
    const drawer = getEl('mobileDrawer');
    const btn = getEl('mobileMenuBtn');
    if (drawer) drawer.classList.toggle('hidden', !state.mobileMenuOpen);
    if (btn) btn.setAttribute('aria-expanded', String(state.mobileMenuOpen));
  }

  /* ---- Search Modal ---- */
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
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
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
      : window.MLCatalog.getLiveAlgorithms();

    if (!matches.length) {
      container.innerHTML = `<div class="search-empty">No algorithms found matching "<strong>${escapeHtml(query)}</strong>". Try "SVM", "trees", "clustering", or "gradient".</div>`;
      return;
    }

    const heading = q
      ? `<div style="padding:4px 10px 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-muted);">${matches.length} matching topic${matches.length === 1 ? '' : 's'}</div>`
      : `<div style="padding:4px 10px 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-muted);">11 Live Interactive Studio Algorithms</div>`;

    container.innerHTML =
      heading +
      matches
        .map((algo) => {
          const statusBadge = algo.live
            ? '<span class="pill-badge pill-live">Live Studio</span>'
            : '<span class="pill-badge pill-soon">Coming Soon</span>';
          return `
            <button type="button" class="search-result-item" data-search-id="${escapeHtml(algo.id)}">
              <div class="search-result-main">
                <div class="search-result-title-row">
                  <span class="search-result-title">${escapeHtml(algo.title)}</span>
                  <span class="pill-badge">${escapeHtml(algo.category)}</span>
                  ${statusBadge}
                </div>
                <div class="search-result-desc">${escapeHtml(algo.description)}</div>
              </div>
              <span aria-hidden="true" style="color:var(--text-muted);font-size:14px;">&rarr;</span>
            </button>
          `;
        })
        .join('');

    container.querySelectorAll('[data-search-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const algo = window.MLCatalog.getById(btn.getAttribute('data-search-id'));
        closeSearch();
        if (!algo) return;
        if (algo.live && algo.studioId) {
          openStudio(algo.studioId);
        } else {
          openGalleryWithFilter(algo.category);
        }
      });
    });
  }

  /* ---- Wire Events ---- */
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
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        applyTheme(state.theme === 'dark' ? 'light' : 'dark');
      });
    }

    const surfaceBtn = getEl('surfaceToggleBtn');
    if (surfaceBtn) {
      surfaceBtn.addEventListener('click', () => {
        applySurface(state.surface === 'flat' ? 'soft' : 'flat');
      });
    }

    const mobileBtn = getEl('mobileMenuBtn');
    if (mobileBtn) {
      mobileBtn.addEventListener('click', () => toggleMobileMenu());
    }

    const openSearchBtn = getEl('openSearchBtn');
    if (openSearchBtn) {
      openSearchBtn.addEventListener('click', openSearch);
    }

    const closeSearchBtn = getEl('closeSearchBtn');
    if (closeSearchBtn) {
      closeSearchBtn.addEventListener('click', closeSearch);
    }

    const searchOverlay = getEl('searchModal');
    if (searchOverlay) {
      searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) closeSearch();
      });
    }

    const searchInput = getEl('searchModalInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        renderSearchResults(e.target.value);
      });
    }

    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (state.searchOpen) closeSearch();
        else openSearch();
      } else if (e.key === 'Escape' && state.searchOpen) {
        closeSearch();
      }
    });

    window.addEventListener('hashchange', () => {
      setView(parseRouteFromLocation(), { skipHash: true });
    });

    // Update studio breadcrumb label whenever algorithm changes
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
    setView(parseRouteFromLocation(), { skipHash: true, keepScroll: true });
  }

  window.MLPortal = {
    setView,
    openStudio,
    openGalleryWithFilter,
    openSearch,
    closeSearch,
    applyTheme,
    applySurface,
    getState: () => ({ ...state })
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
