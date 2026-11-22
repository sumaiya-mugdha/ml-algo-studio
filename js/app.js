(function () {
  const ML = window.MLAlgorithms;

  // Colorblind-safe Okabe-Ito palette
  const CLASS_COLORS = ['#0072B2', '#D55E00', '#009E73', '#CC79A7', '#E69F00', '#56B4E9'];
  const CLASS_BG = [
    [0, 114, 178],
    [213, 94, 0],
    [0, 158, 115],
    [204, 121, 167],
    [230, 159, 0],
    [86, 180, 233]
  ];

  const ALGO_META = {
    neural_net: {
      name: 'Neural Network (MLP)',
      badge: 'Classification',
      type: 'multiclass',
      iterative: true,
      intuition: 'Combines curved hidden-layer boundaries so the model can separate data that no single straight line can divide.',
      notice: 'On Two Moons or XOR, watch how 2 hidden neurons struggle while 5+ neurons bend the boundary around both classes.'
    },
    logistic_reg: {
      name: 'Logistic Regression',
      badge: 'Binary',
      type: 'binary',
      iterative: true,
      intuition: 'Draws one straight line and turns distance from that line into a smooth probability between 0% and 100%.',
      notice: 'Switch to Two Moons or XOR in Duel Mode against a Neural Network to see where a single straight boundary hits its limit.'
    },
    svm: {
      name: 'Linear SVM',
      badge: 'Margin',
      type: 'binary',
      iterative: true,
      intuition: 'Finds the straight boundary that leaves the widest empty street (margin) between two classes.',
      notice: 'Outlined points are support vectors; lowering C allows a wider margin with some misclassifications.'
    },
    knn: {
      name: 'K-Nearest Neighbors',
      badge: 'Instance',
      type: 'multiclass',
      iterative: false,
      intuition: 'Predicts a point’s class by holding a majority vote among its K closest neighbors.',
      notice: 'Try K = 1 for jagged islands around every outlier, then raise K to 9+ to see the boundary smooth out.'
    },
    decision_tree: {
      name: 'Decision Tree (CART)',
      badge: 'Tree',
      type: 'multiclass',
      iterative: false,
      intuition: 'Splits the plane with horizontal and vertical cuts, picking whichever cut makes each side purest.',
      notice: 'Every region has strictly vertical or horizontal walls; raising Max Depth creates smaller, sharper boxes.'
    },
    random_forest: {
      name: 'Random Forest',
      badge: 'Ensemble',
      type: 'multiclass',
      iterative: false,
      intuition: 'Trains many slightly different decision trees on random subsets and averages their votes to reduce overfitting.',
      notice: 'Compare against a single Decision Tree in Duel Mode to see how voting softens extreme single-tree splits.'
    },
    gradient_boosting: {
      name: 'Gradient Boosting',
      badge: 'Boosting',
      type: 'binary',
      iterative: false,
      intuition: 'Builds shallow trees one after another, where each new tree focuses on fixing the mistakes of the previous ones.',
      notice: 'Raise Boosting Stages from 1 to 10 and watch the stage-by-stage loss curve drop as the boundary sharpens.'
    },
    naive_bayes: {
      name: 'Gaussian Naive Bayes',
      badge: 'Probabilistic',
      type: 'multiclass',
      iterative: false,
      intuition: 'Fits an axis-aligned bell curve around each class and assigns new points to the most likely cloud.',
      notice: 'Dashed ellipses show 1 and 2 standard deviations; it assumes X and Y vary independently.'
    },
    linear_reg: {
      name: 'Linear Regression',
      badge: 'Regression',
      type: 'regression',
      iterative: true,
      intuition: 'Finds the single straight line that minimizes the average squared vertical distance to every point.',
      notice: 'Switch Solver to Gradient Descent and click Step to watch the line rotate and shift toward the exact OLS answer.'
    },
    kmeans: {
      name: 'K-Means Clustering',
      badge: 'Clustering',
      type: 'unlabeled',
      iterative: true,
      intuition: 'Groups unlabeled points by repeating two steps: assign points to the nearest center, then move each center to its group mean.',
      notice: 'Click Step to watch centroids follow the dashed trails until inertia stops dropping.'
    },
    pca: {
      name: 'PCA (2D to 1D)',
      badge: 'Dim. Reduction',
      type: 'unlabeled',
      iterative: false,
      intuition: 'Finds the direction (PC1) where the data spreads out the most so you can project 2D points onto 1D with minimal loss.',
      notice: 'Yellow segments show projection error; PC2 is always perpendicular to PC1.'
    }
  };

  const state = {
    algo: 'neural_net',
    duelMode: false,
    duelAlgo: 'logistic_reg',
    seed: 42,
    preset: 'moons',
    points: [],
    activeLabel: 0,
    mode: 'add',
    probePoint: null,
    running: false,
    timerId: null,
    selectedTreeIdx: 0,
    selectedStageIdx: 0,
    params: {
      lr: 0.12,
      k: 5,
      metric: 'euclidean',
      kmeansK: 3,
      maxDepth: 3,
      minSamples: 2,
      numTrees: 5,
      gbStages: 8,
      gbLr: 0.35,
      gbDepth: 2,
      nnHidden: 5,
      nnAct: 'tanh',
      svmC: 2.0,
      showResiduals: true,
      showProjections: true,
      regSolver: 'ols'
    },
    models: {},
    duelModels: {}
  };

  const els = {};
  const $ = id => document.getElementById(id);

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function showToast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add('show');
    clearTimeout(showToast._tid);
    showToast._tid = setTimeout(() => els.toast.classList.remove('show'), 2200);
  }

  function stopAnimation() {
    state.running = false;
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
    updateRunButtons();
  }

  function syncURL() {
    const p = new URLSearchParams();
    p.set('algo', state.algo);
    p.set('seed', String(state.seed));
    p.set('preset', state.preset);
    if (state.duelMode) {
      p.set('duel', '1');
      p.set('duelAlgo', state.duelAlgo);
    }
    const url = `${window.location.pathname}?${p.toString()}`;
    window.history.replaceState(null, '', url);
  }

  function loadFromURL() {
    const p = new URLSearchParams(window.location.search);
    const algo = p.get('algo');
    const seed = Number(p.get('seed'));
    const preset = p.get('preset');
    const duel = p.get('duel');
    const duelAlgo = p.get('duelAlgo');
    if (algo && ALGO_META[algo]) state.algo = algo;
    if (!Number.isNaN(seed) && seed > 0) state.seed = Math.floor(seed);
    if (preset) state.preset = preset;
    if (duel === '1') state.duelMode = true;
    if (duelAlgo && ALGO_META[duelAlgo]) state.duelAlgo = duelAlgo;
  }

  function worldToCanvas(wx, wy, w, h) {
    return [((wx + 5) / 10) * w, ((5 - wy) / 10) * h];
  }

  function canvasToWorld(cx, cy, w, h) {
    const wx = (cx / w) * 10 - 5;
    const wy = 5 - (cy / h) * 10;
    return {
      x: Math.max(-4.9, Math.min(4.9, Number(wx.toFixed(2)))),
      y: Math.max(-4.9, Math.min(4.9, Number(wy.toFixed(2))))
    };
  }

  function clamp(v) {
    return Math.max(-4.8, Math.min(4.8, Number(v.toFixed(2))));
  }

  function defaultPresetForAlgo(algo) {
    if (algo === 'linear_reg') return 'linear';
    if (algo === 'logistic_reg' || algo === 'svm') return 'separable';
    if (algo === 'neural_net' || algo === 'gradient_boosting') return 'moons';
    if (algo === 'knn' || algo === 'naive_bayes' || algo === 'random_forest') return 'blobs3';
    if (algo === 'decision_tree') return 'xor';
    if (algo === 'kmeans') return 'blobs3';
    if (algo === 'pca') return 'correlated';
    return 'separable';
  }

  function loadPreset(presetName) {
    stopAnimation();
    state.preset = presetName;
    const rng = ML.createPRNG(state.seed);
    const randn = () => {
      let u = 0, v = 0;
      while (u === 0) u = rng();
      while (v === 0) v = rng();
      return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    };
    const pts = [];

    if (presetName === 'linear') {
      for (let i = 0; i < 28; i++) {
        const x = -4 + (8 * i) / 27 + randn() * 0.2;
        const y = 0.72 * x + 0.4 + randn() * 0.65;
        pts.push({ x: clamp(x), y: clamp(y), label: 0 });
      }
    } else if (presetName === 'separable') {
      for (let i = 0; i < 18; i++) {
        pts.push({ x: clamp(-1.8 + randn() * 0.85), y: clamp(1.5 + randn() * 0.85), label: 0 });
        pts.push({ x: clamp(1.8 + randn() * 0.85), y: clamp(-1.5 + randn() * 0.85), label: 1 });
      }
    } else if (presetName === 'blobs3') {
      const centers = [[-2.2, 2.0, 0], [2.2, 1.8, 1], [0.0, -2.2, 2]];
      for (const [cx, cy, lbl] of centers) {
        for (let i = 0; i < 14; i++) {
          pts.push({ x: clamp(cx + randn() * 0.75), y: clamp(cy + randn() * 0.75), label: lbl });
        }
      }
    } else if (presetName === 'moons') {
      for (let i = 0; i < 20; i++) {
        const a = (Math.PI * i) / 19;
        pts.push({ x: clamp(Math.cos(a) * 2.2 - 0.8 + randn() * 0.25), y: clamp(Math.sin(a) * 2.2 - 0.3 + randn() * 0.25), label: 0 });
        pts.push({ x: clamp(1.0 - Math.cos(a) * 2.2 + randn() * 0.25), y: clamp(0.4 - Math.sin(a) * 2.2 + randn() * 0.25), label: 1 });
      }
    } else if (presetName === 'xor') {
      const quads = [[-2, 2, 0], [2, -2, 0], [2, 2, 1], [-2, -2, 1]];
      for (const [cx, cy, lbl] of quads) {
        for (let i = 0; i < 9; i++) {
          pts.push({ x: clamp(cx + randn() * 0.65), y: clamp(cy + randn() * 0.65), label: lbl });
        }
      }
    } else if (presetName === 'correlated') {
      for (let i = 0; i < 36; i++) {
        const t = randn() * 1.6;
        const n = randn() * 0.55;
        pts.push({ x: clamp(t * 0.9 - n * 0.4), y: clamp(t * 0.75 + n * 0.5), label: 0 });
      }
    }

    state.points = pts;
    state.probePoint = null;
    resetAllModels();
    syncURL();
    recomputeAndRender();
  }

  function createEmptyModels(seedOffset) {
    const rng = ML.createPRNG(state.seed + seedOffset);
    return {
      linear: { w: 0, b: 0, r2: 0, mse: 0, rmse: 0, epoch: 0, lossHistory: [], valid: false },
      logistic: ML.evalLogisticRegression(state.points, 0.4, -0.4, 0, 0, []),
      svm: ML.evalLinearSVM(state.points, 0.5, -0.5, 0, 0, state.params.svmC, []),
      kmeans: ML.initKMeans(state.points, state.params.kmeansK, rng),
      tree: null,
      forest: { trees: [], accuracies: [] },
      gb: { baseLogOdds: 0, stages: [], lr: state.params.gbLr, lossHistory: [], acc: 0 },
      nn: ML.initNeuralNet(state.points, state.params.nnHidden, state.params.nnAct, rng),
      nb: {},
      pca: { valid: false, mx: 0, my: 0, pc1: [1, 0], pc2: [0, 1], var1: 0, var2: 0, ratio1: 0.5, ratio2: 0.5 }
    };
  }

  function resetAllModels() {
    state.models = createEmptyModels(101);
    state.duelModels = createEmptyModels(202);
    state.selectedTreeIdx = 0;
    state.selectedStageIdx = 0;
  }

  function stepAlgoModel(algo, modelBag, seedOffset) {
    if (algo === 'linear_reg' && state.params.regSolver === 'gd') {
      modelBag.linear = ML.stepLinearRegressionGD(state.points, modelBag.linear, state.params.lr);
    } else if (algo === 'logistic_reg') {
      modelBag.logistic = ML.stepLogisticRegression(state.points, modelBag.logistic, state.params.lr);
    } else if (algo === 'neural_net') {
      if (!modelBag.nn) modelBag.nn = ML.initNeuralNet(state.points, state.params.nnHidden, state.params.nnAct, ML.createPRNG(state.seed + seedOffset));
      for (let i = 0; i < 4; i++) {
        modelBag.nn = ML.stepNeuralNet(state.points, modelBag.nn, state.params.lr);
      }
    } else if (algo === 'svm') {
      modelBag.svm = ML.stepLinearSVM(state.points, modelBag.svm, state.params.lr * 0.5, state.params.svmC);
    } else if (algo === 'kmeans') {
      if (modelBag.kmeans.centroids.length !== state.params.kmeansK) {
        modelBag.kmeans = ML.initKMeans(state.points, state.params.kmeansK, ML.createPRNG(state.seed + seedOffset));
      } else {
        modelBag.kmeans = ML.stepKMeans(state.points, modelBag.kmeans);
      }
    }
  }

  function recomputeAlgoModel(algo, modelBag, seedOffset) {
    const rng = ML.createPRNG(state.seed + seedOffset);
    if (algo === 'linear_reg') {
      modelBag.linear = state.params.regSolver === 'ols'
        ? ML.fitLinearRegressionOLS(state.points)
        : ML.evalLinearRegression(state.points, modelBag.linear.w, modelBag.linear.b, modelBag.linear.epoch, modelBag.linear.lossHistory);
    } else if (algo === 'logistic_reg') {
      modelBag.logistic = ML.evalLogisticRegression(
        state.points, modelBag.logistic.w1, modelBag.logistic.w2, modelBag.logistic.b, modelBag.logistic.epoch, modelBag.logistic.lossHistory
      );
    } else if (algo === 'kmeans') {
      modelBag.kmeans = modelBag.kmeans.centroids.length !== state.params.kmeansK
        ? ML.initKMeans(state.points, state.params.kmeansK, rng)
        : ML.assignKMeans(state.points, modelBag.kmeans);
    } else if (algo === 'decision_tree') {
      modelBag.tree = ML.fitDecisionTree(state.points, state.params.maxDepth, state.params.minSamples, 0, false, rng);
    } else if (algo === 'random_forest') {
      modelBag.forest = ML.fitRandomForest(state.points, state.params.numTrees, state.params.maxDepth, state.params.minSamples, rng);
      if (state.selectedTreeIdx >= state.params.numTrees) state.selectedTreeIdx = 0;
    } else if (algo === 'gradient_boosting') {
      modelBag.gb = ML.fitGradientBoosting(state.points, state.params.gbStages, state.params.gbLr, state.params.gbDepth);
      if (state.selectedStageIdx >= state.params.gbStages) state.selectedStageIdx = 0;
    } else if (algo === 'neural_net') {
      const labels = [...new Set(state.points.map(p => p.label))];
      const reqC = Math.max(2, labels.length ? Math.max(...labels) + 1 : 2);
      if (!modelBag.nn || modelBag.nn.hiddenSize !== state.params.nnHidden || modelBag.nn.numClasses !== reqC || modelBag.nn.activation !== state.params.nnAct) {
        modelBag.nn = ML.initNeuralNet(state.points, state.params.nnHidden, state.params.nnAct, rng);
      } else {
        modelBag.nn = ML.evalNeuralNet(state.points, modelBag.nn);
      }
    } else if (algo === 'svm') {
      modelBag.svm = ML.evalLinearSVM(
        state.points, modelBag.svm.w1, modelBag.svm.w2, modelBag.svm.b, modelBag.svm.epoch, state.params.svmC, modelBag.svm.lossHistory
      );
    } else if (algo === 'naive_bayes') {
      modelBag.nb = ML.fitGaussianNB(state.points);
    } else if (algo === 'pca') {
      modelBag.pca = ML.fitPCA(state.points);
    }
  }

  function stepCurrentModels() {
    stepAlgoModel(state.algo, state.models, 101);
    if (state.duelMode) {
      stepAlgoModel(state.duelAlgo, state.duelModels, 202);
    }
    const kmDone = state.algo === 'kmeans' && state.models.kmeans.converged && (!state.duelMode || state.duelAlgo !== 'kmeans' || state.duelModels.kmeans.converged);
    if (kmDone && state.running) {
      stopAnimation();
      showToast(`K-Means converged at step ${state.models.kmeans.step}`);
    }
    drawAllCanvases();
    renderMetrics();
    renderCurve();
    renderInternals();
    renderProbeBanner();
  }

  function recomputeAndRender() {
    recomputeAlgoModel(state.algo, state.models, 101);
    if (state.duelMode) {
      recomputeAlgoModel(state.duelAlgo, state.duelModels, 202);
    }
    drawAllCanvases();
    renderMetrics();
    renderCurve();
    renderDataTable();
    renderInternals();
    renderProbeBanner();
  }

  // Canvas Drawing
  function drawAllCanvases() {
    drawSingleCanvas(els.canvas, state.algo, state.models);
    if (state.duelMode) {
      drawSingleCanvas(els.duelCanvas, state.duelAlgo, state.duelModels);
    }
  }

  function drawSingleCanvas(canvas, algo, modelBag) {
    if (!canvas || !canvas.parentElement) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = Math.max(260, Math.floor(rect.width));
    const h = Math.max(200, Math.floor(rect.height));
    if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    drawDecisionRegions(ctx, w, h, algo, modelBag);
    drawGrid(ctx, w, h);
    drawAlgoOverlay(ctx, w, h, algo, modelBag);
    drawPoints(ctx, w, h, algo, modelBag);
    drawProbe(ctx, w, h, algo, modelBag);
  }

  function drawGrid(ctx, w, h) {
    ctx.save();
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.06)';
    ctx.lineWidth = 1;
    for (let v = -4; v <= 4; v++) {
      const [x] = worldToCanvas(v, 0, w, h);
      const [, y] = worldToCanvas(0, v, w, h);
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.22)';
    ctx.lineWidth = 1.2;
    const [ox, oy] = worldToCanvas(0, 0, w, h);
    ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(w, oy); ctx.stroke();

    ctx.fillStyle = '#475569';
    ctx.font = '10px system-ui, sans-serif';
    for (let v = -4; v <= 4; v += 2) {
      if (v === 0) continue;
      const [x] = worldToCanvas(v, 0, w, h);
      const [, y] = worldToCanvas(0, v, w, h);
      ctx.fillText(String(v), x + 3, oy - 4);
      ctx.fillText(String(v), ox + 4, y - 3);
    }
    ctx.restore();
  }

  function drawDecisionRegions(ctx, w, h, algo, modelBag) {
    const regionAlgos = ['logistic_reg', 'knn', 'kmeans', 'decision_tree', 'random_forest', 'gradient_boosting', 'neural_net', 'svm', 'naive_bayes'];
    if (!regionAlgos.includes(algo) || state.points.length === 0) return;

    const step = 8;
    for (let py = 0; py < h; py += step) {
      for (let px = 0; px < w; px += step) {
        const pt = canvasToWorld(px + step / 2, py + step / 2, w, h);
        let rgb = null;
        let alpha = 0.16;

        if (algo === 'logistic_reg') {
          const { w1, w2, b } = modelBag.logistic;
          const z = w1 * pt.x + w2 * pt.y + b;
          const p = 1 / (1 + Math.exp(-Math.max(-30, Math.min(30, z))));
          rgb = p >= 0.5 ? CLASS_BG[1] : CLASS_BG[0];
          alpha = 0.08 + Math.abs(p - 0.5) * 0.26;
        } else if (algo === 'knn') {
          const res = ML.predictKNN(state.points, pt, state.params.k, state.params.metric);
          rgb = CLASS_BG[res.label % CLASS_BG.length];
        } else if (algo === 'kmeans') {
          const cs = modelBag.kmeans.centroids;
          if (cs.length === 0) continue;
          let best = 0, bestD = Infinity;
          for (let i = 0; i < cs.length; i++) {
            const d = (pt.x - cs[i].x) ** 2 + (pt.y - cs[i].y) ** 2;
            if (d < bestD) { bestD = d; best = i; }
          }
          rgb = CLASS_BG[best % CLASS_BG.length];
          alpha = 0.14;
        } else if (algo === 'decision_tree' && modelBag.tree) {
          rgb = CLASS_BG[ML.predictTree(modelBag.tree, pt) % CLASS_BG.length];
        } else if (algo === 'random_forest' && modelBag.forest.trees.length) {
          rgb = CLASS_BG[ML.predictRandomForest(modelBag.forest, pt) % CLASS_BG.length];
        } else if (algo === 'gradient_boosting' && modelBag.gb.stages.length) {
          const res = ML.predictGradientBoosting(modelBag.gb, pt);
          rgb = CLASS_BG[res.label % CLASS_BG.length];
          alpha = 0.08 + Math.abs(res.prob - 0.5) * 0.28;
        } else if (algo === 'neural_net' && modelBag.nn) {
          const res = ML.predictNeuralNet(modelBag.nn, pt);
          rgb = CLASS_BG[res.label % CLASS_BG.length];
          const conf = res.probs[res.label] || 0.5;
          alpha = 0.08 + (conf - 1 / res.probs.length) * 0.3;
        } else if (algo === 'svm') {
          const { w1, w2, b } = modelBag.svm;
          const score = w1 * pt.x + w2 * pt.y + b;
          rgb = score >= 0 ? CLASS_BG[1] : CLASS_BG[0];
          alpha = Math.abs(score) < 1 ? 0.08 : 0.18;
        } else if (algo === 'naive_bayes' && Object.keys(modelBag.nb).length > 0) {
          rgb = CLASS_BG[ML.predictGaussianNB(modelBag.nb, pt) % CLASS_BG.length];
        }

        if (rgb) {
          ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
          ctx.fillRect(px, py, step, step);
        }
      }
    }
  }

  function drawLineEq(ctx, w, h, a, b, c, color, width = 2, dash = []) {
    const pts = [];
    if (Math.abs(b) > 1e-6) {
      for (const x of [-5, 5]) {
        const y = -(a * x + c) / b;
        if (y >= -5.2 && y <= 5.2) pts.push([x, y]);
      }
    }
    if (Math.abs(a) > 1e-6) {
      for (const y of [-5, 5]) {
        const x = -(b * y + c) / a;
        if (x >= -5.2 && x <= 5.2) pts.push([x, y]);
      }
    }
    if (pts.length < 2) return;
    const [x1, y1] = worldToCanvas(pts[0][0], pts[0][1], w, h);
    const [x2, y2] = worldToCanvas(pts[1][0], pts[1][1], w, h);
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dash);
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.restore();
  }

  function drawAlgoOverlay(ctx, w, h, algo, modelBag) {
    if (algo === 'linear_reg' && state.points.length >= 2) {
      const { w: slope, b } = modelBag.linear;
      if (state.params.showResiduals) {
        ctx.save();
        ctx.strokeStyle = 'rgba(213, 94, 0, 0.55)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 3]);
        for (const p of state.points) {
          const pred = slope * p.x + b;
          const [px, py] = worldToCanvas(p.x, p.y, w, h);
          const [, ry] = worldToCanvas(p.x, pred, w, h);
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, ry); ctx.stroke();
        }
        ctx.restore();
      }
      drawLineEq(ctx, w, h, slope, -1, b, '#1d4ed8', 2.6);
    } else if (algo === 'logistic_reg' && state.points.length >= 2) {
      const { w1, w2, b } = modelBag.logistic;
      drawLineEq(ctx, w, h, w1, w2, b, '#0f172a', 2.4);
    } else if (algo === 'svm' && state.points.length >= 2) {
      const { w1, w2, b } = modelBag.svm;
      drawLineEq(ctx, w, h, w1, w2, b, '#0f172a', 2.4);
      drawLineEq(ctx, w, h, w1, w2, b - 1, 'rgba(15, 23, 42, 0.5)', 1.5, [6, 4]);
      drawLineEq(ctx, w, h, w1, w2, b + 1, 'rgba(15, 23, 42, 0.5)', 1.5, [6, 4]);
    } else if (algo === 'kmeans') {
      const km = modelBag.kmeans;
      ctx.save();
      for (let i = 0; i < state.points.length; i++) {
        const cIdx = km.assignments[i];
        const c = km.centroids[cIdx];
        if (!c) continue;
        const [px, py] = worldToCanvas(state.points[i].x, state.points[i].y, w, h);
        const [cx, cy] = worldToCanvas(c.x, c.y, w, h);
        ctx.strokeStyle = CLASS_COLORS[cIdx % CLASS_COLORS.length] + '55';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(cx, cy); ctx.stroke();
      }
      for (let i = 0; i < km.centroids.length; i++) {
        const trail = km.trails[i] || [];
        if (trail.length > 1) {
          ctx.strokeStyle = CLASS_COLORS[i % CLASS_COLORS.length];
          ctx.lineWidth = 1.6;
          ctx.setLineDash([4, 3]);
          ctx.beginPath();
          trail.forEach((pt, idx) => {
            const [tx, ty] = worldToCanvas(pt.x, pt.y, w, h);
            if (idx === 0) ctx.moveTo(tx, ty); else ctx.lineTo(tx, ty);
          });
          ctx.stroke();
          ctx.setLineDash([]);
        }
        const [cx, cy] = worldToCanvas(km.centroids[i].x, km.centroids[i].y, w, h);
        ctx.strokeStyle = CLASS_COLORS[i % CLASS_COLORS.length];
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.restore();
    } else if (algo === 'naive_bayes') {
      ctx.save();
      for (const s of Object.values(modelBag.nb)) {
        const [cx, cy] = worldToCanvas(s.mx, s.my, w, h);
        const rx = (Math.sqrt(s.vx) / 10) * w;
        const ry = (Math.sqrt(s.vy) / 10) * h;
        const color = CLASS_COLORS[s.label % CLASS_COLORS.length];
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 4]);
        ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = 0.45;
        ctx.beginPath(); ctx.ellipse(cx, cy, rx * 2, ry * 2, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = 1;
      }
      ctx.restore();
    } else if (algo === 'pca' && modelBag.pca.valid) {
      const { mx, my, pc1, pc2, var1, var2 } = modelBag.pca;
      const [ox, oy] = worldToCanvas(mx, my, w, h);
      if (state.params.showProjections) {
        ctx.save();
        ctx.strokeStyle = 'rgba(230, 159, 0, 0.65)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 3]);
        for (const p of state.points) {
          const proj = (p.x - mx) * pc1[0] + (p.y - my) * pc1[1];
          const [px1, py1] = worldToCanvas(p.x, p.y, w, h);
          const [px2, py2] = worldToCanvas(mx + proj * pc1[0], my + proj * pc1[1], w, h);
          ctx.beginPath(); ctx.moveTo(px1, py1); ctx.lineTo(px2, py2); ctx.stroke();
          ctx.fillStyle = '#E69F00';
          ctx.beginPath(); ctx.arc(px2, py2, 3, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      }
      const len1 = Math.max(1.2, Math.sqrt(var1) * 1.8);
      const len2 = Math.max(0.8, Math.sqrt(var2) * 1.8);
      drawArrow(ctx, w, h, mx - pc1[0] * len1, my - pc1[1] * len1, mx + pc1[0] * len1, my + pc1[1] * len1, '#0072B2', 3, 'PC1');
      drawArrow(ctx, w, h, mx - pc2[0] * len2, my - pc2[1] * len2, mx + pc2[0] * len2, my + pc2[1] * len2, '#D55E00', 2.2, 'PC2');
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.arc(ox, oy, 4.5, 0, Math.PI * 2); ctx.fill();
    }
  }

  function drawArrow(ctx, w, h, x1, y1, x2, y2, color, width, label) {
    const [cx1, cy1] = worldToCanvas(x1, y1, w, h);
    const [cx2, cy2] = worldToCanvas(x2, y2, w, h);
    ctx.save();
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width;
    ctx.beginPath(); ctx.moveTo(cx1, cy1); ctx.lineTo(cx2, cy2); ctx.stroke();
    const angle = Math.atan2(cy2 - cy1, cx2 - cx1);
    ctx.beginPath();
    ctx.moveTo(cx2, cy2);
    ctx.lineTo(cx2 - 10 * Math.cos(angle - 0.4), cy2 - 10 * Math.sin(angle - 0.4));
    ctx.lineTo(cx2 - 10 * Math.cos(angle + 0.4), cy2 - 10 * Math.sin(angle + 0.4));
    ctx.closePath(); ctx.fill();
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.fillText(label, cx2 + 6, cy2 - 6);
    ctx.restore();
  }

  function drawPoints(ctx, w, h, algo, modelBag) {
    const svSet = new Set(algo === 'svm' ? modelBag.svm.supportIndices : []);
    for (let i = 0; i < state.points.length; i++) {
      const p = state.points[i];
      const [px, py] = worldToCanvas(p.x, p.y, w, h);
      let color = '#1d4ed8';
      if (algo === 'kmeans') {
        const cIdx = modelBag.kmeans.assignments[i];
        color = cIdx !== undefined ? CLASS_COLORS[cIdx % CLASS_COLORS.length] : '#64748b';
      } else if (ALGO_META[algo].type === 'binary' || ALGO_META[algo].type === 'multiclass') {
        color = CLASS_COLORS[p.label % CLASS_COLORS.length];
      }

      if (svSet.has(i)) {
        ctx.save();
        ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(px, py, 9.5, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      }
      ctx.fillStyle = color; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.arc(px, py, 5.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
  }

  function drawProbe(ctx, w, h, algo, modelBag) {
    const q = state.probePoint;
    if (!q || state.points.length === 0) return;
    const [qx, qy] = worldToCanvas(q.x, q.y, w, h);
    const modelObj = getActiveModelObj(algo, modelBag);
    const info = ML.explainProbe(algo, modelObj, state.points, state.params, q);
    if (!info) return;

    if (algo === 'knn') {
      const res = ML.predictKNN(state.points, q, state.params.k, state.params.metric);
      ctx.save();
      ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.3; ctx.setLineDash([4, 3]);
      for (const nb of res.neighbors) {
        const [nx, ny] = worldToCanvas(nb.point.x, nb.point.y, w, h);
        ctx.beginPath(); ctx.moveTo(qx, qy); ctx.lineTo(nx, ny); ctx.stroke();
      }
      ctx.restore();
    }

    ctx.save();
    ctx.fillStyle = CLASS_COLORS[info.label % CLASS_COLORS.length];
    ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.rect(qx - 7, qy - 7, 14, 14); ctx.fill(); ctx.stroke();
    ctx.restore();
  }

  function getActiveModelObj(algo, modelBag) {
    if (algo === 'linear_reg') return modelBag.linear;
    if (algo === 'logistic_reg') return modelBag.logistic;
    if (algo === 'decision_tree') return modelBag.tree;
    if (algo === 'random_forest') return modelBag.forest;
    if (algo === 'gradient_boosting') return modelBag.gb;
    if (algo === 'neural_net') return modelBag.nn;
    if (algo === 'svm') return modelBag.svm;
    if (algo === 'naive_bayes') return modelBag.nb;
    if (algo === 'kmeans') return modelBag.kmeans;
    if (algo === 'pca') return modelBag.pca;
    return null;
  }

  // Live Loss / Metric Curve SVG (Borrowed from TensorFlow Playground, adapted across algorithms)
  function getLossSeries(algo, modelBag) {
    if (algo === 'linear_reg' && state.params.regSolver === 'gd') return { name: 'MSE', data: modelBag.linear.lossHistory || [] };
    if (algo === 'logistic_reg') return { name: 'Log Loss', data: modelBag.logistic.lossHistory || [] };
    if (algo === 'neural_net' && modelBag.nn) return { name: 'Cross-Entropy', data: modelBag.nn.lossHistory || [] };
    if (algo === 'svm') return { name: 'Hinge + L2', data: modelBag.svm.lossHistory || [] };
    if (algo === 'kmeans') return { name: 'Inertia', data: modelBag.kmeans.lossHistory || [] };
    if (algo === 'gradient_boosting') return { name: 'Stage Log Loss', data: modelBag.gb.lossHistory || [] };
    return null;
  }

  function renderCurve() {
    const s1 = getLossSeries(state.algo, state.models);
    const s2 = state.duelMode ? getLossSeries(state.duelAlgo, state.duelModels) : null;
    const has1 = s1 && s1.data.length >= 2;
    const has2 = s2 && s2.data.length >= 2;

    if (!has1 && !has2) {
      els.curveCard.classList.add('hidden');
      return;
    }
    els.curveCard.classList.remove('hidden');

    const W = 620, H = 130, PAD_L = 44, PAD_R = 14, PAD_T = 12, PAD_B = 22;
    const allVals = [...(has1 ? s1.data : []), ...(has2 ? s2.data : [])];
    const minV = Math.min(...allVals);
    const maxV = Math.max(...allVals, minV + 1e-4);
    const maxLen = Math.max(has1 ? s1.data.length : 0, has2 ? s2.data.length : 0, 2);

    const toPts = arr => arr.map((v, i) => {
      const x = PAD_L + (i / (maxLen - 1)) * (W - PAD_L - PAD_R);
      const y = PAD_T + (1 - (v - minV) / (maxV - minV)) * (H - PAD_T - PAD_B);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    const line1 = has1 ? `<polyline fill="none" stroke="#1d4ed8" stroke-width="2.2" points="${toPts(s1.data)}"/>` : '';
    const line2 = has2 ? `<polyline fill="none" stroke="#D55E00" stroke-width="2.2" stroke-dasharray="5,3" points="${toPts(s2.data)}"/>` : '';

    els.curveLegend.textContent = [
      has1 ? `${ALGO_META[state.algo].name}: ${s1.data[s1.data.length - 1].toFixed(3)}` : '',
      has2 ? `${ALGO_META[state.duelAlgo].name}: ${s2.data[s2.data.length - 1].toFixed(3)}` : ''
    ].filter(Boolean).join('  |  ');

    els.curveStage.innerHTML = `
      <svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-label="Training loss curve">
        <line x1="${PAD_L}" y1="${PAD_T}" x2="${PAD_L}" y2="${H - PAD_B}" stroke="#cbd5e1" stroke-width="1"/>
        <line x1="${PAD_L}" y1="${H - PAD_B}" x2="${W - PAD_R}" y2="${H - PAD_B}" stroke="#cbd5e1" stroke-width="1"/>
        <text x="${PAD_L - 6}" y="${PAD_T + 8}" fill="#475569" font-size="10" text-anchor="end">${maxV.toFixed(2)}</text>
        <text x="${PAD_L - 6}" y="${H - PAD_B}" fill="#475569" font-size="10" text-anchor="end">${minV.toFixed(2)}</text>
        <text x="${W - PAD_R}" y="${H - 6}" fill="#475569" font-size="10" text-anchor="end">Step ${maxLen}</text>
        ${line1}${line2}
      </svg>
    `;
  }

  function renderProbeBanner() {
    if (!state.probePoint || state.points.length === 0) {
      els.probeBanner.classList.add('hidden');
      return;
    }
    const p1 = ML.explainProbe(state.algo, getActiveModelObj(state.algo, state.models), state.points, state.params, state.probePoint);
    const p2 = state.duelMode
      ? ML.explainProbe(state.duelAlgo, getActiveModelObj(state.duelAlgo, state.duelModels), state.points, state.params, state.probePoint)
      : null;
    if (!p1 && !p2) {
      els.probeBanner.classList.add('hidden');
      return;
    }
    els.probeBanner.classList.remove('hidden');
    const coord = `(${state.probePoint.x.toFixed(2)}, ${state.probePoint.y.toFixed(2)})`;
    if (state.duelMode) {
      els.probeBanner.textContent = `Query ${coord} — ${ALGO_META[state.algo].name}: ${p1 ? p1.detail : 'N/A'}  |  ${ALGO_META[state.duelAlgo].name}: ${p2 ? p2.detail : 'N/A'}`;
    } else {
      els.probeBanner.textContent = `Query ${coord}: ${p1.detail}`;
    }
  }

  // Visual SVG Internals Renderers
  function renderTreeSVG(root, isRegTree = false) {
    if (!root) return '<div style="color:#475569;padding:12px;">Add points to build the tree.</div>';
    const nodes = [];
    const edges = [];
    let leafCounter = 0;

    function layout(node, depth) {
      if (!node) return { x: 0 };
      if (node.leaf) {
        const x = leafCounter * 125 + 65;
        leafCounter++;
        const item = { node, x, y: depth * 74 + 36 };
        nodes.push(item);
        return item;
      }
      const leftPos = layout(node.left, depth + 1);
      const rightPos = layout(node.right, depth + 1);
      const x = (leftPos.x + rightPos.x) / 2;
      const item = { node, x, y: depth * 74 + 36 };
      nodes.push(item);
      edges.push({ from: item, to: leftPos, label: 'True' });
      edges.push({ from: item, to: rightPos, label: 'False' });
      return item;
    }

    layout(root, 0);
    const width = Math.max(420, leafCounter * 125 + 30);
    const maxDepth = Math.max(...nodes.map(n => n.node.depth || 0), 0);
    const height = (maxDepth + 1) * 74 + 26;

    const edgeSvg = edges.map(e => `
      <line x1="${e.from.x}" y1="${e.from.y + 18}" x2="${e.to.x}" y2="${e.to.y - 18}" stroke="#94a3b8" stroke-width="1.5"/>
      <text x="${(e.from.x + e.to.x) / 2}" y="${(e.from.y + e.to.y) / 2}" fill="#475569" font-size="9" text-anchor="middle">${e.label}</text>
    `).join('');

    const nodeSvg = nodes.map(({ node, x, y }) => {
      if (node.leaf) {
        const color = isRegTree
          ? (node.val >= 0 ? '#D55E00' : '#0072B2')
          : CLASS_COLORS[node.label % CLASS_COLORS.length];
        const title = isRegTree ? `Δ=${node.val.toFixed(2)}` : `Class ${node.label}`;
        const sub = isRegTree ? `n=${node.count}` : `n=${node.count} · g=${node.gini.toFixed(2)}`;
        return `
          <g transform="translate(${x},${y})">
            <rect x="-50" y="-18" width="100" height="36" rx="6" fill="#ffffff" stroke="${color}" stroke-width="2"/>
            <text y="-2" fill="${color}" font-size="11" font-weight="700" text-anchor="middle">${title}</text>
            <text y="12" fill="#475569" font-size="9" text-anchor="middle">${sub}</text>
          </g>
        `;
      }
      return `
        <g transform="translate(${x},${y})">
          <rect x="-54" y="-18" width="108" height="36" rx="6" fill="#eff6ff" stroke="#1d4ed8" stroke-width="1.5"/>
          <text y="-2" fill="#0f172a" font-size="11" font-weight="700" text-anchor="middle">${node.feat.toUpperCase()} ≤ ${node.thresh.toFixed(2)}</text>
          <text y="12" fill="#1d4ed8" font-size="9" text-anchor="middle">n=${node.count}${!isRegTree ? ` · g=${node.gini.toFixed(2)}` : ''}</text>
        </g>
      `;
    }).join('');

    return `<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${edgeSvg}${nodeSvg}</svg>`;
  }

  function renderNeuralNetSVG(net) {
    if (!net) return '';
    const W = 560, H = 250;
    const inPos = [[80, 85], [80, 175]];
    const hidPos = Array.from({ length: net.hiddenSize }, (_, i) => [
      280,
      ((i + 1) / (net.hiddenSize + 1)) * (H - 30) + 15
    ]);
    const outPos = Array.from({ length: net.numClasses }, (_, c) => [
      480,
      ((c + 1) / (net.numClasses + 1)) * (H - 40) + 20
    ]);

    let edges = '';
    for (let i = 0; i < net.hiddenSize; i++) {
      for (let j = 0; j < 2; j++) {
        const w = net.W1[i][j];
        const col = w >= 0 ? '#0072B2' : '#D55E00';
        const sw = Math.min(4.5, 0.7 + Math.abs(w) * 1.6);
        const op = Math.min(0.95, 0.25 + Math.abs(w) * 0.45);
        edges += `<line x1="${inPos[j][0]}" y1="${inPos[j][1]}" x2="${hidPos[i][0]}" y2="${hidPos[i][1]}" stroke="${col}" stroke-width="${sw.toFixed(2)}" stroke-opacity="${op.toFixed(2)}"/>`;
      }
    }
    for (let c = 0; c < net.numClasses; c++) {
      for (let i = 0; i < net.hiddenSize; i++) {
        const w = net.W2[c][i];
        const col = w >= 0 ? '#0072B2' : '#D55E00';
        const sw = Math.min(4.5, 0.7 + Math.abs(w) * 1.6);
        const op = Math.min(0.95, 0.25 + Math.abs(w) * 0.45);
        edges += `<line x1="${hidPos[i][0]}" y1="${hidPos[i][1]}" x2="${outPos[c][0]}" y2="${outPos[c][1]}" stroke="${col}" stroke-width="${sw.toFixed(2)}" stroke-opacity="${op.toFixed(2)}"/>`;
      }
    }

    let nodes = '';
    ['x₁', 'x₂'].forEach((lbl, j) => {
      nodes += `<circle cx="${inPos[j][0]}" cy="${inPos[j][1]}" r="16" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
        <text x="${inPos[j][0]}" y="${inPos[j][1] + 4}" fill="#0f172a" font-size="12" font-weight="700" text-anchor="middle">${lbl}</text>`;
    });
    hidPos.forEach(([x, y], i) => {
      nodes += `<circle cx="${x}" cy="${y}" r="14" fill="#eff6ff" stroke="#1d4ed8" stroke-width="1.8"/>
        <text x="${x}" y="${y + 4}" fill="#1d4ed8" font-size="10" font-weight="700" text-anchor="middle">h${i + 1}</text>`;
    });
    outPos.forEach(([x, y], c) => {
      const col = CLASS_COLORS[c % CLASS_COLORS.length];
      nodes += `<circle cx="${x}" cy="${y}" r="16" fill="#ffffff" stroke="${col}" stroke-width="2.2"/>
        <text x="${x}" y="${y + 4}" fill="${col}" font-size="11" font-weight="700" text-anchor="middle">C${c}</text>`;
    });

    const labels = `
      <text x="80" y="22" fill="#475569" font-size="11" text-anchor="middle">Input (2)</text>
      <text x="280" y="22" fill="#475569" font-size="11" text-anchor="middle">Hidden (${net.hiddenSize} · ${net.activation})</text>
      <text x="480" y="22" fill="#475569" font-size="11" text-anchor="middle">Output (${net.numClasses})</text>
    `;
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${labels}${edges}${nodes}</svg>`;
  }

  function renderInternals() {
    const a = state.algo;
    const card = els.internalsCard;
    if (a === 'decision_tree') {
      card.classList.remove('hidden');
      els.internalsTitle.textContent = 'Decision Tree Structure (Gini Splits)';
      els.internalsTabs.innerHTML = '';
      els.internalsStage.innerHTML = renderTreeSVG(state.models.tree, false);
    } else if (a === 'random_forest') {
      card.classList.remove('hidden');
      const rf = state.models.forest;
      els.internalsTitle.textContent = `Random Forest Ensemble (${rf.trees.length} Trees)`;
      els.internalsTabs.innerHTML = rf.trees.map((_, idx) => `
        <button class="sub-tab ${state.selectedTreeIdx === idx ? 'active' : ''}" type="button" data-tree-idx="${idx}">
          Tree #${idx + 1} (${(rf.accuracies[idx] * 100).toFixed(0)}%)
        </button>
      `).join('');
      els.internalsTabs.querySelectorAll('[data-tree-idx]').forEach(btn => {
        btn.addEventListener('click', () => {
          state.selectedTreeIdx = Number(btn.dataset.treeIdx);
          renderInternals();
        });
      });
      els.internalsStage.innerHTML = renderTreeSVG(rf.trees[state.selectedTreeIdx], false);
    } else if (a === 'gradient_boosting') {
      card.classList.remove('hidden');
      const gb = state.models.gb;
      els.internalsTitle.textContent = `Gradient Boosting Stages (${gb.stages.length} Trees)`;
      els.internalsTabs.innerHTML = gb.stages.map((_, idx) => `
        <button class="sub-tab ${state.selectedStageIdx === idx ? 'active' : ''}" type="button" data-stage-idx="${idx}">
          Stage ${idx + 1} (${gb.lossHistory[idx].toFixed(2)})
        </button>
      `).join('');
      els.internalsTabs.querySelectorAll('[data-stage-idx]').forEach(btn => {
        btn.addEventListener('click', () => {
          state.selectedStageIdx = Number(btn.dataset.stageIdx);
          renderInternals();
        });
      });
      els.internalsStage.innerHTML = renderTreeSVG(gb.stages[state.selectedStageIdx], true);
    } else if (a === 'neural_net') {
      card.classList.remove('hidden');
      els.internalsTitle.textContent = 'Neural Network Weights (Blue = Positive, Orange = Negative)';
      els.internalsTabs.innerHTML = '';
      els.internalsStage.innerHTML = renderNeuralNetSVG(state.models.nn);
    } else {
      card.classList.add('hidden');
    }
  }

  // UI Renderers
  function populateAlgoSelectors() {
    const options = Object.entries(ALGO_META).map(([id, m]) => `<option value="${id}">${m.name}</option>`).join('');
    els.algoSelect.innerHTML = options;
    els.duelAlgoSelect.innerHTML = options;
    els.algoSelect.value = state.algo;
    els.duelAlgoSelect.value = state.duelAlgo;
  }

  function renderHeaderInfo() {
    const meta = ALGO_META[state.algo];
    els.algoTitle.textContent = state.duelMode
      ? `${meta.name} vs. ${ALGO_META[state.duelAlgo].name}`
      : meta.name;
    els.algoBadge.textContent = meta.badge;
    els.algoIntuition.textContent = meta.intuition;
    els.whatToNotice.textContent = meta.notice;
    els.seedBadge.textContent = String(state.seed);

    els.duelToggleBtn.setAttribute('aria-pressed', state.duelMode ? 'true' : 'false');
    els.duelToggleBtn.classList.toggle('active', state.duelMode);
    els.duelToggleBtn.textContent = state.duelMode ? 'Duel Mode: On' : 'Duel Mode: Off';
    els.duelSelectWrap.classList.toggle('hidden', !state.duelMode);
    els.duelCard.classList.toggle('hidden', !state.duelMode);
    els.primaryDuelHeader.classList.toggle('hidden', !state.duelMode);
    els.canvasesRow.classList.toggle('duel-active', state.duelMode);
    els.primaryDuelName.textContent = meta.name;
    els.duelAlgoName.textContent = ALGO_META[state.duelAlgo].name;
  }

  function isIterativeAlgo(algo) {
    return ['logistic_reg', 'kmeans', 'svm', 'neural_net'].includes(algo) ||
      (algo === 'linear_reg' && state.params.regSolver === 'gd');
  }

  function renderToolbar() {
    const meta = ALGO_META[state.algo];
    let classPills = '';
    if (meta.type === 'binary' || meta.type === 'multiclass') {
      const maxC = meta.type === 'binary' ? 2 : 3;
      for (let c = 0; c < maxC; c++) {
        classPills += `<button class="class-pill ${state.activeLabel === c && state.mode === 'add' ? 'active' : ''}" type="button" data-class="${c}">
          <span class="dot" style="background:${CLASS_COLORS[c]}"></span> Class ${c}
        </button>`;
      }
    }

    const canProbe = meta.type === 'binary' || meta.type === 'multiclass';
    const showStep = isIterativeAlgo(state.algo) || (state.duelMode && isIterativeAlgo(state.duelAlgo));

    els.toolbar.innerHTML = `
      <div class="toolbar-group">
        ${classPills}
        ${meta.type === 'regression' || meta.type === 'unlabeled' ? `<button class="class-pill ${state.mode === 'add' ? 'active' : ''}" type="button" id="modeAddBtn"><span class="dot" style="background:#1d4ed8"></span> Add Point</button>` : ''}
        <button class="btn btn-sm ${state.mode === 'erase' ? 'active' : ''}" type="button" id="modeEraseBtn">Eraser</button>
        ${canProbe ? `<button class="btn btn-sm ${state.mode === 'probe' ? 'active' : ''}" type="button" id="modeProbeBtn">Test Query</button>` : ''}
      </div>
      <div class="toolbar-group">
        ${showStep ? `
          <button class="btn btn-sm btn-primary" type="button" id="runToggleBtn">${state.running ? 'Pause' : 'Train'}</button>
          <button class="btn btn-sm" type="button" id="stepBtn">Step</button>
          <button class="btn btn-sm" type="button" id="resetModelBtn">Reset Model</button>
        ` : ''}
        <button class="btn btn-sm btn-danger" type="button" id="clearPtsBtn">Clear Points</button>
      </div>
    `;

    els.toolbar.querySelectorAll('[data-class]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeLabel = Number(btn.dataset.class);
        state.mode = 'add';
        renderToolbar();
      });
    });

    const addBtn = $('modeAddBtn');
    if (addBtn) addBtn.addEventListener('click', () => { state.mode = 'add'; renderToolbar(); });

    $('modeEraseBtn').addEventListener('click', () => {
      state.mode = state.mode === 'erase' ? 'add' : 'erase';
      renderToolbar();
    });

    const probeBtn = $('modeProbeBtn');
    if (probeBtn) {
      probeBtn.addEventListener('click', () => {
        state.mode = state.mode === 'probe' ? 'add' : 'probe';
        renderToolbar();
      });
    }

    const runBtn = $('runToggleBtn');
    if (runBtn) {
      runBtn.addEventListener('click', () => {
        if (state.running) {
          stopAnimation();
        } else {
          state.running = true;
          updateRunButtons();
          const interval = prefersReducedMotion() ? 220 : (state.algo === 'kmeans' ? 420 : 60);
          state.timerId = setInterval(stepCurrentModels, interval);
        }
      });
    }

    const stepBtn = $('stepBtn');
    if (stepBtn) stepBtn.addEventListener('click', stepCurrentModels);

    const resetBtn = $('resetModelBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        stopAnimation();
        resetAllModels();
        recomputeAndRender();
      });
    }

    $('clearPtsBtn').addEventListener('click', () => {
      stopAnimation();
      state.points = [];
      state.probePoint = null;
      resetAllModels();
      recomputeAndRender();
    });
  }

  function updateRunButtons() {
    const runBtn = $('runToggleBtn');
    if (runBtn) runBtn.textContent = state.running ? 'Pause' : 'Train';
  }

  function renderControls() {
    const activeAlgos = state.duelMode ? [state.algo, state.duelAlgo] : [state.algo];
    const has = id => activeAlgos.includes(id);

    let html = `
      <div class="control-row">
        <label class="control-label" for="presetSelect"><span>Dataset Preset</span></label>
        <select id="presetSelect">
          <option value="linear" ${state.preset === 'linear' ? 'selected' : ''}>Linear + Noise</option>
          <option value="separable" ${state.preset === 'separable' ? 'selected' : ''}>Linearly Separable (2 Classes)</option>
          <option value="blobs3" ${state.preset === 'blobs3' ? 'selected' : ''}>3 Cluster Blobs</option>
          <option value="moons" ${state.preset === 'moons' ? 'selected' : ''}>Two Moons (Curved)</option>
          <option value="xor" ${state.preset === 'xor' ? 'selected' : ''}>XOR Quadrants</option>
          <option value="correlated" ${state.preset === 'correlated' ? 'selected' : ''}>Correlated Ellipse</option>
        </select>
      </div>
    `;

    if (has('linear_reg')) {
      html += `
        <div class="control-row">
          <label class="control-label" for="regSolverSelect"><span>Regression Solver</span></label>
          <select id="regSolverSelect">
            <option value="ols" ${state.params.regSolver === 'ols' ? 'selected' : ''}>Exact (Ordinary Least Squares)</option>
            <option value="gd" ${state.params.regSolver === 'gd' ? 'selected' : ''}>Gradient Descent (Step-by-Step)</option>
          </select>
        </div>
        <div class="control-row">
          <label class="control-label" for="showResidualsSelect"><span>Show Error Lines</span></label>
          <select id="showResidualsSelect">
            <option value="1" ${state.params.showResiduals ? 'selected' : ''}>On</option>
            <option value="0" ${!state.params.showResiduals ? 'selected' : ''}>Off</option>
          </select>
        </div>
      `;
    }

    if (has('logistic_reg') || has('svm') || has('neural_net') || (has('linear_reg') && state.params.regSolver === 'gd')) {
      html += `
        <div class="control-row">
          <label class="control-label" for="lrSlider"><span>Step Size (Learning Rate)</span><span class="control-val" id="lrVal">${state.params.lr}</span></label>
          <input type="range" id="lrSlider" min="0.01" max="0.4" step="0.01" value="${state.params.lr}">
        </div>
      `;
    }

    if (has('neural_net')) {
      html += `
        <div class="control-row">
          <label class="control-label" for="nnHidSlider"><span>Hidden Neurons</span><span class="control-val" id="nnHidVal">${state.params.nnHidden}</span></label>
          <input type="range" id="nnHidSlider" min="2" max="8" step="1" value="${state.params.nnHidden}">
        </div>
        <div class="control-row">
          <label class="control-label" for="nnActSelect"><span>Activation Curve</span></label>
          <select id="nnActSelect">
            <option value="tanh" ${state.params.nnAct === 'tanh' ? 'selected' : ''}>Tanh</option>
            <option value="relu" ${state.params.nnAct === 'relu' ? 'selected' : ''}>Leaky ReLU</option>
            <option value="sigmoid" ${state.params.nnAct === 'sigmoid' ? 'selected' : ''}>Sigmoid</option>
          </select>
        </div>
      `;
    }

    if (has('knn')) {
      html += `
        <div class="control-row">
          <label class="control-label" for="kSlider"><span>Neighbors to Check (K)</span><span class="control-val" id="kVal">${state.params.k}</span></label>
          <input type="range" id="kSlider" min="1" max="15" step="1" value="${state.params.k}">
        </div>
        <div class="control-row">
          <label class="control-label" for="metricSelect"><span>Distance Formula</span></label>
          <select id="metricSelect">
            <option value="euclidean" ${state.params.metric === 'euclidean' ? 'selected' : ''}>Euclidean (Straight-Line)</option>
            <option value="manhattan" ${state.params.metric === 'manhattan' ? 'selected' : ''}>Manhattan (Grid)</option>
          </select>
        </div>
      `;
    }

    if (has('kmeans')) {
      html += `
        <div class="control-row">
          <label class="control-label" for="kmKSlider"><span>Number of Clusters (K)</span><span class="control-val" id="kmKVal">${state.params.kmeansK}</span></label>
          <input type="range" id="kmKSlider" min="2" max="6" step="1" value="${state.params.kmeansK}">
        </div>
      `;
    }

    if (has('decision_tree') || has('random_forest')) {
      if (has('random_forest')) {
        html += `
          <div class="control-row">
            <label class="control-label" for="rfTreesSlider"><span>Trees in Forest</span><span class="control-val" id="rfTreesVal">${state.params.numTrees}</span></label>
            <input type="range" id="rfTreesSlider" min="3" max="9" step="1" value="${state.params.numTrees}">
          </div>
        `;
      }
      html += `
        <div class="control-row">
          <label class="control-label" for="depthSlider"><span>Tree Depth Limit</span><span class="control-val" id="depthVal">${state.params.maxDepth}</span></label>
          <input type="range" id="depthSlider" min="1" max="4" step="1" value="${state.params.maxDepth}">
        </div>
        <div class="control-row">
          <label class="control-label" for="minSampSlider"><span>Min Points to Split</span><span class="control-val" id="minSampVal">${state.params.minSamples}</span></label>
          <input type="range" id="minSampSlider" min="2" max="10" step="1" value="${state.params.minSamples}">
        </div>
      `;
    }

    if (has('gradient_boosting')) {
      html += `
        <div class="control-row">
          <label class="control-label" for="gbStagesSlider"><span>Boosting Rounds</span><span class="control-val" id="gbStagesVal">${state.params.gbStages}</span></label>
          <input type="range" id="gbStagesSlider" min="1" max="15" step="1" value="${state.params.gbStages}">
        </div>
        <div class="control-row">
          <label class="control-label" for="gbLrSlider"><span>Step Weight (Shrinkage)</span><span class="control-val" id="gbLrVal">${state.params.gbLr}</span></label>
          <input type="range" id="gbLrSlider" min="0.05" max="1.0" step="0.05" value="${state.params.gbLr}">
        </div>
        <div class="control-row">
          <label class="control-label" for="gbDepthSlider"><span>Tree Depth</span><span class="control-val" id="gbDepthVal">${state.params.gbDepth}</span></label>
          <input type="range" id="gbDepthSlider" min="1" max="3" step="1" value="${state.params.gbDepth}">
        </div>
      `;
    }

    if (has('svm')) {
      html += `
        <div class="control-row">
          <label class="control-label" for="svmCSlider"><span>Penalty Weight (C)</span><span class="control-val" id="svmCVal">${state.params.svmC}</span></label>
          <input type="range" id="svmCSlider" min="0.2" max="10" step="0.2" value="${state.params.svmC}">
        </div>
      `;
    }

    if (has('pca')) {
      html += `
        <div class="control-row">
          <label class="control-label" for="showProjSelect"><span>Show Projection Lines</span></label>
          <select id="showProjSelect">
            <option value="1" ${state.params.showProjections ? 'selected' : ''}>On</option>
            <option value="0" ${!state.params.showProjections ? 'selected' : ''}>Off</option>
          </select>
        </div>
      `;
    }

    els.controlsBox.innerHTML = html;

    $('presetSelect').addEventListener('change', e => loadPreset(e.target.value));
    const regSolver = $('regSolverSelect');
    if (regSolver) regSolver.addEventListener('change', e => { stopAnimation(); state.params.regSolver = e.target.value; renderToolbar(); renderControls(); recomputeAndRender(); });
    const showRes = $('showResidualsSelect');
    if (showRes) showRes.addEventListener('change', e => { state.params.showResiduals = e.target.value === '1'; drawAllCanvases(); });
    const lrSlider = $('lrSlider');
    if (lrSlider) lrSlider.addEventListener('input', e => { state.params.lr = Number(e.target.value); $('lrVal').textContent = state.params.lr; });
    const nnHidSlider = $('nnHidSlider');
    if (nnHidSlider) nnHidSlider.addEventListener('input', e => { stopAnimation(); state.params.nnHidden = Number(e.target.value); $('nnHidVal').textContent = state.params.nnHidden; recomputeAndRender(); });
    const nnActSelect = $('nnActSelect');
    if (nnActSelect) nnActSelect.addEventListener('change', e => { stopAnimation(); state.params.nnAct = e.target.value; recomputeAndRender(); });
    const kSlider = $('kSlider');
    if (kSlider) kSlider.addEventListener('input', e => { state.params.k = Number(e.target.value); $('kVal').textContent = state.params.k; recomputeAndRender(); });
    const metricSelect = $('metricSelect');
    if (metricSelect) metricSelect.addEventListener('change', e => { state.params.metric = e.target.value; recomputeAndRender(); });
    const kmKSlider = $('kmKSlider');
    if (kmKSlider) kmKSlider.addEventListener('input', e => { stopAnimation(); state.params.kmeansK = Number(e.target.value); $('kmKVal').textContent = state.params.kmeansK; resetAllModels(); recomputeAndRender(); });
    const rfTreesSlider = $('rfTreesSlider');
    if (rfTreesSlider) rfTreesSlider.addEventListener('input', e => { state.params.numTrees = Number(e.target.value); $('rfTreesVal').textContent = state.params.numTrees; recomputeAndRender(); });
    const depthSlider = $('depthSlider');
    if (depthSlider) depthSlider.addEventListener('input', e => { state.params.maxDepth = Number(e.target.value); $('depthVal').textContent = state.params.maxDepth; recomputeAndRender(); });
    const minSampSlider = $('minSampSlider');
    if (minSampSlider) minSampSlider.addEventListener('input', e => { state.params.minSamples = Number(e.target.value); $('minSampVal').textContent = state.params.minSamples; recomputeAndRender(); });
    const gbStagesSlider = $('gbStagesSlider');
    if (gbStagesSlider) gbStagesSlider.addEventListener('input', e => { state.params.gbStages = Number(e.target.value); $('gbStagesVal').textContent = state.params.gbStages; recomputeAndRender(); });
    const gbLrSlider = $('gbLrSlider');
    if (gbLrSlider) gbLrSlider.addEventListener('input', e => { state.params.gbLr = Number(e.target.value); $('gbLrVal').textContent = state.params.gbLr; recomputeAndRender(); });
    const gbDepthSlider = $('gbDepthSlider');
    if (gbDepthSlider) gbDepthSlider.addEventListener('input', e => { state.params.gbDepth = Number(e.target.value); $('gbDepthVal').textContent = state.params.gbDepth; recomputeAndRender(); });
    const svmCSlider = $('svmCSlider');
    if (svmCSlider) svmCSlider.addEventListener('input', e => { state.params.svmC = Number(e.target.value); $('svmCVal').textContent = state.params.svmC; recomputeAndRender(); });
    const showProj = $('showProjSelect');
    if (showProj) showProj.addEventListener('change', e => { state.params.showProjections = e.target.value === '1'; drawAllCanvases(); });

    const needsLabel = ALGO_META[state.algo].type === 'binary' || ALGO_META[state.algo].type === 'multiclass';
    els.inputLabelWrap.style.display = needsLabel ? 'block' : 'none';
  }

  function summarizeHeadlineMetric(algo, modelBag) {
    if (algo === 'linear_reg') return modelBag.linear.valid ? `R² ${modelBag.linear.r2.toFixed(3)}` : '—';
    if (algo === 'logistic_reg') return `${(modelBag.logistic.acc * 100).toFixed(1)}% acc · ep ${modelBag.logistic.epoch}`;
    if (algo === 'neural_net' && modelBag.nn) return `${(modelBag.nn.acc * 100).toFixed(1)}% acc · ep ${modelBag.nn.epoch}`;
    if (algo === 'svm') return `${(modelBag.svm.acc * 100).toFixed(1)}% acc · ep ${modelBag.svm.epoch}`;
    if (algo === 'kmeans') return `Inertia ${modelBag.kmeans.inertia.toFixed(1)} · step ${modelBag.kmeans.step}`;
    if (algo === 'decision_tree') {
      let c = 0; for (const p of state.points) if (ML.predictTree(modelBag.tree, p) === p.label) c++;
      return `${state.points.length ? ((c / state.points.length) * 100).toFixed(1) : 0}% acc`;
    }
    if (algo === 'random_forest') {
      let c = 0; for (const p of state.points) if (ML.predictRandomForest(modelBag.forest, p) === p.label) c++;
      return `${state.points.length ? ((c / state.points.length) * 100).toFixed(1) : 0}% acc`;
    }
    if (algo === 'gradient_boosting') return `${(modelBag.gb.acc * 100).toFixed(1)}% acc`;
    if (algo === 'naive_bayes') {
      let c = 0; for (const p of state.points) if (ML.predictGaussianNB(modelBag.nb, p) === p.label) c++;
      return `${state.points.length ? ((c / state.points.length) * 100).toFixed(1) : 0}% acc`;
    }
    if (algo === 'knn') return `K=${state.params.k} (${state.params.metric})`;
    if (algo === 'pca') return modelBag.pca.valid ? `PC1 ${(modelBag.pca.ratio1 * 100).toFixed(1)}%` : '—';
    return '';
  }

  function renderMetrics() {
    if (state.duelMode) {
      els.primaryDuelStat.textContent = summarizeHeadlineMetric(state.algo, state.models);
      els.duelAlgoStat.textContent = summarizeHeadlineMetric(state.duelAlgo, state.duelModels);
    }

    const a = state.algo;
    const cards = [{ label: 'Points', value: state.points.length }];

    if (a === 'linear_reg') {
      const m = state.models.linear;
      cards.push({ label: 'Equation', value: `y = ${m.w.toFixed(2)}x ${m.b >= 0 ? '+' : '−'} ${Math.abs(m.b).toFixed(2)}` });
      cards.push({ label: 'R² Score', value: m.valid ? m.r2.toFixed(3) : '—' });
      cards.push({ label: 'RMSE', value: m.valid ? m.rmse.toFixed(3) : '—' });
    } else if (a === 'logistic_reg') {
      const m = state.models.logistic;
      cards.push({ label: 'Epoch', value: m.epoch });
      cards.push({ label: 'Accuracy', value: `${(m.acc * 100).toFixed(1)}%` });
      cards.push({ label: 'Log Loss', value: m.loss.toFixed(3) });
    } else if (a === 'neural_net' && state.models.nn) {
      const n = state.models.nn;
      cards.push({ label: 'Epoch', value: n.epoch });
      cards.push({ label: 'Accuracy', value: `${(n.acc * 100).toFixed(1)}%` });
      cards.push({ label: 'Loss', value: n.loss.toFixed(3) });
    } else if (a === 'knn') {
      cards.push({ label: 'Neighbors (K)', value: state.params.k });
      cards.push({ label: 'Distance', value: state.params.metric });
    } else if (a === 'kmeans') {
      const km = state.models.kmeans;
      cards.push({ label: 'Step', value: km.step });
      cards.push({ label: 'Inertia', value: km.inertia.toFixed(2) });
      cards.push({ label: 'Status', value: km.converged ? 'Converged' : 'Active' });
    } else if (a === 'decision_tree') {
      let correct = 0;
      for (const p of state.points) if (ML.predictTree(state.models.tree, p) === p.label) correct++;
      cards.push({ label: 'Accuracy', value: `${(state.points.length ? (correct / state.points.length) * 100 : 0).toFixed(1)}%` });
      cards.push({ label: 'Max Depth', value: state.params.maxDepth });
    } else if (a === 'random_forest') {
      let correct = 0;
      for (const p of state.points) if (ML.predictRandomForest(state.models.forest, p) === p.label) correct++;
      cards.push({ label: 'Ensemble Acc', value: `${(state.points.length ? (correct / state.points.length) * 100 : 0).toFixed(1)}%` });
      cards.push({ label: 'Trees', value: state.models.forest.trees.length });
    } else if (a === 'gradient_boosting') {
      const gb = state.models.gb;
      const lastLoss = gb.lossHistory.length ? gb.lossHistory[gb.lossHistory.length - 1] : 0;
      cards.push({ label: 'Accuracy', value: `${(gb.acc * 100).toFixed(1)}%` });
      cards.push({ label: 'Stages', value: gb.stages.length });
      cards.push({ label: 'Final Loss', value: lastLoss.toFixed(3) });
    } else if (a === 'svm') {
      const m = state.models.svm;
      cards.push({ label: 'Epoch', value: m.epoch });
      cards.push({ label: 'Accuracy', value: `${(m.acc * 100).toFixed(1)}%` });
      cards.push({ label: 'Margin', value: m.margin.toFixed(2) });
      cards.push({ label: 'Support Vecs', value: m.supportIndices.length });
    } else if (a === 'naive_bayes') {
      let correct = 0;
      for (const p of state.points) if (ML.predictGaussianNB(state.models.nb, p) === p.label) correct++;
      cards.push({ label: 'Accuracy', value: `${(state.points.length ? (correct / state.points.length) * 100 : 0).toFixed(1)}%` });
      cards.push({ label: 'Classes', value: Object.keys(state.models.nb).length });
    } else if (a === 'pca') {
      const p = state.models.pca;
      cards.push({ label: 'PC1 Variance', value: p.valid ? `${(p.ratio1 * 100).toFixed(1)}%` : '—' });
      cards.push({ label: 'PC2 Variance', value: p.valid ? `${(p.ratio2 * 100).toFixed(1)}%` : '—' });
    }

    els.metricsGrid.innerHTML = cards.map(c => `
      <div class="metric-card">
        <div class="metric-label">${c.label}</div>
        <div class="metric-value">${c.value}</div>
      </div>
    `).join('');
  }

  function renderDataTable() {
    const showLbl = ALGO_META[state.algo].type === 'binary' || ALGO_META[state.algo].type === 'multiclass';
    els.dataCount.textContent = `${state.points.length} pts`;
    els.dataTableBody.innerHTML = state.points.map((p, idx) => `
      <tr>
        <td>${p.x.toFixed(2)}</td>
        <td>${p.y.toFixed(2)}</td>
        ${showLbl ? `<td><span class="dot" style="background:${CLASS_COLORS[p.label % CLASS_COLORS.length]}"></span> ${p.label}</td>` : '<td>—</td>'}
        <td><button class="del-row-btn" type="button" data-del="${idx}" aria-label="Remove point ${idx + 1}">×</button></td>
      </tr>
    `).join('');

    els.dataTableBody.querySelectorAll('[data-del]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.points.splice(Number(btn.dataset.del), 1);
        recomputeAndRender();
      });
    });
  }

  function handleCanvasClick(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    const pt = canvasToWorld(e.clientX - rect.left, e.clientY - rect.top, rect.width, rect.height);
    if (e.button === 2 || state.mode === 'erase') {
      let bestIdx = -1, bestD = 0.35;
      for (let i = 0; i < state.points.length; i++) {
        const d = Math.hypot(state.points[i].x - pt.x, state.points[i].y - pt.y);
        if (d < bestD) { bestD = d; bestIdx = i; }
      }
      if (bestIdx !== -1) { state.points.splice(bestIdx, 1); recomputeAndRender(); }
      return;
    }
    if (state.mode === 'probe') {
      state.probePoint = pt;
      drawAllCanvases();
      renderProbeBanner();
      return;
    }
    state.points.push({ x: pt.x, y: pt.y, label: state.activeLabel });
    recomputeAndRender();
  }

  function attachCanvasEvents(canvas) {
    canvas.addEventListener('click', e => handleCanvasClick(canvas, e));
    canvas.addEventListener('contextmenu', e => {
      e.preventDefault();
      handleCanvasClick(canvas, { ...e, button: 2, clientX: e.clientX, clientY: e.clientY });
    });
    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      const pt = canvasToWorld(e.clientX - rect.left, e.clientY - rect.top, rect.width, rect.height);
      els.coordReadout.textContent = `x: ${pt.x.toFixed(2)}, y: ${pt.y.toFixed(2)}`;
    });
  }

  function selectAlgo(algo, keepPreset = false) {
    stopAnimation();
    state.algo = algo;
    state.probePoint = null;
    const meta = ALGO_META[algo];
    if (meta.type === 'binary' && state.activeLabel > 1) state.activeLabel = 0;
    if ((meta.type === 'regression' || meta.type === 'unlabeled') && state.mode === 'probe') {
      state.mode = 'add';
    }
    const preset = keepPreset ? state.preset : defaultPresetForAlgo(algo);
    renderHeaderInfo();
    renderToolbar();
    loadPreset(preset);
    renderControls();
    if (typeof window.renderEducationSection === 'function') {
      window.renderEducationSection(algo);
    }
  }

  function init() {
    els.algoSelect = $('algoSelect');
    els.duelToggleBtn = $('duelToggleBtn');
    els.duelSelectWrap = $('duelSelectWrap');
    els.duelAlgoSelect = $('duelAlgoSelect');
    els.reseedBtn = $('reseedBtn');
    els.seedBadge = $('seedBadge');
    els.shareBtn = $('shareBtn');
    els.algoTitle = $('algoTitle');
    els.algoBadge = $('algoBadge');
    els.algoIntuition = $('algoIntuition');
    els.whatToNotice = $('whatToNotice');
    els.toolbar = $('toolbar');
    els.canvasesRow = $('canvasesRow');
    els.primaryDuelHeader = $('primaryDuelHeader');
    els.primaryDuelName = $('primaryDuelName');
    els.primaryDuelStat = $('primaryDuelStat');
    els.duelCard = $('duelCard');
    els.duelAlgoName = $('duelAlgoName');
    els.duelAlgoStat = $('duelAlgoStat');
    els.canvas = $('mlCanvas');
    els.duelCanvas = $('duelCanvas');
    els.coordReadout = $('coordReadout');
    els.probeBanner = $('probeBanner');
    els.metricsGrid = $('metricsGrid');
    els.curveCard = $('curveCard');
    els.curveLegend = $('curveLegend');
    els.curveStage = $('curveStage');
    els.internalsCard = $('internalsCard');
    els.internalsTitle = $('internalsTitle');
    els.internalsTabs = $('internalsTabs');
    els.internalsStage = $('internalsStage');
    els.controlsBox = $('controlsBox');
    els.dataCount = $('dataCount');
    els.dataTableBody = $('dataTableBody');
    els.inputX = $('inputX');
    els.inputY = $('inputY');
    els.inputLabel = $('inputLabel');
    els.inputLabelWrap = $('inputLabelWrap');
    els.csvInput = $('csvInput');
    els.toast = $('toast');

    loadFromURL();
    populateAlgoSelectors();

    attachCanvasEvents(els.canvas);
    attachCanvasEvents(els.duelCanvas);

    els.algoSelect.addEventListener('change', e => selectAlgo(e.target.value, false));

    els.duelToggleBtn.addEventListener('click', () => {
      stopAnimation();
      state.duelMode = !state.duelMode;
      renderHeaderInfo();
      renderToolbar();
      renderControls();
      syncURL();
      recomputeAndRender();
    });

    els.duelAlgoSelect.addEventListener('change', e => {
      stopAnimation();
      state.duelAlgo = e.target.value;
      renderHeaderInfo();
      renderToolbar();
      renderControls();
      syncURL();
      recomputeAndRender();
    });

    els.reseedBtn.addEventListener('click', () => {
      state.seed = (state.seed * 1664525 + 1013904223) % 9999 + 1;
      els.seedBadge.textContent = String(state.seed);
      loadPreset(state.preset);
      showToast(`Reseeded with seed ${state.seed}`);
    });

    els.shareBtn.addEventListener('click', () => {
      syncURL();
      const fullUrl = window.location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullUrl).then(() => showToast('Share link copied to clipboard')).catch(() => showToast('URL updated in address bar'));
      } else {
        showToast('URL updated in address bar');
      }
    });

    $('addPointBtn').addEventListener('click', () => {
      const x = Number(els.inputX.value);
      const y = Number(els.inputY.value);
      const lbl = Math.max(0, Math.min(2, Math.floor(Number(els.inputLabel.value) || 0)));
      if (Number.isNaN(x) || Number.isNaN(y)) { showToast('Enter valid numeric X and Y coordinates.'); return; }
      state.points.push({ x: clamp(x), y: clamp(y), label: lbl });
      recomputeAndRender();
      showToast(`Added point (${clamp(x)}, ${clamp(y)})`);
    });

    $('importCsvBtn').addEventListener('click', () => {
      const raw = els.csvInput.value.trim();
      if (!raw) { showToast('Paste CSV rows first (x, y, label).'); return; }
      const parsed = [];
      for (const line of raw.split(/\r?\n/)) {
        const parts = line.split(/[,\s;]+/).filter(Boolean);
        if (parts.length < 2) continue;
        const x = Number(parts[0]), y = Number(parts[1]);
        const label = parts.length >= 3 ? Math.max(0, Math.min(2, Math.floor(Number(parts[2]) || 0))) : 0;
        if (!Number.isNaN(x) && !Number.isNaN(y)) parsed.push({ x: clamp(x), y: clamp(y), label });
      }
      if (parsed.length === 0) { showToast('No valid numeric rows found.'); return; }
      state.points = parsed;
      resetAllModels();
      recomputeAndRender();
      showToast(`Loaded ${parsed.length} points`);
    });

    $('exportCsvBtn').addEventListener('click', () => {
      const csv = state.points.map(p => `${p.x},${p.y},${p.label}`).join('\n');
      els.csvInput.value = csv;
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(csv).catch(() => {});
      showToast('Exported points to CSV box');
    });

    window.selectAlgo = selectAlgo;
    window.addEventListener('resize', drawAllCanvases);
    selectAlgo(state.algo, window.location.search.includes('preset='));
    if (typeof window.renderEducationSection === 'function') {
      window.renderEducationSection(state.algo);
    }
  }

  window.addEventListener('DOMContentLoaded', init);
})();
