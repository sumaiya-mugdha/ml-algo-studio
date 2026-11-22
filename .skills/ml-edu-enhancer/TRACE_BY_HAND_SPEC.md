# Trace It by Hand — Specification for Remaining 10 Algorithms

## Global Rules
1. **Do NOT alter Linear Regression:** Keep its existing `(1, 2), (2, 3), (3, 5), (4, 6)` walkthrough untouched.
2. **Match Existing UI & Design:** Use the exact same HTML/CSS structure and flat design tokens (`css/education.css`, zero gradients/shadows) used in Linear Regression's "Trace it by hand" section.
3. **Strict KaTeX Delimiters:** Wrap all math in valid `$ ... $` or `$$ ... $$` delimiters (escape backslashes properly in JS strings so raw `\text` or `\cdot` never renders as plain text) and ensure KaTeX auto-render runs on every algorithm switch.
4. **Approval Gates:** Implement in 3 batches (Batch A → Batch B → Batch C) and **STOP & ASK** for approval after each batch.

---

## Batch A: Linear & Probabilistic Models

### 1. Logistic Regression
- **Toy Dataset (4 points):**
  - $(x_1 = -2, y_1 = 0)$, $(x_2 = -1, y_2 = 0)$, $(x_3 = 1, y_3 = 1)$, $(x_4 = 2, y_4 = 1)$
- **Initial Parameters:** Weight $w = 1.0$, bias $b = 0.0$, learning rate $\alpha = 0.5$.
- **Step-by-Step Trace:**
  1. Compute linear logit $z_i = w x_i + b$: gives $z = [-2, -1, 1, 2]$.
  2. Apply sigmoid $\hat{p}_i = \sigma(z_i) = \frac{1}{1 + e^{-z_i}}$: gives $[0.119, 0.269, 0.731, 0.881]$.
  3. Compute binary cross-entropy loss for $x_3 = 1$ ($y_3 = 1$): $-\ln(0.731) \approx 0.313$, and average loss across all 4 points ($\approx 0.220$).
  4. Compute gradient on $x_3$: $\frac{\partial L}{\partial w} = (\hat{p}_3 - y_3)x_3 = (0.731 - 1)(1) = -0.269$, and update $w_{\text{new}} = 1.0 - 0.5(-0.269) = 1.135$.

### 2. Linear SVM
- **Toy Dataset (3 points, labels $y \in \{-1, +1\}$):**
  - $A = (1, 1), y_1 = -1$
  - $B = (2, 2), y_2 = -1$
  - $C = (4, 4), y_3 = +1$
- **Candidate Hyperplane:** $\mathbf{w} = [0.5, 0.5]$, $b = -3.0$ (decision boundary $0.5x_1 + 0.5x_2 - 3 = 0$), regularization $C = 1.0$.
- **Step-by-Step Trace:**
  1. Compute raw decision score $f(\mathbf{x}_i) = \mathbf{w}\cdot\mathbf{x}_i + b$:
     - $f(A) = 0.5(1)+0.5(1)-3 = -2.0$
     - $f(B) = 0.5(2)+0.5(2)-3 = -1.0$
     - $f(C) = 0.5(4)+0.5(4)-3 = +1.0$
  2. Compute functional margin $y_i f(\mathbf{x}_i)$:
     - Point A: $(-1)(-2.0) = +2.0 \ge 1$ (outside margin, 0 hinge loss)
     - Point B: $(-1)(-1.0) = +1.0$ (sits exactly on negative margin boundary — **support vector**)
     - Point C: $(+1)(+1.0) = +1.0$ (sits exactly on positive margin boundary — **support vector**)
  3. Compute hinge loss $\max(0, 1 - y_i f(\mathbf{x}_i)) = 0$ for all 3 points, and geometric margin width $\frac{2}{\|\mathbf{w}\|} = \frac{2}{\sqrt{0.5^2 + 0.5^2}} = \frac{2}{\sqrt{0.5}} \approx 2.83$.

### 3. K-Nearest Neighbors (KNN)
- **Toy Dataset (5 points, $K = 3$, Euclidean distance):**
  - $P_1 = (1, 1)$ [Class A]
  - $P_2 = (2, 1)$ [Class A]
  - $P_3 = (1, 3)$ [Class B]
  - $P_4 = (4, 4)$ [Class B]
  - $P_5 = (5, 4)$ [Class B]
- **Query Point:** $Q = (2, 2)$.
- **Step-by-Step Trace:**
  1. Compute Euclidean distance $d(Q, P_i) = \sqrt{(x_i - 2)^2 + (y_i - 2)^2}$:
     - $d(Q, P_1) = \sqrt{(-1)^2 + (-1)^2} = \sqrt{2} \approx 1.41$ [Class A]
     - $d(Q, P_2) = \sqrt{0^2 + (-1)^2} = 1.00$ [Class A]
     - $d(Q, P_3) = \sqrt{(-1)^2 + 1^2} = \sqrt{2} \approx 1.41$ [Class B]
     - $d(Q, P_4) = \sqrt{2^2 + 2^2} = \sqrt{8} \approx 2.83$ [Class B]
     - $d(Q, P_5) = \sqrt{3^2 + 2^2} = \sqrt{13} \approx 3.61$ [Class B]
  2. Sort neighbors ascending: $P_2 (1.00, A)$, $P_1 (1.41, A)$, $P_3 (1.41, B)$.
  3. Take top $K = 3$ vote: **2 votes for Class A** vs. **1 vote for Class B** $\rightarrow$ Predict **Class A** (confidence $2/3 \approx 66.7\%$).

### 4. Gaussian Naive Bayes
- **Toy Dataset (1D feature $x$, 6 points across 2 balanced classes):**
  - Class 0: $x \in \{1, 2, 3\}$
  - Class 1: $x \in \{5, 6, 7\}$
- **Query Point:** $x_{\text{new}} = 3.5$.
- **Step-by-Step Trace:**
  1. Compute class priors: $P(y=0) = \frac{3}{6} = 0.5$, $P(y=1) = \frac{3}{6} = 0.5$.
  2. Compute class means and variances:
     - Class 0: $\mu_0 = 2.0$, $\sigma_0^2 = \frac{(1-2)^2 + (2-2)^2 + (3-2)^2}{3} = \frac{2}{3} \approx 0.667$.
     - Class 1: $\mu_1 = 6.0$, $\sigma_1^2 = \frac{(5-6)^2 + (6-6)^2 + (7-6)^2}{3} = \frac{2}{3} \approx 0.667$.
  3. Evaluate Gaussian likelihood $P(x \mid y) = \frac{1}{\sqrt{2\pi\sigma^2}}\exp\!\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)$ at $x_{\text{new}} = 3.5$:
     - $P(3.5 \mid y=0) \propto \exp\!\left(-\frac{(3.5-2)^2}{2(0.667)}\right) = e^{-1.688} \approx 0.185$
     - $P(3.5 \mid y=1) \propto \exp\!\left(-\frac{(3.5-6)^2}{2(0.667)}\right) = e^{-4.688} \approx 0.0092$
  4. Compare posteriors (equal priors): $0.185 > 0.0092 \rightarrow$ Predict **Class 0** ($P(y=0 \mid x=3.5) \approx 95.3\%$).

---

## Batch B: Tree & Ensemble Models

### 5. Decision Tree (CART with Gini Impurity)
- **Toy Dataset (5 points with 1D split feature $x$):**
  - $(x=1, A)$, $(x=2, A)$, $(x=3, B)$, $(x=4, B)$, $(x=5, B)$
- **Candidate Split:** $x \le 2.5$ vs. $x > 2.5$.
- **Step-by-Step Trace:**
  1. Compute parent Gini impurity ($2A, 3B$):
     $$G_{\text{parent}} = 1 - \left(\frac{2}{5}\right)^2 - \left(\frac{3}{5}\right)^2 = 1 - 0.16 - 0.36 = 0.48$$
  2. Split at $x \le 2.5$:
     - Left leaf ($x \in \{1, 2\} \rightarrow 2A, 0B$): $G_{\text{left}} = 1 - 1^2 - 0^2 = 0.00$
     - Right leaf ($x \in \{3, 4, 5\} \rightarrow 0A, 3B$): $G_{\text{right}} = 1 - 0^2 - 1^2 = 0.00$
  3. Compute weighted child Gini & Gini Gain:
     $$G_{\text{split}} = \frac{2}{5}(0.00) + \frac{3}{5}(0.00) = 0.00, \quad \Delta G = 0.48 - 0.00 = 0.48$$
  4. Result: Pure leaves achieved in a single split.

### 6. Random Forest (Bagging + Majority Vote)
- **Original Dataset (4 points):** $P_1(A), P_2(A), P_3(B), P_4(B)$, plus a query point $Q$.
- **3 Bootstrap Samples (drawn with replacement):**
  - Tree 1 sample: $\{P_1(A), P_1(A), P_3(B), P_4(B)\}$ $\rightarrow$ Tree 1 predicts **Class A**.
  - Tree 2 sample: $\{P_2(A), P_3(B), P_3(B), P_4(B)\}$ $\rightarrow$ Tree 2 predicts **Class B**.
  - Tree 3 sample: $\{P_1(A), P_2(A), P_2(A), P_4(B)\}$ $\rightarrow$ Tree 3 predicts **Class A**.
- **Step-by-Step Trace:**
  1. Show how bootstrap sampling leaves ~36.8% out-of-bag (OOB) samples per tree and restricts each split to a random subset of features ($\sqrt{d}$).
  2. Aggregate individual tree predictions on $Q$: `[Class A, Class B, Class A]`.
  3. Compute ensemble majority vote: **2 votes Class A** vs. **1 vote Class B** $\rightarrow$ Final prediction **Class A** (reduces single-tree variance).

### 7. Gradient Boosting (Sequential Residual Trees)
- **Toy Dataset (4 points):**
  - $(x_1=1, y_1=2)$, $(x_2=2, y_2=3)$, $(x_3=3, y_3=7)$, $(x_4=4, y_4=8)$
- **Hyperparameters:** Learning rate $\eta = 0.5$, 1-split regression stumps.
- **Step-by-Step Trace:**
  1. **Stage 0 (Initial base model):** Predict the mean $F_0(x) = \bar{y} = \frac{2+3+7+8}{4} = 5.0$ for all points.
  2. **Compute pseudo-residuals $r_{i1} = y_i - F_0(x_i)$:**
     - $r = [2-5, 3-5, 7-5, 8-5] = [-3, -2, +2, +3]$.
  3. **Stage 1 (Fit stump $h_1(x)$ to residuals at split $x \le 2.5$):**
     - Left leaf ($x \le 2.5$): mean residual $= \frac{-3 + (-2)}{2} = -2.5$.
     - Right leaf ($x > 2.5$): mean residual $= \frac{+2 + 3}{2} = +2.5$.
  4. **Update ensemble $F_1(x) = F_0(x) + \eta h_1(x)$:**
     - For $x \le 2.5$: $5.0 + 0.5(-2.5) = 3.75$ (closer to $[2, 3]$).
     - For $x > 2.5$: $5.0 + 0.5(+2.5) = 6.25$ (closer to $[7, 8]$).

---

## Batch C: Neural & Unsupervised Models

### 8. Neural Network (MLP Forward + Backprop Pass)
- **Minimal Architecture:** 1 input $x$, 1 hidden neuron ($h$ with Tanh), 1 linear output $\hat{y}$ (squared error loss $L = \frac{1}{2}(\hat{y} - y)^2$).
- **Training Sample & Weights:** $x = 1.0$, target $y = 1.0$, $w_1 = 0.5$, $b_1 = 0.0$, $w_2 = 0.8$, $b_2 = 0.0$, learning rate $\eta = 0.1$.
- **Step-by-Step Trace:**
  1. **Forward Pass:**
     - Hidden pre-activation: $z_1 = w_1 x + b_1 = 0.5(1.0) + 0 = 0.5$.
     - Hidden activation: $a_1 = \tanh(0.5) \approx 0.462$.
     - Output prediction: $\hat{y} = w_2 a_1 + b_2 = 0.8(0.462) + 0 = 0.370$.
  2. **Loss:** $L = \frac{1}{2}(0.370 - 1.0)^2 = \frac{1}{2}(-0.630)^2 \approx 0.198$.
  3. **Backward Pass (Chain Rule):**
     - Output error gradient: $\delta_2 = \hat{y} - y = -0.630$.
     - Output weight gradient: $\frac{\partial L}{\partial w_2} = \delta_2 \cdot a_1 = (-0.630)(0.462) \approx -0.291$.
     - Hidden gradient: $\delta_1 = \delta_2 \cdot w_2 \cdot (1 - a_1^2) = (-0.630)(0.8)(1 - 0.462^2) \approx -0.396$.
     - Input weight gradient: $\frac{\partial L}{\partial w_1} = \delta_1 \cdot x = -0.396$.
  4. **Weight Update:** $w_2^{\text{new}} = 0.8 - 0.1(-0.291) = 0.829$, $w_1^{\text{new}} = 0.5 - 0.1(-0.396) = 0.540$.

### 9. K-Means Clustering
- **Toy Dataset (4 points, $K = 2$ clusters):**
  - $A = (1, 1)$, $B = (1, 3)$, $C = (5, 1)$, $D = (5, 3)$
- **Initial Centroids:** $\mu_1 = (1, 1)$, $\mu_2 = (5, 1)$.
- **Step-by-Step Trace:**
  1. **Assignment Step (Squared Euclidean distance to $\mu_1, \mu_2$):**
     - $A(1,1)$: $d^2(\mu_1)=0$, $d^2(\mu_2)=16 \rightarrow$ Cluster 1
     - $B(1,3)$: $d^2(\mu_1)=4$, $d^2(\mu_2)=20 \rightarrow$ Cluster 1
     - $C(5,1)$: $d^2(\mu_1)=16$, $d^2(\mu_2)=0 \rightarrow$ Cluster 2
     - $D(5,3)$: $d^2(\mu_1)=20$, $d^2(\mu_2)=4 \rightarrow$ Cluster 2
  2. **Update Step (Recompute cluster means):**
     - $\mu_1^{\text{new}} = \left(\frac{1+1}{2}, \frac{1+3}{2}\right) = (1, 2)$
     - $\mu_2^{\text{new}} = \left(\frac{5+5}{2}, \frac{1+3}{2}\right) = (5, 2)$
  3. **Compute Inertia (WCSS):**
     - Cluster 1: $(1-1)^2+(1-2)^2 + (1-1)^2+(3-2)^2 = 1 + 1 = 2$
     - Cluster 2: $(5-5)^2+(1-2)^2 + (5-5)^2+(3-2)^2 = 1 + 1 = 2$
     - Total Inertia $= 2 + 2 = 4.0$ (converged; assignments do not change on Iteration 2).

### 10. Principal Component Analysis (PCA)
- **Toy Dataset (4 centered 2D points):**
  - $(-2, -1)$, $(-1, -1)$, $(1, 1)$, $(2, 1)$ (already zero-mean: $\bar{x}=0, \bar{y}=0$).
- **Step-by-Step Trace:**
  1. **Compute $2 \times 2$ Covariance Matrix $\Sigma = \frac{1}{n-1} X^T X$ ($n=4$, denominator $n-1=3$):**
     - $\text{Var}(x) = \frac{(-2)^2 + (-1)^2 + 1^2 + 2^2}{3} = \frac{10}{3} \approx 3.333$
     - $\text{Var}(y) = \frac{(-1)^2 + (-1)^2 + 1^2 + 1^2}{3} = \frac{4}{3} \approx 1.333$
     - $\text{Cov}(x, y) = \frac{(-2)(-1) + (-1)(-1) + (1)(1) + (2)(1)}{3} = \frac{6}{3} = 2.000$
     - $\Sigma = \begin{bmatrix} 3.333 & 2.000 \\ 2.000 & 1.333 \end{bmatrix}$
  2. **Eigenvalues ($\det(\Sigma - \lambda I) = 0$):**
     - Trace $= 4.667$, Determinant $= (3.333)(1.333) - 4 = 0.444$.
     - $\lambda_1 \approx 4.570$, $\lambda_2 \approx 0.097$.
  3. **Explained Variance Ratio:**
     - $\text{PC1 captures } \frac{4.570}{4.570 + 0.097} = 97.9\%$ of total variance; $\text{PC2 captures } 2.1\%$.
  4. **1D Projection:** Projecting $(2, 1)$ onto unit eigenvector $\mathbf{v}_1 \approx [0.851, 0.526]^T$ gives scalar coordinate $z_1 = 2(0.851) + 1(0.526) = 2.228$.