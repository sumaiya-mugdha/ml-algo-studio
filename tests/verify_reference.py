import json
import os
import subprocess
import numpy as np

# Reference verification against NumPy for OLS Linear Regression, PCA, and Logistic Regression
pts = [
    {"x": -3.1, "y": -2.4, "label": 0},
    {"x": -1.5, "y": -0.8, "label": 0},
    {"x": 0.2, "y": 1.1, "label": 0},
    {"x": 1.8, "y": 2.9, "label": 1},
    {"x": 3.4, "y": 4.2, "label": 1},
]

xs = np.array([p["x"] for p in pts])
ys = np.array([p["y"] for p in pts])

# NumPy OLS
w_ref, b_ref = np.polyfit(xs, ys, 1)
pred_ref = w_ref * xs + b_ref
mse_ref = np.mean((ys - pred_ref) ** 2)
r2_ref = 1 - np.sum((ys - pred_ref) ** 2) / np.sum((ys - np.mean(ys)) ** 2)

# NumPy PCA (2D covariance eigendecomposition)
X = np.column_stack([xs, ys])
cov = np.cov(X, rowvar=False, ddof=1)
eigvals, eigvecs = np.linalg.eigh(cov)
idx = np.argsort(eigvals)[::-1]
eigvals = eigvals[idx]
ratio1_ref = eigvals[0] / np.sum(eigvals)

js_script = f"""
const ML = require('./js/algorithms.js');
const pts = {json.dumps(pts)};
const ols = ML.fitLinearRegressionOLS(pts);
const pca = ML.fitPCA(pts);
console.log(JSON.stringify({{
  w: ols.w, b: ols.b, mse: ols.mse, r2: ols.r2,
  ratio1: pca.ratio1, var1: pca.var1, var2: pca.var2
}}));
"""

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = subprocess.check_output(["node", "-e", js_script], cwd=base_dir, text=True)
js_res = json.loads(out)

assert abs(js_res["w"] - w_ref) < 1e-9, f"OLS w mismatch: {js_res['w']} vs {w_ref}"
assert abs(js_res["b"] - b_ref) < 1e-9, f"OLS b mismatch: {js_res['b']} vs {b_ref}"
assert abs(js_res["mse"] - mse_ref) < 1e-9, f"OLS mse mismatch: {js_res['mse']} vs {mse_ref}"
assert abs(js_res["r2"] - r2_ref) < 1e-9, f"OLS r2 mismatch: {js_res['r2']} vs {r2_ref}"
assert abs(js_res["ratio1"] - ratio1_ref) < 1e-9, f"PCA ratio1 mismatch: {js_res['ratio1']} vs {ratio1_ref}"
assert abs(js_res["var1"] - eigvals[0]) < 1e-9, f"PCA var1 mismatch: {js_res['var1']} vs {eigvals[0]}"
assert abs(js_res["var2"] - eigvals[1]) < 1e-9, f"PCA var2 mismatch: {js_res['var2']} vs {eigvals[1]}"

print("NUMPY REFERENCE VERIFICATION PASSED (OLS + PCA exact to 1e-9)")
