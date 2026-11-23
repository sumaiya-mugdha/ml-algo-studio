/* ============================================================================
   ML Algo Studio — Interactive Labs Part 2: Classification, Ensembles,
   Unsupervised & Neural/Deep Learning (10 Labs)
   ============================================================================ */

(function () {
  function utils() {
    return window.MLLabUtils;
  }

  const LABS = {
    /* 11. Decision Boundaries (4-Way Arena) */
    'decision-boundaries': {
      controls: [
        { id: 'dataset', label: 'Dataset', type: 'select', value: 'moons', options: [['moons', 'Two Moons'], ['circles', 'Concentric Circles'], ['xor', 'XOR Quadrants']] },
        { id: 'k', label: 'KNN Neighbors (K)', min: 1, max: 13, step: 2, value: 5 }
      ],
      breakIt: { label: 'Circles on Linear Boundary', apply: (s) => { s.dataset = 'circles'; s.k = 1; }, note: 'Logistic regression draws a straight cut right across the rings (~50% accuracy), while RBF SVM and KNN wrap the inner circle.' },
      render(canvas, s, ui) {
        const { themeColors, setupCanvas } = utils();
        const c = themeColors();
        const { ctx, w, h } = setupCanvas(canvas);
        const ML = window.MLAlgos;
        const pts = ML ? ML.generatePreset(s.dataset, 42, 0.8) : [];
        const models = [
          { title: 'Logistic Regression', pred: null, acc: 0 },
          { title: `KNN (K=${s.k})`, pred: null, acc: 0 },
          { title: 'SVM (RBF)', pred: null, acc: 0 },
          { title: 'Decision Tree', pred: null, acc: 0 }
        ];
        if (ML && pts.length) {
          const log = ML.createLogisticRegression(2);
          for (let i = 0; i < 60; i++) ML.stepLogisticRegression(log, pts, 0.25, 0.01);
          models[0].pred = (x, y) => ML.predictLogistic(log, x, y).label;

          models[1].pred = (x, y) => ML.predictKNN(pts, x, y, s.k, 'euclidean').label;

          const svm = ML.createSVM('rbf');
          for (let i = 0; i < 40; i++) ML.stepSVM(svm, pts, 2.0, 0.5, 0.15);
          models[2].pred = (x, y) => ML.predictSVM(svm, x, y).label;

          const dt = ML.fitDecisionTree(pts, 4, 2, 'gini');
          models[3].pred = (x, y) => ML.predictTree(dt, x, y).label;
        }

        ctx.fillStyle = c.bg;
        ctx.fillRect(0, 0, w, h);
        const pad = 8, cw = (w - pad * 3) / 2, ch = (h - pad * 3) / 2;

        models.forEach((m, idx) => {
          const ox = pad + (idx % 2) * (cw + pad);
          const oy = pad + Math.floor(idx / 2) * (ch + pad);
          const tx = (x) => ox + ((x + 5) / 10) * cw;
          const ty = (y) => oy + ch - ((y + 5) / 10) * ch;

          if (m.pred) {
            const step = 8;
            for (let px = 0; px < cw; px += step) {
              for (let py = 0; py < ch; py += step) {
                const wx = ((px + step * 0.5) / cw) * 10 - 5;
                const wy = (1 - (py + step * 0.5) / ch) * 10 - 5;
                const lb = m.pred(wx, wy);
                ctx.fillStyle = lb === 0 ? 'rgba(0,114,178,0.16)' : 'rgba(230,159,0,0.18)';
                ctx.fillRect(ox + px, oy + py, step, step);
              }
            }
            let ok = 0;
            for (const p of pts) if (m.pred(p.x, p.y) === p.label) ok++;
            m.acc = Math.round((ok / Math.max(1, pts.length)) * 100);
          }

          for (const p of pts) {
            ctx.fillStyle = p.label === 0 ? c.blue : c.orange;
            ctx.beginPath(); ctx.arc(tx(p.x), ty(p.y), 3.1, 0, Math.PI * 2); ctx.fill();
          }
          ctx.strokeStyle = c.axis; ctx.lineWidth = 1; ctx.strokeRect(ox, oy, cw, ch);
          ctx.fillStyle = c.bg; ctx.fillRect(ox + 6, oy + 6, Math.min(cw - 12, 148), 20);
          ctx.fillStyle = c.ink; ctx.font = '600 11px system-ui, sans-serif';
          ctx.fillText(`${m.title} · ${m.acc}%`, ox + 10, oy + 20);
        });

        ui.setMetrics(models.map((m) => ({ label: m.title, value: `${m.acc}%` })));
      }
    },

    /* 12. The Kernel Trick (3D Lift) */
    'kernel-trick': {
      controls: [
        { id: 'lift', label: '3D Lift (z = x² + y²)', min: 0, max: 1, step: 0.05, value: 0.85 },
        { id: 'angle', label: 'Camera Angle', min: -1.2, max: 1.2, step: 0.05, value: 0.45 }
      ],
      breakIt: { label: 'Flatten to 2D (Lift = 0)', apply: (s) => { s.lift = 0; s.angle = 0; }, note: 'In flat 2D space, no straight line can separate the inner circle from the outer ring. Raise the 3D lift to slice cleanly!' },
      render(canvas, s, ui) {
        const { seeded, themeColors, setupCanvas } = utils();
        const c = themeColors();
        const { ctx, w, h } = setupCanvas(canvas);
        ctx.fillStyle = c.bg; ctx.fillRect(0, 0, w, h);

        const rng = seeded(77);
        const pts = [];
        for (let i = 0; i < 40; i++) {
          const inner = i < 20;
          const r = inner ? 0.5 + rng() * 0.55 : 1.55 + rng() * 0.55;
          const a = (i / 20) * Math.PI * 2 + rng() * 0.3;
          const x = Math.cos(a) * r, y = Math.sin(a) * r;
          const z = (x * x + y * y) * 0.45 * s.lift;
          pts.push({ x, y, z, inner });
        }

        const ca = Math.cos(s.angle), sa = Math.sin(s.angle);
        const tilt = 0.55 + s.lift * 0.35;
        const project = (x, y, z) => {
          const rx = x * ca - y * sa;
          const ry = x * sa + y * ca;
          return {
            px: w * 0.5 + rx * (w * 0.17),
            py: h * 0.62 + ry * (h * 0.12) * (1 - s.lift * 0.45) - z * (h * 0.24) * tilt,
            depth: ry
          };
        };

        // Slicing plane at z = 0.72 * lift
        if (s.lift > 0.15) {
          const zp = 0.72 * s.lift;
          const corners = [[-2.4, -2.4], [2.4, -2.4], [2.4, 2.4], [-2.4, 2.4]].map(([x, y]) => project(x, y, zp));
          ctx.fillStyle = c.dark ? 'rgba(167,139,250,0.18)' : 'rgba(124,58,237,0.14)';
          ctx.strokeStyle = c.purple;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          corners.forEach((pt, idx) => (idx === 0 ? ctx.moveTo(pt.px, pt.py) : ctx.lineTo(pt.px, pt.py)));
          ctx.closePath(); ctx.fill(); ctx.stroke();
        }

        const projected = pts.map((p) => ({ ...p, ...project(p.x, p.y, p.z) })).sort((a, b) => a.depth - b.depth);
        for (const p of projected) {
          ctx.fillStyle = p.inner ? c.blue : c.orange;
          ctx.beginPath(); ctx.arc(p.px, p.py, 5, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = c.strokeBg; ctx.lineWidth = 1.2; ctx.stroke();
        }
        ui.setMetrics([
          { label: 'Feature Map', value: 'φ(x,y) = (x, y, x²+y²)' },
          { label: 'Separable by Plane?', value: s.lift >= 0.35 ? 'Yes (100%)' : 'No (Nested)' }
        ]);
      }
    },

    /* 13. Bagging */
    'bagging': {
      controls: [
        { id: 'trees', label: 'Bootstrap Trees', min: 1, max: 15, step: 1, value: 7 },
        { id: 'depth', label: 'Tree Depth', min: 1, max: 4, step: 1, value: 2 }
      ],
      breakIt: { label: 'Single Unstable Tree (n=1)', apply: (s) => { s.trees = 1; s.depth = 4; }, note: 'With only 1 tree, the boundary is boxy and sensitive to individual noisy points.' },
      render(canvas, s, ui) {
        const { themeColors, setupCanvas } = utils();
        const c = themeColors();
        const { ctx, w, h } = setupCanvas(canvas);
        const ML = window.MLAlgos;
        const pts = ML ? ML.generatePreset('moons', 42, 0.9) : [];
        const forest = ML ? ML.fitRandomForest(pts, s.trees, s.depth, 42) : null;
        const step = 8;
        for (let px = 0; px < w; px += step) {
          for (let py = 0; py < h; py += step) {
            const wx = ((px + step * 0.5) / w) * 10 - 5;
            const wy = (1 - (py + step * 0.5) / h) * 10 - 5;
            const res = forest ? ML.predictRandomForest(forest, wx, wy) : { prob: 0.5 };
            ctx.fillStyle = res.prob >= 0.5
              ? `rgba(230,159,0,${0.08 + (res.prob - 0.5) * 0.35})`
              : `rgba(0,114,178,${0.08 + (0.5 - res.prob) * 0.35})`;
            ctx.fillRect(px, py, step, step);
          }
        }
        let ok = 0;
        for (const p of pts) {
          if (forest && ML.predictRandomForest(forest, p.x, p.y).label === p.label) ok++;
          ctx.fillStyle = p.label === 0 ? c.blue : c.orange;
          ctx.beginPath(); ctx.arc(((p.x + 5) / 10) * w, h - ((p.y + 5) / 10) * h, 4.5, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = c.strokeBg; ctx.lineWidth = 1.3; ctx.stroke();
        }
        ui.setMetrics([
          { label: 'Bagged Trees', value: String(s.trees) },
          { label: 'Ensemble Accuracy', value: `${Math.round((ok / Math.max(1, pts.length)) * 100)}%` },
          { label: 'Variance Effect', value: s.trees === 1 ? 'High Variance' : 'Smoothed' }
        ]);
      }
    },

    /* 14. AdaBoost */
    'adaboost': {
      controls: [
        { id: 'rounds', label: 'Boosting Rounds', min: 1, max: 12, step: 1, value: 5 },
        { id: 'noise', label: 'Flipped Labels', min: 0, max: 6, step: 1, value: 0 }
      ],
      breakIt: { label: 'Inject 5 Flipped Outliers', apply: (s) => { s.rounds = 10; s.noise = 5; }, note: 'Exponential loss inflates sample weights on corrupted labels, pulling stumps toward the noise.' },
      render(canvas, s, ui) {
        const { seeded, themeColors, setupCanvas, drawAxes } = utils();
        const c = themeColors();
        const { ctx, w, h } = setupCanvas(canvas);
        const { tx, ty } = drawAxes(ctx, w, h, -4, 4, -4, 4, c);
        const rng = seeded(55);
        const pts = [];
        for (let i = 0; i < 28; i++) {
          const cls = i < 14 ? -1 : 1;
          const x = cls === -1 ? -1.6 + (rng() - 0.5) * 3.4 : 1.6 + (rng() - 0.5) * 3.4;
          const y = (rng() - 0.5) * 5.6;
          pts.push({ x, y, yTrue: cls, noisy: false });
        }
        for (let i = 0; i < s.noise; i++) {
          const idx = (i * 5 + 2) % pts.length;
          pts[idx].yTrue *= -1;
          pts[idx].noisy = true;
        }
        // Train AdaBoost decision stumps
        let weights = new Array(pts.length).fill(1 / pts.length);
        const stumps = [];
        for (let r = 0; r < s.rounds; r++) {
          let best = { err: Infinity, axis: 'x', thr: 0, pol: 1 };
          for (const axis of ['x', 'y']) {
            for (let thr = -3.2; thr <= 3.2; thr += 0.4) {
              for (const pol of [1, -1]) {
                let err = 0;
                for (let i = 0; i < pts.length; i++) {
                  const p = (pts[i][axis] >= thr ? 1 : -1) * pol;
                  if (p !== pts[i].yTrue) err += weights[i];
                }
                if (err < best.err) best = { err, axis, thr, pol };
              }
            }
          }
          const e = Math.max(1e-4, Math.min(0.499, best.err));
          const alpha = 0.5 * Math.log((1 - e) / e);
          stumps.push({ ...best, alpha });
          let sum = 0;
          for (let i = 0; i < pts.length; i++) {
            const p = (pts[i][best.axis] >= best.thr ? 1 : -1) * best.pol;
            weights[i] *= Math.exp(-alpha * pts[i].yTrue * p);
            sum += weights[i];
          }
          weights = weights.map((v) => v / sum);
        }

        const pred = (x, y) => {
          let sc = 0;
          for (const st of stumps) sc += st.alpha * (((st.axis === 'x' ? x : y) >= st.thr ? 1 : -1) * st.pol);
          return sc >= 0 ? 1 : -1;
        };

        const step = 10;
        for (let px = 0; px < w; px += step) {
          for (let py = 0; py < h; py += step) {
            const wx = -4 + ((px + step * 0.5) / w) * 8;
            const wy = 4 - ((py + step * 0.5) / h) * 8;
            ctx.fillStyle = pred(wx, wy) === 1 ? 'rgba(230,159,0,0.14)' : 'rgba(0,114,178,0.14)';
            ctx.fillRect(px, py, step, step);
          }
        }
        let ok = 0;
        const maxW = Math.max(...weights);
        pts.forEach((p, i) => {
          if (pred(p.x, p.y) === p.yTrue) ok++;
          const rad = 3.5 + (weights[i] / maxW) * 8.5;
          ctx.fillStyle = p.yTrue === 1 ? c.orange : c.blue;
          ctx.beginPath(); ctx.arc(tx(p.x), ty(p.y), rad, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = p.noisy ? c.red : c.strokeBg;
          ctx.lineWidth = p.noisy ? 2.2 : 1.3; ctx.stroke();
        });
        ui.setMetrics([
          { label: 'Stumps Chained', value: String(stumps.length) },
          { label: 'Accuracy', value: `${Math.round((ok / pts.length) * 100)}%` },
          { label: 'Max Point Weight', value: `${(maxW * 100).toFixed(1)}%` }
        ]);
      }
    },

    /* 15. DBSCAN */
    'dbscan': {
      controls: [
        { id: 'eps', label: 'Epsilon Radius (ε)', min: 0.3, max: 2.2, step: 0.1, value: 0.9 },
        { id: 'minPts', label: 'MinPts', min: 2, max: 8, step: 1, value: 4 }
      ],
      breakIt: { label: 'Tiny ε = 0.3 (All Noise)', apply: (s) => { s.eps = 0.3; s.minPts = 5; }, note: 'When epsilon is smaller than inter-point spacing, nearly every point is flagged as isolated noise.' },
      render(canvas, s, ui) {
        const { seeded, themeColors, setupCanvas, drawAxes } = utils();
        const c = themeColors();
        const { ctx, w, h } = setupCanvas(canvas);
        const { tx, ty } = drawAxes(ctx, w, h, -4.5, 4.5, -4.5, 4.5, c);
        const rng = seeded(88);
        const pts = [];
        for (let i = 0; i < 24; i++) {
          const a = (i / 23) * Math.PI;
          pts.push({ x: Math.cos(a) * 2.2 - 0.8 + (rng() - 0.5) * 0.35, y: Math.sin(a) * 2.0 - 0.2 + (rng() - 0.5) * 0.35 });
          pts.push({ x: Math.cos(a) * 2.2 + 1.0 + (rng() - 0.5) * 0.35, y: -Math.sin(a) * 2.0 + 0.6 + (rng() - 0.5) * 0.35 });
        }
        // Add 4 outliers
        pts.push({ x: -3.6, y: -3.2 }, { x: 3.7, y: 3.4 }, { x: -3.4, y: 3.5 }, { x: 3.5, y: -3.4 });

        const labels = new Array(pts.length).fill(-2); // -2 unvisited, -1 noise
        const neighbors = (idx) => {
          const out = [];
          for (let j = 0; j < pts.length; j++) {
            if (Math.hypot(pts[idx].x - pts[j].x, pts[idx].y - pts[j].y) <= s.eps) out.push(j);
          }
          return out;
        };
        let cid = 0;
        for (let i = 0; i < pts.length; i++) {
          if (labels[i] !== -2) continue;
          const nb = neighbors(i);
          if (nb.length < s.minPts) { labels[i] = -1; continue; }
          labels[i] = cid;
          const q = [...nb];
          while (q.length) {
            const j = q.shift();
            if (labels[j] === -1) labels[j] = cid;
            if (labels[j] !== -2) continue;
            labels[j] = cid;
            const nb2 = neighbors(j);
            if (nb2.length >= s.minPts) q.push(...nb2);
          }
          cid++;
        }

        const palette = [c.blue, c.orange, c.green, c.purple, c.sky, c.red];
        let noiseCount = 0;
        pts.forEach((p, i) => {
          const lb = labels[i];
          if (lb === -1) {
            noiseCount++;
            ctx.strokeStyle = c.text;
            ctx.lineWidth = 2;
            const px = tx(p.x), py = ty(p.y);
            ctx.beginPath(); ctx.moveTo(px - 4, py - 4); ctx.lineTo(px + 4, py + 4); ctx.moveTo(px + 4, py - 4); ctx.lineTo(px - 4, py + 4); ctx.stroke();
          } else {
            ctx.fillStyle = palette[lb % palette.length];
            ctx.beginPath(); ctx.arc(tx(p.x), ty(p.y), 4.8, 0, Math.PI * 2); ctx.fill();
          }
        });
        // Show epsilon ring around first core point
        const firstCore = labels.findIndex((l) => l >= 0);
        if (firstCore >= 0) {
          ctx.strokeStyle = c.purple; ctx.lineWidth = 1.4; ctx.setLineDash([4, 3]);
          ctx.beginPath(); ctx.ellipse(tx(pts[firstCore].x), ty(pts[firstCore].y), (s.eps / 9) * w, (s.eps / 9) * h, 0, 0, Math.PI * 2); ctx.stroke();
          ctx.setLineDash([]);
        }
        ui.setMetrics([
          { label: 'Clusters Found', value: String(cid) },
          { label: 'Noise Points (×)', value: String(noiseCount) },
          { label: 'Epsilon (ε)', value: s.eps.toFixed(1) }
        ]);
      }
    },

    /* 16. t-SNE */
    't-sne': {
      controls: [
        { id: 'perp', label: 'Perplexity', min: 3, max: 45, step: 2, value: 18 },
        { id: 'iter', label: 'Embedding Progress', min: 0, max: 100, step: 5, value: 85 }
      ],
      breakIt: { label: 'Perplexity = 3 (Fragmented)', apply: (s) => { s.perp = 3; s.iter = 100; }, note: 'Very low perplexity focuses only on immediate neighbors, shattering coherent clusters into tiny disconnected islands.' },
      render(canvas, s, ui) {
        const { seeded, themeColors, setupCanvas } = utils();
        const c = themeColors();
        const { ctx, w, h } = setupCanvas(canvas);
        ctx.fillStyle = c.bg; ctx.fillRect(0, 0, w, h);
        const rng = seeded(303);
        const centers = [[-2.1, 1.8], [2.2, 1.6], [-1.9, -1.9], [2.1, -1.7]];
        const colors = [c.blue, c.orange, c.green, c.purple];
        const t = s.iter / 100;
        const frag = s.perp < 8 ? (8 - s.perp) * 0.25 : 0;
        const spread = s.perp > 35 ? 0.85 : 0.45;

        for (let k = 0; k < 4; k++) {
          for (let i = 0; i < 16; i++) {
            const x0 = (rng() - 0.5) * 4.2, y0 = (rng() - 0.5) * 4.2;
            const subOffsetX = frag ? ((i % 3) - 1) * frag : 0;
            const subOffsetY = frag ? ((i % 2) - 0.5) * frag : 0;
            const x1 = centers[k][0] + subOffsetX + (rng() - 0.5) * spread * 2;
            const y1 = centers[k][1] + subOffsetY + (rng() - 0.5) * spread * 2;
            const x = x0 * (1 - t) + x1 * t;
            const y = y0 * (1 - t) + y1 * t;
            const px = ((x + 4) / 8) * w;
            const py = h - ((y + 4) / 8) * h;
            ctx.fillStyle = colors[k];
            ctx.beginPath(); ctx.arc(px, py, 4.6, 0, Math.PI * 2); ctx.fill();
          }
        }
        ui.setMetrics([
          { label: 'Perplexity', value: String(s.perp) },
          { label: 'Structure', value: s.perp < 8 ? 'Over-fragmented' : s.perp > 35 ? 'Global / Merged' : 'Balanced Local' },
          { label: 'Progress', value: `${s.iter}%` }
        ]);
      }
    },

    /* 17. The Perceptron */
    'perceptron': {
      controls: [
        { id: 'gate', label: 'Logic Gate', type: 'select', value: 'and', options: [['and', 'AND Gate'], ['or', 'OR Gate'], ['xor', 'XOR Gate']] },
        { id: 'w1', label: 'Weight w₁', min: -2, max: 2, step: 0.1, value: 1.0 },
        { id: 'w2', label: 'Weight w₂', min: -2, max: 2, step: 0.1, value: 1.0 },
        { id: 'b', label: 'Bias (b)', min: -2.5, max: 2.5, step: 0.1, value: -1.4 }
      ],
      breakIt: { label: 'Test XOR Gate', apply: (s) => { s.gate = 'xor'; }, note: 'Minsky–Papert barrier: no single straight line can separate (0,1) and (1,0) from (0,0) and (1,1). You need a hidden layer!' },
      render(canvas, s, ui) {
        const { themeColors, setupCanvas, drawAxes } = utils();
        const c = themeColors();
        const { ctx, w, h } = setupCanvas(canvas);
        const { tx, ty } = drawAxes(ctx, w, h, -0.5, 1.5, -0.5, 1.5, c);
        const gates = {
          and: [[0, 0, 0], [0, 1, 0], [1, 0, 0], [1, 1, 1]],
          or: [[0, 0, 0], [0, 1, 1], [1, 0, 1], [1, 1, 1]],
          xor: [[0, 0, 0], [0, 1, 1], [1, 0, 1], [1, 1, 0]]
        };
        const data = gates[s.gate];
        const step = 10;
        for (let px = 0; px < w; px += step) {
          for (let py = 0; py < h; py += step) {
            const x = -0.5 + ((px + step * 0.5) / w) * 2;
            const y = 1.5 - ((py + step * 0.5) / h) * 2;
            const fire = s.w1 * x + s.w2 * y + s.b >= 0;
            ctx.fillStyle = fire ? 'rgba(230,159,0,0.16)' : 'rgba(0,114,178,0.14)';
            ctx.fillRect(px, py, step, step);
          }
        }
        if (Math.abs(s.w2) > 1e-4) {
          ctx.strokeStyle = c.purple; ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(tx(-0.5), ty((-s.b - s.w1 * -0.5) / s.w2));
          ctx.lineTo(tx(1.5), ty((-s.b - s.w1 * 1.5) / s.w2));
          ctx.stroke();
        }
        let ok = 0;
        for (const [x, y, target] of data) {
          const pred = s.w1 * x + s.w2 * y + s.b >= 0 ? 1 : 0;
          if (pred === target) ok++;
          ctx.fillStyle = target === 1 ? c.orange : c.blue;
          ctx.beginPath(); ctx.arc(tx(x), ty(y), 9, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = pred === target ? c.green : c.red;
          ctx.lineWidth = 2.6; ctx.stroke();
        }
        ui.setMetrics([
          { label: 'Gate', value: s.gate.toUpperCase() },
          { label: 'Correct', value: `${ok} / 4` },
          { label: 'Linearly Separable?', value: s.gate === 'xor' ? 'No' : 'Yes' }
        ]);
      }
    },

    /* 18. Activation Functions */
    'activation-functions': {
      controls: [
        { id: 'fn', label: 'Activation', type: 'select', value: 'sigmoid', options: [['sigmoid', 'Sigmoid'], ['tanh', 'Tanh'], ['relu', 'ReLU'], ['leaky', 'Leaky ReLU'], ['gelu', 'GELU']] },
        { id: 'x', label: 'Input Probe (x)', min: -8, max: 8, step: 0.2, value: 0.8 }
      ],
      breakIt: { label: 'Saturate Sigmoid at x = 7.5', apply: (s) => { s.fn = 'sigmoid'; s.x = 7.5; }, note: 'Vanishing gradient! At x = 7.5, the sigmoid derivative drops to ~0.0006, freezing weight updates.' },
      render(canvas, s, ui) {
        const { themeColors, setupCanvas, drawAxes } = utils();
        const c = themeColors();
        const { ctx, w, h } = setupCanvas(canvas);
        const { tx, ty } = drawAxes(ctx, w, h, -8, 8, -2, 3, c);
        const fns = {
          sigmoid: (x) => 1 / (1 + Math.exp(-x)),
          tanh: (x) => Math.tanh(x),
          relu: (x) => Math.max(0, x),
          leaky: (x) => (x >= 0 ? x : 0.1 * x),
          gelu: (x) => 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x * x * x)))
        };
        const f = fns[s.fn];
        const df = (x) => (f(x + 1e-4) - f(x - 1e-4)) / 2e-4;

        // Draw f(x)
        ctx.strokeStyle = c.blue; ctx.lineWidth = 2.6; ctx.beginPath();
        for (let px = 0; px <= w; px += 3) {
          const x = -8 + (16 * px) / w;
          const y = Math.max(-3, Math.min(4, f(x)));
          px === 0 ? ctx.moveTo(px, ty(y)) : ctx.lineTo(px, ty(y));
        }
        ctx.stroke();

        // Draw f'(x)
        ctx.strokeStyle = c.orange; ctx.lineWidth = 2; ctx.setLineDash([5, 3]); ctx.beginPath();
        for (let px = 0; px <= w; px += 3) {
          const x = -8 + (16 * px) / w;
          const y = df(x);
          px === 0 ? ctx.moveTo(px, ty(y)) : ctx.lineTo(px, ty(y));
        }
        ctx.stroke(); ctx.setLineDash([]);

        // Probe line
        const fx = f(s.x), gx = df(s.x);
        ctx.strokeStyle = c.purple; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(tx(s.x), 0); ctx.lineTo(tx(s.x), h); ctx.stroke();
        ctx.fillStyle = c.blue; ctx.beginPath(); ctx.arc(tx(s.x), ty(fx), 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = c.orange; ctx.beginPath(); ctx.arc(tx(s.x), ty(gx), 5.5, 0, Math.PI * 2); ctx.fill();

        ui.setMetrics([
          { label: 'Input x', value: s.x.toFixed(1) },
          { label: 'Output f(x) (Blue)', value: fx.toFixed(4) },
          { label: "Derivative f'(x) (Orange)", value: gx.toFixed(4) }
        ]);
      }
    },

    /* 19. Backpropagation */
    'backpropagation': {
      controls: [
        { id: 'x', label: 'Input x', min: -3, max: 3, step: 0.2, value: 1.2 },
        { id: 'w1', label: 'Weight w₁', min: -3, max: 3, step: 0.2, value: 0.8 },
        { id: 'w2', label: 'Weight w₂', min: -3, max: 3, step: 0.2, value: 1.0 },
        { id: 'layers', label: 'Sigmoid Depth', min: 1, max: 6, step: 1, value: 2 }
      ],
      breakIt: { label: 'Stack 6 Sigmoid Layers', apply: (s) => { s.layers = 6; s.x = 2.4; s.w1 = 2.0; }, note: 'Multiplying 6 sigmoid derivatives (< 0.25 each) shrinks the early-layer gradient to near zero.' },
      render(canvas, s, ui) {
        const { themeColors, setupCanvas } = utils();
        const c = themeColors();
        const { ctx, w, h } = setupCanvas(canvas);
        ctx.fillStyle = c.bg; ctx.fillRect(0, 0, w, h);

        const sig = (v) => 1 / (1 + Math.exp(-v));
        const acts = [s.x];
        for (let l = 0; l < s.layers; l++) {
          const wt = l === 0 ? s.w1 : s.w2;
          acts.push(sig(acts[acts.length - 1] * wt));
        }
        const target = 0.9;
        const yhat = acts[acts.length - 1];
        const loss = 0.5 * Math.pow(yhat - target, 2);
        const grads = new Array(acts.length).fill(0);
        grads[grads.length - 1] = yhat - target;
        for (let l = s.layers - 1; l >= 0; l--) {
          const aOut = acts[l + 1];
          const wt = l === 0 ? s.w1 : s.w2;
          grads[l] = grads[l + 1] * aOut * (1 - aOut) * wt;
        }

        const nNodes = acts.length;
        const padX = 56;
        const xs = acts.map((_, i) => padX + (i / Math.max(1, nNodes - 1)) * (w - padX * 2));
        const cy = h * 0.5;

        for (let i = 0; i < nNodes - 1; i++) {
          const gMag = Math.min(1, Math.abs(grads[i + 1]) * 4);
          ctx.strokeStyle = c.blue; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(xs[i], cy - 10); ctx.lineTo(xs[i + 1], cy - 10); ctx.stroke();
          ctx.strokeStyle = c.red; ctx.lineWidth = 1.2 + gMag * 3.5;
          ctx.beginPath(); ctx.moveTo(xs[i + 1], cy + 12); ctx.lineTo(xs[i], cy + 12); ctx.stroke();
        }
        acts.forEach((a, i) => {
          ctx.fillStyle = i === 0 ? c.blue : i === nNodes - 1 ? c.green : c.purple;
          ctx.beginPath(); ctx.arc(xs[i], cy, 22, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#ffffff'; ctx.font = '700 11px monospace'; ctx.textAlign = 'center';
          ctx.fillText(a.toFixed(2), xs[i], cy + 4);
          ctx.fillStyle = c.text; ctx.font = '600 11px system-ui, sans-serif';
          ctx.fillText(i === 0 ? 'Input' : i === nNodes - 1 ? 'Output' : `Layer ${i}`, xs[i], cy - 34);
          ctx.fillStyle = c.red; ctx.font = '600 10.5px monospace';
          ctx.fillText(`∇=${grads[i].toFixed(4)}`, xs[i], cy + 40);
        });
        ctx.textAlign = 'left';

        ui.setMetrics([
          { label: 'Prediction ŷ', value: yhat.toFixed(3) },
          { label: 'Loss (target 0.9)', value: loss.toFixed(4) },
          { label: 'First-Layer Grad |∇|', value: Math.abs(grads[0]).toFixed(5) }
        ]);
      }
    },

    /* 20. Attention Mechanism */
    'attention': {
      controls: [
        { id: 'queryIdx', label: 'Query Token', type: 'select', value: '5', options: [['0', 'The'], ['1', 'animal'], ['2', 'crossed'], ['3', 'the'], ['4', 'street'], ['5', 'it'], ['6', 'was'], ['7', 'tired']] },
        { id: 'temp', label: 'Temperature (T)', min: 0.2, max: 15, step: 0.2, value: 1.0 }
      ],
      breakIt: { label: 'Extreme Temperature (T = 15)', apply: (s) => { s.temp = 15; }, note: 'High temperature flattens softmax into a uniform 12.5% distribution—the token loses all contextual focus.' },
      render(canvas, s, ui) {
        const { themeColors, setupCanvas } = utils();
        const c = themeColors();
        const { ctx, w, h } = setupCanvas(canvas);
        ctx.fillStyle = c.bg; ctx.fillRect(0, 0, w, h);

        const tokens = ['The', 'animal', 'crossed', 'the', 'street', 'it', 'was', 'tired'];
        // Simple semantic Q·K affinity scores
        const affinities = [
          [1.2, 1.5, 0.3, 0.4, 0.4, 0.2, 0.1, 0.2],
          [0.8, 2.0, 1.3, 0.2, 0.5, 2.2, 0.4, 1.6],
          [0.2, 1.6, 1.5, 0.3, 1.8, 0.6, 0.3, 0.4],
          [0.4, 0.2, 0.3, 1.1, 1.7, 0.2, 0.1, 0.1],
          [0.2, 0.5, 1.5, 0.9, 2.0, 0.8, 0.2, 0.2],
          [0.2, 3.1, 0.9, 0.1, 1.0, 1.4, 0.8, 2.4],
          [0.1, 0.7, 0.5, 0.1, 0.3, 1.4, 1.2, 1.9],
          [0.1, 2.4, 0.4, 0.1, 0.2, 2.6, 1.1, 1.8]
        ];
        const qi = Number(s.queryIdx) || 0;
        const raw = affinities[qi];
        const exps = raw.map((v) => Math.exp(v / s.temp));
        const sum = exps.reduce((a, b) => a + b, 0);
        const probs = exps.map((v) => v / sum);

        const padX = 40;
        const xs = tokens.map((_, i) => padX + (i / (tokens.length - 1)) * (w - padX * 2));
        const baseY = h * 0.72;

        // Draw attention arcs
        probs.forEach((p, i) => {
          const midX = (xs[qi] + xs[i]) / 2;
          const arcH = Math.abs(xs[qi] - xs[i]) * 0.42 + 28;
          ctx.strokeStyle = c.dark ? `rgba(167,139,250,${0.12 + p * 0.88})` : `rgba(124,58,237,${0.12 + p * 0.88})`;
          ctx.lineWidth = 1 + p * 7;
          ctx.beginPath();
          ctx.moveTo(xs[qi], baseY - 16);
          ctx.quadraticCurveTo(midX, Math.max(24, baseY - arcH), xs[i], baseY - 16);
          ctx.stroke();
        });

        // Draw tokens + probability bars
        tokens.forEach((tok, i) => {
          const isQ = i === qi;
          ctx.fillStyle = isQ ? c.purple : c.blue;
          ctx.fillRect(xs[i] - 18, baseY + 18, 36, Math.max(3, probs[i] * 58));
          ctx.fillStyle = isQ ? c.purple : c.ink;
          ctx.font = `${isQ ? '700' : '600'} 12px system-ui, sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(tok, xs[i], baseY);
          ctx.fillStyle = c.text; ctx.font = '600 10px monospace';
          ctx.fillText(`${Math.round(probs[i] * 100)}%`, xs[i], baseY + 13);
        });
        ctx.textAlign = 'left';

        const topIdx = probs.indexOf(Math.max(...probs));
        ui.setMetrics([
          { label: 'Query Token', value: `"${tokens[qi]}"` },
          { label: 'Top Attended Key', value: `"${tokens[topIdx]}" (${Math.round(probs[topIdx] * 100)}%)` },
          { label: 'Temperature', value: s.temp.toFixed(1) }
        ]);
      }
    }
  };

  window.MLLabsRegistry = Object.assign(window.MLLabsRegistry || {}, LABS);
})();
