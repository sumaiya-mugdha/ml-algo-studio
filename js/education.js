/**
 * ML Algo Studio — Educational Layer Module
 * Renders textbook-quality mathematical theory, hand-traces, code blocks,
 * complexity analyses, and experiment breakdowns for all 11 algorithms.
 */

(function () {
  'use strict';

  const EDUCATION_DATA = {
    linear_reg: {
      id: 'linear_reg',
      title: 'Linear Regression (OLS & Gradient Descent)',
      category: 'Supervised Regression',
      difficulty: 'Beginner',
      summary: 'Linear Regression models the relationship between an independent input feature $x$ and a continuous dependent target $y$ by fitting a straight line $\\hat{y} = w x + b$. It serves as the bedrock of statistical learning and parameter optimization.',
      prerequisites: [
        'Slope-Intercept Line ($y = mx + b$)',
        'Summation Notation ($\\sum$)',
        'Sample Mean & Variance'
      ],
      math: {
        intro: 'The objective is to find parameter weights that minimize the total discrepancy between true target values $y_i$ and model predictions $\\hat{y}_i$.',
        equations: [
          {
            name: 'Hypothesis Function',
            latex: '\\hat{y}_i = w x_i + b',
            description: 'Computes the continuous predicted target value for any given input point $x_i$, parameterized by slope $w$ and y-intercept $b$.',
            canvasConnection: 'The solid blue line crossing the 2D coordinate plane.'
          },
          {
            name: 'Mean Squared Error (MSE Loss)',
            latex: 'J(w, b) = \\frac{1}{N} \\sum_{i=1}^{N} \\left(y_i - (w x_i + b)\\right)^2',
            description: 'Calculates the average squared vertical distance from each observed data point to the predicted regression line.',
            canvasConnection: 'The vertical dotted red/orange residual lines connecting each data point to the regression line.'
          },
          {
            name: 'OLS Closed-Form Solution (Normal Equation)',
            latex: 'w = \\frac{\\sum_{i=1}^{N}(x_i - \\bar{x})(y_i - \\bar{y})}{\\sum_{i=1}^{N}(x_i - \\bar{x})^2} = \\frac{\\text{Cov}(X, Y)}{\\text{Var}(X)}, \\quad b = \\bar{y} - w \\bar{x}',
            description: 'Calculates the exact global optimal parameters in a single mathematical step by setting the analytical partial derivatives of $J(w, b)$ to zero.',
            canvasConnection: 'The instant solution rendered when the Regression Solver is set to "Exact (OLS)".'
          },
          {
            name: 'Gradient Descent Parameter Updates',
            latex: 'w \\leftarrow w + \\alpha \\frac{2}{N} \\sum_{i=1}^N (y_i - \\hat{y}_i) x_i, \\quad b \\leftarrow b + \\alpha \\frac{2}{N} \\sum_{i=1}^N (y_i - \\hat{y}_i)',
            description: 'Iteratively refines parameters by stepping proportionally in the opposite direction of the gradient vector, scaled by learning rate $\\alpha$.',
            canvasConnection: 'Watch the line rotate and translate step-by-step toward the points when clicking "Step" or "Train" in GD mode.'
          }
        ],
        handTrace: {
          title: 'Trace It by Hand (Exact Step-by-Step OLS Walkthrough)',
          description: 'Let us calculate the exact Ordinary Least Squares regression line by hand for the fixed 4-point sample: $(1, 2)$, $(2, 3)$, $(3, 5)$, $(4, 6)$ where $N = 4$.',
          points: [
            { x: 1, y: 2 },
            { x: 2, y: 3 },
            { x: 3, y: 5 },
            { x: 4, y: 6 }
          ],
          steps: [
            {
              step: 'Step 1: Compute Sample Means',
              heading: 'Calculate the central averages \\(\\bar{x}\\) and \\(\\bar{y}\\)',
              latex: '\\bar{x} = \\frac{1 + 2 + 3 + 4}{4} = \\frac{10}{4} = 2.5, \\quad \\bar{y} = \\frac{2 + 3 + 5 + 6}{4} = \\frac{16}{4} = 4.0'
            },
            {
              step: 'Step 2: Compute Coordinate Deviations from Mean',
              heading: 'Calculate centered coordinates \\((x_i - \\bar{x})\\) and \\((y_i - \\bar{y})\\)',
              latex: '\\begin{aligned} x - \\bar{x} &= [1 - 2.5,\\; 2 - 2.5,\\; 3 - 2.5,\\; 4 - 2.5] = [-1.5,\\; -0.5,\\; 0.5,\\; 1.5] \\\\ y - \\bar{y} &= [2 - 4.0,\\; 3 - 4.0,\\; 5 - 4.0,\\; 6 - 4.0] = [-2.0,\\; -1.0,\\; 1.0,\\; 2.0] \\end{aligned}'
            },
            {
              step: 'Step 3: Compute Numerator (Covariance Sum) and Denominator (Variance Sum)',
              heading: 'Calculate cross-product sums and squared input deviations',
              latex: '\\begin{aligned} \\sum (x_i - \\bar{x})(y_i - \\bar{y}) &= (-1.5)(-2.0) + (-0.5)(-1.0) + (0.5)(1.0) + (1.5)(2.0) = 3.0 + 0.5 + 0.5 + 3.0 = 7.0 \\\\ \\sum (x_i - \\bar{x})^2 &= (-1.5)^2 + (-0.5)^2 + (0.5)^2 + (1.5)^2 = 2.25 + 0.25 + 0.25 + 2.25 = 5.0 \\end{aligned}'
            },
            {
              step: 'Step 4: Compute Slope (w) and Intercept (b)',
              heading: 'Derive the optimal linear parameters',
              latex: 'w = \\frac{7.0}{5.0} = 1.4, \\quad b = \\bar{y} - w \\bar{x} = 4.0 - (1.4 \\times 2.5) = 4.0 - 3.5 = 0.5 \\implies \\hat{y} = 1.4 x + 0.5'
            },
            {
              step: 'Step 5: Compute Residuals (r_i = y_i - \\hat{y}_i), SSE, MSE, and R²',
              heading: 'Evaluate model fit and sum of squared errors',
              latex: '\\begin{aligned} \\hat{y} &= [1.4(1)+0.5,\\; 1.4(2)+0.5,\\; 1.4(3)+0.5,\\; 1.4(4)+0.5] = [1.9,\\; 3.3,\\; 4.7,\\; 6.1] \\\\ r_i &= [2 - 1.9,\\; 3 - 3.3,\\; 5 - 4.7,\\; 6 - 6.1] = [+0.1,\\; -0.3,\\; +0.3,\\; -0.1] \\quad (\\textstyle\\sum r_i = 0) \\\\ \\text{SSE} &= (0.1)^2 + (-0.3)^2 + (0.3)^2 + (-0.1)^2 = 0.01 + 0.09 + 0.09 + 0.01 = 0.20 \\\\ \\text{MSE} &= \\frac{\\text{SSE}}{N} = \\frac{0.20}{4} = 0.05, \\quad \\text{SST} = \\sum(y_i - \\bar{y})^2 = 10.0 \\implies R^2 = 1 - \\frac{0.20}{10.0} = 0.98 \\end{aligned}'
            }
          ]
        }
      },
      experiments: [
        {
          title: 'High-Leverage Outlier Sensitivity',
          tag: 'Outlier Vulnerability',
          setup: 'Keep the "Linear + Noise" preset, then click on the canvas to place a single lone point far away at (4.5, -4.0).',
          whatBreaks: 'The fitted regression line pivots aggressively downward, completely misaligning with the dense cluster of authentic points.',
          whyItBreaks: 'Ordinary Least Squares squares every error term: $(y_i - \\hat{y}_i)^2$. A point with an error of 8 generates a loss penalty of 64—equivalent to 64 points with error 1. To minimize the overall sum of squares, OLS is mathematically coerced into rotating the line toward the outlier.'
        },
        {
          title: 'Gradient Descent Learning Rate Divergence',
          tag: 'Optimization Failure',
          setup: 'Switch Regression Solver to "Gradient Descent (Step-by-Step)", slide Step Size (Learning Rate) to 0.40, and click "Train".',
          whatBreaks: 'The fitted line oscillates violently back and forth, slanting steeply across the canvas, while the MSE metric surges toward infinity.',
          whyItBreaks: 'The MSE loss surface is a quadratic paraboloid with curvature determined by the eigenvalues of $X^T X$. When learning rate $\\alpha > 2 / \\lambda_{\\max}$, the parameter update overshoots the minimum by a distance greater than the current error, triggering catastrophic exponential divergence.'
        }
      ],
      code: {
        filename: 'linear_regression.py',
        snippet: `import numpy as np
from sklearn.linear_model import LinearRegression

# 1. Exact Analytical OLS Solution (Pure NumPy)
def fit_linear_ols(x: np.ndarray, y: np.ndarray):
    """
    Computes exact OLS parameters w (slope) and b (intercept).
    x: 1D array of input features
    y: 1D array of target values
    """
    x_mean = np.mean(x)
    y_mean = np.mean(y)
    
    # Analytical normal equation for 1D: w = Cov(x, y) / Var(x)
    numerator = np.sum((x - x_mean) * (y - y_mean))
    denominator = np.sum((x - x_mean) ** 2)
    
    w = numerator / denominator
    b = y_mean - w * x_mean
    return w, b

# 2. Iterative Batch Gradient Descent Solution
def fit_linear_gd(x: np.ndarray, y: np.ndarray, lr: float = 0.05, epochs: int = 100):
    w, b = 0.0, 0.0
    N = len(x)
    for _ in range(epochs):
        y_pred = w * x + b
        # Derivatives of MSE: d/dw and d/db
        dw = (-2.0 / N) * np.sum((y - y_pred) * x)
        db = (-2.0 / N) * np.sum(y - y_pred)
        
        w -= lr * dw
        b -= lr * db
    return w, b

# 3. Scikit-Learn Reference Comparison
if __name__ == "__main__":
    X = np.array([[1.0], [2.0], [3.0], [4.0]])
    y = np.array([2.0, 3.0, 5.0, 6.0])
    
    w, b = fit_linear_ols(X.ravel(), y)
    print(f"NumPy OLS:  y = {w:.2f}x + {b:.2f}")
    
    model = LinearRegression().fit(X, y)
    print(f"Scikit OLS: y = {model.coef_[0]:.2f}x + {model.intercept_:.2f}")
    print(f"R² Score:   {model.score(X, y):.4f}")`
      },
      complexity: [
        {
          stage: 'Training (OLS Closed-Form)',
          time: '$\\mathcal{O}(N)$',
          space: '$\\mathcal{O}(1)$',
          notes: 'Requires only single-pass summations of $x_i$, $y_i$, $x_i^2$, and $x_i y_i$ for 1D.'
        },
        {
          stage: 'Training (General Matrix OLS)',
          time: '$\\mathcal{O}(N D^2 + D^3)$',
          space: '$\\mathcal{O}(D^2)$',
          notes: 'Inverting $(X^T X)$ takes cubic time in number of feature dimensions $D$.'
        },
        {
          stage: 'Training (Gradient Descent)',
          time: '$\\mathcal{O}(\\text{epochs} \\cdot N)$',
          space: '$\\mathcal{O}(1)$',
          notes: 'Each epoch scans all $N$ data points to accumulate parameter gradients.'
        },
        {
          stage: 'Prediction',
          time: '$\\mathcal{O}(1)$',
          space: '$\\mathcal{O}(1)$',
          notes: 'One scalar multiplication and addition: $\\hat{y} = w x + b$.'
        }
      ],
      faq: [
        {
          q: 'Why does Linear Regression minimize vertical distance rather than perpendicular distance?',
          a: 'Ordinary Least Squares treats the input $x$ as an independent, deterministic variable measured without error, assuming noise exists solely in the target observation $y$. Minimizing orthogonal (perpendicular) distance treats $x$ and $y$ symmetrically, which is the exact mathematical formulation of Principal Component Analysis (PCA).'
        },
        {
          q: 'When should Gradient Descent be chosen over the exact OLS Normal Equation?',
          a: 'While OLS is instantaneous for 1D or small feature counts, computing $(X^T X)^{-1}$ requires $O(D^3)$ arithmetic operations. When dealing with tens of thousands of features ($D > 10^4$) or streaming datasets that exceed system RAM, Gradient Descent or Mini-Batch SGD is vastly faster and more memory efficient.'
        },
        {
          q: 'Can the R² (Coefficient of Determination) score ever be negative?',
          a: 'Yes. $R^2 = 1 - \\frac{\\text{SSE}}{\\text{SST}}$. A baseline model predicting the mean $\\bar{y}$ has an $R^2$ of 0. If a regression model is tested on unseen out-of-sample data, or if fitted without an intercept, its predictions can be worse than predicting the mean ($\text{SSE} > \text{SST}$), resulting in a negative $R^2$.'
        },
        {
          q: 'Does a correlation coefficient of zero imply that two variables have no relationship?',
          a: 'No. Pearson correlation and linear regression detect strictly linear relationships. For example, if $y = x^2$ sampled symmetrically on $[-3, 3]$, $y$ is completely and deterministically dependent on $x$, but the linear slope and correlation coefficient are exactly 0.0.'
        }
      ],
      related: [
        {
          id: 'logistic_reg',
          name: 'Logistic Regression',
          badge: 'Binary Classification',
          reason: 'Passes the linear equation $z = w x + b$ through the nonlinear sigmoid function $\\sigma(z)$ to predict calibrated probabilities for classification.'
        },
        {
          id: 'pca',
          name: 'Principal Component Analysis (PCA)',
          badge: 'Dimensionality Reduction',
          reason: 'Finds the direction of maximum variance by minimizing perpendicular (orthogonal) projection distances rather than vertical target errors.'
        }
      ]
    },
    logistic_reg: {
      id: 'logistic_reg',
      title: 'Logistic Regression (Binary Classification)',
      category: 'Supervised Classification (Probabilistic)',
      difficulty: 'Beginner',
      summary: 'Logistic Regression models binary categorical outcomes by passing an affine linear combination of features through the nonlinear sigmoid (logistic) link function. It is the foundational baseline for probability estimation, clinical trials, and credit risk assessment.',
      prerequisites: [
        'Linear Combinations ($z = \\mathbf{w}^T \\mathbf{x} + b$)',
        'Sigmoid Function ($\\sigma(z) = \\frac{1}{1 + e^{-z}}$)',
        'Binary Cross-Entropy (Log-Loss)',
        'Gradient Descent Optimization'
      ],
      math: {
        intro: 'Unlike Linear Regression which predicts unbounded continuous values, Logistic Regression maps raw scores $z \\in (-\\infty, +\\infty)$ onto calibrated probabilities $P(y=1|\\mathbf{x}) \\in (0, 1)$ using the S-shaped sigmoid curve.',
        equations: [
          {
            name: 'Sigmoid Hypothesis Function',
            latex: 'P(y=1|\\mathbf{x}) = \\sigma(z) = \\frac{1}{1 + e^{-(\\mathbf{w}^T \\mathbf{x} + b)}} = \\frac{1}{1 + e^{-(w_1 x_1 + w_2 x_2 + b)}}',
            description: 'Computes the posterior probability that point $\\mathbf{x}$ belongs to Class 1. When $z = 0$, $\\sigma(0) = 0.5$, marking the decision threshold.',
            canvasConnection: 'The background color saturation shows class confidence; the central white line marks $P(y=1) = 0.5$.'
          },
          {
            name: 'Binary Cross-Entropy Loss (Log-Loss)',
            latex: 'J(\\mathbf{w}, b) = -\\frac{1}{N} \\sum_{i=1}^N \\left[ y_i \\ln(\\hat{y}_i) + (1 - y_i) \\ln(1 - \\hat{y}_i) \\right]',
            description: 'Penalizes confident misclassifications logarithmically: if true label is 1 but $\\hat{y} \\to 0$, the penalty surges toward $+\\infty$.',
            canvasConnection: 'Reflected in the "Log Loss" readout in the metrics panel and the live loss curve chart during training.'
          },
          {
            name: 'Analytical Gradient Descent Updates',
            latex: '\\frac{\\partial J}{\\partial w_j} = \\frac{1}{N} \\sum_{i=1}^N (\\hat{y}_i - y_i) x_{ij}, \\quad \\mathbf{w} \\leftarrow \\mathbf{w} - \\alpha \\nabla_{\\mathbf{w}} J',
            description: 'The gradient takes the exact same form as linear regression, but the residual $(\\hat{y}_i - y_i)$ is now between probability and binary label.',
            canvasConnection: 'Clicking "Step" or "Train" updates the weights, pivoting and translating the boundary line.'
          },
          {
            name: 'Linear Decision Boundary Equation',
            latex: 'w_1 x_1 + w_2 x_2 + b = 0 \\implies x_2 = -\\frac{w_1}{w_2} x_1 - \\frac{b}{w_2}',
            description: 'The decision boundary is strictly a straight 1D hyperplane in 2D space where predicted log-odds equal zero.',
            canvasConnection: 'The solid dividing line separating the blue and orange shaded regions on canvas.'
          }
        ],
        handTrace: {
          title: 'Trace It by Hand (Logistic Regression Step Walkthrough)',
          description: 'Step-by-step hand calculation of forward logit, sigmoid probability, cross-entropy loss, and gradient descent update for 4 points with initial parameters $w = 1.0, b = 0.0$ and learning rate $\\alpha = 0.5$.',
          points: [
            { text: 'x_1 = -2, y_1 = 0' },
            { text: 'x_2 = -1, y_2 = 0' },
            { text: 'x_3 = 1, y_3 = 1' },
            { text: 'x_4 = 2, y_4 = 1' }
          ],
          steps: [
            {
              step: 'Step 1: Compute Linear Logits (z_i = w x_i + b)',
              heading: 'Calculate pre-activation scores across all points',
              latex: '\\begin{aligned} z_1 &= 1.0(-2) + 0 = -2.0, \\quad z_2 = 1.0(-1) + 0 = -1.0 \\\\ z_3 &= 1.0(1) + 0 = +1.0, \\quad z_4 = 1.0(2) + 0 = +2.0 \\\\ \\mathbf{z} &= [-2.0,\\; -1.0,\\; +1.0,\\; +2.0] \\end{aligned}'
            },
            {
              step: 'Step 2: Apply Sigmoid Function (\\hat{p}_i = \\sigma(z_i))',
              heading: 'Convert linear logits into posterior class probabilities',
              latex: '\\begin{aligned} \\hat{p}_1 &= \\sigma(-2) = \\frac{1}{1 + e^{2}} \\approx 0.119 \\\\ \\hat{p}_2 &= \\sigma(-1) = \\frac{1}{1 + e^{1}} \\approx 0.269 \\\\ \\hat{p}_3 &= \\sigma(1) = \\frac{1}{1 + e^{-1}} \\approx 0.731 \\\\ \\hat{p}_4 &= \\sigma(2) = \\frac{1}{1 + e^{-2}} \\approx 0.881 \\end{aligned}'
            },
            {
              step: 'Step 3: Evaluate Cross-Entropy Loss on Sample x_3 & Total Sample Loss',
              heading: 'Calculate negative log-likelihood on sample 3 and average loss',
              latex: '\\begin{aligned} L_3 &= -\\left[1 \\cdot \\ln(\\hat{p}_3) + 0 \\cdot \\ln(1 - \\hat{p}_3)\\right] = -\\ln(0.731) \\approx 0.313 \\\\ L_1 &= -\\ln(1 - 0.119) \\approx 0.127, \\quad L_2 = -\\ln(1 - 0.269) \\approx 0.313, \\quad L_4 = -\\ln(0.881) \\approx 0.127 \\\\ J(w, b) &= \\frac{1}{4}(0.127 + 0.313 + 0.313 + 0.127) = \\frac{0.880}{4} \\approx 0.220 \\end{aligned}'
            },
            {
              step: 'Step 4: Compute Gradient and Parameter Update on Sample x_3',
              heading: 'Execute analytical gradient descent step for slope w and intercept b',
              latex: '\\begin{aligned} \\frac{\\partial L_3}{\\partial w} &= (\\hat{p}_3 - y_3) x_3 = (0.731 - 1.0)(1.0) = -0.269 \\\\ \\frac{\\partial L_3}{\\partial b} &= (\\hat{p}_3 - y_3) = (0.731 - 1.0) = -0.269 \\\\ w_{\\text{new}} &= w - \\alpha \\frac{\\partial L_3}{\\partial w} = 1.0 - 0.5(-0.269) = 1.0 + 0.135 = 1.135 \\\\ b_{\\text{new}} &= b - \\alpha \\frac{\\partial L_3}{\\partial b} = 0.0 - 0.5(-0.269) = 0.0 + 0.135 = 0.135 \\end{aligned}'
            }
          ]
        }
      },
      experiments: [
        {
          title: 'Linearly Inseparable Data (Two Moons & XOR)',
          tag: 'Underfitting Boundary',
          setup: 'Switch Dataset Preset to "Two Moons (Curved)" or "XOR Quadrants" and train Logistic Regression.',
          whatBreaks: 'The model plateaus near 75% accuracy on Moons and 50% on XOR, unable to separate the intertwined classes.',
          whyItBreaks: 'Logistic Regression possesses a strictly linear inductive bias ($w_1 x_1 + w_2 x_2 + b = 0$). Because its decision boundary is an affine hyperplane, it cannot curve around crescent moons or isolate opposing diagonal quadrants without polynomial feature expansions.'
        },
        {
          title: 'Complete Separation & Weight Explosion',
          tag: 'Numerical Saturation',
          setup: 'Switch to "Linearly Separable", erase overlapping points to create an empty buffer, and train for 200+ steps.',
          whatBreaks: 'Log loss continues drifting downward toward zero, but parameter weights $(\\|\\mathbf{w}\\|)$ grow excessively large, turning the smooth probability transition into an abrupt cliff.',
          whyItBreaks: 'When classes are perfectly separable, $\\hat{y}_i \\to y_i$ only when $z_i \\to \\pm\\infty$. Unregularized cross-entropy drives weights toward infinity to make the sigmoid slope infinitely steep, which causes numerical instability.'
        }
      ],
      code: {
        filename: 'logistic_regression.py',
        snippet: `import numpy as np
from sklearn.linear_model import LogisticRegression

# 1. Pure NumPy Logistic Regression with Gradient Descent
def sigmoid(z: np.ndarray) -> np.ndarray:
    return 1.0 / (1.0 + np.exp(-np.clip(z, -500, 500)))

def train_logistic_regression(X: np.ndarray, y: np.ndarray, lr: float = 0.1, epochs: int = 300):
    N, D = X.shape
    w = np.zeros(D)
    b = 0.0
    
    for epoch in range(epochs):
        z = np.dot(X, w) + b
        y_hat = sigmoid(z)
        
        # Binary cross-entropy gradient
        dw = (1.0 / N) * np.dot(X.T, (y_hat - y))
        db = (1.0 / N) * np.sum(y_hat - y)
        
        w -= lr * dw
        b -= lr * db
        
    return w, b

# 2. Scikit-Learn Comparison
if __name__ == "__main__":
    X = np.array([[-1.8, 1.5], [-1.2, 1.1], [1.8, -1.5], [1.2, -1.1]])
    y = np.array([0, 0, 1, 1])
    
    w, b = train_logistic_regression(X, y, lr=0.2, epochs=500)
    print(f"NumPy Model:  w = {w.round(3)}, b = {b:.3f}")
    
    sk_model = LogisticRegression(penalty=None).fit(X, y)
    print(f"Scikit Model: w = {sk_model.coef_[0].round(3)}, b = {sk_model.intercept_[0]:.3f}")`
      },
      complexity: [
        {
          stage: 'Training (Batch Gradient Descent)',
          time: '$\\mathcal{O}(\\text{epochs} \\cdot N \\cdot D)$',
          space: '$\\mathcal{O}(D)$',
          notes: 'Each epoch computes forward dot products and gradients over all $N$ data points.'
        },
        {
          stage: 'Training (L-BFGS / Newton-Raphson)',
          time: '$\\mathcal{O}(\\text{iters} \\cdot (N D^2 + D^3))$',
          space: '$\\mathcal{O}(D^2)$',
          notes: 'Second-order Hessian optimization converges in fewer steps but takes cubic time in features.'
        },
        {
          stage: 'Prediction (Inference)',
          time: '$\\mathcal{O}(D)$',
          space: '$\\mathcal{O}(1)$',
          notes: 'One vector dot product $\\mathbf{w}^T \\mathbf{x} + b$ followed by scalar sigmoid evaluation.'
        }
      ],
      faq: [
        {
          q: 'Why use Cross-Entropy Log-Loss instead of Mean Squared Error (MSE)?',
          a: 'Squaring the difference between labels and the non-linear sigmoid $(y - \\sigma(z))^2$ produces a non-convex loss surface with numerous local plateaus where gradients vanish to zero. Log-loss is mathematically guaranteed to be strictly convex, ensuring gradient descent always finds the unique global optimum.'
        },
        {
          q: 'What is the relationship between Odds, Log-Odds, and Probability?',
          a: 'Probability $P \\in (0, 1)$ expresses chance. The Odds ratio is $\\frac{P}{1 - P} \\in (0, +\\infty)$. Log-Odds (or logit) is $\\ln\\left(\\frac{P}{1 - P}\\right) = \\mathbf{w}^T \\mathbf{x} + b \\in (-\\infty, +\\infty)$, transforming bounded probability into an unbounded linear scale.'
        },
        {
          q: 'How does the Query Probe in the Studio evaluate a test point?',
          a: 'When you click on the canvas in "Test Query" mode, the model computes $z = w_1 x_1 + w_2 x_2 + b$, evaluates $\\hat{p} = \\sigma(z)$, and reports the exact percentage probability for Class 1 ($\hat{p}$) vs Class 0 ($1 - \\hat{p}$).'
        },
        {
          q: 'How does Logistic Regression handle more than 2 classes?',
          a: 'Multi-class classification is handled either via One-vs-Rest (OvR), training $C$ independent binary models, or Multinomial Softmax regression (Cross-Entropy), where $P(y=c|\\mathbf{x}) = \\frac{e^{\\mathbf{w}_c^T \\mathbf{x}}}{\\sum_k e^{\\mathbf{w}_k^T \\mathbf{x}}}$.'
        }
      ],
      related: [
        {
          id: 'svm',
          name: 'Linear Support Vector Machine (SVM)',
          badge: 'Max-Margin Classification',
          reason: 'Uses hinge loss to optimize the widest street (margin) between classes rather than predicting probabilistic calibration.'
        },
        {
          id: 'neural_net',
          name: 'Neural Network (MLP)',
          badge: 'Nonlinear Classification',
          reason: 'Stacks multiple logistic or tanh layers together to bend and curve decision boundaries around complex datasets like Two Moons.'
        },
        {
          id: 'linear_reg',
          name: 'Linear Regression',
          badge: 'Continuous Regression',
          reason: 'The linear ancestor of logistic regression; uses an identical linear combination but predicts real numbers instead of probabilities.'
        }
      ]
    },
    svm: {
      id: 'svm',
      title: 'Linear Support Vector Machine (SVM)',
      category: 'Supervised Classification (Max-Margin)',
      difficulty: 'Intermediate',
      summary: 'Linear SVM seeks the unique separating hyperplane that maximizes the geometric margin—the perpendicular distance between the decision boundary and the closest data points (Support Vectors). It provides strong generalization guarantees rooted in Vapnik-Chervonenkis (VC) dimension theory.',
      prerequisites: [
        'Hyperplane Geometry ($\\mathbf{w}^T \\mathbf{x} + b = 0$)',
        'Euclidean Norm (\\|\\mathbf{w}\\|)',
        'Hinge Loss & Convex Penalties',
        'Constrained Optimization (Primal vs Dual)'
      ],
      math: {
        intro: 'While Logistic Regression shifts its boundary in response to all data points, Linear SVM isolates the most informative border samples. Points far from the margin exert zero gradient force.',
        equations: [
          {
            name: 'Geometric Margin Formula',
            latex: '\\text{Margin Width} = \\frac{2}{\\|\\mathbf{w}\\|_2} = \\frac{2}{\\sqrt{w_1^2 + w_2^2}}',
            description: 'Maximizing the margin width is mathematically equivalent to minimizing the squared Euclidean norm $\\frac{1}{2} \\|\\mathbf{w}\\|^2$.',
            canvasConnection: 'The width of the clear corridor bounded by the two dashed parallel margin lines.'
          },
          {
            name: 'Soft-Margin Hinge Loss Objective',
            latex: '\\min_{\\mathbf{w}, b} \\; \\frac{1}{2} \\|\\mathbf{w}\\|^2 + C \\sum_{i=1}^N \\max\\left(0, \\; 1 - y_i (\\mathbf{w}^T \\mathbf{x}_i + b)\\right)',
            description: 'Penalizes margin violations with hinge loss where $y_i \\in \\{-1, +1\\}$. Hyperparameter $C$ balances maximum margin width against penalty for margin intruders.',
            canvasConnection: 'The "Penalty Weight (C)" slider in the controls rail tunes this trade-off in real time.'
          },
          {
            name: 'Subgradient Descent Parameter Update',
            latex: '\\mathbf{w} \\leftarrow \\begin{cases} \\mathbf{w} - \\alpha (\\mathbf{w} - C y_i \\mathbf{x}_i) & \\text{if } y_i (\\mathbf{w}^T \\mathbf{x}_i + b) < 1 \\\\ \\mathbf{w} - \\alpha \\mathbf{w} & \\text{if } y_i (\\mathbf{w}^T \\mathbf{x}_i + b) \\ge 1 \\end{cases}',
            description: 'If a point is correctly classified outside the margin gutter, it only undergoes L2 weight decay. Only margin violators push the hyperplane.',
            canvasConnection: 'Watch the dashed gutters shift when training; points with rings are the active support vectors.'
          },
          {
            name: 'Linear Decision Boundary Rule',
            latex: 'f(\\mathbf{x}) = \\operatorname{sign}(\\mathbf{w}^T \\mathbf{x} + b)',
            description: 'A point is classified as $+1$ if $\\mathbf{w}^T \\mathbf{x} + b > 0$ and $-1$ if $\\mathbf{w}^T \\mathbf{x} + b < 0$.',
            canvasConnection: 'The solid center line dividing the blue and orange classes.'
          }
        ],
        handTrace: {
          title: 'Trace It by Hand (Support Vector & Margin Walkthrough)',
          description: 'Step-by-step calculation of functional margins, support vector identification, hinge loss, and geometric margin width for 3 points with candidate hyperplane $\\mathbf{w} = [0.5, 0.5], b = -3.0$ and $C = 1.0$.',
          points: [
            { text: 'A = (1, 1), y_1 = -1' },
            { text: 'B = (2, 2), y_2 = -1' },
            { text: 'C = (4, 4), y_3 = +1' }
          ],
          steps: [
            {
              step: 'Step 1: Compute Raw Decision Scores (f(x_i) = w · x_i + b)',
              heading: 'Evaluate functional distances from candidate hyperplane',
              latex: '\\begin{aligned} f(A) &= 0.5(1) + 0.5(1) - 3.0 = 1.0 - 3.0 = -2.0 \\\\ f(B) &= 0.5(2) + 0.5(2) - 3.0 = 2.0 - 3.0 = -1.0 \\\\ f(C) &= 0.5(4) + 0.5(4) - 3.0 = 4.0 - 3.0 = +1.0 \\end{aligned}'
            },
            {
              step: 'Step 2: Compute Functional Margin (y_i f(x_i)) & Identify Support Vectors',
              heading: 'Check margin constraint satisfaction and locate boundary points',
              latex: '\\begin{aligned} \\text{Point } A: \\quad & y_1 f(A) = (-1)(-2.0) = +2.0 \\ge 1 \\implies \\text{Outside margin corridor (Hinge Loss = 0)} \\\\ \\text{Point } B: \\quad & y_2 f(B) = (-1)(-1.0) = +1.0 = 1 \\implies \\mathbf{\\text{On negative margin gutter (Active Support Vector)}} \\\\ \\text{Point } C: \\quad & y_3 f(C) = (+1)(+1.0) = +1.0 = 1 \\implies \\mathbf{\\text{On positive margin gutter (Active Support Vector)}} \\end{aligned}'
            },
            {
              step: 'Step 3: Evaluate Hinge Loss and Geometric Margin Width',
              heading: 'Verify zero loss penalty and calculate perpendicular street width',
              latex: '\\begin{aligned} \\text{Hinge Loss}_i &= \\max\\left(0, \\; 1 - y_i f(\\mathbf{x}_i)\\right) = 0 \\quad \\forall i \\in \\{A, B, C\\} \\\\ \\|\\mathbf{w}\\|_2 &= \\sqrt{0.5^2 + 0.5^2} = \\sqrt{0.25 + 0.25} = \\sqrt{0.5} \\approx 0.7071 \\\\ \\text{Margin Width} &= \\frac{2}{\\|\\mathbf{w}\\|_2} = \\frac{2}{\\sqrt{0.5}} = 2\\sqrt{2} \\approx 2.828 \\end{aligned}'
            }
          ]
        }
      },
      experiments: [
        {
          title: 'Margin Softness Tuning (High C vs Low C)',
          tag: 'Regularization Control',
          setup: 'On "Linearly Separable", slide Penalty Weight (C) up to 10.0 (Hard Margin), then drop it down to 0.2 (Soft Margin).',
          whatBreaks: 'At C=10.0, the margin corridor becomes razor-thin to prevent any intrusion. At C=0.2, the corridor widens dramatically, tolerating points deep inside the street.',
          whyItBreaks: 'Large $C$ penalizes margin violations severely, coercing the solver to narrow the margin to accommodate edge cases. Small $C$ prioritizes small $\\|\\mathbf{w}\\|^2$ (wide street) over margin violations, boosting generalization against noisy outliers.'
        },
        {
          title: 'XOR Quadrants Breakdown',
          tag: 'Linear Inseparability',
          setup: 'Select "XOR Quadrants" and train Linear SVM.',
          whatBreaks: 'Classification accuracy stalls at 50%; the hyperplane slices aimlessly through the diagonal quadrants.',
          whyItBreaks: 'The convex hulls of the two XOR classes overlap: $\\text{conv}(C_0) \\cap \\text{conv}(C_1) \\neq \\emptyset$. Because a single linear hyperplane cannot partition non-convex alternating quadrants, a linear SVM fails fundamentally without an RBF or polynomial kernel.'
        }
      ],
      code: {
        filename: 'linear_svm.py',
        snippet: `import numpy as np
from sklearn.svm import LinearSVC

# 1. Linear SVM with Subgradient Descent (Pegasos / SGD style)
def fit_linear_svm(X: np.ndarray, y: np.ndarray, C: float = 1.0, lr: float = 0.01, epochs: int = 400):
    # Convert binary {0, 1} to hinge targets {-1, +1}
    y_svm = np.where(y == 0, -1.0, 1.0)
    N, D = X.shape
    w = np.zeros(D)
    b = 0.0
    
    for epoch in range(epochs):
        for i in range(N):
            margin = y_svm[i] * (np.dot(w, X[i]) + b)
            if margin < 1.0:
                # Point violates margin or is misclassified
                w = w - lr * (w - C * y_svm[i] * X[i])
                b = b + lr * (C * y_svm[i])
            else:
                # Correct point outside margin gutter (L2 weight decay)
                w = w - lr * w
    return w, b

# 2. Scikit-Learn LinearSVC Verification
if __name__ == "__main__":
    X = np.array([[-2.0, 1.5], [-1.5, 2.0], [2.0, -1.5], [1.5, -2.0]])
    y = np.array([0, 0, 1, 1])
    
    w, b = fit_linear_svm(X, y, C=2.0)
    print(f"NumPy SVM:  w = {w.round(3)}, b = {b:.3f}")
    
    clf = LinearSVC(C=2.0, loss='hinge', dual=True, random_state=42).fit(X, y)
    print(f"Scikit SVM: w = {clf.coef_[0].round(3)}, b = {clf.intercept_[0]:.3f}")`
      },
      complexity: [
        {
          stage: 'Training (Stochastic Subgradient / Pegasos)',
          time: '$\\mathcal{O}(\\text{epochs} \\cdot N \\cdot D)$',
          space: '$\\mathcal{O}(D)$',
          notes: 'Iterative subgradient descent scales linearly with samples and feature dimensions.'
        },
        {
          stage: 'Training (Dual Quadratic Programming / SMO)',
          time: '$\\mathcal{O}(N^2) \\text{ to } \\mathcal{O}(N^3)$',
          space: '$\\mathcal{O}(N)$',
          notes: 'Standard dual solvers scale superlinearly with dataset size $N$.'
        },
        {
          stage: 'Prediction (Inference)',
          time: '$\\mathcal{O}(D)$',
          space: '$\\mathcal{O}(1)$',
          notes: 'Evaluates single inner product $\\mathbf{w}^T \\mathbf{x} + b$ and takes sign.'
        }
      ],
      faq: [
        {
          q: 'What makes a point a "Support Vector"?',
          a: 'A support vector is any training sample $\\mathbf{x}_i$ satisfying $y_i (\\mathbf{w}^T \\mathbf{x}_i + b) \\le 1$—meaning it lies directly on the margin boundary or violates it. All points strictly outside the margin ($> 1$) could be erased from the dataset without altering the fitted hyperplane in the slightest.'
        },
        {
          q: 'How does Linear SVM differ fundamentally from Logistic Regression?',
          a: 'Logistic Regression uses exponential log-loss where every point exerts some gravitational pull on the boundary. SVM uses piecewise linear hinge loss where points outside the street have zero gradient, making SVM robust against distant outliers.'
        },
        {
          q: 'What does the Query Probe show for Linear SVM?',
          a: 'In Test Query mode, the probe computes raw functional margin $z = \\mathbf{w}^T \\mathbf{x} + b$ and normalized geometric distance $d = \\frac{z}{\\|\\mathbf{w}\\|}$, reporting whether the test query sits inside the margin street or outside.'
        },
        {
          q: 'Why does Linear SVM perform exceptionally well in high dimensions?',
          a: 'According to statistical learning theory, SVM generalization bounds depend on margin width $\\frac{2}{\\|\\mathbf{w}\\|}$ rather than raw feature dimension $D$, preventing overfitting even when $D > N$ (such as in genomics or text classification).'
        }
      ],
      related: [
        {
          id: 'logistic_reg',
          name: 'Logistic Regression',
          badge: 'Probabilistic Classification',
          reason: 'Smooths the boundary using cross-entropy and outputs calibrated probabilities rather than hard margin distances.'
        },
        {
          id: 'neural_net',
          name: 'Neural Network (MLP)',
          badge: 'Nonlinear Classification',
          reason: 'Bypasses linear separability restrictions by learning hidden feature representations to separate curved datasets.'
        },
        {
          id: 'naive_bayes',
          name: 'Gaussian Naive Bayes',
          badge: 'Generative Classification',
          reason: 'Models class density ellipsoids with Bayes theorem rather than hunting for maximum geometric margin boundaries.'
        }
      ]
    },
    knn: {
      id: 'knn',
      title: 'K-Nearest Neighbors (KNN)',
      category: 'Instance-Based Classification',
      difficulty: 'Beginner',
      summary: 'K-Nearest Neighbors is a non-parametric, lazy learning algorithm that memorizes the training data. Given a query point, it computes distances across all stored samples, identifies the K nearest neighbors, and assigns the class label that commands the majority vote.',
      prerequisites: [
        'Cartesian Distance Formulas (Euclidean & Manhattan)',
        'Majority Voting & Plurality Rules',
        'Voronoi Tessellations'
      ],
      math: {
        intro: 'Unlike parametric models which learn fixed weight coefficients during training, KNN stores data points verbatim and defers all mathematical computation to inference time.',
        equations: [
          {
            name: 'Euclidean Distance (L2 Metric)',
            latex: 'd_2(\\mathbf{p}, \\mathbf{q}) = \\sqrt{(p_1 - q_1)^2 + (p_2 - q_2)^2} = \\|\\mathbf{p} - \\mathbf{q}\\|_2',
            description: 'Computes straight-line Euclidean geometric distance between two points in the feature space.',
            canvasConnection: 'Produces smooth, circular boundary contours around point clusters.'
          },
          {
            name: 'Manhattan Distance (L1 Metric)',
            latex: 'd_1(\\mathbf{p}, \\mathbf{q}) = |p_1 - q_1| + |p_2 - q_2| = \\|\\mathbf{p} - \\mathbf{q}\\|_1',
            description: 'Computes grid-aligned distance following horizontal and vertical axes (taxicab metric).',
            canvasConnection: 'Produces sharp, 45-degree diamond-shaped boundary contours when selected in the Distance Formula dropdown.'
          },
          {
            name: 'Majority Vote Decision Rule',
            latex: '\\hat{y} = \\operatorname{arg\\,max}_{c} \\sum_{i \\in \\mathcal{N}_K(\\mathbf{x})} \\mathbb{I}(y_i = c)',
            description: 'Counts class memberships among the $K$ closest neighbors $\\mathcal{N}_K(\\mathbf{x})$ and predicts the mode class.',
            canvasConnection: 'When using Test Query mode, dotted lines point to the $K$ chosen neighbors, and the probe banner counts vote tallies.'
          },
          {
            name: 'Effective Model Degrees of Freedom',
            latex: '\\text{Degrees of Freedom} \\approx \\frac{N}{K}',
            description: 'At $K=1$, the model has $N$ degrees of freedom (high variance/overfitting). As $K \\to N$, degrees of freedom drop to 1 (high bias/oversmoothing).',
            canvasConnection: 'Slide K from 1 to 15 on canvas to witness jagged isolated pockets dissolve into broad regional zones.'
          }
        ],
        handTrace: {
          title: 'Trace It by Hand (Distance & Majority Vote Walkthrough)',
          description: 'Step-by-step calculation of Euclidean distances, sorting, and plurality voting for query point $Q = (2, 2)$ with $K = 3$ over a 5-point dataset.',
          points: [
            { text: 'P_1 = (1, 1) [Class A]' },
            { text: 'P_2 = (2, 1) [Class A]' },
            { text: 'P_3 = (1, 3) [Class B]' },
            { text: 'P_4 = (4, 4) [Class B]' },
            { text: 'P_5 = (5, 4) [Class B]' }
          ],
          steps: [
            {
              step: 'Step 1: Compute Euclidean Distances to All Stored Points',
              heading: 'Calculate straight-line distance d(Q, P_i) from query Q(2, 2)',
              latex: '\\begin{aligned} d(Q, P_1) &= \\sqrt{(1 - 2)^2 + (1 - 2)^2} = \\sqrt{(-1)^2 + (-1)^2} = \\sqrt{2} \\approx 1.414 \\quad [\\text{Class A}] \\\\ d(Q, P_2) &= \\sqrt{(2 - 2)^2 + (1 - 2)^2} = \\sqrt{0^2 + (-1)^2} = \\sqrt{1} = 1.000 \\quad [\\text{Class A}] \\\\ d(Q, P_3) &= \\sqrt{(1 - 2)^2 + (3 - 2)^2} = \\sqrt{(-1)^2 + 1^2} = \\sqrt{2} \\approx 1.414 \\quad [\\text{Class B}] \\\\ d(Q, P_4) &= \\sqrt{(4 - 2)^2 + (4 - 2)^2} = \\sqrt{2^2 + 2^2} = \\sqrt{8} \\approx 2.828 \\quad [\\text{Class B}] \\\\ d(Q, P_5) &= \\sqrt{(5 - 2)^2 + (4 - 2)^2} = \\sqrt{3^2 + 2^2} = \\sqrt{13} \\approx 3.606 \\quad [\\text{Class B}] \\end{aligned}'
            },
            {
              step: 'Step 2: Sort Distances in Ascending Order',
              heading: 'Rank nearest neighbors by proximity',
              latex: '\\begin{aligned} 1.\\; & P_2: \\quad d = 1.000 \\quad [\\text{Class A}] \\\\ 2.\\; & P_1: \\quad d \\approx 1.414 \\quad [\\text{Class A}] \\\\ 3.\\; & P_3: \\quad d \\approx 1.414 \\quad [\\text{Class B}] \\\\ 4.\\; & P_4: \\quad d \\approx 2.828 \\quad [\\text{Class B}] \\\\ 5.\\; & P_5: \\quad d \\approx 3.606 \\quad [\\text{Class B}] \\end{aligned}'
            },
            {
              step: 'Step 3: Extract Top K=3 Neighbors and Cast Plurality Vote',
              heading: 'Determine winning class by majority vote',
              latex: '\\begin{aligned} \\mathcal{N}_3(Q) &= \\{P_2, P_1, P_3\\} \\\\ \\text{Votes for Class A} &= \\mathbb{I}(y_2 = A) + \\mathbb{I}(y_1 = A) = 1 + 1 = 2 \\\\ \\text{Votes for Class B} &= \\mathbb{I}(y_3 = B) = 1 \\\\ \\hat{y}(Q) &= \\mathbf{\\text{Class A}} \\quad \\left(\\text{Confidence: } \\frac{2}{3} \\approx 66.7\\%\\right) \\end{aligned}'
            }
          ]
        }
      },
      experiments: [
        {
          title: 'Overfitting Islands (K=1 vs K=15)',
          tag: 'Variance vs Bias',
          setup: 'On "3 Cluster Blobs", click once to place an isolated Class 1 point directly inside the Class 0 cluster. Set K=1, then raise K to 11.',
          whatBreaks: 'At K=1, a jagged circular "island" of Class 1 territory forms around the single noise point. At K=11, the outlier is outvoted and the island disappears.',
          whyItBreaks: 'At $K=1$, the boundary forms a Voronoi diagram where training error is 0% but variance is maximal. Raising $K$ acts as a spatial low-pass filter, forcing consensus among neighbors and dampening local noise.'
        },
        {
          title: 'Metric Geometry Distortion (Euclidean vs Manhattan)',
          tag: 'Norm Invariance',
          setup: 'Select "Two Moons" and switch Distance Formula between "Euclidean" and "Manhattan (Grid)".',
          whatBreaks: 'The decision boundary shifts from rounded, organic curves into stair-stepped, diamond-facet polygonal ridges.',
          whyItBreaks: 'The unit ball in $L_1$ space is a rotated square ($|x_1| + |x_2| \\le r$). Equidistant boundaries in Manhattan space adhere to diamond coordinates rather than circular Euclidean level curves.'
        }
      ],
      code: {
        filename: 'k_nearest_neighbors.py',
        snippet: `import numpy as np
from collections import Counter
from sklearn.neighbors import KNeighborsClassifier

# 1. Pure NumPy Vectorized KNN Classifier
class PureKNN:
    def __init__(self, k: int = 5, metric: str = 'euclidean'):
        self.k = k
        self.metric = metric
        self.X_train = None
        self.y_train = None

    def fit(self, X: np.ndarray, y: np.ndarray):
        # Lazy training: simply stores references to points
        self.X_train = np.asarray(X)
        self.y_train = np.asarray(y)
        return self

    def predict(self, X_query: np.ndarray) -> np.ndarray:
        preds = []
        for q in X_query:
            if self.metric == 'euclidean':
                dists = np.sqrt(np.sum((self.X_train - q) ** 2, axis=1))
            else: # manhattan
                dists = np.sum(np.abs(self.X_train - q), axis=1)
                
            # Get indices of K smallest distances
            k_indices = np.argsort(dists)[:self.k]
            k_labels = self.y_train[k_indices]
            
            # Majority vote
            most_common = Counter(k_labels).most_common(1)[0][0]
            preds.append(most_common)
        return np.array(preds)

# 2. Verification against Scikit-Learn
if __name__ == "__main__":
    X = np.array([[-2.0, 2.0], [-1.8, 1.9], [2.0, -2.0], [1.9, -1.8]])
    y = np.array([0, 0, 1, 1])
    
    knn = PureKNN(k=3).fit(X, y)
    print("NumPy KNN query (0, 0):", knn.predict([[0.0, 0.0]])[0])
    
    sk_knn = KNeighborsClassifier(n_neighbors=3).fit(X, y)
    print("Scikit KNN query (0, 0):", sk_knn.predict([[0.0, 0.0]])[0])`
      },
      complexity: [
        {
          stage: 'Training Stage',
          time: '$\\mathcal{O}(1)$',
          space: '$\\mathcal{O}(N \\cdot D)$',
          notes: 'Lazy learner: zero pre-computation; simply stores all $N$ data points in memory.'
        },
        {
          stage: 'Prediction (Brute-Force Search)',
          time: '$\\mathcal{O}(N D + N \\log K)$',
          space: '$\\mathcal{O}(K)$',
          notes: 'Must compute pairwise distance to all $N$ points and partition the top $K$.'
        },
        {
          stage: 'Prediction (KD-Tree / Ball-Tree)',
          time: '$\\mathcal{O}(D \\log N)$',
          space: '$\\mathcal{O}(N D)$',
          notes: 'Space partitioning accelerates queries in low dimensions ($D < 20$).'
        }
      ],
      faq: [
        {
          q: 'Why is KNN called a "lazy" algorithm?',
          a: 'KNN performs no parameter optimization or abstraction during training. It merely memorizes the raw training points. All computational effort—calculating distances, sorting, and voting—is deferred until a prediction is requested.'
        },
        {
          q: 'Why should K typically be an odd number?',
          a: 'For binary classification, choosing an odd $K$ mathematically prevents ties during majority voting. When ties occur in multi-class setups, the Studio breaks them deterministically by comparing the smallest individual neighbor distance.'
        },
        {
          q: 'What is the "Curse of Dimensionality" in KNN?',
          a: 'As the number of dimensions $D$ increases, the volume of the feature space expands exponentially. In 50+ dimensions, all pairs of points become roughly equidistant from one another, rendering Euclidean proximity meaningless.'
        },
        {
          q: 'Why is feature normalization critical before running KNN?',
          a: 'Because distance metrics compute absolute differences $(p_j - q_j)^2$, an unscaled feature with a large range (e.g., Annual Income: $[20000, 200000]$) would completely dominate a feature with a small range (e.g., Age: $[18, 65]$).'
        }
      ],
      related: [
        {
          id: 'kmeans',
          name: 'K-Means Clustering',
          badge: 'Unsupervised Clustering',
          reason: 'Uses the exact same Euclidean distance formulas, but clusters unlabeled data by alternating centroid calculations rather than supervised voting.'
        },
        {
          id: 'decision_tree',
          name: 'Decision Tree (CART)',
          badge: 'Tree Partitioning',
          reason: 'Partitions space using axis-aligned orthogonal cuts rather than computing distance metrics to all points.'
        },
        {
          id: 'naive_bayes',
          name: 'Gaussian Naive Bayes',
          badge: 'Probabilistic Classification',
          reason: 'Replaces raw point-by-point distance checks with smooth continuous Gaussian bell curves around each class.'
        }
      ]
    },
    naive_bayes: {
      id: 'naive_bayes',
      title: 'Gaussian Naive Bayes',
      category: 'Generative Probabilistic Classification',
      difficulty: 'Intermediate',
      summary: 'Gaussian Naive Bayes is a generative classifier rooted in Bayes Theorem. It operates on the "naive" conditional independence assumption that features are uncorrelated given the class label, modeling each feature as an independent 1D Gaussian distribution.',
      prerequisites: [
        'Bayes Theorem & Posterior Probability',
        'Gaussian (Normal) Distribution (\\mu, \\sigma^2)',
        'Class Conditional Independence'
      ],
      math: {
        intro: 'While discriminative models learn the boundary $P(y|\\mathbf{x})$ directly, Naive Bayes models the data generator $P(\\mathbf{x}|y)$ for each class and inverts it using Bayes Theorem.',
        equations: [
          {
            name: 'Bayes Theorem for Classification',
            latex: 'P(y=c|\\mathbf{x}) = \\frac{P(y=c) P(\\mathbf{x}|y=c)}{P(\\mathbf{x})} = \\frac{P(y=c) \\prod_{j=1}^D P(x_j|y=c)}{\\sum_k P(y=k) P(\\mathbf{x}|y=k)}',
            description: 'Computes posterior class probability by combining prior class belief $P(y=c)$ with the product of independent feature likelihoods.',
            canvasConnection: 'In Test Query mode, the probe banner reports calculated posterior probabilities for every class.'
          },
          {
            name: 'Gaussian Feature Likelihood',
            latex: 'P(x_j|y=c) = \\frac{1}{\\sqrt{2\\pi \\sigma_{cj}^2}} \\exp\\left(-\\frac{(x_j - \\mu_{cj})^2}{2\\sigma_{cj}^2}\\right)',
            description: 'Models feature $x_j$ in class $c$ as a normal distribution parameterized by sample mean $\\mu_{cj}$ and variance $\\sigma_{cj}^2$.',
            canvasConnection: 'The dashed concentric ellipses show the 1- $\\sigma$ and 2- $\\sigma$ probability density clouds for each class.'
          },
          {
            name: 'Quadratic Log-Posterior Decision Function',
            latex: 'g_c(\\mathbf{x}) = \\ln P(y=c) - \\frac{1}{2} \\sum_{j=1}^D \\ln(2\\pi \\sigma_{cj}^2) - \\frac{1}{2} \\sum_{j=1}^D \\frac{(x_j - \\mu_{cj})^2}{\\sigma_{cj}^2}',
            description: 'Taking the logarithm prevents numerical underflow. Points are assigned to whichever class maximizes $g_c(\\mathbf{x})$.',
            canvasConnection: 'The decision boundary between classes forms parabolic, hyperbolic, or elliptic curves.'
          },
          {
            name: 'Variance Smoothing (Epsilon Stabilizer)',
            latex: '\\sigma_{cj}^2 \\leftarrow \\sigma_{cj}^2 + \\epsilon, \\quad \\epsilon = 10^{-6} \\cdot \\max(\\sigma^2)',
            description: 'Adds a small epsilon to computed variances to prevent division-by-zero errors when data points in a class have zero spread.',
            canvasConnection: 'Ensures the model remains stable even if you place multiple points on top of each other.'
          }
        ],
        handTrace: {
          title: 'Trace It by Hand (Gaussian Likelihood & Bayes Walkthrough)',
          description: 'Step-by-step calculation of class priors, Gaussian means/variances, conditional likelihoods, and posterior probability for query point $x_{\\text{new}} = 3.5$ over a 1D 6-point dataset.',
          points: [
            { text: 'Class 0: x ∈ {1, 2, 3}' },
            { text: 'Class 1: x ∈ {5, 6, 7}' },
            { text: 'Query: x_{new} = 3.5' }
          ],
          steps: [
            {
              step: 'Step 1: Compute Class Priors',
              heading: 'Calculate prior probabilities P(y = c)',
              latex: 'P(y = 0) = \\frac{3}{6} = 0.5, \\quad P(y = 1) = \\frac{3}{6} = 0.5'
            },
            {
              step: 'Step 2: Compute Class Means (\\mu_c) and Variances (\\sigma_c^2)',
              heading: 'Fit 1D normal distributions to each class',
              latex: '\\begin{aligned} \\mu_0 &= \\frac{1 + 2 + 3}{3} = 2.0, \\quad \\sigma_0^2 = \\frac{(1-2)^2 + (2-2)^2 + (3-2)^2}{3} = \\frac{1 + 0 + 1}{3} = \\frac{2}{3} \\approx 0.667 \\\\ \\mu_1 &= \\frac{5 + 6 + 7}{3} = 6.0, \\quad \\sigma_1^2 = \\frac{(5-6)^2 + (6-6)^2 + (7-6)^2}{3} = \\frac{1 + 0 + 1}{3} = \\frac{2}{3} \\approx 0.667 \\end{aligned}'
            },
            {
              step: 'Step 3: Evaluate Gaussian Likelihoods at x_{new} = 3.5',
              heading: 'Calculate continuous Gaussian likelihood density values',
              latex: '\\begin{aligned} P(3.5 \\mid y=0) &= \\frac{1}{\\sqrt{2\\pi(0.667)}} \\exp\\left(-\\frac{(3.5 - 2.0)^2}{2(0.667)}\\right) = \\frac{1}{\\sqrt{4.189}} \\exp\\left(-\\frac{2.25}{1.333}\\right) = 0.489 \\cdot e^{-1.688} \\approx 0.0904 \\\\ P(3.5 \\mid y=1) &= \\frac{1}{\\sqrt{2\\pi(0.667)}} \\exp\\left(-\\frac{(3.5 - 6.0)^2}{2(0.667)}\\right) = \\frac{1}{\\sqrt{4.189}} \\exp\\left(-\\frac{6.25}{1.333}\\right) = 0.489 \\cdot e^{-4.688} \\approx 0.0045 \\end{aligned}'
            },
            {
              step: 'Step 4: Compute Normalized Posterior Probabilities & Decision',
              heading: 'Apply Bayes Theorem and classify by argmax',
              latex: '\\begin{aligned} P(y=0 \\mid x=3.5) &\\propto P(y=0) P(3.5 \\mid y=0) = 0.5 \\times 0.0904 = 0.0452 \\\\ P(y=1 \\mid x=3.5) &\\propto P(y=1) P(3.5 \\mid y=1) = 0.5 \\times 0.0045 = 0.00225 \\\\ P(y=0 \\mid x=3.5) &= \\frac{0.0452}{0.0452 + 0.00225} = \\frac{0.0452}{0.04745} \\approx \\mathbf{95.3\\%} \\\\ \\hat{y}(3.5) &= \\mathbf{\\text{Class 0}} \\end{aligned}'
            }
          ]
        }
      },
      experiments: [
        {
          title: 'Correlated Features Breakdown (The "Naive" Fallacy)',
          tag: 'Independence Violation',
          setup: 'Switch Dataset Preset to "Correlated Ellipse" or plot two diagonally elongated oval clusters.',
          whatBreaks: 'The fitted dashed ellipses remain strictly horizontal/vertical (axis-aligned) and cannot tilt diagonally to match the true data correlation.',
          whyItBreaks: 'The conditional independence assumption asserts $\\text{Cov}(x_1, x_2 | y) = 0$. The covariance matrix is forced to be purely diagonal $(\\begin{bmatrix} \\sigma_x^2 & 0 \\\\ 0 & \\sigma_y^2 \\end{bmatrix})$. Because it cannot represent off-diagonal cross-covariance, it cannot rotate its distribution to match diagonal trends.'
        },
        {
          title: 'Zero-Variance Density Collapse',
          tag: 'Singularity Prevention',
          setup: 'Erase points until Class 1 contains only two points that share the exact same X coordinate.',
          whatBreaks: 'Without variance smoothing, $\\sigma_{1x}^2 = 0$, causing probability density $\\frac{1}{\\sqrt{2\\pi \\sigma^2}} \\to \\infty$ and crashing computations.',
          whyItBreaks: 'Zero variance collapses a continuous Gaussian into an infinitely dense Dirac delta spike. Studio adds a variance smoothing factor $\\epsilon = 10^{-6}$ to keep denominators positive and finite.'
        }
      ],
      code: {
        filename: 'gaussian_naive_bayes.py',
        snippet: `import numpy as np
from sklearn.naive_bayes import GaussianNB

# 1. Pure NumPy Vectorized Gaussian Naive Bayes
class PureGaussianNB:
    def __init__(self, eps: float = 1e-9):
        self.eps = eps
        self.classes = None
        self.priors = {}
        self.means = {}
        self.vars = {}

    def fit(self, X: np.ndarray, y: np.ndarray):
        self.classes = np.unique(y)
        N = len(y)
        
        for c in self.classes:
            X_c = X[y == c]
            self.priors[c] = len(X_c) / N
            self.means[c] = np.mean(X_c, axis=0)
            self.vars[c] = np.var(X_c, axis=0) + self.eps
        return self

    def predict(self, X: np.ndarray) -> np.ndarray:
        preds = []
        for x in X:
            posteriors = []
            for c in self.classes:
                prior = np.log(self.priors[c])
                # Log likelihood of Gaussian
                log_lik = -0.5 * np.sum(np.log(2.0 * np.pi * self.vars[c])) \\
                          -0.5 * np.sum(((x - self.means[c]) ** 2) / self.vars[c])
                posteriors.append(prior + log_lik)
            preds.append(self.classes[np.argmax(posteriors)])
        return np.array(preds)

# 2. Verification against Scikit-Learn
if __name__ == "__main__":
    X = np.array([[-2.0, 2.0], [-1.5, 1.8], [2.0, -2.0], [1.8, -1.5]])
    y = np.array([0, 0, 1, 1])
    
    gnb = PureGaussianNB().fit(X, y)
    print("NumPy GNB Prediction:", gnb.predict([[-1.9, 1.9]])[0])
    
    sk_gnb = GaussianNB().fit(X, y)
    print("Scikit GNB Prediction:", sk_gnb.predict([[-1.9, 1.9]])[0])`
      },
      complexity: [
        {
          stage: 'Training Stage',
          time: '$\\mathcal{O}(N \\cdot D)$',
          space: '$\\mathcal{O}(C \\cdot D)$',
          notes: 'Single pass to compute class mean $\\mu_{cj}$, variance $\\sigma_{cj}^2$, and class priors.'
        },
        {
          stage: 'Prediction (Inference)',
          time: '$\\mathcal{O}(C \\cdot D)$',
          space: '$\\mathcal{O}(C)$',
          notes: 'Evaluates Gaussian log-densities for all $C$ candidate classes in dimension $D$.'
        }
      ],
      faq: [
        {
          q: 'Why is Naive Bayes called "naive"?',
          a: 'It naively assumes every input feature is conditionally independent of every other feature given the class label. In reality, features are almost always correlated (e.g., height and weight, or words like "machine" and "learning").'
        },
        {
          q: 'If the independence assumption is false, why does Naive Bayes work so well?',
          a: 'Classification requires finding the maximum posterior class (the argmax), not exact probability calibration. Even if independence violations distort individual probability percentages, the true class often still scores highest.'
        },
        {
          q: 'What do the dashed ellipses on the canvas represent?',
          a: 'The ellipses visualize the Gaussian probability density contours for each class. The inner ellipse marks 1 standard deviation ($1\\sigma$, enclosing ~39.3% of 2D density) and the outer marks 2 standard deviations ($2\\sigma$, enclosing ~86.5%).'
        },
        {
          q: 'Can Gaussian Naive Bayes create non-linear decision boundaries?',
          a: 'Yes! Because each class has its own independent variances $\\sigma_{cj}^2$, the log-posterior includes quadratic terms $\\frac{x^2}{\\sigma^2}$. When variances differ across classes, the decision boundary curves into parabolic, hyperbolic, or elliptical shapes.'
        }
      ],
      related: [
        {
          id: 'logistic_reg',
          name: 'Logistic Regression',
          badge: 'Discriminative Classification',
          reason: 'The discriminative counterpart to Gaussian Naive Bayes; does not assume feature independence.'
        },
        {
          id: 'knn',
          name: 'K-Nearest Neighbors',
          badge: 'Instance-Based Classification',
          reason: 'Classifies using local voting over actual nearby data points rather than assuming parametric Gaussian distributions.'
        },
        {
          id: 'kmeans',
          name: 'K-Means Clustering',
          badge: 'Unsupervised Clustering',
          reason: 'Computes spherical cluster centroids with Euclidean distance, resembling Gaussian NB with equal variances.'
        }
      ]
    },
    decision_tree: {
      id: 'decision_tree',
      title: 'Decision Tree (CART)',
      category: 'Tree-Based Supervised Learning',
      difficulty: 'Beginner',
      summary: 'Classification and Regression Trees (CART) recursively partition the 2D plane using a sequence of axis-aligned orthogonal cuts ($x_1 \\le t$ or $x_2 \\le t$). At every node, it greedily evaluates all possible cut locations and chooses the threshold that maximizes child node purity as quantified by Gini Impurity.',
      prerequisites: [
        'Gini Impurity & Entropy',
        'Binary Trees (Root, Nodes, Leaves)',
        'Greedy Recursive Partitioning',
        'Overfitting & Depth Regularization'
      ],
      math: {
        intro: 'A Decision Tree turns complex classification boundaries into an interpretable chain of nested if-else rules. It evaluates candidate cuts across both axes to minimize class mixture.',
        equations: [
          {
            name: 'Gini Impurity Formula',
            latex: 'G(S) = 1 - \\sum_{c=0}^{C-1} p_c^2, \\quad p_c = \\frac{N_c}{|S|}',
            description: 'Quantifies the probability of mislabeling a randomly selected sample if labeled according to the empirical class distribution $p_c$. A node containing only one class has $G(S) = 0$ (perfect purity).',
            canvasConnection: 'Each rectangular bounding box on canvas seeks to encompass points of a single uniform color.'
          },
          {
            name: 'Information Gain (Impurity Drop)',
            latex: '\\Delta G(S, j, t) = G(S) - \\left( \\frac{|S_L|}{|S|} G(S_L) + \\frac{|S_R|}{|S|} G(S_R) \\right)',
            description: 'Calculates the reduction in impurity when splitting feature $x_j$ at threshold $t$, dividing parent node $S$ into left child $S_L$ and right child $S_R$.',
            canvasConnection: 'Determines the exact coordinate location of each horizontal or vertical partition line on canvas.'
          },
          {
            name: 'Optimal Greedy Split Rule',
            latex: '(j^*, t^*) = \\operatorname{arg\\,max}_{j \\in \\{1, \\dots, D\\}, \\; t \\in \\text{Cuts}} \\Delta G(S, j, t)',
            description: 'Scans all midpoint intervals between adjacent sorted point coordinates to select the single split yielding maximum impurity reduction.',
            canvasConnection: 'In the Model Internals panel, click through the tree nodes to inspect the chosen axis ($x$ or $y$) and split threshold $t$.'
          },
          {
            name: 'Stopping Criteria & Pruning Bounds',
            latex: '\\text{Stop if } \\operatorname{depth} \\ge d_{\\max}, \\quad |S| < N_{\\min}, \\quad \\text{or } G(S) = 0',
            description: 'Halts recursive splitting when reaching the maximum allowed tree depth or when a node falls below the minimum required sample count.',
            canvasConnection: 'Directly governed by the "Tree Depth Limit" and "Min Points to Split" sliders in the controls panel.'
          }
        ],
        handTrace: {
          title: 'Trace It by Hand (Gini Impurity & Split Gain Walkthrough)',
          description: 'Step-by-step calculation of parent Gini impurity, child partition impurities, and impurity gain for candidate split $x \\le 2.5$ over a 5-point dataset.',
          points: [
            { text: '(x=1, A)' },
            { text: '(x=2, A)' },
            { text: '(x=3, B)' },
            { text: '(x=4, B)' },
            { text: '(x=5, B)' }
          ],
          steps: [
            {
              step: 'Step 1: Compute Parent Node Gini Impurity (2 Class A, 3 Class B)',
              heading: 'Evaluate baseline class mixture of unsplit sample (N = 5)',
              latex: 'G_{\\text{parent}} = 1 - \\left(\\frac{2}{5}\\right)^2 - \\left(\\frac{3}{5}\\right)^2 = 1 - 0.16 - 0.36 = 0.480'
            },
            {
              step: 'Step 2: Partition at Threshold x ≤ 2.5 & Compute Child Impurities',
              heading: 'Evaluate purity of left and right child subsets',
              latex: '\\begin{aligned} \\text{Left subset } S_L \\; (x \\le 2.5): & \\quad \\{x=1, 2\\} \\implies 2A, \\; 0B \\\\ G(S_L) &= 1 - \\left(\\frac{2}{2}\\right)^2 - \\left(\\frac{0}{2}\\right)^2 = 1 - 1.0 = 0.000 \\quad (\\text{Pure}) \\\\ \\text{Right subset } S_R \\; (x > 2.5): & \\quad \\{x=3, 4, 5\\} \\implies 0A, \\; 3B \\\\ G(S_R) &= 1 - \\left(\\frac{0}{3}\\right)^2 - \\left(\\frac{3}{3}\\right)^2 = 1 - 1.0 = 0.000 \\quad (\\text{Pure}) \\end{aligned}'
            },
            {
              step: 'Step 3: Compute Weighted Child Gini & Information Gain (ΔG)',
              heading: 'Calculate total reduction in impurity achieved by split',
              latex: '\\begin{aligned} G_{\\text{split}} &= \\frac{|S_L|}{|S|} G(S_L) + \\frac{|S_R|}{|S|} G(S_R) = \\frac{2}{5}(0.000) + \\frac{3}{5}(0.000) = 0.000 \\\\ \\Delta G &= G_{\\text{parent}} - G_{\\text{split}} = 0.480 - 0.000 = \\mathbf{0.480} \\end{aligned}'
            },
            {
              step: 'Step 4: Conclude Optimal Split Rule',
              heading: 'Maximum possible impurity gain isolates classes into pure leaf nodes',
              latex: '\\text{Optimal Cut: Split on } x \\le 2.5 \\implies \\text{Left: Predict A (100\\%), Right: Predict B (100\\%)}'
            }
          ]
        }
      },
      experiments: [
        {
          title: 'Unbounded Depth Overfitting (Max Depth 1 vs 4)',
          tag: 'Capacity Control',
          setup: 'Select "XOR Quadrants", slide Tree Depth Limit to 1 (decision stump), then raise it to 4.',
          whatBreaks: 'At Depth 1, the model makes a single vertical slice and stalls at 50% accuracy. At Depth 4, it slices the plane into tiny, intricate rectangular boxes isolating individual outlier points.',
          whyItBreaks: 'A depth-1 tree can only produce two half-spaces, mathematically unable to resolve alternating XOR quadrants. At unconstrained depth, CART splits repeatedly until every single sample is isolated, trading high bias for extreme variance.'
        },
        {
          title: 'Axis-Aligned Staircasing on Diagonal Data',
          tag: 'Orthogonal Limitation',
          setup: 'Switch Dataset Preset to "Linearly Separable (2 Classes)" or "Correlated Ellipse" where points separate along a 45-degree diagonal.',
          whatBreaks: 'Instead of drawing a smooth diagonal boundary line, the tree produces a jagged, jagged staircase of alternating horizontal and vertical wall segments.',
          whyItBreaks: 'Standard CART decision trees evaluate single features independently ($x_1 \\le t$ or $x_2 \\le t$). Because each cut is strictly parallel to a coordinate axis, approximating a diagonal boundary requires an infinite series of tiny step cuts.'
        }
      ],
      code: {
        filename: 'decision_tree_cart.py',
        snippet: `import numpy as np
from sklearn.tree import DecisionTreeClassifier

# 1. Recursive CART Decision Tree (Pure NumPy)
class TreeNode:
    def __init__(self, depth=0):
        self.depth = depth
        self.feature = None
        self.threshold = None
        self.left = None
        self.right = None
        self.prediction = None

def gini_impurity(y: np.ndarray) -> float:
    if len(y) == 0:
        return 0.0
    _, counts = np.unique(y, return_counts=True)
    probs = counts / len(y)
    return 1.0 - np.sum(probs ** 2)

def fit_tree(X: np.ndarray, y: np.ndarray, max_depth: int = 3, min_samples: int = 2, depth: int = 0) -> TreeNode:
    node = TreeNode(depth=depth)
    classes, counts = np.unique(y, return_counts=True)
    node.prediction = classes[np.argmax(counts)]
    
    if depth >= max_depth or len(y) < min_samples or len(classes) == 1:
        return node
        
    best_gain = 0.0
    best_feat, best_thresh = None, None
    current_gini = gini_impurity(y)
    N, D = X.shape
    
    for j in range(D):
        sorted_vals = np.unique(X[:, j])
        thresholds = (sorted_vals[:-1] + sorted_vals[1:]) / 2.0
        for t in thresholds:
            left_mask = X[:, j] <= t
            right_mask = ~left_mask
            if np.sum(left_mask) == 0 or np.sum(right_mask) == 0:
                continue
            g_l = gini_impurity(y[left_mask])
            g_r = gini_impurity(y[right_mask])
            gain = current_gini - (np.sum(left_mask)/N * g_l + np.sum(right_mask)/N * g_r)
            if gain > best_gain:
                best_gain = gain
                best_feat, best_thresh = j, t
                
    if best_gain > 0:
        node.feature = best_feat
        node.threshold = best_thresh
        mask = X[:, best_feat] <= best_thresh
        node.left = fit_tree(X[mask], y[mask], max_depth, min_samples, depth + 1)
        node.right = fit_tree(X[~mask], y[~mask], max_depth, min_samples, depth + 1)
    return node

# 2. Scikit-Learn Verification
if __name__ == "__main__":
    X = np.array([[-2.0, 2.0], [2.0, -2.0], [2.0, 2.0], [-2.0, -2.0]])
    y = np.array([0, 0, 1, 1])
    
    tree = fit_tree(X, y, max_depth=2)
    print(f"NumPy Root Split: Feature {tree.feature} at threshold {tree.threshold:.2f}")
    
    sk_tree = DecisionTreeClassifier(max_depth=2, criterion='gini').fit(X, y)
    print(f"Scikit Root Split: Feature {sk_tree.tree_.feature[0]} at threshold {sk_tree.tree_.threshold[0]:.2f}")`
      },
      complexity: [
        {
          stage: 'Training Stage',
          time: '$\\mathcal{O}(D \\cdot N \\log N \\cdot d_{\\max})$',
          space: '$\\mathcal{O}(2^{d_{\\max}})$',
          notes: 'Sorting $N$ points along $D$ features takes $N \\log N$ at each of the $d_{\\max}$ tree levels.'
        },
        {
          stage: 'Prediction (Inference)',
          time: '$\\mathcal{O}(d_{\\max})$',
          space: '$\\mathcal{O}(1)$',
          notes: 'Traversing the binary decision tree from root to leaf takes time bounded by maximum depth.'
        }
      ],
      faq: [
        {
          q: 'What is the practical difference between Gini Impurity and Shannon Entropy?',
          a: 'Gini Impurity evaluates $1 - \\sum p_c^2$, whereas Shannon Entropy evaluates $-\\sum p_c \\log_2 p_c$. In practice, they produce identical trees in over 98% of cases. Gini is the industry default because avoiding logarithmic calculations makes training measurably faster.'
        },
        {
          q: 'Why are Decision Tree boundaries strictly horizontal and vertical?',
          a: 'Standard decision trees are univariate: each decision split evaluates a single isolated feature coordinate ($x \\le t$ or $y \\le t$). This creates axis-aligned orthogonal boundaries that slice the feature plane into rectangular cells.'
        },
        {
          q: 'Why is CART described as a "greedy" algorithm?',
          a: 'At each node, CART picks the split that maximizes immediate impurity drop without looking ahead to future depths. A locally optimal split chosen at the root may prevent a globally optimal partitioning later.'
        },
        {
          q: 'What does the Model Internals panel display for Decision Tree?',
          a: 'The Model Internals card below the canvas renders the complete tree topology as an SVG graph, showing feature test conditions, sample counts, and class distributions at every branch and leaf.'
        }
      ],
      related: [
        {
          id: 'random_forest',
          name: 'Random Forest',
          badge: 'Ensemble Bagging',
          reason: 'Averages many decorrelated decision trees to smooth out the jagged axis-aligned staircase boundaries and dramatically reduce variance.'
        },
        {
          id: 'gradient_boosting',
          name: 'Gradient Boosting',
          badge: 'Sequential Boosting',
          reason: 'Builds shallow decision stumps sequentially where each tree fits the negative gradient residuals of the previous stages.'
        },
        {
          id: 'knn',
          name: 'K-Nearest Neighbors',
          badge: 'Distance-Based Model',
          reason: 'Forms organic, distance-based classification territories rather than rectangular axis-aligned partition boxes.'
        }
      ]
    },
    random_forest: {
      id: 'random_forest',
      title: 'Random Forest',
      category: 'Ensemble Learning (Bagging)',
      difficulty: 'Intermediate',
      summary: 'Random Forest is an ensemble learning method that constructs a collection of decorrelated decision trees during training. By combining bootstrap aggregating (bagging) with random feature subsampling, it averages individual tree votes to achieve substantially lower variance and higher generalization than any single tree.',
      prerequisites: [
        'Decision Trees (CART)',
        'Bootstrap Sampling (Bagging)',
        'Variance Reduction & Law of Large Numbers',
        'Out-of-Bag (OOB) Generalization'
      ],
      math: {
        intro: 'A single decision tree is notorious for high variance and sensitive overfitting. Random Forest solves this by generating $B$ randomized trees and letting them vote.',
        equations: [
          {
            name: 'Bootstrap Aggregating (Bagging)',
            latex: '\\mathcal{D}^{(b)} \\sim \\text{Uniform}(\\mathcal{D}) \\quad \\text{with replacement}, \\quad |\\mathcal{D}^{(b)}| = N',
            description: 'Each of the $B$ trees is fitted on an independently drawn bootstrap sample of $N$ points. On average, each tree sees approximately $1 - e^{-1} \\approx 63.2\\%$ unique training points.',
            canvasConnection: 'In Duel Mode against Decision Tree, observe how the ensemble softens sharp single-tree borders.'
          },
          {
            name: 'Ensemble Plurality Voting',
            latex: '\\hat{y}(\\mathbf{x}) = \\operatorname{arg\\,max}_{c \\in \\{0, \\dots, C-1\\}} \\sum_{b=1}^{B} \\mathbb{I}\\left(\\hat{y}^{(b)}(\\mathbf{x}) = c\\right)',
            description: 'To classify a test coordinate $\\mathbf{x}$, each tree casts a vote. The forest predicts whichever class receives the majority or plurality vote.',
            canvasConnection: 'Background color shading indicates ensemble consensus; border transitions become blended and probabilistic.'
          },
          {
            name: 'Ensemble Variance Reduction Formula',
            latex: '\\operatorname{Var}(\\bar{f}) = \\rho \\sigma^2 + \\frac{1 - \\rho}{B} \\sigma^2',
            description: 'If individual trees have variance $\\sigma^2$ and average pairwise correlation $\\rho$, expanding ensemble size $B$ eliminates the second term $\\frac{1-\\rho}{B}\\sigma^2$, leaving minimum variance $\\rho \\sigma^2$.',
            canvasConnection: 'Increasing "Trees in Forest" from 3 to 9 stabilizes boundary jitter and prevents single-tree overfit.'
          },
          {
            name: 'Out-of-Bag (OOB) Generalization Estimate',
            latex: '\\text{OOB Error} = \\frac{1}{N} \\sum_{i=1}^N \\mathbb{I}\\left(y_i \\neq \\operatorname{arg\\,max}_c \\sum_{b: \\mathbf{x}_i \\notin \\mathcal{D}^{(b)}} \\mathbb{I}(\\hat{y}^{(b)}(\\mathbf{x}_i) = c)\\right)',
            description: 'Samples omitted from a tree\'s bootstrap sample (the out-of-bag $\\approx 36.8\\%$) serve as a built-in cross-validation set without requiring a separate validation split.',
            canvasConnection: 'Reported in the "Ensemble Acc" card in the metrics grid.'
          }
        ],
        handTrace: {
          title: 'Trace It by Hand (Bagging & Majority Voting Walkthrough)',
          description: 'Step-by-step trace showing 3 bootstrap samples drawn with replacement from a 4-point dataset and aggregating individual tree predictions on query point $Q$.',
          points: [
            { text: 'P_1(A)' },
            { text: 'P_2(A)' },
            { text: 'P_3(B)' },
            { text: 'P_4(B)' },
            { text: 'Query: Q' }
          ],
          steps: [
            {
              step: 'Step 1: Bootstrap Sample Generation with Replacement (B = 3 Trees)',
              heading: 'Draw N = 4 samples per tree, leaving ~36.8% Out-of-Bag (OOB)',
              latex: '\\begin{aligned} \\text{Tree 1 Sample } \\mathcal{D}^{(1)}: & \\quad \\{P_1(A), P_1(A), P_3(B), P_4(B)\\} \\quad (\\text{OOB: } P_2) \\\\ \\text{Tree 2 Sample } \\mathcal{D}^{(2)}: & \\quad \\{P_2(A), P_3(B), P_3(B), P_4(B)\\} \\quad (\\text{OOB: } P_1) \\\\ \\text{Tree 3 Sample } \\mathcal{D}^{(3)}: & \\quad \\{P_1(A), P_2(A), P_2(A), P_4(B)\\} \\quad (\\text{OOB: } P_3) \\end{aligned}'
            },
            {
              step: 'Step 2: Collect Individual Tree Predictions on Query Point Q',
              heading: 'Each independent tree classifies test coordinate Q',
              latex: '\\hat{y}^{(1)}(Q) = \\text{Class A}, \\quad \\hat{y}^{(2)}(Q) = \\text{Class B}, \\quad \\hat{y}^{(3)}(Q) = \\text{Class A}'
            },
            {
              step: 'Step 3: Tally Ensemble Plurality Vote & Final Classification',
              heading: 'Consensus voting reduces single-tree variance and stabilizes borders',
              latex: '\\begin{aligned} \\text{Votes for Class A} &= \\mathbb{I}(\\hat{y}^{(1)}=A) + \\mathbb{I}(\\hat{y}^{(3)}=A) = 1 + 1 = 2 \\\\ \\text{Votes for Class B} &= \\mathbb{I}(\\hat{y}^{(2)}=B) = 1 \\\\ \\hat{y}_{\\text{ensemble}}(Q) &= \\operatorname{arg\\,max}_c \\sum_{b=1}^3 \\mathbb{I}(\\hat{y}^{(b)}=c) = \\mathbf{\\text{Class A}} \\quad \\left(\\text{Confidence: } \\frac{2}{3} \\approx 66.7\\%\\right) \\end{aligned}'
            }
          ]
        }
      },
      experiments: [
        {
          title: 'Single Tree Jaggedness vs Forest Smoothing (Duel Mode)',
          tag: 'Variance Elimination',
          setup: 'Enable Duel Mode with Decision Tree on Primary and Random Forest on Challenger over the "Two Moons" dataset.',
          whatBreaks: 'The single Decision Tree produces harsh right-angle boxes with outlier spikes. The Random Forest produces smooth, contoured boundaries hugging the moons.',
          whyItBreaks: 'A single tree has high variance locked to local training samples. Averaging $B$ distinct trees averages their individual piecewise-constant step functions, effectively rounding sharp orthogonal corners into smooth probabilistic curves.'
        },
        {
          title: 'Diminishing Returns of Ensemble Size',
          tag: 'Ensemble Sizing',
          setup: 'Select "XOR Quadrants" and step Trees in Forest from 3 to 5, 7, and 9.',
          whatBreaks: 'Going from 1 to 5 trees yields a massive accuracy boost (~15-20%), but increasing from 7 to 9 trees produces negligible improvement (< 2%).',
          whyItBreaks: 'According to the variance formula $\\rho \\sigma^2 + \\frac{1-\\rho}{B}\\sigma^2$, as $B$ increases, the term $\\frac{1-\\rho}{B} \\to 0$. The irreducible variance lower bound $\\rho \\sigma^2$ is quickly reached, meaning adding more trees yields diminishing accuracy returns while increasing compute time.'
        }
      ],
      code: {
        filename: 'random_forest.py',
        snippet: `import numpy as np
from collections import Counter
from sklearn.ensemble import RandomForestClassifier

# 1. Random Forest Bootstrap Ensemble (Pure NumPy)
class PureRandomForest:
    def __init__(self, n_trees: int = 5, max_depth: int = 3, min_samples: int = 2):
        self.n_trees = n_trees
        self.max_depth = max_depth
        self.min_samples = min_samples
        self.trees = []

    def fit(self, X: np.ndarray, y: np.ndarray):
        from decision_tree_cart import fit_tree
        self.trees = []
        N = len(X)
        for _ in range(self.n_trees):
            # Bootstrap sample with replacement
            indices = np.random.choice(N, size=N, replace=True)
            X_boot = X[indices]
            y_boot = y[indices]
            tree = fit_tree(X_boot, y_boot, self.max_depth, self.min_samples)
            self.trees.append(tree)
        return self

    def predict(self, X: np.ndarray) -> np.ndarray:
        # Collect predictions from every tree
        from decision_tree_cart import TreeNode
        def predict_node(node, x):
            if node.feature is None:
                return node.prediction
            if x[node.feature] <= node.threshold:
                return predict_node(node.left, x)
            return predict_node(node.right, x)
            
        preds = []
        for x in X:
            tree_votes = [predict_node(t, x) for t in self.trees]
            plurality = Counter(tree_votes).most_common(1)[0][0]
            preds.append(plurality)
        return np.array(preds)

# 2. Scikit-Learn Verification
if __name__ == "__main__":
    X = np.array([[-2.0, 1.5], [-1.0, 2.0], [2.0, -1.5], [1.0, -2.0]])
    y = np.array([0, 0, 1, 1])
    
    rf = PureRandomForest(n_trees=5, max_depth=2).fit(X, y)
    print("NumPy Random Forest prediction at (0, 0):", rf.predict([[0.0, 0.0]])[0])
    
    sk_rf = RandomForestClassifier(n_estimators=5, max_depth=2, random_state=42).fit(X, y)
    print("Scikit Random Forest prediction at (0, 0):", sk_rf.predict([[0.0, 0.0]])[0])`
      },
      complexity: [
        {
          stage: 'Training Stage',
          time: '$\\mathcal{O}(B \\cdot D \\cdot N \\log N \\cdot d_{\\max})$',
          space: '$\\mathcal{O}(B \\cdot 2^{d_{\\max}})$',
          notes: 'Trains $B$ independent trees in parallel; total work scales linearly with number of trees $B$.'
        },
        {
          stage: 'Prediction (Inference)',
          time: '$\\mathcal{O}(B \\cdot d_{\\max})$',
          space: '$\\mathcal{O}(B)$',
          notes: 'Passes query coordinates through all $B$ decision trees and tabulates votes.'
        }
      ],
      faq: [
        {
          q: 'Why does Random Forest avoid overfitting even when adding hundreds of trees?',
          a: 'By the Law of Large Numbers, averaging more randomized trees causes the ensemble variance to converge toward a finite asymptotic minimum rather than overfitting. Overfitting in a Random Forest is governed by individual tree depth $d_{\\max}$, not the number of trees $B$.'
        },
        {
          q: 'What is feature bagging (the random subspace method)?',
          a: 'At every split in every tree, the algorithm considers only a random subset of features (typically $\\sqrt{D}$). This decorrelates the trees, preventing a single dominant feature from dictating the root split across all trees in the ensemble.'
        },
        {
          q: 'How does Bagging differ fundamentally from Boosting?',
          a: 'Bagging builds trees in parallel and independently from one another to reduce variance. Boosting builds trees sequentially in series, where each new tree directly targets the residual errors of the previous trees to reduce bias.'
        },
        {
          q: 'What does the Model Internals panel show for Random Forest?',
          a: 'Studio provides interactive sub-tabs (`Tree 1`, `Tree 2`, etc.) in the Model Internals card, letting you explore the independent split architecture and sample counts for every single tree in the forest.'
        }
      ],
      related: [
        {
          id: 'decision_tree',
          name: 'Decision Tree (CART)',
          badge: 'Base Estimator',
          reason: 'The single-tree building block that Random Forest aggregates to eliminate high-variance staircase artifacts.'
        },
        {
          id: 'gradient_boosting',
          name: 'Gradient Boosting',
          badge: 'Sequential Ensemble',
          reason: 'Builds trees sequentially to minimize residual gradients rather than averaging parallel bootstrap trees.'
        },
        {
          id: 'neural_net',
          name: 'Neural Network (MLP)',
          badge: 'Continuous Model',
          reason: 'Achieves non-linear separation through smooth continuous weight matrices rather than discrete axis cuts.'
        }
      ]
    },
    gradient_boosting: {
      id: 'gradient_boosting',
      title: 'Gradient Boosting',
      category: 'Ensemble Learning (Sequential Boosting)',
      difficulty: 'Advanced',
      summary: 'Gradient Boosting is a sequential ensemble method that trains shallow decision trees (weak learners) iteratively. Rather than averaging independent trees like Random Forest, each successive tree is fitted to the negative gradient (pseudo-residuals) of the loss function, steadily driving training loss toward zero.',
      prerequisites: [
        'Decision Trees & Shallow Stumps',
        'Gradient Descent in Function Space',
        'Binary Cross-Entropy Loss & Log-Odds',
        'Learning Rate Shrinkage (\\eta)'
      ],
      math: {
        intro: 'Gradient Boosting performs functional gradient descent: each new tree added to the ensemble steps in the direction that most steeply reduces total classification loss.',
        equations: [
          {
            name: 'Base Model Initialization (Prior Log-Odds)',
            latex: 'F_0(\\mathbf{x}) = \\ln\\left(\\frac{N_1}{N_0}\\right) = \\ln\\left(\\frac{\\bar{y}}{1 - \\bar{y}}\\right)',
            description: 'Begins with an optimal constant base prediction: the raw log-odds of the positive class across the entire training sample.',
            canvasConnection: 'Corresponds to Stage 0 before any boosting iterations are trained.'
          },
          {
            name: 'Negative Gradient (Pseudo-Residuals)',
            latex: 'r_{im} = -\\left[\\frac{\\partial L(y_i, F(\\mathbf{x}_i))}{\\partial F(\\mathbf{x}_i)}\\right]_{F=F_{m-1}} = y_i - \\sigma\\left(F_{m-1}(\\mathbf{x}_i)\\right)',
            description: 'For binary log-loss, the negative gradient with respect to log-odds simplifies to the residual error: true binary label $y_i \\in \\{0, 1\\}$ minus predicted probability $\\hat{p}_i$.',
            canvasConnection: 'Points that are currently misclassified have large residuals, becoming the primary focus of the next boosting tree.'
          },
          {
            name: 'Additive Update with Learning Rate (Shrinkage)',
            latex: 'F_m(\\mathbf{x}) = F_{m-1}(\\mathbf{x}) + \\eta \\sum_{j=1}^{J_m} \\gamma_{jm} \\mathbb{I}(\\mathbf{x} \\in R_{jm})',
            description: 'Tree $m$ partitions the residuals into regions $R_{jm}$ with optimal leaf step $\\gamma_{jm}$. The contribution of each tree is scaled down by learning rate $\\eta \\in (0, 1]$ (shrinkage).',
            canvasConnection: 'Tuned using the "Boosting Rounds" and "Step Weight (Shrinkage)" sliders in the controls rail.'
          },
          {
            name: 'Monotonic Loss Trajectory',
            latex: 'L\\left(y, \\sigma(F_m(\\mathbf{x}))\\right) \\le L\\left(y, \\sigma(F_{m-1}(\\mathbf{x}))\\right)',
            description: 'Because each tree steps along the negative loss gradient, training loss monotonically declines with every boosting round.',
            canvasConnection: 'The live loss curve card displays the stage-by-stage drop in training log-loss across all boosting stages.'
          }
        ],
        handTrace: {
          title: 'Trace It by Hand (Sequential Residual Stumps Walkthrough)',
          description: 'Step-by-step trace of Stage 0 base mean prediction, pseudo-residual calculation, fitting a regression stump, and shrinkage update with $\\eta = 0.5$ on a 4-point sample.',
          points: [
            { text: '(x_1=1, y_1=2)' },
            { text: '(x_2=2, y_2=3)' },
            { text: '(x_3=3, y_3=7)' },
            { text: '(x_4=4, y_4=8)' }
          ],
          steps: [
            {
              step: 'Step 1: Stage 0 Base Model Initialization',
              heading: 'Initialize with the optimal constant target mean across all points',
              latex: 'F_0(x) = \\bar{y} = \\frac{2 + 3 + 7 + 8}{4} = \\frac{20}{4} = 5.0 \\quad \\forall x'
            },
            {
              step: 'Step 2: Compute Pseudo-Residuals (r_{i1} = y_i - F_0(x_i))',
              heading: 'Calculate stage 1 error gradients to be fitted by the weak learner',
              latex: '\\begin{aligned} r_{11} &= 2 - 5.0 = -3.0 \\\\ r_{21} &= 3 - 5.0 = -2.0 \\\\ r_{31} &= 7 - 5.0 = +2.0 \\\\ r_{41} &= 8 - 5.0 = +3.0 \\\\ \\mathbf{r}_1 &= [-3.0,\\; -2.0,\\; +2.0,\\; +3.0] \\end{aligned}'
            },
            {
              step: 'Step 3: Fit Regression Stump h_1(x) to Residuals at Split x ≤ 2.5',
              heading: 'Calculate leaf means over left and right partitioned residuals',
              latex: '\\begin{aligned} \\text{Left leaf } (x \\le 2.5): & \\quad \\gamma_{11} = \\frac{r_{11} + r_{21}}{2} = \\frac{-3.0 + (-2.0)}{2} = -2.5 \\\\ \\text{Right leaf } (x > 2.5): & \\quad \\gamma_{21} = \\frac{r_{31} + r_{41}}{2} = \\frac{+2.0 + 3.0}{2} = +2.5 \\\\ h_1(x) &= \\begin{cases} -2.5 & \\text{if } x \\le 2.5 \\\\ +2.5 & \\text{if } x > 2.5 \\end{cases} \\end{aligned}'
            },
            {
              step: 'Step 4: Update Additive Ensemble with Shrinkage (η = 0.5)',
              heading: 'Compute updated predictions F_1(x) = F_0(x) + η · h_1(x)',
              latex: '\\begin{aligned} \\text{For } x \\le 2.5: & \\quad F_1(x) = 5.0 + 0.5(-2.5) = 5.0 - 1.25 = \\mathbf{3.75} \\quad (\\text{approaches } [2, 3]) \\\\ \\text{For } x > 2.5: & \\quad F_1(x) = 5.0 + 0.5(+2.5) = 5.0 + 1.25 = \\mathbf{6.25} \\quad (\\text{approaches } [7, 8]) \\end{aligned}'
            }
          ]
        }
      },
      experiments: [
        {
          title: 'High Learning Rate (Shrinkage) Overfitting',
          tag: 'Optimization Overshoot',
          setup: 'On "Two Moons", set Step Weight (Shrinkage) to 1.0 (no shrinkage) and Boosting Rounds to 15. Then reduce Shrinkage to 0.20.',
          whatBreaks: 'At shrinkage 1.0, early trees over-react to noisy points, carving jagged spike regions. At shrinkage 0.20, the boundaries contour smoothly around the moons.',
          whyItBreaks: 'High learning rates take excessive steps along the gradient, overshooting the optimal function manifold. Lower shrinkage rates ($\\eta \\le 0.2$) require more boosting stages but enforce smooth regularization.'
        },
        {
          title: 'Stage-by-Stage Boundary Sharpening',
          tag: 'Additive Refinement',
          setup: 'Select "Two Moons" and slowly advance Boosting Rounds from 1 to 10.',
          whatBreaks: 'At Stage 1, the boundary is a coarse, loose approximation with high loss. As stages accumulate, the boundary visibly tightens around the curved moons.',
          whyItBreaks: 'Each successive tree specifically targets the remaining error residuals $y_i - \\hat{p}_i$ of the previous ensemble, systematically carving away error in areas where earlier trees were uncertain.'
        }
      ],
      code: {
        filename: 'gradient_boosting.py',
        snippet: `import numpy as np
from sklearn.ensemble import GradientBoostingClassifier

# 1. Stage-by-Stage Gradient Boosting for Binary Classification (Pure NumPy)
class PureGradientBoosting:
    def __init__(self, n_stages: int = 8, lr: float = 0.3, max_depth: int = 2):
        self.n_stages = n_stages
        self.lr = lr
        self.max_depth = max_depth
        self.base_log_odds = 0.0
        self.stages = []

    def fit(self, X: np.ndarray, y: np.ndarray):
        from decision_tree_cart import fit_tree
        N = len(y)
        p1 = np.clip(np.mean(y), 1e-5, 1 - 1e-5)
        self.base_log_odds = np.log(p1 / (1 - p1))
        
        # Current ensemble prediction (log-odds)
        F = np.full(N, self.base_log_odds)
        self.stages = []
        
        for stage in range(self.n_stages):
            p = 1.0 / (1.0 + np.exp(-F))
            residuals = y - p # Negative gradient
            
            # Fit shallow tree to residuals
            tree = fit_tree(X, residuals, max_depth=self.max_depth, min_samples=2)
            self.stages.append(tree)
            
            # Predict residual update for all points
            from decision_tree_cart import TreeNode
            def predict_val(node, x):
                if node.feature is None:
                    return node.prediction
                if x[node.feature] <= node.threshold:
                    return predict_val(node.left, x)
                return predict_val(node.right, x)
                
            update = np.array([predict_val(tree, x) for x in X])
            F += self.lr * update
        return self

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        from decision_tree_cart import TreeNode
        def predict_val(node, x):
            if node.feature is None:
                return node.prediction
            if x[node.feature] <= node.threshold:
                return predict_val(node.left, x)
            return predict_val(node.right, x)
            
        F = np.full(len(X), self.base_log_odds)
        for tree in self.stages:
            update = np.array([predict_val(tree, x) for x in X])
            F += self.lr * update
        return 1.0 / (1.0 + np.exp(-F))

# 2. Scikit-Learn Verification
if __name__ == "__main__":
    X = np.array([[-2.0, 1.5], [-1.0, 2.0], [2.0, -1.5], [1.0, -2.0]])
    y = np.array([0, 0, 1, 1])
    
    gb = PureGradientBoosting(n_stages=5, lr=0.3).fit(X, y)
    print("NumPy GB probability at (0, 0):", round(gb.predict_proba([[0.0, 0.0]])[0], 3))
    
    sk_gb = GradientBoostingClassifier(n_estimators=5, learning_rate=0.3, max_depth=2, random_state=42).fit(X, y)
    print("Scikit GB probability at (0, 0):", round(sk_gb.predict_proba([[0.0, 0.0]])[0, 1], 3))`
      },
      complexity: [
        {
          stage: 'Training Stage',
          time: '$\\mathcal{O}(M \\cdot D \\cdot N \\log N \\cdot d_{\\max})$',
          space: '$\\mathcal{O}(M \\cdot 2^{d_{\\max}})$',
          notes: 'Constructs $M$ sequential trees; each stage computes gradients and sorts points across features.'
        },
        {
          stage: 'Prediction (Inference)',
          time: '$\\mathcal{O}(M \\cdot d_{\\max})$',
          space: '$\\mathcal{O}(M)$',
          notes: 'Passes test coordinates through all $M$ trees and accumulates the scaled log-odds score.'
        }
      ],
      faq: [
        {
          q: 'Why is it called "Gradient" Boosting?',
          a: 'Because each new tree is explicitly trained to fit the negative gradient of the loss function with respect to the current ensemble\'s predictions, effectively performing gradient descent directly in function space.'
        },
        {
          q: 'What is shrinkage (learning rate $\\eta$)?',
          a: 'Shrinkage scales down the contribution of each tree by a factor $\\eta \\in (0, 1]$. Using a smaller learning rate slows down learning, preventing any single tree from dominating the model and greatly enhancing test generalization.'
        },
        {
          q: 'Why are base trees in Gradient Boosting kept shallow (depth 1 to 3)?',
          a: 'Weak learners with high bias and low variance are ideal for boosting. The sequential additive framework systematically reduces bias over time, while keeping individual trees shallow prevents variance from exploding.'
        },
        {
          q: 'How does the Model Internals view display Gradient Boosting stages?',
          a: 'Studio\'s Model Internals panel features clickable tabs (`Stage 0`, `Stage 1`, etc.), letting you inspect the exact residual-fitting tree grown at each boosting iteration.'
        }
      ],
      related: [
        {
          id: 'random_forest',
          name: 'Random Forest',
          badge: 'Parallel Bagging',
          reason: 'Averages deep independent trees in parallel to reduce variance, unlike sequential gradient boosting which reduces bias.'
        },
        {
          id: 'decision_tree',
          name: 'Decision Tree (CART)',
          badge: 'Base Weak Learner',
          reason: 'The weak learner building block trained at each boosting stage to fit negative loss gradients.'
        },
        {
          id: 'neural_net',
          name: 'Neural Network (MLP)',
          badge: 'Gradient Optimization',
          reason: 'Another model trained via gradient descent to minimize cross-entropy loss, using continuous backpropagation.'
        }
      ]
    },
    neural_net: {
      id: 'neural_net',
      title: 'Neural Network (Multilayer Perceptron)',
      category: 'Deep Learning & Representation Learning',
      difficulty: 'Advanced',
      summary: 'A Multilayer Perceptron (MLP) is a feedforward artificial neural network that learns nonlinear representations by composing affine linear transformations with nonlinear activation functions across hidden layers. Optimized via gradient backpropagation, it can approximate any continuous decision boundary in the 2D plane.',
      prerequisites: [
        'Linear Algebra (Matrix Multiplications & Dot Products)',
        'Multivariable Calculus (Chain Rule & Gradients)',
        'Activation Functions (Tanh, Leaky ReLU, Sigmoid)',
        'Categorical Cross-Entropy Loss'
      ],
      math: {
        intro: 'Single-layer linear models cannot separate curved datasets like Two Moons. An MLP resolves this by projecting inputs into an intermediate hidden space where non-linear curves bend the boundary.',
        equations: [
          {
            name: 'Hidden Layer Forward Propagation',
            latex: '\\mathbf{z}^{(1)} = \\mathbf{W}^{(1)} \\mathbf{x} + \\mathbf{b}^{(1)}, \\quad \\mathbf{a}^{(1)} = g\\left(\\mathbf{z}^{(1)}\\right)',
            description: 'Projects 2D input coordinates into an $H$-dimensional hidden feature space through weight matrix $\\mathbf{W}^{(1)} \\in \\mathbb{R}^{H \\times 2}$ and bias $\\mathbf{b}^{(1)}$, followed by activation $g(z)$ (Tanh, Leaky ReLU, or Sigmoid).',
            canvasConnection: 'Adjusting "Hidden Neurons" (2 to 8) controls the width of this hidden representation.'
          },
          {
            name: 'Softmax Output Probabilities',
            latex: '\\mathbf{z}^{(2)} = \\mathbf{W}^{(2)} \\mathbf{a}^{(1)} + \\mathbf{b}^{(2)}, \\quad \\hat{y}_c = \\frac{e^{z_c^{(2)}}}{\\sum_{k=1}^C e^{z_k^{(2)}}}',
            description: 'Maps hidden representations to output logits $\\mathbf{z}^{(2)} \\in \\mathbb{R}^C$ and computes normalized posterior probabilities $\\hat{y}_c = P(y=c|\\mathbf{x})$ summing to 1.0.',
            canvasConnection: 'Background color intensity shows classification confidence; white borders mark class boundary thresholds.'
          },
          {
            name: 'Categorical Cross-Entropy Loss',
            latex: 'J(\\mathbf{W}, \\mathbf{b}) = -\\frac{1}{N} \\sum_{i=1}^N \\sum_{c=1}^C y_{ic} \\ln\\left(\\hat{y}_{ic}\\right)',
            description: 'Measures total divergence between one-hot ground-truth labels and predicted probability distributions.',
            canvasConnection: 'Tracked continuously on the live "Training Loss Over Steps" chart during training iterations.'
          },
          {
            name: 'Backpropagation Gradient Flow',
            latex: '\\boldsymbol{\\delta}^{(2)} = \\hat{\\mathbf{y}} - \\mathbf{y}, \\quad \\boldsymbol{\\delta}^{(1)} = \\left((\\mathbf{W}^{(2)})^T \\boldsymbol{\\delta}^{(2)}\\right) \\odot g\'\\left(\\mathbf{z}^{(1)}\\right), \\quad \\frac{\\partial J}{\\partial \\mathbf{W}^{(1)}} = \\boldsymbol{\\delta}^{(1)} \\mathbf{x}^T',
            description: 'Applies the multivariate chain rule backward from the output layer to compute parameter gradients for all hidden synapses.',
            canvasConnection: 'In the Model Internals panel, the interactive network diagram colors each synapse edge by its live weight value.'
          }
        ],
        handTrace: {
          title: 'Trace It by Hand (Forward Pass & Backpropagation Walkthrough)',
          description: 'Step-by-step trace of forward propagation, squared error loss, backpropagation chain rule gradients, and weight updates for a minimal network (1 input, 1 Tanh hidden neuron, 1 linear output) on sample $(x=1.0, y=1.0)$ with $\\eta = 0.1$.',
          points: [
            { text: 'Sample: x = 1.0, y = 1.0' },
            { text: 'Initial: w_1 = 0.5, b_1 = 0.0' },
            { text: 'Initial: w_2 = 0.8, b_2 = 0.0' },
            { text: 'Learning Rate: \\eta = 0.1' }
          ],
          steps: [
            {
              step: 'Step 1: Forward Pass (Hidden Pre-Activation, Tanh, and Output Prediction)',
              heading: 'Propagate input through hidden neuron to generate prediction \\hat{y}',
              latex: '\\begin{aligned} \\text{Hidden pre-activation: } & \\quad z_1 = w_1 x + b_1 = 0.5(1.0) + 0.0 = 0.500 \\\\ \\text{Hidden activation: } & \\quad a_1 = \\tanh(0.500) \\approx 0.462 \\\\ \\text{Output prediction: } & \\quad \\hat{y} = w_2 a_1 + b_2 = 0.8(0.462) + 0.0 = \\mathbf{0.370} \\end{aligned}'
            },
            {
              step: 'Step 2: Evaluate Squared Error Loss',
              heading: 'Calculate objective loss penalty on the forward prediction',
              latex: 'L = \\frac{1}{2}(\\hat{y} - y)^2 = \\frac{1}{2}(0.370 - 1.0)^2 = \\frac{1}{2}(-0.630)^2 = \\frac{0.3969}{2} \\approx \\mathbf{0.198}'
            },
            {
              step: 'Step 3: Backward Pass via Chain Rule (Output & Hidden Gradients)',
              heading: 'Propagate error gradients backward through the network synapses',
              latex: '\\begin{aligned} \\text{Output error: } & \\quad \\delta_2 = \\frac{\\partial L}{\\partial \\hat{y}} = \\hat{y} - y = 0.370 - 1.0 = -0.630 \\\\ \\text{Output weight gradient: } & \\quad \\frac{\\partial L}{\\partial w_2} = \\delta_2 \\cdot a_1 = (-0.630)(0.462) \\approx -0.291 \\\\ \\text{Hidden error: } & \\quad \\delta_1 = \\delta_2 \\cdot w_2 \\cdot (1 - a_1^2) = (-0.630)(0.8)(1 - 0.462^2) = (-0.504)(0.786) \\approx -0.396 \\\\ \\text{Input weight gradient: } & \\quad \\frac{\\partial L}{\\partial w_1} = \\delta_1 \\cdot x = (-0.396)(1.0) = -0.396 \\end{aligned}'
            },
            {
              step: 'Step 4: Gradient Descent Weight Updates (η = 0.1)',
              heading: 'Adjust weights in the opposite direction of the gradients',
              latex: '\\begin{aligned} w_2^{\\text{new}} &= w_2 - \\eta \\frac{\\partial L}{\\partial w_2} = 0.8 - 0.1(-0.291) = 0.8 + 0.0291 = \\mathbf{0.829} \\\\ w_1^{\\text{new}} &= w_1 - \\eta \\frac{\\partial L}{\\partial w_1} = 0.5 - 0.1(-0.396) = 0.5 + 0.0396 = \\mathbf{0.540} \\end{aligned}'
            }
          ]
        }
      },
      experiments: [
        {
          title: 'Hidden Layer Capacity Bottleneck (2 vs 6 Neurons)',
          tag: 'Representation Limits',
          setup: 'Select "Two Moons", set Hidden Neurons to 2, click Train for 150 steps, then increase Hidden Neurons to 6 and retrain.',
          whatBreaks: 'With only 2 hidden neurons, the network gets stuck around ~75% accuracy with an awkward flat wedge. With 6 neurons, it wraps cleanly around both crescent arcs with >95% accuracy.',
          whyItBreaks: 'Each hidden neuron computes a single hyperplanar cut. With only 2 neurons, the network can only map the input space into a 2D feature manifold bounded by two cuts. By the Universal Approximation Theorem, capturing complex non-convex topological twists requires sufficient hidden width.'
        },
        {
          title: 'Sigmoid Saturation & Vanishing Gradients',
          tag: 'Gradient Flow Failure',
          setup: 'Switch Activation Curve to "Sigmoid", lower Learning Rate to 0.05, and train on "Two Moons". Compare against "Tanh" or "Leaky ReLU".',
          whatBreaks: 'Sigmoid training crawls forward at a sluggish pace, taking 5x more steps to bend the boundary compared to Tanh or Leaky ReLU.',
          whyItBreaks: 'The derivative of the standard sigmoid $\\sigma\'(z) = \\sigma(z)(1 - \\sigma(z))$ has a maximum value of only $0.25$ at $z=0$ and rapidly approaches 0 for $|z| > 2$. Multiplying by fractions $< 0.25$ during backpropagation causes error gradients $\\boldsymbol{\\delta}^{(1)}$ to vanish exponentially before reaching the first layer.'
        }
      ],
      code: {
        filename: 'neural_network_mlp.py',
        snippet: `import numpy as np
from sklearn.neural_network import MLPClassifier

# 1. Two-Layer Multilayer Perceptron (Pure NumPy)
class PureMLP:
    def __init__(self, n_hidden: int = 5, activation: str = 'tanh', lr: float = 0.1):
        self.n_hidden = n_hidden
        self.activation = activation
        self.lr = lr
        self.W1, self.b1 = None, None
        self.W2, self.b2 = None, None

    def _act(self, z):
        if self.activation == 'tanh':
            return np.tanh(z)
        elif self.activation == 'relu':
            return np.maximum(0.01 * z, z) # Leaky ReLU
        return 1.0 / (1.0 + np.exp(-np.clip(z, -500, 500))) # Sigmoid

    def _act_grad(self, z, a):
        if self.activation == 'tanh':
            return 1.0 - a ** 2
        elif self.activation == 'relu':
            return np.where(z > 0, 1.0, 0.01)
        return a * (1.0 - a)

    def fit(self, X: np.ndarray, y: np.ndarray, epochs: int = 250):
        N, D = X.shape
        C = len(np.unique(y))
        
        # Xavier/He parameter initialization
        np.random.seed(42)
        self.W1 = np.random.randn(D, self.n_hidden) * np.sqrt(2.0 / D)
        self.b1 = np.zeros(self.n_hidden)
        self.W2 = np.random.randn(self.n_hidden, C) * np.sqrt(2.0 / self.n_hidden)
        self.b2 = np.zeros(C)
        
        Y_onehot = np.eye(C)[y]
        
        for _ in range(epochs):
            # Forward pass
            z1 = np.dot(X, self.W1) + self.b1
            a1 = self._act(z1)
            z2 = np.dot(a1, self.W2) + self.b2
            exp_z2 = np.exp(z2 - np.max(z2, axis=1, keepdims=True))
            probs = exp_z2 / np.sum(exp_z2, axis=1, keepdims=True)
            
            # Backpropagation
            d2 = (probs - Y_onehot) / N
            dW2 = np.dot(a1.T, d2)
            db2 = np.sum(d2, axis=0)
            
            d1 = np.dot(d2, self.W2.T) * self._act_grad(z1, a1)
            dW1 = np.dot(X.T, d1)
            db1 = np.sum(d1, axis=0)
            
            # Gradient descent step
            self.W1 -= self.lr * dW1
            self.b1 -= self.lr * db1
            self.W2 -= self.lr * dW2
            self.b2 -= self.lr * db2
        return self

# 2. Scikit-Learn Verification
if __name__ == "__main__":
    X = np.array([[-2.0, 1.5], [-1.0, 2.0], [2.0, -1.5], [1.0, -2.0]])
    y = np.array([0, 0, 1, 1])
    
    mlp = PureMLP(n_hidden=4, activation='tanh', lr=0.1).fit(X, y)
    print("NumPy MLP trained successfully.")
    
    sk_mlp = MLPClassifier(hidden_layer_sizes=(4,), activation='tanh', max_iter=250, random_state=42).fit(X, y)
    print("Scikit MLP score:", sk_mlp.score(X, y))`
      },
      complexity: [
        {
          stage: 'Training Stage (Per Epoch)',
          time: '$\\mathcal{O}(N \\cdot (D \\cdot H + H \\cdot C))$',
          space: '$\\mathcal{O}(D \\cdot H + H \\cdot C)$',
          notes: 'Full forward pass and backpropagation matrix multiplications scaled across all $N$ data points.'
        },
        {
          stage: 'Prediction (Inference)',
          time: '$\\mathcal{O}(D \\cdot H + H \\cdot C)$',
          space: '$\\mathcal{O}(H + C)$',
          notes: 'Two dense matrix-vector multiplications followed by scalar softmax normalization.'
        }
      ],
      faq: [
        {
          q: 'What is the Universal Approximation Theorem?',
          a: 'A feedforward neural network with a single hidden layer containing a finite number of non-linear neurons can approximate any continuous function on compact subsets of $\\mathbb{R}^D$ to arbitrary precision.'
        },
        {
          q: 'Why are non-linear activation functions mandatory?',
          a: 'Without activation functions, stacking multiple layers is equivalent to chaining linear matrices: $\\mathbf{W}_2 (\\mathbf{W}_1 \\mathbf{x}) = (\\mathbf{W}_2 \\mathbf{W}_1) \\mathbf{x} = \\mathbf{W}_{\\text{net}} \\mathbf{x}$. The entire deep network mathematically collapses into a single-layer linear model.'
        },
        {
          q: 'Why does Tanh generally train faster than standard Sigmoid?',
          a: 'Tanh is zero-centered with output range $(-1, 1)$ and a maximum derivative of $1.0$ at the origin, preventing directional bias in gradient updates and resisting vanishing gradients better than Sigmoid (range $(0, 1)$ with max derivative $0.25$).'
        },
        {
          q: 'What does the Model Internals view show for Neural Network?',
          a: 'Studio renders an interactive neural architecture diagram below the canvas, displaying input nodes, hidden neurons, output units, and connecting synapses colored dynamically by weight sign and magnitude.'
        }
      ],
      related: [
        {
          id: 'logistic_reg',
          name: 'Logistic Regression',
          badge: 'Single Neuron',
          reason: 'A simplified neural network with 0 hidden layers and a single sigmoid output neuron.'
        },
        {
          id: 'gradient_boosting',
          name: 'Gradient Boosting',
          badge: 'Ensemble Learning',
          reason: 'Another non-linear optimizer that minimizes cross-entropy loss, using additive decision trees rather than backpropagation.'
        },
        {
          id: 'svm',
          name: 'Linear Support Vector Machine',
          badge: 'Max-Margin Model',
          reason: 'Finds optimal linear separating hyperplanes, serving as the linear upper bound before adding hidden neural layers.'
        }
      ]
    },
    kmeans: {
      id: 'kmeans',
      title: 'K-Means Clustering',
      category: 'Unsupervised Learning (Partitional Clustering)',
      difficulty: 'Beginner',
      summary: 'K-Means is an unsupervised iterative clustering algorithm that partitions $N$ unlabeled points into $K$ distinct clusters. It alternates between two steps: assigning each point to its closest centroid, and updating each centroid to the arithmetic mean of its assigned cluster members.',
      prerequisites: [
        'Euclidean Distance (L2 Metric)',
        'Arithmetic Centroids (Mean Vectors)',
        'Expectation-Maximization (EM) Concept',
        'Within-Cluster Sum of Squares (Inertia)'
      ],
      math: {
        intro: 'Operating without ground-truth labels, K-Means seeks natural spatial groupings by iteratively minimizing total cluster dispersion.',
        equations: [
          {
            name: 'Objective Function (Inertia / WCSS)',
            latex: 'J(\\mathbf{c}_1, \\dots, \\mathbf{c}_K) = \\sum_{k=1}^K \\sum_{\\mathbf{x}_i \\in S_k} \\|\\mathbf{x}_i - \\mathbf{c}_k\\|_2^2',
            description: 'Quantifies Within-Cluster Sum of Squares (WCSS). The algorithm seeks centroid coordinates $\\mathbf{c}_k$ and cluster sets $S_k$ that minimize $J$.',
            canvasConnection: 'Displayed live in the "Inertia" metric card and plotted step-by-step on the loss chart until convergence.'
          },
          {
            name: 'Assignment Step (Expectation)',
            latex: 'S_k^{(t)} = \\left\\{ \\mathbf{x}_i : \\|\\mathbf{x}_i - \\mathbf{c}_k^{(t)}\\|^2 \\le \\|\\mathbf{x}_i - \\mathbf{c}_j^{(t)}\\|^2, \\; \\forall j \\in \\{1, \\dots, K\\} \\right\\}',
            description: 'Holds centroid positions fixed and assigns each point to the nearest centroid, carving the plane into Voronoi cells.',
            canvasConnection: 'Points instantly adopt the color of their assigned centroid when clicking "Step" or "Train".'
          },
          {
            name: 'Centroid Update Step (Maximization)',
            latex: '\\mathbf{c}_k^{(t+1)} = \\frac{1}{|S_k^{(t)}|} \\sum_{\\mathbf{x}_i \\in S_k^{(t)}} \\mathbf{x}_i',
            description: 'Holds point assignments fixed and relocates each centroid to the exact geometric center of mass of its assigned cluster.',
            canvasConnection: 'Dashed trail lines trace the trajectory of centroids shifting toward point cluster means.'
          },
          {
            name: 'Convergence Guarantee',
            latex: '\\mathbf{c}_k^{(t+1)} = \\mathbf{c}_k^{(t)} \\quad \\forall k \\in \\{1, \\dots, K\\} \\quad \\iff \\quad J^{(t+1)} = J^{(t)}',
            description: 'Because the number of partitions is finite and each step strictly decreases or maintains $J$, Lloyd\'s algorithm is guaranteed to converge in a finite number of iterations.',
            canvasConnection: 'Execution automatically halts with a toast notification: "K-Means converged at step X".'
          }
        ],
        handTrace: {
          title: 'Trace It by Hand (Centroid Assignment & Update Walkthrough)',
          description: 'Step-by-step trace of Lloyd\'s algorithm: Voronoi distance assignment, centroid mean updates, and Inertia (WCSS) calculation for 4 points with initial centroids $\\mu_1 = (1, 1), \\mu_2 = (5, 1)$ ($K = 2$).',
          points: [
            { text: 'A = (1, 1)' },
            { text: 'B = (1, 3)' },
            { text: 'C = (5, 1)' },
            { text: 'D = (5, 3)' },
            { text: 'Initial Centroids: \\mu_1=(1, 1), \\mu_2=(5, 1)' }
          ],
          steps: [
            {
              step: 'Step 1: Assignment Step (Squared Euclidean Distance to Initial Centroids)',
              heading: 'Assign each point to its closest centroid',
              latex: '\\begin{aligned} A(1, 1): & \\quad d^2(\\mu_1) = (1-1)^2 + (1-1)^2 = 0, \\; d^2(\\mu_2) = (1-5)^2 + (1-1)^2 = 16 \\implies \\mathbf{\\text{Cluster 1}} \\\\ B(1, 3): & \\quad d^2(\\mu_1) = (1-1)^2 + (3-1)^2 = 4, \\; d^2(\\mu_2) = (1-5)^2 + (3-1)^2 = 20 \\implies \\mathbf{\\text{Cluster 1}} \\\\ C(5, 1): & \\quad d^2(\\mu_1) = (5-1)^2 + (1-1)^2 = 16, \\; d^2(\\mu_2) = (5-5)^2 + (1-1)^2 = 0 \\implies \\mathbf{\\text{Cluster 2}} \\\\ D(5, 3): & \\quad d^2(\\mu_1) = (5-1)^2 + (3-1)^2 = 20, \\; d^2(\\mu_2) = (5-5)^2 + (3-1)^2 = 4 \\implies \\mathbf{\\text{Cluster 2}} \\end{aligned}'
            },
            {
              step: 'Step 2: Centroid Update Step (Arithmetic Mean of Clusters)',
              heading: 'Shift centroids to the center of mass of their assigned members',
              latex: '\\begin{aligned} \\mu_1^{\\text{new}} &= \\left(\\frac{1 + 1}{2}, \\; \\frac{1 + 3}{2}\\right) = \\mathbf{(1.0, \\; 2.0)} \\\\ \\mu_2^{\\text{new}} &= \\left(\\frac{5 + 5}{2}, \\; \\frac{1 + 3}{2}\\right) = \\mathbf{(5.0, \\; 2.0)} \\end{aligned}'
            },
            {
              step: 'Step 3: Evaluate Within-Cluster Sum of Squares (Inertia)',
              heading: 'Compute total squared distance from all points to their updated centroids',
              latex: '\\begin{aligned} J(\\text{Cluster 1}) &= \\left[(1-1)^2 + (1-2)^2\\right] + \\left[(1-1)^2 + (3-2)^2\\right] = 1 + 1 = 2.0 \\\\ J(\\text{Cluster 2}) &= \\left[(5-5)^2 + (1-2)^2\\right] + \\left[(5-5)^2 + (3-2)^2\\right] = 1 + 1 = 2.0 \\\\ \\text{Total Inertia } J &= 2.0 + 2.0 = \\mathbf{4.0} \\quad (\\text{Converged: assignments do not change on Step 2}) \\end{aligned}'
            }
          ]
        }
      },
      experiments: [
        {
          title: 'Non-Convex / Intertwined Cluster Failure (Two Moons)',
          tag: 'Geometric Assumption',
          setup: 'Select "Two Moons (Curved)", set Number of Clusters (K) to 2, and click Train.',
          whatBreaks: 'Instead of separating the two intertwined crescent moons, K-Means slices both moons across the center, creating two arbitrary spherical halves.',
          whyItBreaks: 'K-Means optimizes squared Euclidean distance from a central prototype vector, imposing a spherical Gaussian inductive bias. It assumes all clusters are convex, isotropic, and linearly separable by Voronoi partitions; it cannot follow manifold topological contours.'
        },
        {
          title: 'Sensitivity to Initialization (Bad Local Optima)',
          tag: 'Local Minimum Trap',
          setup: 'On "3 Cluster Blobs", click "Reseed" several times and click Train.',
          whatBreaks: 'Occasionally, two centroids initialize inside the same single cluster blob while one centroid is stranded between the remaining two blobs, getting trapped in a poor local minimum with much higher inertia.',
          whyItBreaks: 'Lloyd\'s algorithm is a greedy local descent method, not a global optimizer. The loss surface $J$ has numerous sub-optimal local minima; modern implementations combat this with K-Means++ seeded initialization or multiple random restarts.'
        }
      ],
      code: {
        filename: 'k_means_clustering.py',
        snippet: `import numpy as np
from sklearn.cluster import KMeans

# 1. Pure NumPy Vectorized K-Means (Lloyd's Algorithm)
class PureKMeans:
    def __init__(self, k: int = 3, max_iters: int = 100):
        self.k = k
        self.max_iters = max_iters
        self.centroids = None

    def fit(self, X: np.ndarray):
        np.random.seed(42)
        N = len(X)
        # Random initial centroids
        initial_idx = np.random.choice(N, size=self.k, replace=False)
        self.centroids = X[initial_idx].copy()
        
        for iteration in range(self.max_iters):
            # Assignment step: compute squared distance to all centroids
            dists = np.sum((X[:, np.newaxis, :] - self.centroids[np.newaxis, :, :]) ** 2, axis=2)
            labels = np.argmin(dists, axis=1)
            
            # Update step: compute new means
            new_centroids = np.array([
                X[labels == j].mean(axis=0) if np.sum(labels == j) > 0 else self.centroids[j]
                for j in range(self.k)
            ])
            
            # Check convergence
            if np.allclose(self.centroids, new_centroids):
                break
            self.centroids = new_centroids
        return self

# 2. Scikit-Learn Verification
if __name__ == "__main__":
    X = np.array([[-2.0, 2.0], [-1.8, 1.9], [2.0, -2.0], [1.9, -1.8]])
    
    km = PureKMeans(k=2).fit(X)
    print("NumPy Centroids:\\n", km.centroids.round(2))
    
    sk_km = KMeans(n_clusters=2, n_init=1, random_state=42).fit(X)
    print("Scikit Centroids:\\n", sk_km.cluster_centers_.round(2))`
      },
      complexity: [
        {
          stage: 'Training (Per Iteration)',
          time: '$\\mathcal{O}(K \\cdot N \\cdot D)$',
          space: '$\\mathcal{O}(N + K \\cdot D)$',
          notes: 'Computes distance between all $N$ samples and $K$ centroids, then recalculates $K$ cluster means.'
        },
        {
          stage: 'Prediction (Assigning New Point)',
          time: '$\\mathcal{O}(K \\cdot D)$',
          space: '$\\mathcal{O}(1)$',
          notes: 'Evaluates Euclidean distance from query point to all $K$ stored centroids.'
        }
      ],
      faq: [
        {
          q: 'How do you choose the optimal number of clusters K?',
          a: 'Common heuristic techniques include the Elbow Method—plotting Inertia vs $K$ to spot the point of diminishing returns—and Silhouette Analysis, which measures how well-separated and cohesive clusters are.'
        },
        {
          q: 'Is K-Means guaranteed to find the globally optimal clustering?',
          a: 'No. Lloyd\'s algorithm is guaranteed to converge to a local minimum, but not necessarily the global optimum. Running multiple random restarts or using K-Means++ initialization mitigates bad initial seeds.'
        },
        {
          q: 'Why does K-Means struggle with clusters of unequal size or density?',
          a: 'Because the objective minimizes total sum of squared Euclidean errors, larger or denser clusters exert disproportionate leverage, pulling centroids away from smaller, sparse clusters.'
        },
        {
          q: 'What do the dashed lines trailing behind centroids represent?',
          a: 'In the Studio canvas, dashed lines trace the step-by-step movement history of each centroid from its initial seed location to its converged center of mass.'
        }
      ],
      related: [
        {
          id: 'pca',
          name: 'Principal Component Analysis (PCA)',
          badge: 'Unsupervised Subspace',
          reason: 'An unsupervised method that finds continuous orthogonal projection axes rather than discrete partitional centroids.'
        },
        {
          id: 'knn',
          name: 'K-Nearest Neighbors',
          badge: 'Instance Classifier',
          reason: 'Uses identical Euclidean distance metrics, but operates in a supervised setting with ground-truth class labels.'
        },
        {
          id: 'naive_bayes',
          name: 'Gaussian Naive Bayes',
          badge: 'Generative Model',
          reason: 'Models continuous Gaussian densities around class means, mathematically resembling soft probabilistic clustering.'
        }
      ]
    },
    pca: {
      id: 'pca',
      title: 'Principal Component Analysis (PCA)',
      category: 'Unsupervised Learning (Dimensionality Reduction)',
      difficulty: 'Intermediate',
      summary: 'Principal Component Analysis (PCA) is an unsupervised linear technique for dimensionality reduction. It identifies orthogonal axes of maximum variance (principal components) by performing an eigendecomposition of the data covariance matrix, allowing 2D data to be projected onto a 1D subspace while minimizing reconstruction error.',
      prerequisites: [
        'Sample Covariance Matrix',
        'Eigenvalues & Eigenvectors',
        'Orthogonal Projections & Dot Products',
        'Total Variance & Information Retention'
      ],
      math: {
        intro: 'PCA rotates the coordinate frame into alignment with the data\'s natural spread, identifying the primary direction where information variance is maximized.',
        equations: [
          {
            name: 'Mean Centering (Data Centering)',
            latex: '\\tilde{\\mathbf{x}}_i = \\mathbf{x}_i - \\boldsymbol{\\mu}, \\quad \\boldsymbol{\\mu} = \\frac{1}{N} \\sum_{i=1}^N \\mathbf{x}_i',
            description: 'Shifts the origin to the center of mass $\\boldsymbol{\\mu}$, ensuring the first principal component passes directly through the centroid of the data.',
            canvasConnection: 'The intersection point where the red (PC1) and purple (PC2) component axes cross marks the exact data mean $\\boldsymbol{\\mu}$.'
          },
          {
            name: 'Sample Covariance Matrix',
            latex: '\\boldsymbol{\\Sigma} = \\frac{1}{N - 1} \\sum_{i=1}^N \\tilde{\\mathbf{x}}_i \\tilde{\\mathbf{x}}_i^T = \\frac{1}{N - 1} \\tilde{\\mathbf{X}}^T \\tilde{\\mathbf{X}} = \\begin{bmatrix} \\operatorname{Var}(X) & \\operatorname{Cov}(X, Y) \\\\ \\operatorname{Cov}(X, Y) & \\operatorname{Var}(Y) \\end{bmatrix}',
            description: 'Measures pairwise linear correlation between feature coordinates. If points spread diagonally, $\\operatorname{Cov}(X, Y) \\neq 0$.',
            canvasConnection: 'Plotted points distributed along a tilted ellipse generate high covariance.'
          },
          {
            name: 'Eigendecomposition & Principal Axes',
            latex: '\\boldsymbol{\\Sigma} \\mathbf{v}_1 = \\lambda_1 \\mathbf{v}_1, \\quad \\boldsymbol{\\Sigma} \\mathbf{v}_2 = \\lambda_2 \\mathbf{v}_2 \\quad (\\lambda_1 \\ge \\lambda_2 \\ge 0)',
            description: 'Eigenvectors $\\mathbf{v}_1, \\mathbf{v}_2$ define the principal axes of rotation; eigenvalues $\\lambda_1, \\lambda_2$ equal the exact variance preserved along each axis.',
            canvasConnection: 'The red vector is PC1 ($\\mathbf{v}_1$), scaled by its eigenvalue spread; the purple vector is PC2 ($\\mathbf{v}_2$), always strictly perpendicular ($90^\\circ$) to PC1.'
          },
          {
            name: 'Explained Variance Ratio & 1D Projection',
            latex: '\\text{Ratio}_1 = \\frac{\\lambda_1}{\\lambda_1 + \\lambda_2}, \\quad \\hat{\\mathbf{x}}_i = \\boldsymbol{\\mu} + (\\tilde{\\mathbf{x}}_i \\cdot \\mathbf{v}_1) \\mathbf{v}_1',
            description: 'Ratio 1 quantifies the fraction of total variance preserved when compressing 2D points onto 1D. Projection $\\hat{\\mathbf{x}}_i$ minimizes sum of squared orthogonal reconstruction errors.',
            canvasConnection: 'Dotted yellow segments show orthogonal projection lines connecting each original 2D point to its reconstructed 1D position on PC1.'
          }
        ],
        handTrace: {
          title: 'Trace It by Hand (Covariance Eigendecomposition & 1D Projection)',
          description: 'Step-by-step trace of sample covariance matrix calculation, characteristic polynomial eigendecomposition, explained variance ratio, and 1D orthogonal projection for 4 zero-mean 2D points.',
          points: [
            { text: '(-2, -1)' },
            { text: '(-1, -1)' },
            { text: '(1, 1)' },
            { text: '(2, 1)' }
          ],
          steps: [
            {
              step: 'Step 1: Compute 2×2 Sample Covariance Matrix (n = 4, ddof = 1)',
              heading: 'Evaluate variances and cross-covariance (zero-mean data: \\bar{x}=0, \\bar{y}=0)',
              latex: '\\begin{aligned} \\operatorname{Var}(x) &= \\frac{(-2)^2 + (-1)^2 + 1^2 + 2^2}{3} = \\frac{4 + 1 + 1 + 4}{3} = \\frac{10}{3} \\approx 3.333 \\\\ \\operatorname{Var}(y) &= \\frac{(-1)^2 + (-1)^2 + 1^2 + 1^2}{3} = \\frac{1 + 1 + 1 + 1}{3} = \\frac{4}{3} \\approx 1.333 \\\\ \\operatorname{Cov}(x, y) &= \\frac{(-2)(-1) + (-1)(-1) + (1)(1) + (2)(1)}{3} = \\frac{2 + 1 + 1 + 2}{3} = \\frac{6}{3} = 2.000 \\\\ \\boldsymbol{\\Sigma} &= \\begin{bmatrix} 3.333 & 2.000 \\\\ 2.000 & 1.333 \\end{bmatrix} \\end{aligned}'
            },
            {
              step: 'Step 2: Solve Characteristic Equation det(Σ - λI) = 0 for Eigenvalues',
              heading: 'Calculate total spread preserved along principal axes',
              latex: '\\begin{aligned} \\operatorname{Tr}(\\boldsymbol{\\Sigma}) &= 3.333 + 1.333 = 4.667, \\quad \\det(\\boldsymbol{\\Sigma}) = (3.333)(1.333) - (2.0)^2 = 4.444 - 4.0 = 0.444 \\\\ \\lambda^2 &- 4.667 \\lambda + 0.444 = 0 \\implies \\lambda = \\frac{4.667 \\pm \\sqrt{4.667^2 - 4(0.444)}}{2} \\\\ \\lambda_1 &\\approx \\mathbf{4.570}, \\quad \\lambda_2 \\approx \\mathbf{0.097} \\end{aligned}'
            },
            {
              step: 'Step 3: Compute Explained Variance Ratio for PC1 and PC2',
              heading: 'Determine percentage of total information retained in 1D',
              latex: '\\begin{aligned} \\text{Total Variance} &= \\lambda_1 + \\lambda_2 = 4.570 + 0.097 = 4.667 \\\\ \\text{PC1 Variance Ratio} &= \\frac{4.570}{4.667} = \\mathbf{97.9\\%} \\\\ \\text{PC2 Variance Ratio} &= \\frac{0.097}{4.667} = \\mathbf{2.1\\%} \\end{aligned}'
            },
            {
              step: 'Step 4: 1D Subspace Projection of Point (2, 1)',
              heading: 'Project point onto unit eigenvector v_1 ≈ [0.851, 0.526]^T',
              latex: 'z_1 = \\mathbf{x} \\cdot \\mathbf{v}_1 = 2(0.851) + 1(0.526) = 1.702 + 0.526 = \\mathbf{2.228}'
            }
          ]
        }
      },
      experiments: [
        {
          title: 'Perpendicular Reconstruction vs Vertical Regression Error',
          tag: 'Objective Discrepancy',
          setup: 'Compare PCA on "Linear + Noise" against Linear Regression in Duel Mode or inspect projection lines.',
          whatBreaks: 'Linear Regression minimizes vertical error ($y_i - \\hat{y}_i$), whereas PCA minimizes shortest perpendicular (orthogonal) distance.',
          whyItBreaks: 'Linear Regression assumes $x$ is fixed without error and only $y$ contains noise. PCA treats $x$ and $y$ symmetrically as noisy coordinate observations, finding the axis that minimizes total orthogonal Euclidean distance to the line.'
        },
        {
          title: 'Isotropic Circular Data (Spherical Symmetry Collapse)',
          tag: 'Eigenvalue Degeneracy',
          setup: 'Select "3 Cluster Blobs" or place points in an evenly spaced circular ring around the origin.',
          whatBreaks: 'Both eigenvalues become equal ($\\lambda_1 \\approx \\lambda_2$), causing explained variance ratio to split 50% / 50%. The component axes spin arbitrarily when adding a single point.',
          whyItBreaks: 'When data has isotropic covariance ($\\boldsymbol{\\Sigma} \\approx \\sigma^2 \\mathbf{I}$), variance is uniform in all directions. The eigenspace is degenerate; any orthogonal coordinate frame serves as a valid eigenbasis, so there is no unique principal direction.'
        }
      ],
      code: {
        filename: 'principal_component_analysis.py',
        snippet: `import numpy as np
from sklearn.decomposition import PCA

# 1. Pure NumPy Vectorized PCA (2D to 1D)
class PurePCA:
    def __init__(self, n_components: int = 1):
        self.n_components = n_components
        self.mean = None
        self.components = None
        self.explained_variance_ratio = None

    def fit(self, X: np.ndarray):
        N = len(X)
        self.mean = np.mean(X, axis=0)
        X_centered = X - self.mean
        
        # Sample covariance matrix
        cov = np.cov(X_centered, rowvar=False, ddof=1)
        
        # Eigendecomposition
        eigenvalues, eigenvectors = np.linalg.eigh(cov)
        
        # Sort in descending order
        idx = np.argsort(eigenvalues)[::-1]
        sorted_vals = eigenvalues[idx]
        sorted_vecs = eigenvectors[:, idx]
        
        total_var = np.sum(sorted_vals)
        self.explained_variance_ratio = sorted_vals / total_var if total_var > 0 else np.array([1.0, 0.0])
        self.components = sorted_vecs[:, :self.n_components]
        return self

    def transform(self, X: np.ndarray) -> np.ndarray:
        return np.dot(X - self.mean, self.components)

# 2. Scikit-Learn Verification
if __name__ == "__main__":
    X = np.array([[-3.1, -2.4], [-1.5, -0.8], [0.2, 1.1], [1.8, 2.9], [3.4, 4.2]])
    
    pca = PurePCA(n_components=1).fit(X)
    print("NumPy PC1 Vector:  ", pca.components.ravel().round(4))
    print(f"NumPy PC1 Variance: {pca.explained_variance_ratio[0] * 100:.2f}%")
    
    sk_pca = PCA(n_components=1).fit(X)
    print("Scikit PC1 Vector: ", sk_pca.components_[0].round(4))
    print(f"Scikit PC1 Variance: {sk_pca.explained_variance_ratio_[0] * 100:.2f}%")`
      },
      complexity: [
        {
          stage: 'Training (Covariance Eigendecomposition)',
          time: '$\\mathcal{O}(N D^2 + D^3)$',
          space: '$\\mathcal{O}(D^2)$',
          notes: 'Computing $D \\times D$ covariance takes $N D^2$; symmetric eigendecomposition takes $D^3$.'
        },
        {
          stage: 'Prediction (Projecting to K Components)',
          time: '$\\mathcal{O}(N \\cdot D \\cdot K)$',
          space: '$\\mathcal{O}(N \\cdot K)$',
          notes: 'Dense matrix multiplication projecting $N$ centered samples onto $K$ principal axes.'
        }
      ],
      faq: [
        {
          q: 'How does PCA differ from Linear Regression?',
          a: 'Linear regression is a supervised method that minimizes vertical target error $y - \\hat{y}$. PCA is an unsupervised method that treats $x$ and $y$ symmetrically, minimizing perpendicular (orthogonal) geometric distance from data points to the subspace.'
        },
        {
          q: 'Why are principal components always strictly perpendicular to each other?',
          a: 'The sample covariance matrix $\\boldsymbol{\\Sigma}$ is real and symmetric. By the Spectral Theorem, the eigenvectors of any real symmetric matrix corresponding to distinct eigenvalues are guaranteed to be mutually orthogonal ($90^\\circ$).'
        },
        {
          q: 'Why must data be mean-centered before performing PCA?',
          a: 'Without mean-centering, the first principal component would point from the origin $(0, 0)$ toward the center of mass of the data cloud rather than along the axis of maximum internal data spread.'
        },
        {
          q: 'What do the yellow line segments on the canvas represent?',
          a: 'The yellow segments illustrate orthogonal reconstruction errors—the shortest perpendicular distance connecting each 2D point to its projected 1D coordinate on the PC1 axis.'
        }
      ],
      related: [
        {
          id: 'linear_reg',
          name: 'Linear Regression',
          badge: 'Supervised Counterpart',
          reason: 'The supervised counterpart that minimizes vertical error rather than orthogonal geometric distance.'
        },
        {
          id: 'kmeans',
          name: 'K-Means Clustering',
          badge: 'Unsupervised Clustering',
          reason: 'An unsupervised technique that partitions space into discrete cluster centroids rather than continuous projection axes.'
        },
        {
          id: 'naive_bayes',
          name: 'Gaussian Naive Bayes',
          badge: 'Probabilistic Model',
          reason: 'Uses covariance ellipses around classes, which align exactly with principal components when features are decorrelated.'
        }
      ]
    }
  };

  /**
   * Helper to escape HTML characters in code snippets
   */
  function escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Generates markup for the 7 structured sections
   */
  function buildEducationMarkup(data) {
    if (!data) return '<div class="edu-card"><p>Educational details for this algorithm are being prepared.</p></div>';

    // 1. Header & Prerequisites
    const difficultyClass = `edu-badge-${data.difficulty.toLowerCase()}`;
    const prereqPills = (data.prerequisites || []).map(p => `<li class="edu-prereq-pill">${p}</li>`).join('');

    // 2. Mathematical Equations
    const equationsHTML = (data.math.equations || []).map(eq => `
      <div class="edu-equation-box">
        <div class="edu-equation-name">${eq.name}</div>
        <div class="edu-formula-stage">$$${eq.latex}$$</div>
        <p class="edu-equation-desc">${eq.description}</p>
        <div class="edu-canvas-callout">
          <span class="edu-canvas-callout-icon">Canvas:</span>
          <span>${eq.canvasConnection}</span>
        </div>
      </div>
    `).join('');

    // Hand trace if present (e.g. for Linear Regression)
    let handTraceHTML = '';
    if (data.math.handTrace) {
      const ht = data.math.handTrace;
      const ptsHTML = ht.points.map(pt => {
        if (typeof pt === 'string') return `<span class="edu-trace-pt">${pt}</span>`;
        if (pt.text) return `<span class="edu-trace-pt">${pt.text}</span>`;
        if (pt.label !== undefined) return `<span class="edu-trace-pt">(${pt.x}, ${pt.y}) [${pt.label}]</span>`;
        if (pt.y !== undefined) return `<span class="edu-trace-pt">(${pt.x}, ${pt.y})</span>`;
        return `<span class="edu-trace-pt">${pt.x}</span>`;
      }).join(' ');
      const stepsHTML = ht.steps.map(s => `
        <div class="edu-trace-step">
          <div class="edu-trace-step-num">${s.step}</div>
          <div class="edu-trace-step-heading">${s.heading}</div>
          <div class="edu-trace-step-math">$$${s.latex}$$</div>
        </div>
      `).join('');

      handTraceHTML = `
        <div class="edu-hand-trace">
          <div class="edu-hand-trace-title">
            <span>${ht.title}</span>
            <span class="edu-hand-trace-badge">Fixed Dataset Walkthrough</span>
          </div>
          <p class="edu-hand-trace-desc">${ht.description}</p>
          <div class="edu-trace-points">
            <span style="font-size:12px; font-weight:600; color:var(--text-muted); align-self:center;">Given Points:</span>
            ${ptsHTML}
          </div>
          <div class="edu-trace-steps">
            ${stepsHTML}
          </div>
        </div>
      `;
    }

    // 3. Experiments / Break It
    const experimentsHTML = (data.experiments || []).map((exp, idx) => `
      <div class="edu-experiment-card">
        <div class="edu-exp-head">
          <div class="edu-exp-title">Experiment ${idx + 1}: ${exp.title}</div>
          <span class="edu-exp-tag">${exp.tag}</span>
        </div>
        <div class="edu-exp-item">
          <div class="edu-exp-label">Setup in Studio:</div>
          <div class="edu-exp-val">${exp.setup}</div>
        </div>
        <div class="edu-exp-item">
          <div class="edu-exp-label">What Breaks:</div>
          <div class="edu-exp-val">${exp.whatBreaks}</div>
        </div>
        <div class="edu-exp-item">
          <div class="edu-exp-label">Mathematical Reason:</div>
          <div class="edu-exp-val">${exp.whyItBreaks}</div>
        </div>
      </div>
    `).join('');

    // 4. Code Block
    const codeHTML = `
      <div class="edu-code-container">
        <div class="edu-code-bar">
          <span class="edu-code-filename">${data.code.filename}</span>
          <button class="btn btn-sm copy-code-btn" type="button" id="copyCodeBtn" aria-label="Copy reference Python code">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            <span id="copyCodeText">Copy Code</span>
          </button>
        </div>
        <pre><code class="language-python">${escapeHTML(data.code.snippet)}</code></pre>
      </div>
    `;

    // 5. Complexity Table
    const complexityRows = (data.complexity || []).map(row => {
      const timeMath = row.time.startsWith('$') ? row.time : `$${row.time}$`;
      const spaceMath = row.space.startsWith('$') ? row.space : `$${row.space}$`;
      return `
        <tr>
          <td><strong>${row.stage}</strong></td>
          <td><span class="edu-complexity-pill">${timeMath}</span></td>
          <td><span class="edu-complexity-pill">${spaceMath}</span></td>
          <td>${row.notes}</td>
        </tr>
      `;
    }).join('');

    // 6. FAQ Accordion
    const faqHTML = (data.faq || []).map(item => `
      <details class="edu-faq-item">
        <summary class="edu-faq-summary">${item.q}</summary>
        <div class="edu-faq-content">
          <p>${item.a}</p>
        </div>
      </details>
    `).join('');

    // 7. Related Algorithms
    const relatedHTML = (data.related || []).map(rel => `
      <button class="edu-related-card" type="button" data-switch-algo="${rel.id}">
        <div class="edu-related-head">
          <span class="edu-related-name">${rel.name}</span>
          <span class="edu-related-badge">${rel.badge}</span>
        </div>
        <p class="edu-related-reason">${rel.reason}</p>
        <div class="edu-related-link">
          <span>Open in Studio</span>
          <span aria-hidden="true">→</span>
        </div>
      </button>
    `).join('');

    return `
      <div class="edu-container">
        <!-- 1. Header & Prerequisites -->
        <header class="edu-header">
          <div class="edu-meta-row">
            <span class="edu-badge ${difficultyClass}">${data.difficulty}</span>
            <span class="edu-badge edu-badge-category">${data.category}</span>
          </div>
          <h2 class="edu-title">${data.title}</h2>
          <p class="edu-summary">${data.summary}</p>
          <div class="edu-prereqs-bar">
            <span class="edu-prereqs-label">Prerequisites:</span>
            <ul class="edu-prereqs-bar" style="margin:0; padding:0; list-style:none;">
              ${prereqPills}
            </ul>
          </div>
        </header>

        <div class="edu-sections-grid">
          <!-- 2. Mathematical Explanation & Theory -->
          <article class="edu-card">
            <div class="edu-card-header">
              <h3 class="edu-card-title">
                <span>Mathematical Theory &amp; Formulations</span>
              </h3>
              <span class="edu-card-title-badge">LaTeX / KaTeX</span>
            </div>
            <p class="edu-math-intro">${data.math.intro}</p>
            <div class="edu-equation-grid">
              ${equationsHTML}
            </div>
            ${handTraceHTML}
          </article>

          <!-- 3. Break It / Experiments Explained -->
          <article class="edu-card">
            <div class="edu-card-header">
              <h3 class="edu-card-title">
                <span>Experiments: What Breaks &amp; Why</span>
              </h3>
              <span class="edu-card-title-badge">Stress Tests</span>
            </div>
            <div class="edu-experiments-grid">
              ${experimentsHTML}
            </div>
          </article>

          <!-- 4. Python Implementation Reference -->
          <article class="edu-card">
            <div class="edu-card-header">
              <h3 class="edu-card-title">
                <span>Python Reference Implementation</span>
              </h3>
              <span class="edu-card-title-badge">NumPy &amp; Scikit-Learn</span>
            </div>
            ${codeHTML}
          </article>

          <!-- 5. Complexity Analysis -->
          <article class="edu-card">
            <div class="edu-card-header">
              <h3 class="edu-card-title">
                <span>Computational Complexity Analysis</span>
              </h3>
              <span class="edu-card-title-badge">Big-O Bounds</span>
            </div>
            <div class="edu-table-wrap">
              <table class="edu-complexity-table">
                <thead>
                  <tr>
                    <th>Operation / Stage</th>
                    <th>Time Complexity</th>
                    <th>Space Complexity</th>
                    <th>Implementation Notes</th>
                  </tr>
                </thead>
                <tbody>
                  ${complexityRows}
                </tbody>
              </table>
            </div>
          </article>

          <!-- 6. Frequently Asked Questions -->
          <article class="edu-card">
            <div class="edu-card-header">
              <h3 class="edu-card-title">
                <span>Frequently Asked Questions &amp; Common Pitfalls</span>
              </h3>
              <span class="edu-card-title-badge">Conceptual FAQs</span>
            </div>
            <div class="edu-faq-list">
              ${faqHTML}
            </div>
          </article>

          <!-- 7. Related Algorithms -->
          <article class="edu-card">
            <div class="edu-card-header">
              <h3 class="edu-card-title">
                <span>Related Algorithms in Studio</span>
              </h3>
              <span class="edu-card-title-badge">Inductive Bias Compare</span>
            </div>
            <div class="edu-related-grid">
              ${relatedHTML}
            </div>
          </article>
        </div>
      </div>
    `;
  }

  /**
   * Main render function invoked on algorithm change or initial load
   */
  function renderEducationSection(algoId) {
    const container = document.getElementById('educationSection');
    if (!container) return;

    const data = EDUCATION_DATA[algoId];
    if (!data) {
      container.innerHTML = `
        <div class="edu-container">
          <div class="edu-card">
            <h3 class="edu-card-title">${algoId.replace(/_/g, ' ').toUpperCase()}</h3>
            <p class="edu-summary">Educational documentation for this algorithm will be populated in Phase 3.</p>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = buildEducationMarkup(data);

    // 1. Trigger KaTeX Auto-Render
    if (window.renderMathInElement) {
      window.renderMathInElement(container, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '\\[', right: '\\]', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false }
        ],
        throwOnError: false
      });
    }

    // 2. Trigger Prism Syntax Highlighting
    if (window.Prism) {
      window.Prism.highlightAllUnder(container);
    }

    // 3. Attach Copy Code Button Handler
    const copyBtn = document.getElementById('copyCodeBtn');
    const copyText = document.getElementById('copyCodeText');
    if (copyBtn && copyText && data.code) {
      copyBtn.addEventListener('click', () => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(data.code.snippet).then(() => {
            copyText.textContent = 'Copied!';
            copyBtn.classList.add('active');
            setTimeout(() => {
              copyText.textContent = 'Copy Code';
              copyBtn.classList.remove('active');
            }, 2000);
          }).catch(() => {
            fallbackCopy(data.code.snippet, copyText, copyBtn);
          });
        } else {
          fallbackCopy(data.code.snippet, copyText, copyBtn);
        }
      });
    }

    // 4. Attach Related Algorithm Switch Handlers
    container.querySelectorAll('[data-switch-algo]').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetAlgo = btn.getAttribute('data-switch-algo');
        if (targetAlgo && typeof window.selectAlgo === 'function') {
          window.selectAlgo(targetAlgo, false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }

  function fallbackCopy(text, labelEl, btnEl) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      labelEl.textContent = 'Copied!';
      btnEl.classList.add('active');
      setTimeout(() => {
        labelEl.textContent = 'Copy Code';
        btnEl.classList.remove('active');
      }, 2000);
    } catch (e) {
      labelEl.textContent = 'Copy failed';
    }
    document.body.removeChild(ta);
  }

  // Expose globally
  window.renderEducationSection = renderEducationSection;
  window.EDUCATION_DATA = EDUCATION_DATA;
})();
