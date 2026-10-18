/**
 * scripts/generate-vertical-slice-content.mjs
 *
 * Generates modular LO note blocks (content/<course>/<chapter>/notes/<lo-id>.mdx)
 * and comprehensive question banks (content/<course>/<chapter>/quiz/bank.json)
 * for the 3 vertical slice chapters:
 * 1. AI & ML: what-ai-ml-really-are (8 core LOs, 32+ questions)
 * 2. Cybersecurity: security-foundations-and-attack-lifecycle (8 core LOs, 32+ questions)
 * 3. IoT: iot-architecture-and-physical-computing (8 core LOs, 32+ questions)
 *
 * Each note has sections:
 * - Core idea
 * - Worked example
 * - Common mistake
 * - Check yourself
 *
 * Each question has:
 * - id, loId, type, difficulty (1, 2, 3), stem, options (array of {id, text}),
 *   answer (array of ids), explanation, noteRef, reviewed: false
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Helper to write note block
function writeNoteBlock(courseSlug, chapterSlug, loId, title, coreIdea, workedExample, commonMistake, checkYourself) {
  const dir = path.join(ROOT_DIR, 'content', courseSlug, chapterSlug, 'notes');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const content = `---
loId: "${loId}"
title: "${title}"
reviewed: false
sources:
  - title: "Vellum Academy Curriculum Standards"
    url: "https://vellum.academy/sources"
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

// ----------------------------------------------------
// 1. AI & ML: what-ai-ml-really-are
// ----------------------------------------------------
console.log('Generating AI & ML Vertical Slice Content...');

const aimlNotes = [
  {
    loId: 'aiml-01-lo01',
    title: 'Machine Learning vs Hand-Coded Rules',
    core: `Traditional software engineering relies on humans discovering rules and writing explicit conditionals: \`Data + Rules = Answers\`. Machine learning turns this dynamic inside out: we present an optimization algorithm with examples of inputs and ground-truth targets, and the computer computes the mathematical parameters that map inputs to outputs: \`Data + Answers = Rules\`. This replaces fragile nested if/else statements with continuous numerical optimization.`,
    worked: `Consider spam filtering:
\`\`\`python
# Classical programming (rule-based):
def is_spam_rule(email):
    if "FREE MONEY" in email.text and email.sender_reputation < 0.2:
        return True
    return False

# Machine learning (data-driven model):
def is_spam_ml(email, weights, bias):
    features = extract_feature_vector(email) # [word_counts, link_ratio, header_entropy]
    score = sum(w * x for w, x in zip(weights, features)) + bias
    return score > 0.0 # Parameters w and b learned automatically from historical data
\`\`\``,
    mistake: `Assuming machine learning models "understand" concepts like a human. An ML model is strictly an empirical function approximator mapping multidimensional numbers to other numbers via statistical correlation.`,
    check: `If you need to process tax brackets defined by statutory law, should you use ML or rule-based code? (Rule-based: statutory laws have exact, deterministic logic with zero ambiguity and zero tolerance for statistical error).`
  },
  {
    loId: 'aiml-01-lo02',
    title: 'Supervised, Unsupervised, and Reinforcement Learning',
    core: `Machine learning branches into three foundational learning paradigms:
1. **Supervised Learning**: Model receives paired examples $(x_i, y_i)$ where $y_i$ is a known supervisor label. Used for regression (continuous outputs) and classification (discrete classes).
2. **Unsupervised Learning**: Model receives unlabeled observations $x_i$ and seeks latent structure, groupings (clustering), or reduced dimensionality (PCA).
3. **Reinforcement Learning**: An autonomous agent takes actions in a dynamic environment, guided by scalar reward signals to discover optimal policies over time.`,
    worked: `Classifying credit card transactions:
- Supervised: Training on 1,000,000 transactions with human-audited labels: \`0 = legitimate, 1 = fraudulent\`.
- Unsupervised: Clustering transactions into 5 natural behavioral clusters without any prior fraud tags to spot anomalous outliers.
- Reinforcement: An automated trading agent placing limit orders and receiving positive rewards on portfolio net yield.`,
    mistake: `Confusing unsupervised clustering with classification. Classification always requires pre-existing ground truth labels; clustering discovers mathematical clusters purely from input geometry.`,
    check: `You want to group 50,000 unread support tickets into customer topic categories without predefined labels. Which paradigm do you select? (Unsupervised clustering or topic modeling).`
  },
  {
    loId: 'aiml-01-lo03',
    title: 'Model Function: Weights and Biases',
    core: `The simplest parameterized model is an affine transformation: $\\hat{y} = w^T x + b$. Here, $x$ is the feature vector, $w$ represents the weights (slopes governing each feature's influence), and $b$ is the scalar bias (intercept shifting the prediction independent of inputs). Training a model means systematically finding numerical values for $w$ and $b$ that minimize prediction discrepancy across training observations.`,
    worked: `Predicting server response latency ($y$, ms) from concurrent requests ($x_1$) and memory usage ($x_2$):
$$\\hat{y} = w_1 x_1 + w_2 x_2 + b$$
If $w_1 = 0.5$, $w_2 = 1.2$, and $b = 15.0$:
For $x_1 = 100$ and $x_2 = 10$:
$$\\hat{y} = (0.5 \\times 100) + (1.2 \\times 10) + 15.0 = 50 + 12 + 15 = 77\\text{ ms}$$`,
    mistake: `Omitting the bias term $b$. Without bias, the regression line or hyperplane is forced to pass strictly through the origin $(0, 0)$, severely limiting what functions the model can represent.`,
    check: `What happens to the model output $\\hat{y} = w x + b$ if all input features $x = 0$? (The prediction equals the bias term $b$).`
  },
  {
    loId: 'aiml-01-lo04',
    title: 'Loss and Cost Functions (MSE)',
    core: `A loss function $\\mathcal{L}(\\hat{y}, y)$ quantifies the error for an individual prediction against the ground truth. A cost function $J(\\theta)$ averages this loss across the entire training dataset of $N$ examples. For continuous regression, Mean Squared Error (MSE) is the gold standard:
$$J(w, b) = \\frac{1}{N} \\sum_{i=1}^N (\\hat{y}_i - y_i)^2$$
Squaring residuals ensures all errors are positive and penalizes large outliers quadratically.`,
    worked: `Calculating MSE across 3 predictions:
- Actual targets: $[10, 20, 30]$
- Predictions: $[12, 19, 26]$
- Residuals: $[+2, -1, -4]$
- Squared errors: $[4, 1, 16]$
- Sum of squares: $21$
- Mean Squared Error: $J = 21 / 3 = 7.0$`,
    mistake: `Using raw differences $(\\hat{y} - y)$ instead of squaring or absolute values. Positive and negative errors cancel each other out, making a terribly inaccurate model appear to have zero net error.`,
    check: `If prediction $\\hat{y} = 10$ and ground truth $y = 6$, what is the single-sample squared error? ($(10 - 6)^2 = 16$).`
  },
  {
    loId: 'aiml-01-lo05',
    title: 'Gradient Descent Optimization',
    core: `Gradient Descent is an iterative optimization algorithm that updates parameters $\\theta$ in the direction of steepest descent—the negative gradient of the cost function:
$$\\theta \\leftarrow \\theta - \\alpha \\nabla_\\theta J(\\theta)$$
Where $\\alpha$ is the **learning rate**, a positive scalar tuning the step size. For MSE with respect to weight $w$, the partial derivative is:
$$\\frac{\\partial J}{\\partial w} = \\frac{2}{N} \\sum_{i=1}^N (\\hat{y}_i - y_i) x_i$$`,
    worked: `One step of gradient descent for a single parameter $w$:
- Current weight: $w = 2.0$
- Learning rate: $\\alpha = 0.05$
- Computed gradient: $\\frac{\\partial J}{\\partial w} = +4.0$ (loss increases as $w$ increases)
- Update step:
$$w_{\\text{new}} = 2.0 - (0.05 \\times 4.0) = 2.0 - 0.2 = 1.8$$
Weight correctly decreases to move toward the loss valley.`,
    mistake: `Setting learning rate $\\alpha$ too high, which causes gradient descent to overshoot the minimum and diverge toward infinity; or setting $\\alpha$ too small, taking millions of iterations to converge.`,
    check: `If the gradient $\\frac{\\partial J}{\\partial w} = 0$, what does the update rule do? ($w$ does not change; a local or global stationary point has been reached).`
  },
  {
    loId: 'aiml-01-lo06',
    title: 'Underfitting, Overfitting, and Inductive Bias',
    core: `Generalization is the model's ability to perform accurately on previously unseen data.
- **Underfitting (High Bias)**: Model is too simplistic (e.g. fitting a straight line to quadratic data) and fails to capture the true underlying pattern, performing poorly on both training and test data.
- **Overfitting (High Variance)**: Model is overly complex (e.g. high-degree polynomial) and memorizes noise in the training set, achieving near-zero training error but catastrophic test error.
- **Inductive Bias**: The set of fundamental assumptions an algorithm employs to generalize beyond training observations (e.g. linear models assume relationships are linear; convolutional models assume local spatial invariance).`,
    worked: `Analyzing model loss curves over 100 epochs:
- Epoch 10: Train Loss 0.50, Val Loss 0.52 (Healthy learning)
- Epoch 50: Train Loss 0.20, Val Loss 0.23 (Optimal balance point)
- Epoch 100: Train Loss 0.02, Val Loss 0.65 (Severe Overfitting: training loss keeps dropping while validation loss explodes).`,
    mistake: `Judging model performance purely by training set accuracy. A lookup table has 100% training accuracy but zero generalization capability.`,
    check: `If your training error is 1% and validation error is 32%, what failure mode are you experiencing? (Overfitting).`
  },
  {
    loId: 'aiml-01-lo07',
    title: 'Train, Validation, and Test Splits',
    core: `To prevent data leakage and obtain unbiased evaluations, datasets must be partitioned into three isolated splits:
1. **Training Set (~70%)**: Used by gradient descent to directly calculate gradients and update model parameters ($w, b$).
2. **Validation Set (~15%)**: Used by human engineers to compare different architectures, tune hyperparameters (learning rate, tree depth), and implement early stopping.
3. **Test Set (~15%)**: Kept in a vault until the model is finalized; used strictly once to measure expected real-world generalization performance.`,
    worked: `A clean 10,000-sample partition:
\`\`\`python
import random

def partition_data(dataset, train_ratio=0.70, val_ratio=0.15):
    shuffled = dataset.copy()
    random.seed(42) # Deterministic split
    random.shuffle(shuffled)
    
    n_train = int(len(shuffled) * train_ratio)
    n_val = int(len(shuffled) * val_ratio)
    
    train = shuffled[:n_train]
    val = shuffled[n_train:n_train + n_val]
    test = shuffled[n_train + n_val:]
    return train, val, test
\`\`\``,
    mistake: `Performing feature normalization or data imputation on the entire dataset *before* splitting. This leaks statistical parameters (like mean and standard deviation) from the test set into the training pipeline.`,
    check: `Why can you not use the test set to choose your learning rate? (Because choosing hyperparameters based on test set performance causes overfitting to the test set, destroying its validity as an unbiased evaluation).`
  },
  {
    loId: 'aiml-01-lo08',
    title: 'Non-Linear Decision Boundaries and Hidden Layers',
    core: `A single linear layer can only draw planar decision boundaries (hyperplanes). It cannot solve problems where classes are not linearly separable, such as the classic **XOR (exclusive OR)** problem. To represent non-linear relationships, neural networks introduce **hidden layers** coupled with non-linear **activation functions** (such as ReLU: $f(z) = \\max(0, z)$ or Sigmoid: $\\sigma(z) = \\frac{1}{1 + e^{-z}}$). Without non-linear activations, stacking multiple linear layers mathematically collapses into a single linear transformation ($W_2(W_1 x) = (W_2 W_1) x = W_3 x$).`,
    worked: `The XOR Problem:
- Inputs: $(0, 0) \\rightarrow 0$, $(1, 1) \\rightarrow 0$, $(0, 1) \\rightarrow 1$, $(1, 0) \\rightarrow 1$.
- Plotting these 4 points on a 2D plane proves no single straight line can separate the $1$s from the $0$s.
- Adding a 2-neuron hidden layer with ReLU activations bends the input space, projecting the points into a 2D representation where they become linearly separable.`,
    mistake: `Stacking 10 dense neural layers with purely linear activations ($f(z) = z$) and expecting deep learning power. The entire 10-layer network has exactly the same mathematical representation power as a 1-layer linear regression.`,
    check: `What is the output of $\\text{ReLU}(-4.2)$? ($0.0$, because $\\max(0, -4.2) = 0$).`
  }
];

for (const n of aimlNotes) {
  writeNoteBlock('ai-ml', 'what-ai-ml-really-are', n.loId, n.title, n.core, n.worked, n.mistake, n.check);
}

// ----------------------------------------------------
// AI & ML Quiz Bank (32 questions: 4 per core LO)
// ----------------------------------------------------
const aimlQuizQuestions = [
  // LO 1 (4 questions)
  {
    id: 'aiml-01-q01',
    loId: 'aiml-01-lo01',
    type: 'single',
    difficulty: 1,
    stem: 'How does classical software engineering differ fundamentally from the machine learning paradigm?',
    options: [
      { id: 'a', text: 'Classical software only runs in binary, whereas machine learning runs in interpreted text.' },
      { id: 'b', text: 'Classical engineering feeds explicit human rules and input data to produce answers; machine learning feeds input data and answers to discover statistical rules and parameters.' },
      { id: 'c', text: 'Classical engineering uses CPU threads, while machine learning algorithms cannot utilize CPUs.' },
      { id: 'd', text: 'Classical engineering can only solve mathematical problems, while machine learning can only process images.' }
    ],
    answer: ['b'],
    explanation: 'In classical coding, humans hand-craft explicit conditional rules. In ML, parameter optimization statistically discovers the relationship between inputs and ground-truth targets.',
    noteRef: 'aiml-01-lo01',
    reviewed: false
  },
  {
    id: 'aiml-01-q02',
    loId: 'aiml-01-lo01',
    type: 'single',
    difficulty: 2,
    stem: 'Why are hand-coded rule-based systems ill-suited for complex tasks like computer vision or speech recognition?',
    options: [
      { id: 'a', text: 'Because digital cameras encode images using quantum encryption that if-statements cannot read.' },
      { id: 'b', text: 'Because microprocessors prohibit writing more than 100 conditional branches in a single function.' },
      { id: 'c', text: 'Because natural perceptual signals contain continuous high-dimensional variations that are practically impossible to capture with human-crafted if/else trees.' },
      { id: 'd', text: 'Because explicit code executes too fast for modern network interfaces.' }
    ],
    answer: ['c'],
    explanation: 'Real-world perceptual data (pixels, audio waveforms) has infinite subtle variations that break deterministic manual rule systems.',
    noteRef: 'aiml-01-lo01',
    reviewed: false
  },
  {
    id: 'aiml-01-q03',
    loId: 'aiml-01-lo01',
    type: 'scenario',
    difficulty: 2,
    stem: 'A financial firm wants to automate statutory overtime wage calculations based on state labor law. Should they build a machine learning model or write deterministic rule-based code?',
    options: [
      { id: 'a', text: 'Machine learning, because it will discover creative ways to interpret labor law.' },
      { id: 'b', text: 'Deterministic rule-based code, because statutory wage law is an exact, rule-bound system requiring 100% mathematical precision with zero tolerance for statistical error.' },
      { id: 'c', text: 'Machine learning, because deterministic code cannot perform arithmetic addition.' },
      { id: 'd', text: 'An unsupervised clustering algorithm to cluster employee hours.' }
    ],
    answer: ['b'],
    explanation: 'When requirements are deterministic, strictly codified in statutory regulations, and require zero tolerance for statistical approximations, classical rule-based programming is strictly superior.',
    noteRef: 'aiml-01-lo01',
    reviewed: false
  },
  {
    id: 'aiml-01-q04',
    loId: 'aiml-01-lo01',
    type: 'multi',
    difficulty: 3,
    stem: 'Which of the following problems are ideal candidates for machine learning rather than hand-coded rules? (Select all that apply)',
    options: [
      { id: 'a', text: 'Transcribing conversational speech audio with diverse background noise and regional accents.' },
      { id: 'b', text: 'Calculating the exact sales tax for an e-commerce cart based on a zip code lookup table.' },
      { id: 'c', text: 'Detecting anomalous network intrusion patterns in high-throughput server telemetry.' },
      { id: 'd', text: 'Predicting customer churn likelihood from multi-year behavioral usage logs.' }
    ],
    answer: ['a', 'c', 'd'],
    explanation: 'Speech transcription, anomaly detection, and churn prediction involve complex, probabilistic patterns suited for ML. Tax lookup is a deterministic rule table.',
    noteRef: 'aiml-01-lo01',
    reviewed: false
  },

  // LO 2 (4 questions)
  {
    id: 'aiml-01-q05',
    loId: 'aiml-01-lo02',
    type: 'single',
    difficulty: 1,
    stem: 'Which machine learning paradigm is defined by training on paired input observations and human-verified target labels (x, y)?',
    options: [
      { id: 'a', text: 'Unsupervised Learning' },
      { id: 'b', text: 'Supervised Learning' },
      { id: 'c', text: 'Reinforcement Learning' },
      { id: 'd', text: 'Heuristic Search' }
    ],
    answer: ['b'],
    explanation: 'Supervised learning operates with an explicit answer key (target labels paired with input features).',
    noteRef: 'aiml-01-lo02',
    reviewed: false
  },
  {
    id: 'aiml-01-q06',
    loId: 'aiml-01-lo02',
    type: 'scenario',
    difficulty: 2,
    stem: 'You have a database of 100,000 retail customer purchase histories with no predefined categories or demographic labels. You want to discover natural shopping archetypes. Which approach should you apply?',
    options: [
      { id: 'a', text: 'Supervised logistic regression' },
      { id: 'b', text: 'Unsupervised clustering (e.g. k-means or DBSCAN)' },
      { id: 'c', text: 'Reinforcement Q-learning' },
      { id: 'd', text: 'Deterministic bubble sort' }
    ],
    answer: ['b'],
    explanation: 'Discovering inherent latent groups or clusters in unlabeled data is the textbook application of unsupervised learning.',
    noteRef: 'aiml-01-lo02',
    reviewed: false
  },
  {
    id: 'aiml-01-q07',
    loId: 'aiml-01-lo02',
    type: 'single',
    difficulty: 2,
    stem: 'How does Reinforcement Learning (RL) differ fundamentally from Supervised Learning?',
    options: [
      { id: 'a', text: 'RL requires labeled text datasets, while supervised learning uses images.' },
      { id: 'b', text: 'RL does not utilize neural networks under any circumstances.' },
      { id: 'c', text: 'RL learns through active environmental interactions and delayed scalar rewards, rather than fixed static pairs of inputs and correct answers.' },
      { id: 'd', text: 'RL cannot be optimized with gradient descent.' }
    ],
    answer: ['c'],
    explanation: 'In RL, an agent discovers high-performing policies through dynamic exploration and reward signals rather than an explicit static training dataset of correct answers.',
    noteRef: 'aiml-01-lo02',
    reviewed: false
  },
  {
    id: 'aiml-01-q08',
    loId: 'aiml-01-lo02',
    type: 'multi',
    difficulty: 3,
    stem: 'Which of the following are examples of Supervised Learning tasks? (Select all that apply)',
    options: [
      { id: 'a', text: 'Predicting patient re-admission (yes/no) based on labeled historical medical charts.' },
      { id: 'b', text: 'Estimating apartment rent prices based on square footage and neighborhood features.' },
      { id: 'c', text: 'Grouping documents into topics purely by word co-occurrence without category tags.' },
      { id: 'd', text: 'Classifying incoming support emails into pre-labeled department queues.' }
    ],
    answer: ['a', 'b', 'd'],
    explanation: 'Re-admission (binary classification), rent estimation (regression), and ticket classification all rely on labeled targets. Grouping documents without tags is unsupervised.',
    noteRef: 'aiml-01-lo02',
    reviewed: false
  },

  // LO 3 (4 questions)
  {
    id: 'aiml-01-q09',
    loId: 'aiml-01-lo03',
    type: 'single',
    difficulty: 1,
    stem: 'In the linear model formulation y_hat = w * x + b, what is the role of the bias parameter b?',
    options: [
      { id: 'a', text: 'It sets the numerical precision of the floating point registers.' },
      { id: 'b', text: 'It shifts the model prediction up or down independently of the input features x, allowing the line to intercept the y-axis away from the origin.' },
      { id: 'c', text: 'It penalizes the size of weights to prevent overfitting.' },
      { id: 'd', text: 'It measures the elapsed execution time of the forward pass.' }
    ],
    answer: ['b'],
    explanation: 'The bias term b provides an affine offset, decoupling the function from being forced through the origin (0, 0).',
    noteRef: 'aiml-01-lo03',
    reviewed: false
  },
  {
    id: 'aiml-01-q10',
    loId: 'aiml-01-lo03',
    type: 'single',
    difficulty: 2,
    stem: 'If all input features x in a linear model y_hat = w1*x1 + w2*x2 + b are equal to 0, what is the predicted output y_hat?',
    options: [
      { id: 'a', text: '0' },
      { id: 'b', text: 'Undefined (division by zero)' },
      { id: 'c', text: 'b' },
      { id: 'd', text: 'w1 + w2' }
    ],
    answer: ['c'],
    explanation: 'Since w1*(0) + w2*(0) = 0, y_hat reduces strictly to b.',
    noteRef: 'aiml-01-lo03',
    reviewed: false
  },
  {
    id: 'aiml-01-q11',
    loId: 'aiml-01-lo03',
    type: 'scenario',
    difficulty: 2,
    stem: 'A linear model predicts housing price: y_hat = 250*sqft + 15000*bedrooms + 50000. If an apartment has 1,000 sqft and 2 bedrooms, what is the predicted price?',
    options: [
      { id: 'a', text: '$280,000' },
      { id: 'b', text: '$330,000' },
      { id: 'c', text: '$350,000' },
      { id: 'd', text: '$410,000' }
    ],
    answer: ['b'],
    explanation: 'y_hat = 250*(1000) + 15000*(2) + 50000 = 250,000 + 30,000 + 50,000 = $330,000.',
    noteRef: 'aiml-01-lo03',
    reviewed: false
  },
  {
    id: 'aiml-01-q12',
    loId: 'aiml-01-lo03',
    type: 'single',
    difficulty: 3,
    stem: 'Why is vectorization (expressing model computations as matrix dot products w^T * x) crucial for modern machine learning implementations?',
    options: [
      { id: 'a', text: 'Vectorization allows SIMD and GPU hardware to compute thousands of parameter calculations in parallel rather than slow sequential loops.' },
      { id: 'b', text: 'Vectorization removes the need to compute loss functions.' },
      { id: 'c', text: 'Vectorization guarantees that models will never overfit.' },
      { id: 'd', text: 'Vectorization converts floating point math into integer string operations.' }
    ],
    answer: ['a'],
    explanation: 'Modern hardware (CPUs with AVX, GPUs, TPUs) is architected for massively parallel matrix operations. Vectorized operations run orders of magnitude faster than Python for-loops.',
    noteRef: 'aiml-01-lo03',
    reviewed: false
  },

  // LO 4 (4 questions)
  {
    id: 'aiml-01-q13',
    loId: 'aiml-01-lo04',
    type: 'single',
    difficulty: 1,
    stem: 'Why does the Mean Squared Error (MSE) loss function square the prediction residuals (y_hat - y)?',
    options: [
      { id: 'a', text: 'To ensure negative and positive errors do not cancel out, and to penalize large outliers quadratically.' },
      { id: 'b', text: 'Because square roots are unsupported in floating point processors.' },
      { id: 'c', text: 'To convert continuous numbers into discrete categorical classes.' },
      { id: 'd', text: 'To guarantee that the minimum loss is always greater than 100.' }
    ],
    answer: ['a'],
    explanation: 'Squaring guarantees non-negative loss values (preventing +5 and -5 from summing to 0) and punishes larger errors more aggressively than small ones.',
    noteRef: 'aiml-01-lo04',
    reviewed: false
  },
  {
    id: 'aiml-01-q14',
    loId: 'aiml-01-lo04',
    type: 'scenario',
    difficulty: 2,
    stem: 'A model predicts targets for 2 items: Actual targets are [10, 20]; predictions are [12, 16]. What is the Mean Squared Error (MSE)?',
    options: [
      { id: 'a', text: '6.0' },
      { id: 'b', text: '10.0' },
      { id: 'c', text: '16.0' },
      { id: 'd', text: '20.0' }
    ],
    answer: ['b'],
    explanation: 'Errors: (12 - 10) = 2 -> squared: 4. (16 - 20) = -4 -> squared: 16. Total sum = 20. Mean = 20 / 2 = 10.0.',
    noteRef: 'aiml-01-lo04',
    reviewed: false
  },
  {
    id: 'aiml-01-q15',
    loId: 'aiml-01-lo04',
    type: 'single',
    difficulty: 2,
    stem: 'What is the key difference between a "loss function" and a "cost function"?',
    options: [
      { id: 'a', text: 'A loss function is used for classification; a cost function is only for regression.' },
      { id: 'b', text: 'A loss function computes discrepancy for a single training sample; a cost function aggregates the loss across the entire dataset or batch.' },
      { id: 'c', text: 'A cost function is calculated in dollars; a loss function is calculated in seconds.' },
      { id: 'd', text: 'There is no difference; they are strictly interchangeable with no distinction in statistical literature.' }
    ],
    answer: ['b'],
    explanation: 'Conventionally, loss refers to error on a single instance L(y_hat, y), while cost J(theta) is the average loss across the whole training set.',
    noteRef: 'aiml-01-lo04',
    reviewed: false
  },
  {
    id: 'aiml-01-q16',
    loId: 'aiml-01-lo04',
    type: 'single',
    difficulty: 3,
    stem: 'Under what circumstances might Mean Absolute Error (MAE) be preferred over Mean Squared Error (MSE)?',
    options: [
      { id: 'a', text: 'When the dataset contains severe corrupt outliers that should not disproportionately dominate gradient updates.' },
      { id: 'b', text: 'When the target variables are binary 0 or 1 labels.' },
      { id: 'c', text: 'When training on GPU clusters without float32 support.' },
      { id: 'd', text: 'When learning rate must be set to 0.' }
    ],
    answer: ['a'],
    explanation: 'MSE squares residuals, so an extreme anomaly or bad data point exerts an enormous gradient pull. MAE grows linearly, making it far more robust to outliers.',
    noteRef: 'aiml-01-lo04',
    reviewed: false
  },

  // LO 5 (4 questions)
  {
    id: 'aiml-01-q17',
    loId: 'aiml-01-lo05',
    type: 'single',
    difficulty: 1,
    stem: 'In the Gradient Descent update formula w_new = w - alpha * (dJ/dw), why is the gradient term subtracted rather than added?',
    options: [
      { id: 'a', text: 'Because subtracting reduces the memory footprint of weights.' },
      { id: 'b', text: 'Because the gradient vector points in the direction of steepest increase; moving in the negative gradient direction decreases the loss.' },
      { id: 'c', text: 'Because the learning rate alpha is always a negative number.' },
      { id: 'd', text: 'To invert the sign of the input training data.' }
    ],
    answer: ['b'],
    explanation: 'The gradient vector points uphill (steepest ascent). To minimize cost, we must move in the opposite direction (steepest descent).',
    noteRef: 'aiml-01-lo05',
    reviewed: false
  },
  {
    id: 'aiml-01-q18',
    loId: 'aiml-01-lo05',
    type: 'scenario',
    difficulty: 2,
    stem: 'Current parameter w = 5.0, learning rate alpha = 0.1, and the computed gradient dJ/dw = +6.0. What is the updated parameter value after one gradient descent step?',
    options: [
      { id: 'a', text: '5.6' },
      { id: 'b', text: '4.4' },
      { id: 'c', text: '3.8' },
      { id: 'd', text: '0.6' }
    ],
    answer: ['b'],
    explanation: 'w_new = 5.0 - (0.1 * 6.0) = 5.0 - 0.6 = 4.4.',
    noteRef: 'aiml-01-lo05',
    reviewed: false
  },
  {
    id: 'aiml-01-q19',
    loId: 'aiml-01-lo05',
    type: 'single',
    difficulty: 2,
    stem: 'What symptom is most characteristic of an excessively large learning rate alpha during training?',
    options: [
      { id: 'a', text: 'The model training loss oscillates wildly or explodes towards infinity (divergence).' },
      { id: 'b', text: 'The loss function reaches absolute zero in the first epoch.' },
      { id: 'c', text: 'The computer runs out of physical disk storage.' },
      { id: 'd', text: 'The model weights become strictly frozen at zero.' }
    ],
    answer: ['a'],
    explanation: 'When alpha is too large, the parameter steps overshoot the valley bottom and bounce up opposite walls of the loss surface, leading to divergence.',
    noteRef: 'aiml-01-lo05',
    reviewed: false
  },
  {
    id: 'aiml-01-q20',
    loId: 'aiml-01-lo05',
    type: 'multi',
    difficulty: 3,
    stem: 'What occurs when Gradient Descent reaches a point on the loss surface where the gradient dJ/dw = 0? (Select all that apply)',
    options: [
      { id: 'a', text: 'The parameter updates halt because the update step (-alpha * 0) equals zero.' },
      { id: 'b', text: 'The model has arrived at a stationary point, which could be a global minimum, a local minimum, or a saddle point.' },
      { id: 'c', text: 'The learning rate alpha automatically multiplies by 10.' },
      { id: 'd', text: 'The loss function slope is completely flat at that coordinate.' }
    ],
    answer: ['a', 'b', 'd'],
    explanation: 'A zero gradient produces zero parameter change. The coordinate is a stationary point where the tangent slope is zero (minimum, maximum, or saddle point).',
    noteRef: 'aiml-01-lo05',
    reviewed: false
  },

  // LO 6 (4 questions)
  {
    id: 'aiml-01-q21',
    loId: 'aiml-01-lo06',
    type: 'single',
    difficulty: 1,
    stem: 'What defines the machine learning failure state known as "Overfitting"?',
    options: [
      { id: 'a', text: 'The model has too few parameters and cannot fit the training set.' },
      { id: 'b', text: 'The model achieves near-zero error on the training dataset but performs poorly on unseen test data by memorizing training noise.' },
      { id: 'c', text: 'The model runs on battery power instead of mains electricity.' },
      { id: 'd', text: 'The training dataset has more columns than rows.' }
    ],
    answer: ['b'],
    explanation: 'Overfitting occurs when high model capacity allows it to fit idiosyncrasies and noise in the training set rather than learning generalizable signals.',
    noteRef: 'aiml-01-lo06',
    reviewed: false
  },
  {
    id: 'aiml-01-q22',
    loId: 'aiml-01-lo06',
    type: 'scenario',
    difficulty: 2,
    stem: 'You fit a 15th-degree polynomial to 20 training data points. The training MSE is 0.001, but the test MSE is 842.1. What problem has occurred and what is the primary cause?',
    options: [
      { id: 'a', text: 'Underfitting caused by insufficient polynomial capacity.' },
      { id: 'b', text: 'Overfitting caused by excessive model capacity relative to the small quantity of training observations.' },
      { id: 'c', text: 'Gradient vanishing caused by negative learning rate.' },
      { id: 'd', text: 'Data leakage from test set to train set.' }
    ],
    answer: ['b'],
    explanation: 'A high-degree polynomial has immense degrees of freedom and will oscillate wildly between sample points to achieve zero training error, destroying generalization.',
    noteRef: 'aiml-01-lo06',
    reviewed: false
  },
  {
    id: 'aiml-01-q23',
    loId: 'aiml-01-lo06',
    type: 'single',
    difficulty: 2,
    stem: 'What is meant by an algorithm\'s "Inductive Bias"?',
    options: [
      { id: 'a', text: 'Prejudices introduced by human annotators in survey forms.' },
      { id: 'b', text: 'The set of explicit mathematical assumptions an algorithm uses to predict outputs on unseen inputs outside the training set.' },
      { id: 'c', text: 'The scalar bias term b added in the output layer.' },
      { id: 'd', text: 'The electrical interference caused by GPU power transformers.' }
    ],
    answer: ['b'],
    explanation: 'Inductive bias encompasses all prior assumptions built into the model architecture (e.g. linearity in linear regression, locality in CNNs) that allow generalization.',
    noteRef: 'aiml-01-lo06',
    reviewed: false
  },
  {
    id: 'aiml-01-q24',
    loId: 'aiml-01-lo06',
    type: 'multi',
    difficulty: 3,
    stem: 'Which of the following techniques directly mitigate Overfitting? (Select all that apply)',
    options: [
      { id: 'a', text: 'Gathering and annotating a substantially larger, diverse training dataset.' },
      { id: 'b', text: 'Applying regularization penalties (such as L2 weight decay) to constrain model weights.' },
      { id: 'c', text: 'Increasing model capacity by adding 10 additional dense layers.' },
      { id: 'd', text: 'Early stopping when validation loss stops improving.' }
    ],
    answer: ['a', 'b', 'd'],
    explanation: 'More data, weight decay regularization, and early stopping constrain memorization and improve generalization. Adding more layers increases capacity, risking worse overfitting.',
    noteRef: 'aiml-01-lo06',
    reviewed: false
  },

  // LO 7 (4 questions)
  {
    id: 'aiml-01-q25',
    loId: 'aiml-01-lo07',
    type: 'single',
    difficulty: 1,
    stem: 'Why is it critical to hold out a "Validation Set" separate from the Training Set and Test Set?',
    options: [
      { id: 'a', text: 'To allow hyperparameter tuning and model selection without contaminating or overfitting to the final test set.' },
      { id: 'b', text: 'Because Python requires all arrays to be divisible by three.' },
      { id: 'c', text: 'To speed up floating point arithmetic.' },
      { id: 'd', text: 'To provide a backup in case the hard drive fails.' }
    ],
    answer: ['a'],
    explanation: 'The validation set is used for tuning hyperparameters and early stopping. Keeping the test set untouched preserves it as an honest, unbiased final evaluation.',
    noteRef: 'aiml-01-lo07',
    reviewed: false
  },
  {
    id: 'aiml-01-q26',
    loId: 'aiml-01-lo07',
    type: 'scenario',
    difficulty: 2,
    stem: 'An engineer computes the mean and standard deviation across all 100,000 dataset rows to normalize features before splitting into train and test sets. Why is this considered a severe methodological bug?',
    options: [
      { id: 'a', text: 'It triggers division by zero in standard deviation.' },
      { id: 'b', text: 'It creates Data Leakage: statistical information from the test set leaked into the training representation, producing artificially optimistic performance.' },
      { id: 'c', text: 'Normalization can only be applied to output labels, never input features.' },
      { id: 'd', text: 'Standard deviation is incompatible with linear algebra.' }
    ],
    answer: ['b'],
    explanation: 'Data leakage occurs when any information outside the training set leaks into model preprocessing. Scalers must be fit strictly on the train split only.',
    noteRef: 'aiml-01-lo07',
    reviewed: false
  },
  {
    id: 'aiml-01-q27',
    loId: 'aiml-01-lo07',
    type: 'single',
    difficulty: 2,
    stem: 'How many times should the final holdout Test Set be evaluated during typical model development?',
    options: [
      { id: 'a', text: 'After every training epoch to monitor progress.' },
      { id: 'b', text: 'Whenever training loss drops below 0.1.' },
      { id: 'c', text: 'Strictly once (or a minimal number of times) at the very end of research to evaluate final performance.' },
      { id: 'd', text: 'Continuously in an infinite loop.' }
    ],
    answer: ['c'],
    explanation: 'Repeatedly querying the test set and adjusting model parameters or architecture based on its score causes human-in-the-loop overfitting to the test set.',
    noteRef: 'aiml-01-lo07',
    reviewed: false
  },
  {
    id: 'aiml-01-q28',
    loId: 'aiml-01-lo07',
    type: 'multi',
    difficulty: 3,
    stem: 'Which of the following practices ensure evaluation integrity? (Select all that apply)',
    options: [
      { id: 'a', text: 'Fitting scalers and imputation models solely on the training partition, then transforming val and test.' },
      { id: 'b', text: 'Ensuring temporal splits for time-series data so models never train on future data to predict the past.' },
      { id: 'c', text: 'Discarding test samples whenever the model misclassifies them.' },
      { id: 'd', text: 'Stratifying classification splits so rare class proportions match across train, val, and test.' }
    ],
    answer: ['a', 'b', 'd'],
    explanation: 'Transforming with train-only parameters, temporal sequencing for time-series, and stratified sampling maintain evaluation rigor. Discarding errors is scientific fraud.',
    noteRef: 'aiml-01-lo07',
    reviewed: false
  },

  // LO 8 (4 questions)
  {
    id: 'aiml-01-q29',
    loId: 'aiml-01-lo08',
    type: 'single',
    difficulty: 1,
    stem: 'Why can a single-layer linear perceptron with no non-linear activation function never solve the XOR (Exclusive OR) classification problem?',
    options: [
      { id: 'a', text: 'Because XOR inputs are boolean, and perceptrons only accept imaginary numbers.' },
      { id: 'b', text: 'Because XOR outputs are not linearly separable; no single straight decision boundary can isolate the positive outputs from negative outputs.' },
      { id: 'c', text: 'Because XOR requires quantum entanglement.' },
      { id: 'd', text: 'Because linear models cannot compute addition.' }
    ],
    answer: ['b'],
    explanation: 'In 2D space, the coordinates (0,1) and (1,0) have label 1, while (0,0) and (1,1) have label 0. It is geometrically impossible to separate them with a single straight line.',
    noteRef: 'aiml-01-lo08',
    reviewed: false
  },
  {
    id: 'aiml-01-q30',
    loId: 'aiml-01-lo08',
    type: 'single',
    difficulty: 2,
    stem: 'What mathematical collapse occurs if you stack 5 hidden layers with purely linear activation functions f(z) = z?',
    options: [
      { id: 'a', text: 'The weights explode to infinity on the first forward pass.' },
      { id: 'b', text: 'The composition of consecutive linear transformations is mathematically equivalent to a single linear transformation (W5 * ... * W1 * x = W_effective * x).' },
      { id: 'c', text: 'The network automatically becomes a convolutional neural network.' },
      { id: 'd', text: 'The gradients become non-differentiable.' }
    ],
    answer: ['b'],
    explanation: 'Matrix multiplication is associative and closed under composition. Without non-linear activations between layers, 100 linear layers collapse into 1 single matrix multiplication.',
    noteRef: 'aiml-01-lo08',
    reviewed: false
  },
  {
    id: 'aiml-01-q31',
    loId: 'aiml-01-lo08',
    type: 'scenario',
    difficulty: 2,
    stem: 'Given the Rectified Linear Unit (ReLU) activation function f(z) = max(0, z), what is f(-5.8)?',
    options: [
      { id: 'a', text: '-5.8' },
      { id: 'b', text: '0.0' },
      { id: 'c', text: '5.8' },
      { id: 'd', text: '1.0' }
    ],
    answer: ['b'],
    explanation: 'ReLU outputs 0 for any negative input and passes positive inputs unchanged. max(0, -5.8) = 0.0.',
    noteRef: 'aiml-01-lo08',
    reviewed: false
  },
  {
    id: 'aiml-01-q32',
    loId: 'aiml-01-lo08',
    type: 'multi',
    difficulty: 3,
    stem: 'Which of the following functions are valid non-linear activation functions that enable neural networks to represent complex decision boundaries? (Select all that apply)',
    options: [
      { id: 'a', text: 'ReLU: f(z) = max(0, z)' },
      { id: 'b', text: 'Identity function: f(z) = z' },
      { id: 'c', text: 'Sigmoid: f(z) = 1 / (1 + e^-z)' },
      { id: 'd', text: 'Hyperbolic Tangent: f(z) = tanh(z)' }
    ],
    answer: ['a', 'c', 'd'],
    explanation: 'ReLU, Sigmoid, and Tanh provide the essential non-linearities required for Universal Approximation. The identity function f(z) = z is linear.',
    noteRef: 'aiml-01-lo08',
    reviewed: false
  }
];

const aimlQuizDir = path.join(ROOT_DIR, 'content', 'ai-ml', 'what-ai-ml-really-are', 'quiz');
if (!fs.existsSync(aimlQuizDir)) fs.mkdirSync(aimlQuizDir, { recursive: true });
fs.writeFileSync(path.join(aimlQuizDir, 'bank.json'), JSON.stringify(aimlQuizQuestions, null, 2), 'utf-8');
console.log(`✓ AI & ML: 8 notes written, ${aimlQuizQuestions.length} bank questions created.`);
