/* ============================================================================
   ML Algo Studio — Unified Algorithm Catalog, Learning Path & Glossary Data
   11 Live Interactive Studio Algorithms + 20 Coming Soon Roadmap Topics
   ============================================================================ */

(function () {
  const ALGORITHMS = [
    // ---- FOUNDATIONS ----
    {
      id: 'what-is-a-model',
      studioId: null,
      live: false,
      title: 'What Is a Model?',
      category: 'Foundations',
      difficulty: 'Beginner',
      timeEstimate: '~6 min',
      description: 'A model is a mathematical function fit to observed data to make predictions.',
      shortDescription: 'Fit functions to data.',
      hook: 'Before tuning hyperparameters or stacking layers, understand the simplest truth of ML: a model is a function shaped by data.',
      colorToken: 'var(--cat-foundations)',
      prerequisites: [],
      next: ['loss-functions', 'linear-regression'],
      teaches: ['supervised learning', 'parameters', 'prediction', 'ground truth'],
      failureMode: 'Force a straight line onto circular data.',
      svgType: 'model'
    },
    {
      id: 'loss-functions',
      studioId: null,
      live: false,
      title: 'Loss Functions',
      category: 'Foundations',
      difficulty: 'Beginner',
      timeEstimate: '~8 min',
      description: 'Loss measures how wrong a prediction is—turning errors into a single number to minimize.',
      shortDescription: 'Quantify errors into scalar loss.',
      hook: 'A model cannot improve until it knows how badly it failed. A loss function provides that compass.',
      colorToken: 'var(--cat-foundations)',
      prerequisites: ['what-is-a-model'],
      next: ['gradient-descent', 'linear-regression'],
      teaches: ['MSE', 'MAE', 'residuals', 'outlier sensitivity'],
      failureMode: 'Add an extreme outlier under squared error loss.',
      svgType: 'loss'
    },
    {
      id: 'gradient-descent',
      studioId: null,
      live: false,
      title: 'Gradient Descent',
      category: 'Foundations',
      difficulty: 'Intermediate',
      timeEstimate: '~9 min',
      description: 'Iteratively step downhill on the loss surface to find optimal parameters.',
      shortDescription: 'Walk downhill on loss contours.',
      hook: 'When an equation has no closed-form shortcut, roll a ball down the valley of loss.',
      colorToken: 'var(--cat-foundations)',
      prerequisites: ['loss-functions'],
      next: ['optimizers', 'logistic-regression'],
      teaches: ['learning rate', 'gradients', 'convergence', 'overshooting'],
      failureMode: 'Set learning rate too high so steps explode.',
      svgType: 'gd'
    },
    {
      id: 'optimizers',
      studioId: null,
      live: false,
      title: 'Optimizers (SGD · Momentum · Adam)',
      category: 'Foundations',
      difficulty: 'Intermediate',
      timeEstimate: '~10 min',
      description: 'Race SGD, Momentum, RMSProp, and Adam down loss surfaces with ravines and saddle points.',
      shortDescription: 'Race optimizers down loss surfaces.',
      hook: 'Pure gradient descent stalls in ravines and plateaus. Smart optimizers build momentum and adapt step sizes.',
      colorToken: 'var(--cat-foundations)',
      prerequisites: ['gradient-descent'],
      next: ['backpropagation'],
      teaches: ['SGD', 'momentum', 'adaptive learning rate', 'saddle points'],
      failureMode: 'Trapping vanilla SGD on a flat saddle point.',
      svgType: 'optimizers'
    },
    {
      id: 'overfitting-underfitting',
      studioId: null,
      live: false,
      title: 'Overfitting & Underfitting',
      category: 'Foundations',
      difficulty: 'Beginner',
      timeEstimate: '~7 min',
      description: 'Watch train and test error form the classic U-shape as model complexity grows.',
      shortDescription: 'Balance complexity vs. generalization.',
      hook: 'A model that memorizes noise fails on new data. Generalization lives in the sweet spot.',
      colorToken: 'var(--cat-foundations)',
      prerequisites: ['what-is-a-model'],
      next: ['bias-variance', 'decision-trees'],
      teaches: ['train loss', 'validation loss', 'generalization gap', 'capacity'],
      failureMode: 'Fit a degree-15 curve to 8 noisy points.',
      svgType: 'overfit'
    },

    // ---- REGRESSION ----
    {
      id: 'linear-regression',
      studioId: 'linear_reg',
      live: true,
      title: 'Linear Regression (OLS & Polynomial)',
      category: 'Regression',
      difficulty: 'Beginner',
      timeEstimate: '~7 min',
      description: 'Fit the best straight line or polynomial curve through 2D data using Ordinary Least Squares and inspect live residuals.',
      shortDescription: 'Ordinary least squares line & curve fit.',
      hook: 'The bedrock of quantitative modeling: find the line that minimizes the sum of squared vertical errors.',
      colorToken: 'var(--cat-regression)',
      prerequisites: ['loss-functions'],
      next: ['logistic-regression', 'ridge-regression', 'pca'],
      teaches: ['ordinary least squares', 'slope', 'intercept', 'residuals', 'R-squared', 'polynomial degree'],
      failureMode: 'Add a high-leverage outlier at the far edge or crank degree too high.',
      svgType: 'linear_reg'
    },
    {
      id: 'polynomial-regression',
      studioId: null,
      live: false,
      title: 'Polynomial Regression',
      category: 'Regression',
      difficulty: 'Beginner',
      timeEstimate: '~8 min',
      description: 'Fit curved relationships by expanding inputs into polynomial feature powers.',
      shortDescription: 'Fit curves with polynomial basis.',
      hook: 'Linear models can fit curves when you treat powers of x as new features.',
      colorToken: 'var(--cat-regression)',
      prerequisites: ['linear-regression'],
      next: ['bias-variance', 'ridge-regression'],
      teaches: ['feature mapping', 'non-linear curves', 'Runge phenomenon', 'extrapolation'],
      failureMode: 'Extrapolate high-degree polynomials outside the training range.',
      svgType: 'poly'
    },
    {
      id: 'bias-variance',
      studioId: null,
      live: false,
      title: 'Bias–Variance Tradeoff',
      category: 'Regression',
      difficulty: 'Intermediate',
      timeEstimate: '~10 min',
      description: 'Decompose expected test error into bias, variance, and irreducible noise.',
      shortDescription: 'Decompose generalization error.',
      hook: 'Every learner balances error from simple assumptions against sensitivity to small data changes.',
      colorToken: 'var(--cat-regression)',
      prerequisites: ['overfitting-underfitting', 'linear-regression'],
      next: ['ridge-regression', 'random-forests'],
      teaches: ['bias squared', 'variance', 'irreducible noise', 'ensemble motivation'],
      failureMode: 'Unregularized high-variance model swinging across resamples.',
      svgType: 'bias_var'
    },
    {
      id: 'ridge-regression',
      studioId: null,
      live: false,
      title: 'Ridge Regression (L2)',
      category: 'Regression',
      difficulty: 'Intermediate',
      timeEstimate: '~8 min',
      description: 'Shrink regression coefficients toward zero with an L2 penalty to tame variance.',
      shortDescription: 'L2 parameter shrinkage.',
      hook: 'Penalizing large weights keeps coefficients stable when features correlate or data is noisy.',
      colorToken: 'var(--cat-regression)',
      prerequisites: ['linear-regression', 'bias-variance'],
      next: ['lasso-regression', 'elastic-net'],
      teaches: ['L2 regularization', 'lambda', 'weight decay', 'multicollinearity'],
      failureMode: 'Setting lambda too high collapses the model to a flat mean.',
      svgType: 'ridge'
    },
    {
      id: 'lasso-regression',
      studioId: null,
      live: false,
      title: 'Lasso Regression (L1)',
      category: 'Regression',
      difficulty: 'Intermediate',
      timeEstimate: '~9 min',
      description: 'Drive weak coefficients exactly to zero for automatic feature selection.',
      shortDescription: 'L1 sparse feature selection.',
      hook: 'A sharp diamond constraint pins unneeded feature weights straight to zero.',
      colorToken: 'var(--cat-regression)',
      prerequisites: ['ridge-regression'],
      next: ['elastic-net'],
      teaches: ['L1 penalty', 'sparsity', 'feature selection'],
      failureMode: 'Arbitrarily dropping one of two correlated twin features.',
      svgType: 'lasso'
    },
    {
      id: 'elastic-net',
      studioId: null,
      live: false,
      title: 'Elastic Net',
      category: 'Regression',
      difficulty: 'Advanced',
      timeEstimate: '~9 min',
      description: 'Blend L1 and L2 penalties to handle correlated features while keeping sparsity.',
      shortDescription: 'Hybrid L1 + L2 regularization.',
      hook: 'Combine Ridge stability and Lasso sparsity in one convex penalty.',
      colorToken: 'var(--cat-regression)',
      prerequisites: ['ridge-regression', 'lasso-regression'],
      next: ['logistic-regression'],
      teaches: ['l1_ratio', 'grouping effect', 'convex loss'],
      failureMode: 'Excessive combined penalties suppress real signal.',
      svgType: 'elastic'
    },

    // ---- CLASSIFICATION ----
    {
      id: 'logistic-regression',
      studioId: 'logistic_reg',
      live: true,
      title: 'Logistic Regression',
      category: 'Classification',
      difficulty: 'Beginner',
      timeEstimate: '~8 min',
      description: 'Predict class probabilities with the sigmoid function and watch a linear boundary train step-by-step via cross-entropy.',
      shortDescription: 'Sigmoid probability boundary.',
      hook: 'Passing linear scores through an S-shaped sigmoid turns raw numbers into calibrated class probabilities.',
      colorToken: 'var(--cat-classification)',
      prerequisites: ['linear-regression'],
      next: ['support-vector-machines', 'k-nearest-neighbors', 'neural-network'],
      teaches: ['sigmoid', 'cross-entropy', 'decision boundary', 'learning rate', 'L2 regularization'],
      failureMode: 'Try separating concentric circles or XOR with a single straight boundary.',
      svgType: 'logistic_reg'
    },
    {
      id: 'support-vector-machines',
      studioId: 'svm',
      live: true,
      title: 'Support Vector Machine (SVM)',
      category: 'Classification',
      difficulty: 'Intermediate',
      timeEstimate: '~10 min',
      description: 'Maximize the safety margin between classes with Linear or RBF kernels and inspect highlighted support vectors.',
      shortDescription: 'Maximum margin & RBF kernel boundary.',
      hook: 'Do not just separate classes—find the boundary that stays as far as possible from both.',
      colorToken: 'var(--cat-classification)',
      prerequisites: ['logistic-regression'],
      next: ['kernel-trick', 'random-forests'],
      teaches: ['margin', 'support vectors', 'C regularization', 'RBF kernel', 'gamma'],
      failureMode: 'Set RBF gamma very high to wrap individual points in tight islands.',
      svgType: 'svm'
    },
    {
      id: 'k-nearest-neighbors',
      studioId: 'knn',
      live: true,
      title: 'K-Nearest Neighbors (KNN)',
      category: 'Classification',
      difficulty: 'Beginner',
      timeEstimate: '~7 min',
      description: 'Classify any query point by majority vote of its K closest neighbors using Euclidean or Manhattan distance.',
      shortDescription: 'Instance-based neighborhood vote.',
      hook: 'No training loop required. Show me your closest neighbors and I will predict your class.',
      colorToken: 'var(--cat-classification)',
      prerequisites: ['what-is-a-model'],
      next: ['decision-trees', 'naive-bayes'],
      teaches: ['Euclidean distance', 'Manhattan distance', 'K hyperparameter', 'local boundaries'],
      failureMode: 'Set K = 1 on noisy overlapping clusters to create jagged islands.',
      svgType: 'knn'
    },
    {
      id: 'naive-bayes',
      studioId: 'naive_bayes',
      live: true,
      title: 'Gaussian Naive Bayes',
      category: 'Classification',
      difficulty: 'Beginner',
      timeEstimate: '~8 min',
      description: 'Model each class as a 2D Gaussian bell curve and classify points using Bayes theorem and class priors.',
      shortDescription: 'Probabilistic Gaussian ellipses.',
      hook: 'Fast, generative, and interpretable: estimate each class mean and variance, then compare likelihoods.',
      colorToken: 'var(--cat-classification)',
      prerequisites: ['k-nearest-neighbors'],
      next: ['logistic-regression', 'decision-trees'],
      teaches: ['Bayes theorem', 'Gaussian likelihood', 'feature independence', 'class priors'],
      failureMode: 'Apply axis-aligned Gaussian ellipses to curved moons or concentric rings.',
      svgType: 'naive_bayes'
    },
    {
      id: 'decision-trees',
      studioId: 'decision_tree',
      live: true,
      title: 'Decision Tree (CART)',
      category: 'Classification',
      difficulty: 'Beginner',
      timeEstimate: '~9 min',
      description: 'Split 2D space with axis-aligned yes/no rules using Gini impurity or Entropy and inspect the live tree diagram.',
      shortDescription: 'Axis-aligned splits & live tree diagram.',
      hook: 'Ask sequential threshold questions that make each child group as pure as possible.',
      colorToken: 'var(--cat-classification)',
      prerequisites: ['k-nearest-neighbors'],
      next: ['random-forests', 'gradient-boosting'],
      teaches: ['Gini impurity', 'Entropy', 'max depth', 'min samples split', 'axis-aligned cuts'],
      failureMode: 'Set max depth high on noisy data to memorize individual outliers.',
      svgType: 'decision_tree'
    },
    {
      id: 'decision-boundaries',
      studioId: null,
      live: false,
      title: 'Decision Boundaries (4-Way)',
      category: 'Classification',
      difficulty: 'Intermediate',
      timeEstimate: '~9 min',
      description: 'Compare how four classifiers carve up the exact same dataset side-by-side.',
      shortDescription: '4 classifiers on one dataset.',
      hook: 'One dataset, four philosophies. Compare straight cuts, jagged boxes, Voronoi cells, and margins.',
      colorToken: 'var(--cat-classification)',
      prerequisites: ['logistic-regression', 'k-nearest-neighbors'],
      next: ['support-vector-machines', 'decision-trees'],
      teaches: ['hypothesis space', 'non-linear boundaries', 'model comparison'],
      failureMode: 'Linear boundary cutting straight through concentric circles.',
      svgType: 'boundaries'
    },
    {
      id: 'kernel-trick',
      studioId: null,
      live: false,
      title: 'The Kernel Trick (3D Lift)',
      category: 'Classification',
      difficulty: 'Advanced',
      timeEstimate: '~11 min',
      description: 'Lift non-linear 2D data into 3D space so a flat hyperplane can slice it cleanly.',
      shortDescription: 'Implicit high-dimensional lifting.',
      hook: 'When 2D data cannot be cut with a line, lift it into 3D and slice it with a flat sheet.',
      colorToken: 'var(--cat-classification)',
      prerequisites: ['support-vector-machines'],
      next: ['neural-network'],
      teaches: ['RBF kernel', 'polynomial kernel', 'feature lifting'],
      failureMode: 'Astronomical gamma isolates every training point.',
      svgType: 'kernel'
    },

    // ---- ENSEMBLES ----
    {
      id: 'random-forests',
      studioId: 'random_forest',
      live: true,
      title: 'Random Forest',
      category: 'Ensembles',
      difficulty: 'Intermediate',
      timeEstimate: '~9 min',
      description: 'Train an ensemble of bootstrapped decision trees, inspect individual trees, and watch majority voting smooth boundaries.',
      shortDescription: 'Bootstrapped tree ensemble voting.',
      hook: 'One deep tree overfits easily. Averaging many diverse trees cancels out individual mistakes.',
      colorToken: 'var(--cat-ensembles)',
      prerequisites: ['decision-trees'],
      next: ['gradient-boosting'],
      teaches: ['bootstrap sampling', 'variance reduction', 'majority voting', 'tree count'],
      failureMode: 'Use only 1–2 shallow trees so the ensemble loses voting diversity.',
      svgType: 'random_forest'
    },
    {
      id: 'gradient-boosting',
      studioId: 'gradient_boosting',
      live: true,
      title: 'Gradient Boosting',
      category: 'Ensembles',
      difficulty: 'Advanced',
      timeEstimate: '~11 min',
      description: 'Build shallow regression trees one by one, each correcting the remaining residuals of the previous ensemble.',
      shortDescription: 'Sequential residual-correcting trees.',
      hook: 'Gradient descent in function space: every new tree focuses strictly on the errors left behind.',
      colorToken: 'var(--cat-ensembles)',
      prerequisites: ['random-forests'],
      next: ['neural-network'],
      teaches: ['pseudo-residuals', 'shrinkage learning rate', 'n_estimators', 'additive trees'],
      failureMode: 'High learning rate + deep trees overfits noisy points rapidly.',
      svgType: 'gradient_boosting'
    },
    {
      id: 'bagging',
      studioId: null,
      live: false,
      title: 'Bagging (Bootstrap Aggregating)',
      category: 'Ensembles',
      difficulty: 'Intermediate',
      timeEstimate: '~9 min',
      description: 'Reduce variance by averaging models trained on random bootstrap resamples.',
      shortDescription: 'Bootstrap resampling & averaging.',
      hook: 'Train many unstable learners on resampled data to build one rock-solid predictor.',
      colorToken: 'var(--cat-ensembles)',
      prerequisites: ['decision-trees', 'bias-variance'],
      next: ['random-forests'],
      teaches: ['bootstrap sampling', 'out-of-bag error', 'variance reduction'],
      failureMode: 'Bagging a stable linear model yields no variance reduction.',
      svgType: 'bagging'
    },
    {
      id: 'adaboost',
      studioId: null,
      live: false,
      title: 'AdaBoost',
      category: 'Ensembles',
      difficulty: 'Advanced',
      timeEstimate: '~10 min',
      description: 'Chain weak decision stumps by increasing the weight of misclassified points at every round.',
      shortDescription: 'Adaptive sample re-weighting.',
      hook: 'Each new stump studies the exact points the previous learner got wrong.',
      colorToken: 'var(--cat-ensembles)',
      prerequisites: ['decision-trees'],
      next: ['gradient-boosting'],
      teaches: ['sample weights', 'alpha weights', 'exponential loss'],
      failureMode: 'Label noise causes weights to fixate on corrupted points.',
      svgType: 'adaboost'
    },

    // ---- UNSUPERVISED ----
    {
      id: 'k-means',
      studioId: 'kmeans',
      live: true,
      title: 'K-Means Clustering',
      category: 'Unsupervised',
      difficulty: 'Beginner',
      timeEstimate: '~8 min',
      description: 'Group unlabeled points into K clusters step-by-step by alternating Voronoi assignment and centroid updates.',
      shortDescription: 'Iterative centroid clustering.',
      hook: 'Discover natural groups without labels: assign to nearest center, move center to the mean, repeat.',
      colorToken: 'var(--cat-unsupervised)',
      prerequisites: ['what-is-a-model'],
      next: ['pca', 'dbscan'],
      teaches: ['centroids', 'Voronoi regions', 'inertia', 'Lloyd algorithm', 'cluster count K'],
      failureMode: 'Run K-Means on two crescent moons or rings where clusters are not round.',
      svgType: 'kmeans'
    },
    {
      id: 'pca',
      studioId: 'pca',
      live: true,
      title: 'Principal Component Analysis (PCA)',
      category: 'Unsupervised',
      difficulty: 'Intermediate',
      timeEstimate: '~10 min',
      description: 'Find the orthogonal axes of maximum variance, view exact eigenvectors, and project points onto PC1.',
      shortDescription: 'Maximum-variance orthogonal projection.',
      hook: 'Compress 2D data into 1D while keeping as much spread and information as mathematically possible.',
      colorToken: 'var(--cat-unsupervised)',
      prerequisites: ['linear-regression'],
      next: ['t-sne', 'k-means'],
      teaches: ['eigenvectors', 'eigenvalues', 'covariance matrix', 'explained variance ratio'],
      failureMode: 'Project circular or isotropic data where no single direction dominates.',
      svgType: 'pca'
    },
    {
      id: 'dbscan',
      studioId: null,
      live: false,
      title: 'DBSCAN',
      category: 'Unsupervised',
      difficulty: 'Intermediate',
      timeEstimate: '~9 min',
      description: 'Cluster by local point density to uncover curved shapes while rejecting isolated noise.',
      shortDescription: 'Density-based spatial clustering.',
      hook: 'Clusters are dense neighborhoods separated by empty space—any lonely point is noise.',
      colorToken: 'var(--cat-unsupervised)',
      prerequisites: ['k-means'],
      next: ['pca', 't-sne'],
      teaches: ['epsilon radius', 'MinPts', 'core points', 'noise rejection'],
      failureMode: 'Single global epsilon struggles on clusters with very different densities.',
      svgType: 'dbscan'
    },
    {
      id: 't-sne',
      studioId: null,
      live: false,
      title: 't-SNE',
      category: 'Unsupervised',
      difficulty: 'Advanced',
      timeEstimate: '~11 min',
      description: 'Preserve local neighborhoods in 2D by matching Gaussian affinities with heavy-tailed Student-t distributions.',
      shortDescription: 'Non-linear neighborhood embedding.',
      hook: 'Untangle high-dimensional clusters into 2D while preventing points from crowding together.',
      colorToken: 'var(--cat-unsupervised)',
      prerequisites: ['pca'],
      next: ['attention'],
      teaches: ['perplexity', 'KL divergence', 'crowding problem'],
      failureMode: 'Over-interpreting distances between separated clusters.',
      svgType: 'tsne'
    },

    // ---- NEURAL NETWORKS & DEEP LEARNING ----
    {
      id: 'neural-network',
      studioId: 'neural_net',
      live: true,
      title: 'Neural Network (MLP)',
      category: 'Neural Networks',
      difficulty: 'Intermediate',
      timeEstimate: '~10 min',
      description: 'Train a live multi-layer perceptron with configurable hidden neurons and activations, watching both the 2D boundary and weight network update.',
      shortDescription: 'Interactive multi-layer perceptron.',
      hook: 'Watch hidden neurons fold straight lines into curved decision boundaries for XOR, moons, and circles.',
      colorToken: 'var(--cat-neural)',
      prerequisites: ['logistic-regression'],
      next: ['backpropagation', 'attention'],
      teaches: ['hidden units', 'tanh & ReLU', 'backpropagation', 'learning rate', 'loss curve'],
      failureMode: 'Use too few hidden units on concentric circles or a huge learning rate.',
      svgType: 'neural_net'
    },
    {
      id: 'perceptron',
      studioId: null,
      live: false,
      title: 'The Perceptron',
      category: 'Neural Networks',
      difficulty: 'Beginner',
      timeEstimate: '~7 min',
      description: 'The atom of neural networks: a single artificial neuron learning a linear cut.',
      shortDescription: 'Single artificial neuron.',
      hook: 'Multiply inputs by weights, add a bias, and fire if the total crosses zero.',
      colorToken: 'var(--cat-neural)',
      prerequisites: ['logistic-regression'],
      next: ['activation-functions', 'neural-network'],
      teaches: ['weights', 'bias', 'step activation', 'XOR barrier'],
      failureMode: 'Try solving XOR with a single perceptron.',
      svgType: 'perceptron'
    },
    {
      id: 'activation-functions',
      studioId: null,
      live: false,
      title: 'Activation Functions',
      category: 'Neural Networks',
      difficulty: 'Beginner',
      timeEstimate: '~8 min',
      description: 'Compare Sigmoid, Tanh, ReLU, Leaky ReLU, and GELU curves alongside their derivatives.',
      shortDescription: 'Non-linear transfer curves.',
      hook: 'Without non-linear activations, a 100-layer network collapses into one straight line.',
      colorToken: 'var(--cat-neural)',
      prerequisites: ['perceptron'],
      next: ['backpropagation', 'neural-network'],
      teaches: ['ReLU', 'GELU', 'vanishing gradient', 'dying ReLU'],
      failureMode: 'Saturating sigmoid at large inputs freezes gradients.',
      svgType: 'activation'
    },
    {
      id: 'backpropagation',
      studioId: null,
      live: false,
      title: 'Backpropagation',
      category: 'Neural Networks',
      difficulty: 'Intermediate',
      timeEstimate: '~12 min',
      description: 'Trace the chain rule step-by-step backwards through a computational graph.',
      shortDescription: 'Reverse-mode chain rule.',
      hook: 'Reuse intermediate derivatives to compute millions of weight gradients in one backward pass.',
      colorToken: 'var(--cat-neural)',
      prerequisites: ['activation-functions', 'gradient-descent'],
      next: ['neural-network'],
      teaches: ['chain rule', 'forward pass', 'backward pass', 'gradient flow'],
      failureMode: 'Stacking deep sigmoid layers causes vanishing gradients.',
      svgType: 'backprop'
    },
    {
      id: 'attention',
      studioId: null,
      live: false,
      title: 'Attention Mechanism',
      category: 'Deep Learning',
      difficulty: 'Advanced',
      timeEstimate: '~11 min',
      description: 'Explore scaled dot-product Query–Key–Value attention weights between tokens in a sequence.',
      shortDescription: 'Query–Key–Value token routing.',
      hook: 'The core idea behind modern LLMs: every token dynamically queries every other token for context.',
      colorToken: 'var(--cat-deep)',
      prerequisites: ['neural-network'],
      next: [],
      teaches: ['Queries', 'Keys', 'Values', 'scaled dot-product', 'softmax temperature'],
      failureMode: 'Cranking temperature too high flattens attention into uniform noise.',
      svgType: 'attention'
    }
  ];

  const CATEGORIES = [
    'All',
    'Foundations',
    'Regression',
    'Classification',
    'Ensembles',
    'Unsupervised',
    'Neural Networks',
    'Deep Learning'
  ];

  const LEARNING_PATH = [
    {
      num: 1,
      name: 'Foundations & Regression',
      desc: 'Start with how models fit data, measure error with residuals, and draw a best-fit line.',
      colorToken: 'var(--cat-regression)',
      items: ['linear-regression', 'what-is-a-model', 'loss-functions', 'gradient-descent', 'overfitting-underfitting']
    },
    {
      num: 2,
      name: 'Core Classifiers',
      desc: 'Learn how boundaries separate categories using probabilities, margins, neighbors, and Bayes rules.',
      colorToken: 'var(--cat-classification)',
      items: ['logistic-regression', 'k-nearest-neighbors', 'naive-bayes', 'support-vector-machines']
    },
    {
      num: 3,
      name: 'Trees & Ensembles',
      desc: 'Move from single yes/no decision trees to crowds of trees that vote or fix each other’s errors.',
      colorToken: 'var(--cat-ensembles)',
      items: ['decision-trees', 'random-forests', 'gradient-boosting', 'bagging', 'adaboost']
    },
    {
      num: 4,
      name: 'Unsupervised Discovery',
      desc: 'Find hidden clusters and compress dimensions when data has no labels at all.',
      colorToken: 'var(--cat-unsupervised)',
      items: ['k-means', 'pca', 'dbscan', 't-sne']
    },
    {
      num: 5,
      name: 'Neural Networks & Beyond',
      desc: 'Combine hidden neurons and non-linear activations to solve curved and XOR patterns.',
      colorToken: 'var(--cat-neural)',
      items: ['neural-network', 'perceptron', 'activation-functions', 'backpropagation', 'attention']
    }
  ];

  const GLOSSARY = [
    {
      term: 'Ordinary Least Squares (OLS)',
      category: 'Regression',
      definition: 'A direct math formula that picks the line or polynomial minimizing the sum of squared vertical distances (residuals) between actual points and predictions.',
      algoId: 'linear-regression',
      studioId: 'linear_reg'
    },
    {
      term: 'Sigmoid & Cross-Entropy',
      category: 'Classification',
      definition: 'The sigmoid squashes any raw score into a probability between 0 and 1, while cross-entropy heavily penalizes confident wrong predictions.',
      algoId: 'logistic-regression',
      studioId: 'logistic_reg'
    },
    {
      term: 'Maximum Margin & Support Vectors',
      category: 'Classification',
      definition: 'SVMs place the boundary as far as possible from both classes. The few points sitting right on the margin edge are the support vectors that anchor it.',
      algoId: 'support-vector-machines',
      studioId: 'svm'
    },
    {
      term: 'RBF Kernel & Gamma',
      category: 'Classification',
      definition: 'A Radial Basis Function kernel measures similarity by distance so an SVM can draw curved islands. Higher gamma makes each point’s influence tighter.',
      algoId: 'support-vector-machines',
      studioId: 'svm'
    },
    {
      term: 'K-Nearest Neighbors (KNN)',
      category: 'Classification',
      definition: 'A lazy learner that stores training points and classifies any new point by taking a majority vote among its K closest neighbors.',
      algoId: 'k-nearest-neighbors',
      studioId: 'knn'
    },
    {
      term: 'Bayes Theorem & Gaussian Likelihood',
      category: 'Classification',
      definition: 'Naive Bayes estimates each class as a bell curve (mean and variance per axis) and multiplies likelihood by class prior to pick the most probable class.',
      algoId: 'naive-bayes',
      studioId: 'naive_bayes'
    },
    {
      term: 'Gini Impurity & Entropy',
      category: 'Classification',
      definition: 'Scores that measure how mixed the classes are inside a decision tree node. A pure node (all one class) has 0 impurity.',
      algoId: 'decision-trees',
      studioId: 'decision_tree'
    },
    {
      term: 'Bootstrap Aggregating (Bagging)',
      category: 'Ensembles',
      definition: 'Training many trees on random resamples of the dataset (with replacement) and averaging their votes—the core idea behind Random Forests.',
      algoId: 'random-forests',
      studioId: 'random_forest'
    },
    {
      term: 'Pseudo-Residuals',
      category: 'Ensembles',
      definition: 'In Gradient Boosting, each new shallow tree is trained not on the original labels, but on the remaining prediction errors (residuals) of earlier trees.',
      algoId: 'gradient-boosting',
      studioId: 'gradient_boosting'
    },
    {
      term: 'Hidden Layer & Activation Function',
      category: 'Neural Networks',
      definition: 'Hidden neurons apply non-linear functions (like tanh or ReLU) so a neural network can bend space and solve non-linear patterns like XOR or spirals.',
      algoId: 'neural-network',
      studioId: 'neural_net'
    },
    {
      term: 'Backpropagation',
      category: 'Neural Networks',
      definition: 'Using the calculus chain rule backwards from the output error to compute how much each weight should change during gradient descent.',
      algoId: 'neural-network',
      studioId: 'neural_net'
    },
    {
      term: 'Voronoi Cells & Inertia',
      category: 'Unsupervised',
      definition: 'K-Means splits space into Voronoi regions closest to each centroid and minimizes inertia—the total squared distance from points to their cluster center.',
      algoId: 'k-means',
      studioId: 'kmeans'
    },
    {
      term: 'Eigenvectors & Explained Variance',
      category: 'Unsupervised',
      definition: 'In PCA, eigenvectors point along the directions of greatest data spread, and eigenvalues tell you what percentage of total variance each axis captures.',
      algoId: 'pca',
      studioId: 'pca'
    },
    {
      term: 'Overfitting vs. Underfitting',
      category: 'Foundations',
      definition: 'Overfitting happens when a model memorizes random noise (low train error, high test error); underfitting happens when it is too simple to capture the real trend.',
      algoId: 'linear-regression',
      studioId: 'linear_reg'
    }
  ];

  function getById(id) {
    return ALGORITHMS.find((a) => a.id === id) || null;
  }

  function getByStudioId(studioId) {
    return ALGORITHMS.find((a) => a.studioId === studioId) || null;
  }

  function getLiveAlgorithms() {
    return ALGORITHMS.filter((a) => a.live);
  }

  function getComingSoonAlgorithms() {
    return ALGORITHMS.filter((a) => !a.live);
  }

  window.MLCatalog = {
    ALGORITHMS,
    CATEGORIES,
    LEARNING_PATH,
    GLOSSARY,
    getById,
    getByStudioId,
    getLiveAlgorithms,
    getComingSoonAlgorithms
  };
})();
