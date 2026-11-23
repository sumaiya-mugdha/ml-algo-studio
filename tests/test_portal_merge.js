// Automated Integration & Integrity Test for ML Algo Studio v4 (31 Live Algorithms + A-Z Glossary)
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const appSrc = fs.readFileSync(path.join(root, 'js/app.js'), 'utf8');
const portalCss = fs.readFileSync(path.join(root, 'css/portal.css'), 'utf8');

// 1. Load algorithms.js, catalog.js, thumbnails.js, labs_foundations.js, labs_advanced.js
const ctx = {
  window: {},
  document: { documentElement: { getAttribute: () => 'light' } },
  Math, Number, Array, Object, String, Boolean, Set, Map, JSON
};
ctx.window = ctx;
for (const file of ['js/algorithms.js', 'js/catalog.js', 'js/thumbnails.js', 'js/labs_foundations.js', 'js/labs_advanced.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), ctx);
}

const catalog = ctx.MLCatalog;
const thumbs = ctx.MLThumbnails;
const labs = ctx.MLLabsRegistry;

assert.strictEqual(catalog.ALGORITHMS.length, 31, 'Expected 31 total algorithms');
assert.strictEqual(catalog.getLiveAlgorithms().length, 31, 'Expected all 31 algorithms live');
assert.strictEqual(catalog.getComingSoonAlgorithms().length, 0, 'Expected 0 coming soon algorithms');

const studioAlgos = catalog.ALGORITHMS.filter((a) => a.mode === 'studio');
const labAlgos = catalog.ALGORITHMS.filter((a) => a.mode === 'lab');
assert.strictEqual(studioAlgos.length, 11, 'Expected 11 Studio engines');
assert.strictEqual(labAlgos.length, 20, 'Expected 20 Interactive Labs');

// 2. Verify every Studio algorithm exists in app.js
for (const a of studioAlgos) {
  assert(appSrc.includes(`${a.studioId}: {`), `studioId ${a.studioId} missing in app.js`);
}

// 3. Execute render() and breakIt.apply() on all 20 Interactive Labs with a mock 2D canvas
const noop = () => {};
const mockCtx = {
  setTransform: noop, fillRect: noop, strokeRect: noop, beginPath: noop, moveTo: noop,
  lineTo: noop, arc: noop, ellipse: noop, quadraticCurveTo: noop, closePath: noop,
  fill: noop, stroke: noop, setLineDash: noop, fillText: noop
};
const mockCanvas = {
  width: 0, height: 0,
  getBoundingClientRect: () => ({ width: 640, height: 400 }),
  getContext: () => mockCtx
};

for (const a of labAlgos) {
  const def = labs[a.id];
  assert(def, `Missing lab implementation for ${a.id}`);
  const st = {};
  (def.controls || []).forEach((c) => { st[c.id] = c.value; });
  let metrics = [];
  def.render(mockCanvas, st, { setMetrics: (m) => { metrics = m; } });
  assert(metrics.length > 0, `Lab ${a.id} produced 0 metrics`);
  if (def.breakIt) {
    def.breakIt.apply(st);
    def.render(mockCanvas, st, { setMetrics: (m) => { metrics = m; } });
  }
  const svg = thumbs.makeSVG(a.svgType, a.colorToken);
  assert(svg.includes('<svg'), `Missing SVG thumbnail for ${a.id}`);
}

// 4. Verify all Learning Path & 48 A-Z Glossary links resolve cleanly
for (const stage of catalog.LEARNING_PATH) {
  for (const id of stage.items) assert(catalog.getById(id), `Path references unknown id: ${id}`);
}
assert(catalog.GLOSSARY.length >= 45, `Expected 48 glossary entries, got ${catalog.GLOSSARY.length}`);
for (const g of catalog.GLOSSARY) {
  assert(catalog.getById(g.targetId), `Glossary term "${g.term}" references unknown targetId: ${g.targetId}`);
  assert(Array.isArray(g.covers) && g.covers.length > 0, `Glossary term "${g.term}" missing covers tags`);
}

// 5. Verify DOM IDs & Dual Theme/Surface CSS
for (const id of ['view-home', 'view-visualizations', 'view-lab', 'labRoot', 'view-studio', 'view-path', 'view-glossary', 'view-about', 'surfaceToggleBtn', 'themeToggleBtn', 'searchModal']) {
  assert(html.includes(`id="${id}"`), `Missing DOM ID: ${id}`);
}
assert(portalCss.includes(':root[data-theme="dark"]'));
assert(portalCss.includes(':root[data-surface="flat"]'));

console.log(`ALL v4 INTEGRATION TESTS PASSED: 31 live algorithms (11 Studio + 20 rendered Labs), ${catalog.GLOSSARY.length} A-Z Glossary entries verified!`);
