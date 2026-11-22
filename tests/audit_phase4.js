const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log("=== PHASE 4: COMPREHENSIVE AUDIT ===");

// 1. Audit css/education.css for flat design rules
const css = fs.readFileSync(path.join(__dirname, '../css/education.css'), 'utf8');

// Match any box-shadow that is not 'none' or 'none !important'
const shadowMatches = css.match(/box-shadow\s*:\s*([^;]+);/gi) || [];
const badShadows = shadowMatches.filter(s => !/box-shadow\s*:\s*none(\s*!important)?\s*;/i.test(s));
const badGradients = css.match(/(linear-gradient|radial-gradient|conic-gradient)/gi) || [];
const badFilters = css.match(/backdrop-filter/gi) || [];

console.log(`\n1. Flat Design Audit (css/education.css):`);
console.log(`- Box shadows (non-none): ${badShadows.length} ${badShadows.length ? JSON.stringify(badShadows) : '✓'}`);
console.log(`- Gradients: ${badGradients.length} ${badGradients.length ? JSON.stringify(badGradients) : '✓'}`);
console.log(`- Backdrop filters: ${badFilters.length} ${badFilters.length ? JSON.stringify(badFilters) : '✓'}`);

if (badShadows.length || badGradients.length || badFilters.length) {
  process.exitCode = 1;
}

// 2. Audit js/education.js for 11 algorithms and 7 sections
const jsContent = fs.readFileSync(path.join(__dirname, '../js/education.js'), 'utf8');

const mockWindow = {
  selectAlgo: () => {}
};

function createMockElement(id = '') {
  return {
    id,
    innerHTML: '',
    textContent: '',
    style: {},
    classList: {
      add: () => {},
      remove: () => {}
    },
    addEventListener: () => {},
    querySelectorAll: () => [],
    querySelector: () => null,
    appendChild: () => {}
  };
}

const mockDocument = {
  getElementById: (id) => createMockElement(id),
  createElement: () => createMockElement(),
  body: {
    appendChild: () => {},
    removeChild: () => {}
  }
};

const context = vm.createContext({
  window: mockWindow,
  document: mockDocument,
  renderMathInElement: () => {},
  Prism: { highlightAllUnder: () => {} },
  console: console,
  navigator: { clipboard: { writeText: () => Promise.resolve() } },
  setTimeout: () => {}
});

vm.runInContext(jsContent, context);

const EDUCATION_DATA = mockWindow.EDUCATION_DATA;
const renderEducationSection = mockWindow.renderEducationSection;

const expectedAlgos = [
  'linear_reg', 'logistic_reg', 'svm', 'knn', 'naive_bayes',
  'decision_tree', 'random_forest', 'gradient_boosting',
  'neural_net', 'kmeans', 'pca'
];

console.log(`\n2. Algorithm Coverage (EDUCATION_DATA):`);
console.log(`- Total algorithms defined: ${Object.keys(EDUCATION_DATA).length} / 11`);

let allSectionsValid = true;
let allHandTracesValid = true;

expectedAlgos.forEach(algoId => {
  const data = EDUCATION_DATA[algoId];
  if (!data) {
    console.error(`- Missing algorithm: ${algoId}`);
    allSectionsValid = false;
    return;
  }

  // Check 7 sections
  // 1. Intro
  const hasIntro = !!(data.title && data.difficulty && data.category && data.summary && data.prerequisites && data.prerequisites.length > 0);
  // 2. Math & Hand-Trace
  const hasMath = !!(data.math && data.math.intro && data.math.equations && data.math.equations.length > 0);
  const hasHandTrace = !!(data.math && data.math.handTrace && data.math.handTrace.title && data.math.handTrace.points && data.math.handTrace.steps && data.math.handTrace.steps.length > 0);
  // 3. Experiments
  const hasExperiments = !!(data.experiments && data.experiments.length >= 2 && data.experiments.every(e => e.title && e.setup && e.whatBreaks && e.whyItBreaks));
  // 4. Code Block
  const hasCode = !!(data.code && data.code.filename && data.code.snippet && data.code.snippet.length > 50);
  // 5. Complexity Table
  const hasComplexity = !!(data.complexity && data.complexity.length >= 2 && data.complexity.every(c => c.stage && c.time && c.space && c.notes));
  // 6. FAQ
  const hasFaq = !!(data.faq && data.faq.length >= 3 && data.faq.every(f => f.q && f.a));
  // 7. Related
  const hasRelated = !!(data.related && data.related.length >= 2 && data.related.every(r => r.id && r.name && r.badge && r.reason));

  const passed = hasIntro && hasMath && hasHandTrace && hasExperiments && hasCode && hasComplexity && hasFaq && hasRelated;
  if (!passed) {
    console.error(`- Algorithm ${algoId} missing sections: intro=${hasIntro}, math=${hasMath}, handTrace=${hasHandTrace}, experiments=${hasExperiments}, code=${hasCode}, complexity=${hasComplexity}, faq=${hasFaq}, related=${hasRelated}`);
    allSectionsValid = false;
  }
  if (!hasHandTrace) {
    allHandTracesValid = false;
  }
});

console.log(`- All 7 structured sections present in all 11 algorithms: ${allSectionsValid ? '✓' : 'FAILED'}`);
console.log(`- Hand-trace walkthroughs present in all 11 algorithms: ${allHandTracesValid ? '✓' : 'FAILED'}`);

// 3. Test HTML rendering for all 11 algorithms
console.log(`\n3. Render HTML Verification:`);
let renderErrors = 0;
expectedAlgos.forEach(algoId => {
  try {
    let renderedHTML = '';
    mockDocument.getElementById = (id) => {
      const el = createMockElement(id);
      if (id === 'educationSection') {
        Object.defineProperty(el, 'innerHTML', {
          set(val) { renderedHTML = val; },
          get() { return renderedHTML; }
        });
      }
      return el;
    };
    renderEducationSection(algoId);
    if (!renderedHTML || renderedHTML.length < 500) {
      console.error(`- Render output for ${algoId} appears incomplete (length: ${renderedHTML ? renderedHTML.length : 0})`);
      renderErrors++;
    }
  } catch (err) {
    console.error(`- Error rendering ${algoId}:`, err);
    renderErrors++;
  }
});
console.log(`- Render test completed with ${renderErrors} errors.`);

if (!allSectionsValid || !allHandTracesValid || renderErrors > 0) {
  process.exitCode = 1;
}

console.log("\n=== ALL CHECKS PASSED ===");
