const assert = require('assert');
const ML = require('../js/algorithms.js');

// 1. Seeded PRNG determinism
const r1 = ML.createPRNG(42);
const r2 = ML.createPRNG(42);
for (let i = 0; i < 20; i++) {
  assert.strictEqual(r1(), r2(), 'PRNG must be deterministic for same seed');
}

// 2. Linear Regression OLS exactness: y = 2x + 1
const linPts = [
  { x: -2, y: -3, label: 0 },
  { x: 0, y: 1, label: 0 },
  { x: 2, y: 5, label: 0 },
  { x: 4, y: 9, label: 0 }
];
const ols = ML.fitLinearRegressionOLS(linPts);
assert(Math.abs(ols.w - 2) < 1e-9, `Expected slope 2, got ${ols.w}`);
assert(Math.abs(ols.b - 1) < 1e-9, `Expected intercept 1, got ${ols.b}`);
assert(Math.abs(ols.r2 - 1) < 1e-9, `Expected R2=1, got ${ols.r2}`);

// Linear Regression GD convergence
let gd = { w: 0, b: 0, epoch: 0, lossHistory: [] };
for (let i = 0; i < 250; i++) gd = ML.stepLinearRegressionGD(linPts, gd, 0.08);
assert(Math.abs(gd.w - 2) < 1e-2, `GD slope failed: ${gd.w}`);
assert(Math.abs(gd.b - 1) < 1e-2, `GD intercept failed: ${gd.b}`);
assert(gd.lossHistory.length > 0 && gd.lossHistory[gd.lossHistory.length - 1] < 1e-4, 'GD loss should decrease');

// 3. Logistic Regression convergence on separable points
const binPts = [
  { x: -2, y: -2, label: 0 },
  { x: -1, y: -1.5, label: 0 },
  { x: 2, y: 2, label: 1 },
  { x: 1.5, y: 1, label: 1 }
];
let logState = { w1: 0.1, w2: 0.1, b: 0, epoch: 0, lossHistory: [] };
for (let i = 0; i < 120; i++) logState = ML.stepLogisticRegression(binPts, logState, 0.2);
assert.strictEqual(logState.acc, 1, 'Logistic regression should reach 100% on linearly separable data');

// 4. KNN deterministic tie-breaking
const tiePts = [
  { x: -1, y: 0, label: 1 },
  { x: 1, y: 0, label: 0 }
];
const knnRes = ML.predictKNN(tiePts, { x: 0, y: 0 }, 2, 'euclidean');
assert.strictEqual(knnRes.label, 0, 'KNN tie should deterministically pick lowest class label');

// 5. K-Means convergence & seeded reproducibility
const kmPts = [
  { x: -3, y: -3 }, { x: -2.8, y: -3.2 }, { x: -3.1, y: -2.9 },
  { x: 3, y: 3 }, { x: 2.9, y: 3.1 }, { x: 3.2, y: 2.8 }
];
let kmA = ML.initKMeans(kmPts, 2, ML.createPRNG(7));
let kmB = ML.initKMeans(kmPts, 2, ML.createPRNG(7));
assert.deepStrictEqual(kmA.centroids, kmB.centroids, 'K-Means init must be reproducible with seed');
for (let i = 0; i < 10; i++) kmA = ML.stepKMeans(kmPts, kmA);
assert.strictEqual(kmA.converged, true, 'K-Means should converge on 2 well-separated clusters');

// 6. Decision Tree on XOR
const xorPts = [
  { x: -2.1, y: 2.0, label: 0 }, { x: -1.8, y: 2.3, label: 0 },
  { x: 2.0, y: -2.0, label: 0 },
  { x: 2.1, y: 2.0, label: 1 }, { x: -2.0, y: -2.1, label: 1 }
];
const tree = ML.fitDecisionTree(xorPts, 3, 2);
for (const p of xorPts) {
  assert.strictEqual(ML.predictTree(tree, p), p.label, 'Decision tree depth 3 must fit XOR');
}

// 7. Random Forest seeded reproducibility
const rf1 = ML.fitRandomForest(xorPts, 5, 3, 2, ML.createPRNG(99));
const rf2 = ML.fitRandomForest(xorPts, 5, 3, 2, ML.createPRNG(99));
assert.deepStrictEqual(rf1.accuracies, rf2.accuracies, 'Random Forest must be reproducible with seed');

// 8. Neural Network on XOR
let nn = ML.initNeuralNet(xorPts, 5, 'tanh', ML.createPRNG(123));
for (let i = 0; i < 600; i++) nn = ML.stepNeuralNet(xorPts, nn, 0.35);
assert.strictEqual(nn.acc, 1, `MLP should solve XOR, got acc=${nn.acc}`);

// 9. Gradient Boosting on separable points
const gb = ML.fitGradientBoosting(binPts, 8, 0.4, 2);
assert.strictEqual(gb.acc, 1, 'GBDT should reach 100% on separable data');

// 10. Linear SVM
let svm = { w1: 0.2, w2: -0.2, b: 0, epoch: 0, lossHistory: [] };
for (let i = 0; i < 120; i++) svm = ML.stepLinearSVM(binPts, svm, 0.1, 2.0);
assert.strictEqual(svm.acc, 1, 'SVM should reach 100% on separable data');
assert(svm.margin > 0, 'SVM margin should be positive');

// 11. Gaussian Naive Bayes
const nb = ML.fitGaussianNB(binPts);
assert.strictEqual(ML.predictGaussianNB(nb, { x: -2, y: -2 }), 0);
assert.strictEqual(ML.predictGaussianNB(nb, { x: 2, y: 2 }), 1);

// 12. PCA on correlated points
const pcaPts = [
  { x: -2, y: -2 }, { x: -1, y: -1 }, { x: 1, y: 1 }, { x: 2, y: 2 }
];
const pca = ML.fitPCA(pcaPts);
assert(pca.valid, 'PCA should be valid');
assert(Math.abs(pca.ratio1 - 1.0) < 1e-6, `Expected PC1 ratio ~1.0, got ${pca.ratio1}`);

console.log('ALL 12 ALGORITHM UNIT TESTS PASSED');
