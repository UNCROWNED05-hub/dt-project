/**
 * scripts/generate-aiml-batch3.mjs
 *
 * Generates Batch 3 for Course 1 (AI & ML):
 * - Chapter 6: trees-ensembles-and-svms (ai-06)
 * - Chapter 7: evaluation-overfitting-and-tuning (ai-07)
 */

import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();

function writeNoteBlock(courseSlug, chapterSlug, loId, title, coreIdea, workedExample, commonMistake, checkYourself, sources = []) {
  const dir = path.join(ROOT_DIR, 'content', courseSlug, chapterSlug, 'notes');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const srcList = sources.length > 0 ? sources : [
    { title: "Scikit-Learn Documentation & User Guide", url: "https://scikit-learn.org/stable/user_guide.html" }
  ];

  const content = `---
loId: "${loId}"
title: "${title}"
reviewed: false
sources:
${srcList.map(s => `  - title: "${s.title}"\n    url: "${s.url}"`).join('\n')}
---

### Core Idea
${coreIdea.trim()}

### Worked Example
${workedExample.trim()}

### Common Mistake
${commonMistake.trim()}

### Check Yourself
${checkYourself.trim()}
`;

  fs.writeFileSync(path.join(dir, `${loId}.mdx`), content, 'utf-8');
}

function balanceAndSave(courseSlug, chapterSlug, objData, bankData) {
  const chapterDir = path.join(ROOT_DIR, 'content', courseSlug, chapterSlug);
  if (!fs.existsSync(chapterDir)) fs.mkdirSync(chapterDir, { recursive: true });

  fs.writeFileSync(path.join(chapterDir, 'objectives.json'), JSON.stringify(objData, null, 2), 'utf-8');

  const targetKeys = ['a', 'b', 'c', 'd'];
  let keyIdx = 0;
  for (const q of bankData) {
    if ((q.type === 'single' || q.type === 'scenario') && q.options && q.options.length === 4) {
      const desiredAnswerKey = targetKeys[keyIdx % 4];
      keyIdx++;
      const currentAnswerKey = q.answer[0];
      if (currentAnswerKey !== desiredAnswerKey) {
        const currentOpt = q.options.find(o => o.id === currentAnswerKey);
        const desiredOpt = q.options.find(o => o.id === desiredAnswerKey);
        if (currentOpt && desiredOpt) {
          const tempText = currentOpt.text;
          currentOpt.text = desiredOpt.text;
          desiredOpt.text = tempText;
          q.answer = [desiredAnswerKey];
        }
      }
    }
  }

  const quizDir = path.join(chapterDir, 'quiz');
  if (!fs.existsSync(quizDir)) fs.mkdirSync(quizDir, { recursive: true });
  fs.writeFileSync(path.join(quizDir, 'bank.json'), JSON.stringify(bankData, null, 2), 'utf-8');
}

// ============================================================================
// CHAPTER 6: Trees, Ensembles & SVMs (ai-06)
// ============================================================================
console.log('Generating ai-06: trees-ensembles-and-svms...');

const ai06Objectives = {
  version: 1,
  chapterId: "ai-06",
  objectives: [
    {
      id: "aiml-06-lo01",
      order: 1,
      title: "Construct decision tree splits using Shannon Entropy, Information Gain, and Gini Impurity",
      bloom: "apply",
      tier: "core",
      mustHave: true,
      keywords: ["decision tree", "entropy", "Gini impurity", "information gain", "split criterion", "CART"],
      aliases: ["tree splitting", "impurity criteria"],
      prerequisites: [],
      estMinutes: 12
    },
    {
      id: "aiml-06-lo02",
      order: 2,
      title: "Mitigate tree overfitting using maximum depth constraints, minimum sample splits, and cost-complexity pruning",
      bloom: "apply",
      tier: "core",
      mustHave: true,
      keywords: ["tree pruning", "max_depth", "min_samples_split", "cost-complexity", "ccp_alpha", "overfitting"],
      aliases: ["tree regularization", "pre-pruning post-pruning"],
      prerequisites: ["aiml-06-lo01"],
      estMinutes: 10
    },
    {
      id: "aiml-06-lo03",
      order: 3,
      title: "Construct Random Forest ensembles using Bootstrap Aggregation (bagging) and random feature subspace sampling",
      bloom: "apply",
      tier: "core",
      mustHave: true,
      keywords: ["random forest", "bagging", "bootstrap aggregation", "out-of-bag error", "feature subsampling", "decorrelation"],
      aliases: ["forest ensemble", "bootstrap bagging"],
      prerequisites: ["aiml-06-lo01", "aiml-06-lo02"],
      estMinutes: 12
    },
    {
      id: "aiml-06-lo04",
      order: 4,
      title: "Optimize sequential decision trees using Gradient Boosting and shrinkage learning rates",
      bloom: "apply",
      tier: "core",
      mustHave: true,
      keywords: ["gradient boosting", "boosting", "residual fitting", "learning rate shrinkage", "AdaBoost", "GBDT"],
      aliases: ["gradient boosted trees", "residual learning"],
      prerequisites: ["aiml-06-lo01", "aiml-06-lo03"],
      estMinutes: 12
    },
    {
      id: "aiml-06-lo05",
      order: 5,
      title: "Analyze extreme gradient boosting (XGBoost) enhancements including second-order Taylor approximations and regularized split gain",
      bloom: "analyze",
      tier: "core",
      mustHave: false,
      keywords: ["XGBoost", "second-order gradient", "Hessian", "regularized split", "sparsity awareness", "LightGBM"],
      aliases: ["extreme gradient boosting", "second order boosting"],
      prerequisites: ["aiml-06-lo04"],
      estMinutes: 12
    },
    {
      id: "aiml-06-lo06",
      order: 6,
      title: "Maximize classification margins using linear Support Vector Machines (SVMs) and slack variables",
      bloom: "apply",
      tier: "core",
      mustHave: false,
      keywords: ["support vector machine", "SVM", "maximum margin", "support vectors", "slack variables", "hinge loss", "parameter C"],
      aliases: ["margin maximization", "soft margin SVM"],
      prerequisites: [],
      estMinutes: 12
    },
    {
      id: "aiml-06-lo07",
      order: 7,
      title: "Transform non-linear feature geometries using the SVM Kernel Trick (Polynomial and RBF kernels)",
      bloom: "apply",
      tier: "core",
      mustHave: false,
      keywords: ["kernel trick", "RBF kernel", "radial basis function", "polynomial kernel", "Mercer theorem", "gamma"],
      aliases: ["kernel SVM", "non-linear mapping"],
      prerequisites: ["aiml-06-lo06"],
      estMinutes: 12
    },
    {
      id: "aiml-06-lo08",
      order: 8,
      title: "Classify observations using non-parametric k-Nearest Neighbors (k-NN) and distance metrics",
      bloom: "apply",
      tier: "core",
      mustHave: false,
      keywords: ["k-NN", "nearest neighbors", "Euclidean distance", "Manhattan distance", "non-parametric", "curse of dimensionality"],
      aliases: ["k nearest neighbors", "instance-based learning"],
      prerequisites: [],
      estMinutes: 10
    },
    {
      id: "aiml-06-lo09",
      order: 9,
      title: "Select optimal machine learning models based on dataset size, interpretability, and latency trade-offs",
      bloom: "evaluate",
      tier: "extension",
      mustHave: false,
      keywords: ["model selection", "inference latency", "interpretability", "linear vs tree", "tabular benchmarks"],
      aliases: ["algorithm selection", "production trade-offs"],
      prerequisites: ["aiml-06-lo03", "aiml-06-lo04", "aiml-06-lo06"],
      estMinutes: 15
    }
  ]
};

// Notes for ai-06
writeNoteBlock('ai-ml', 'trees-ensembles-and-svms', 'aiml-06-lo01',
  'Decision Tree Splitting Criteria: Gini Impurity and Shannon Entropy',
  `Decision trees partition multidimensional feature space into orthogonal hyper-rectangles using hierarchical threshold queries (e.g., $x_1 \\le 3.5$). At each internal node, the Classification and Regression Tree (CART) algorithm searches over all features and potential split thresholds to maximize **Information Gain**—the reduction in node impurity.

Two primary impurity metrics govern classification splits:
1. **Gini Impurity**: Measures the probability that a randomly chosen element from the node subset would be incorrectly labeled if it were randomly labeled according to the class distribution:
$$I_G(p) = 1 - \\sum_{k=1}^K p_k^2$$
For a perfectly pure node (all samples belong to one class), $I_G = 0$. For a 50/50 binary split, $I_G = 0.5$.
2. **Shannon Entropy**: Measures the information-theoretic uncertainty in bits:
$$H(p) = -\\sum_{k=1}^K p_k \\log_2(p_k)$$
Entropy peaks at $1.0$ for a balanced binary split and reaches $0.0$ for pure nodes.

Gini is computationally faster because it avoids calculating logarithms, making it the default in modern libraries like Scikit-Learn.`,
  `Computing Gini impurity and Information Gain in Python:
\`\`\`python
# numpy==1.26.4
import numpy as np

def gini_impurity(counts):
    total = np.sum(counts)
    if total == 0: return 0.0
    probs = counts / total
    return 1.0 - np.sum(probs**2)

# Parent node with 50 positive and 50 negative samples
parent_gini = gini_impurity(np.array([50, 50])) # 1.0 - (0.25 + 0.25) = 0.50

# Split into left child (40 pos, 10 neg) and right child (10 pos, 40 neg)
left_gini = gini_impurity(np.array([40, 10]))   # 1 - (0.64 + 0.04) = 0.32
right_gini = gini_impurity(np.array([10, 40]))  # 0.32

# Weighted child impurity
weighted_child_gini = 0.5 * left_gini + 0.5 * right_gini # 0.32
info_gain = parent_gini - weighted_child_gini
print(f"Parent Gini: {parent_gini:.2f}, Information Gain: {info_gain:.2f}") # Gain = 0.18
\`\`\``,
  `Assuming Gini impurity and Entropy produce radically divergent decision trees. In practice, they select identical split points over 98% of the time; Gini simply avoids expensive floating-point logarithm evaluations.`,
  `What is the Gini impurity of a perfectly pure node where 100% of samples belong to Class A? (0.0).`
);

writeNoteBlock('ai-ml', 'trees-ensembles-and-svms', 'aiml-06-lo02',
  'Tree Overfitting Mitigation: Pre-Pruning and Cost-Complexity Pruning',
  `Unconstrained decision trees partition feature space until every leaf node contains a single training sample ($I_G = 0$). While this achieves 100% training accuracy, the tree memorizes individual noise points and outliers, creating highly fragmented decision boundaries that fail to generalize (severe high variance).

Overfitting is mitigated using two pruning paradigms:
1. **Pre-Pruning (Early Stopping)**: Halting tree expansion during construction via structural hyperparameters:
   - \`max_depth\`: Limits vertical hierarchy depth.
   - \`min_samples_split\`: Minimum samples required to attempt a split.
   - \`min_samples_leaf\`: Minimum samples required in any terminal leaf node.
2. **Post-Pruning (Minimal Cost-Complexity Pruning)**: Growing the full tree $T_0$, then pruning subtrees backward by penalizing tree size with cost-complexity parameter $\\alpha \\ge 0$:
$$R_\\alpha(T) = R(T) + \\alpha |T|$$
where $R(T)$ is total leaf misclassification and $|T|$ is the count of terminal leaves. Tuning $\\alpha$ via cross-validation extracts the optimal pruned subtree.`,
  `Applying cost-complexity pruning in Scikit-Learn:
\`\`\`python
# scikit-learn==1.4.2
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=200, n_features=5, random_state=42)

# Unconstrained tree overfits
unconstrained = DecisionTreeClassifier(random_state=42).fit(X, y)
print(f"Unconstrained depth: {unconstrained.get_depth()}, leaves: {unconstrained.get_n_leaves()}")

# Pre-pruned tree restricts depth and leaf size
pruned = DecisionTreeClassifier(max_depth=4, min_samples_leaf=5, random_state=42).fit(X, y)
print(f"Pruned depth: {pruned.get_depth()}, leaves: {pruned.get_n_leaves()}")
\`\`\``,
  `Setting \`max_depth\` excessively shallow (e.g., depth=1, a decision stump) on complex non-linear problems, inducing severe underfitting and high bias.`,
  `Which hyperparameter in Scikit-Learn's \`DecisionTreeClassifier\` directly limits the maximum vertical depth of the tree hierarchy? (\`max_depth\`).`
);

writeNoteBlock('ai-ml', 'trees-ensembles-and-svms', 'aiml-06-lo03',
  'Random Forest Ensembles: Bagging and Feature Subspace Sampling',
  `Individual decision trees have high variance and sensitivity to training data fluctuations. **Random Forests** solve this limitation by assembling a diverse committee of decorrelated decision trees using **Bootstrap Aggregation (Bagging)** and random feature subspace projection.

Core mechanics:
1. **Bootstrapping**: Each tree $t$ is trained on an independent bootstrap sample of size $N$ drawn *with replacement* from the training dataset. Statistically, each bootstrap draw contains approximately $1 - 1/e \\approx 63.2\\%$ of unique observations; the remaining $36.8\\%$ form the **Out-Of-Bag (OOB)** sample, serving as an organic validation set.
2. **Feature Subsampling**: At *every split node*, the algorithm selects a random subset of $m \\approx \\sqrt{D}$ features rather than evaluating all $D$ features. This prevents a single dominant feature from dictating the root splits across all trees, decorrelating individual tree predictions.
3. **Aggregation**: For classification, trees vote by majority rule; for regression, predictions are averaged: $\\hat{y} = \\frac{1}{B} \\sum_{b=1}^B T_b(\\mathbf{x})$. By the law of large numbers, averaging $B$ decorrelated high-variance models reduces overall ensemble variance without increasing bias.`,
  `Training a Random Forest and evaluating Out-Of-Bag (OOB) score:
\`\`\`python
# scikit-learn==1.4.2
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=500, n_features=10, random_state=42)

# Train forest with OOB scoring enabled
rf = RandomForestClassifier(n_estimators=100, max_features="sqrt", oob_score=True, random_state=42)
rf.fit(X, y)

print(f"OOB Generalization Score: {rf.oob_score_:.4f}")
print(f"Feature Importances:\\n{rf.feature_importances_.round(3)}")
\`\`\``,
  `Assuming adding more trees (\`n_estimators=1000\`) causes a Random Forest to overfit. Adding trees reduces ensemble variance and stabilizes predictions; it never increases overfitting risk (though it hits diminishing returns in latency).`,
  `What proportion of original training samples are left out as Out-Of-Bag (OOB) validation samples in a standard bootstrap sample with replacement? (Approximately 36.8%).`
);

writeNoteBlock('ai-ml', 'trees-ensembles-and-svms', 'aiml-06-lo04',
  'Gradient Boosting: Sequential Residual Optimization and Shrinkage',
  `While Random Forests train independent trees in parallel to reduce variance, **Gradient Boosting** trains trees sequentially to reduce bias. Each successive tree is fit to predict the pseudo-residuals (negative loss gradients) of the preceding ensemble.

The Gradient Boosted Decision Tree (GBDT) algorithm operates iteratively:
1. Initialize ensemble with a constant baseline prediction that minimizes loss: $F_0(\\mathbf{x}) = \\arg\\min_c \\sum L(y_i, c)$ (for MSE, $F_0 = \\bar{y}$).
2. For iteration $m = 1$ to $M$:
   - Calculate pseudo-residuals: $r_{im} = -\\left[ \\frac{\\partial L(y_i, F(\\mathbf{x}_i))}{\\partial F(\\mathbf{x}_i)} \\right]_{F = F_{m-1}}$. Under MSE loss, the residual is simply $y_i - F_{m-1}(\\mathbf{x}_i)$.
   - Fit a shallow decision tree $h_m(\\mathbf{x})$ to predict residuals $r_{im}$.
   - Update the ensemble with a **shrinkage learning rate** $\\nu \\in (0, 1]$:
$$F_m(\\mathbf{x}) = F_{m-1}(\\mathbf{x}) + \\nu \\cdot h_m(\\mathbf{x})$$

The shrinkage factor $\\nu$ (typically $0.01$ to $0.1$) acts as regularization, ensuring each individual tree makes only a conservative contribution to the ensemble.`,
  `Training a Gradient Boosting Regressor in Scikit-Learn:
\`\`\`python
# scikit-learn==1.4.2
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.datasets import make_regression

X, y = make_regression(n_samples=200, n_features=6, noise=0.1, random_state=42)

# Gradient boosting with shrinkage learning rate
gbr = GradientBoostingRegressor(n_estimators=100, learning_rate=0.05, max_depth=3, random_state=42)
gbr.fit(X, y)

print(f"Train score: {gbr.score(X, y):.4f}")
\`\`\``,
  `Setting both \`learning_rate\` and \`n_estimators\` very high simultaneously without early stopping, which causes gradient boosting to severely overfit residual noise.`,
  `In Gradient Boosting under Mean Squared Error loss, what target values are predicted by each successive tree in the sequence? (The pseudo-residuals: $y_i - F_{m-1}(\\mathbf{x}_i)$).`
);

writeNoteBlock('ai-ml', 'trees-ensembles-and-svms', 'aiml-06-lo05',
  'XGBoost Enhancements: Second-Order Approximations and Regularized Splits',
  `Extreme Gradient Boosting (**XGBoost**) revolutionized competitive machine learning by redesigning the gradient boosting engine for maximum speed and regularization. 

Key architectural innovations:
1. **Second-Order Taylor Approximation**: Traditional GBDT uses only first-order gradients ($g_i = \\frac{\\partial L}{\\partial \\hat{y}}$). XGBoost incorporates second-order derivatives (**Hessians**: $h_i = \\frac{\\partial^2 L}{\\partial \\hat{y}^2}$), providing curvature information that accelerates convergence toward optimal split leaf weights.
2. **Regularized Split Gain**: The optimal weight of leaf $j$ is $w_j^* = -\\frac{\\sum_{i \\in I_j} g_i}{\\sum_{i \\in I_j} h_i + \\lambda}$, penalizing leaf weights with L2 parameter $\\lambda$. The split criterion gain formula incorporates complexity penalty $\\gamma$:
$$\\text{Gain} = \\frac{1}{2} \\left[ \\frac{G_L^2}{H_L + \\lambda} + \\frac{G_R^2}{H_R + \\lambda} - \\frac{(G_L + G_R)^2}{H_L + H_R + \\lambda} \\right] - \\gamma$$
If the computed gain is less than $\\gamma$, the split is pruned automatically.
3. **Hardware Accelerations**: Block sorting, histogram-based binning, cache-aware memory access, and native sparsity-aware handling of missing values.`,
  `Inspecting second-order Taylor expansion concept:
\`\`\`python
# numpy==1.26.4
import numpy as np

# MSE Loss: L(y, y_hat) = 0.5 * (y - y_hat)^2
# First derivative g = dL/dy_hat = y_hat - y
# Second derivative h = d^2L/dy_hat^2 = 1.0 (constant for MSE)
y_true = 10.0; y_hat = 7.0
g = y_hat - y_true # -3.0
h = 1.0            # +1.0

# Regularized leaf weight: w = -g / (h + lambda) with lambda=1.0
reg_lambda = 1.0
optimal_leaf_weight = -g / (h + reg_lambda)
print(f"Gradient: {g}, Hessian: {h}, Optimal Leaf Weight: {optimal_leaf_weight:.2f}") # +1.5
\`\`\``,
  `Confusing XGBoost with simple Random Forests. Random Forests grow independent unconstrained trees in parallel; XGBoost optimizes regularized sequential residual trees guided by second-order gradients.`,
  `What additional mathematical information does XGBoost utilize beyond standard first-order gradients? (Second-order Hessian derivatives, capturing loss surface curvature).`
);

writeNoteBlock('ai-ml', 'trees-ensembles-and-svms', 'aiml-06-lo06',
  'Support Vector Machines: Maximum Margin Hyperplanes and Slack Variables',
  `Support Vector Machines (**SVMs**) classify linearly separable binary data by finding the unique decision hyperplane that maximizes the geometric **margin**—the physical distance between the hyperplane and the closest training data points from either class. These critical boundary points are the **Support Vectors**; all other training points can be moved or deleted without altering the decision boundary.

For linearly separable data with labels $y_i \\in \\{-1, +1\\}$, the margin width is $\\frac{2}{\\|\\mathbf{w}\\|_2}$. Maximizing the margin corresponds to minimizing $\\frac{1}{2}\\|\\mathbf{w}\\|^2$.

When classes overlap in real data, the **Soft-Margin SVM** introduces slack variables $\\xi_i \\ge 0$ to permit controlled margin violations, controlled by penalty parameter $C > 0$:
$$\\min_{\\mathbf{w}, b, \\boldsymbol{\\xi}} \\frac{1}{2}\\|\\mathbf{w}\\|^2 + C \\sum_{i=1}^N \\xi_i \\quad \\text{subject to } y_i(\\mathbf{w}^T \\mathbf{x}_i + b) \\ge 1 - \\xi_i$$
- **Large $C$**: Heavy penalty on slack violations, forcing narrow margins and risking overfitting.
- **Small $C$**: Tolerates margin violations, producing a wider margin that generalizes better.`,
  `Fitting a Soft-Margin Linear SVM with Scikit-Learn:
\`\`\`python
# scikit-learn==1.4.2
from sklearn.svm import SVC
import numpy as np

X = np.array([[1.0, 2.0], [2.0, 3.0], [3.0, 3.0], [5.0, 5.0], [6.0, 7.0], [7.0, 8.0]])
y = np.array([0, 0, 0, 1, 1, 1])

# Linear SVM with soft-margin parameter C
svm = SVC(kernel="linear", C=1.0)
svm.fit(X, y)

print(f"Number of support vectors: {len(svm.support_vectors_)}")
print(f"Support vector coordinates:\\n{svm.support_vectors_}")
\`\`\``,
  `Omitting feature scaling before training an SVM. Because SVMs maximize Euclidean geometric distances, features with large numeric scales dominate margin calculation completely. Always apply \`StandardScaler\`.`,
  `What happens to the SVM decision margin as the regularization penalty parameter $C$ approaches infinity? (The margin becomes as narrow as possible, attempting to strictly separate all training points without tolerance for violations).`
);

writeNoteBlock('ai-ml', 'trees-ensembles-and-svms', 'aiml-06-lo07',
  'The SVM Kernel Trick: Non-Linear Mapping and RBF Kernels',
  `When data is not linearly separable in its original $D$-dimensional feature space, linear hyperplanes fail. Cover's Theorem states that non-separable patterns can almost always be made linearly separable by projecting them into a sufficiently high-dimensional space: $\\mathbf{x} \\mapsto \\phi(\\mathbf{x})$.

Explicitly mapping features to high-dimensional space incurs crippling computational costs. The **Kernel Trick** bypasses explicit mapping entirely: because the dual formulation of SVM optimization depends *only* on inner dot products between sample pairs $\\phi(\\mathbf{x}_i) \\cdot \\phi(\\mathbf{x}_j)$, a **Kernel Function** $K(\\mathbf{x}_i, \\mathbf{x}_j)$ computes this inner product directly in low-dimensional space without ever calculating $\\phi(\\mathbf{x})$.

Common kernels:
1. **Polynomial Kernel**: $K(\\mathbf{x}, \\mathbf{z}) = (\\gamma \\mathbf{x}^T \\mathbf{z} + r)^d$.
2. **Radial Basis Function (RBF / Gaussian) Kernel**:
$$K(\\mathbf{x}, \\mathbf{z}) = \\exp\\left( -\\gamma \\|\\mathbf{x} - \\mathbf{z}\\|^2 \\right)$$
The RBF kernel implicitly projects data into an *infinite-dimensional* Hilbert space. The parameter $\\gamma$ controls the radius of influence: large $\\gamma$ creates tight, highly complex decision boundaries around individual points; small $\\gamma$ yields smooth boundaries.`,
  `Comparing Linear and RBF Kernel SVMs:
\`\`\`python
# scikit-learn==1.4.2
from sklearn.svm import SVC
from sklearn.datasets import make_circles

# Non-linearly separable concentric circles
X, y = make_circles(n_samples=200, factor=0.5, noise=0.1, random_state=42)

# Linear SVM fails on concentric circles
linear_svm = SVC(kernel="linear").fit(X, y)
print(f"Linear SVM Accuracy: {linear_svm.score(X, y):.2%}") # ~50% (random guess)

# RBF Kernel SVM maps to separable space effortlessly
rbf_svm = SVC(kernel="rbf", gamma="scale", C=1.0).fit(X, y)
print(f"RBF Kernel Accuracy: {rbf_svm.score(X, y):.2%}") # ~100%
\`\`\``,
  `Setting the RBF parameter $\\gamma$ excessively high (e.g., $\\gamma = 100.0$), creating narrow island-like decision boundaries around individual training points and severely overfitting.`,
  `What computational shortcut allows Support Vector Machines to evaluate dot products in infinite-dimensional Hilbert spaces without calculating transformed feature vectors? (The Kernel Trick).`
);

writeNoteBlock('ai-ml', 'trees-ensembles-and-svms', 'aiml-06-lo08',
  'Instance-Based Learning: k-Nearest Neighbors (k-NN) and Distance Metrics',
  `Most machine learning algorithms are *eager learners* that construct explicit parameterized functions during training. In contrast, **k-Nearest Neighbors (k-NN)** is a *lazy, non-parametric instance-based learner*. During training, k-NN simply stores the training dataset in memory ($\mathcal{O}(1)$ training cost).

Prediction mechanics:
1. For an incoming query point $\\mathbf{x}_q$, compute its geometric distance to all $N$ stored training instances.
2. Select the $k$ closest neighbors.
3. For classification, assign the majority class label among the $k$ neighbors; for regression, average their target values: $\\hat{y} = \\frac{1}{k} \\sum_{i \\in N_k} y_i$.

Distance metrics:
- **Euclidean ($L_2$) Distance**: $d(\\mathbf{u}, \\mathbf{v}) = \\sqrt{\\sum (u_i - v_i)^2}$.
- **Manhattan ($L_1$) Distance**: $d(\\mathbf{u}, \\mathbf{v}) = \\sum |u_i - v_i|$.

Challenges:
- **Inference Latency**: Predicting a single point requires scanning all $N$ training observations ($\\mathcal{O}(N \\cdot D)$), unless accelerated by KD-Trees or Ball-Trees.
- **Curse of Dimensionality**: In high dimensions ($D > 50$), distance metrics become uniform, degrading neighbor differentiation.`,
  `Classifying with k-NN in Scikit-Learn:
\`\`\`python
# scikit-learn==1.4.2
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import numpy as np

X = np.array([[1.0, 1.0], [1.5, 2.0], [3.0, 3.5], [5.0, 5.0], [6.0, 5.5]])
y = np.array([0, 0, 0, 1, 1])

# Pipeline ensures Euclidean scaling is uniform
knn = Pipeline([
    ("scaler", StandardScaler()),
    ("classifier", KNeighborsClassifier(n_neighbors=3, metric="euclidean"))
])
knn.fit(X, y)

query = np.array([[2.0, 2.0]])
pred = knn.predict(query)
probs = knn.predict_proba(query)
print(f"Predicted class: {pred[0]}, Class Probabilities: {probs[0]}")
\`\`\``,
  `Failing to scale features prior to running k-NN. Unscaled features with large numerical magnitudes (e.g., annual revenue) will completely dwarf small-scale features (e.g., age) in distance calculations.`,
  `Why does k-Nearest Neighbors exhibit high inference latency in production environments? (Because computing predictions requires calculating pairwise distances against the entire stored training dataset).`
);

writeNoteBlock('ai-ml', 'trees-ensembles-and-svms', 'aiml-06-lo09',
  'Model Selection Trade-Offs: Performance, Latency, and Interpretability',
  `No single machine learning algorithm outperforms all others across all problem domains—a principle formalized by the **No Free Lunch Theorem**. Selecting an appropriate model architecture requires balancing statistical accuracy against operational constraints:

1. **Tabular Data vs Deep Learning**: For structured tabular data, gradient boosted decision trees (XGBoost, LightGBM, CatBoost) consistently outperform deep neural networks in training speed, hyperparameter robustness, and empirical test accuracy.
2. **Inference Latency Budgets**:
   - *Microsecond Budgets* (e.g., high-frequency trading, packet inspection): Linear models or single small decision trees implemented as compiled C if/else branches.
   - *Millisecond Budgets* (e.g., web search reranking): Shallow Gradient Boosted Trees or small Random Forests.
   - *Batch Offline Pipelines*: Large tree ensembles or deep neural architectures.
3. **Regulatory Interpretability**: In regulated industries (credit lending under FCRA, medical diagnostics), algorithms must provide explicit adverse action notices. Linear models and shallow decision trees provide exact transparent coefficients and rules, whereas deep ensembles require post-hoc explainability tools (SHAP / TreeSHAP).`,
  `Benchmarking model training and inference latency:
\`\`\`python
# scikit-learn==1.4.2
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
import numpy as np
import time

X = np.random.randn(1000, 20)
y = np.random.randint(0, 2, 1000)

# Linear model latency
t0 = time.perf_counter()
lr = LogisticRegression().fit(X, y)
lr_pred_time = (time.perf_counter() - t0) * 1000

# Random Forest latency
t0 = time.perf_counter()
rf = RandomForestClassifier(n_estimators=100).fit(X, y)
rf_pred_time = (time.perf_counter() - t0) * 1000

print(f"Logistic Regression: {lr_pred_time:.2f} ms")
print(f"Random Forest (100 trees): {rf_pred_time:.2f} ms")
\`\`\``,
  `Defaulting to deep neural networks for standard tabular business datasets where gradient boosted trees achieve superior accuracy in a fraction of the training time.`,
  `What class of machine learning models consistently achieves state-of-the-art performance on structured tabular datasets while maintaining fast training times? (Gradient Boosted Decision Trees / GBDTs such as XGBoost and LightGBM).`
);

// Question Bank for ai-06 (36 questions: 4 per core LO + 2 for ext + 2 numeric)
const ai06Bank = [
  // LO01
  {
    id: "aiml-06-q01",
    loId: "aiml-06-lo01",
    type: "single",
    difficulty: 1,
    stem: "What does Gini Impurity measure in a decision tree node?",
    options: [
      { id: "a", text: "The probability that a randomly chosen sample would be misclassified if labeled according to the node's class distribution." },
      { id: "b", text: "The physical memory size of the tree data structure in bytes." },
      { id: "c", text: "The curvature of the decision boundary." },
      { id: "d", text: "The correlation between features." }
    ],
    answer: ["a"],
    explanation: "Gini impurity calculates 1 - sum(p_k^2), measuring the statistical dispersion of classes in a subset.",
    noteRef: "aiml-06-lo01",
    reviewed: false
  },
  {
    id: "aiml-06-lo02",
    loId: "aiml-06-lo01",
    type: "single",
    difficulty: 2,
    stem: "Why is Gini Impurity generally favored over Shannon Entropy as the default splitting criterion in CART implementations?",
    options: [
      { id: "a", text: "Gini impurity does not require computing logarithmic functions, executing faster while yielding virtually identical splits." },
      { id: "b", text: "Entropy can only process integer values." },
      { id: "c", text: "Gini impurity guarantees zero leaf overfitting." },
      { id: "d", text: "Entropy violates the laws of thermodynamics." }
    ],
    answer: ["a"],
    explanation: "Gini calculates simple squares rather than log2 evaluations, speeding up tree construction with negligible difference in split quality.",
    noteRef: "aiml-06-lo01",
    reviewed: false
  },
  {
    id: "aiml-06-lo03",
    loId: "aiml-06-lo01",
    type: "scenario",
    difficulty: 2,
    stem: "A decision tree node contains 80 samples of Class 0 and 20 samples of Class 1. What is the Gini impurity of this node?",
    options: [
      { id: "a", text: "0.32, calculated as 1 - (0.8^2 + 0.2^2) = 1 - (0.64 + 0.04) = 0.32." },
      { id: "b", text: "0.50, representing an even split." },
      { id: "c", text: "0.00, because Class 0 dominates." },
      { id: "d", text: "0.16, representing the minority fraction." }
    ],
    answer: ["a"],
    explanation: "Gini = 1 - (p_0^2 + p_1^2) = 1 - (0.64 + 0.04) = 0.32.",
    noteRef: "aiml-06-lo01",
    verify: "(1.0 - (Math.pow(0.8, 2) + Math.pow(0.2, 2)) === 0.32)",
    reviewed: false
  },
  {
    id: "aiml-06-q04",
    loId: "aiml-06-lo01",
    type: "numeric",
    difficulty: 2,
    stem: "A binary node has 50 samples of Class A and 50 samples of Class B. What is its Gini Impurity?",
    options: [
      { id: "a", text: "0.50" },
      { id: "b", text: "1.00" },
      { id: "c", text: "0.25" },
      { id: "d", text: "0.00" }
    ],
    answer: ["a"],
    explanation: "Gini = 1 - (0.5^2 + 0.5^2) = 1 - (0.25 + 0.25) = 0.50.",
    noteRef: "aiml-06-lo01",
    verify: "(1.0 - (0.25 + 0.25) === 0.5)",
    reviewed: false
  },

  // LO02
  {
    id: "aiml-06-q05",
    loId: "aiml-06-lo02",
    type: "single",
    difficulty: 1,
    stem: "Why do unconstrained decision trees exhibit severe overfitting on training data?",
    options: [
      { id: "a", text: "They partition feature space until every leaf contains a single sample, memorizing noise and outliers." },
      { id: "b", text: "They can only make horizontal splits." },
      { id: "c", text: "They have too few parameters to capture patterns." },
      { id: "d", text: "They require matrix inversion." }
    ],
    answer: ["a"],
    explanation: "Unconstrained trees grow until impurity is 0, creating hyper-specific boundaries that fit training noise.",
    noteRef: "aiml-06-lo02",
    reviewed: false
  },
  {
    id: "aiml-06-lo06",
    loId: "aiml-06-lo02",
    type: "single",
    difficulty: 2,
    stem: "What is the difference between pre-pruning and post-pruning in decision trees?",
    options: [
      { id: "a", text: "Pre-pruning halts growth early using depth/sample thresholds; post-pruning grows the full tree and trims branches using cost-complexity." },
      { id: "b", text: "Pre-pruning is for regression; post-pruning is only for classification." },
      { id: "c", text: "Post-pruning modifies feature values." },
      { id: "d", text: "Pre-pruning requires deep neural networks." }
    ],
    answer: ["a"],
    explanation: "Pre-pruning stops splitting early (max_depth, min_samples_leaf); post-pruning trims a fully grown tree using complexity penalties.",
    noteRef: "aiml-06-lo02",
    reviewed: false
  },
  {
    id: "aiml-06-q07",
    loId: "aiml-06-lo02",
    type: "scenario",
    difficulty: 2,
    stem: "A decision tree model achieves 100% training accuracy but only 68% cross-validation accuracy. Which hyperparameter adjustment will help reduce overfitting?",
    options: [
      { id: "a", text: "Reduce `max_depth` and increase `min_samples_leaf`." },
      { id: "b", text: "Increase `max_depth` to infinity." },
      { id: "c", text: "Decrease `min_samples_split` to 1." },
      { id: "d", text: "Remove all stopping criteria." }
    ],
    answer: ["a"],
    explanation: "Constraining depth and requiring more samples per leaf prevents isolated, overfitted partitions.",
    noteRef: "aiml-06-lo02",
    reviewed: false
  },
  {
    id: "aiml-06-q08",
    loId: "aiml-06-lo02",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following hyperparameters in Scikit-Learn's `DecisionTreeClassifier` act as pre-pruning regularizers?",
    options: [
      { id: "a", text: "`max_depth` (maximum vertical tree depth)" },
      { id: "b", text: "`min_samples_split` (minimum samples required to split an internal node)" },
      { id: "c", text: "`min_samples_leaf` (minimum samples required in a terminal leaf)" },
      { id: "d", text: "`learning_rate`" }
    ],
    answer: ["a", "b", "c"],
    explanation: "max_depth, min_samples_split, and min_samples_leaf constrain tree complexity. Learning rate is for boosted ensembles.",
    noteRef: "aiml-06-lo02",
    reviewed: false
  },

  // LO03
  {
    loId: "aiml-06-lo03",
    type: "single",
    difficulty: 1,
    id: "aiml-06-q09",
    stem: "What two randomization mechanisms define a Random Forest ensemble?",
    options: [
      { id: "a", text: "Bootstrap aggregation of training rows and random feature subset sampling at each split node." },
      { id: "b", text: "Random neural activations and dropout masks." },
      { id: "c", text: "Random learning rates and stochastic gradient steps." },
      { id: "d", text: "Random data deletion and noise injection." }
    ],
    answer: ["a"],
    explanation: "Random forests combine bagging (row bootstrapping with replacement) and random feature subspace selection per split.",
    noteRef: "aiml-06-lo03",
    reviewed: false
  },
  {
    id: "aiml-06-q10",
    loId: "aiml-06-lo03",
    type: "single",
    difficulty: 2,
    stem: "Why does selecting a random subset of features ($m \\approx \\sqrt{D}$) at each node split improve ensemble performance?",
    options: [
      { id: "a", text: "It decorrelates individual trees, preventing dominant features from dictating root splits across all trees." },
      { id: "b", text: "It compresses training data into 8-bit integers." },
      { id: "c", text: "It eliminates the need for leaf node predictions." },
      { id: "d", text: "It guarantees zero training error." }
    ],
    answer: ["a"],
    explanation: "Feature subsampling decorrelates the trees; averaging decorrelated trees drastically reduces ensemble variance.",
    noteRef: "aiml-06-lo03",
    reviewed: false
  },
  {
    id: "aiml-06-q11",
    loId: "aiml-06-lo03",
    type: "scenario",
    difficulty: 2,
    stem: "What is the 'Out-Of-Bag' (OOB) error in a Random Forest?",
    options: [
      { id: "a", text: "Validation error evaluated on the ~36.8% of samples left out of each tree's bootstrap training draw." },
      { id: "b", text: "The percentage of memory overflow errors during training." },
      { id: "c", text: "The misclassification rate on test data." },
      { id: "d", text: "The error caused by missing values." }
    ],
    answer: ["a"],
    explanation: "OOB samples act as a built-in cross-validation set because they are never seen during the training of that specific tree.",
    noteRef: "aiml-06-lo03",
    reviewed: false
  },
  {
    id: "aiml-06-q12",
    loId: "aiml-06-lo03",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following statements regarding Random Forests are true?",
    options: [
      { id: "a", text: "Individual decision trees in a Random Forest can be trained completely in parallel" },
      { id: "b", text: "Adding more trees (`n_estimators`) does not cause a Random Forest to overfit" },
      { id: "c", text: "Feature scaling (standardization) is not required for Random Forests" },
      { id: "d", text: "Random Forests cannot be used for regression tasks" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Random forests train in parallel, do not overfit from additional trees, and are scale-invariant. They support both classification and regression.",
    noteRef: "aiml-06-lo03",
    reviewed: false
  },

  // LO04
  {
    id: "aiml-06-q13",
    loId: "aiml-06-lo04",
    type: "single",
    difficulty: 1,
    stem: "How does Gradient Boosting differ fundamentally from Random Forests in how trees are trained?",
    options: [
      { id: "a", text: "Gradient Boosting trains trees sequentially to predict residual errors; Random Forests train trees independently in parallel." },
      { id: "b", text: "Gradient Boosting is an unsupervised algorithm." },
      { id: "c", text: "Random Forests use gradients, while Gradient Boosting does not." },
      { id: "d", text: "Gradient Boosting only works with linear models." }
    ],
    answer: ["a"],
    explanation: "Boosting builds sequential trees that iteratively correct the pseudo-residuals of previous trees.",
    noteRef: "aiml-06-lo04",
    reviewed: false
  },
  {
    id: "aiml-06-q14",
    loId: "aiml-06-lo04",
    type: "single",
    difficulty: 2,
    stem: "In Gradient Boosted Trees, what role does the 'shrinkage' (learning rate $\\nu$) play?",
    options: [
      { id: "a", text: "It scales each tree's prediction contribution, acting as regularization to prevent early trees from overfitting." },
      { id: "b", text: "It compresses the tree structure on disk." },
      { id: "c", text: "It sets the maximum leaf count." },
      { id: "d", text: "It removes negative predictions." }
    ],
    answer: ["a"],
    explanation: "Shrinkage scales each tree's contribution (e.g., 0.05), requiring many diverse trees to learn and preventing premature overfitting.",
    noteRef: "aiml-06-lo04",
    reviewed: false
  },
  {
    id: "aiml-06-q15",
    loId: "aiml-06-lo04",
    type: "scenario",
    difficulty: 2,
    stem: "Under Mean Squared Error loss, the current ensemble predicts $\\hat{y}_i = 18.0$ for true target $y_i = 25.0$. What pseudo-residual value must the next tree fit for this sample?",
    options: [
      { id: "a", text: "+7.0, calculated as y_i - y_hat_i = 25.0 - 18.0 = +7.0." },
      { id: "b", text: "-7.0." },
      { id: "c", text: "43.0." },
      { id: "d", text: "1.38." }
    ],
    answer: ["a"],
    explanation: "For MSE, the negative gradient (pseudo-residual) is exactly y - y_hat = 25 - 18 = 7.",
    noteRef: "aiml-06-lo04",
    verify: "(25.0 - 18.0 === 7.0)",
    reviewed: false
  },
  {
    id: "aiml-06-q16",
    loId: "aiml-06-lo04",
    type: "multi",
    difficulty: 3,
    stem: "Which hyperparameters in Gradient Boosting must be co-tuned to balance accuracy and overfitting?",
    options: [
      { id: "a", text: "`n_estimators` (number of sequential trees)" },
      { id: "b", text: "`learning_rate` (shrinkage factor)" },
      { id: "c", text: "`max_depth` (depth of individual weak learner trees)" },
      { id: "d", text: "`audio_sampling_frequency`" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Lower learning rates require higher n_estimators; shallow max_depth (3-6) ensures weak base learners.",
    noteRef: "aiml-06-lo04",
    reviewed: false
  },

  // LO05
  {
    id: "aiml-06-q17",
    loId: "aiml-06-lo05",
    type: "single",
    difficulty: 1,
    stem: "What mathematical enhancement does XGBoost incorporate beyond traditional first-order gradient boosting?",
    options: [
      { id: "a", text: "Second-order Taylor approximations using both first-order gradients and second-order Hessians." },
      { id: "b", text: "Complex imaginary number matrices." },
      { id: "c", text: "Convolutional pooling layers." },
      { id: "d", text: "Fourier frequency analysis." }
    ],
    answer: ["a"],
    explanation: "XGBoost uses exact second-order Taylor expansion (gradients g and Hessians h) to compute optimal leaf weights and split gain.",
    noteRef: "aiml-06-lo05",
    reviewed: false
  },
  {
    id: "aiml-06-q18",
    loId: "aiml-06-lo05",
    type: "single",
    difficulty: 2,
    stem: "How does the complexity parameter $\\gamma$ in XGBoost control tree growth?",
    options: [
      { id: "a", text: "It acts as a minimum split loss reduction threshold; splits with gain less than $\\gamma$ are pruned." },
      { id: "b", text: "It sets the learning rate." },
      { id: "c", text: "It determines the number of threads." },
      { id: "d", text: "It replaces missing values with zero." }
    ],
    answer: ["a"],
    explanation: "Gamma is the minimum gain required to make a further partition on a leaf node, pruning weak splits.",
    noteRef: "aiml-06-lo05",
    reviewed: false
  },
  {
    id: "aiml-06-q19",
    loId: "aiml-06-lo05",
    type: "scenario",
    difficulty: 2,
    stem: "An XGBoost tree evaluates a potential split that yields Gain $= 3.4$. If $\\gamma$ is set to $5.0$, will the split be performed?",
    options: [
      { id: "a", text: "No, because the split gain (3.4) does not exceed the regularization threshold gamma (5.0)." },
      { id: "b", text: "Yes, because gain is positive." },
      { id: "c", text: "Yes, but only on the right leaf." },
      { id: "d", text: "It depends on the random seed." }
    ],
    answer: ["a"],
    explanation: "XGBoost requires Gain >= gamma. Since 3.4 < 5.0, the split is rejected and the node remains terminal.",
    noteRef: "aiml-06-lo05",
    reviewed: false
  },
  {
    id: "aiml-06-q20",
    loId: "aiml-06-lo05",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following computational features make XGBoost and LightGBM exceptionally fast on large datasets?",
    options: [
      { id: "a", text: "Histogram-based continuous feature binning" },
      { id: "b", text: "Native sparsity awareness for missing values" },
      { id: "c", text: "Cache-aware memory pre-fetching and multithreaded block sorting" },
      { id: "d", text: "Quantum computing emulators" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Histogram binning, missing value default routing, and cache-conscious memory layout enable rapid training on millions of rows.",
    noteRef: "aiml-06-lo05",
    reviewed: false
  },

  // LO06
  {
    id: "aiml-06-q21",
    loId: "aiml-06-lo06",
    type: "single",
    difficulty: 1,
    stem: "In Support Vector Machines, what are the 'Support Vectors'?",
    options: [
      { id: "a", text: "The critical training data points that lie closest to the decision boundary and define the margin." },
      { id: "b", text: "The vector of bias constants." },
      { id: "c", text: "The target labels in the test set." },
      { id: "d", text: "The CPU memory registers." }
    ],
    answer: ["a"],
    explanation: "Support vectors are the training observations lying on or within the margin boundary; they uniquely determine the hyperplane position.",
    noteRef: "aiml-06-lo06",
    reviewed: false
  },
  {
    id: "aiml-06-q22",
    loId: "aiml-06-lo06",
    type: "single",
    difficulty: 2,
    stem: "In Soft-Margin SVMs, how does the regularization parameter $C$ balance the optimization trade-off?",
    options: [
      { id: "a", text: "Large $C$ penalizes slack violations heavily (narrow margin, risks overfitting); small $C$ tolerates violations (wider margin, generalizes better)." },
      { id: "b", text: "Large $C$ creates wider margins." },
      { id: "c", text: "Parameter $C$ sets the number of polynomial degrees." },
      { id: "d", text: "Parameter $C$ eliminates support vectors." }
    ],
    answer: ["a"],
    explanation: "C weights the penalty on slack variables. High C enforces strict separation with narrow margins; low C allows softer margins.",
    noteRef: "aiml-06-lo06",
    reviewed: false
  },
  {
    id: "aiml-06-q23",
    loId: "aiml-06-lo06",
    type: "scenario",
    difficulty: 2,
    stem: "An SVM achieves a weight vector norm $\\|\\mathbf{w}\\|_2 = 2.0$. What is the geometric margin width $\\frac{2}{\\|\\mathbf{w}\\|_2}$?",
    options: [
      { id: "a", text: "1.0, calculated as 2 / 2.0 = 1.0." },
      { id: "b", text: "4.0." },
      { id: "c", text: "0.5." },
      { id: "d", text: "2.0." }
    ],
    answer: ["a"],
    explanation: "Margin width = 2 / ||w|| = 2 / 2.0 = 1.0.",
    noteRef: "aiml-06-lo06",
    verify: "(2.0 / 2.0 === 1.0)",
    reviewed: false
  },
  {
    id: "aiml-06-q24",
    loId: "aiml-06-lo06",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following statements about Support Vector Machines are accurate?",
    options: [
      { id: "a", text: "Non-support vector data points can be moved or deleted without changing the optimal hyperplane" },
      { id: "b", text: "Features must be standardized so distance metrics along all axes are geometrically equivalent" },
      { id: "c", text: "SVMs optimize Hinge loss with L2 weight regularization" },
      { id: "d", text: "SVM training time scales linearly with $N = 10,000,000$ samples" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Hyperplanes depend only on support vectors, require scaled features, and optimize regularized hinge loss. Standard SVMs scale quadratically or cubically with sample count.",
    noteRef: "aiml-06-lo06",
    reviewed: false
  },

  // LO07
  {
    id: "aiml-06-q25",
    loId: "aiml-06-lo07",
    type: "single",
    difficulty: 1,
    stem: "What is the primary advantage of the 'Kernel Trick' in Support Vector Machines?",
    options: [
      { id: "a", text: "It computes inner products in high-dimensional feature spaces implicitly without explicitly mapping points." },
      { id: "b", text: "It converts continuous targets into binary classifications." },
      { id: "c", text: "It eliminates the need for support vectors." },
      { id: "d", text: "It runs without a CPU." }
    ],
    answer: ["a"],
    explanation: "The kernel trick evaluates K(u, v) = phi(u) . phi(v) directly, bypassing the computational cost of explicit transformation.",
    noteRef: "aiml-06-lo07",
    reviewed: false
  },
  {
    id: "aiml-06-q26",
    loId: "aiml-06-lo07",
    type: "single",
    difficulty: 2,
    stem: "In the Radial Basis Function (RBF) kernel $K(\\mathbf{x}, \\mathbf{z}) = \\exp(-\\gamma \\|\\mathbf{x} - \\mathbf{z}\\|^2)$, what does parameter $\\gamma$ control?",
    options: [
      { id: "a", text: "The radius of influence of each support vector: high $\\gamma$ creates tight complex boundaries (risks overfitting); low $\\gamma$ produces smooth boundaries." },
      { id: "b", text: "The number of trees in the ensemble." },
      { id: "c", text: "The learning rate of gradient descent." },
      { id: "d", text: "The maximum depth of the kernel." }
    ],
    answer: ["a"],
    explanation: "Gamma defines how far the influence of a single training example reaches. High gamma creates isolated island boundaries.",
    noteRef: "aiml-06-lo07",
    reviewed: false
  },
  {
    id: "aiml-06-q27",
    loId: "aiml-06-lo07",
    type: "scenario",
    difficulty: 2,
    stem: "You have a dataset where Class 1 forms a tight inner ring completely surrounded by Class 0 (concentric circles). Which kernel will separate these classes effortlessly?",
    options: [
      { id: "a", text: "RBF (Gaussian) Kernel or degree-2 Polynomial Kernel." },
      { id: "b", text: "Linear Kernel." },
      { id: "c", text: "Zero-order Step Kernel." },
      { id: "d", text: "None; concentric circles cannot be solved by SVMs." }
    ],
    answer: ["a"],
    explanation: "Concentric rings are not linearly separable in 2D, but become linearly separable when projected via RBF or polynomial (x1^2 + x2^2) kernels.",
    noteRef: "aiml-06-lo07",
    reviewed: false
  },
  {
    id: "aiml-06-q28",
    loId: "aiml-06-lo07",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following are valid Mercer kernel functions supported in Scikit-Learn's `SVC`?",
    options: [
      { id: "a", text: "`kernel='linear'`" },
      { id: "b", text: "`kernel='rbf'`" },
      { id: "c", text: "`kernel='poly'`" },
      { id: "d", text: "`kernel='deep_transformer'`" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Linear, RBF, polynomial, and sigmoid are standard Mercer kernels in Scikit-Learn.",
    noteRef: "aiml-06-lo07",
    reviewed: false
  },

  // LO08
  {
    id: "aiml-06-q29",
    loId: "aiml-06-lo08",
    type: "single",
    difficulty: 1,
    stem: "Why is k-Nearest Neighbors (k-NN) categorized as a 'lazy learner'?",
    options: [
      { id: "a", text: "It does not learn an explicit parameterized model during training, deferring computation until query inference time." },
      { id: "b", text: "It executes with 0% CPU utilization." },
      { id: "c", text: "It can only run in background threads." },
      { id: "d", text: "It skips difficult training examples." }
    ],
    answer: ["a"],
    explanation: "k-NN simply stores training data during fit; all distance calculations and neighbor lookups occur dynamically at inference.",
    noteRef: "aiml-06-lo08",
    reviewed: false
  },
  {
    id: "aiml-06-q30",
    loId: "aiml-06-lo08",
    type: "single",
    difficulty: 2,
    stem: "What happens to the decision boundary of a k-NN classifier when $k$ is set to 1 ($k=1$)?",
    options: [
      { id: "a", text: "The decision boundary becomes extremely jagged and sensitive to individual noise points (maximum variance / overfitting)." },
      { id: "b", text: "The decision boundary becomes a perfectly flat linear plane." },
      { id: "c", text: "The model underfits and predicts the majority class." },
      { id: "d", text: "The model cannot make predictions." }
    ],
    answer: ["a"],
    explanation: "At k=1, each training sample creates its own Voronoi cell, memorizing outliers and producing high variance.",
    noteRef: "aiml-06-lo08",
    reviewed: false
  },
  {
    id: "aiml-06-q31",
    loId: "aiml-06-lo08",
    type: "scenario",
    difficulty: 2,
    stem: "A query point has 5 nearest neighbors with classes [1, 1, 0, 1, 0]. What class does a 5-NN classifier predict by majority vote?",
    options: [
      { id: "a", text: "Class 1, because 3 of the 5 neighbors belong to Class 1 (60% majority)." },
      { id: "b", text: "Class 0." },
      { id: "c", text: "Tie (no prediction)." },
      { id: "d", text: "Class 2." }
    ],
    answer: ["a"],
    explanation: "Majority vote among [1, 1, 0, 1, 0] gives 3 votes for Class 1 and 2 votes for Class 0.",
    noteRef: "aiml-06-lo08",
    verify: "([1, 1, 0, 1, 0].filter(x => x === 1).length === 3)",
    reviewed: false
  },
  {
    id: "aiml-06-q32",
    loId: "aiml-06-lo08",
    type: "multi",
    difficulty: 3,
    stem: "What factors severely degrade k-NN performance in production systems?",
    options: [
      { id: "a", text: "High inference latency scaling as $\\mathcal{O}(N \\cdot D)$ with dataset size" },
      { id: "b", text: "The curse of dimensionality in high feature spaces ($D > 100$)" },
      { id: "c", text: "Failure to scale input features to uniform ranges" },
      { id: "d", text: "Lack of GPU backpropagation support" }
    ],
    answer: ["a", "b", "c"],
    explanation: "k-NN suffers from distance metric uniformity in high dimensions, scale sensitivity, and heavy inference compute.",
    noteRef: "aiml-06-lo08",
    reviewed: false
  },

  // LO09 (Extension)
  {
    id: "aiml-06-q33",
    loId: "aiml-06-lo09",
    type: "single",
    difficulty: 2,
    stem: "When deploying a model for high-frequency fraud detection requiring sub-millisecond (<1ms) inference latency, which architecture is best suited?",
    options: [
      { id: "a", text: "A regularized linear model (Logistic Regression) or shallow decision tree." },
      { id: "b", text: "A 500-tree Gradient Boosted ensemble." },
      { id: "c", text: "k-Nearest Neighbors with 10 million stored points." },
      { id: "d", text: "A 70-billion parameter transformer." }
    ],
    answer: ["a"],
    explanation: "Linear models evaluate a simple dot product in microseconds, meeting strict real-time SLA constraints.",
    noteRef: "aiml-06-lo09",
    reviewed: false
  },
  {
    id: "aiml-06-q34",
    loId: "aiml-06-lo09",
    type: "single",
    difficulty: 3,
    stem: "What does the 'No Free Lunch' theorem establish regarding machine learning model selection?",
    options: [
      { id: "a", text: "No single learning algorithm is universally superior across all possible data distributions when averaged over all problems." },
      { id: "b", text: "Machine learning algorithms require paid cloud subscriptions." },
      { id: "c", text: "Deep learning always beats decision trees." },
      { id: "d", text: "Models must be retrained every 24 hours." }
    ],
    answer: ["a"],
    explanation: "The No Free Lunch theorem proves that every algorithm's inductive bias makes it excel on some problems while underperforming on others.",
    noteRef: "aiml-06-lo09",
    reviewed: false
  },
  {
    id: "aiml-06-q35",
    loId: "aiml-06-lo08",
    type: "numeric",
    difficulty: 2,
    stem: "What is the Euclidean distance between query point $\\mathbf{q} = [1.0, 2.0]$ and neighbor $\\mathbf{p} = [4.0, 6.0]$?",
    options: [
      { id: "a", text: "5.0" },
      { id: "b", text: "7.0" },
      { id: "c", text: "25.0" },
      { id: "d", text: "3.5" }
    ],
    answer: ["a"],
    explanation: "Distance = sqrt((4-1)^2 + (6-2)^2) = sqrt(3^2 + 4^2) = sqrt(9 + 16) = sqrt(25) = 5.0.",
    noteRef: "aiml-06-lo08",
    verify: "(Math.sqrt(Math.pow(4-1, 2) + Math.pow(6-2, 2)) === 5.0)",
    reviewed: false
  }
];

balanceAndSave('ai-ml', 'trees-ensembles-and-svms', ai06Objectives, ai06Bank);

console.log('✅ ai-06 complete.');

// ============================================================================
// CHAPTER 7: Evaluation, Overfitting & Hyperparameter Tuning (ai-07)
// ============================================================================
console.log('Generating ai-07: evaluation-overfitting-and-tuning...');

const ai07Objectives = {
  version: 1,
  chapterId: "ai-07",
  objectives: [
    {
      id: "aiml-07-lo01",
      order: 1,
      title: "Diagnose model generalization using the Bias-Variance tradeoff and irreducible error decomposition",
      bloom: "analyze",
      tier: "core",
      mustHave: true,
      keywords: ["bias-variance tradeoff", "underfitting", "overfitting", "irreducible error", "generalization gap", "model capacity"],
      aliases: ["bias variance decomposition", "error analysis"],
      prerequisites: [],
      estMinutes: 12
    },
    {
      id: "aiml-07-lo02",
      order: 2,
      title: "Evaluate generalization stability using k-Fold, Stratified, and Time-Series Cross-Validation",
      bloom: "apply",
      tier: "core",
      mustHave: true,
      keywords: ["k-fold cross-validation", "stratified k-fold", "time series split", "validation folds", "variance estimation"],
      aliases: ["cross-validation resampling", "resampling protocols"],
      prerequisites: ["aiml-07-lo01"],
      estMinutes: 12
    },
    {
      id: "aiml-07-lo03",
      order: 3,
      title: "Construct and interpret Confusion Matrices to identify True Positives, False Positives, and False Negatives",
      bloom: "apply",
      tier: "core",
      mustHave: true,
      keywords: ["confusion matrix", "true positive", "false positive", "true negative", "false negative", "type I error", "type II error"],
      aliases: ["classification contingency table", "error matrix"],
      prerequisites: [],
      estMinutes: 10
    },
    {
      id: "aiml-07-lo04",
      order: 4,
      title: "Calculate Precision, Recall, and the harmonic F1-score across asymmetric error costs",
      bloom: "apply",
      tier: "core",
      mustHave: true,
      keywords: ["precision", "recall", "F1-score", "harmonic mean", "F-beta", "cost-sensitive evaluation"],
      aliases: ["precision recall metrics", "F1 score"],
      prerequisites: ["aiml-07-lo03"],
      estMinutes: 12
    },
    {
      id: "aiml-07-lo05",
      order: 5,
      title: "Evaluate discrimination thresholds using Receiver Operating Characteristic (ROC) and Area Under the Curve (AUC)",
      bloom: "analyze",
      tier: "core",
      mustHave: false,
      keywords: ["ROC curve", "ROC-AUC", "TPR", "FPR", "threshold invariant", "rank order"],
      aliases: ["ROC AUC evaluation", "receiver operating characteristic"],
      prerequisites: ["aiml-07-lo03", "aiml-07-lo04"],
      estMinutes: 12
    },
    {
      id: "aiml-07-lo06",
      order: 6,
      title: "Tune hyperparameters using Grid Search, Randomized Search, and Bayesian Optimization",
      bloom: "apply",
      tier: "core",
      mustHave: false,
      keywords: ["hyperparameter tuning", "GridSearchCV", "RandomizedSearchCV", "Bayesian optimization", "Optuna", "search space"],
      aliases: ["hyperparameter search", "model tuning"],
      prerequisites: ["aiml-07-lo02"],
      estMinutes: 12
    },
    {
      id: "aiml-07-lo07",
      order: 7,
      title: "Analyze Learning Curves to distinguish between high bias (underfitting) and high variance (overfitting)",
      bloom: "analyze",
      tier: "core",
      mustHave: false,
      keywords: ["learning curves", "sample size scaling", "high bias diagnosis", "high variance diagnosis", "asymptotic convergence"],
      aliases: ["sample complexity curves", "model diagnostic curves"],
      prerequisites: ["aiml-07-lo01"],
      estMinutes: 10
    },
    {
      id: "aiml-07-lo08",
      order: 8,
      title: "Establish performance baselines and verify evaluation pipelines against subtle data leakage",
      bloom: "analyze",
      tier: "core",
      mustHave: false,
      keywords: ["baseline models", "dummy classifier", "evaluation leakage", "target leakage", "pipeline hygiene"],
      aliases: ["baseline benchmarking", "evaluation integrity"],
      prerequisites: ["aiml-07-lo02", "aiml-07-lo03"],
      estMinutes: 10
    },
    {
      id: "aiml-07-lo09",
      order: 9,
      title: "Calibrate probabilistic model predictions using Platt Scaling and Isotonic Regression",
      bloom: "apply",
      tier: "extension",
      mustHave: false,
      keywords: ["probability calibration", "Platt scaling", "isotonic regression", "Brier score", "calibration curve", "reliability diagram"],
      aliases: ["confidence calibration", "probability reliability"],
      prerequisites: ["aiml-07-lo04", "aiml-07-lo05"],
      estMinutes: 15
    }
  ]
};

// Notes for ai-07
writeNoteBlock('ai-ml', 'evaluation-overfitting-and-tuning', 'aiml-07-lo01',
  'The Bias-Variance Tradeoff and Generalization Error Decomposition',
  `The central objective of supervised learning is minimizing expected generalization error on unseen test distributions. Mathematically, expected mean squared error decomposes into three distinct orthogonal components:
$$\\mathbb{E}[(y - \\hat{f}(\\mathbf{x}))^2] = \\text{Bias}[\\hat{f}(\\mathbf{x})]^2 + \\text{Var}[\\hat{f}(\\mathbf{x})] + \\sigma_\\epsilon^2$$

1. **Bias ($\text{Bias}^2$)**: Error originating from overly simplistic mathematical assumptions (underfitting). A linear model fitted to curved cubic data has high bias; it systematically fails to capture the true underlying functional shape regardless of training sample size.
2. **Variance ($\text{Var}$)**: Error originating from excessive sensitivity to fluctuations in the training dataset (overfitting). A high-degree polynomial fits local random noise, yielding wildly divergent parameter fits across different training draws.
3. **Irreducible Error ($\\sigma_\\epsilon^2$)**: The inherent noise in the system originating from unmeasured features or stochastic physical processes; no algorithm can overcome this floor.

Increasing model capacity (adding parameters) decreases bias but increases variance. The optimal model balances capacity at the sweet spot where total error reaches its global minimum.`,
  `Diagnosing bias vs variance from train and validation curves:
\`\`\`python
# scikit-learn==1.4.2
from sklearn.metrics import mean_squared_error
import numpy as np

# Scenario A: High Bias (Underfitting)
train_mse_a = 45.2; val_mse_a = 48.0
# Diagnosis: Both errors are high; model lacks capacity to capture pattern.

# Scenario B: High Variance (Overfitting)
train_mse_b = 2.1; val_mse_b = 42.5
# Diagnosis: Large generalization gap; model memorized training noise.

# Scenario C: Optimal Trade-Off
train_mse_c = 12.0; val_mse_c = 14.5
# Diagnosis: Low training error, tight generalization gap.
print(f"Scenario B Generalization Gap: {val_mse_b - train_mse_b:.1f}")
\`\`\``,
  `Attempting to fix high bias (underfitting) by collecting more training data. Adding data only helps high variance (overfitting); if a model lacks capacity, more data cannot fix fundamentally flawed linear assumptions.`,
  `Which error component in the Bias-Variance decomposition represents the absolute theoretical performance floor that cannot be eliminated by any machine learning model? (Irreducible error $\\sigma_\\epsilon^2$).`
);

writeNoteBlock('ai-ml', 'evaluation-overfitting-and-tuning', 'aiml-07-lo02',
  'Cross-Validation Protocols: k-Fold, Stratified, and Temporal Splits',
  `A single train/test split provides only an isolated point estimate of model performance, subject to high variance based on which specific samples were randomly sequestered into the test set. **Cross-Validation** generates reliable empirical estimates of expected generalization error.

Primary validation protocols:
1. **Standard k-Fold Cross-Validation**: Partitions the training set into $k$ equal, non-overlapping folds. The model is trained $k$ times; in each iteration, $k-1$ folds serve as training data and the remaining fold serves as validation. The final score is the mean and standard error across all $k$ validation iterations.
2. **Stratified k-Fold**: Essential for classification datasets. Ensures every fold maintains the identical target class proportion (e.g., 90% Class 0 and 10% Class 1) as the complete dataset, preventing folds from having zero positive instances.
3. **Time-Series (Temporal) Split**: On sequential time-series data, standard k-fold causes catastrophic future lookahead leakage. A temporal split enforces strict chronological ordering ($t_1 \\to t_2 \\to t_3$), training strictly on historical windows to predict subsequent future blocks.`,
  `Executing Stratified k-Fold Cross-Validation in Scikit-Learn:
\`\`\`python
# scikit-learn==1.4.2
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import make_classification
import numpy as np

X, y = make_classification(n_samples=500, weights=[0.9, 0.1], random_state=42)

skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
clf = LogisticRegression()

scores = cross_val_score(clf, X, y, cv=skf, scoring="f1")
print(f"5-Fold F1 Scores: {scores.round(3)}")
print(f"Mean F1: {scores.mean():.3f} (+/- {scores.std():.3f})")
\`\`\``,
  `Applying standard shuffled k-fold cross-validation to time-series stock price data, allowing the model to train on tomorrow's closing prices to predict yesterday's movements (lookahead leakage).`,
  `Why is Stratified k-Fold preferred over standard k-Fold on imbalanced classification datasets? (It guarantees that every fold preserves the exact class frequency proportions of the overall dataset).`
);

writeNoteBlock('ai-ml', 'evaluation-overfitting-and-tuning', 'aiml-07-lo03',
  'The Confusion Matrix: Deconstructing Type I and Type II Errors',
  `A single summary scalar like accuracy conceals the specific nature of model failures. The **Confusion Matrix** is a $2 \\times 2$ contingency table that breaks down classification predictions against actual ground-truth outcomes across all four possibilities:

| | Predicted Negative (0) | Predicted Positive (1) |
|---|---|---|
| **Actual Negative (0)** | **True Negative (TN)** | **False Positive (FP)** (Type I Error) |
| **Actual Positive (1)** | **False Negative (FN)** (Type II Error) | **True Positive (TP)** |

Definitions:
- **True Positive (TP)**: Correctly predicted positive condition (e.g., fraudulent transaction correctly blocked).
- **True Negative (TN)**: Correctly predicted negative condition (e.g., legitimate user granted access).
- **False Positive (FP)** (*Type I Error / False Alarm*): Negative sample incorrectly predicted positive (e.g., innocent email tagged as spam).
- **False Negative (FN)** (*Type II Error / Missed Detection*): Positive sample incorrectly predicted negative (e.g., malignant tumor diagnosed as benign).

Understanding this trade-off is critical: in disease diagnosis, False Negatives can be fatal, whereas False Positives require only an extra follow-up test.`,
  `Extracting confusion matrix metrics in Scikit-Learn:
\`\`\`python
# scikit-learn==1.4.2
from sklearn.metrics import confusion_matrix
import numpy as np

y_true = np.array([0, 0, 0, 0, 1, 1, 1, 1])
y_pred = np.array([0, 0, 1, 0, 1, 1, 0, 1])

# Extract TN, FP, FN, TP
cm = confusion_matrix(y_true, y_pred)
tn, fp, fn, tp = cm.ravel()

print(f"Confusion Matrix:\\n{cm}")
print(f"TN: {tn}, FP: {fp}, FN: {fn}, TP: {tp}")
# Output: TN: 3, FP: 1, FN: 1, TP: 3
\`\`\``,
  `Treating Type I (FP) and Type II (FN) errors as having equal financial or operational costs in production system designs.`,
  `In a medical screening test for a deadly contagious virus, which error category is most dangerous: False Positives or False Negatives? (False Negatives: infected patients are sent home undetected, risking death and public transmission).`
);

writeNoteBlock('ai-ml', 'evaluation-overfitting-and-tuning', 'aiml-07-lo04',
  'Precision, Recall, and the F1-Score: Navigating Asymmetric Error Costs',
  `When class frequencies are imbalanced or error costs are asymmetric, machine learning practitioners rely on Precision, Recall, and the harmonic F1-score:

1. **Precision (Positive Predictive Value)**: Of all samples the model predicted as positive, what proportion was actually positive?
$$\\text{Precision} = \\frac{\\text{TP}}{\\text{TP} + \\text{FP}}$$
High precision minimizes False Alarms (essential for spam filters or automated account suspension).
2. **Recall (Sensitivity / True Positive Rate)**: Of all actual positive cases in reality, what proportion did the model successfully find?
$$\\text{Recall} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}$$
High recall minimizes Missed Detections (essential for medical screening and fraud detection).
3. **F1-Score**: The harmonic mean of Precision and Recall:
$$F_1 = 2 \\times \\frac{\\text{Precision} \\times \\text{Recall}}{\\text{Precision} + \\text{Recall}} = \\frac{2\\text{TP}}{2\\text{TP} + \\text{FP} + \\text{FN}}$$
The harmonic mean severely penalizes extreme trade-offs: if precision is 100% but recall is 0%, the arithmetic mean is 50%, but the F1-score is 0%.`,
  `Computing Precision, Recall, and F1 in Scikit-Learn:
\`\`\`python
# scikit-learn==1.4.2
from sklearn.metrics import precision_score, recall_score, f1_score
import numpy as np

y_true = np.array([1, 1, 1, 1, 0, 0, 0, 0, 0, 0])
y_pred = np.array([1, 1, 1, 0, 1, 0, 0, 0, 0, 0])

prec = precision_score(y_true, y_pred) # TP / (TP + FP) = 3 / (3 + 1) = 0.75
rec  = recall_score(y_true, y_pred)    # TP / (TP + FN) = 3 / (3 + 1) = 0.75
f1   = f1_score(y_true, y_pred)        # 2 * (0.75 * 0.75) / (1.5) = 0.75

print(f"Precision: {prec:.2f}, Recall: {rec:.2f}, F1: {f1:.2f}")
\`\`\``,
  `Using standard arithmetic mean $\\frac{P + R}{2}$ to evaluate classifiers, hiding models that predict positive on only a single trivial sample (Precision=100%, Recall=0.1%).`,
  `If a fraud detection system achieves a Precision of 1.0 (100%) but a Recall of 0.05 (5%), what is its F1-score? (Approximately 0.095: the harmonic mean collapses when either metric approaches zero).`
);

writeNoteBlock('ai-ml', 'evaluation-overfitting-and-tuning', 'aiml-07-lo05',
  'Receiver Operating Characteristic (ROC) and Area Under the Curve (AUC)',
  `Binary classifiers output continuous probabilities $\\hat{p} \\in [0, 1]$. Class labels are assigned by applying a classification threshold $\\tau$ (traditionally $\\tau = 0.5$). However, varying $\\tau$ from $0.0$ to $1.0$ trades off False Positives against False Negatives.

The **Receiver Operating Characteristic (ROC)** curve evaluates classifier discrimination across *all possible thresholds*:
- **y-axis**: True Positive Rate (Recall / Sensitivity): $\\text{TPR} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}$.
- **x-axis**: False Positive Rate (Fall-out / $1 - \\text{Specificity}$): $\\text{FPR} = \\frac{\\text{FP}}{\\text{FP} + \\text{TN}}$.

The **Area Under the ROC Curve (ROC-AUC)** measures overall ranking performance:
- $\\text{AUC} = 1.0$: Perfect discrimination; every positive sample is ranked higher than every negative sample.
- $\\text{AUC} = 0.5$: Baseline performance equivalent to random coin flips (the diagonal line).
- $\\text{AUC} < 0.5$: Worse than random (predictions are inverted).

ROC-AUC is threshold-invariant and scale-invariant, measuring rank ordering rather than absolute calibration.`,
  `Plotting and calculating ROC-AUC in Scikit-Learn:
\`\`\`python
# scikit-learn==1.4.2
from sklearn.metrics import roc_auc_score, roc_curve
import numpy as np

y_true = np.array([0, 0, 1, 1])
y_scores = np.array([0.1, 0.4, 0.35, 0.8])

# Compute Area Under the Curve
auc = roc_auc_score(y_true, y_scores)
fpr, tpr, thresholds = roc_curve(y_true, y_scores)

print(f"ROC-AUC Score: {auc:.4f}") # 0.75 -> 75% probability of ranking positive higher than negative
print(f"Thresholds evaluated: {thresholds}")
\`\`\``,
  `Relying on ROC-AUC on severely imbalanced datasets (e.g., 99.9% negative). Because total negative samples (TN) is massive, FPR remains tiny even with thousands of False Positives, making ROC curves look deceptively stellar. Use Precision-Recall AUC instead.`,
  `What ROC-AUC score corresponds to a completely uninformative baseline model that makes random predictions? (0.50).`
);

writeNoteBlock('ai-ml', 'evaluation-overfitting-and-tuning', 'aiml-07-lo06',
  'Hyperparameter Optimization: Grid Search, Random Search, and Bayesian Tuning',
  `Model parameters (such as weights $\\mathbf{w}$) are learned automatically via gradient descent during training. In contrast, **hyperparameters** (such as learning rate $\\eta$, tree \`max_depth\`, or regularization $\\lambda$) govern the algorithm architecture and must be configured prior to training.

Optimization strategies:
1. **Grid Search (\`GridSearchCV\`)**: Exhaustively trains and evaluates models on every combination of hyperparameter values specified in a discrete grid. Guaranteed to find the best point in the defined grid, but suffers from the curse of dimensionality—testing 4 parameters with 5 values each requires $5^4 = 625$ cross-validation runs.
2. **Randomized Search (\`RandomizedSearchCV\`)**: Randomly samples $N$ combinations from continuous or discrete parameter distributions. Bergstra and Bengio (2012) proved that Random Search finds superior models in a fraction of the time because it allocates all budget to exploring unique values along the few truly impactful hyperparameters.
3. **Bayesian Optimization (e.g., Optuna)**: Fits a probabilistic surrogate model (such as a Gaussian Process or Tree-structured Parzen Estimator) to historical trial results, using acquisition functions to intelligently explore promising search regions.`,
  `Executing Randomized Search with cross-validation in Scikit-Learn:
\`\`\`python
# scikit-learn==1.4.2
from sklearn.model_selection import RandomizedSearchCV
from sklearn.ensemble import RandomForestClassifier
from scipy.stats import randint
import numpy as np

X = np.random.randn(200, 6); y = np.random.randint(0, 2, 200)

param_distributions = {
    "n_estimators": randint(50, 200),
    "max_depth": randint(3, 10),
    "min_samples_split": randint(2, 10)
}

search = RandomizedSearchCV(
    RandomForestClassifier(random_state=42),
    param_distributions=param_distributions,
    n_iter=15, cv=3, random_state=42
)
search.fit(X, y)
print(f"Best CV Score: {search.best_score_:.4f}")
print(f"Best Hyperparameters: {search.best_params_}")
\`\`\``,
  `Evaluating hyperparameter search tuning results on the test dataset. Hyperparameter tuning must be guided strictly by cross-validation on the training set; the test set is reserved exclusively for the final audit.`,
  `Why does Randomized Search consistently outperform exhaustive Grid Search on fixed compute budgets? (Because it explores a far greater number of distinct values for the few hyperparameters that actually govern performance).`
);

writeNoteBlock('ai-ml', 'evaluation-overfitting-and-tuning', 'aiml-07-lo07',
  'Diagnostic Learning Curves: Identifying High Bias vs High Variance',
  `A **Learning Curve** plots training error and validation error as a function of the number of training samples ($N$). By observing how these two curves behave as sample size expands, engineers can diagnose whether a model suffers from high bias (underfitting) or high variance (overfitting).

Diagnostic patterns:
1. **High Bias (Underfitting)**:
   - Both training error and validation error plateau at high, unacceptable levels.
   - The validation error quickly converges close to the training error (very small generalization gap).
   - *Remedy*: Collecting more training data will **not** help; the curves are already flat. You must increase model capacity (add features, use non-linear models, decrease regularization).
2. **High Variance (Overfitting)**:
   - Training error remains low, but validation error remains significantly higher (large persistent generalization gap).
   - As sample size $N$ increases, validation error continues to trend downward.
   - *Remedy*: Collecting more training data is effective. Alternatively, reduce model capacity (increase regularization, reduce depth, select fewer features).`,
  `Generating diagnostic learning curve data in Scikit-Learn:
\`\`\`python
# scikit-learn==1.4.2
from sklearn.model_selection import learning_curve
from sklearn.linear_model import Ridge
import numpy as np

X = np.random.randn(300, 5)
y = 2.0 * X[:, 0] + np.random.randn(300) * 0.5

train_sizes, train_scores, val_scores = learning_curve(
    Ridge(), X, y, cv=5, train_sizes=np.linspace(0.2, 1.0, 5),
    scoring="neg_mean_squared_error"
)

# Convert negative MSE to positive MSE
mean_train_mse = -np.mean(train_scores, axis=1)
mean_val_mse = -np.mean(val_scores, axis=1)

for size, t_err, v_err in zip(train_sizes, mean_train_mse, mean_val_mse):
    print(f"Samples: {size:3d} | Train MSE: {t_err:.3f} | Val MSE: {v_err:.3f} | Gap: {v_err - t_err:.3f}")
\`\`\``,
  `Investing significant budget to collect more data when learning curves show both training and validation error have already plateaued at high values (high bias).`,
  `If a learning curve shows training error is 0.02 and validation error is 0.45 with a large persistent gap, what failure mode is occurring? (High variance / overfitting).`
);

writeNoteBlock('ai-ml', 'evaluation-overfitting-and-tuning', 'aiml-07-lo08',
  'Evaluation Integrity: Establishing Baselines and Eliminating Subtle Leakage',
  `A model evaluation is only as trustworthy as the experimental protocol that generated it. Flawed evaluation protocols generate optimistic illusions of accuracy that unravel in production environments.

Two foundational evaluation safeguards:
1. **Heuristic Baselines**: Every trained model must be benchmarked against simple deterministic baselines:
   - For classification: the majority-class guesser (\`DummyClassifier(strategy="most_frequent")\`).
   - For regression: the mean or median target predictor (\`DummyRegressor(strategy="mean")\`).
   If a complex ensemble cannot beat the majority baseline, it holds zero practical value.
2. **Subtle Leakage Vectors in Evaluation**:
   - *Target Leakage*: Including proxy features created after the target event occurred (e.g., using \`refund_amount\` to predict customer cancellation).
   - *Group Contamination*: Splitting medical records randomly across train and test when multiple records belong to the same patient. The model memorizes patient anatomy rather than disease patterns. Use \`GroupKFold\`.
   - *Duplication Leakage*: Identical records duplicated across train and test partitions.`,
  `Preventing group contamination with GroupKFold:
\`\`\`python
# scikit-learn==1.4.2
from sklearn.model_selection import GroupKFold
from sklearn.linear_model import LogisticRegression
import numpy as np

X = np.random.randn(100, 4)
y = np.random.randint(0, 2, 100)
# Patient IDs: 10 patients with 10 scans each
patient_ids = np.repeat(np.arange(10), 10)

# GroupKFold ensures all scans for any single patient are kept in the SAME fold
gkf = GroupKFold(n_splits=5)
for fold, (train_idx, val_idx) in enumerate(gkf.split(X, y, groups=patient_ids)):
    train_patients = set(patient_ids[train_idx])
    val_patients = set(patient_ids[val_idx])
    # Intersection must be empty
    assert len(train_patients.intersection(val_patients)) == 0
print("GroupKFold integrity confirmed: Zero patient contamination across splits!")
\`\`\``,
  `Using standard random splits on multi-record patient or user data, allowing the model to achieve artificial 99% accuracy by memorizing specific individuals.`,
  `Which cross-validation splitter ensures that all observations belonging to the same subject or group remain strictly isolated within either training or validation, never split across both? (\`GroupKFold\`).`
);

writeNoteBlock('ai-ml', 'evaluation-overfitting-and-tuning', 'aiml-07-lo09',
  'Probability Calibration: Platt Scaling and Isotonic Regression',
  `Many machine learning classifiers (such as SVMs, Naive Bayes, or boosted trees) produce ranking scores that do not reflect true statistical probabilities. A model might predict probability 0.95 for 1,000 observations, but in reality only 70% of those samples turn out positive. Such models are **uncalibrated**.

In safety-critical applications (such as loan approvals or clinical surgery recommendations), probabilities must be calibrated: if the model predicts probability $p$, exactly $p \\times 100\\%$ of those predictions must be positive.

Calibration techniques:
1. **Platt Scaling (Sigmoidal Calibration)**: Fits a single-variable logistic regression on the uncalibrated model decision scores $f(\\mathbf{x})$:
$$P(y=1 | \\mathbf{x}) = \\frac{1}{1 + \\exp(A \\cdot f(\\mathbf{x}) + B)}$$
Effective for small validation sets, assuming sigmoid distortion.
2. **Isotonic Regression**: Fits a non-parametric, piece-wise constant non-decreasing monotonic step function. More expressive than Platt scaling, but requires larger validation datasets ($N > 1,000$) to prevent overfitting.

Calibration is evaluated visually using **Reliability Diagrams** and numerically via the **Brier Score** ($L_B = \\frac{1}{N} \\sum (p_i - y_i)^2$).`,
  `Calibrating a classifier using Scikit-Learn:
\`\`\`python
# scikit-learn==1.4.2
from sklearn.calibration import CalibratedClassifierCV, calibration_curve
from sklearn.svm import LinearSVC
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=500, n_features=5, random_state=42)

# LinearSVC outputs raw uncalibrated decision function margins
base_svc = LinearSVC(random_state=42)

# Calibrate probabilities using Platt Scaling (sigmoid) via cross-validation
calibrated_svc = CalibratedClassifierCV(estimator=base_svc, method="sigmoid", cv=3)
calibrated_svc.fit(X, y)

# Predict true calibrated probabilities
calibrated_probs = calibrated_svc.predict_proba(X[:3])
print(f"Calibrated probabilities:\\n{calibrated_probs.round(3)}")
\`\`\``,
  `Fitting probability calibration on the original training set. Calibration transformers must be fit on independent validation folds; otherwise, models will appear artificially confident and miscalibrated.`,
  `What diagnostic plot plots predicted probability intervals against true empirical observed fractions to evaluate calibration quality? (A Reliability Diagram / Calibration Curve).`
);

// Question Bank for ai-07 (36 questions: 4 per core LO + 2 for ext + 2 numeric)
const ai07Bank = [
  // LO01
  {
    id: "aiml-07-q01",
    loId: "aiml-07-lo01",
    type: "single",
    difficulty: 1,
    stem: "What three components comprise the mathematical decomposition of expected generalization error?",
    options: [
      { id: "a", text: "Bias squared, Variance, and Irreducible error ($\\text{Bias}^2 + \\text{Var} + \\sigma_\\epsilon^2$)." },
      { id: "b", text: "Precision, Recall, and Accuracy." },
      { id: "c", text: "Training loss, Test loss, and Validation loss." },
      { id: "d", text: "Entropy, Gini impurity, and Information Gain." }
    ],
    answer: ["a"],
    explanation: "Expected prediction error on unseen data breaks down into model bias, variance across training sets, and irreducible noise.",
    noteRef: "aiml-07-lo01",
    reviewed: false
  },
  {
    id: "aiml-07-q02",
    loId: "aiml-07-lo01",
    type: "single",
    difficulty: 2,
    stem: "A model exhibits high training error and equally high validation error. What problem is occurring, and how should it be resolved?",
    options: [
      { id: "a", text: "High Bias (Underfitting); resolve by increasing model capacity, adding features, or decreasing regularization." },
      { id: "b", text: "High Variance (Overfitting); resolve by collecting more data." },
      { id: "c", text: "Data leakage; resolve by retraining on test data." },
      { id: "d", text: "Numerical overflow; resolve by reducing float precision." }
    ],
    answer: ["a"],
    explanation: "When both train and validation errors are high, the model lacks capacity to capture the underlying pattern (high bias).",
    noteRef: "aiml-07-lo01",
    reviewed: false
  },
  {
    id: "aiml-07-q03",
    loId: "aiml-07-lo01",
    type: "scenario",
    difficulty: 2,
    stem: "A deep polynomial regression model achieves 0.01 MSE on training data, but 48.5 MSE on validation data. What does this massive gap indicate?",
    options: [
      { id: "a", text: "High Variance (Overfitting): the model memorized training sample noise and fails to generalize." },
      { id: "b", text: "High Bias: the model is too simple." },
      { id: "c", text: "Optimal trade-off: training error is near zero." },
      { id: "d", text: "Irreducible error is zero." }
    ],
    answer: ["a"],
    explanation: "A large generalization gap between low training error and high validation error is the hallmark of high variance / overfitting.",
    noteRef: "aiml-07-lo01",
    reviewed: false
  },
  {
    loId: "aiml-07-lo01",
    type: "multi",
    difficulty: 3,
    id: "aiml-07-q04",
    stem: "Which of the following interventions are effective remedies for High Variance (Overfitting)?",
    options: [
      { id: "a", text: "Adding L1 or L2 regularization penalties" },
      { id: "b", text: "Collecting more training observations" },
      { id: "c", text: "Reducing feature dimensionality through pruning or PCA" },
      { id: "d", text: "Increasing polynomial degree from 2 to 10" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Regularization, more data, and feature pruning constrain variance. Increasing polynomial degree worsens overfitting.",
    noteRef: "aiml-07-lo01",
    reviewed: false
  },

  // LO02
  {
    id: "aiml-07-q05",
    loId: "aiml-07-lo02",
    type: "single",
    difficulty: 1,
    stem: "How does k-Fold Cross-Validation estimate model generalization performance?",
    options: [
      { id: "a", text: "It partitions data into $k$ folds, iteratively training on $k-1$ folds and validating on the remaining fold across $k$ rounds." },
      { id: "b", text: "It trains $k$ different models on the full dataset and selects the largest." },
      { id: "c", text: "It generates $k$ synthetic datasets using SMOTE." },
      { id: "d", text: "It divides the learning rate by $k$." }
    ],
    answer: ["a"],
    explanation: "k-Fold partitions data into k slices, using each fold as a validation holdout once, and averages the results.",
    noteRef: "aiml-07-lo02",
    reviewed: false
  },
  {
    id: "aiml-07-q06",
    loId: "aiml-07-lo02",
    type: "single",
    difficulty: 2,
    stem: "Why must standard shuffled k-fold cross-validation NOT be used for time-series financial forecasting?",
    options: [
      { id: "a", text: "Shuffling future time steps into training sets creates future lookahead leakage, yielding unrealistic performance estimates." },
      { id: "b", text: "Financial data cannot be partitioned into folds." },
      { id: "c", text: "Stock prices are always non-convex." },
      { id: "d", text: "Standard k-fold requires GPU hardware." }
    ],
    answer: ["a"],
    explanation: "Time-series data has temporal autocorrelation; shuffling allows the model to train on future events to predict the past.",
    noteRef: "aiml-07-lo02",
    reviewed: false
  },
  {
    id: "aiml-07-q07",
    loId: "aiml-07-lo02",
    type: "scenario",
    difficulty: 2,
    stem: "You are training a fraud detection model where only 1% of samples are fraudulent. Which cross-validation splitter must be used?",
    options: [
      { id: "a", text: "StratifiedKFold, ensuring every fold preserves the 1% minority fraud proportion." },
      { id: "b", text: "Standard KFold, because random chance is sufficient." },
      { id: "c", text: "Leave-One-Out CV, because it is fastest." },
      { id: "d", text: "No split; train on 100% of data." }
    ],
    answer: ["a"],
    explanation: "StratifiedKFold preserves class distribution across folds, preventing folds with zero fraud samples.",
    noteRef: "aiml-07-lo02",
    reviewed: false
  },
  {
    id: "aiml-07-q08",
    loId: "aiml-07-lo02",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following are valid cross-validation splitting strategies supported in Scikit-Learn?",
    options: [
      { id: "a", text: "`KFold` (standard unstratified k-fold)" },
      { id: "b", text: "`StratifiedKFold` (class-balanced k-fold)" },
      { id: "c", text: "`TimeSeriesSplit` (forward-chaining temporal split)" },
      { id: "d", text: "`QuantumEntangledSplit`" }
    ],
    answer: ["a", "b", "c"],
    explanation: "KFold, StratifiedKFold, and TimeSeriesSplit are standard resampling protocols in Scikit-Learn.",
    noteRef: "aiml-07-lo02",
    reviewed: false
  },

  // LO03
  {
    id: "aiml-07-q09",
    loId: "aiml-07-lo03",
    type: "single",
    difficulty: 1,
    stem: "In a binary Confusion Matrix, what does a 'False Positive' (Type I Error) represent?",
    options: [
      { id: "a", text: "A negative ground-truth instance that the model incorrectly predicted as positive (false alarm)." },
      { id: "b", text: "A positive ground-truth instance that the model correctly identified." },
      { id: "c", text: "A positive ground-truth instance that the model missed." },
      { id: "d", text: "A corrupted data file." }
    ],
    answer: ["a"],
    explanation: "False Positives occur when the actual condition is negative, but the model incorrectly triggers a positive prediction.",
    noteRef: "aiml-07-lo03",
    reviewed: false
  },
  {
    id: "aiml-07-q10",
    loId: "aiml-07-lo03",
    type: "single",
    difficulty: 2,
    stem: "In airport security screening, what constitutes a 'False Negative' (Type II Error)?",
    options: [
      { id: "a", text: "A passenger carrying a prohibited weapon is falsely cleared as safe and permitted through." },
      { id: "b", text: "An innocent passenger's bag is flagged for additional manual inspection." },
      { id: "c", text: "A passenger boards on time." },
      { id: "d", text: "A flight is delayed due to weather." }
    ],
    answer: ["a"],
    explanation: "A False Negative is a missed detection: the threat exists (positive ground truth), but the scanner fails to detect it.",
    noteRef: "aiml-07-lo03",
    reviewed: false
  },
  {
    id: "aiml-07-q11",
    loId: "aiml-07-lo03",
    type: "scenario",
    difficulty: 2,
    stem: "A cancer screening test on 1,000 patients yields: TP = 45, FP = 15, FN = 5, TN = 935. How many total actual cancer patients existed in this cohort?",
    options: [
      { id: "a", text: "50, calculated as TP + FN = 45 + 5 = 50." },
      { id: "b", text: "60, calculated as TP + FP." },
      { id: "c", text: "45, representing true positives." },
      { id: "d", text: "950, representing non-cancer patients." }
    ],
    answer: ["a"],
    explanation: "Total actual positives = TP + FN = 45 + 5 = 50.",
    noteRef: "aiml-07-lo03",
    verify: "(45 + 5 === 50)",
    reviewed: false
  },
  {
    id: "aiml-07-q12",
    loId: "aiml-07-lo03",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following metrics can be directly computed from a standard $2 \\times 2$ binary Confusion Matrix?",
    options: [
      { id: "a", text: "Accuracy: $(TP + TN) / (TP + TN + FP + FN)$" },
      { id: "b", text: "Precision: $TP / (TP + FP)$" },
      { id: "c", text: "Recall (Sensitivity): $TP / (TP + FN)$" },
      { id: "d", text: "Hardware GPU FLOPS throughput" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Accuracy, Precision, Recall, Specificity, and F1 are all calculated directly from confusion matrix counts.",
    noteRef: "aiml-07-lo03",
    reviewed: false
  },

  // LO04
  {
    id: "aiml-07-q13",
    loId: "aiml-07-lo04",
    type: "single",
    difficulty: 1,
    stem: "What is the formula for Precision in binary classification?",
    options: [
      { id: "a", text: "$\\text{Precision} = \\frac{\\text{TP}}{\\text{TP} + \\text{FP}}$" },
      { id: "b", text: "$\\text{Precision} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}$" },
      { id: "c", text: "$\\text{Precision} = \\frac{\\text{TN}}{\\text{TN} + \\text{FP}}$" },
      { id: "d", text: "$\\text{Precision} = \\frac{\\text{TP} + \\text{TN}}{\\text{Total}}$" }
    ],
    answer: ["a"],
    explanation: "Precision measures how many of the model's positive predictions were genuinely positive.",
    noteRef: "aiml-07-lo04",
    reviewed: false
  },
  {
    id: "aiml-07-q14",
    loId: "aiml-07-lo04",
    type: "single",
    difficulty: 2,
    stem: "Why is the F1-score computed as the harmonic mean of Precision and Recall rather than their simple arithmetic mean?",
    options: [
      { id: "a", text: "The harmonic mean severely penalizes extreme imbalances, preventing models with near-zero recall from registering high scores." },
      { id: "b", text: "The harmonic mean executes in constant hardware time." },
      { id: "c", text: "The arithmetic mean cannot average decimals." },
      { id: "d", text: "The harmonic mean ignores False Positives." }
    ],
    answer: ["a"],
    explanation: "If precision is 1.0 but recall is 0.0, the arithmetic mean is 0.50, but the harmonic F1 is 0.0, reflecting model uselessness.",
    noteRef: "aiml-07-lo04",
    reviewed: false
  },
  {
    id: "aiml-07-q15",
    loId: "aiml-07-lo04",
    type: "scenario",
    difficulty: 2,
    stem: "A spam detector correctly flags 80 spam emails (TP), but lets 20 spam emails slip through into inbox (FN) and falsely marks 20 legitimate emails as spam (FP). What is its Precision?",
    options: [
      { id: "a", text: "0.80 (80%), calculated as TP / (TP + FP) = 80 / (80 + 20) = 80 / 100 = 0.80." },
      { id: "b", text: "0.50 (50%)." },
      { id: "c", text: "0.20 (20%)." },
      { id: "d", text: "0.90 (90%)." }
    ],
    answer: ["a"],
    explanation: "Precision = TP / (TP + FP) = 80 / (80 + 20) = 0.80.",
    noteRef: "aiml-07-lo04",
    verify: "(80.0 / (80.0 + 20.0) === 0.8)",
    reviewed: false
  },
  {
    loId: "aiml-07-lo04",
    type: "numeric",
    difficulty: 2,
    id: "aiml-07-q16",
    stem: "A classifier achieves Precision = 0.60 and Recall = 0.60. What is its F1-score?",
    options: [
      { id: "a", text: "0.60" },
      { id: "b", text: "0.36" },
      { id: "c", text: "1.20" },
      { id: "d", text: "0.50" }
    ],
    answer: ["a"],
    explanation: "When precision equals recall, F1 equals that same value: 2 * (0.6 * 0.6) / (0.6 + 0.6) = 0.72 / 1.2 = 0.60.",
    noteRef: "aiml-07-lo04",
    verify: "((2.0 * 0.6 * 0.6) / (0.6 + 0.6) === 0.6)",
    reviewed: false
  },

  // LO05
  {
    id: "aiml-07-q17",
    loId: "aiml-07-lo05",
    type: "single",
    difficulty: 1,
    stem: "What two metrics are plotted against each other to create the Receiver Operating Characteristic (ROC) curve?",
    options: [
      { id: "a", text: "True Positive Rate (Recall) on the y-axis vs False Positive Rate (1 - Specificity) on the x-axis." },
      { id: "b", text: "Precision on the y-axis vs Recall on the x-axis." },
      { id: "c", text: "Training loss on the y-axis vs Epochs on the x-axis." },
      { id: "d", text: "Variance on the y-axis vs Bias on the x-axis." }
    ],
    answer: ["a"],
    explanation: "The ROC curve plots TPR vs FPR across all classification probability thresholds.",
    noteRef: "aiml-07-lo05",
    reviewed: false
  },
  {
    id: "aiml-07-q18",
    loId: "aiml-07-lo05",
    type: "single",
    difficulty: 2,
    stem: "What does an Area Under the ROC Curve (ROC-AUC) of 1.0 represent?",
    options: [
      { id: "a", text: "Perfect classification ranking: every positive sample is assigned a higher predicted probability than every negative sample." },
      { id: "b", text: "Zero training loss on linear regression." },
      { id: "c", text: "A model that makes random coin flips." },
      { id: "d", text: "Severe overfitting." }
    ],
    answer: ["a"],
    explanation: "AUC = 1.0 indicates perfect class separability across all possible decision thresholds.",
    noteRef: "aiml-07-lo05",
    reviewed: false
  },
  {
    id: "aiml-07-q19",
    loId: "aiml-07-lo05",
    type: "scenario",
    difficulty: 2,
    stem: "A fraud detection system has an ROC-AUC of 0.50. What does this indicate about the model?",
    options: [
      { id: "a", text: "The model has zero discriminatory capability, performing exactly like a random coin flip." },
      { id: "b", text: "The model is 50% accurate." },
      { id: "c", text: "The model has converged to the global optimum." },
      { id: "d", text: "The threshold should be set to 0.5." }
    ],
    answer: ["a"],
    explanation: "An ROC-AUC of 0.50 corresponds to the diagonal random chance line.",
    noteRef: "aiml-07-lo05",
    reviewed: false
  },
  {
    id: "aiml-07-q20",
    loId: "aiml-07-lo05",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following are key properties of the ROC-AUC evaluation metric?",
    options: [
      { id: "a", text: "It is threshold-invariant, evaluating ranking across all classification cutoffs" },
      { id: "b", text: "It is scale-invariant, measuring rank order rather than absolute probability calibration" },
      { id: "c", text: "It can give deceptively optimistic impressions on severely imbalanced datasets" },
      { id: "d", text: "It only works for multi-class classification" }
    ],
    answer: ["a", "b", "c"],
    explanation: "ROC-AUC is threshold- and scale-invariant, but can look deceptively good on massive negative classes. PR-AUC is preferred there.",
    noteRef: "aiml-07-lo05",
    reviewed: false
  },

  // LO06
  {
    id: "aiml-07-q21",
    loId: "aiml-07-lo06",
    type: "single",
    difficulty: 1,
    stem: "What is the fundamental difference between model parameters and hyperparameters?",
    options: [
      { id: "a", text: "Parameters (weights) are learned from data during training; hyperparameters (learning rate, tree depth) are configured before training." },
      { id: "b", text: "Hyperparameters are learned via backpropagation; parameters are fixed." },
      { id: "c", text: "Parameters are only used in deep learning." },
      { id: "d", text: "Hyperparameters are integer numbers only." }
    ],
    answer: ["a"],
    explanation: "Parameters are optimized by the training algorithm; hyperparameters govern the learning algorithm itself.",
    noteRef: "aiml-07-lo06",
    reviewed: false
  },
  {
    id: "aiml-07-q22",
    loId: "aiml-07-lo06",
    type: "single",
    difficulty: 2,
    stem: "Why does Randomized Search often find better models than exhaustive Grid Search on fixed compute budgets?",
    options: [
      { id: "a", text: "It tests many more distinct values for each individual hyperparameter rather than wasting trials on redundant combinations of uninformative parameters." },
      { id: "b", text: "It bypasses the need for validation data." },
      { id: "c", text: "It automatically scales up CPU clock speed." },
      { id: "d", text: "It optimizes the learning rate analytically." }
    ],
    answer: ["a"],
    explanation: "In most models, only a few hyperparameters matter; Random Search explores distinct points along these vital dimensions without repeating.",
    noteRef: "aiml-07-lo06",
    reviewed: false
  },
  {
    id: "aiml-07-q23",
    loId: "aiml-07-lo06",
    type: "scenario",
    difficulty: 2,
    stem: "You want to evaluate 5 hyperparameters, each with 4 potential values, using 5-fold cross-validation. How many model training fits does exhaustive Grid Search require?",
    options: [
      { id: "a", text: "5,120 fits, calculated as (4^5 combinations) * 5 folds = 1024 * 5 = 5120 fits." },
      { id: "b", text: "100 fits." },
      { id: "c", text: "25 fits." },
      { id: "d", text: "500 fits." }
    ],
    answer: ["a"],
    explanation: "Total parameter combinations = 4^5 = 1024. With 5-fold CV, total fits = 1024 * 5 = 5120.",
    noteRef: "aiml-07-lo06",
    verify: "(Math.pow(4, 5) * 5 === 5120)",
    reviewed: false
  },
  {
    id: "aiml-07-q24",
    loId: "aiml-07-lo06",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following hyperparameter search techniques are standard in modern machine learning?",
    options: [
      { id: "a", text: "GridSearchCV (exhaustive grid evaluation)" },
      { id: "b", text: "RandomizedSearchCV (probabilistic sampling)" },
      { id: "c", text: "Bayesian Optimization (surrogate Gaussian process / TPE)" },
      { id: "d", text: "Linear Regression parameter inversion" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Grid search, random search, and Bayesian optimization (e.g., Optuna) are the three pillars of hyperparameter tuning.",
    noteRef: "aiml-07-lo06",
    reviewed: false
  },

  // LO07
  {
    id: "aiml-07-q25",
    loId: "aiml-07-lo07",
    type: "single",
    difficulty: 1,
    stem: "What do Learning Curves plot to diagnose machine learning models?",
    options: [
      { id: "a", text: "Training error and validation error as a function of training dataset sample size." },
      { id: "b", text: "Inference latency against CPU temperature." },
      { id: "c", text: "False Positive Rate against True Positive Rate." },
      { id: "d", text: "Feature variance against feature mean." }
    ],
    answer: ["a"],
    explanation: "Learning curves visualize how performance scales as more training samples are provided.",
    noteRef: "aiml-07-lo07",
    reviewed: false
  },
  {
    id: "aiml-07-q26",
    loId: "aiml-07-lo07",
    type: "single",
    difficulty: 2,
    stem: "If a Learning Curve shows training error and validation error have converged together at high unacceptable error, what is the diagnosis?",
    options: [
      { id: "a", text: "High Bias (Underfitting): the model is too simple, and collecting more data will not improve it." },
      { id: "b", text: "High Variance (Overfitting): the model requires more training data." },
      { id: "c", text: "Perfect convergence: training should stop." },
      { id: "d", text: "Data leakage across cross-validation splits." }
    ],
    answer: ["a"],
    explanation: "When curves flatten together at high error, the model lacks capacity to learn the phenomenon (high bias).",
    noteRef: "aiml-07-lo07",
    reviewed: false
  },
  {
    id: "aiml-07-q27",
    loId: "aiml-07-lo07",
    type: "scenario",
    difficulty: 2,
    stem: "A learning curve shows training error is 0.05 while validation error is 0.40 at 1,000 samples, but validation error steadily drops as samples increase to 10,000. What does this suggest?",
    options: [
      { id: "a", text: "The model has high variance, and gathering additional training data will continue to improve generalization." },
      { id: "b", text: "The model is underfitting and cannot learn." },
      { id: "c", text: "The model should be replaced with a linear model." },
      { id: "d", text: "The validation set is corrupted." }
    ],
    answer: ["a"],
    explanation: "A downward-trending validation curve with a persistent gap indicates high variance that benefits from additional training volume.",
    noteRef: "aiml-07-lo07",
    reviewed: false
  },
  {
    id: "aiml-07-q28",
    loId: "aiml-07-lo07",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following actions are recommended when learning curves diagnose High Bias (Underfitting)?",
    options: [
      { id: "a", text: "Add new features or polynomial feature interactions" },
      { id: "b", text: "Select a more expressive model architecture (e.g., deeper trees, neural networks)" },
      { id: "c", text: "Decrease regularization strength (reduce $\\lambda$ / penalty parameter)" },
      { id: "d", text: "Spend significant budget collecting 10x more training data" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Underfitting requires expanding model capacity. Gathering more data on a high-bias model does not help.",
    noteRef: "aiml-07-lo07",
    reviewed: false
  },

  // LO08
  {
    id: "aiml-07-q29",
    loId: "aiml-07-lo08",
    type: "single",
    difficulty: 1,
    stem: "Why must machine learning models always be benchmarked against simple heuristic baselines?",
    options: [
      { id: "a", text: "To verify that complex architectures provide genuine predictive lift beyond trivial majority-class guessing." },
      { id: "b", text: "To format outputs for database ingestion." },
      { id: "c", text: "To initialize weights before backpropagation." },
      { id: "d", text: "Because Scikit-Learn will raise an error without a baseline." }
    ],
    answer: ["a"],
    explanation: "Comparing against dummy baselines ensures models actually learn patterns rather than riding imbalanced class proportions.",
    noteRef: "aiml-07-lo08",
    reviewed: false
  },
  {
    id: "aiml-07-q30",
    loId: "aiml-07-lo08",
    type: "single",
    difficulty: 2,
    stem: "What is 'group contamination' leakage in cross-validation?",
    options: [
      { id: "a", text: "When multiple observations from the same subject or patient are split across both training and validation folds." },
      { id: "b", text: "When training labels are corrupted by malicious hackers." },
      { id: "c", text: "When columns have missing values." },
      { id: "d", text: "When the computer executes multiple processes simultaneously." }
    ],
    answer: ["a"],
    explanation: "Group contamination allows models to recognize specific subjects rather than learning generalizable disease/behavior patterns.",
    noteRef: "aiml-07-lo08",
    reviewed: false
  },
  {
    id: "aiml-07-q31",
    loId: "aiml-07-lo08",
    type: "scenario",
    difficulty: 2,
    stem: "A team predicts hospital readmission using a feature `days_in_icu_post_discharge`. What critical evaluation flaw exists?",
    options: [
      { id: "a", text: "Target leakage: the feature contains future information that occurs after the prediction event." },
      { id: "b", text: "High variance." },
      { id: "c", text: "Collinear feature scaling." },
      { id: "d", text: "Underfitting." }
    ],
    answer: ["a"],
    explanation: "Using post-discharge ICU days to predict readmission uses future data that would never exist at inference time.",
    noteRef: "aiml-07-lo08",
    reviewed: false
  },
  {
    id: "aiml-07-q32",
    loId: "aiml-07-lo08",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following practices ensure evaluation integrity in production machine learning?",
    options: [
      { id: "a", text: "Using `GroupKFold` when multiple records share a common entity ID (patient, household, device)" },
      { id: "b", text: "Evaluating models against a naive Dummy baseline" },
      { id: "c", text: "Isolating the final test set until all model decisions and tuning are complete" },
      { id: "d", text: "Imputing and scaling test data using test set parameters" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Group splits, baseline comparisons, and holding out test data maintain integrity. Option d leaks test distribution data.",
    noteRef: "aiml-07-lo08",
    reviewed: false
  },

  // LO09 (Extension)
  {
    id: "aiml-07-q33",
    loId: "aiml-07-lo09",
    type: "single",
    difficulty: 2,
    stem: "What does it mean for a probabilistic classifier to be 'well-calibrated'?",
    options: [
      { id: "a", text: "When predicted probabilities match empirical observation frequencies (e.g., of samples predicted at 80%, exactly 80% are positive)." },
      { id: "b", text: "When training accuracy equals 100%." },
      { id: "c", text: "When the decision threshold is exactly 0.50." },
      { id: "d", text: "When weights are initialized from a Gaussian distribution." }
    ],
    answer: ["a"],
    explanation: "Calibration ensures that predicted confidence percentages reflect true real-world empirical likelihoods.",
    noteRef: "aiml-07-lo09",
    reviewed: false
  },
  {
    id: "aiml-07-q34",
    loId: "aiml-07-lo09",
    type: "single",
    difficulty: 3,
    stem: "How does Platt Scaling calibrate uncalibrated model decision margins?",
    options: [
      { id: "a", text: "It fits a univariate logistic regression model on the raw decision margins using a validation set." },
      { id: "b", text: "It multiplies decision margins by the learning rate." },
      { id: "c", text: "It bins predictions into 10 equal discrete categories." },
      { id: "d", text: "It sets negative margins to zero." }
    ],
    answer: ["a"],
    explanation: "Platt scaling fits a logistic sigmoid 1 / (1 + exp(A*f + B)) to transform raw scores into calibrated probabilities.",
    noteRef: "aiml-07-lo09",
    reviewed: false
  },
  {
    id: "aiml-07-q35",
    loId: "aiml-07-lo04",
    type: "numeric",
    difficulty: 2,
    stem: "A model correctly identifies 60 fraud cases (TP) and falsely flags 20 legitimate transactions (FP). What is the model's Precision percentage?",
    options: [
      { id: "a", text: "75%" },
      { id: "b", text: "80%" },
      { id: "c", text: "60%" },
      { id: "d", text: "40%" }
    ],
    answer: ["a"],
    explanation: "Precision = 60 / (60 + 20) = 60 / 80 = 0.75 (75%).",
    noteRef: "aiml-07-lo04",
    verify: "(60.0 / (60.0 + 20.0) === 0.75)",
    reviewed: false
  }
];

balanceAndSave('ai-ml', 'evaluation-overfitting-and-tuning', ai07Objectives, ai07Bank);

console.log('✅ ai-07 complete.');

