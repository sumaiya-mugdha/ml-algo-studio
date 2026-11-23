# ML Algo Studio — Post-Merge Roadmap (Algorithms & Features to Add Later)

This roadmap lists the **20 Coming Soon algorithms** shown in the Visualizations Gallery and the **future platform features** planned after the Master Project merge.

---

## 1. Currently Live in Studio (11 Interactive Engines)
1. **Linear Regression (OLS & Polynomial)**
2. **Logistic Regression**
3. **Support Vector Machine (SVM — Linear & RBF)**
4. **K-Nearest Neighbors (KNN)**
5. **Gaussian Naive Bayes**
6. **Decision Tree (CART)**
7. **Random Forest**
8. **Gradient Boosting**
9. **Neural Network (MLP)**
10. **K-Means Clustering**
11. **Principal Component Analysis (PCA)**

---

## 2. Coming Soon Algorithms to Build Next (20 Topics)

### Foundations (5)
- **What Is a Model?** — Draggable line handles on noisy points; *Break It*: force a line onto circular data.
- **Loss Functions (MSE vs. MAE)** — Live toggle between L2 and L1 residuals; *Break It*: drag a single extreme outlier.
- **Gradient Descent (2D Contour Surface)** — Roll a point down a loss valley with adjustable step size; *Break It*: set learning rate too high to trigger divergence.
- **Optimizers Race (SGD · Momentum · RMSProp · Adam)** — Race multiple optimizers on Rosenbrock & Saddle surfaces; *Break It*: stall vanilla SGD on a flat saddle point.
- **Overfitting & Underfitting** — Classic U-shaped train vs. validation error curve across complexity degrees; *Break It*: degree-15 curve on 8 points.

### Regression & Regularization (5)
- **Polynomial Regression (Dedicated Basis Explorer)** — Feature expansion & extrapolation outside training range; *Break It*: Runge oscillation at edges.
- **Bias–Variance Tradeoff** — Resample 50 training sets and overlay spread of fitted curves; *Break It*: unregularized high-variance spline.
- **Ridge Regression (L2)** — Circular L2 constraint ball shrinking coefficients as lambda grows; *Break It*: massive lambda collapsing fit to a flat mean.
- **Lasso Regression (L1)** — Diamond L1 constraint driving weak weights exactly to zero; *Break It*: correlated twin features.
- **Elastic Net** — Blend L1 and L2 penalties via `l1_ratio` slider; *Break It*: excessive combined shrinkage.

### Classification (2)
- **Decision Boundaries (4-Way Arena)** — Compare Logistic, KNN, SVM, and Decision Tree side-by-side on Moons, Circles, and Spirals.
- **The Kernel Trick (3D Projection)** — Lift concentric 2D circles into 3D (`z = x^2 + y^2`) and slice with a flat plane.

### Ensembles (2)
- **Bagging (Bootstrap Aggregating)** — Step through individual bootstrap samples and watch the averaged boundary smooth out.
- **AdaBoost** — Watch misclassified points grow in size as sample weights inflate round-by-round; *Break It*: inject flipped label noise.

### Unsupervised & Manifolds (2)
- **DBSCAN** — Density clustering with adjustable `epsilon` radius and `MinPts` that discovers crescent shapes and flags noise; *Break It*: variable-density clusters.
- **t-SNE** — Interactive perplexity slider untangling high-dimensional clusters into 2D; *Break It*: misreading inter-cluster distance at low perplexity.

### Neural Networks & Deep Learning (4)
- **The Perceptron** — Single neuron solving AND/OR gates; *Break It*: Minsky–Papert XOR gate failure.
- **Activation Functions** — Compare Sigmoid, Tanh, ReLU, Leaky ReLU, and GELU alongside live derivatives; *Break It*: vanishing gradient at saturated inputs.
- **Backpropagation** — Step-by-step forward and backward chain-rule pass through a small computational graph.
- **Attention Mechanism** — Click tokens in a sentence to inspect Query–Key–Value attention weights and softmax temperature; *Break It*: extreme temperature flattening attention.

---

## 3. Future Platform Features to Add Later
- **Model Evaluation Lab** — Interactive Confusion Matrix, ROC/AUC curve, Precision–Recall curve, and live decision threshold slider.
- **Data Prep & Validation Lab** — Feature Scaling (StandardScaler vs. MinMaxScaler), Train/Test Split, and K-Fold Cross-Validation visualizer.
- **Interactive Checkpoints in Learning Path** — Short 2-question "Predict what happens before you click" checks after each stage, saved in `localStorage`.
- **Drag-and-Drop CSV / JSON Import & PNG Snapshot Export** — Drop a custom 2D CSV directly onto the canvas and export clean publication-ready PNG/SVG snapshots.
- **Guided Preset Challenges** — Timed or step-by-step debugging puzzles ("Fix this overfitting tree in 2 clicks").
- **Side-by-Side 4-Model Arena** — Extend Duel Mode (2 models) to a 2x2 grid for instant visual comparison.
