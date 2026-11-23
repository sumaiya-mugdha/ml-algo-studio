/* ============================================================================
   ML Algo Studio — Interactive Labs Part 1: Foundations & Regression (10 Labs)
   ============================================================================ */

(function () {
  function seeded(seed) {
    let a = (seed >>> 0) || 1;
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function themeColors() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      dark,
      bg: dark ? '#0f131a' : '#ffffff',
      grid: dark ? '#1f2633' : '#f1f5f9',
      axis: dark ? '#334155' : '#cbd5e1',
      text: dark ? '#94a3b8' : '#64748b',
      ink: dark ? '#f4f4f5' : '#18181b',
      strokeBg: dark ? '#0f131a' : '#ffffff',
      blue: '#0072b2',
      orange: '#e69f00',
      green: '#009e73',
      red: '#d55e00',
      purple: dark ? '#a78bfa' : '#7c3aed',
      sky: '#56b4e9'
    };
  }

  function setupCanvas(canvas) {
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(320, rect.width || 640);
    const h = Math.max(240, rect.height || 380);
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w, h };
  }

  function drawAxes(ctx, w, h, xMin, xMax, yMin, yMax, c) {
    const tx = (x) => ((x - xMin) / (xMax - xMin)) * w;
    const ty = (y) => h - ((y - yMin) / (yMax - yMin)) * h;
    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = c.grid;
    ctx.lineWidth = 1;
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
      ctx.beginPath(); ctx.moveTo(tx(x), 0); ctx.lineTo(tx(x), h); ctx.stroke();
    }
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
      ctx.beginPath(); ctx.moveTo(0, ty(y)); ctx.lineTo(w, ty(y)); ctx.stroke();
    }
    ctx.strokeStyle = c.axis;
    ctx.lineWidth = 1.25;
    if (xMin <= 0 && xMax >= 0) {
      ctx.beginPath(); ctx.moveTo(tx(0), 0); ctx.lineTo(tx(0), h); ctx.stroke();
    }
    if (yMin <= 0 && yMax >= 0) {
      ctx.beginPath(); ctx.moveTo(0, ty(0)); ctx.lineTo(w, ty(0)); ctx.stroke();
    }
    return { tx, ty };
  }

  function solvePoly(pts, deg, lambda) {
    const m = deg + 1;
    const A = Array.from({ length: m }, () => new Array(m).fill(0));
    const b = new Array(m).fill(0);
    for (const p of pts) {
      const pows = [1];
      for (let k = 1; k < m; k++) pows.push(pows[k - 1] * p.x);
      for (let i = 0; i < m; i++) {
        b[i] += pows[i] * p.y;
        for (let j = 0; j < m; j++) A[i][j] += pows[i] * pows[j];
      }
    }
    for (let i = 1; i < m; i++) A[i][i] += (lambda || 1e-6);
    A[0][0] += 1e-8;
    // Gaussian elimination with partial pivoting
    const M = A.map((row, i) => [...row, b[i]]);
    for (let col = 0; col < m; col++) {
      let piv = col;
      for (let r = col + 1; r < m; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
      [M[col], M[piv]] = [M[piv], M[col]];
      const div = M[col][col] || 1e-10;
      for (let j = col; j <= m; j++) M[col][j] /= div;
      for (let r = 0; r < m; r++) {
        if (r === col) continue;
        const f = M[r][col];
        for (let j = col; j <= m; j++) M[r][j] -= f * M[col][j];
      }
    }
    return M.map((row) => row[m]);
  }

  function evalPoly(w, x) {
    let s = 0, p = 1;
    for (let i = 0; i < w.length; i++) { s += w[i] * p; p *= x; }
    return s;
  }

  const LABS = {
    /* 1. What Is a Model? */
    'what-is-a-model': {
      controls: [
        { id: 'w', label: 'Slope (w)', min: -2.5, max: 2.5, step: 0.05, value: 0.9 },
        { id: 'b', label: 'Intercept (b)', min: -3, max: 3, step: 0.1, value: 0.2 },
        { id: 'shape', label: 'Dataset', type: 'select', value: 'linear', options: [['linear', 'Linear Trend'], ['circle', 'Circular Pattern']] }
      ],
      breakIt: { label: 'Force line onto circular data', apply: (s) => { s.shape = 'circle'; s.w = 0.2; s.b = 0; }, note: 'A straight line can only predict one y per x—it cannot represent a closed ring.' },
      render(canvas, s, ui) {
        const c = themeColors();
        const { ctx, w, h } = setupCanvas(canvas);
        const { tx, ty } = drawAxes(ctx, w, h, -4, 4, -4, 4, c);
        const rng = seeded(42);
        const pts = [];
        for (let i = 0; i < 24; i++) {
          if (s.shape === 'circle') {
            const ang = (i / 24) * Math.PI * 2;
            pts.push({ x: Math.cos(ang) * 2.2 + (rng() - 0.5) * 0.3, y: Math.sin(ang) * 2.2 + (rng() - 0.5) * 0.3 });
          } else {
            const x = -3.2 + (6.4 * i) / 23;
            pts.push({ x, y: 0.85 * x + 0.3 + (rng() - 0.5) * 1.1 });
          }
        }
        ctx.strokeStyle = c.orange;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(tx(-4), ty(s.w * -4 + s.b));
        ctx.lineTo(tx(4), ty(s.w * 4 + s.b));
        ctx.stroke();

        let mse = 0;
        for (const p of pts) {
          const yhat = s.w * p.x + s.b;
          const err = p.y - yhat;
          mse += err * err;
          ctx.strokeStyle = 'rgba(213,94,0,0.45)';
          ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(tx(p.x), ty(p.y)); ctx.lineTo(tx(p.x), ty(yhat)); ctx.stroke();
          ctx.fillStyle = c.blue;
          ctx.beginPath(); ctx.arc(tx(p.x), ty(p.y), 4.5, 0, Math.PI * 2); ctx.fill();
        }
        mse /= pts.length;
        ui.setMetrics([
          { label: 'Equation', value: `ŷ = ${s.w.toFixed(2)}x + ${s.b.toFixed(2)}` },
          { label: 'Mean Squared Error', value: mse.toFixed(3) },
          { label: 'Samples', value: String(pts.length) }
        ]);
      }
    },

    /* 2. Loss Functions (MSE vs MAE) */
    'loss-functions': {
      controls: [
        { id: 'lossType', label: 'Loss Metric', type: 'select', value: 'mse', options: [['mse', 'MSE (L2 Squared)'], ['mae', 'MAE (L1 Absolute)']] },
        { id: 'outlierY', label: 'Outlier Y Position', min: -3, max: 10, step: 0.25, value: 1.8 }
      ],
      breakIt: { label: 'Drag outlier to y = 9.5', apply: (s) => { s.lossType = 'mse'; s.outlierY = 9.5; }, note: 'Squared error penalizes the single outlier quadratically, pulling the L2 line far off the main trend while L1 stays steady.' },
      render(canvas, s, ui) {
        const c = themeColors();
        const { ctx, w, h } = setupCanvas(canvas);
        const { tx, ty } = drawAxes(ctx, w, h, -4, 4, -4, 10.5, c);
        const rng = seeded(17);
        const pts = [];
        for (let i = 0; i < 16; i++) {
          const x = -3 + (5.5 * i) / 15;
          pts.push({ x, y: 0.7 * x + 0.4 + (rng() - 0.5) * 0.8 });
        }
        pts.push({ x: 3.2, y: s.outlierY, outlier: true });

        // Fit L2 via OLS
        const wL2 = solvePoly(pts, 1, 1e-6);
        // Fit L1 via simple coordinate descent
        let b1 = wL2[0], m1 = wL2[1];
        for (let step = 0; step < 120; step++) {
          let gm = 0, gb = 0;
          for (const p of pts) {
            const diff = m1 * p.x + b1 - p.y;
            const sg = diff > 0 ? 1 : diff < 0 ? -1 : 0;
            gm += sg * p.x; gb += sg;
          }
          m1 -= 0.015 * (gm / pts.length);
          b1 -= 0.03 * (gb / pts.length);
        }

        // Draw both lines (active bold, comparison dashed)
        const drawLine = (b0, m0, color, active) => {
          ctx.strokeStyle = color;
          ctx.lineWidth = active ? 2.8 : 1.5;
          ctx.setLineDash(active ? [] : [5, 4]);
          ctx.beginPath(); ctx.moveTo(tx(-4), ty(m0 * -4 + b0)); ctx.lineTo(tx(4), ty(m0 * 4 + b0)); ctx.stroke();
          ctx.setLineDash([]);
        };
        drawLine(wL2[0], wL2[1], c.red, s.lossType === 'mse');
        drawLine(b1, m1, c.green, s.lossType === 'mae');

        const activeM = s.lossType === 'mse' ? wL2[1] : m1;
        const activeB = s.lossType === 'mse' ? wL2[0] : b1;
        let mse = 0, mae = 0;
        for (const p of pts) {
          const yhat = activeM * p.x + activeB;
          const r = p.y - yhat;
          mse += r * r; mae += Math.abs(r);
          ctx.strokeStyle = p.outlier ? c.red : 'rgba(100,116,139,0.45)';
          ctx.lineWidth = p.outlier ? 2 : 1.1;
          ctx.beginPath(); ctx.moveTo(tx(p.x), ty(p.y)); ctx.lineTo(tx(p.x), ty(yhat)); ctx.stroke();
          ctx.fillStyle = p.outlier ? c.red : c.blue;
          ctx.beginPath(); ctx.arc(tx(p.x), ty(p.y), p.outlier ? 6.5 : 4.2, 0, Math.PI * 2); ctx.fill();
        }
        ui.setMetrics([
          { label: 'Active Fit', value: s.lossType === 'mse' ? 'MSE (Red)' : 'MAE (Green)' },
          { label: 'MSE Loss', value: (mse / pts.length).toFixed(2) },
          { label: 'MAE Loss', value: (mae / pts.length).toFixed(2) },
          { label: 'Fitted Slope', value: activeM.toFixed(2) }
        ]);
      }
    },

    /* 3. Gradient Descent (2D Contour) */
    'gradient-descent': {
      controls: [
        { id: 'lr', label: 'Learning Rate (η)', min: 0.02, max: 1.25, step: 0.02, value: 0.18 },
        { id: 'steps', label: 'Iterations', min: 1, max: 40, step: 1, value: 18 }
      ],
      breakIt: { label: 'Set η = 1.15 (Diverge)', apply: (s) => { s.lr = 1.15; s.steps = 12; }, note: 'The step size overshoots the valley walls and bounces outward toward infinity.' },
      render(canvas, s, ui) {
        const c = themeColors();
        const { ctx, w, h } = setupCanvas(canvas);
        const { tx, ty } = drawAxes(ctx, w, h, -4, 4, -4, 4, c);
        // Contours of f(x,y) = 0.5*x^2 + 1.8*y^2
        for (let lv = 1; lv <= 14; lv++) {
          const rx = Math.sqrt(lv * 2);
          const ry = Math.sqrt(lv / 1.8);
          ctx.strokeStyle = c.dark ? 'rgba(96,165,250,0.22)' : 'rgba(37,99,235,0.20)';
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.ellipse(tx(0), ty(0), (rx / 8) * w, (ry / 8) * h, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        let x = -3.2, y = 2.6;
        const path = [{ x, y }];
        let diverged = false;
        for (let i = 0; i < s.steps; i++) {
          const gx = x, gy = 3.6 * y;
          x -= s.lr * gx;
          y -= s.lr * gy;
          if (!Number.isFinite(x) || !Number.isFinite(y) || Math.abs(x) > 50 || Math.abs(y) > 50) {
            diverged = true;
            break;
          }
          path.push({ x, y });
        }
        ctx.strokeStyle = diverged ? c.red : c.orange;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        path.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(tx(pt.x), ty(pt.y));
          else ctx.lineTo(tx(pt.x), ty(pt.y));
        });
        ctx.stroke();
        path.forEach((pt, idx) => {
          ctx.fillStyle = idx === path.length - 1 ? (diverged ? c.red : c.green) : c.orange;
          ctx.beginPath(); ctx.arc(tx(pt.x), ty(pt.y), idx === path.length - 1 ? 6 : 3, 0, Math.PI * 2); ctx.fill();
        });
        const finalLoss = 0.5 * x * x + 1.8 * y * y;
        ui.setMetrics([
          { label: 'Status', value: diverged ? 'Diverged!' : finalLoss < 0.05 ? 'Converged' : 'Descending' },
          { label: 'Final Loss', value: diverged ? '∞' : finalLoss.toFixed(4) },
          { label: 'Steps Taken', value: String(path.length - 1) }
        ]);
      }
    },

    /* 4. Optimizers Race (SGD vs Momentum vs RMSProp vs Adam) */
    'optimizers': {
      controls: [
        { id: 'surface', label: 'Surface', type: 'select', value: 'ravine', options: [['ravine', 'Narrow Ravine'], ['saddle', 'Saddle Point']] },
        { id: 'lr', label: 'Base LR (η)', min: 0.02, max: 0.35, step: 0.01, value: 0.10 },
        { id: 'steps', label: 'Race Steps', min: 1, max: 60, step: 1, value: 35 }
      ],
      breakIt: { label: 'Trap SGD on Saddle Point', apply: (s) => { s.surface = 'saddle'; s.lr = 0.06; s.steps = 30; }, note: 'Near a flat saddle point, vanilla SGD crawls while Momentum and Adam escape.' },
      render(canvas, s, ui) {
        const c = themeColors();
        const { ctx, w, h } = setupCanvas(canvas);
        const { tx, ty } = drawAxes(ctx, w, h, -4, 4, -4, 4, c);
        const grad = (x, y) =>
          s.surface === 'saddle'
            ? [0.6 * x, -0.6 * y + 0.12 * y * y * y]
            : [0.35 * x, 4.2 * y];

        // Contour hints
        for (let k = 1; k <= 8; k++) {
          ctx.strokeStyle = c.grid;
          ctx.lineWidth = 1;
          ctx.beginPath();
          if (s.surface === 'ravine') {
            ctx.ellipse(tx(0), ty(0), (k * 0.55 / 8) * w, (k * 0.18 / 8) * h, 0, 0, Math.PI * 2);
          } else {
            ctx.arc(tx(0), ty(0), (k * 0.45 / 8) * w, 0, Math.PI * 2);
          }
          ctx.stroke();
        }

        const start = s.surface === 'saddle' ? { x: -2.4, y: 0.18 } : { x: -3.4, y: 2.2 };
        const runners = [
          { name: 'SGD', color: c.red, x: start.x, y: start.y, vx: 0, vy: 0, sx: 0, sy: 0, pts: [{ ...start }] },
          { name: 'Momentum', color: c.orange, x: start.x, y: start.y, vx: 0, vy: 0, sx: 0, sy: 0, pts: [{ ...start }] },
          { name: 'RMSProp', color: c.blue, x: start.x, y: start.y, vx: 0, vy: 0, sx: 0, sy: 0, pts: [{ ...start }] },
          { name: 'Adam', color: c.green, x: start.x, y: start.y, vx: 0, vy: 0, sx: 0, sy: 0, pts: [{ ...start }] }
        ];

        for (let t = 1; t <= s.steps; t++) {
          for (const r of runners) {
            const [gx, gy] = grad(r.x, r.y);
            if (r.name === 'SGD') {
              r.x -= s.lr * gx; r.y -= s.lr * gy;
            } else if (r.name === 'Momentum') {
              r.vx = 0.85 * r.vx - s.lr * gx;
              r.vy = 0.85 * r.vy - s.lr * gy;
              r.x += r.vx; r.y += r.vy;
            } else if (r.name === 'RMSProp') {
              r.sx = 0.9 * r.sx + 0.1 * gx * gx;
              r.sy = 0.9 * r.sy + 0.1 * gy * gy;
              r.x -= (s.lr * gx) / (Math.sqrt(r.sx) + 1e-6);
              r.y -= (s.lr * gy) / (Math.sqrt(r.sy) + 1e-6);
            } else {
              r.vx = 0.9 * r.vx + 0.1 * gx;
              r.vy = 0.9 * r.vy + 0.1 * gy;
              r.sx = 0.99 * r.sx + 0.01 * gx * gx;
              r.sy = 0.99 * r.sy + 0.01 * gy * gy;
              const mx = r.vx / (1 - Math.pow(0.9, t));
              const my = r.vy / (1 - Math.pow(0.9, t));
              const vx = r.sx / (1 - Math.pow(0.99, t));
              const vy = r.sy / (1 - Math.pow(0.99, t));
              r.x -= (s.lr * 1.4 * mx) / (Math.sqrt(vx) + 1e-6);
              r.y -= (s.lr * 1.4 * my) / (Math.sqrt(vy) + 1e-6);
            }
            r.x = Math.max(-4.5, Math.min(4.5, r.x));
            r.y = Math.max(-4.5, Math.min(4.5, r.y));
            r.pts.push({ x: r.x, y: r.y });
          }
        }

        for (const r of runners) {
          ctx.strokeStyle = r.color;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          r.pts.forEach((pt, idx) => (idx === 0 ? ctx.moveTo(tx(pt.x), ty(pt.y)) : ctx.lineTo(tx(pt.x), ty(pt.y))));
          ctx.stroke();
          ctx.fillStyle = r.color;
          ctx.beginPath(); ctx.arc(tx(r.x), ty(r.y), 5.5, 0, Math.PI * 2); ctx.fill();
        }
        ui.setMetrics(
          runners.map((r) => ({ label: r.name, value: `(${r.x.toFixed(2)}, ${r.y.toFixed(2)})` }))
        );
      }
    },

    /* 5. Overfitting & Underfitting */
    'overfitting-underfitting': {
      controls: [
        { id: 'degree', label: 'Polynomial Degree', min: 1, max: 11, step: 1, value: 3 },
        { id: 'noise', label: 'Noise', min: 0.05, max: 1.0, step: 0.05, value: 0.35 }
      ],
      breakIt: { label: 'Degree 11 Memorization', apply: (s) => { s.degree = 11; s.noise = 0.55; }, note: 'Training error drops near zero while validation error explodes between points.' },
      render(canvas, s, ui) {
        const c = themeColors();
        const { ctx, w, h } = setupCanvas(canvas);
        const { tx, ty } = drawAxes(ctx, w, h, -3.5, 3.5, -2.5, 2.5, c);
        const rng = seeded(99);
        const train = [], val = [];
        for (let i = 0; i < 12; i++) {
          const x = -3 + (6 * i) / 11;
          train.push({ x, y: Math.sin(x) + (rng() - 0.5) * 2 * s.noise });
        }
        for (let i = 0; i < 12; i++) {
          const x = -2.75 + (5.5 * i) / 11;
          val.push({ x, y: Math.sin(x) + (rng() - 0.5) * 2 * s.noise });
        }
        const weights = solvePoly(train, s.degree, 1e-7);

        // True sine curve (dashed)
        ctx.strokeStyle = c.axis;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        for (let px = 0; px <= w; px += 4) {
          const x = -3.5 + (7 * px) / w;
          const y = Math.sin(x);
          px === 0 ? ctx.moveTo(px, ty(y)) : ctx.lineTo(px, ty(y));
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Fitted curve
        ctx.strokeStyle = c.purple;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        for (let px = 0; px <= w; px += 3) {
          const x = -3.5 + (7 * px) / w;
          const y = Math.max(-5, Math.min(5, evalPoly(weights, x)));
          px === 0 ? ctx.moveTo(px, ty(y)) : ctx.lineTo(px, ty(y));
        }
        ctx.stroke();

        for (const p of train) { ctx.fillStyle = c.blue; ctx.beginPath(); ctx.arc(tx(p.x), ty(p.y), 4.8, 0, Math.PI * 2); ctx.fill(); }
        for (const p of val) { ctx.fillStyle = c.orange; ctx.beginPath(); ctx.arc(tx(p.x), ty(p.y), 4.2, 0, Math.PI * 2); ctx.fill(); }

        const mseOf = (arr) => arr.reduce((acc, p) => acc + Math.pow(p.y - evalPoly(weights, p.x), 2), 0) / arr.length;
        const trErr = mseOf(train), vaErr = mseOf(val);
        const regime = s.degree <= 1 ? 'Underfitting' : vaErr > trErr * 3.5 && s.degree >= 6 ? 'Overfitting' : 'Balanced';
        ui.setMetrics([
          { label: 'Regime', value: regime },
          { label: 'Train MSE (Blue)', value: trErr.toFixed(3) },
          { label: 'Val MSE (Orange)', value: vaErr.toFixed(3) }
        ]);
      }
    },

    /* 6. Polynomial Regression & Extrapolation */
    'polynomial-regression': {
      controls: [
        { id: 'degree', label: 'Basis Degree', min: 1, max: 9, step: 1, value: 3 },
        { id: 'extrap', label: 'Show Extrapolation Range', min: 3, max: 6, step: 0.5, value: 3.5 }
      ],
      breakIt: { label: 'Extrapolate Degree 8 Outside Range', apply: (s) => { s.degree = 8; s.extrap = 6; }, note: 'High-degree polynomials bend cleanly inside training support [-2.5, 2.5] but explode wildly outside it.' },
      render(canvas, s, ui) {
        const c = themeColors();
        const { ctx, w, h } = setupCanvas(canvas);
        const { tx, ty } = drawAxes(ctx, w, h, -s.extrap, s.extrap, -3.5, 3.5, c);
        // Shade extrapolation zones
        ctx.fillStyle = c.dark ? 'rgba(248,113,113,0.08)' : 'rgba(213,94,0,0.06)';
        ctx.fillRect(0, 0, tx(-2.5), h);
        ctx.fillRect(tx(2.5), 0, w - tx(2.5), h);

        const rng = seeded(21);
        const pts = [];
        for (let i = 0; i < 14; i++) {
          const x = -2.4 + (4.8 * i) / 13;
          pts.push({ x, y: Math.cos(x) + 0.25 * x + (rng() - 0.5) * 0.45 });
        }
        const weights = solvePoly(pts, s.degree, 1e-6);
        ctx.strokeStyle = c.green;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let px = 0; px <= w; px += 3) {
          const x = -s.extrap + (2 * s.extrap * px) / w;
          const y = Math.max(-8, Math.min(8, evalPoly(weights, x)));
          px === 0 ? ctx.moveTo(px, ty(y)) : ctx.lineTo(px, ty(y));
        }
        ctx.stroke();
        for (const p of pts) { ctx.fillStyle = c.blue; ctx.beginPath(); ctx.arc(tx(p.x), ty(p.y), 4.5, 0, Math.PI * 2); ctx.fill(); }
        const edgePred = evalPoly(weights, s.extrap);
        ui.setMetrics([
          { label: 'Degree', value: String(s.degree) },
          { label: `Prediction at x=${s.extrap}`, value: Math.abs(edgePred) > 99 ? 'Exploded' : edgePred.toFixed(2) },
          { label: 'True Value at Edge', value: (Math.cos(s.extrap) + 0.25 * s.extrap).toFixed(2) }
        ]);
      }
    },

    /* 7. Bias-Variance Tradeoff */
    'bias-variance': {
      controls: [
        { id: 'degree', label: 'Model Complexity (Deg)', min: 1, max: 8, step: 1, value: 3 },
        { id: 'resamples', label: 'Bootstrapped Runs', min: 5, max: 35, step: 5, value: 20 }
      ],
      breakIt: { label: 'High-Variance Degree 8', apply: (s) => { s.degree = 8; s.resamples = 30; }, note: 'Each random training sample produces a wildly different curve—low bias, massive variance.' },
      render(canvas, s, ui) {
        const c = themeColors();
        const { ctx, w, h } = setupCanvas(canvas);
        const { tx, ty } = drawAxes(ctx, w, h, -3.2, 3.2, -2.5, 2.5, c);
        const gridX = [];
        for (let i = 0; i <= 60; i++) gridX.push(-3 + (6 * i) / 60);
        const preds = [];

        for (let r = 0; r < s.resamples; r++) {
          const rng = seeded(100 + r * 37);
          const pts = [];
          for (let i = 0; i < 11; i++) {
            const x = -2.8 + rng() * 5.6;
            pts.push({ x, y: Math.sin(x) + (rng() - 0.5) * 0.9 });
          }
          const weights = solvePoly(pts, s.degree, 1e-4);
          const curve = gridX.map((x) => Math.max(-4, Math.min(4, evalPoly(weights, x))));
          preds.push(curve);
          ctx.strokeStyle = c.dark ? 'rgba(96,165,250,0.22)' : 'rgba(0,114,178,0.18)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          curve.forEach((y, idx) => (idx === 0 ? ctx.moveTo(tx(gridX[idx]), ty(y)) : ctx.lineTo(tx(gridX[idx]), ty(y))));
          ctx.stroke();
        }

        // Mean prediction & True function
        let bias2 = 0, variance = 0;
        ctx.strokeStyle = c.orange;
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        gridX.forEach((x, idx) => {
          const mean = preds.reduce((a, p) => a + p[idx], 0) / preds.length;
          const v = preds.reduce((a, p) => a + Math.pow(p[idx] - mean, 2), 0) / preds.length;
          bias2 += Math.pow(mean - Math.sin(x), 2);
          variance += v;
          idx === 0 ? ctx.moveTo(tx(x), ty(mean)) : ctx.lineTo(tx(x), ty(mean));
        });
        ctx.stroke();
        bias2 /= gridX.length; variance /= gridX.length;

        ctx.strokeStyle = c.green;
        ctx.lineWidth = 1.8;
        ctx.setLineDash([5, 3]);
        ctx.beginPath();
        gridX.forEach((x, idx) => (idx === 0 ? ctx.moveTo(tx(x), ty(Math.sin(x))) : ctx.lineTo(tx(x), ty(Math.sin(x)))));
        ctx.stroke();
        ctx.setLineDash([]);

        ui.setMetrics([
          { label: 'Bias²', value: bias2.toFixed(3) },
          { label: 'Variance', value: variance.toFixed(3) },
          { label: 'Total (Bias² + Var)', value: (bias2 + variance).toFixed(3) }
        ]);
      }
    },

    /* 8. Ridge Regression (L2 Circle Constraint) */
    'ridge-regression': {
      controls: [
        { id: 'lambda', label: 'L2 Penalty (λ)', min: 0, max: 30, step: 0.5, value: 4 }
      ],
      breakIt: { label: 'Over-shrink with λ = 30', apply: (s) => { s.lambda = 30; }, note: 'Excessive L2 shrinkage pulls both weights close to zero, causing heavy underfitting.' },
      render(canvas, s, ui) {
        const c = themeColors();
        const { ctx, w, h } = setupCanvas(canvas);
        const { tx, ty } = drawAxes(ctx, w, h, -3.5, 3.5, -3.5, 3.5, c);
        const ols = { w1: 2.2, w2: 1.4 };
        const scale = 1 / (1 + s.lambda * 0.25);
        const w1 = ols.w1 * scale, w2 = ols.w2 * scale;
        const rad = Math.hypot(w1, w2);

        // Loss ellipses around OLS
        for (let k = 1; k <= 6; k++) {
          ctx.strokeStyle = c.dark ? 'rgba(148,163,184,0.28)' : 'rgba(100,116,139,0.28)';
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.ellipse(tx(ols.w1), ty(ols.w2), (k * 0.48 / 7) * w, (k * 0.28 / 7) * h, -0.45, 0, Math.PI * 2);
          ctx.stroke();
        }
        // L2 circle
        ctx.fillStyle = c.dark ? 'rgba(0,158,115,0.16)' : 'rgba(0,158,115,0.12)';
        ctx.strokeStyle = c.green;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.ellipse(tx(0), ty(0), (rad / 7) * w, (rad / 7) * h, 0, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();

        // OLS & Ridge dots
        ctx.fillStyle = c.red; ctx.beginPath(); ctx.arc(tx(ols.w1), ty(ols.w2), 5.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = c.green; ctx.beginPath(); ctx.arc(tx(w1), ty(w2), 6.5, 0, Math.PI * 2); ctx.fill();
        ui.setMetrics([
          { label: 'OLS (w₁, w₂)', value: '(2.20, 1.40)' },
          { label: 'Ridge w₁', value: w1.toFixed(2) },
          { label: 'Ridge w₂', value: w2.toFixed(2) },
          { label: 'L2 Norm ||w||', value: rad.toFixed(2) }
        ]);
      }
    },

    /* 9. Lasso Regression (L1 Diamond Constraint) */
    'lasso-regression': {
      controls: [
        { id: 'lambda', label: 'L1 Penalty (λ)', min: 0, max: 3.0, step: 0.1, value: 1.1 }
      ],
      breakIt: { label: 'Pin w₂ exactly to 0', apply: (s) => { s.lambda = 1.5; }, note: 'The elliptical loss contour touches the sharp corner of the L1 diamond on the w₁ axis, zeroing out w₂.' },
      render(canvas, s, ui) {
        const c = themeColors();
        const { ctx, w, h } = setupCanvas(canvas);
        const { tx, ty } = drawAxes(ctx, w, h, -3.5, 3.5, -3.5, 3.5, c);
        const ols = { w1: 2.3, w2: 0.9 };
        const soft = (v, t) => Math.sign(v) * Math.max(0, Math.abs(v) - t);
        const w1 = soft(ols.w1, s.lambda);
        const w2 = soft(ols.w2, s.lambda);
        const l1 = Math.abs(w1) + Math.abs(w2);

        for (let k = 1; k <= 6; k++) {
          ctx.strokeStyle = c.dark ? 'rgba(148,163,184,0.28)' : 'rgba(100,116,139,0.28)';
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.ellipse(tx(ols.w1), ty(ols.w2), (k * 0.45 / 7) * w, (k * 0.30 / 7) * h, -0.3, 0, Math.PI * 2);
          ctx.stroke();
        }
        // L1 diamond
        ctx.fillStyle = c.dark ? 'rgba(230,159,0,0.16)' : 'rgba(230,159,0,0.12)';
        ctx.strokeStyle = c.orange;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(tx(l1), ty(0)); ctx.lineTo(tx(0), ty(l1));
        ctx.lineTo(tx(-l1), ty(0)); ctx.lineTo(tx(0), ty(-l1));
        ctx.closePath(); ctx.fill(); ctx.stroke();

        ctx.fillStyle = c.red; ctx.beginPath(); ctx.arc(tx(ols.w1), ty(ols.w2), 5.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = c.orange; ctx.beginPath(); ctx.arc(tx(w1), ty(w2), 6.5, 0, Math.PI * 2); ctx.fill();
        ui.setMetrics([
          { label: 'Lasso w₁', value: w1.toFixed(2) },
          { label: 'Lasso w₂', value: w2 === 0 ? '0.00 (Pruned!)' : w2.toFixed(2) },
          { label: 'L1 Norm |w₁|+|w₂|', value: l1.toFixed(2) }
        ]);
      }
    },

    /* 10. Elastic Net */
    'elastic-net': {
      controls: [
        { id: 'ratio', label: 'L1 Ratio (0=Ridge, 1=Lasso)', min: 0, max: 1, step: 0.05, value: 0.5 },
        { id: 'lambda', label: 'Penalty Strength (λ)', min: 0.1, max: 2.5, step: 0.1, value: 1.0 }
      ],
      breakIt: { label: 'Over-penalize both norms', apply: (s) => { s.ratio = 0.7; s.lambda = 2.4; }, note: 'Strong combined L1+L2 penalty shrinks all informative features to zero.' },
      render(canvas, s, ui) {
        const c = themeColors();
        const { ctx, w, h } = setupCanvas(canvas);
        const { tx, ty } = drawAxes(ctx, w, h, -3.5, 3.5, -3.5, 3.5, c);
        const ols = { w1: 2.2, w2: 1.0 };
        const l1 = s.lambda * s.ratio;
        const l2 = s.lambda * (1 - s.ratio);
        const soft = (v, t) => Math.sign(v) * Math.max(0, Math.abs(v) - t);
        const w1 = soft(ols.w1, l1) / (1 + l2);
        const w2 = soft(ols.w2, l1) / (1 + l2);
        const budget = Math.max(0.08, s.ratio * (Math.abs(w1) + Math.abs(w2)) + (1 - s.ratio) * (w1 * w1 + w2 * w2));

        // Draw elastic net contour boundary
        ctx.fillStyle = c.dark ? 'rgba(167,139,250,0.16)' : 'rgba(124,58,237,0.12)';
        ctx.strokeStyle = c.purple;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        for (let i = 0; i <= 120; i++) {
          const ang = (i / 120) * Math.PI * 2;
          const ca = Math.cos(ang), sa = Math.sin(ang);
          // Solve ratio*r*(|ca|+|sa|) + (1-ratio)*r^2 = budget
          const A = 1 - s.ratio;
          const B = s.ratio * (Math.abs(ca) + Math.abs(sa));
          const r = A < 1e-4 ? budget / B : (-B + Math.sqrt(B * B + 4 * A * budget)) / (2 * A);
          const px = tx(r * ca), py = ty(r * sa);
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = c.red; ctx.beginPath(); ctx.arc(tx(ols.w1), ty(ols.w2), 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = c.purple; ctx.beginPath(); ctx.arc(tx(w1), ty(w2), 6.5, 0, Math.PI * 2); ctx.fill();
        ui.setMetrics([
          { label: 'Blend', value: `${Math.round(s.ratio * 100)}% L1 / ${Math.round((1 - s.ratio) * 100)}% L2` },
          { label: 'Elastic w₁', value: w1.toFixed(2) },
          { label: 'Elastic w₂', value: w2.toFixed(2) }
        ]);
      }
    }
  };

  window.MLLabsRegistry = Object.assign(window.MLLabsRegistry || {}, LABS);
  window.MLLabUtils = { seeded, themeColors, setupCanvas, drawAxes };
})();
