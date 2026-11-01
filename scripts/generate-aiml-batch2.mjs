/**
 * scripts/generate-aiml-batch2.mjs
 *
 * Generates Batch 2 for Course 1 (AI & ML):
 * - Chapter 4: data-cleaning-eda-feature-engineering (ai-04)
 * - Chapter 5: regression-and-classification (ai-05)
 */

import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();

// Helper to write note block
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

// Balance answer keys across single/scenario questions
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
// CHAPTER 4: Data Cleaning, EDA & Feature Engineering (ai-04)
// ============================================================================
console.log('Generating ai-04: data-cleaning-eda-feature-engineering...');

const ai04Objectives = {
  version: 1,
  chapterId: "ai-04",
  objectives: [
    {
      id: "aiml-04-lo01",
      order: 1,
      title: "Detect and remediate missing data using deletion, mean/median imputation, and indicator variables",
      bloom: "apply",
      tier: "core",
      mustHave: true,
      keywords: ["missing data", "imputation", "SimpleImputer", "MCAR", "MAR", "null indicator"],
      aliases: ["missing value handling", "data imputation"],
      prerequisites: [],
      estMinutes: 12
    },
    {
      id: "aiml-04-lo02",
      order: 2,
      title: "Identify and treat numerical outliers using IQR thresholds and Z-score boundaries",
      bloom: "apply",
      tier: "core",
      mustHave: false,
      keywords: ["outlier detection", "IQR", "interquartile range", "z-score", "winsorization", "clipping"],
      aliases: ["outlier filtering", "robust statistics"],
      prerequisites: ["aiml-04-lo01"],
      estMinutes: 10
    },
    {
      id: "aiml-04-lo03",
      order: 3,
      title: "Encode categorical features using One-Hot and Target Encoding without target leakage",
      bloom: "apply",
      tier: "core",
      mustHave: true,
      keywords: ["one-hot encoding", "dummy variables", "target encoding", "cardinality", "sparse matrix"],
      aliases: ["categorical encoding", "dummy encoding"],
      prerequisites: [],
      estMinutes: 12
    },
    {
      id: "aiml-04-lo04",
      order: 4,
      title: "Standardize and normalize continuous features using StandardScaler and MinMaxScaler",
      bloom: "apply",
      tier: "core",
      mustHave: true,
      keywords: ["feature scaling", "StandardScaler", "MinMaxScaler", "z-score", "unit variance", "gradient convergence"],
      aliases: ["normalization", "feature standardization"],
      prerequisites: [],
      estMinutes: 10
    },
    {
      id: "aiml-04-lo05",
      order: 5,
      title: "Construct interaction features, polynomial expansions, and temporal date components",
      bloom: "create",
      tier: "core",
      mustHave: false,
      keywords: ["feature engineering", "polynomial features", "interaction terms", "date extraction", "cyclical encoding"],
      aliases: ["feature creation", "derived predictors"],
      prerequisites: ["aiml-04-lo03", "aiml-04-lo04"],
      estMinutes: 12
    },
    {
      id: "aiml-04-lo06",
      order: 6,
      title: "Prevent data leakage by isolating preprocessing fits to the training split only",
      bloom: "analyze",
      tier: "core",
      mustHave: true,
      keywords: ["data leakage", "train test contamination", "Pipeline", "fit_transform vs transform", "lookahead bias"],
      aliases: ["leakage prevention", "pipeline isolation"],
      prerequisites: ["aiml-04-lo01", "aiml-04-lo04"],
      estMinutes: 12
    },
    {
      id: "aiml-04-lo07",
      order: 7,
      title: "Address class imbalance using random oversampling, SMOTE, and class-weighted loss penalties",
      bloom: "apply",
      tier: "core",
      mustHave: false,
      keywords: ["class imbalance", "SMOTE", "oversampling", "undersampling", "class weights", "focal loss"],
      aliases: ["imbalanced learning", "resampling methods"],
      prerequisites: [],
      estMinutes: 12
    },
    {
      id: "aiml-04-lo08",
      order: 8,
      title: "Compute summary statistics and distribution percentiles to evaluate data drift",
      bloom: "analyze",
      tier: "core",
      mustHave: false,
      keywords: ["summary statistics", "percentiles", "data drift", "descriptive EDA", "skewness", "kurtosis"],
      aliases: ["exploratory data analysis", "statistical profiling"],
      prerequisites: [],
      estMinutes: 10
    },
    {
      id: "aiml-04-lo09",
      order: 9,
      title: "Select high-impact features using mutual information, variance thresholding, and Recursive Feature Elimination",
      bloom: "analyze",
      tier: "extension",
      mustHave: false,
      keywords: ["feature selection", "mutual information", "RFE", "variance threshold", "curse of dimensionality"],
      aliases: ["feature pruning", "dimensionality reduction"],
      prerequisites: ["aiml-04-lo04", "aiml-04-lo05"],
      estMinutes: 15
    }
  ]
};

// Notes for ai-04
writeNoteBlock('ai-ml', 'data-cleaning-eda-feature-engineering', 'aiml-04-lo01',
  'Remediating Missing Data: Imputation Strategies and Indicators',
  `Real-world datasets rarely arrive complete. Missingness arises from hardware sensor failures, customer drop-off in web forms, or merged databases with divergent schemas. Statistically, missing data falls into three categories: Missing Completely at Random (MCAR), Missing at Random (MAR), and Missing Not at Random (MNAR).

When less than 1-2% of rows have missing values at random, listwise row deletion (\`dropna\`) is viable. For wider gaps, deletion introduces selection bias and discards valuable training observations. Standard remediation strategies include:
1. **Univariate Imputation**: Replacing nulls with the column mean (for symmetric data) or median (for skewed distributions). For categorical columns, the most frequent value (mode) or an explicit "Missing" label is used.
2. **Missingness Indicator**: Appending a binary flag column indicating whether the feature was originally missing. In many operational domains (such as credit underwriting or healthcare), the fact that a user skipped a question is itself a powerful predictive signal.`,
  `Executing median imputation with Scikit-Learn:
\`\`\`python
# scikit-learn==1.4.2, numpy==1.26.4
import numpy as np
from sklearn.impute import SimpleImputer

# Training feature matrix with NaN entries
X_train = np.array([[10.0, np.nan], [12.0, 300.0], [np.nan, 250.0], [14.0, 200.0]])

# Configure imputer to compute median and add missing indicator flags
imputer = SimpleImputer(strategy="median", add_indicator=True)
X_imputed = imputer.fit_transform(X_train)

# Output contains imputed values plus 2 binary indicator columns
print(f"Imputed shape: {X_imputed.shape}") # (4, 4)
print(X_imputed)
\`\`\``,
  `Imputing missing values using the mean on heavily skewed distributions (such as personal income), causing extreme outliers to artificially distort typical replacement values. Use median instead.`,
  `If the fact that an income field is missing strongly correlates with bankruptcy risk, which imputation enhancement preserves this predictive signal? (Adding an explicit binary missingness indicator column).`
);

writeNoteBlock('ai-ml', 'data-cleaning-eda-feature-engineering', 'aiml-04-lo02',
  'Outlier Detection and Treatment: IQR and Z-Scores',
  `Outliers are anomalous observations that deviate drastically from the general distribution of training data. Left untreated, extreme outliers exert disproportionate leverage on parameter optimization, pulling linear regression planes and distorting variance scales.

Two statistical frameworks detect univariate outliers:
1. **Interquartile Range (IQR)**: The IQR spans the middle 50% of data: $\\text{IQR} = Q_3 - Q_1$. Tukey's rule establishes conservative boundaries:
$$\\text{Lower Bound} = Q_1 - 1.5 \\times \\text{IQR}, \\quad \\text{Upper Bound} = Q_3 + 1.5 \\times \\text{IQR}$$
Points outside these fences are tagged as outliers. Because quartiles rely on rank ordering rather than sums, IQR is robust against extreme anomalies.
2. **Z-Score Thresholding**: For approximately Gaussian data, values with $|z| = \\left|\\frac{x - \\mu}{\\sigma}\\right| > 3.0$ represent observations over three standard deviations from the mean (under 0.3% probability).

Treatment methods include trimming (deletion) or **Winsorization** (capping/clipping values at specified percentile bounds).`,
  `Clipping outliers using Tukey's IQR rule:
\`\`\`python
# numpy==1.26.4
import numpy as np

data = np.array([12, 14, 15, 14, 16, 15, 13, 14, 98, -45])

q1 = np.percentile(data, 25)
q3 = np.percentile(data, 75)
iqr = q3 - q1

lower_bound = q1 - 1.5 * iqr
upper_bound = q3 + 1.5 * iqr

# Winsorizing / clipping data to fences
clipped_data = np.clip(data, lower_bound, upper_bound)
print(f"Bounds: [{lower_bound:.1f}, {upper_bound:.1f}]")
print(f"Clipped array:\\n{clipped_data}")
\`\`\``,
  `Blindly deleting outliers without investigating their domain origin. In fraud detection and cyber intrusion analysis, the outliers *are* the exact positive target class you must identify.`,
  `In Tukey's boxplot method, what multiplier of the Interquartile Range determines the outer fence boundaries? (1.5).`
);

writeNoteBlock('ai-ml', 'data-cleaning-eda-feature-engineering', 'aiml-04-lo03',
  'Categorical Feature Encoding: One-Hot vs Target Encoding',
  `Machine learning algorithms perform arithmetic on real-valued tensors and cannot ingest raw text strings directly. Categorical variables must be numerically encoded into feature vectors.

Two primary encoding schemes dominate tabular workflows:
1. **One-Hot Encoding (OHE)**: Creates a dedicated binary column ($0$ or $1$) for each unique category level. This preserves neutrality by preventing algorithms from assuming an arbitrary mathematical ordering (e.g., \`Red=1, Green=2, Blue=3\`). However, for high-cardinality features (like ZIP codes or user IDs with thousands of levels), OHE creates an unwieldy, sparse matrix that exhausts memory and induces the curse of dimensionality.
2. **Target (Mean) Encoding**: Replaces each category level with the historical average of the target variable for that cohort (e.g., replacing "Department: Eng" with 0.85 if 85% of engineering candidates are hired). To prevent catastrophic overfitting on rare categories, target encodings must be regularized using Bayesian smoothing and computed strictly inside cross-validation folds.`,
  `Applying One-Hot Encoding with Scikit-Learn:
\`\`\`python
# scikit-learn==1.4.2
import pandas as pd
from sklearn.preprocessing import OneHotEncoder

df = pd.DataFrame({
    "device": ["iOS", "Android", "Android", "Web"],
    "browser": ["Safari", "Chrome", "Firefox", "Chrome"]
})

encoder = OneHotEncoder(sparse_output=False, handle_unknown="ignore")
encoded_matrix = encoder.fit_transform(df)
feature_names = encoder.get_feature_names_out()

encoded_df = pd.DataFrame(encoded_matrix, columns=feature_names)
print(encoded_df)
\`\`\``,
  `Applying simple integer label encoding (\`0, 1, 2\`) to nominal categories (such as vehicle color). Linear and distance-based models will falsely assume that "Blue (2)" is mathematically greater than "Red (0)".`,
  `Why is Target Encoding hazardous if computed naively across an entire dataset without smoothing? (It causes target leakage, allowing models to memorize training target labels through rare category averages).`
);

writeNoteBlock('ai-ml', 'data-cleaning-eda-feature-engineering', 'aiml-04-lo04',
  'Feature Scaling: StandardScaler and MinMaxScaler',
  `Features in real datasets span drastically different measurement scales. A customer's age ranges from 18 to 80, while their annual income ranges from $20,000 to $1,000,000. When fed directly into optimization algorithms, gradient descent oscillates wildly because the loss surface forms an elongated canyon, requiring thousands of steps along the steeper high-magnitude axis. Furthermore, distance-based models (such as k-NN, SVMs, and k-Means) are overwhelmingly dominated by the largest feature.

Two fundamental scalers restore numerical balance:
1. **StandardScaler (Z-Score Normalization)**:
$$z = \\frac{x - \\mu}{\\sigma}$$
Transforms features to have a mean $\\mu = 0$ and standard deviation $\\sigma = 1$. It preserves outlier information and handles unbounded Gaussian distributions gracefully.
2. **MinMaxScaler (Range Normalization)**:
$$x_{\\text{scaled}} = \\frac{x - x_{\\min}}{x_{\\max} - x_{\\min}}$$
Compresses values into a bounded interval (typically $[0, 1]$). It is essential for algorithms requiring bounded inputs (like neural networks with sigmoid activations), but is highly sensitive to extreme outliers.`,
  `Comparing StandardScaler and MinMaxScaler:
\`\`\`python
# scikit-learn==1.4.2
import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler

X = np.array([[20.0, 30000.0], [40.0, 80000.0], [60.0, 150000.0]])

# StandardScaler -> zero mean, unit variance
std_scaler = StandardScaler()
X_std = std_scaler.fit_transform(X)

# MinMaxScaler -> bounded [0, 1]
minmax_scaler = MinMaxScaler()
X_minmax = minmax_scaler.fit_transform(X)

print(f"Standardized:\\n{X_std.round(2)}")
print(f"MinMax [0, 1]:\\n{X_minmax.round(2)}")
\`\`\``,
  `Fitting the scaler on the combined dataset before splitting into train and test sets, which leaks test distribution parameters ($\\mu, \\sigma$) into training.`,
  `Which scaling method compresses all continuous numerical values strictly into the interval $[0, 1]$? (MinMaxScaler).`
);

writeNoteBlock('ai-ml', 'data-cleaning-eda-feature-engineering', 'aiml-04-lo05',
  'Feature Creation: Interactions, Polynomials, and Temporal Components',
  `Raw data columns rarely capture complex domain phenomena in their raw form. Feature engineering is the practice of transforming, combining, and deriving new mathematical representations from existing columns to expose linear relationships to the model.

Key feature creation patterns include:
1. **Interaction Features**: Multiplicative or ratio terms ($x_1 \\times x_2$ or $x_1 / x_2$). For instance, combining \`total_price\` and \`square_feet\` into \`price_per_sqft\` provides a normalized density signal.
2. **Polynomial Features**: Adding squared or cubic terms ($x^2, x^3$) allows linear algorithms to fit curved, non-linear relationships without altering the underlying model architecture.
3. **Temporal Decompositions**: Timestamp columns (\`2026-10-15 14:32:00\`) cannot be read as continuous floats without losing periodicity. Engineers extract calendar components: day of week, hour of day, is_weekend, or transform cyclic hours using trigonometric sine and cosine embeddings: $\\sin(2\\pi \\cdot \\text{hour} / 24)$ and $\\cos(2\\pi \\cdot \\text{hour} / 24)$.`,
  `Engineering polynomial and cyclical temporal features:
\`\`\`python
# scikit-learn==1.4.2, numpy==1.26.4
import numpy as np
import pandas as pd
from sklearn.preprocessing import PolynomialFeatures

# 1. Polynomial and interaction terms
poly = PolynomialFeatures(degree=2, include_bias=False)
X = np.array([[2.0, 3.0], [4.0, 5.0]])
X_poly = poly.fit_transform(X) # Yields [x1, x2, x1^2, x1*x2, x2^2]
print(f"Poly features shape: {X_poly.shape}") # (2, 5)

# 2. Cyclical time encoding (hour 23 is adjacent to hour 0)
hours = np.array([0, 6, 12, 18, 23])
sin_hour = np.sin(2 * np.pi * hours / 24.0)
cos_hour = np.cos(2 * np.pi * hours / 24.0)
\`\`\``,
  `Generating polynomial expansions of degree 4 or 5 indiscriminately across dozens of features, triggering a combinatorial explosion that inflates feature counts into millions and severely overfits.`,
  `Why are cyclical temporal features (like hour of day) encoded with sine and cosine transforms rather than simple integers 0 to 23? (Because 23:00 is mathematically 1 hour away from 00:00, but integer encoding treats them as 23 units apart).`
);

writeNoteBlock('ai-ml', 'data-cleaning-eda-feature-engineering', 'aiml-04-lo06',
  'Data Leakage Prevention and Scikit-Learn Pipelines',
  `Data leakage is one of the most insidious errors in applied machine learning. It occurs when information from outside the training dataset (specifically from the validation or test splits) is inadvertently used to create features or fit model parameters. When leakage occurs, the model achieves unrealistically stellar validation scores, but collapses in production on real-world unseen data.

Common leakage vectors:
- Computing global feature mean, standard deviation, or min/max on the full dataset before splitting into train/test.
- Target encoding using the entire target column.
- Time-series leakage: using future observations to predict past events (lookahead bias).

The definitive architectural solution is the **Scikit-Learn Pipeline**. A Pipeline encapsulates all preprocessing transformers (imputers, encoders, scalers) alongside the final estimator, guaranteeing that \`.fit()\` is invoked exclusively on training partitions, while validation and test sets only ever receive \`.transform()\`.`,
  `Constructing a leak-free Machine Learning Pipeline:
\`\`\`python
# scikit-learn==1.4.2
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import numpy as np

X = np.random.randn(200, 5)
y = np.random.randint(0, 2, 200)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Build unified pipeline
pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler()),
    ("classifier", LogisticRegression())
])

# Pipeline fits transformers strictly on X_train, then applies to X_test
pipeline.fit(X_train, y_train)
test_score = pipeline.score(X_test, y_test)
print(f"Clean test accuracy: {test_score:.4f}")
\`\`\``,
  `Calling \`fit_transform\` on the test dataset instead of \`transform\`, recalculating the mean and standard deviation on test samples and polluting the evaluation benchmark.`,
  `What Scikit-Learn abstraction encapsulates data transformers and estimators to ensure zero preprocessing leakage across cross-validation folds? (\`Pipeline\`).`
);

writeNoteBlock('ai-ml', 'data-cleaning-eda-feature-engineering', 'aiml-04-lo07',
  'Addressing Class Imbalance: Resampling and Cost-Sensitive Loss',
  `In critical classification domains—such as credit card fraud, disease diagnostics, or network intrusion detection—the positive target class of interest is exceptionally rare (often 0.1% of transactions). A naive classifier that predicts the majority class ("Not Fraud") 100% of the time achieves 99.9% raw accuracy, yet delivers zero utility.

Three primary remediation techniques counter class imbalance:
1. **Random Resampling**: 
   - *Undersampling*: Randomly discarding majority-class examples to equalize class proportions. This reduces dataset size and discards valid training data.
   - *Oversampling*: Duplicating minority-class observations.
2. **Synthetic Oversampling (SMOTE)**: Synthetic Minority Over-sampling Technique creates synthetic examples along feature-space line segments connecting k-nearest minority neighbors, avoiding exact duplicate memorization.
3. **Cost-Sensitive Learning (Class Weights)**: Modifying the loss function to penalize misclassifications on minority instances inversely proportional to class frequencies:
$$w_j = \\frac{N}{2 \\times N_j}$$
Setting \`class_weight="balanced"\` forces gradient descent to treat a rare positive error as heavily as dozens of common negative errors.`,
  `Applying balanced class weighting in Scikit-Learn:
\`\`\`python
# scikit-learn==1.4.2
from sklearn.linear_model import LogisticRegression
from sklearn.utils.class_weight import compute_class_weight
import numpy as np

# 990 negative samples (0), 10 positive samples (1)
y = np.array([0]*990 + [1]*10)

# Compute exact balanced loss weights
classes = np.array([0, 1])
weights = compute_class_weight(class_weight="balanced", classes=classes, y=y)
print(f"Weights: Class 0 = {weights[0]:.2f}, Class 1 = {weights[1]:.2f}")
# Class 0: ~0.51, Class 1: ~50.0

# Train classifier with automatic balanced penalization
clf = LogisticRegression(class_weight="balanced")
\`\`\``,
  `Applying SMOTE or oversampling to the entire dataset prior to splitting into train/test sets, creating near-identical synthetic twins across both splits and causing severe leakage.`,
  `If an algorithm achieves 99.5% accuracy on a fraud dataset where 99.5% of samples are legitimate, why is raw accuracy misleading? (Because a dummy model predicting strictly legitimate transactions achieves the same score while catching 0% of fraud).`
);

writeNoteBlock('ai-ml', 'data-cleaning-eda-feature-engineering', 'aiml-04-lo08',
  'Statistical Profiling and Data Drift Evaluation',
  `Machine learning models operate under the mathematical assumption that future inference data is drawn from the identical probability distribution as historical training data ($P_{\\text{train}}(X) = P_{\\text{test}}(X)$). Over time, changes in consumer behavior, macroeconomic shifts, or updated sensor hardware violate this assumption, causing **Data Drift**.

Evaluating data stability requires rigorous statistical profiling:
1. **Summary Percentiles**: Comparing 5-number summaries (min, $Q_1$, median, $Q_3$, max) across baseline training sets and live production windows.
2. **Distribution Divergence**: Metrics such as the Population Stability Index (PSI) and Kolmogorov-Smirnov (KS) test detect whether continuous feature distributions have drifted significantly.
3. **Skewness & Kurtosis**: Measuring distribution tail asymmetry (skewness) and peak sharpness (kurtosis) alerts engineers to sudden regime shifts in streaming data pipelines.`,
  `Comparing train vs production feature drift using the KS test:
\`\`\`python
# scipy==1.13.1, numpy==1.26.4
import numpy as np
from scipy.stats import ks_2samp

# Historical training distribution
train_feature = np.random.normal(loc=50.0, scale=10.0, size=1000)

# Production monitoring batch (drifted mean: 55.0)
prod_feature = np.random.normal(loc=55.0, scale=10.0, size=500)

# Kolmogorov-Smirnov 2-sample test
statistic, p_value = ks_2samp(train_feature, prod_feature)
print(f"KS Statistic: {statistic:.4f}, p-value: {p_value:.2e}")

if p_value < 0.05:
    print("WARNING: Statistically significant data drift detected! Retraining recommended.")
\`\`\``,
  `Deploying models into production without automated feature distribution monitors, remaining blind to catastrophic accuracy decay caused by silent data drift.`,
  `What statistical test compares two continuous empirical distributions to evaluate whether production feature data has drifted from training baselines? (The two-sample Kolmogorov-Smirnov / KS test).`
);

writeNoteBlock('ai-ml', 'data-cleaning-eda-feature-engineering', 'aiml-04-lo09',
  'Feature Selection: Mutual Information and Recursive Feature Elimination',
  `Feeding dozens of irrelevant or redundant features into machine learning models increases training latency, expands memory usage, and exacerbates the **curse of dimensionality**. Feature selection identifies the most predictive subset of variables while discarding noise.

Three primary feature selection paradigms exist:
1. **Filter Methods**: Rank features independently of any model using statistical metrics.
   - *Variance Threshold*: Discards features whose variance falls below a threshold (e.g., constant columns).
   - *Mutual Information (MI)*: Measures non-linear dependency between feature $X$ and target $y$ based on entropy reduction:
$$I(X; Y) = \\sum \\sum p(x, y) \\log \\frac{p(x, y)}{p(x)p(y)}$$
2. **Wrapper Methods**: Search feature combinations using model performance as feedback. **Recursive Feature Elimination (RFE)** trains an estimator, prunes the weakest weights or feature importances, and repeats until the target feature count is reached.
3. **Embedded Methods**: Perform selection naturally during training, such as L1 Lasso regularization or tree split gain rankings.`,
  `Selecting top features using Mutual Information and RFE:
\`\`\`python
# scikit-learn==1.4.2
from sklearn.feature_selection import mutual_info_classif, RFE
from sklearn.linear_model import LogisticRegression
import numpy as np

X = np.random.randn(100, 8)
y = np.random.randint(0, 2, 100)

# 1. Mutual Information ranking
mi_scores = mutual_info_classif(X, y)
print(f"Mutual Information scores:\\n{mi_scores.round(3)}")

# 2. Recursive Feature Elimination to top 4 features
estimator = LogisticRegression()
rfe = RFE(estimator, n_features_to_select=4)
rfe.fit(X, y)
print(f"Selected feature mask: {rfe.support_}")
\`\`\``,
  `Using Pearson correlation to discard features, missing non-linear dependencies (such as quadratic relationships $y = x^2$) where Pearson correlation is 0 but Mutual Information is high.`,
  `Which feature selection approach trains a model iteratively and prunes the lowest-weight features in successive passes? (Recursive Feature Elimination / RFE).`
);

// Question Bank for ai-04 (36 questions: 4 per core LO + 2 for ext + 2 numeric)
const ai04Bank = [
  // LO01
  {
    id: "aiml-04-q01",
    loId: "aiml-04-lo01",
    type: "single",
    difficulty: 1,
    stem: "Why is listwise row deletion (`dropna`) hazardous when a dataset contains missing values across multiple columns?",
    options: [
      { id: "a", text: "It can discard a huge percentage of training records and introduce selection bias." },
      { id: "b", text: "It permanently corrupts the operating system file system." },
      { id: "c", text: "It converts floating point features into complex strings." },
      { id: "d", text: "It violates GPU driver specifications." }
    ],
    answer: ["a"],
    explanation: "Dropping every row containing any null value can easily wipe out 50%+ of observations and bias the training sample.",
    noteRef: "aiml-04-lo01",
    reviewed: false
  },
  {
    id: "aiml-04-q02",
    loId: "aiml-04-lo01",
    type: "single",
    difficulty: 2,
    stem: "When imputing missing values in a heavily skewed numerical feature like annual customer income, why is the median preferred over the mean?",
    options: [
      { id: "a", text: "The median is robust against extreme outlier distortion, whereas the mean is pulled heavily by extreme wealth values." },
      { id: "b", text: "The median executes 1,000x faster in hardware." },
      { id: "c", text: "The mean can only be computed on integer values." },
      { id: "d", text: "The median automatically converts values into probabilities." }
    ],
    answer: ["a"],
    explanation: "The median is a non-parametric statistic resistant to extreme tail outliers, preserving typical central values.",
    noteRef: "aiml-04-lo01",
    reviewed: false
  },
  {
    id: "aiml-04-q03",
    loId: "aiml-04-lo01",
    type: "scenario",
    difficulty: 2,
    stem: "In a medical diagnosis pipeline, patients who skip an optional lifestyle questionnaire have a 4x higher risk of disease. How should this missingness be engineered?",
    options: [
      { id: "a", text: "Impute numerical values and append a binary missingness indicator column to preserve the signal that the field was omitted." },
      { id: "b", text: "Drop all patients who skipped the questionnaire." },
      { id: "c", text: "Replace all missing entries with zero without telling the model." },
      { id: "d", text: "Duplicate the skipped rows 4 times." }
    ],
    answer: ["a"],
    explanation: "When data is Missing Not at Random (MNAR), the fact of missingness is itself an informative predictor captured by indicator flags.",
    noteRef: "aiml-04-lo01",
    reviewed: false
  },
  {
    id: "aiml-04-q04",
    loId: "aiml-04-lo01",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following imputation strategies are supported natively by Scikit-Learn's `SimpleImputer`?",
    options: [
      { id: "a", text: "strategy='mean'" },
      { id: "b", text: "strategy='median'" },
      { id: "c", text: "strategy='most_frequent'" },
      { id: "d", text: "strategy='neural_autoencoder_synthesis'" }
    ],
    answer: ["a", "b", "c"],
    explanation: "SimpleImputer provides mean, median, most_frequent, and constant replacement strategies.",
    noteRef: "aiml-04-lo01",
    reviewed: false
  },

  // LO02
  {
    id: "aiml-04-q05",
    loId: "aiml-04-lo02",
    type: "single",
    difficulty: 1,
    stem: "In Tukey's boxplot method, how is the Interquartile Range (IQR) calculated?",
    options: [
      { id: "a", text: "IQR = Q3 - Q1 (the 75th percentile minus the 25th percentile)." },
      { id: "b", text: "IQR = Maximum value minus Minimum value." },
      { id: "c", text: "IQR = Mean divided by Standard Deviation." },
      { id: "d", text: "IQR = Variance squared." }
    ],
    answer: ["a"],
    explanation: "IQR measures the statistical spread of the middle 50% of ordered observations.",
    noteRef: "aiml-04-lo02",
    reviewed: false
  },
  {
    id: "aiml-04-q06",
    loId: "aiml-04-lo02",
    type: "single",
    difficulty: 2,
    stem: "What is 'Winsorization' in outlier management?",
    options: [
      { id: "a", text: "Capping extreme outliers at specified percentile thresholds (e.g., 1st and 99th percentiles) rather than deleting rows." },
      { id: "b", text: "Converting continuous features into categorical text strings." },
      { id: "c", text: "Encrypting outlier values to protect user privacy." },
      { id: "d", text: "Replacing all outliers with the global maximum." }
    ],
    answer: ["a"],
    explanation: "Winsorization limits extreme values by clipping them to specified lower and upper boundary percentiles.",
    noteRef: "aiml-04-lo02",
    reviewed: false
  },
  {
    id: "aiml-04-q07",
    loId: "aiml-04-lo02",
    type: "scenario",
    difficulty: 2,
    stem: "A continuous training feature has $Q_1 = 20$ and $Q_3 = 40$. What is the upper outlier boundary under Tukey's 1.5 * IQR rule?",
    options: [
      { id: "a", text: "70, calculated as Q3 + 1.5 * (40 - 20) = 40 + 30 = 70." },
      { id: "b", text: "60, calculated as Q3 + IQR." },
      { id: "c", text: "80, calculated as 2 * Q3." },
      { id: "d", text: "50, calculated as Q3 + 10." }
    ],
    answer: ["a"],
    explanation: "IQR = 40 - 20 = 20. Upper fence = Q3 + 1.5 * 20 = 40 + 30 = 70.",
    noteRef: "aiml-04-lo02",
    verify: "(40 + 1.5 * (40 - 20) === 70)",
    reviewed: false
  },
  {
    id: "aiml-04-q08",
    loId: "aiml-04-lo02",
    type: "multi",
    difficulty: 3,
    stem: "Why can naive automatic deletion of statistical outliers severely harm machine learning projects?",
    options: [
      { id: "a", text: "In fraud and threat detection, anomalous outliers represent the exact positive target cases of interest" },
      { id: "b", text: "It discards valid high-variance phenomena that the model will encounter in real production environments" },
      { id: "c", text: "It reduces sample size and statistical power" },
      { id: "d", text: "It violates mathematical laws of matrix multiplication" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Outliers often hold critical domain signals, and removing them leaves models unprepared for real-world anomalies.",
    noteRef: "aiml-04-lo02",
    reviewed: false
  },

  // LO03
  {
    id: "aiml-04-q09",
    loId: "aiml-04-lo03",
    type: "single",
    difficulty: 1,
    stem: "Why is One-Hot Encoding preferred over arbitrary Label Encoding (0, 1, 2) for nominal categories like car colors?",
    options: [
      { id: "a", text: "One-Hot Encoding avoids imposing an artificial mathematical ordering that distance and linear models would falsely exploit." },
      { id: "b", text: "One-Hot Encoding requires less memory than integers." },
      { id: "c", text: "Label Encoding only works in Python 2." },
      { id: "d", text: "One-Hot Encoding guarantees 100% test accuracy." }
    ],
    answer: ["a"],
    explanation: "Encoding Red=1, Green=2, Blue=3 causes models to assume Green is twice Red, whereas One-Hot Encoding preserves categorical independence.",
    noteRef: "aiml-04-lo03",
    reviewed: false
  },
  {
    id: "aiml-04-q10",
    loId: "aiml-04-lo03",
    type: "single",
    difficulty: 2,
    stem: "What major challenge arises when applying One-Hot Encoding to high-cardinality features, such as 5,000 distinct ZIP codes?",
    options: [
      { id: "a", text: "It explodes feature dimensionality, creating a massive sparse matrix that slows training and induces the curse of dimensionality." },
      { id: "b", text: "It produces negative numbers that crash linear models." },
      { id: "c", text: "It converts numerical columns into binary strings." },
      { id: "d", text: "It causes hardware overheating on standard CPUs." }
    ],
    answer: ["a"],
    explanation: "High-cardinality OHE creates thousands of sparse binary columns, drastically expanding memory footprint and causing overfitting.",
    noteRef: "aiml-04-lo03",
    reviewed: false
  },
  {
    id: "aiml-04-q11",
    loId: "aiml-04-lo03",
    type: "scenario",
    difficulty: 2,
    stem: "A categorical column in test data contains an unseen category 'Solar' that never appeared in training. How should `OneHotEncoder` handle this safely?",
    options: [
      { id: "a", text: "Configure `handle_unknown='ignore'`, encoding the unseen category as all zeros across the binary columns." },
      { id: "b", text: "Crash the program with an unrecoverable ValueError." },
      { id: "c", text: "Randomly assign it to one of the training categories." },
      { id: "d", text: "Replace the entire dataset with NaN." }
    ],
    answer: ["a"],
    explanation: "`handle_unknown='ignore'` gracefully outputs all 0s for novel categories without crashing production inference.",
    noteRef: "aiml-04-lo03",
    reviewed: false
  },
  {
    id: "aiml-04-q12",
    loId: "aiml-04-lo03",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following techniques help mitigate target leakage and overfitting when implementing Target (Mean) Encoding?",
    options: [
      { id: "a", text: "Computing target averages strictly within cross-validation training folds (out-of-fold encoding)" },
      { id: "b", text: "Adding empirical Bayes smoothing towards the global target mean for rare categories" },
      { id: "c", text: "Adding Gaussian noise to the encodings during training" },
      { id: "d", text: "Computing the target encoding across all train and test rows simultaneously before splitting" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Out-of-fold calculation, smoothing, and noise injection prevent models from memorizing target labels. Option d is direct data leakage.",
    noteRef: "aiml-04-lo03",
    reviewed: false
  },

  // LO04
  {
    id: "aiml-04-q13",
    loId: "aiml-04-lo04",
    type: "single",
    difficulty: 1,
    stem: "What mathematical transformation defines `StandardScaler` (Z-score normalization)?",
    options: [
      { id: "a", text: "$z = \\frac{x - \\mu}{\\sigma}$, producing zero mean and unit variance." },
      { id: "b", text: "$z = \\frac{x - \\min}{\\max - \\min}$, compressing data to $[0, 1]$." },
      { id: "c", text: "$z = \\log(1 + x)$." },
      { id: "d", text: "$z = x^2$." }
    ],
    answer: ["a"],
    explanation: "StandardScaler centers data at mean 0 and scales to standard deviation 1.",
    noteRef: "aiml-04-lo04",
    reviewed: false
  },
  {
    id: "aiml-04-q14",
    loId: "aiml-04-lo04",
    type: "single",
    difficulty: 2,
    stem: "Why does unscaled feature data severely degrade optimization in gradient-based algorithms like Linear Regression or Neural Networks?",
    options: [
      { id: "a", text: "The loss surface forms an elongated canyon, causing gradients to oscillate wildly along steep dimensions and converge slowly." },
      { id: "b", text: "Unscaled data causes CPU arithmetic logic units to execute backward." },
      { id: "c", text: "Gradient descent cannot compute derivatives on numbers greater than 100." },
      { id: "d", text: "Features with small scales are automatically deleted." }
    ],
    answer: ["a"],
    explanation: "Mismatched feature scales create anisotropic loss surfaces where gradient steps bounce erratically rather than stepping directly toward the minimum.",
    noteRef: "aiml-04-lo04",
    reviewed: false
  },
  {
    id: "aiml-04-q15",
    loId: "aiml-04-lo04",
    type: "scenario",
    difficulty: 2,
    stem: "A feature has minimum 10.0 and maximum 50.0. What is the normalized value of sample $x = 30.0$ under `MinMaxScaler`?",
    options: [
      { id: "a", text: "0.50, calculated as (30 - 10) / (50 - 10) = 20 / 40 = 0.50." },
      { id: "b", text: "0.60, calculated as 30 / 50." },
      { id: "c", text: "0.20, calculated as (30 - 10) / 100." },
      { id: "d", text: "1.00, representing maximum value." }
    ],
    answer: ["a"],
    explanation: "(30 - 10) / (50 - 10) = 20 / 40 = 0.50.",
    noteRef: "aiml-04-lo04",
    verify: "((30 - 10) / (50 - 10) === 0.5)",
    reviewed: false
  },
  {
    id: "aiml-04-q16",
    loId: "aiml-04-lo04",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following machine learning algorithms are directly sensitive to feature scaling and require standardization?",
    options: [
      { id: "a", text: "k-Nearest Neighbors (k-NN) using Euclidean distance" },
      { id: "b", text: "Support Vector Machines (SVM) with RBF kernels" },
      { id: "c", text: "Regularized Logistic Regression (Ridge / Lasso)" },
      { id: "d", text: "Decision Trees and Random Forests" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Distance-based and regularized models depend on feature scale. Decision trees split features independently by rank order and are scale-invariant.",
    noteRef: "aiml-04-lo04",
    reviewed: false
  },

  // LO05
  {
    id: "aiml-04-q17",
    loId: "aiml-04-lo05",
    type: "single",
    difficulty: 1,
    stem: "What is an interaction feature in tabular machine learning?",
    options: [
      { id: "a", text: "A new feature created by multiplying, dividing, or combining two or more base features to capture joint effects." },
      { id: "b", text: "A user interface button on a web dashboard." },
      { id: "c", text: "An error metric computed on validation data." },
      { id: "d", text: "A duplicate column created by memory corruption." }
    ],
    answer: ["a"],
    explanation: "Interaction terms (such as $x_1 \\times x_2$) allow linear models to capture non-additive synergy between predictors.",
    noteRef: "aiml-04-lo05",
    reviewed: false
  },
  {
    id: "aiml-04-q18",
    loId: "aiml-04-lo05",
    type: "single",
    difficulty: 2,
    stem: "Why is cyclical encoding with sine and cosine transforms used for temporal features like hour of day (0-23)?",
    options: [
      { id: "a", text: "It preserves cyclic continuity, ensuring hour 23 and hour 0 are mathematically close in vector space." },
      { id: "b", text: "It compresses 24 hours into 1 bit." },
      { id: "c", text: "It converts timestamps into Julian calendar days." },
      { id: "d", text: "It prevents timezone conversions." }
    ],
    answer: ["a"],
    explanation: "Sine and cosine map circular 24-hour time onto a continuous unit circle where 23:00 and 00:00 remain adjacent.",
    noteRef: "aiml-04-lo05",
    reviewed: false
  },
  {
    id: "aiml-04-q19",
    loId: "aiml-04-lo05",
    type: "scenario",
    difficulty: 2,
    stem: "You have two input features $[x_1, x_2]$. Applying Scikit-Learn's `PolynomialFeatures(degree=2, include_bias=False)` expands this into which set of features?",
    options: [
      { id: "a", text: "$[x_1, x_2, x_1^2, x_1 x_2, x_2^2]$ (5 features total)." },
      { id: "b", text: "$[x_1^2, x_2^2]$ (2 features total)." },
      { id: "c", text: "$[1, x_1, x_2]$ (3 features total)." },
      { id: "d", text: "$[x_1, x_2, x_1 + x_2]$." }
    ],
    answer: ["a"],
    explanation: "Degree 2 expansion includes original terms, squares of each term, and the cross-product interaction term.",
    noteRef: "aiml-04-lo05",
    reviewed: false
  },
  {
    id: "aiml-04-q20",
    loId: "aiml-04-lo05",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following are potential risks of generating high-degree polynomial features?",
    options: [
      { id: "a", text: "Combinatorial explosion in the number of columns, causing memory bloat" },
      { id: "b", text: "Severe model overfitting on training noise" },
      { id: "c", text: "Extreme collinearity between powers of the same feature ($x, x^2, x^3$)" },
      { id: "d", text: "Inability to compute predictions using matrix multiplication" }
    ],
    answer: ["a", "b", "c"],
    explanation: "High-degree polynomials rapidly multiply feature dimensions, induce multicollinearity, and cause extreme overfitting.",
    noteRef: "aiml-04-lo05",
    reviewed: false
  },

  // LO06
  {
    id: "aiml-04-q21",
    loId: "aiml-04-lo06",
    type: "single",
    difficulty: 1,
    stem: "What is data leakage in machine learning?",
    options: [
      { id: "a", text: "When information from the validation or test split inadvertently influences the training phase, artificially inflating evaluation scores." },
      { id: "b", text: "When personal user data is published on an unsecured public server." },
      { id: "c", text: "When RAM memory leaks caused by circular references exhaust system memory." },
      { id: "d", text: "When GPU cache lines lose voltage." }
    ],
    answer: ["a"],
    explanation: "Data leakage introduces future or out-of-sample information into training, producing over-optimistic evaluation metrics that collapse in production.",
    noteRef: "aiml-04-lo06",
    reviewed: false
  },
  {
    id: "aiml-04-q22",
    loId: "aiml-04-lo06",
    type: "single",
    difficulty: 2,
    stem: "Why does invoking `scaler.fit_transform(X)` on the entire dataset BEFORE calling `train_test_split` constitute data leakage?",
    options: [
      { id: "a", text: "Because the mean and standard deviation of the test set are incorporated into the scaling calculation used during training." },
      { id: "b", text: "Because `fit_transform` drops the test target column." },
      { id: "c", text: "Because `train_test_split` requires raw unscaled integers." },
      { id: "d", text: "Because test labels are converted into features." }
    ],
    answer: ["a"],
    explanation: "Fitting scalers on combined data leaks the test set distribution parameters into training, violating strict out-of-sample isolation.",
    noteRef: "aiml-04-lo06",
    reviewed: false
  },
  {
    id: "aiml-04-q23",
    loId: "aiml-04-lo06",
    type: "scenario",
    difficulty: 2,
    stem: "An engineer builds a cross-validation loop and uses a Scikit-Learn `Pipeline([('scaler', StandardScaler()), ('model', Ridge())])`. Why is this leak-free?",
    options: [
      { id: "a", text: "Because the Pipeline ensures `fit` is executed exclusively on the training folds, while validation folds are only transformed." },
      { id: "b", text: "Because `Ridge` automatically deletes leaked columns." },
      { id: "c", text: "Because Scikit-Learn Pipelines encrypt all intermediate arrays." },
      { id: "d", text: "Because cross-validation eliminates the need for test data." }
    ],
    answer: ["a"],
    explanation: "A Pipeline encapsulates transformers inside cross-validation splits, ensuring validation fold data is never seen during fitting.",
    noteRef: "aiml-04-lo06",
    reviewed: false
  },
  {
    id: "aiml-04-q24",
    loId: "aiml-04-lo06",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following preprocessing practices introduce data leakage into a machine learning workflow?",
    options: [
      { id: "a", text: "Imputing missing values using the global median computed across the full combined dataset prior to splitting" },
      { id: "b", text: "Selecting the top 10 features based on correlation with the target across the entire dataset before cross-validation" },
      { id: "c", text: "Fitting a TF-IDF vocabulary on all documents including the test split" },
      { id: "d", text: "Fitting an imputer strictly on `X_train` and calling `imputer.transform(X_test)`" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Options a, b, and c use full-dataset statistics before splitting. Option d is the correct, leak-free protocol.",
    noteRef: "aiml-04-lo06",
    reviewed: false
  },

  // LO07
  {
    id: "aiml-04-q25",
    loId: "aiml-04-lo07",
    type: "single",
    difficulty: 1,
    stem: "Why is raw classification accuracy an uninformative metric when training on highly imbalanced data (e.g., 99.9% legitimate transactions, 0.1% fraud)?",
    options: [
      { id: "a", text: "A trivial baseline model predicting 100% legitimate transactions achieves 99.9% accuracy while detecting zero fraud." },
      { id: "b", text: "Accuracy cannot be calculated when datasets exceed 1,000 samples." },
      { id: "c", text: "Accuracy is mathematically restricted to balanced binary problems." },
      { id: "d", text: "Imbalanced datasets cause floating point division by zero in accuracy formulas." }
    ],
    answer: ["a"],
    explanation: "High class imbalance allows majority class memorization to register near-perfect accuracy without learning minority patterns.",
    noteRef: "aiml-04-lo07",
    reviewed: false
  },
  {
    id: "aiml-04-q26",
    loId: "aiml-04-lo07",
    type: "single",
    difficulty: 2,
    stem: "How does the Synthetic Minority Over-sampling Technique (SMOTE) generate new minority training instances?",
    options: [
      { id: "a", text: "By interpolating synthetic points along vector segments connecting k-nearest neighbors in minority feature space." },
      { id: "b", text: "By making exact bit-for-bit copies of existing minority rows." },
      { id: "c", text: "By clustering majority samples and deleting the centroids." },
      { id: "d", text: "By downloading random samples from the internet." }
    ],
    answer: ["a"],
    explanation: "SMOTE synthesizes novel minority samples along lines connecting neighboring minority instances, avoiding pure duplicate memorization.",
    noteRef: "aiml-04-lo07",
    reviewed: false
  },
  {
    id: "aiml-04-q27",
    loId: "aiml-04-lo07",
    type: "scenario",
    difficulty: 2,
    stem: "You have 900 negative samples and 100 positive samples. Under balanced weighting ($w_j = \\frac{N}{2 \\times N_j}$), what loss weight is assigned to each positive sample?",
    options: [
      { id: "a", text: "5.0, calculated as 1000 / (2 * 100) = 1000 / 200 = 5.0." },
      { id: "b", text: "9.0, reflecting the 9:1 ratio." },
      { id: "c", text: "0.5, calculated as 100 / 200." },
      { id: "d", text: "1.0, treating all samples equally." }
    ],
    answer: ["a"],
    explanation: "Total samples N = 1000. Weight for class 1 = 1000 / (2 * 100) = 5.0. Negative class weight = 1000 / (2 * 900) ≈ 0.56.",
    noteRef: "aiml-04-lo07",
    verify: "(1000 / (2 * 100) === 5.0)",
    reviewed: false
  },
  {
    id: "aiml-04-q28",
    loId: "aiml-04-lo07",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following techniques are effective for training classifiers on severely imbalanced datasets?",
    options: [
      { id: "a", text: "Configuring cost-sensitive class weights in the loss function (`class_weight='balanced'`)" },
      { id: "b", text: "Synthesizing minority training instances using SMOTE strictly inside training folds" },
      { id: "c", text: "Evaluating models using Precision, Recall, PR-AUC, and F1-score rather than raw accuracy" },
      { id: "d", text: "Over-sampling the test set so validation accuracy appears higher" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Class weighting, SMOTE, and precision/recall evaluation handle imbalance cleanly. Resampling the test set corrupts real-world validation.",
    noteRef: "aiml-04-lo07",
    reviewed: false
  },

  // LO08
  {
    id: "aiml-04-q29",
    loId: "aiml-04-lo08",
    type: "single",
    difficulty: 1,
    stem: "What is 'data drift' in production machine learning systems?",
    options: [
      { id: "a", text: "A statistical shift in input feature distributions between baseline training data and live production inference data." },
      { id: "b", text: "Physical degradation of server storage drives over time." },
      { id: "c", text: "Gradual reduction in CPU clock frequency due to thermal throttling." },
      { id: "d", text: "Accumulation of uncommitted Git branches." }
    ],
    answer: ["a"],
    explanation: "Data drift occurs when live feature distributions P(X) diverge from training assumptions, degrading model accuracy.",
    noteRef: "aiml-04-lo08",
    reviewed: false
  },
  {
    id: "aiml-04-q30",
    loId: "aiml-04-lo08",
    type: "single",
    difficulty: 2,
    stem: "Which statistical hypothesis test evaluates whether two continuous empirical distributions differ significantly for drift detection?",
    options: [
      { id: "a", text: "The two-sample Kolmogorov-Smirnov (KS) test." },
      { id: "b", text: "The Euclidean distance test." },
      { id: "c", text: "The Pearson correlation test." },
      { id: "d", text: "The Dijkstra pathfinding algorithm." }
    ],
    answer: ["a"],
    explanation: "The two-sample KS test compares empirical cumulative distribution functions to identify statistically significant drift.",
    noteRef: "aiml-04-lo08",
    reviewed: false
  },
  {
    id: "aiml-04-q31",
    loId: "aiml-04-lo08",
    type: "scenario",
    difficulty: 2,
    stem: "A production monitoring system computes a KS test between baseline and weekly transaction amounts, yielding $p = 0.0001$. How should the engineering team respond?",
    options: [
      { id: "a", text: "Investigate feature drift immediately; $p < 0.05$ indicates statistically significant divergence requiring pipeline review or retraining." },
      { id: "b", text: "Ignore the alert; small p-values prove the model is 100% accurate." },
      { id: "c", text: "Delete all production records to restore equilibrium." },
      { id: "d", text: "Increase model learning rate." }
    ],
    answer: ["a"],
    explanation: "A tiny p-value rejects the null hypothesis that distributions match, confirming significant drift in live inputs.",
    noteRef: "aiml-04-lo08",
    reviewed: false
  },
  {
    id: "aiml-04-q32",
    loId: "aiml-04-lo08",
    type: "multi",
    difficulty: 3,
    stem: "Which statistical metrics are standard components of automated data drift monitoring suites?",
    options: [
      { id: "a", text: "Population Stability Index (PSI)" },
      { id: "b", text: "Kolmogorov-Smirnov (KS) test statistic" },
      { id: "c", text: "Summary percentile tracking (median, IQR, min, max)" },
      { id: "d", text: "GPU temperature throttling index" }
    ],
    answer: ["a", "b", "c"],
    explanation: "PSI, KS tests, and percentile tracking quantify distribution shifts in production feature pipelines.",
    noteRef: "aiml-04-lo08",
    reviewed: false
  },

  // LO09 (Extension)
  {
    id: "aiml-04-q33",
    loId: "aiml-04-lo09",
    type: "single",
    difficulty: 2,
    stem: "What advantage does Mutual Information have over Pearson Correlation for feature selection?",
    options: [
      { id: "a", text: "Mutual Information captures arbitrary non-linear dependencies between feature and target, whereas Pearson only measures linear relationships." },
      { id: "b", text: "Mutual Information executes in $O(1)$ constant time." },
      { id: "c", text: "Mutual Information works only on image files." },
      { id: "d", text: "Pearson correlation cannot be computed in Python." }
    ],
    answer: ["a"],
    explanation: "Mutual Information quantifies information shared between variables, detecting non-linear relationships (like $y = x^2$) where linear correlation is 0.",
    noteRef: "aiml-04-lo09",
    reviewed: false
  },
  {
    id: "aiml-04-q34",
    loId: "aiml-04-lo09",
    type: "single",
    difficulty: 3,
    stem: "How does Recursive Feature Elimination (RFE) select a target subset of $K$ features?",
    options: [
      { id: "a", text: "It iteratively trains a model, ranks feature importance/weights, prunes the weakest features, and repeats until $K$ features remain." },
      { id: "b", text: "It computes variance thresholds on the first row only." },
      { id: "c", text: "It randomly drops features using coin flips." },
      { id: "d", text: "It calculates PCA components." }
    ],
    answer: ["a"],
    explanation: "RFE is a wrapper method that prunes the least significant features iteratively using estimator coefficients.",
    noteRef: "aiml-04-lo09",
    reviewed: false
  },
  {
    id: "aiml-04-q35",
    loId: "aiml-04-lo02",
    type: "numeric",
    difficulty: 2,
    stem: "A dataset has $Q_1 = 30.0$ and $Q_3 = 50.0$. Under Tukey's rule ($1.5 \\times \\text{IQR}$), what is the lower outlier fence?",
    options: [
      { id: "a", text: "0.0" },
      { id: "b", text: "10.0" },
      { id: "c", text: "15.0" },
      { id: "d", text: "20.0" }
    ],
    answer: ["a"],
    explanation: "IQR = 50 - 30 = 20. Lower fence = Q1 - 1.5 * IQR = 30 - 1.5 * 20 = 30 - 30 = 0.0.",
    noteRef: "aiml-04-lo02",
    verify: "(30.0 - 1.5 * (50.0 - 30.0) === 0.0)",
    reviewed: false
  }
];

balanceAndSave('ai-ml', 'data-cleaning-eda-feature-engineering', ai04Objectives, ai04Bank);

console.log('✅ ai-04 complete.');

// ============================================================================
// CHAPTER 5: Regression & Classification (ai-05)
// ============================================================================
console.log('Generating ai-05: regression-and-classification...');

const ai05Objectives = {
  version: 1,
  chapterId: "ai-05",
  objectives: [
    {
      id: "aiml-05-lo01",
      order: 1,
      title: "Formulate linear regression hypotheses and calculate Mean Squared Error (MSE) loss",
      bloom: "apply",
      tier: "core",
      mustHave: true,
      keywords: ["linear regression", "hypothesis function", "weights", "bias", "MSE", "residual sum of squares"],
      aliases: ["ordinary least squares", "linear model formulation"],
      prerequisites: [],
      estMinutes: 10
    },
    {
      id: "aiml-05-lo02",
      order: 2,
      title: "Solve linear regression parameters analytically using the Normal Equation",
      bloom: "apply",
      tier: "core",
      mustHave: true,
      keywords: ["normal equation", "closed-form solution", "matrix inversion", "XTX", "analytical solution"],
      aliases: ["analytical linear regression", "closed form OLS"],
      prerequisites: ["aiml-05-lo01"],
      estMinutes: 12
    },
    {
      id: "aiml-05-lo03",
      order: 3,
      title: "Optimize regression weights iteratively using batch and stochastic Gradient Descent",
      bloom: "apply",
      tier: "core",
      mustHave: true,
      keywords: ["gradient descent", "learning rate", "weight update rule", "cost function", "convergence"],
      aliases: ["iterative optimization", "gradient weight updates"],
      prerequisites: ["aiml-05-lo01"],
      estMinutes: 12
    },
    {
      id: "aiml-05-lo04",
      order: 4,
      title: "Formulate logistic regression for binary classification using the Sigmoid activation function",
      bloom: "understand",
      tier: "core",
      mustHave: true,
      keywords: ["logistic regression", "sigmoid", "logistic function", "log-odds", "logit", "binary classification"],
      aliases: ["sigmoid activation", "logistic model"],
      prerequisites: ["aiml-05-lo01"],
      estMinutes: 10
    },
    {
      id: "aiml-05-lo05",
      order: 5,
      title: "Calculate binary cross-entropy (log-loss) and map decision boundaries at threshold 0.5",
      bloom: "apply",
      tier: "core",
      mustHave: false,
      keywords: ["cross-entropy", "log-loss", "decision boundary", "classification threshold", "maximum likelihood"],
      aliases: ["binary loss", "logistic cost function"],
      prerequisites: ["aiml-05-lo04"],
      estMinutes: 12
    },
    {
      id: "aiml-05-lo06",
      order: 6,
      title: "Prevent overfitting using L2 Ridge regularization and L1 Lasso weight sparsity penalties",
      bloom: "apply",
      tier: "core",
      mustHave: false,
      keywords: ["regularization", "Ridge", "Lasso", "L1 norm", "L2 norm", "shrinkage", "feature sparsity"],
      aliases: ["weight penalty", "L1 L2 regularization"],
      prerequisites: ["aiml-05-lo01", "aiml-05-lo03"],
      estMinutes: 12
    },
    {
      id: "aiml-05-lo07",
      order: 7,
      title: "Evaluate regression predictions using MAE, RMSE, and the Coefficient of Determination ($R^2$)",
      bloom: "analyze",
      tier: "core",
      mustHave: false,
      keywords: ["MAE", "RMSE", "R-squared", "coefficient of determination", "residual analysis", "regression metrics"],
      aliases: ["regression evaluation", "goodness of fit"],
      prerequisites: ["aiml-05-lo01"],
      estMinutes: 10
    },
    {
      id: "aiml-05-lo08",
      order: 8,
      title: "Evaluate binary classifiers using classification accuracy, baseline majorities, and error matrices",
      bloom: "analyze",
      tier: "core",
      mustHave: false,
      keywords: ["accuracy", "baseline majority", "confusion matrix", "misclassification rate", "dummy classifier"],
      aliases: ["classification evaluation", "accuracy assessment"],
      prerequisites: ["aiml-05-lo04", "aiml-05-lo05"],
      estMinutes: 10
    },
    {
      id: "aiml-05-lo09",
      order: 9,
      title: "Extend binary logistic regression to multi-class classification using Softmax and Cross-Entropy loss",
      bloom: "apply",
      tier: "extension",
      mustHave: false,
      keywords: ["softmax", "multinomial logistic regression", "categorical cross-entropy", "multi-class", "one-vs-rest"],
      aliases: ["softmax regression", "multiclass classification"],
      prerequisites: ["aiml-05-lo04", "aiml-05-lo05"],
      estMinutes: 15
    }
  ]
};

// Notes for ai-05
writeNoteBlock('ai-ml', 'regression-and-classification', 'aiml-05-lo01',
  'Linear Regression Formulation and Mean Squared Error Loss',
  `Linear regression models a linear relationship between input features $\\mathbf{x} = [x_1, x_2, \\dots, x_D]^T$ and a continuous real-valued scalar target $y \\in \\mathbb{R}$.

The linear hypothesis is parameterized by a weight vector $\\mathbf{w}$ and scalar bias $b$:
$$\\hat{y} = h_{\\mathbf{w}, b}(\\mathbf{x}) = \\mathbf{w}^T \\mathbf{x} + b = w_1 x_1 + w_2 x_2 + \\dots + w_D x_D + b$$
In vectorized matrix form across a mini-batch matrix $\\mathbf{X} \\in \\mathbb{R}^{N \\times D}$, predictions are computed as $\\mathbf{\\hat{y}} = \\mathbf{X}\\mathbf{w} + b$.

To quantify prediction error across $N$ training samples, we compute the **Mean Squared Error (MSE)** loss:
$$L_{\\text{MSE}}(\\mathbf{w}, b) = \\frac{1}{2N} \\sum_{i=1}^N (\\hat{y}^{(i)} - y^{(i)})^2$$
The squaring operation penalizes large outlier errors quadratically and ensures the loss surface is strictly convex (a smooth multidimensional bowl) with a unique global minimum.`,
  `Computing vectorized predictions and MSE loss:
\`\`\`python
# numpy==1.26.4
import numpy as np

# Feature matrix X (3 samples, 2 features)
X = np.array([[1.0, 2.0], [2.0, 1.0], [3.0, 4.0]])
y_true = np.array([5.0, 4.0, 11.0])

weights = np.array([2.0, 1.5])
bias = 0.5

# Forward predictions: y_hat = X @ w + b
y_hat = X @ weights + bias # [1*2 + 2*1.5 + 0.5, 2*2 + 1*1.5 + 0.5, 3*2 + 4*1.5 + 0.5] -> [5.5, 6.0, 12.5]
residuals = y_hat - y_true # [0.5, 2.0, 1.5]

mse = (1.0 / len(y_true)) * np.sum(residuals**2)
print(f"Predictions: {y_hat}")
print(f"MSE Loss: {mse:.4f}") # (0.25 + 4.0 + 2.25) / 3 = 6.5 / 3 ≈ 2.1667
\`\`\``,
  `Applying linear regression directly to multi-class classification targets (such as categorical class labels 0, 1, 2), falsely assuming numerical ordering and distance between classes.`,
  `Why is the squared error loss function strictly convex for linear models? (Because the second derivative with respect to weights is positive semi-definite $X^T X \\ge 0$, guaranteeing a bowl with a single global minimum).`
);

writeNoteBlock('ai-ml', 'regression-and-classification', 'aiml-05-lo02',
  'Analytical Ordinary Least Squares: The Normal Equation',
  `While iterative optimization steps along gradients, linear regression has a closed-form analytical solution known as the **Normal Equation**.

By setting the partial derivatives of the Mean Squared Error loss with respect to weight vector $\\mathbf{w}$ to zero:
$$\\frac{\\partial L}{\\partial \\mathbf{w}} = \\frac{1}{N} \\mathbf{X}^T (\\mathbf{X}\\mathbf{w} - \\mathbf{y}) = \\mathbf{0}$$
$$\\mathbf{X}^T \\mathbf{X} \\mathbf{w} = \\mathbf{X}^T \\mathbf{y}$$
Assuming matrix $\\mathbf{X}^T \\mathbf{X}$ is invertible, multiplying by its inverse gives the exact optimal parameter weights in a single mathematical step:
$$\\mathbf{w}^* = (\\mathbf{X}^T \\mathbf{X})^{-1} \\mathbf{X}^T \\mathbf{y}$$

Trade-offs:
- **Pros**: Zero hyperparameter tuning—no learning rate, no epochs, no convergence checks. Finds the exact global optimum instantly.
- **Cons**: Computational complexity of inverting an $D \\times D$ matrix is approximately $\\mathcal{O}(D^3)$. When feature count $D$ exceeds 10,000 to 50,000, matrix inversion exhausts RAM and compute. If features are collinear, $\\mathbf{X}^T \\mathbf{X}$ is singular (non-invertible).`,
  `Solving linear regression using the Normal Equation in NumPy:
\`\`\`python
# numpy==1.26.4
import numpy as np

# Training features and target
X_raw = np.array([[1.0], [2.0], [3.0], [4.0]])
y = np.array([2.5, 4.5, 6.5, 8.5])

# Prepend bias column of ones
X = np.c_[np.ones(len(X_raw)), X_raw] # shape (4, 2)

# Solve: w = inv(X.T @ X) @ X.T @ y
w_analytical = np.linalg.inv(X.T @ X) @ X.T @ y
print(f"Optimal parameters [bias, slope]: {w_analytical.round(3)}")
# Output: [0.5, 2.0] -> y = 2.0*x + 0.5
\`\`\``,
  `Attempting to use the Normal Equation when feature count $D = 100,000$, resulting in an unrecoverable memory allocation error during matrix inversion. Use iterative gradient descent instead.`,
  `What is the computational complexity of the Normal Equation relative to feature dimension $D$? (Approximately $\\mathcal{O}(D^3)$ due to $(X^T X)^{-1}$ matrix inversion).`
);

writeNoteBlock('ai-ml', 'regression-and-classification', 'aiml-05-lo03',
  'Iterative Optimization: Batch and Stochastic Gradient Descent',
  `When datasets scale to millions of samples or thousands of features, analytical matrix inversion becomes computationally intractable. Instead, we use iterative **Gradient Descent**.

The algorithm initializes weights $\\mathbf{w}$ randomly (or to zero) and takes repeated small steps in the opposite direction of the gradient:
$$\\mathbf{w}^{(t+1)} = \\mathbf{w}^{(t)} - \\eta \\nabla L(\\mathbf{w}^{(t)})$$
where $\\eta$ is the **learning rate**.

For linear regression under MSE loss, the gradient vector is:
$$\\nabla L(\\mathbf{w}) = \\frac{1}{N} \\mathbf{X}^T (\\mathbf{X}\\mathbf{w} - \\mathbf{y})$$

Optimization regimes:
1. **Batch Gradient Descent**: Uses all $N$ training examples to compute the exact gradient in every step. Stable and deterministic, but slow on large datasets.
2. **Stochastic Gradient Descent (SGD)**: Uses a single random sample per step. Fast and escapes local minima, but exhibits noisy oscillations.
3. **Mini-Batch Gradient Descent**: Uses small slices (32 to 512 samples), combining hardware vectorization with steady convergence.`,
  `Implementing a pure NumPy Gradient Descent loop:
\`\`\`python
# numpy==1.26.4
import numpy as np

# Feature matrix X (4 samples, 1 feature) with bias column
X = np.array([[1.0, 1.0], [1.0, 2.0], [1.0, 3.0], [1.0, 4.0]])
y = np.array([2.5, 4.5, 6.5, 8.5])

weights = np.zeros(2) # [bias, slope]
lr = 0.05
epochs = 500

for epoch in range(epochs):
    y_pred = X @ weights
    residuals = y_pred - y
    gradients = (1.0 / len(y)) * X.T @ residuals
    weights -= lr * gradients

print(f"Trained weights: {weights.round(3)}") # Converges to [0.5, 2.0]
\`\`\``,
  `Setting the learning rate $\\eta$ too high (e.g., 5.0), causing parameter updates to overshoot the minimum, diverge, and output \`NaN\` or \`Infinity\`.`,
  `If the learning rate is set excessively small (e.g., $10^{-8}$), what behavior occurs during training? (Convergence becomes extremely slow, requiring millions of epochs to reach the minimum).`
);

writeNoteBlock('ai-ml', 'regression-and-classification', 'aiml-05-lo04',
  'Binary Logistic Regression and the Sigmoid Activation',
  `Linear regression outputs unbounded continuous numbers $\\hat{y} \\in (-\\infty, +\\infty)$, making it unsuitable for predicting discrete probabilities $p \\in [0, 1]$. **Logistic Regression** adapts linear models for binary classification ($y \\in \\{0, 1\\}$) by passing the raw linear score through the non-linear **Sigmoid (logistic) function**.

The linear logit score is:
$$z = \\mathbf{w}^T \\mathbf{x} + b$$
The Sigmoid function $\\sigma(z)$ maps any real scalar onto the probability interval $(0, 1)$:
$$\\sigma(z) = \\frac{1}{1 + e^{-z}}$$

Key properties:
- When $z = 0$, $\\sigma(0) = 0.5$ (neutral decision point).
- As $z \\to +\\infty$, $\\sigma(z) \\to 1.0$.
- As $z \\to -\\infty$, $\\sigma(z) \\to 0.0$.
- Beautiful derivative identity: $\\frac{d\\sigma}{dz} = \\sigma(z)(1 - \\sigma(z))$.

The model output represents the calibrated posterior probability: $P(y=1 | \\mathbf{x}) = \\sigma(\\mathbf{w}^T \\mathbf{x} + b)$.`,
  `Calculating Sigmoid probabilities in NumPy:
\`\`\`python
# numpy==1.26.4
import numpy as np

def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-z))

# Linear logits for 4 observations
z = np.array([-5.0, 0.0, 2.0, 10.0])
probabilities = sigmoid(z)

for score, prob in zip(z, probabilities):
    print(f"Logit z: {score:5.1f} -> Probability P(y=1): {prob:.4f}")
# Output:
# -5.0 -> 0.0067
#  0.0 -> 0.5000
#  2.0 -> 0.8808
# 10.0 -> 0.9999
\`\`\``,
  `Assuming logistic regression is a regression model because of its historical name. It is fundamentally a parametric binary classification algorithm.`,
  `What probability does the Sigmoid function output when the input logit $z = 0$? (Exactly 0.50).`
);

writeNoteBlock('ai-ml', 'regression-and-classification', 'aiml-05-lo05',
  'Binary Cross-Entropy Loss and Decision Boundaries',
  `Using Mean Squared Error on Sigmoid outputs creates a non-convex loss surface with many shallow local minima. To guarantee strict convexity, Logistic Regression is trained using **Binary Cross-Entropy (BCE)**, also known as **Log-Loss**, derived from Maximum Likelihood Estimation:

$$L_{\\text{BCE}}(\\mathbf{w}, b) = -\\frac{1}{N} \\sum_{i=1}^N \\left[ y^{(i)} \\log(\\hat{p}^{(i)}) + (1 - y^{(i)}) \\log(1 - \\hat{p}^{(i)}) \\right]$$

Behavior:
- If ground truth $y = 1$, the loss is $-\\log(\\hat{p})$. As $\\hat{p} \\to 1$, loss $\\to 0$. If $\\hat{p} \\to 0$, loss $\\to +\\infty$.
- If ground truth $y = 0$, the loss is $-\\log(1 - \\hat{p})$. Confident wrong predictions are punished with massive penalties.

The **Decision Boundary** is the geometric surface where the model is indifferent: $\\hat{p} = 0.5$, which corresponds to $z = \\mathbf{w}^T \\mathbf{x} + b = 0$. For two features, the boundary is a line $w_1 x_1 + w_2 x_2 + b = 0$.`,
  `Evaluating Binary Cross-Entropy loss in Python:
\`\`\`python
# numpy==1.26.4
import numpy as np

# True labels: [1, 0, 1]
y_true = np.array([1.0, 0.0, 1.0])
# Model predicted probabilities
y_pred = np.array([0.90, 0.10, 0.60])

# Binary Cross-Entropy formula with epsilon clipping for numerical stability
eps = 1e-15
p_clipped = np.clip(y_pred, eps, 1.0 - eps)
loss = -np.mean(y_true * np.log(p_clipped) + (1.0 - y_true) * np.log(1.0 - p_clipped))
print(f"Log-Loss: {loss:.4f}") # ≈ 0.2415
\`\`\``,
  `Failing to clip predicted probabilities before computing $\\log(\\hat{p})$, resulting in $\\log(0) = -\\infty$ and causing \`NaN\` gradient crashes.`,
  `At what linear logit score $z$ does a standard logistic regression decision boundary lie when using threshold 0.5? ($z = 0$).`
);

writeNoteBlock('ai-ml', 'regression-and-classification', 'aiml-05-lo06',
  'Overfitting Prevention: Ridge (L2) and Lasso (L1) Regularization',
  `When models have many collinear features or high polynomial degrees, parameter weights can grow excessively large. Large weights cause the model to fit high-frequency training noise, resulting in low training error but high test error (overfitting). **Regularization** adds a penalty term on weight magnitude to the objective loss function:
$$J(\\mathbf{w}) = L_{\\text{data}}(\\mathbf{w}) + \\lambda \\cdot \\Omega(\\mathbf{w})$$
where $\\lambda > 0$ controls the regularization strength.

1. **Ridge Regularization (L2 Norm)**:
$$\\Omega(\\mathbf{w}) = \\|\\mathbf{w}\\|_2^2 = \\sum_{j=1}^D w_j^2$$
Penalizes the sum of squared weights. It shrinks all weights smoothly towards zero, reducing model variance while retaining all features.
2. **Lasso Regularization (L1 Norm)**:
$$\\Omega(\\mathbf{w}) = \\|\\mathbf{w}\\|_1 = \\sum_{j=1}^D |w_j|$$
Penalizes the sum of absolute values. Due to diamond-shaped geometric constraint contours, Lasso drives non-essential weights to exactly zero, performing automated feature selection.`,
  `Comparing Ridge and Lasso feature shrinkage in Scikit-Learn:
\`\`\`python
# scikit-learn==1.4.2
from sklearn.linear_model import Ridge, Lasso
import numpy as np

# 10 correlated features
X = np.random.randn(50, 10)
y = 3.0 * X[:, 0] - 2.0 * X[:, 1] + np.random.randn(50) * 0.1

ridge = Ridge(alpha=1.0).fit(X, y)
lasso = Lasso(alpha=0.2).fit(X, y)

print(f"Ridge coefficients: {ridge.coef_.round(2)}") # All non-zero, shrunken
print(f"Lasso coefficients: {lasso.coef_.round(2)}") # Zeros out uninformative features
print(f"Lasso zeroed features: {np.sum(lasso.coef_ == 0)} of 10")
\`\`\``,
  `Regularizing the bias intercept parameter $b$. Regularization penalties should strictly penalize feature slope weights $\\mathbf{w}$, not the baseline vertical offset.`,
  `Which regularization penalty drives non-essential feature weights to exactly zero, producing sparse models? (L1 Lasso regularization).`
);

writeNoteBlock('ai-ml', 'regression-and-classification', 'aiml-05-lo07',
  'Continuous Evaluation Metrics: MAE, RMSE, and R-Squared',
  `Evaluating regression models requires quantifying how closely predictions $\\hat{y}$ align with ground truth $y$. Three primary metrics evaluate continuous fit:

1. **Mean Absolute Error (MAE)**:
$$\\text{MAE} = \\frac{1}{N} \\sum_{i=1}^N |y^{(i)} - \\hat{y}^{(i)}|$$
Measures average linear error in the original units. Robust to extreme outliers.
2. **Root Mean Squared Error (RMSE)**:
$$\\text{RMSE} = \\sqrt{\\frac{1}{N} \\sum_{i=1}^N (y^{(i)} - \\hat{y}^{(i)})^2}$$
Squaring penalties makes RMSE disproportionately sensitive to large outlier errors. Essential when large blunders are severely undesirable.
3. **Coefficient of Determination ($R^2$)**:
$$R^2 = 1 - \\frac{\\sum (y^{(i)} - \\hat{y}^{(i)})^2}{\\sum (y^{(i)} - \\bar{y})^2}$$
Measures the proportion of variance in $y$ explained by the features. $R^2 = 1.0$ indicates perfect predictions; $R^2 = 0$ indicates performance equivalent to predicting the target mean $\\bar{y}$; negative values indicate performance worse than the horizontal mean line.`,
  `Calculating regression evaluation metrics:
\`\`\`python
# scikit-learn==1.4.2
from sklearn.metrics import mean_absolute_error, root_mean_squared_error, r2_score
import numpy as np

y_true = np.array([100.0, 150.0, 200.0, 250.0])
y_pred = np.array([110.0, 140.0, 205.0, 240.0])

mae = mean_absolute_error(y_true, y_pred)
rmse = root_mean_squared_error(y_true, y_pred)
r2 = r2_score(y_true, y_pred)

mae_str = f"MAE:  \${mae:.2f}"
print("MAE:  " + str(round(mae, 2)))   # (10 + 10 + 5 + 10) / 4 = 8.75
print("RMSE: " + str(round(rmse, 2)))  # sqrt((100 + 100 + 25 + 100) / 4) = sqrt(81.25) ≈ 9.01
print(f"R^2:   {r2:.4f}")    # Explains >96% of variance
\`\`\``,
  `Assuming $R^2$ cannot be negative. If an unregularized model severely overfits or makes wildly erratic test predictions, $R^2$ will drop below zero.`,
  `If a model achieves an $R^2$ of 0.85, what does this indicate? (The model explains 85% of the variance in the target variable around its mean).`
);

writeNoteBlock('ai-ml', 'regression-and-classification', 'aiml-05-lo08',
  'Binary Classification Evaluation: Baselines and Accuracy Pitfalls',
  `Evaluating classification models requires establishing baseline performance standards. A model's score is meaningless without comparing it against a **naive baseline classifier**.

Baseline models:
1. **Majority Class Baseline**: Predicts the most frequent class label in training data 100% of the time.
2. **Stratified Random Baseline**: Generates random predictions based on class frequency proportions.

**Classification Accuracy** is the ratio of correct predictions over total predictions:
$$\\text{Accuracy} = \\frac{\\text{Correct Predictions}}{\\text{Total Predictions}} = \\frac{\\text{TP} + \\text{TN}}{\\text{TP} + \\text{TN} + \\text{FP} + \\text{FN}}$$

When classes are approximately balanced (50/50), accuracy is intuitive. However, on imbalanced distributions, a model that beats the majority baseline by only 0.1% offers virtually zero predictive capability. Furthermore, accuracy treats False Positives and False Negatives with identical weight, which is unacceptable in medical or fraud applications.`,
  `Evaluating a classifier against a Dummy baseline:
\`\`\`python
# scikit-learn==1.4.2
from sklearn.dummy import DummyClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import numpy as np

# Imbalanced dataset: 90 negative (0), 10 positive (1)
y_train = np.array([0]*90 + [1]*10)
X_train = np.random.randn(100, 2)

# 1. Naive baseline: Always predict majority class (0)
baseline = DummyClassifier(strategy="most_frequent")
baseline.fit(X_train, y_train)
baseline_acc = accuracy_score(y_train, baseline.predict(X_train))
print(f"Baseline Majority Accuracy: {baseline_acc:.2%}") # 90.00%

# Any real model MUST decisively outperform 90.00% to have predictive validity
\`\`\``,
  `Celebrating 95% accuracy on an imbalanced dataset where the majority class baseline is 97%, failing to recognize that the trained model performs worse than a dummy guesser.`,
  `On a binary dataset with 80% negative and 20% positive samples, what is the accuracy of a naive majority-class classifier? (80%).`
);

writeNoteBlock('ai-ml', 'regression-and-classification', 'aiml-05-lo09',
  'Multi-Class Classification: Softmax Activation and Categorical Cross-Entropy',
  `Binary logistic regression models two classes ($y \\in \\{0, 1\\}$). When targets span $K > 2$ discrete categories (such as classifying images into cat, dog, or bird), we extend the model to **Multinomial Logistic Regression** (Softmax Regression).

Instead of producing a single scalar logit, the model computes a vector of raw scores $\\mathbf{z} = [z_1, z_2, \\dots, z_K]^T$, where $z_k = \\mathbf{w}_k^T \\mathbf{x} + b_k$. The **Softmax function** normalizes these raw real-valued logits into a probability distribution over all $K$ classes:
$$P(y = k | \\mathbf{x}) = \\text{Softmax}(\\mathbf{z})_k = \\frac{e^{z_k}}{\\sum_{j=1}^K e^{z_j}}$$

Properties:
- All output probabilities lie strictly between $0$ and $1$.
- The sum across all classes is guaranteed to equal $1$: $\\sum_{k=1}^K P(y=k) = 1.0$.

Training optimizes **Categorical Cross-Entropy loss**:
$$L_{\\text{CCE}} = -\\sum_{k=1}^K y_k \\log(\\hat{p}_k)$$
where $\\mathbf{y}$ is a one-hot encoded ground truth target vector.`,
  `Computing Softmax probabilities in NumPy with numerical stability:
\`\`\`python
# numpy==1.26.4
import numpy as np

def stable_softmax(logits):
    # Subtract max logit for numerical stability against overflow
    exp_shifted = np.exp(logits - np.max(logits, axis=-1, keepdims=True))
    return exp_shifted / np.sum(exp_shifted, axis=-1, keepdims=True)

# 3 classes: Cat, Dog, Bird
logits = np.array([2.0, 1.0, 0.1])
probs = stable_softmax(logits)

print(f"Probabilities: {probs.round(4)}") # [0.659, 0.242, 0.099]
print(f"Sum of probabilities: {np.sum(probs):.1f}") # Exactly 1.0
print(f"Predicted class index: {np.argmax(probs)}") # Class 0 (Cat)
\`\`\``,
  `Applying exponentiation to large raw logits (e.g., $e^{1000}$) without subtracting the maximum logit first, triggering a floating-point overflow crash (\`inf / inf = nan\`).`,
  `What activation function generalizes the binary Sigmoid to produce a normalized probability distribution across $K > 2$ mutually exclusive classes? (The Softmax function).`
);

// Question Bank for ai-05 (36 questions: 4 per core LO + 2 for ext + 2 numeric)
const ai05Bank = [
  // LO01
  {
    id: "aiml-05-q01",
    loId: "aiml-05-lo01",
    type: "single",
    difficulty: 1,
    stem: "What is the standard hypothesis function for linear regression with feature vector $\\mathbf{x}$ and parameters $(\\mathbf{w}, b)$?",
    options: [
      { id: "a", text: "$\\hat{y} = \\mathbf{w}^T \\mathbf{x} + b$" },
      { id: "b", text: "$\\hat{y} = \\sigma(\\mathbf{w}^T \\mathbf{x} + b)$" },
      { id: "c", text: "$\\hat{y} = \\text{sign}(\\mathbf{w}^T \\mathbf{x})$" },
      { id: "d", text: "$\\hat{y} = \\frac{1}{2} \\|\\mathbf{w}\\|^2$" }
    ],
    answer: ["a"],
    explanation: "Linear regression computes an affine linear combination of input features weighted by parameter vector w plus bias b.",
    noteRef: "aiml-05-lo01",
    reviewed: false
  },
  {
    id: "aiml-05-q02",
    loId: "aiml-05-lo01",
    type: "single",
    difficulty: 2,
    stem: "Why does the Mean Squared Error (MSE) loss function square prediction residuals $(y - \\hat{y})$?",
    options: [
      { id: "a", text: "It penalizes large errors quadratically and ensures a smooth, convex loss surface with a single global minimum." },
      { id: "b", text: "It converts negative weights into positive integers." },
      { id: "c", text: "It eliminates the need for matrix transpose operations." },
      { id: "d", text: "It forces the regression line to pass through the origin." }
    ],
    answer: ["a"],
    explanation: "Squaring produces positive penalties that scale quadratically with error size, creating a bowl-shaped convex optimization landscape.",
    noteRef: "aiml-05-lo01",
    reviewed: false
  },
  {
    id: "aiml-05-q03",
    loId: "aiml-05-lo01",
    type: "scenario",
    difficulty: 2,
    stem: "A model predicts $\\hat{y} = [3.0, 7.0]$ for true values $y = [2.0, 5.0]$. What is the Mean Squared Error (MSE)?",
    options: [
      { id: "a", text: "2.5, calculated as [(3-2)^2 + (7-5)^2] / 2 = (1 + 4) / 2 = 2.5." },
      { id: "b", text: "5.0, calculated as sum of squared errors." },
      { id: "c", text: "1.5, calculated as mean absolute error." },
      { id: "d", text: "3.0, representing the average prediction." }
    ],
    answer: ["a"],
    explanation: "Residuals are 1 and 2. Squared residuals are 1 and 4. MSE = (1 + 4) / 2 = 2.5.",
    noteRef: "aiml-05-lo01",
    verify: "((Math.pow(3 - 2, 2) + Math.pow(7 - 5, 2)) / 2 === 2.5)",
    reviewed: false
  },
  {
    id: "aiml-05-q04",
    loId: "aiml-05-lo01",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following statements about the Mean Squared Error loss surface for linear regression are true?",
    options: [
      { id: "a", text: "It is strictly convex, meaning any local minimum is the unique global minimum" },
      { id: "b", text: "Its Hessian matrix is $2 \\mathbf{X}^T \\mathbf{X}$, which is positive semi-definite" },
      { id: "c", text: "The gradient is continuous and differentiable everywhere" },
      { id: "d", text: "It contains numerous saddle points that trap standard gradient descent" }
    ],
    answer: ["a", "b", "c"],
    explanation: "MSE for linear regression is a quadratic form, guaranteeing strict convexity with zero sub-optimal local traps.",
    noteRef: "aiml-05-lo01",
    reviewed: false
  },

  // LO02
  {
    id: "aiml-05-q05",
    loId: "aiml-05-lo02",
    type: "single",
    difficulty: 1,
    stem: "What is the closed-form Normal Equation for optimal linear regression parameters $\\mathbf{w}^*$?",
    options: [
      { id: "a", text: "$\\mathbf{w}^* = (\\mathbf{X}^T \\mathbf{X})^{-1} \\mathbf{X}^T \\mathbf{y}$" },
      { id: "b", text: "$\\mathbf{w}^* = \\mathbf{X}^T \\mathbf{y} - \\eta \\nabla L$" },
      { id: "c", text: "$\\mathbf{w}^* = \\mathbf{X} (\\mathbf{y}^T \\mathbf{y})^{-1}$" },
      { id: "d", text: "$\\mathbf{w}^* = \\det(\\mathbf{X}) \\mathbf{y}$" }
    ],
    answer: ["a"],
    explanation: "Setting the gradient of MSE to zero yields the normal equations: X^T X w = X^T y -> w = (X^T X)^-1 X^T y.",
    noteRef: "aiml-05-lo02",
    reviewed: false
  },
  {
    id: "aiml-05-q06",
    loId: "aiml-05-lo02",
    type: "single",
    difficulty: 2,
    stem: "What is the primary computational limitation of using the Normal Equation when feature dimension $D$ is very large (e.g., $D = 100,000$)?",
    options: [
      { id: "a", text: "Inverting the $D \\times D$ matrix $(\\mathbf{X}^T \\mathbf{X})$ requires $\\mathcal{O}(D^3)$ computation and massive memory." },
      { id: "b", text: "The Normal Equation only works for single-variable regression." },
      { id: "c", text: "The Normal Equation requires setting a learning rate." },
      { id: "d", text: "The Normal Equation cannot process positive target values." }
    ],
    answer: ["a"],
    explanation: "Matrix inversion scales cubically with feature count, making analytical solutions impractical for high-dimensional data.",
    noteRef: "aiml-05-lo02",
    reviewed: false
  },
  {
    id: "aiml-05-q07",
    loId: "aiml-05-lo02",
    type: "scenario",
    difficulty: 2,
    stem: "An engineer runs the Normal Equation and receives a `LinAlgError: Singular matrix`. What is the most likely cause?",
    options: [
      { id: "a", text: "Features in $\\mathbf{X}$ exhibit perfect multicollinearity (redundant features) or $N < D$." },
      { id: "b", text: "The target values $y$ are negative." },
      { id: "c", text: "The computer lacks GPU CUDA cores." },
      { id: "d", text: "The learning rate was initialized too high." }
    ],
    answer: ["a"],
    explanation: "Singular matrices occur when columns are linearly dependent (collinear) or when there are fewer samples than features, making X^T X non-invertible.",
    noteRef: "aiml-05-lo02",
    reviewed: false
  },
  {
    id: "aiml-05-q08",
    loId: "aiml-05-lo02",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following are advantages of the Normal Equation over iterative Gradient Descent?",
    options: [
      { id: "a", text: "No learning rate hyperparameter $\\eta$ to choose or tune" },
      { id: "b", text: "No iterative training loop or epoch convergence stopping criteria" },
      { id: "c", text: "Computes the exact mathematical global minimum in a single closed-form step" },
      { id: "d", text: "Scales gracefully to billions of high-dimensional observations" }
    ],
    answer: ["a", "b", "c"],
    explanation: "The Normal Equation finds the exact minimum without hyperparameters, but does not scale well to massive feature dimensions.",
    noteRef: "aiml-05-lo02",
    reviewed: false
  },

  // LO03
  {
    id: "aiml-05-q09",
    loId: "aiml-05-lo03",
    type: "single",
    difficulty: 1,
    stem: "What is the parameter update rule in Gradient Descent with learning rate $\\eta$ and loss $L(\\mathbf{w})$?",
    options: [
      { id: "a", text: "$\\mathbf{w} \\leftarrow \\mathbf{w} - \\eta \\nabla L(\\mathbf{w})$" },
      { id: "b", text: "$\\mathbf{w} \\leftarrow \\mathbf{w} + \\eta \\nabla L(\\mathbf{w})$" },
      { id: "c", text: "$\\mathbf{w} \\leftarrow \\mathbf{w} \\cdot \\nabla L(\\mathbf{w})$" },
      { id: "d", text: "$\\mathbf{w} \\leftarrow \\eta / \\nabla L(\\mathbf{w})$" }
    ],
    answer: ["a"],
    explanation: "Gradient descent steps in the negative gradient direction (-grad) scaled by learning rate eta.",
    noteRef: "aiml-05-lo03",
    reviewed: false
  },
  {
    id: "aiml-05-q10",
    loId: "aiml-05-lo03",
    type: "single",
    difficulty: 2,
    stem: "What happens during optimization if the learning rate $\\eta$ is set excessively large?",
    options: [
      { id: "a", text: "Parameter updates overshoot the valley minimum, causing the loss to diverge toward infinity or NaN." },
      { id: "b", text: "Training finishes in a single hardware cycle." },
      { id: "c", text: "The weights shrink to exactly zero." },
      { id: "d", text: "The model underfits due to lack of momentum." }
    ],
    answer: ["a"],
    explanation: "An excessively large learning rate causes gradient steps to jump across the loss valley, diverging uncontrollably.",
    noteRef: "aiml-05-lo03",
    reviewed: false
  },
  {
    id: "aiml-05-q11",
    loId: "aiml-05-lo03",
    type: "scenario",
    difficulty: 2,
    stem: "At weight $w = 2.0$, the gradient is $\\frac{dL}{dw} = 4.0$. With learning rate $\\eta = 0.1$, what is the updated weight $w_{\\text{new}}$?",
    options: [
      { id: "a", text: "1.6, calculated as 2.0 - (0.1 * 4.0) = 2.0 - 0.4 = 1.6." },
      { id: "b", text: "2.4, calculated as 2.0 + 0.4." },
      { id: "c", text: "0.4, representing the gradient step." },
      { id: "d", text: "0.0, resetting the parameter." }
    ],
    answer: ["a"],
    explanation: "w_new = w - lr * grad = 2.0 - 0.1 * 4.0 = 1.6.",
    noteRef: "aiml-05-lo03",
    verify: "(2.0 - 0.1 * 4.0 === 1.6)",
    reviewed: false
  },
  {
    id: "aiml-05-q12",
    loId: "aiml-05-lo03",
    type: "multi",
    difficulty: 3,
    stem: "How do Batch Gradient Descent and Stochastic Gradient Descent (SGD) compare in practice?",
    options: [
      { id: "a", text: "Batch GD computes gradients across all $N$ training samples; SGD computes gradients on a single random sample per step" },
      { id: "b", text: "SGD introduces stochastic noise that can help parameters escape shallow local minima" },
      { id: "c", text: "Mini-batch GD balances the two by computing vector gradients over slices (e.g., 32-512 samples)" },
      { id: "d", text: "Batch GD is non-deterministic, while SGD is completely deterministic" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Batch GD is fully deterministic over all data, while SGD steps randomly per sample, and mini-batch balances GPU throughput with stability.",
    noteRef: "aiml-05-lo03",
    reviewed: false
  },

  // LO04
  {
    id: "aiml-05-q13",
    loId: "aiml-05-lo04",
    type: "single",
    difficulty: 1,
    stem: "What is the mathematical formulation of the Sigmoid (logistic) function $\\sigma(z)$?",
    options: [
      { id: "a", text: "$\\sigma(z) = \\frac{1}{1 + e^{-z}}$" },
      { id: "b", text: "$\\sigma(z) = \\frac{e^z - e^{-z}}{e^z + e^{-z}}$" },
      { id: "c", text: "$\\sigma(z) = \\max(0, z)$" },
      { id: "d", text: "$\\sigma(z) = \\ln(1 + e^z)$" }
    ],
    answer: ["a"],
    explanation: "The Sigmoid activation maps real-valued logits z onto the bounded interval (0, 1).",
    noteRef: "aiml-05-lo04",
    reviewed: false
  },
  {
    id: "aiml-05-q14",
    loId: "aiml-05-lo04",
    type: "single",
    difficulty: 2,
    stem: "In logistic regression, what does the raw linear score $z = \\mathbf{w}^T \\mathbf{x} + b$ represent mathematically?",
    options: [
      { id: "a", text: "The natural log-odds (logit): $\\ln\\left(\\frac{p}{1 - p}\\right)$." },
      { id: "b", text: "The probability percentage directly." },
      { id: "c", text: "The Euclidean distance to the nearest training cluster." },
      { id: "d", text: "The variance of the target distribution." }
    ],
    answer: ["a"],
    explanation: "Logit z represents the natural logarithm of the odds ratio: ln(p / (1-p)). Applying sigmoid converts log-odds back to probability p.",
    noteRef: "aiml-05-lo04",
    reviewed: false
  },
  {
    id: "aiml-05-q15",
    loId: "aiml-05-lo04",
    type: "scenario",
    difficulty: 2,
    stem: "A logistic regression model produces a linear logit $z = 0.0$ for an incoming observation. What probability $P(y=1)$ is assigned?",
    options: [
      { id: "a", text: "0.50 (50% probability)" },
      { id: "b", text: "0.00 (0% probability)" },
      { id: "c", text: "1.00 (100% probability)" },
      { id: "d", text: "Undefined" }
    ],
    answer: ["a"],
    explanation: "sigma(0) = 1 / (1 + e^0) = 1 / (1 + 1) = 1/2 = 0.50.",
    noteRef: "aiml-05-lo04",
    verify: "(1.0 / (1.0 + Math.exp(0)) === 0.5)",
    reviewed: false
  },
  {
    id: "aiml-05-q16",
    loId: "aiml-05-lo04",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following are mathematical properties of the Sigmoid function $\\sigma(z)$?",
    options: [
      { id: "a", text: "Its output range is strictly bounded: $\\sigma(z) \\in (0, 1)$" },
      { id: "b", text: "Its first derivative is elegantly expressed as $\\sigma(z)(1 - \\sigma(z))$" },
      { id: "c", text: "It is strictly monotonic (if $z_1 > z_2$, then $\\sigma(z_1) > \\sigma(z_2)$)" },
      { id: "d", text: "Its output range extends from $-1$ to $+1$" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Sigmoid outputs range strictly between 0 and 1 (unlike tanh, which ranges from -1 to 1) and its derivative is sigma(1-sigma).",
    noteRef: "aiml-05-lo04",
    reviewed: false
  },

  // LO05
  {
    id: "aiml-05-q17",
    loId: "aiml-05-lo05",
    type: "single",
    difficulty: 1,
    stem: "What is the standard loss function used to train binary logistic regression?",
    options: [
      { id: "a", text: "Binary Cross-Entropy (Log-Loss): $-[y \\log(\\hat{p}) + (1 - y) \\log(1 - \\hat{p})]$." },
      { id: "b", text: "Mean Squared Error: $\\frac{1}{2}(y - \\hat{p})^2$." },
      { id: "c", text: "Hinge loss: $\\max(0, 1 - y \\hat{y})$." },
      { id: "d", text: "Kullback-Leibler divergence of image pixels." }
    ],
    answer: ["a"],
    explanation: "Binary Cross-Entropy provides a strictly convex loss surface under the logistic Sigmoid model.",
    noteRef: "aiml-05-lo05",
    reviewed: false
  },
  {
    id: "aiml-05-q18",
    loId: "aiml-05-lo05",
    type: "single",
    difficulty: 2,
    stem: "Under a standard classification threshold of 0.5, where does the geometric decision boundary lie in feature space?",
    options: [
      { id: "a", text: "Along the hyperplane where the linear logit score equals zero: $\\mathbf{w}^T \\mathbf{x} + b = 0$." },
      { id: "b", text: "At the centroid of the positive training cluster." },
      { id: "c", text: "Along the bounding box of the feature matrix." },
      { id: "d", text: "At probability $p = 1.0$." }
    ],
    answer: ["a"],
    explanation: "p = 0.5 occurs when logit z = 0, creating a linear hyperplane decision boundary w^T x + b = 0.",
    noteRef: "aiml-05-lo05",
    reviewed: false
  },
  {
    id: "aiml-05-q19",
    loId: "aiml-05-lo05",
    type: "scenario",
    difficulty: 2,
    stem: "A model predicts probability $\\hat{p} = 0.01$ for a sample whose true label is $y = 1$. What happens to the Log-Loss penalty $-\\log(\\hat{p})$?",
    options: [
      { id: "a", text: "It incurs a massive loss penalty: $-\\ln(0.01) \\approx 4.605$, punishing confident incorrect predictions." },
      { id: "b", text: "It produces zero loss because probability is positive." },
      { id: "c", text: "It outputs -1.0." },
      { id: "d", text: "The sample is deleted." }
    ],
    answer: ["a"],
    explanation: "Log-loss penalizes confident wrong predictions with logarithmic severity as p approaches 0 for true class 1.",
    noteRef: "aiml-05-lo05",
    verify: "(Math.abs(-Math.log(0.01) - 4.60517) < 0.01)",
    reviewed: false
  },
  {
    id: "aiml-05-q20",
    loId: "aiml-05-lo05",
    type: "multi",
    difficulty: 3,
    stem: "Why is Mean Squared Error (MSE) generally avoided when training logistic regression classifiers?",
    options: [
      { id: "a", text: "Combining MSE with Sigmoid creates non-convex loss surfaces with multiple local minima and plateaus" },
      { id: "b", text: "Gradient updates vanish when predictions are confident but completely wrong" },
      { id: "c", text: "Binary Cross-Entropy derives directly from Maximum Likelihood Estimation for Bernoulli trials" },
      { id: "d", text: "MSE cannot mathematically compute differences between decimals" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Sigmoidal MSE creates non-convex landscapes with vanishing gradients; Cross-Entropy guarantees convexity and steep error gradients.",
    noteRef: "aiml-05-lo05",
    reviewed: false
  },

  // LO06
  {
    id: "aiml-05-q21",
    loId: "aiml-05-lo06",
    type: "single",
    difficulty: 1,
    stem: "What penalty term is added to the loss function in L2 Ridge Regularization?",
    options: [
      { id: "a", text: "The squared $L_2$ norm of the weights: $\\lambda \\sum_{j=1}^D w_j^2$." },
      { id: "b", text: "The sum of absolute weights: $\\lambda \\sum_{j=1}^D |w_j|$." },
      { id: "c", text: "The determinant of the covariance matrix." },
      { id: "d", text: "The learning rate multiplied by batch size." }
    ],
    answer: ["a"],
    explanation: "Ridge regularization penalizes the sum of squared weights, shrinking weights smoothly towards zero.",
    noteRef: "aiml-05-lo06",
    reviewed: false
  },
  {
    id: "aiml-05-q22",
    loId: "aiml-05-lo06",
    type: "single",
    difficulty: 2,
    stem: "What unique property distinguishes L1 Lasso Regularization from L2 Ridge Regularization?",
    options: [
      { id: "a", text: "Lasso drives non-essential feature weights to exactly zero, producing sparse models and automated feature selection." },
      { id: "b", text: "Lasso requires fewer CPU clock cycles to calculate." },
      { id: "c", text: "Lasso guarantees zero training error." },
      { id: "d", text: "Lasso only works on text data." }
    ],
    answer: ["a"],
    explanation: "The sharp diamond geometry of the L1 ball intersects loss contours along axes, driving uninformative weights to exactly 0.",
    noteRef: "aiml-05-lo06",
    reviewed: false
  },
  {
    id: "aiml-05-q23",
    loId: "aiml-05-lo06",
    type: "scenario",
    difficulty: 2,
    stem: "An engineer observes severe overfitting: training $R^2 = 0.98$ but test $R^2 = 0.40$. How should the regularization hyperparameter $\\lambda$ (or `alpha` in Scikit-Learn) be adjusted?",
    options: [
      { id: "a", text: "Increase $\\lambda$ to penalize large weights and reduce model variance." },
      { id: "b", text: "Decrease $\\lambda$ to zero to let weights grow freely." },
      { id: "c", text: "Set $\\lambda$ to a negative number." },
      { id: "d", text: "Switch to unregularized degree-5 polynomial regression." }
    ],
    answer: ["a"],
    explanation: "Increasing regularization strength lambda penalizes complex high-variance weights, narrowing the gap between train and test performance.",
    noteRef: "aiml-05-lo06",
    reviewed: false
  },
  {
    id: "aiml-05-q24",
    loId: "aiml-05-lo06",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following statements about linear model regularization are mathematically accurate?",
    options: [
      { id: "a", text: "Features must be standardized before applying L1/L2 regularization; otherwise features with larger scales are unfairly penalized less" },
      { id: "b", text: "The bias intercept parameter $b$ should not be regularized" },
      { id: "c", text: "As $\\lambda \\to \\infty$, Ridge weights approach zero, turning the model into a constant flat line" },
      { id: "d", text: "Regularization increases training error while decreasing test generalization error" }
    ],
    answer: ["a", "b", "c", "d"],
    explanation: "All four statements are foundational principles of regularized linear models.",
    noteRef: "aiml-05-lo06",
    reviewed: false
  },

  // LO07
  {
    id: "aiml-05-q25",
    loId: "aiml-05-lo07",
    type: "single",
    difficulty: 1,
    stem: "How is the Root Mean Squared Error (RMSE) derived from Mean Squared Error (MSE)?",
    options: [
      { id: "a", text: "$\\text{RMSE} = \\sqrt{\\text{MSE}}$, restoring the error metric to the original target units." },
      { id: "b", text: "$\\text{RMSE} = \\text{MSE}^2$." },
      { id: "c", text: "$\\text{RMSE} = \\text{MSE} / N$." },
      { id: "d", text: "$\\text{RMSE} = \\log(\\text{MSE})$." }
    ],
    answer: ["a"],
    explanation: "Taking the square root of MSE returns the metric to the physical measurement units of the dependent variable.",
    noteRef: "aiml-05-lo07",
    reviewed: false
  },
  {
    id: "aiml-05-q26",
    loId: "aiml-05-lo07",
    type: "single",
    difficulty: 2,
    stem: "What does a negative Coefficient of Determination ($R^2 < 0$) indicate about a regression model on test data?",
    options: [
      { id: "a", text: "The model's predictions perform worse than a horizontal line predicting the simple mean $\\bar{y}$." },
      { id: "b", text: "The model is 100% accurate." },
      { id: "c", text: "The target values are negative integers." },
      { id: "d", text: "The test set was missing headers." }
    ],
    answer: ["a"],
    explanation: "R^2 = 1 - (SS_res / SS_tot). If residual sum of squares exceeds total variance, R^2 becomes negative, indicating disastrous predictions.",
    noteRef: "aiml-05-lo07",
    reviewed: false
  },
  {
    id: "aiml-05-q27",
    loId: "aiml-05-lo07",
    type: "scenario",
    difficulty: 2,
    stem: "A housing model has total sum of squares $\\text{SS}_{\\text{tot}} = 100,000$ and residual sum of squares $\\text{SS}_{\\text{res}} = 20,000$. What is the model's $R^2$ score?",
    options: [
      { id: "a", text: "0.80 (80%), calculated as 1 - (20,000 / 100,000) = 1 - 0.20 = 0.80." },
      { id: "b", text: "0.20 (20%), representing the residual fraction." },
      { id: "c", text: "0.50 (50%)." },
      { id: "d", text: "5.00." }
    ],
    answer: ["a"],
    explanation: "R^2 = 1 - (20000 / 100000) = 0.80, explaining 80% of target variance.",
    noteRef: "aiml-05-lo07",
    verify: "(1.0 - (20000.0 / 100000.0) === 0.8)",
    reviewed: false
  },
  {
    id: "aiml-05-q28",
    loId: "aiml-05-lo07",
    type: "multi",
    difficulty: 3,
    stem: "When comparing Mean Absolute Error (MAE) and Root Mean Squared Error (RMSE) on regression outputs:",
    options: [
      { id: "a", text: "$\\text{RMSE} \\ge \\text{MAE}$ always holds mathematically" },
      { id: "b", text: "RMSE penalizes occasional large outlier blunders much more severely than MAE" },
      { id: "c", text: "If all individual prediction errors have identical magnitude, then $\\text{RMSE} = \\text{MAE}$" },
      { id: "d", text: "MAE cannot be computed when predictions are negative" }
    ],
    answer: ["a", "b", "c"],
    explanation: "By Jensen's inequality, RMSE >= MAE. RMSE squares errors, accentuating large blunders. When errors are uniform, RMSE equals MAE.",
    noteRef: "aiml-05-lo07",
    reviewed: false
  },

  // LO08
  {
    id: "aiml-05-q29",
    loId: "aiml-05-lo08",
    type: "single",
    difficulty: 1,
    stem: "What is the formula for Classification Accuracy in terms of True Positives (TP), True Negatives (TN), False Positives (FP), and False Negatives (FN)?",
    options: [
      { id: "a", text: "$\\text{Accuracy} = \\frac{\\text{TP} + \\text{TN}}{\\text{TP} + \\text{TN} + \\text{FP} + \\text{FN}}$" },
      { id: "b", text: "$\\text{Accuracy} = \\frac{\\text{TP}}{\\text{TP} + \\text{FP}}$" },
      { id: "c", text: "$\\text{Accuracy} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}$" },
      { id: "d", text: "$\\text{Accuracy} = \\frac{\\text{TN}}{\\text{TN} + \\text{FN}}$" }
    ],
    answer: ["a"],
    explanation: "Accuracy is the proportion of all correct decisions (TP + TN) over all evaluated cases.",
    noteRef: "aiml-05-lo08",
    reviewed: false
  },
  {
    id: "aiml-05-q30",
    loId: "aiml-05-lo08",
    type: "single",
    difficulty: 2,
    stem: "Why is a 'Dummy Classifier' that always predicts the majority class valuable in machine learning workflows?",
    options: [
      { id: "a", text: "It establishes the non-informative performance floor that any trained model must decisively beat to prove utility." },
      { id: "b", text: "It encrypts training labels for secure cloud storage." },
      { id: "c", text: "It replaces cross-validation splits." },
      { id: "d", text: "It proves the dataset is linearly separable." }
    ],
    answer: ["a"],
    explanation: "Dummy classifiers provide baseline reference benchmarks to ensure models are actually learning predictive signals.",
    noteRef: "aiml-05-lo08",
    reviewed: false
  },
  {
    id: "aiml-05-q31",
    loId: "aiml-05-lo08",
    type: "scenario",
    difficulty: 2,
    stem: "A test set contains 85 legitimate emails and 15 spam emails. A model predicts all 100 emails are legitimate. What is its accuracy?",
    options: [
      { id: "a", text: "85%, calculated as 85 correct legitimate predictions out of 100 total emails." },
      { id: "b", text: "15%, representing the spam error rate." },
      { id: "c", text: "100%, because no legitimate emails were misclassified." },
      { id: "d", text: "0%, because zero spam was caught." }
    ],
    answer: ["a"],
    explanation: "85 of 100 predictions are correct (accuracy = 85%), demonstrating how majority prediction mimics high accuracy on imbalanced tasks.",
    noteRef: "aiml-05-lo08",
    verify: "(85.0 / 100.0 === 0.85)",
    reviewed: false
  },
  {
    id: "aiml-05-q32",
    loId: "aiml-05-lo08",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following scenarios demonstrate why raw classification accuracy can be a deceptive evaluation metric?",
    options: [
      { id: "a", text: "A rare disease dataset with 99.5% negative cases where a dummy model achieves 99.5% accuracy while identifying zero sick patients" },
      { id: "b", text: "An intrusion detection system where False Negatives (breaches) are 10,000x more costly than False Positives (alerts)" },
      { id: "c", text: "Multi-class classification with equal 50/50 balanced classes" },
      { id: "d", text: "Fraud detection with 0.05% positive transaction prevalence" }
    ],
    answer: ["a", "b", "d"],
    explanation: "Accuracy fails when classes are imbalanced (a, d) or when error costs are asymmetric (b). On balanced 50/50 classes (c), accuracy is informative.",
    noteRef: "aiml-05-lo08",
    reviewed: false
  },

  // LO09 (Extension)
  {
    id: "aiml-05-q33",
    loId: "aiml-05-lo09",
    type: "single",
    difficulty: 2,
    stem: "What mathematical guarantee does the Softmax function provide across its output classes?",
    options: [
      { id: "a", text: "All outputs are strictly positive probabilities that sum to exactly 1.0 across all classes." },
      { id: "b", text: "All outputs are integers between 0 and 100." },
      { id: "c", text: "The largest output is always 1.0." },
      { id: "d", text: "The outputs are orthogonal vectors." }
    ],
    answer: ["a"],
    explanation: "Softmax normalizes exponentials of logits, ensuring each class probability is in (0, 1) and their sum across all classes equals 1.0.",
    noteRef: "aiml-05-lo09",
    reviewed: false
  },
  {
    id: "aiml-05-q34",
    loId: "aiml-05-lo09",
    type: "single",
    difficulty: 3,
    stem: "Why is numerical stability achieved by subtracting $\\max(\\mathbf{z})$ when evaluating Softmax: $\\text{Softmax}(\\mathbf{z} - \\max(\\mathbf{z}))$?",
    options: [
      { id: "a", text: "It prevents floating-point overflow ($e^{1000} \\to \\infty$) while mathematically preserving exact output probabilities." },
      { id: "b", text: "It forces the lowest probability to zero." },
      { id: "c", text: "It converts multinomial logistic regression into binary classification." },
      { id: "d", text: "It eliminates negative numbers from memory." }
    ],
    answer: ["a"],
    explanation: "Multiplying numerator and denominator by e^-max(z) does not change the ratio, but prevents overflow by capping the maximum exponent at e^0 = 1.",
    noteRef: "aiml-05-lo09",
    reviewed: false
  },
  {
    id: "aiml-05-q35",
    loId: "aiml-05-lo07",
    type: "numeric",
    difficulty: 2,
    stem: "A linear regression model predicts values [10.0, 20.0, 30.0] for true targets [12.0, 18.0, 34.0]. What is the Mean Absolute Error (MAE)?",
    options: [
      { id: "a", text: "2.67" },
      { id: "b", text: "8.00" },
      { id: "c", text: "3.50" },
      { id: "d", text: "4.00" }
    ],
    answer: ["a"],
    explanation: "Absolute errors: |10-12|=2, |20-18|=2, |30-34|=4. MAE = (2 + 2 + 4) / 3 = 8 / 3 ≈ 2.67.",
    noteRef: "aiml-05-lo07",
    verify: "(Math.abs(((Math.abs(10-12) + Math.abs(20-18) + Math.abs(30-34)) / 3) - 2.6666666666666665) < 0.01)",
    reviewed: false
  }
];

balanceAndSave('ai-ml', 'regression-and-classification', ai05Objectives, ai05Bank);

console.log('✅ ai-05 complete.');

