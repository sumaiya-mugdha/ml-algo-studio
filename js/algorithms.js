// Pure Vanilla JS implementations of 11 Machine Learning algorithms
// Coordinate space: x in [-5, 5], y in [-5, 5]

(function (root) {
  function createPRNG(seed) {
    let a = (seed >>> 0) || 1;
    return function () {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function dist2(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy;
  }

  function euclidean(a, b) {
    return Math.sqrt(dist2(a, b));
  }

  function manhattan(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  function sigmoid(z) {
    if (z > 35) return 1 - 1e-15;
    if (z < -35) return 1e-15;
    return 1 / (1 + Math.exp(-z));
  }

  function clampFinite(val, limit = 1e4) {
    if (!Number.isFinite(val)) return limit;
    return Math.max(-limit, Math.min(limit, val));
  }

  // 1. Linear Regression (OLS + Gradient Descent)
  function fitLinearRegressionOLS(points) {
    const n = points.length;
    if (n < 2) return { w: 0, b: 0, r2: 0, mse: 0, rmse: 0, epoch: 0, lossHistory: [], diverged: false, valid: false };
    let sx = 0, sy = 0;
    for (const p of points) { sx += p.x; sy += p.y; }
    const mx = sx / n;
    const my = sy / n;
    let num = 0, den = 0;
    for (const p of points) {
      const dx = p.x - mx;
      num += dx * (p.y - my);
      den += dx * dx;
    }
    const w = den < 1e-9 ? 0 : num / den;
    const b = my - w * mx;
    return evalLinearRegression(points, w, b, 0, []);
  }

  function stepLinearRegressionGD(points, state, lr) {
    const n = points.length;
    if (n < 1) return state;
    let dw = 0, db = 0;
    for (const p of points) {
      const pred = state.w * p.x + state.b;
      const err = pred - p.y;
      dw += (2 / n) * err * p.x;
      db += (2 / n) * err;
    }
    const rawW = state.w - lr * dw;
    const rawB = state.b - lr * db;
    const diverged = !Number.isFinite(rawW) || !Number.isFinite(rawB) || Math.abs(rawW) > 500 || Math.abs(rawB) > 500;
    const w = clampFinite(rawW, 500);
    const b = clampFinite(rawB, 500);
    return evalLinearRegression(points, w, b, (state.epoch || 0) + 1, state.lossHistory || [], diverged);
  }

  function evalLinearRegression(points, w, b, epoch = 0, prevHistory = [], diverged = false) {
    const n = points.length;
    if (n === 0) return { w, b, r2: 0, mse: 0, rmse: 0, epoch, lossHistory: [], diverged: false, valid: false };
    let my = 0;
    for (const p of points) my += p.y;
    my /= n;
    let ssRes = 0, ssTot = 0;
    for (const p of points) {
      const pred = w * p.x + b;
      ssRes += (p.y - pred) ** 2;
      ssTot += (p.y - my) ** 2;
    }
    const mse = clampFinite(ssRes / n, 1e5);
    const rmse = Math.sqrt(mse);
    const r2 = ssTot < 1e-9 ? 1 : Math.max(-9.99, 1 - ssRes / ssTot);
    const lossHistory = epoch > 0 ? [...prevHistory.slice(-79), mse] : [mse];
    return { w, b, mse, rmse, r2, epoch, lossHistory, diverged: diverged || mse > 500, valid: n >= 2 };
  }

  function getOLSResiduals(points, model) {
    if (!model || !model.valid || points.length === 0) return [];
    return [...points]
      .sort((a, b) => a.x - b.x)
      .map((p, idx) => ({ idx, x: p.x, y: p.y, residual: p.y - (model.w * p.x + model.b) }));
  }

  // 2. Logistic Regression (Binary Classification)
  function stepLogisticRegression(points, state, lr) {
    const binPts = points.filter(p => p.label === 0 || p.label === 1);
    const n = binPts.length;
    if (n === 0) return { w1: 0, w2: 0, b: 0, loss: 0, acc: 0, epoch: 0, lossHistory: [], accHistory: [], diverged: false };
    let dw1 = 0, dw2 = 0, db = 0;
    for (const p of binPts) {
      const z = state.w1 * p.x + state.w2 * p.y + state.b;
      const pred = sigmoid(z);
      const err = pred - p.label;
      dw1 += (err * p.x) / n;
      dw2 += (err * p.y) / n;
      db += err / n;
    }
    const nw1 = clampFinite(state.w1 - lr * dw1, 200);
    const nw2 = clampFinite(state.w2 - lr * dw2, 200);
    const nb = clampFinite(state.b - lr * db, 200);
    return evalLogisticRegression(
      binPts,
      nw1,
      nw2,
      nb,
      (state.epoch || 0) + 1,
      state.lossHistory || [],
      state.accHistory || []
    );
  }

  function evalLogisticRegression(points, w1, w2, b, epoch = 0, prevHistory = [], prevAcc = []) {
    const binPts = points.filter(p => p.label === 0 || p.label === 1);
    const n = binPts.length;
    if (n === 0) return { w1, w2, b, loss: 0, acc: 0, epoch, lossHistory: [], accHistory: [], diverged: false };
    let loss = 0, correct = 0;
    for (const p of binPts) {
      const prob = sigmoid(w1 * p.x + w2 * p.y + b);
      const clipped = Math.min(1 - 1e-12, Math.max(1e-12, prob));
      loss -= p.label * Math.log(clipped) + (1 - p.label) * Math.log(1 - clipped);
      if ((prob >= 0.5 ? 1 : 0) === p.label) correct++;
    }
    const avgLoss = loss / n;
    const acc = correct / n;
    const lossHistory = epoch > 0 ? [...prevHistory.slice(-79), avgLoss] : [avgLoss];
    const accHistory = epoch > 0 ? [...prevAcc.slice(-79), acc] : [acc];
    const diverged = lossHistory.length >= 4 && avgLoss > lossHistory[0] * 1.5 && avgLoss > 1.0;
    return { w1, w2, b, loss: avgLoss, acc, epoch, lossHistory, accHistory, diverged };
  }

  // 3. K-Nearest Neighbors (KNN)
  function predictKNN(points, query, k, metric) {
    if (points.length === 0) return { label: 0, neighbors: [], votes: {} };
    const distFn = metric === 'manhattan' ? manhattan : euclidean;
    const sorted = points
      .map((p, idx) => ({ point: p, idx, dist: distFn(p, query) }))
      .sort((a, b) => a.dist - b.dist || a.idx - b.idx);
    const effK = Math.min(Math.max(1, k), sorted.length);
    const neighbors = sorted.slice(0, effK);
    const votes = {};
    for (const nb of neighbors) votes[nb.point.label] = (votes[nb.point.label] || 0) + 1;
    let bestLabel = neighbors[0].point.label;
    let bestCount = -1;
    const sortedKeys = Object.keys(votes).map(Number).sort((a, b) => a - b);
    for (const lbl of sortedKeys) {
      if (votes[lbl] > bestCount) {
        bestCount = votes[lbl];
        bestLabel = lbl;
      }
    }
    return { label: bestLabel, neighbors, votes };
  }

  function sweepKNN(points, maxK, metric) {
    const n = points.length;
    if (n < 2) return [];
    const limit = Math.min(maxK, n - 1);
    const distFn = metric === 'manhattan' ? manhattan : euclidean;
    // Precompute sorted neighbor labels for each point (leave-one-out)
    const sortedLabels = points.map((p, i) => {
      const others = [];
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        others.push({ label: points[j].label, idx: j, dist: distFn(p, points[j]) });
      }
      others.sort((a, b) => a.dist - b.dist || a.idx - b.idx);
      return others.map(o => o.label);
    });

    const curve = [];
    for (let k = 1; k <= limit; k++) {
      let correct = 0;
      for (let i = 0; i < n; i++) {
        const votes = {};
        for (let m = 0; m < k; m++) {
          const lbl = sortedLabels[i][m];
          votes[lbl] = (votes[lbl] || 0) + 1;
        }
        let bestL = 0, bestC = -1;
        for (const lbl of Object.keys(votes).map(Number).sort((a, b) => a - b)) {
          if (votes[lbl] > bestC) { bestC = votes[lbl]; bestL = lbl; }
        }
        if (bestL === points[i].label) correct++;
      }
      curve.push({ param: k, acc: correct / n });
    }
    return curve;
  }

  // 4. K-Means Clustering (K-Means++ seeded initialization)
  function initKMeans(points, k, rng = Math.random) {
    if (points.length === 0) {
      return { centroids: [], assignments: [], trails: [], step: 0, inertia: 0, lossHistory: [], converged: false };
    }
    const centroids = [];
    const first = points[Math.floor(rng() * points.length)];
    centroids.push({ x: first.x, y: first.y });
    while (centroids.length < k) {
      const dists = points.map(p => Math.min(...centroids.map(c => dist2(p, c))));
      const sum = dists.reduce((a, b) => a + b, 0);
      if (sum < 1e-9) {
        centroids.push({ x: (rng() - 0.5) * 6, y: (rng() - 0.5) * 6 });
        continue;
      }
      let r = rng() * sum;
      let chosen = points[0];
      for (let i = 0; i < points.length; i++) {
        r -= dists[i];
        if (r <= 0) { chosen = points[i]; break; }
      }
      centroids.push({ x: chosen.x, y: chosen.y });
    }
    const trails = centroids.map(c => [{ x: c.x, y: c.y }]);
    return assignKMeans(points, { centroids, assignments: [], trails, step: 0, inertia: 0, lossHistory: [], converged: false });
  }

  function assignKMeans(points, state) {
    const centroids = state.centroids;
    if (centroids.length === 0) return state;
    let inertia = 0;
    const assignments = points.map(p => {
      let best = 0, bestD = Infinity;
      for (let i = 0; i < centroids.length; i++) {
        const d = dist2(p, centroids[i]);
        if (d < bestD) { bestD = d; best = i; }
      }
      inertia += bestD;
      return best;
    });
    const prev = state.lossHistory || [];
    const lossHistory = state.step === 0 && prev.length === 0 ? [inertia] : prev;
    return { ...state, assignments, inertia, lossHistory };
  }

  function stepKMeans(points, state) {
    if (points.length === 0) return state;
    const k = state.centroids.length;
    if (k === 0) return state;
    const sums = Array.from({ length: k }, () => ({ x: 0, y: 0, count: 0 }));
    for (let i = 0; i < points.length; i++) {
      const cIdx = state.assignments[i] ?? 0;
      sums[cIdx].x += points[i].x;
      sums[cIdx].y += points[i].y;
      sums[cIdx].count++;
    }
    let maxShift = 0;
    const newCentroids = state.centroids.map((c, idx) => {
      if (sums[idx].count === 0) return { ...c };
      const nx = sums[idx].x / sums[idx].count;
      const ny = sums[idx].y / sums[idx].count;
      maxShift = Math.max(maxShift, Math.hypot(nx - c.x, ny - c.y));
      return { x: nx, y: ny };
    });
    const trails = state.trails.map((t, idx) => [...t, { x: newCentroids[idx].x, y: newCentroids[idx].y }]);
    const assigned = assignKMeans(points, {
      centroids: newCentroids,
      assignments: state.assignments,
      trails,
      step: state.step + 1,
      inertia: 0,
      lossHistory: state.lossHistory || [],
      converged: maxShift < 1e-4
    });
    return {
      ...assigned,
      lossHistory: [...(state.lossHistory || []).slice(-79), assigned.inertia]
    };
  }

  // 5. Decision Tree (CART with Gini Impurity)
  function giniImpurity(pts) {
    if (pts.length === 0) return 0;
    const counts = {};
    for (const p of pts) counts[p.label] = (counts[p.label] || 0) + 1;
    let sumSq = 0;
    for (const c of Object.values(counts)) {
      const prob = c / pts.length;
      sumSq += prob * prob;
    }
    return 1 - sumSq;
  }

  function majorityLabel(pts) {
    const counts = {};
    let best = 0, bestC = -1;
    for (const p of pts) counts[p.label] = (counts[p.label] || 0) + 1;
    for (const lbl of Object.keys(counts).map(Number).sort((a, b) => a - b)) {
      if (counts[lbl] > bestC) { bestC = counts[lbl]; best = lbl; }
    }
    return best;
  }

  function fitDecisionTree(points, maxDepth, minSamples, depth = 0, randomFeatureSubsample = false, rng = Math.random) {
    const n = points.length;
    if (n === 0) return { leaf: true, label: 0, count: 0, gini: 0, depth };
    const gini = giniImpurity(points);
    const label = majorityLabel(points);
    if (depth >= maxDepth || n < minSamples || gini < 1e-7) {
      return { leaf: true, label, count: n, gini, depth };
    }
    let feats = ['x', 'y'];
    if (randomFeatureSubsample && rng() < 0.5) {
      feats = [rng() < 0.5 ? 'x' : 'y'];
    }
    let bestGain = 0, bestFeat = null, bestThresh = 0, bestLeft = null, bestRight = null;
    for (const feat of feats) {
      const vals = [...new Set(points.map(p => p[feat]))].sort((a, b) => a - b);
      for (let i = 0; i < vals.length - 1; i++) {
        const thresh = (vals[i] + vals[i + 1]) / 2;
        const left = [], right = [];
        for (const p of points) {
          if (p[feat] <= thresh) left.push(p);
          else right.push(p);
        }
        if (left.length === 0 || right.length === 0) continue;
        const weightedGini = (left.length / n) * giniImpurity(left) + (right.length / n) * giniImpurity(right);
        const gain = gini - weightedGini;
        if (gain > bestGain) {
          bestGain = gain;
          bestFeat = feat;
          bestThresh = thresh;
          bestLeft = left;
          bestRight = right;
        }
      }
    }
    if (!bestFeat || bestGain < 1e-7) {
      return { leaf: true, label, count: n, gini, depth };
    }
    return {
      leaf: false,
      feat: bestFeat,
      thresh: bestThresh,
      gini,
      count: n,
      depth,
      left: fitDecisionTree(bestLeft, maxDepth, minSamples, depth + 1, randomFeatureSubsample, rng),
      right: fitDecisionTree(bestRight, maxDepth, minSamples, depth + 1, randomFeatureSubsample, rng)
    };
  }

  function predictTree(node, pt) {
    if (!node || node.leaf) return node ? node.label : 0;
    return pt[node.feat] <= node.thresh ? predictTree(node.left, pt) : predictTree(node.right, pt);
  }

  function traceTree(node, pt) {
    const path = [];
    let cur = node;
    while (cur && !cur.leaf) {
      const goLeft = pt[cur.feat] <= cur.thresh;
      path.push(`${cur.feat} ${goLeft ? '≤' : '>'} ${cur.thresh.toFixed(2)}`);
      cur = goLeft ? cur.left : cur.right;
    }
    return { label: cur ? cur.label : 0, path };
  }

  function sweepDecisionTree(points, minSamples) {
    if (points.length === 0) return [];
    const curve = [];
    for (let d = 1; d <= 4; d++) {
      const tree = fitDecisionTree(points, d, minSamples, 0, false);
      let correct = 0;
      for (const p of points) if (predictTree(tree, p) === p.label) correct++;
      curve.push({ param: d, acc: correct / points.length });
    }
    return curve;
  }

  // 6. Random Forest (Bagging + Feature Subsampling)
  function fitRandomForest(points, numTrees, maxDepth, minSamples, rng = Math.random) {
    if (points.length === 0) return { trees: [], accuracies: [] };
    const trees = [];
    const accuracies = [];
    for (let t = 0; t < numTrees; t++) {
      const sample = [];
      for (let i = 0; i < points.length; i++) {
        sample.push(points[Math.floor(rng() * points.length)]);
      }
      const tree = fitDecisionTree(sample, maxDepth, minSamples, 0, true, rng);
      let correct = 0;
      for (const p of points) {
        if (predictTree(tree, p) === p.label) correct++;
      }
      trees.push(tree);
      accuracies.push(correct / points.length);
    }
    return { trees, accuracies };
  }

  function predictRandomForest(forest, pt) {
    if (!forest || !forest.trees.length) return 0;
    const votes = {};
    for (const tree of forest.trees) {
      const lbl = predictTree(tree, pt);
      votes[lbl] = (votes[lbl] || 0) + 1;
    }
    let best = 0, bestC = -1;
    for (const lbl of Object.keys(votes).map(Number).sort((a, b) => a - b)) {
      if (votes[lbl] > bestC) { bestC = votes[lbl]; best = lbl; }
    }
    return best;
  }

  function sweepRandomForest(points, numTrees, minSamples, seed = 42) {
    if (points.length === 0) return [];
    const curve = [];
    for (let d = 1; d <= 4; d++) {
      const rf = fitRandomForest(points, numTrees, d, minSamples, createPRNG(seed + 101));
      let correct = 0;
      for (const p of points) if (predictRandomForest(rf, p) === p.label) correct++;
      curve.push({ param: d, acc: correct / points.length });
    }
    return curve;
  }

  // 7. Neural Network (2 -> H -> C MLP with Backpropagation)
  function initNeuralNet(points, hiddenSize, activation, rng = Math.random) {
    const labels = [...new Set(points.map(p => p.label))];
    const numClasses = Math.max(2, labels.length ? Math.max(...labels) + 1 : 2);
    const scale1 = Math.sqrt(2 / (2 + hiddenSize));
    const scale2 = Math.sqrt(2 / (hiddenSize + numClasses));
    const W1 = Array.from({ length: hiddenSize }, () => [
      (rng() * 2 - 1) * scale1 * 1.5,
      (rng() * 2 - 1) * scale1 * 1.5
    ]);
    const b1 = Array(hiddenSize).fill(0);
    const W2 = Array.from({ length: numClasses }, () =>
      Array.from({ length: hiddenSize }, () => (rng() * 2 - 1) * scale2 * 1.5)
    );
    const b2 = Array(numClasses).fill(0);
    return evalNeuralNet(points, { W1, b1, W2, b2, hiddenSize, numClasses, activation, epoch: 0, lossHistory: [], accHistory: [], diverged: false });
  }

  function actFn(z, type) {
    if (type === 'relu') return z > 0 ? z : 0.01 * z;
    if (type === 'sigmoid') return sigmoid(z);
    return Math.tanh(z);
  }

  function actDeriv(a, z, type) {
    if (type === 'relu') return z > 0 ? 1 : 0.01;
    if (type === 'sigmoid') return a * (1 - a);
    return 1 - a * a;
  }

  function forwardNN(net, pt) {
    const x0 = pt.x / 5;
    const x1 = pt.y / 5;
    const z1 = [], h = [];
    for (let i = 0; i < net.hiddenSize; i++) {
      const z = net.W1[i][0] * x0 + net.W1[i][1] * x1 + net.b1[i];
      z1.push(z);
      h.push(actFn(z, net.activation));
    }
    const logits = [];
    let maxL = -Infinity;
    for (let c = 0; c < net.numClasses; c++) {
      let s = net.b2[c];
      for (let i = 0; i < net.hiddenSize; i++) s += net.W2[c][i] * h[i];
      logits.push(s);
      if (s > maxL) maxL = s;
    }
    const exps = logits.map(l => Math.exp(Math.max(-50, Math.min(50, l - maxL))));
    const sumE = exps.reduce((a, b) => a + b, 0) || 1;
    const probs = exps.map(e => e / sumE);
    return { x: [x0, x1], z1, h, probs };
  }

  function stepNeuralNet(points, net, lr) {
    const n = points.length;
    if (n === 0) return net;
    const H = net.hiddenSize;
    const C = net.numClasses;
    const dW1 = Array.from({ length: H }, () => [0, 0]);
    const db1 = Array(H).fill(0);
    const dW2 = Array.from({ length: C }, () => Array(H).fill(0));
    const db2 = Array(C).fill(0);

    for (const p of points) {
      const target = Math.min(C - 1, Math.max(0, p.label));
      const { x, z1, h, probs } = forwardNN(net, p);
      const dLogits = probs.map((pr, c) => pr - (c === target ? 1 : 0));
      const dH = Array(H).fill(0);
      for (let c = 0; c < C; c++) {
        db2[c] += dLogits[c] / n;
        for (let i = 0; i < H; i++) {
          dW2[c][i] += (dLogits[c] * h[i]) / n;
          dH[i] += dLogits[c] * net.W2[c][i];
        }
      }
      for (let i = 0; i < H; i++) {
        const dz = dH[i] * actDeriv(h[i], z1[i], net.activation);
        db1[i] += dz / n;
        dW1[i][0] += (dz * x[0]) / n;
        dW1[i][1] += (dz * x[1]) / n;
      }
    }

    const W1 = net.W1.map((row, i) => [clampFinite(row[0] - lr * dW1[i][0], 80), clampFinite(row[1] - lr * dW1[i][1], 80)]);
    const b1 = net.b1.map((v, i) => clampFinite(v - lr * db1[i], 80));
    const W2 = net.W2.map((row, c) => row.map((v, i) => clampFinite(v - lr * dW2[c][i], 80)));
    const b2 = net.b2.map((v, c) => clampFinite(v - lr * db2[c], 80));

    return evalNeuralNet(points, { ...net, W1, b1, W2, b2, epoch: net.epoch + 1 });
  }

  function evalNeuralNet(points, net) {
    const n = points.length;
    if (n === 0) return { ...net, loss: 0, acc: 0 };
    let loss = 0, correct = 0;
    for (const p of points) {
      const target = Math.min(net.numClasses - 1, Math.max(0, p.label));
      const { probs } = forwardNN(net, p);
      loss -= Math.log(Math.max(1e-12, probs[target]));
      let bestC = 0;
      for (let c = 1; c < probs.length; c++) {
        if (probs[c] > probs[bestC]) bestC = c;
      }
      if (bestC === target) correct++;
    }
    const avgLoss = loss / n;
    const acc = correct / n;
    const lossHistory = [...(net.lossHistory || []).slice(-79), avgLoss];
    const accHistory = [...(net.accHistory || []).slice(-79), acc];
    const diverged = lossHistory.length >= 4 && avgLoss > lossHistory[0] * 1.4 && avgLoss > 1.2;
    return { ...net, loss: avgLoss, acc, lossHistory, accHistory, diverged };
  }

  function predictNeuralNet(net, pt) {
    const { probs } = forwardNN(net, pt);
    let bestC = 0;
    for (let c = 1; c < probs.length; c++) {
      if (probs[c] > probs[bestC]) bestC = c;
    }
    return { label: bestC, probs };
  }

  // 8. Gradient Boosting (Binary Log-Loss GBDT)
  function fitRegTreeForGB(items, maxDepth, depth = 0) {
    const n = items.length;
    if (n === 0) return { leaf: true, val: 0, count: 0, depth };
    let sumR = 0, sumH = 0;
    for (const it of items) {
      sumR += it.res;
      sumH += it.hess;
    }
    const leafVal = sumH > 1e-9 ? sumR / sumH : 0;
    if (depth >= maxDepth || n < 3) {
      return { leaf: true, val: leafVal, count: n, depth };
    }
    const meanR = sumR / n;
    let baseSSE = 0;
    for (const it of items) baseSSE += (it.res - meanR) ** 2;

    let bestGain = 0, bestFeat = null, bestThresh = 0, bestLeft = null, bestRight = null;
    for (const feat of ['x', 'y']) {
      const vals = [...new Set(items.map(it => it[feat]))].sort((a, b) => a - b);
      for (let i = 0; i < vals.length - 1; i++) {
        const thresh = (vals[i] + vals[i + 1]) / 2;
        const left = [], right = [];
        let sL = 0, sR = 0;
        for (const it of items) {
          if (it[feat] <= thresh) { left.push(it); sL += it.res; }
          else { right.push(it); sR += it.res; }
        }
        if (left.length === 0 || right.length === 0) continue;
        const mL = sL / left.length, mR = sR / right.length;
        let sse = 0;
        for (const it of left) sse += (it.res - mL) ** 2;
        for (const it of right) sse += (it.res - mR) ** 2;
        const gain = baseSSE - sse;
        if (gain > bestGain) {
          bestGain = gain; bestFeat = feat; bestThresh = thresh;
          bestLeft = left; bestRight = right;
        }
      }
    }
    if (!bestFeat || bestGain < 1e-6) {
      return { leaf: true, val: leafVal, count: n, depth };
    }
    return {
      leaf: false, feat: bestFeat, thresh: bestThresh, count: n, depth,
      left: fitRegTreeForGB(bestLeft, maxDepth, depth + 1),
      right: fitRegTreeForGB(bestRight, maxDepth, depth + 1)
    };
  }

  function predictRegTree(node, pt) {
    if (!node || node.leaf) return node ? node.val : 0;
    return pt[node.feat] <= node.thresh ? predictRegTree(node.left, pt) : predictRegTree(node.right, pt);
  }

  function fitGradientBoosting(points, nStages, lr, maxDepth) {
    const binPts = points.filter(p => p.label === 0 || p.label === 1);
    const n = binPts.length;
    if (n === 0) return { baseLogOdds: 0, stages: [], lr, lossHistory: [], accHistory: [], acc: 0 };
    const pos = binPts.filter(p => p.label === 1).length;
    const p0 = Math.min(0.99, Math.max(0.01, pos / n));
    const baseLogOdds = Math.log(p0 / (1 - p0));
    const F = Array(n).fill(baseLogOdds);
    const stages = [];
    const lossHistory = [];
    const accHistory = [];

    for (let s = 0; s < nStages; s++) {
      const items = binPts.map((pt, i) => {
        const prob = sigmoid(F[i]);
        return { x: pt.x, y: pt.y, res: pt.label - prob, hess: Math.max(1e-4, prob * (1 - prob)) };
      });
      const tree = fitRegTreeForGB(items, maxDepth);
      stages.push(tree);
      let loss = 0, stageCorrect = 0;
      for (let i = 0; i < n; i++) {
        F[i] += lr * predictRegTree(tree, binPts[i]);
        const pr = Math.min(1 - 1e-12, Math.max(1e-12, sigmoid(F[i])));
        loss -= binPts[i].label * Math.log(pr) + (1 - binPts[i].label) * Math.log(1 - pr);
        if ((pr >= 0.5 ? 1 : 0) === binPts[i].label) stageCorrect++;
      }
      lossHistory.push(loss / n);
      accHistory.push(stageCorrect / n);
    }

    return {
      baseLogOdds,
      stages,
      lr,
      lossHistory,
      accHistory,
      acc: accHistory.length ? accHistory[accHistory.length - 1] : 0
    };
  }

  function predictGradientBoosting(gb, pt) {
    if (!gb) return { prob: 0.5, label: 0 };
    let score = gb.baseLogOdds || 0;
    for (const tree of gb.stages) {
      score += gb.lr * predictRegTree(tree, pt);
    }
    const prob = sigmoid(score);
    return { prob, label: prob >= 0.5 ? 1 : 0 };
  }

  // 9. Linear SVM (Subgradient Hinge Loss + L2)
  function stepLinearSVM(points, state, lr, C) {
    const binPts = points.filter(p => p.label === 0 || p.label === 1);
    const n = binPts.length;
    if (n === 0) return { w1: 0.5, w2: -0.5, b: 0, acc: 0, margin: 0, loss: 0, epoch: 0, lossHistory: [], accHistory: [], supportIndices: [], diverged: false };
    const lambda = 1 / Math.max(0.01, C * n);
    let dw1 = lambda * state.w1, dw2 = lambda * state.w2, db = 0;
    for (const p of binPts) {
      const y = p.label === 1 ? 1 : -1;
      if (y * (state.w1 * p.x + state.w2 * p.y + state.b) < 1) {
        dw1 -= y * p.x / n;
        dw2 -= y * p.y / n;
        db -= y / n;
      }
    }
    return evalLinearSVM(
      points,
      clampFinite(state.w1 - lr * dw1, 200),
      clampFinite(state.w2 - lr * dw2, 200),
      clampFinite(state.b - lr * db, 200),
      (state.epoch || 0) + 1,
      C,
      state.lossHistory || [],
      state.accHistory || []
    );
  }

  function evalLinearSVM(points, w1, w2, b, epoch = 0, C = 2.0, prevHistory = [], prevAcc = []) {
    const binPts = points.filter(p => p.label === 0 || p.label === 1);
    let correct = 0;
    let hingeSum = 0;
    const supportIndices = [];
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      if (p.label !== 0 && p.label !== 1) continue;
      const y = p.label === 1 ? 1 : -1;
      const score = w1 * p.x + w2 * p.y + b;
      const marginVal = y * score;
      hingeSum += Math.max(0, 1 - marginVal);
      if ((score >= 0 ? 1 : 0) === p.label) correct++;
      if (marginVal <= 1.02) supportIndices.push(i);
    }
    const norm = Math.hypot(w1, w2);
    const regLoss = 0.5 * (w1 * w1 + w2 * w2) / Math.max(0.01, C * Math.max(1, binPts.length));
    const loss = binPts.length ? (hingeSum / binPts.length) + regLoss : 0;
    const acc = binPts.length ? correct / binPts.length : 0;
    const lossHistory = epoch > 0 ? [...prevHistory.slice(-79), loss] : [loss];
    const accHistory = epoch > 0 ? [...prevAcc.slice(-79), acc] : [acc];
    const diverged = lossHistory.length >= 4 && loss > lossHistory[0] * 1.6 && loss > 1.5;
    return {
      w1, w2, b,
      acc,
      margin: norm > 1e-6 ? 2 / norm : 0,
      loss,
      epoch,
      lossHistory,
      accHistory,
      diverged,
      supportIndices
    };
  }

  // 10. Gaussian Naive Bayes
  function fitGaussianNB(points) {
    const classes = {};
    for (const p of points) {
      if (!classes[p.label]) classes[p.label] = [];
      classes[p.label].push(p);
    }
    const total = points.length || 1;
    const stats = {};
    for (const [lbl, pts] of Object.entries(classes)) {
      const n = pts.length;
      const mx = pts.reduce((s, p) => s + p.x, 0) / n;
      const my = pts.reduce((s, p) => s + p.y, 0) / n;
      const vx = Math.max(0.08, pts.reduce((s, p) => s + (p.x - mx) ** 2, 0) / n);
      const vy = Math.max(0.08, pts.reduce((s, p) => s + (p.y - my) ** 2, 0) / n);
      stats[lbl] = { label: Number(lbl), prior: n / total, mx, my, vx, vy, count: n };
    }
    return stats;
  }

  function predictGaussianNB(stats, pt) {
    let bestLabel = 0, bestScore = -Infinity;
    for (const s of Object.values(stats)) {
      const lp = Math.log(s.prior)
        - 0.5 * Math.log(2 * Math.PI * s.vx) - ((pt.x - s.mx) ** 2) / (2 * s.vx)
        - 0.5 * Math.log(2 * Math.PI * s.vy) - ((pt.y - s.my) ** 2) / (2 * s.vy);
      if (lp > bestScore) { bestScore = lp; bestLabel = s.label; }
    }
    return bestLabel;
  }

  // 11. Principal Component Analysis (2D PCA)
  function fitPCA(points) {
    const n = points.length;
    if (n < 2) return { valid: false, mx: 0, my: 0, pc1: [1, 0], pc2: [0, 1], var1: 0, var2: 0, ratio1: 0.5, ratio2: 0.5 };
    const mx = points.reduce((s, p) => s + p.x, 0) / n;
    const my = points.reduce((s, p) => s + p.y, 0) / n;
    let cxx = 0, cyy = 0, cxy = 0;
    for (const p of points) {
      const dx = p.x - mx, dy = p.y - my;
      cxx += dx * dx; cyy += dy * dy; cxy += dx * dy;
    }
    cxx /= (n - 1); cyy /= (n - 1); cxy /= (n - 1);
    const trace = cxx + cyy;
    const det = cxx * cyy - cxy * cxy;
    const disc = Math.sqrt(Math.max(0, (trace * trace) / 4 - det));
    const l1 = trace / 2 + disc;
    const l2 = Math.max(0, trace / 2 - disc);
    let v1 = Math.abs(cxy) > 1e-8 ? [l1 - cyy, cxy] : (cxx >= cyy ? [1, 0] : [0, 1]);
    const len1 = Math.hypot(v1[0], v1[1]) || 1;
    const pc1 = [v1[0] / len1, v1[1] / len1];
    const pc2 = [-pc1[1], pc1[0]];
    const tot = l1 + l2 || 1;
    return { valid: true, mx, my, pc1, pc2, var1: l1, var2: l2, ratio1: l1 / tot, ratio2: l2 / tot };
  }

  // Unified Probe Explainer
  function explainProbe(algo, model, points, params, query) {
    if (!query || points.length === 0) return null;
    if (algo === 'knn') {
      const res = predictKNN(points, query, params.k, params.metric);
      const voteStr = Object.entries(res.votes).map(([c, cnt]) => `C${c}: ${cnt}`).join(', ');
      return { label: res.label, detail: `Class ${res.label} (${voteStr})` };
    }
    if (algo === 'logistic_reg') {
      const p = sigmoid(model.w1 * query.x + model.w2 * query.y + model.b);
      const label = p >= 0.5 ? 1 : 0;
      return { label, detail: `Class ${label} · P(y=1) = ${(p * 100).toFixed(1)}%` };
    }
    if (algo === 'svm') {
      const score = model.w1 * query.x + model.w2 * query.y + model.b;
      const label = score >= 0 ? 1 : 0;
      return { label, detail: `Class ${label} · score = ${score >= 0 ? '+' : ''}${score.toFixed(2)}` };
    }
    if (algo === 'decision_tree') {
      const tr = traceTree(model, query);
      return { label: tr.label, detail: `Class ${tr.label} via ${tr.path.length ? tr.path.join(' → ') : 'root'}` };
    }
    if (algo === 'random_forest') {
      const label = predictRandomForest(model, query);
      return { label, detail: `Class ${label} (${model.trees.length}-tree vote)` };
    }
    if (algo === 'gradient_boosting') {
      const res = predictGradientBoosting(model, query);
      return { label: res.label, detail: `Class ${res.label} · P(y=1) = ${(res.prob * 100).toFixed(1)}%` };
    }
    if (algo === 'neural_net') {
      const res = predictNeuralNet(model, query);
      const conf = ((res.probs[res.label] || 0) * 100).toFixed(1);
      return { label: res.label, detail: `Class ${res.label} (${conf}% softmax)` };
    }
    if (algo === 'naive_bayes') {
      const label = predictGaussianNB(model, query);
      return { label, detail: `Class ${label} (highest Gaussian posterior)` };
    }
    return null;
  }

  const api = {
    createPRNG,
    fitLinearRegressionOLS,
    stepLinearRegressionGD,
    evalLinearRegression,
    getOLSResiduals,
    stepLogisticRegression,
    evalLogisticRegression,
    predictKNN,
    sweepKNN,
    initKMeans,
    assignKMeans,
    stepKMeans,
    fitDecisionTree,
    predictTree,
    traceTree,
    sweepDecisionTree,
    fitRandomForest,
    predictRandomForest,
    sweepRandomForest,
    initNeuralNet,
    stepNeuralNet,
    evalNeuralNet,
    predictNeuralNet,
    fitGradientBoosting,
    predictGradientBoosting,
    stepLinearSVM,
    evalLinearSVM,
    fitGaussianNB,
    predictGaussianNB,
    fitPCA,
    explainProbe
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.MLAlgorithms = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
