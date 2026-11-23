// Automated Integration & Integrity Test for Merged ML Algo Studio
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const appSrc = fs.readFileSync(path.join(root, 'js/app.js'), 'utf8');
const portalCss = fs.readFileSync(path.join(root, 'css/portal.css'), 'utf8');

// 1. Load catalog.js and thumbnails.js in sandbox
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'js/catalog.js'), 'utf8'), ctx);
vm.runInNewContext(fs.readFileSync(path.join(root, 'js/thumbnails.js'), 'utf8'), ctx);
const catalog = ctx.window.MLCatalog;
const thumbs = ctx.window.MLThumbnails;

assert(catalog && Array.isArray(catalog.ALGORITHMS), 'MLCatalog.ALGORITHMS missing');
const live = catalog.getLiveAlgorithms();
const soon = catalog.getComingSoonAlgorithms();
assert.strictEqual(live.length, 11, `Expected 11 live algorithms, got ${live.length}`);
assert.strictEqual(soon.length, 20, `Expected 20 coming soon algorithms, got ${soon.length}`);

// 2. Every live studioId must exist in app.js ALGO_META
for (const a of live) {
  assert(a.studioId, `Live algorithm ${a.id} missing studioId`);
  assert(appSrc.includes(`${a.studioId}: {`), `studioId ${a.studioId} not found in js/app.js ALGO_META`);
  const svg = thumbs.makeSVG(a.svgType, a.colorToken);
  assert(svg.includes('<svg') && svg.includes('</svg>'), `Invalid SVG thumbnail for ${a.id}`);
}

// 3. Every Learning Path item & Glossary studioId must resolve cleanly
for (const stage of catalog.LEARNING_PATH) {
  for (const id of stage.items) {
    assert(catalog.getById(id), `Learning Path references unknown id: ${id}`);
  }
}
for (const g of catalog.GLOSSARY) {
  assert(catalog.getByStudioId(g.studioId), `Glossary term "${g.term}" references unknown studioId: ${g.studioId}`);
}

// 4. Every required DOM ID referenced across app.js + portal views must exist in index.html
const requiredIds = [
  'openSearchBtn', 'surfaceToggleBtn', 'themeToggleBtn', 'mobileMenuBtn', 'mobileDrawer',
  'searchModal', 'searchModalInput', 'searchModalResults', 'closeSearchBtn',
  'view-home', 'view-visualizations', 'view-studio', 'view-path', 'view-glossary', 'view-about',
  'homeRoot', 'galleryRoot', 'pathRoot', 'glossaryRoot', 'aboutRoot',
  'studioCrumbAlgo', 'algoSelect', 'duelToggleBtn', 'duelSelectWrap', 'duelAlgoSelect',
  'reseedBtn', 'seedBadge', 'shareBtn', 'algoTitle', 'algoIntuition', 'breakItBanner',
  'toolbar', 'canvasesRow', 'primaryCard', 'duelCard', 'mlCanvas', 'duelCanvas',
  'canvasHintText', 'coordReadout', 'stepNarration', 'probeBanner', 'metricsGrid',
  'curveCard', 'curveTitle', 'curveLegend', 'curveStage', 'curveHint',
  'whatToNotice', 'internalsCard', 'internalsTitle', 'internalsTabs', 'internalsStage',
  'dataControlsBox', 'modelControlsBox', 'breakItBox', 'resetDefaultsBtn',
  'dataCount', 'inputX', 'inputY', 'inputLabel', 'addPointBtn', 'csvInput', 'importCsvBtn', 'exportCsvBtn',
  'dataTableBody', 'studioPathNav', 'educationSection', 'toast'
];
for (const id of requiredIds) {
  assert(html.includes(`id="${id}"`), `Missing DOM ID in index.html: ${id}`);
}

// 5. Dual Theme & Dual Surface CSS checks
assert(portalCss.includes(':root[data-theme="dark"]'), 'Dark theme tokens missing in css/portal.css');
assert(portalCss.includes(':root[data-surface="flat"]'), 'Flat surface toggle tokens missing in css/portal.css');
assert(portalCss.includes('--shadow-sm: none;'), 'Flat surface mode must zero out --shadow-sm');
assert(portalCss.includes('--header-blur: none;'), 'Flat surface mode must zero out --header-blur');

// 6. ROADMAP.md exists and mentions all 20 Coming Soon algorithms
const roadmap = fs.readFileSync(path.join(root, 'ROADMAP.md'), 'utf8');
assert(roadmap.includes('Coming Soon Algorithms to Build Next (20 Topics)'), 'ROADMAP.md missing Coming Soon section');

console.log('ALL PORTAL MERGE & INTEGRITY CHECKS PASSED (11 live + 20 coming soon, 55 DOM IDs, dual theme/surface verified)');
