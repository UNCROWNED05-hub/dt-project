/**
 * scripts/generate-aiml-batch1.mjs
 *
 * Generates Batch 1 for Course 1 (AI & ML):
 * - Chapter 2: python-numpy-and-pandas (ai-02)
 * - Chapter 3: math-you-actually-need (ai-03)
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

  // Save objectives
  fs.writeFileSync(path.join(chapterDir, 'objectives.json'), JSON.stringify(objData, null, 2), 'utf-8');

  // Rotate single/scenario answers evenly across a, b, c, d
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
// CHAPTER 2: Python, NumPy & Vectorization (ai-02)
// ============================================================================
console.log('Generating ai-02: python-numpy-and-pandas...');

const ai02Objectives = {
  version: 1,
  chapterId: "ai-02",
  objectives: [
    {
      id: "aiml-02-lo01",
      order: 1,
      title: "Construct and manipulate multi-dimensional NumPy arrays using shape, dtype, and strides",
      bloom: "apply",
      tier: "core",
      mustHave: true,
      keywords: ["ndarray", "shape", "dtype", "strides", "memory layout", "C-order"],
      aliases: ["numpy array creation", "tensor memory layout"],
      prerequisites: [],
      estMinutes: 10
    },
    {
      id: "aiml-02-lo02",
      order: 2,
      title: "Apply NumPy array indexing, slicing, and boolean masking to filter tensor data",
      bloom: "apply",
      tier: "core",
      mustHave: true,
      keywords: ["boolean masking", "fancy indexing", "slicing", "view vs copy", "sub-array"],
      aliases: ["tensor slicing", "conditional array indexing"],
      prerequisites: ["aiml-02-lo01"],
      estMinutes: 12
    },
    {
      id: "aiml-02-lo03",
      order: 3,
      title: "Calculate element-wise array operations using NumPy broadcasting semantics and dimension rules",
      bloom: "apply",
      tier: "core",
      mustHave: true,
      keywords: ["broadcasting", "trailing dimensions", "dimension expansion", "newaxis", "element-wise"],
      aliases: ["numpy broadcasting", "shape alignment"],
      prerequisites: ["aiml-02-lo01"],
      estMinutes: 12
    },
    {
      id: "aiml-02-lo04",
      order: 4,
      title: "Vectorize numerical algorithms to eliminate Python interpreted loops and accelerate execution",
      bloom: "analyze",
      tier: "core",
      mustHave: true,
      keywords: ["vectorization", "SIMD", "loop elimination", "C extension", "throughput"],
      aliases: ["array vectorization", "loop replacement"],
      prerequisites: ["aiml-02-lo01", "aiml-02-lo03"],
      estMinutes: 10
    },
    {
      id: "aiml-02-lo05",
      order: 5,
      title: "Structure tabular datasets using Pandas Series and DataFrame schemas",
      bloom: "understand",
      tier: "core",
      mustHave: false,
      keywords: ["pandas", "DataFrame", "Series", "index", "column types", "dtypes"],
      aliases: ["tabular data structures", "pandas schema"],
      prerequisites: ["aiml-02-lo01"],
      estMinutes: 8
    },
    {
      id: "aiml-02-lo06",
      order: 6,
      title: "Filter, project, and transform tabular records using Pandas loc, iloc, and query expressions",
      bloom: "apply",
      tier: "core",
      mustHave: false,
      keywords: ["loc", "iloc", "query", "boolean indexing", "label selection", "column assignment"],
      aliases: ["pandas filtering", "data selection"],
      prerequisites: ["aiml-02-lo05"],
      estMinutes: 10
    },
    {
      id: "aiml-02-lo07",
      order: 7,
      title: "Aggregate and reshape relational data using Pandas groupby, pivot tables, and merge operations",
      bloom: "apply",
      tier: "core",
      mustHave: false,
      keywords: ["groupby", "aggregation", "merge", "join", "pivot table", "split-apply-combine"],
      aliases: ["data aggregation", "pandas joins"],
      prerequisites: ["aiml-02-lo05", "aiml-02-lo06"],
      estMinutes: 12
    },
    {
      id: "aiml-02-lo08",
      order: 8,
      title: "Parse delimited CSV files handling missing delimiters, headers, and type inference",
      bloom: "apply",
      tier: "core",
      mustHave: false,
      keywords: ["read_csv", "delimiter", "parse_dates", "na_values", "chunksize", "csv parsing"],
      aliases: ["csv ingestion", "pandas file io"],
      prerequisites: ["aiml-02-lo05"],
      estMinutes: 10
    },
    {
      id: "aiml-02-lo09",
      order: 9,
      title: "Plot numerical distributions and feature correlations using Matplotlib and Seaborn interfaces",
      bloom: "apply",
      tier: "extension",
      mustHave: false,
      keywords: ["matplotlib", "seaborn", "histogram", "scatter plot", "heatmap", "correlation matrix"],
      aliases: ["data visualization", "exploratory plotting"],
      prerequisites: ["aiml-02-lo05"],
      estMinutes: 12
    }
  ]
};

// Notes for ai-02
writeNoteBlock('ai-ml', 'python-numpy-and-pandas', 'aiml-02-lo01',
  'NumPy Array Architecture: Shape, Dtype, and Strides',
  `At the foundation of Python scientific computing is the NumPy ndarray. Unlike standard Python lists—which store fragmented pointers to scattered object wrappers—an ndarray represents a contiguous block of homogeneous memory managed directly by compiled C code. 

The structure of an ndarray is defined by three core attributes:
1. **Dtype**: The uniform data type (such as float32, float64, or int64) that determines how many raw bytes represent each individual number.
2. **Shape**: A tuple of integers describing the size along each dimension (e.g., (100, 32) represents 100 rows by 32 columns).
3. **Strides**: A tuple indicating how many bytes must be jumped in physical memory to advance one index along each respective axis. In a standard row-major (C-order) float64 array of shape (3, 4), the stride tuple is (32, 8).`,
  `Inspecting raw array memory layout:
\`\`\`python
# numpy==1.26.4
import numpy as np

arr = np.zeros((3, 4), dtype=np.float64)
print(f"Shape: {arr.shape}")       # (3, 4)
print(f"Dtype: {arr.dtype}")       # float64 (8 bytes per item)
print(f"Strides: {arr.strides}")   # (32, 8) -> 4*8=32 bytes per row
print(f"Memory size: {arr.nbytes} bytes") # 3*4*8 = 96 bytes
\`\`\``,
  `Assuming Python lists and NumPy arrays offer comparable performance. Python list lookups involve dynamic pointer dereferencing and reference count checks on every single item, introducing 10x-100x overhead.`,
  `If an array of shape (4, 5) has dtype float32 (4 bytes per element), what is its C-order stride tuple? ((20, 4), because advancing one row requires skipping 5 elements * 4 bytes = 20 bytes).`
);

writeNoteBlock('ai-ml', 'python-numpy-and-pandas', 'aiml-02-lo02',
  'Array Slicing, Views, and Boolean Masking',
  `Extracting subsets of tensors is a continuous requirement in machine learning pipelines. NumPy provides two primary extraction paradigms: basic slicing and advanced indexing.

Basic slicing using colon notation (e.g., \`arr[1:5, :]\`) creates a **view** rather than a copy. A view shares the identical physical memory buffer as the parent array, merely modifying the shape, offset, and strides. Modifying elements inside a sliced view directly mutates the original array in place, guaranteeing zero memory allocation overhead.

Conversely, advanced indexing—such as integer arrays or boolean masking (e.g., \`arr[arr > 0.5]\`)—constructs an independent **copy** of the selected elements. Boolean masks must match the dimensions of the indexed axes; each true value extracts the corresponding scalar into a newly allocated output tensor.`,
  `Demonstrating views vs copies in array operations:
\`\`\`python
# numpy==1.26.4
import numpy as np

data = np.array([[10, 20, 30], [40, 50, 60]])

# 1. Basic slice creates a VIEW
view_row = data[0, :]
view_row[0] = 999
print(data[0, 0]) # 999 -> Parent mutated!

# 2. Boolean mask creates an independent COPY
mask = data > 50
filtered = data[mask]
filtered[0] = -1
print(data[1, 1]) # 50 -> Parent remains untouched
\`\`\``,
  `Modifying a sliced sub-array and unexpectedly corrupting the original master training dataset because basic slicing does not duplicate underlying buffer memory.`,
  `Does \`subset = tensor[:, 0:10]\` allocate new memory for array elements? (No, standard colon slicing returns an in-memory view with modified strides, not a data copy).`
);

writeNoteBlock('ai-ml', 'python-numpy-and-pandas', 'aiml-02-lo03',
  'NumPy Broadcasting Semantics and Dimension Alignment',
  `Broadcasting is NumPy's mechanism for executing element-wise operations between tensors of differing shapes without allocating unnecessary memory duplications. Instead of explicitly tiling smaller arrays to match larger matrices, broadcasting computes arithmetic virtually by setting internal strides to zero along broadcasted axes.

To determine compatibility, NumPy compares tensor dimensions element-wise from right to left (trailing dimensions):
1. Two dimensions are compatible if they are equal, or
2. One of the dimensions is exactly 1.

When a dimension is 1, it is conceptually stretched to match the larger size. If a tensor has fewer dimensions than another, its shape is prepended with 1s on the left until dimensions match. If trailing dimensions conflict (e.g., 3 vs 4), NumPy raises a \`ValueError: operands could not be broadcast together\`.`,
  `Broadcasting a feature bias vector across a mini-batch matrix:
\`\`\`python
# numpy==1.26.4
import numpy as np

# Batch of 3 samples with 2 features: shape (3, 2)
X = np.array([[1.0, 2.0], [3.0, 4.0], [5.0, 6.0]])

# 1D Bias vector: shape (2,) -> prepended to (1, 2) -> broadcasted to (3, 2)
bias = np.array([0.5, -0.5])

# Element-wise addition across all 3 rows simultaneously
output = X + bias
print(output)
# [[1.5, 1.5],
#  [3.5, 3.5],
#  [5.5, 5.5]]
\`\`\``,
  `Attempting to broadcast shapes (4, 3) and (4,) directly. Because broadcasting aligns trailing dimensions from right to left, 3 and 4 conflict. You must explicitly reshape the second array to (4, 1).`,
  `Can an array of shape (8, 1, 64) broadcast with an array of shape (8, 16, 1)? (Yes, yielding an output shape of (8, 16, 64) because all dimensions are equal or 1).`
);

writeNoteBlock('ai-ml', 'python-numpy-and-pandas', 'aiml-02-lo04',
  'Vectorization vs Interpreted Python Loops',
  `Standard Python executes bytecode sequentially through the CPython interpreter loop. In each loop iteration, Python must evaluate variable types, resolve dynamically bound methods, and manage garbage collection reference counters. When computing millions of mathematical operations across training records, this dynamic interpretation overhead cripples execution speed.

Vectorization delegates array operations to compiled, contiguous C or Fortran routines. Under the hood, modern CPU architectures provide Single Instruction, Multiple Data (SIMD) instruction sets (such as AVX-512 or ARM NEON) that process 4, 8, or 16 floating-point values in a single hardware cycle. By expressing algorithms as high-level array operations (e.g., dot products, matrix multiplications, and universal functions), code runs at bare-metal hardware speeds.`,
  `Benchmarking loop vs vectorized dot product:
\`\`\`python
# numpy==1.26.4
import numpy as np
import time

a = np.random.randn(100_000)
b = np.random.randn(100_000)

# 1. Python loop
start = time.perf_counter()
loop_sum = sum(x * y for x, y in zip(a, b))
loop_time = time.perf_counter() - start

# 2. Vectorized NumPy operation
start = time.perf_counter()
vec_sum = a @ b
vec_time = time.perf_counter() - start

print(f"Speedup: {loop_time / vec_time:.1f}x faster with vectorization")
# Typically 50x to 150x speedup
\`\`\``,
  `Writing explicit nested for-loops across matrix rows and columns when implementing cost functions or transformations, sacrificing native SIMD parallelism.`,
  `What CPU architectural feature enables vectorized NumPy operations to calculate multiple float multiplications in a single instruction cycle? (SIMD: Single Instruction, Multiple Data registers).`
);

writeNoteBlock('ai-ml', 'python-numpy-and-pandas', 'aiml-02-lo05',
  'Pandas Tabular Schemas: Series and DataFrames',
  `While NumPy provides raw multidimensional numeric tensors, real-world data pipelines require heterogeneous column types, named features, and relational indexing. The Pandas library introduces two primary abstractions designed specifically for structured tabular data: the Series and the DataFrame.

A **Series** is a one-dimensional labeled array capable of holding any data type (integers, strings, floats, Python objects). It pairs a sequence of data values with an explicit relational index. 

A **DataFrame** is a two-dimensional tabular data structure composed of an ordered collection of columns, where each column is an individual Series sharing a common row Index. Under the hood, Pandas groups columns of identical primitive data types into contiguous NumPy arrays (via the BlockManager or modern PyArrow backends), delivering rapid vectorized column operations alongside intuitive dictionary-like access.`,
  `Constructing and inspecting a Pandas DataFrame:
\`\`\`python
# pandas==2.2.2
import pandas as pd

data = {
    "age": [25, 34, 45],
    "income": [65000.0, 92000.0, 120000.0],
    "churned": [False, True, False]
}

df = pd.DataFrame(data, index=["cust_1", "cust_2", "cust_3"])
print(df.dtypes)
# age          int64
# income     float64
# churned       bool
print(df.shape) # (3, 3)
\`\`\``,
  `Treating a DataFrame column as a standard Python dictionary instead of a typed Series, causing performance bottlenecks and broken vector operations.`,
  `What structural component allows a Pandas DataFrame to align records across multiple disparate columns when performing relational joins? (The common shared Index).`
);

writeNoteBlock('ai-ml', 'python-numpy-and-pandas', 'aiml-02-lo06',
  'Tabular Selection and Filtering: loc, iloc, and Query',
  `Extracting specific observations and features from a DataFrame requires deterministic indexers. Pandas provides two primary accessors: \`.loc\` for label-based selection and \`.iloc\` for integer position-based selection.

- **\`df.loc[row_labels, col_labels]\`**: Selects data using explicit index names and column header strings. Slicing with \`.loc\` is inclusive of both endpoints (\`'a':'c'\` includes \`'c'\`).
- **\`df.iloc[row_positions, col_positions]\`**: Selects data using 0-based integer coordinates. Slicing with \`.iloc\` follows standard Python half-open semantics (\`0:3\` includes indices 0, 1, and 2, omitting 3).

For conditional filtering, boolean expressions can be passed directly into brackets or evaluated concisely using \`.query()\`. Query strings parse expressions against DataFrame column namespaces, minimizing temporary object allocation.`,
  `Demonstrating label vs positional selection and query filtering:
\`\`\`python
# pandas==2.2.2
import pandas as pd

df = pd.DataFrame({
    "department": ["Eng", "Sales", "Eng", "HR"],
    "salary": [110000, 75000, 130000, 65000]
}, index=["e1", "e2", "e3", "e4"])

# 1. Label-based selection (.loc)
print(df.loc["e1":"e2", ["salary"]]) # Inclusive of e2

# 2. Integer position selection (.iloc)
print(df.iloc[0:2, 1]) # Excludes index 2

# 3. Query expression
high_earners = df.query("salary > 100000 and department == 'Eng'")
print(high_earners)
\`\`\``,
  `Confusing \`.loc\` and \`.iloc\` on DataFrames that have integer-based indices, leading to off-by-one errors or looking up index labels rather than positional rows.`,
  `If an index has string labels \`['a', 'b', 'c', 'd']\`, does \`df.loc['a':'c']\` return 2 rows or 3 rows? (3 rows: label-based \`.loc\` slicing is inclusive of both endpoints).`
);

writeNoteBlock('ai-ml', 'python-numpy-and-pandas', 'aiml-02-lo07',
  'Data Aggregation and Relational Operations: GroupBy and Merges',
  `Data transformation in ML workflows frequently involves grouping categorical cohorts and joining relational tables. Pandas implements the classic **Split-Apply-Combine** pattern through \`.groupby()\`.

1. **Split**: The dataset is partitioned into logical buckets based on distinct key values in one or more grouping columns.
2. **Apply**: A summary function (such as mean, sum, std, or custom aggregations) is applied independently across each subgroup.
3. **Combine**: The aggregated metrics are assembled into a single cohesive output DataFrame.

For multi-table pipelines, \`pd.merge()\` executes SQL-style relational joins (inner, left, right, outer) along shared key columns, handling cardinality variations and matching keys automatically.`,
  `Performing cohort aggregation and relational merging:
\`\`\`python
# pandas==2.2.2
import pandas as pd

# Employees table
emp = pd.DataFrame({
    "emp_id": [101, 102, 103, 104],
    "dept_id": ["D1", "D2", "D1", "D2"],
    "performance": [4.2, 3.8, 4.9, 4.1]
})

# Departments table
depts = pd.DataFrame({
    "dept_id": ["D1", "D2"],
    "dept_name": ["Engineering", "Product"]
})

# 1. Relational Merge (Inner Join)
merged = pd.merge(emp, depts, on="dept_id")

# 2. GroupBy aggregation
dept_summary = merged.groupby("dept_name")["performance"].agg(["mean", "count"])
print(dept_summary)
\`\`\``,
  `Executing iterative row-by-row loops over unique categories instead of vectorized \`.groupby()\`, degrading performance by orders of magnitude on large tables.`,
  `In the Split-Apply-Combine pattern, what stage computes statistical metrics like mean or standard deviation on individual partitions? (The Apply stage).`
);

writeNoteBlock('ai-ml', 'python-numpy-and-pandas', 'aiml-02-lo08',
  'Robust CSV Ingestion: Delimiters, Headers, and Chunking',
  `The comma-separated values (CSV) format is the standard interchange representation for raw tabular datasets. However, real-world CSV files frequently exhibit parsing challenges: non-standard delimiters (tabs, pipes, semicolons), missing headers, malformed null strings, and files exceeding available system RAM.

The \`pd.read_csv()\` function provides extensive parameterization to handle these irregularities:
- \`sep\` / \`delimiter\`: Regex-compatible delimiter character.
- \`na_values\`: List of strings to interpret as missing NaN values (e.g., \`["NA", "?", "null", ""]\`).
- \`parse_dates\`: Automatically coerces ISO strings into datetime64 objects.
- \`chunksize\`: Ingests multi-gigabyte datasets incrementally as an iterator of manageable sub-DataFrames, preventing out-of-memory crashes.`,
  `Parsing a custom CSV with missing values and chunked processing:
\`\`\`python
# pandas==2.2.2
import pandas as pd
import io

csv_data = """id;score;status
101;98.5;pass
102;?;fail
103;84.0;pass
"""

# Parsing semicolon delimiter and treating '?' as null NaN
df = pd.read_csv(io.StringIO(csv_data), sep=";", na_values=["?"])
print(f"Missing count:\\n{df.isna().sum()}")

# Chunked processing for massive files:
# for chunk in pd.read_csv('huge_file.csv', chunksize=10_000):
#     process_features(chunk)
\`\`\``,
  `Attempting to load a 10GB CSV file directly with standard \`pd.read_csv('file.csv')\` on a machine with 8GB RAM, causing an unrecoverable Operating System Out-Of-Memory (OOM) kill.`,
  `Which \`pd.read_csv\` parameter enables streaming large CSV files in manageable mini-batches rather than loading the full dataset at once? (\`chunksize\`).`
);

writeNoteBlock('ai-ml', 'python-numpy-and-pandas', 'aiml-02-lo09',
  'Exploratory Data Visualization with Matplotlib and Seaborn',
  `Visual inspection is an indispensable phase of exploratory data analysis (EDA). Plotting distributions reveals skewness, multimodality, and extreme outliers that summary statistics alone conceal.

**Matplotlib** provides the underlying object-oriented rendering canvas (\`Figure\` and \`Axes\`), giving complete procedural control over coordinates, ticks, and layouts. **Seaborn** sits atop Matplotlib, providing declarative high-level statistical plotting primitives tailored directly to Pandas DataFrames. Essential exploratory visualizations include:
1. **Histograms & KDEs**: Display continuous feature distributions and probability densities.
2. **Scatter Plots**: Reveal bivariate relationships, clustering patterns, and non-linear associations.
3. **Heatmaps**: Display correlation matrices ($r \in [-1, 1]$) across feature dimensions to diagnose collinearity.`,
  `Generating an exploratory correlation heatmap:
\`\`\`python
# matplotlib==3.8.4, seaborn==0.13.2
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

df = pd.DataFrame(np.random.randn(100, 4), columns=["x1", "x2", "x3", "x4"])
corr = df.corr()

fig, ax = plt.subplots(figsize=(6, 5))
sns.heatmap(corr, annot=True, cmap="coolwarm", vmin=-1, vmax=1, ax=ax)
ax.set_title("Feature Correlation Matrix")
# plt.show() # In interactive environments
plt.close(fig)
\`\`\``,
  `Relying exclusively on aggregate summary metrics (like mean and variance) without visualizing distributions, missing hidden patterns like Anscombe's quartet.`,
  `What visualization is best suited to rapidly inspect pairwise Pearson correlation coefficients across dozens of continuous features simultaneously? (A correlation heatmap).`
);

// Question Bank for ai-02 (36 questions: 4 per core LO + 2 for ext + 2 numeric)
const ai02Bank = [
  // LO01
  {
    id: "aiml-02-q01",
    loId: "aiml-02-lo01",
    type: "single",
    difficulty: 1,
    stem: "What physical memory characteristic distinguishes a NumPy ndarray from a native Python list?",
    options: [
      { id: "a", text: "NumPy arrays are stored in non-volatile SSD flash memory rather than RAM." },
      { id: "b", text: "NumPy arrays occupy a contiguous block of homogeneous memory, whereas Python lists store scattered pointers to individual object wrappers." },
      { id: "c", text: "Python lists require GPU hardware, while NumPy arrays only execute on CPUs." },
      { id: "d", text: "NumPy arrays can only store positive integer numbers." }
    ],
    answer: ["b"],
    explanation: "NumPy allocates a contiguous memory buffer of uniform primitive types, enabling efficient cache locality and C-level vectorized execution.",
    noteRef: "aiml-02-lo01",
    reviewed: false
  },
  {
    id: "aiml-02-q02",
    loId: "aiml-02-lo01",
    type: "single",
    difficulty: 2,
    stem: "In NumPy array internals, what do 'strides' represent?",
    options: [
      { id: "a", text: "The maximum iteration depth permitted in recursive functions." },
      { id: "b", text: "The total number of CPU clock cycles needed to evaluate a dot product." },
      { id: "c", text: "The byte step offsets required to jump in memory to reach the next element along each array dimension." },
      { id: "d", text: "The compression ratio applied to serialized float tensors." }
    ],
    answer: ["c"],
    explanation: "Strides are a tuple of byte offsets indicating how far to jump in physical memory to advance one index along each respective dimension.",
    noteRef: "aiml-02-lo01",
    reviewed: false
  },
  {
    id: "aiml-02-q03",
    loId: "aiml-02-lo01",
    type: "scenario",
    difficulty: 2,
    stem: "You allocate a float64 array of shape (5, 4) in standard C-order (row-major). What is its strides tuple?",
    options: [
      { id: "a", text: "(32, 8), because each float64 is 8 bytes, so moving 1 row requires jumping 4 elements * 8 bytes = 32 bytes." },
      { id: "b", text: "(40, 8), because each float64 is 8 bytes and there are 5 rows." },
      { id: "c", text: "(8, 32), because column strides always take precedence in row-major layout." },
      { id: "d", text: "(4, 8), representing raw element counts." }
    ],
    answer: ["a"],
    explanation: "In C-order, float64 elements are 8 bytes. Advancing one row skips 4 column elements: 4 * 8 = 32 bytes. Advancing one column skips 8 bytes.",
    noteRef: "aiml-02-lo01",
    verify: "(4 * 8 === 32)",
    reviewed: false
  },
  {
    id: "aiml-02-q04",
    loId: "aiml-02-lo01",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following attributes are fundamental metadata properties that govern a NumPy ndarray?",
    options: [
      { id: "a", text: "shape (tuple of dimension lengths)" },
      { id: "b", text: "dtype (data type descriptor)" },
      { id: "c", text: "strides (byte step offsets per axis)" },
      { id: "d", text: "bfloat16_compilation_target (mandatory CUDA compiler flag)" }
    ],
    answer: ["a", "b", "c"],
    explanation: "An ndarray's memory view is dictated by its shape, data type (dtype), and stride offsets across dimensions.",
    noteRef: "aiml-02-lo01",
    reviewed: false
  },

  // LO02
  {
    id: "aiml-02-q05",
    loId: "aiml-02-lo02",
    type: "single",
    difficulty: 1,
    stem: "What is the key functional difference between slicing an array with `arr[0:5]` and indexing it with `arr[mask]`?",
    options: [
      { id: "a", text: "Basic colon slicing returns a zero-copy memory view, whereas boolean masking creates an independent allocated copy." },
      { id: "b", text: "Boolean masking executes faster than colon slicing." },
      { id: "c", text: "Colon slicing modifies the array dtype, while masking preserves it." },
      { id: "d", text: "Masking can only select positive integers." }
    ],
    answer: ["a"],
    explanation: "Standard slicing creates a view that references the original buffer without copying data. Advanced indexing (such as boolean masking) allocates a fresh copy.",
    noteRef: "aiml-02-lo02",
    reviewed: false
  },
  {
    id: "aiml-02-q06",
    loId: "aiml-02-lo02",
    type: "single",
    difficulty: 2,
    stem: "If you modify an element in a view generated via `sub = matrix[:, 0:2]`, what happens to `matrix`?",
    options: [
      { id: "a", text: "Nothing; views are strictly isolated copies." },
      { id: "b", text: "The corresponding element in `matrix` is also mutated in place." },
      { id: "c", text: "Python raises a ReadOnlyMemoryError." },
      { id: "d", text: "The entire matrix resets to all zeros." }
    ],
    answer: ["b"],
    explanation: "Because views share the exact same underlying memory buffer, modifying a view directly updates the parent array.",
    noteRef: "aiml-02-lo02",
    reviewed: false
  },
  {
    id: "aiml-02-q07",
    loId: "aiml-02-lo02",
    type: "scenario",
    difficulty: 2,
    stem: "You have a 1D array `values = np.array([12, -4, 25, 0, -8, 19])`. Which expression extracts only strictly positive values?",
    options: [
      { id: "a", text: "values[values > 0]" },
      { id: "b", text: "values.filter(positive=True)" },
      { id: "c", text: "values[0:values.max()]" },
      { id: "d", text: "values.where(values == 0)" }
    ],
    answer: ["a"],
    explanation: "Passing the boolean condition `values > 0` as a mask extracts all elements where the condition evaluates to True.",
    noteRef: "aiml-02-lo02",
    reviewed: false
  },
  {
    id: "aiml-02-q08",
    loId: "aiml-02-lo02",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following NumPy indexing operations produce an independent COPY rather than a VIEW?",
    options: [
      { id: "a", text: "arr[arr > 10] (boolean masking)" },
      { id: "b", text: "arr[[0, 2, 4]] (fancy integer list indexing)" },
      { id: "c", text: "arr[1:5, :] (basic colon slicing)" },
      { id: "d", text: "arr[::2] (strided step slicing)" }
    ],
    answer: ["a", "b"],
    explanation: "Boolean masks and integer index arrays trigger advanced indexing, which creates newly allocated copies. Colon and step slices produce views.",
    noteRef: "aiml-02-lo02",
    reviewed: false
  },

  // LO03
  {
    id: "aiml-02-q09",
    loId: "aiml-02-lo03",
    type: "single",
    difficulty: 1,
    stem: "How does NumPy evaluate whether two arrays of different shapes can be broadcast together?",
    options: [
      { id: "a", text: "It compares dimension lengths from right to left, requiring dimensions to be equal or one of them to be 1." },
      { id: "b", text: "Both arrays must contain the exact same total number of elements." },
      { id: "c", text: "Broadcasting only works if both arrays are 1D vectors." },
      { id: "d", text: "It compares dimension lengths from left to right, ignoring all odd numbers." }
    ],
    answer: ["a"],
    explanation: "Broadcasting rules compare trailing dimensions from right to left. Two dimensions are compatible if they are equal or if one is 1.",
    noteRef: "aiml-02-lo03",
    reviewed: false
  },
  {
    id: "aiml-02-q10",
    loId: "aiml-02-lo03",
    type: "single",
    difficulty: 2,
    stem: "What is the resulting shape when an array of shape (4, 1, 8) is added to an array of shape (1, 6, 8)?",
    options: [
      { id: "a", text: "(4, 6, 8)" },
      { id: "b", text: "(4, 6, 16)" },
      { id: "c", text: "(24, 8)" },
      { id: "d", text: "ValueError (incompatible shapes)" }
    ],
    answer: ["a"],
    explanation: "Comparing dimensions from right to left: 8 and 8 match; 1 and 6 expand to 6; 4 and 1 expand to 4. Result is (4, 6, 8).",
    noteRef: "aiml-02-lo03",
    reviewed: false
  },
  {
    id: "aiml-02-q11",
    loId: "aiml-02-lo03",
    type: "scenario",
    difficulty: 2,
    stem: "You have a feature matrix `X` of shape (100, 5) and want to subtract a feature mean vector `mu` of shape (5,). Will `X - mu` broadcast cleanly?",
    options: [
      { id: "a", text: "Yes, because the trailing dimension of `mu` (5) matches the trailing dimension of `X` (5)." },
      { id: "b", text: "No, `mu` must be explicitly reshaped to (100, 5) before arithmetic is allowed." },
      { id: "c", text: "No, subtraction cannot be broadcast in NumPy; only addition is supported." },
      { id: "d", text: "Yes, but only if all values in `mu` are integers." }
    ],
    answer: ["a"],
    explanation: "Shape (5,) is treated as (1, 5) when aligned against (100, 5), allowing clean broadcast subtraction across all 100 rows.",
    noteRef: "aiml-02-lo03",
    reviewed: false
  },
  {
    id: "aiml-02-q12",
    loId: "aiml-02-lo03",
    type: "numeric",
    difficulty: 2,
    stem: "An array of shape (3, 1) containing values [[2], [4], [6]] is multiplied by an array of shape (1, 2) containing [[10, 20]]. What is the sum of all elements in the resulting broadcasted array?",
    options: [
      { id: "a", text: "120" },
      { id: "b", text: "360" },
      { id: "c", text: "720" },
      { id: "d", text: "180" }
    ],
    answer: ["b"],
    explanation: "The broadcasted matrix is [[20, 40], [40, 80], [60, 120]]. Sum = 20 + 40 + 40 + 80 + 60 + 120 = 360.",
    noteRef: "aiml-02-lo03",
    verify: "(20 + 40 + 40 + 80 + 60 + 120 === 360)",
    reviewed: false
  },

  // LO04
  {
    id: "aiml-02-q13",
    loId: "aiml-02-lo04",
    type: "single",
    difficulty: 1,
    stem: "Why does vectorizing code with NumPy typically run 50x-100x faster than writing standard Python for-loops?",
    options: [
      { id: "a", text: "Because NumPy replaces interpreted dynamic type dispatch with compiled C loops and CPU SIMD parallel instructions." },
      { id: "b", text: "Because NumPy compresses integers into 2-bit binary codes." },
      { id: "c", text: "Because Python for-loops automatically pause for 1 millisecond on every iteration." },
      { id: "d", text: "Because NumPy executes over cloud network clusters." }
    ],
    answer: ["a"],
    explanation: "Vectorized operations bypass CPython interpreter overhead and leverage contiguous memory with hardware SIMD vector registers.",
    noteRef: "aiml-02-lo04",
    reviewed: false
  },
  {
    id: "aiml-02-q14",
    loId: "aiml-02-lo04",
    type: "single",
    difficulty: 2,
    stem: "What CPU hardware capability is directly harnessed when executing vectorized array multiplications in NumPy?",
    options: [
      { id: "a", text: "SIMD (Single Instruction, Multiple Data) execution units like AVX or NEON." },
      { id: "b", text: "Quantum register superposition." },
      { id: "c", text: "Hard disk write-caching buffers." },
      { id: "d", text: "Dynamic BIOS clock multipliers." }
    ],
    answer: ["a"],
    explanation: "SIMD instructions allow modern CPU cores to perform arithmetic across multiple vector elements in a single clock cycle.",
    noteRef: "aiml-02-lo04",
    reviewed: false
  },
  {
    id: "aiml-02-q15",
    loId: "aiml-02-lo04",
    type: "scenario",
    difficulty: 2,
    stem: "An engineer writes a loop `for i in range(len(X)): diffs[i] = X[i] - y[i]`. How should this calculation be refactored for optimal speed?",
    options: [
      { id: "a", text: "diffs = X - y" },
      { id: "b", text: "diffs = [X[i] - y[i] for i in range(len(X))]" },
      { id: "c", text: "diffs = list(map(lambda a, b: a - b, X, y))" },
      { id: "d", text: "diffs = np.vectorize(lambda a, b: a - b)(X, y)" }
    ],
    answer: ["a"],
    explanation: "Native array subtraction `X - y` delegates execution entirely to compiled C SIMD routines, avoiding all Python function call overhead.",
    noteRef: "aiml-02-lo04",
    reviewed: false
  },
  {
    id: "aiml-02-q16",
    loId: "aiml-02-lo04",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following factors contribute to performance degradation in naive Python iterative mathematical loops?",
    options: [
      { id: "a", text: "Dynamic type checking on every iteration step" },
      { id: "b", text: "Repeated reference counting and memory pointer lookups" },
      { id: "c", text: "Lack of contiguous memory SIMD hardware vectorization" },
      { id: "d", text: "Mandatory GPU thread synchronization" }
    ],
    answer: ["a", "b", "c"],
    explanation: "CPython loops repeatedly inspect dynamic types, manipulate pointer wrappers, and fail to utilize CPU vector registers.",
    noteRef: "aiml-02-lo04",
    reviewed: false
  },

  // LO05
  {
    id: "aiml-02-q17",
    loId: "aiml-02-lo05",
    type: "single",
    difficulty: 1,
    stem: "In the Pandas library, how are a Series and a DataFrame structurally related?",
    options: [
      { id: "a", text: "A DataFrame is a 2D table composed of multiple 1D Series sharing a common row index." },
      { id: "b", text: "A Series can only store string data, while a DataFrame only stores floats." },
      { id: "c", text: "A DataFrame is an encrypted binary file, while a Series is plain text." },
      { id: "d", text: "A Series contains multiple DataFrames stacked along the z-axis." }
    ],
    answer: ["a"],
    explanation: "A DataFrame is essentially an ordered collection of columns, where each column is an individual Series sharing a common Index.",
    noteRef: "aiml-02-lo05",
    reviewed: false
  },
  {
    id: "aiml-02-q18",
    loId: "aiml-02-lo05",
    type: "single",
    difficulty: 2,
    stem: "What happens when you create a Pandas Series from a Python dictionary like `{'a': 10, 'b': 20}`?",
    options: [
      { id: "a", text: "The dictionary keys become the Series Index, and the values become the data." },
      { id: "b", text: "Pandas discards the keys and assigns default integer indices 0 and 1." },
      { id: "c", text: "Pandas raises a TypeError because dictionaries are unordered." },
      { id: "d", text: "The values become column headers." }
    ],
    answer: ["a"],
    explanation: "When instantiating a Series from a dictionary, the dictionary keys naturally form the explicit label Index.",
    noteRef: "aiml-02-lo05",
    reviewed: false
  },
  {
    id: "aiml-02-q19",
    loId: "aiml-02-lo05",
    type: "scenario",
    difficulty: 2,
    stem: "You have a DataFrame `df` with 1,000 rows and 4 columns: 'id' (int64), 'name' (object), 'score' (float64), and 'active' (bool). What does `df.dtypes` output?",
    options: [
      { id: "a", text: "A Series mapping each column name to its respective data type." },
      { id: "b", text: "A single string specifying the dominant data type." },
      { id: "c", text: "A 4x4 correlation matrix." },
      { id: "d", text: "An error, because DataFrames cannot hold mixed types." }
    ],
    answer: ["a"],
    explanation: "`df.dtypes` returns a Series listing the specific data type of each column in the DataFrame.",
    noteRef: "aiml-02-lo05",
    reviewed: false
  },
  {
    id: "aiml-02-q20",
    loId: "aiml-02-lo05",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following are valid characteristics of a Pandas Index?",
    options: [
      { id: "a", text: "It can contain non-unique duplicate labels" },
      { id: "b", text: "It can be hierarchical (MultiIndex) with multiple levels" },
      { id: "c", text: "It provides fast hash-based or binary search lookup for label alignment" },
      { id: "d", text: "It must always be an array of contiguous 32-bit integers" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Pandas indices support duplicates, multi-level hierarchies, and arbitrary label types (strings, timestamps, integers).",
    noteRef: "aiml-02-lo05",
    reviewed: false
  },

  // LO06
  {
    id: "aiml-02-q21",
    loId: "aiml-02-lo06",
    type: "single",
    difficulty: 1,
    stem: "What is the primary difference between `.loc` and `.iloc` accessors in Pandas?",
    options: [
      { id: "a", text: "`.loc` uses label-based indexing, whereas `.iloc` uses 0-based integer positional coordinates." },
      { id: "b", text: "`.loc` is for rows, while `.iloc` is only for columns." },
      { id: "c", text: "`.iloc` is deprecated in modern Pandas versions." },
      { id: "d", text: "`.loc` only works on numeric data types." }
    ],
    answer: ["a"],
    explanation: "`.loc` selects by index and column labels, while `.iloc` selects strictly by integer position coordinates.",
    noteRef: "aiml-02-lo06",
    reviewed: false
  },
  {
    id: "aiml-02-q22",
    loId: "aiml-02-lo06",
    type: "single",
    difficulty: 2,
    stem: "When slicing rows using `.loc['start':'end']`, how are the slice endpoints handled?",
    options: [
      { id: "a", text: "Both 'start' and 'end' labels are inclusive in the returned subset." },
      { id: "b", text: "The 'end' label is strictly excluded, following standard Python half-open intervals." },
      { id: "c", text: "Neither endpoint is included." },
      { id: "d", text: "Inclusion depends on whether the index is alphabetically sorted." }
    ],
    answer: ["a"],
    explanation: "Unlike standard Python positional slices, Pandas label-based `.loc` slicing is inclusive of both boundary labels.",
    noteRef: "aiml-02-lo06",
    reviewed: false
  },
  {
    id: "aiml-02-q23",
    loId: "aiml-02-lo06",
    type: "scenario",
    difficulty: 2,
    stem: "You want to select all customers in `df` who are older than 30 and have an account balance over 50,000. Which expression executes this correctly?",
    options: [
      { id: "a", text: "df.query('age > 30 and balance > 50000')" },
      { id: "b", text: "df[df['age'] > 30 and df['balance'] > 50000]" },
      { id: "c", text: "df.select(age > 30, balance > 50000)" },
      { id: "d", text: "df.filter(where='age > 30 & balance > 50000')" }
    ],
    answer: ["a"],
    explanation: "`.query('age > 30 and balance > 50000')` evaluates clean boolean expressions against column names. Option b fails because Python's keyword `and` cannot evaluate element-wise boolean arrays (it requires bitwise `&`).",
    noteRef: "aiml-02-lo06",
    reviewed: false
  },
  {
    id: "aiml-02-q24",
    loId: "aiml-02-lo06",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following expressions will raise an error when filtering a Pandas DataFrame `df` with multiple conditions?",
    options: [
      { id: "a", text: "df[df['age'] > 25 & df['income'] > 50000] (missing parentheses around bitwise conditions)" },
      { id: "b", text: "df[df['age'] > 25 and df['income'] > 50000] (using logical 'and' instead of bitwise '&')" },
      { id: "c", text: "df[(df['age'] > 25) & (df['income'] > 50000)]" },
      { id: "d", text: "df.query('age > 25 and income > 50000')" }
    ],
    answer: ["a", "b"],
    explanation: "In Python, bitwise `&` has higher precedence than comparison operators, so omitting parentheses in option a causes operator precedence errors. Option b fails because logical `and` cannot evaluate truth value of Series.",
    noteRef: "aiml-02-lo06",
    reviewed: false
  },

  // LO07
  {
    id: "aiml-02-q25",
    loId: "aiml-02-lo07",
    type: "single",
    difficulty: 1,
    stem: "What three conceptual phases define the Split-Apply-Combine paradigm in Pandas `groupby` operations?",
    options: [
      { id: "a", text: "Partition data into groups, calculate a metric on each partition, and merge results into a single table." },
      { id: "b", text: "Encrypt data, transmit across network sockets, and decrypt." },
      { id: "c", text: "Normalize features, train gradient descent, and evaluate accuracy." },
      { id: "d", text: "Drop duplicates, replace missing values with median, and plot." }
    ],
    answer: ["a"],
    explanation: "Split partitions data by key, Apply computes aggregations on partitions, and Combine reassembles results into a DataFrame.",
    noteRef: "aiml-02-lo07",
    reviewed: false
  },
  {
    id: "aiml-02-q26",
    loId: "aiml-02-lo07",
    type: "single",
    difficulty: 2,
    stem: "In `pd.merge(df1, df2, on='user_id', how='left')`, what happens to rows in `df1` that have no matching `user_id` in `df2`?",
    options: [
      { id: "a", text: "They are preserved in the result, with NaN values populated for all `df2` columns." },
      { id: "b", text: "They are completely discarded from the output." },
      { id: "c", text: "Pandas raises a KeyNotFoundError." },
      { id: "d", text: "They are duplicated 10 times." }
    ],
    answer: ["a"],
    explanation: "A left outer join retains all records from the left DataFrame (`df1`), padding unmatched columns from `df2` with NaN.",
    noteRef: "aiml-02-lo07",
    reviewed: false
  },
  {
    id: "aiml-02-q27",
    loId: "aiml-02-lo07",
    type: "scenario",
    difficulty: 2,
    stem: "You have a transactions DataFrame with columns `['store_id', 'department', 'sales']`. You want the mean and total sales per store and department. Which statement computes this?",
    options: [
      { id: "a", text: "df.groupby(['store_id', 'department'])['sales'].agg(['mean', 'sum'])" },
      { id: "b", text: "df.aggregate(store_id, department, sales='mean+sum')" },
      { id: "c", text: "df.pivot(index='sales', columns='store_id')" },
      { id: "d", text: "df.filter(['store_id', 'department']).sum()" }
    ],
    answer: ["a"],
    explanation: "Grouping by multiple columns and chaining `.agg(['mean', 'sum'])` computes both statistics for each distinct group.",
    noteRef: "aiml-02-lo07",
    reviewed: false
  },
  {
    id: "aiml-02-q28",
    loId: "aiml-02-lo07",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following join types are supported natively by `pd.merge()`?",
    options: [
      { id: "a", text: "how='inner' (intersection of keys)" },
      { id: "b", text: "how='outer' (union of keys)" },
      { id: "c", text: "how='left' (preserves all left keys)" },
      { id: "d", text: "how='asynchronous_stream' (socket stream merge)" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Pandas supports inner, outer, left, and right relational joins via `pd.merge()`.",
    noteRef: "aiml-02-lo07",
    reviewed: false
  },

  // LO08
  {
    id: "aiml-02-q29",
    loId: "aiml-02-lo08",
    type: "single",
    difficulty: 1,
    stem: "Which parameter in `pd.read_csv()` allows you to parse non-comma tabular files, such as tab-delimited (TSV) logs?",
    options: [
      { id: "a", text: "`sep='\\t'` (or `delimiter='\\t'`)" },
      { id: "b", text: "`encoding='tsv'`" },
      { id: "c", text: "`format='tab'`" },
      { id: "d", text: "`mode='split'`" }
    ],
    answer: ["a"],
    explanation: "The `sep` or `delimiter` parameter specifies the delimiter character used in the file.",
    noteRef: "aiml-02-lo08",
    reviewed: false
  },
  {
    id: "aiml-02-q30",
    loId: "aiml-02-lo08",
    type: "single",
    difficulty: 2,
    stem: "Why would you specify `chunksize=50_000` when invoking `pd.read_csv()` on a 20GB dataset on a personal computer?",
    options: [
      { id: "a", text: "It streams the file in successive 50,000-row DataFrames, preventing memory exhaustion and OOM crashes." },
      { id: "b", text: "It forces Pandas to compress the file into a zip archive on disk." },
      { id: "c", text: "It automatically trains a linear regression model on each chunk." },
      { id: "d", text: "It bypasses CPU caches to write directly to GPU memory." }
    ],
    answer: ["a"],
    explanation: "The `chunksize` parameter returns an iterable TextFileReader that yields sub-DataFrames, enabling out-of-core batch processing.",
    noteRef: "aiml-02-lo08",
    reviewed: false
  },
  {
    id: "aiml-02-q31",
    loId: "aiml-02-lo08",
    type: "scenario",
    difficulty: 2,
    stem: "A legacy dataset represents missing numerical data with strings 'UNKNOWN', '?', and 'N/A'. How can you instruct `pd.read_csv` to treat these as NaN automatically?",
    options: [
      { id: "a", text: "pd.read_csv('data.csv', na_values=['UNKNOWN', '?', 'N/A'])" },
      { id: "b", text: "pd.read_csv('data.csv', drop_missing=True)" },
      { id: "c", text: "pd.read_csv('data.csv', clean_strings=True)" },
      { id: "d", text: "pd.read_csv('data.csv', null_regex='.*')" }
    ],
    answer: ["a"],
    explanation: "`na_values` accepts a collection of custom string indicators to interpret as null values upon initial ingestion.",
    noteRef: "aiml-02-lo08",
    reviewed: false
  },
  {
    id: "aiml-02-q32",
    loId: "aiml-02-lo08",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following parameters are available in `pd.read_csv` to control type parsing and schema ingestion?",
    options: [
      { id: "a", text: "dtype (explicit column type mapping dictionary)" },
      { id: "b", text: "parse_dates (list of columns to parse into datetime64)" },
      { id: "c", text: "usecols (subset of columns to load into memory)" },
      { id: "d", text: "auto_impute_with_deep_learning" }
    ],
    answer: ["a", "b", "c"],
    explanation: "`dtype`, `parse_dates`, and `usecols` allow precise control over data types and memory footprint during CSV reading.",
    noteRef: "aiml-02-lo08",
    reviewed: false
  },

  // LO09 (Extension)
  {
    id: "aiml-02-q33",
    loId: "aiml-02-lo09",
    type: "single",
    difficulty: 2,
    stem: "When diagnosing multicollinearity among dozens of continuous training features, which Seaborn chart provides the most rapid visual diagnostic?",
    options: [
      { id: "a", text: "A heatmap of the pairwise correlation matrix (`sns.heatmap(df.corr())`)." },
      { id: "b", text: "A 1D boxplot of the index column." },
      { id: "c", text: "A pie chart showing missing values." },
      { id: "d", text: "A step line chart of memory usage." }
    ],
    answer: ["a"],
    explanation: "A correlation heatmap graphically presents Pearson coefficients between all pairs of features, highlighting redundant collinear predictors.",
    noteRef: "aiml-02-lo09",
    reviewed: false
  },
  {
    id: "aiml-02-q34",
    loId: "aiml-02-lo09",
    type: "single",
    difficulty: 3,
    stem: "In Matplotlib's object-oriented hierarchy, what is the distinction between a `Figure` and an `Axes`?",
    options: [
      { id: "a", text: "A `Figure` is the overall canvas window, while an `Axes` is an individual subplot region with its own coordinate space." },
      { id: "b", text: "An `Axes` represents 3D data, while a `Figure` only represents 1D text." },
      { id: "c", text: "A `Figure` is created only in Jupyter Notebooks, while an `Axes` is for command line terminals." },
      { id: "d", text: "There is no difference; they are aliases for the same object." }
    ],
    answer: ["a"],
    explanation: "In Matplotlib, the `Figure` is the top-level container holding all visual elements, while an `Axes` represents a specific plot area with axes lines, ticks, and labels.",
    noteRef: "aiml-02-lo09",
    reviewed: false
  },
  {
    id: "aiml-02-q35",
    loId: "aiml-02-lo06",
    type: "numeric",
    difficulty: 2,
    stem: "A DataFrame contains 50 rows. A boolean filter selects 30% of the rows. From this subset, an `.iloc[0:5]` slice is taken. How many rows are in the final slice?",
    options: [
      { id: "a", text: "5" },
      { id: "b", text: "15" },
      { id: "c", text: "10" },
      { id: "d", text: "25" }
    ],
    answer: ["a"],
    explanation: "50 * 0.30 = 15 rows. Slicing with `.iloc[0:5]` selects 5 rows (indices 0, 1, 2, 3, 4).",
    noteRef: "aiml-02-lo06",
    verify: "(Math.min(50 * 0.30, 5) === 5)",
    reviewed: false
  }
];

balanceAndSave('ai-ml', 'python-numpy-and-pandas', ai02Objectives, ai02Bank);

console.log('✅ ai-02 complete.');

// ============================================================================
// CHAPTER 3: The Math You Actually Need (ai-03)
// ============================================================================
console.log('Generating ai-03: math-you-actually-need...');

const ai03Objectives = {
  version: 1,
  chapterId: "ai-03",
  objectives: [
    {
      id: "aiml-03-lo01",
      order: 1,
      title: "Calculate vector dot products, projections, and geometric norms ($L_1$, $L_2$)",
      bloom: "apply",
      tier: "core",
      mustHave: true,
      keywords: ["vector dot product", "L1 norm", "L2 norm", "Euclidean distance", "cosine similarity", "inner product"],
      aliases: ["vector geometry", "vector norms"],
      prerequisites: [],
      estMinutes: 12
    },
    {
      id: "aiml-03-lo02",
      order: 2,
      title: "Compute matrix multiplications and transpose operations adhering to inner-dimension constraints",
      bloom: "apply",
      tier: "core",
      mustHave: true,
      keywords: ["matrix multiplication", "transpose", "dimension compatibility", "linear map", "affine transform"],
      aliases: ["matrix algebra", "tensor contractions"],
      prerequisites: ["aiml-03-lo01"],
      estMinutes: 12
    },
    {
      id: "aiml-03-lo03",
      order: 3,
      title: "Calculate conditional probabilities and posterior distributions using Bayes' Theorem",
      bloom: "apply",
      tier: "core",
      mustHave: true,
      keywords: ["Bayes theorem", "conditional probability", "prior", "likelihood", "posterior", "marginal probability"],
      aliases: ["Bayesian inference", "conditional likelihood"],
      prerequisites: [],
      estMinutes: 12
    },
    {
      id: "aiml-03-lo04",
      order: 4,
      title: "Measure central tendency and dispersion using mean, variance, covariance, and standard deviation",
      bloom: "apply",
      tier: "core",
      mustHave: false,
      keywords: ["sample mean", "variance", "standard deviation", "covariance matrix", "dispersion", "Bessel correction"],
      aliases: ["summary statistics", "variance calculation"],
      prerequisites: ["aiml-03-lo01"],
      estMinutes: 10
    },
    {
      id: "aiml-03-lo05",
      order: 5,
      title: "Model continuous uncertainties using Gaussian Normal distributions and probability density functions",
      bloom: "understand",
      tier: "core",
      mustHave: false,
      keywords: ["Gaussian distribution", "Normal distribution", "probability density function", "PDF", "standard score", "z-score"],
      aliases: ["bell curve", "normal distribution"],
      prerequisites: ["aiml-03-lo04"],
      estMinutes: 10
    },
    {
      id: "aiml-03-lo06",
      order: 6,
      title: "Derive single-variable derivatives to interpret instantaneous rates of change and tangent slopes",
      bloom: "apply",
      tier: "core",
      mustHave: false,
      keywords: ["derivative", "rate of change", "tangent line", "power rule", "infinitesimal", "slope"],
      aliases: ["calculus slope", "differentiation"],
      prerequisites: [],
      estMinutes: 10
    },
    {
      id: "aiml-03-lo07",
      order: 7,
      title: "Calculate partial derivatives and assemble multi-variable gradient vectors ($nabla f$)",
      bloom: "apply",
      tier: "core",
      mustHave: true,
      keywords: ["partial derivative", "gradient vector", "del operator", "steepest ascent", "loss surface", "multivariate calculus"],
      aliases: ["gradient calculus", "multivariable derivative"],
      prerequisites: ["aiml-03-lo06"],
      estMinutes: 12
    },
    {
      id: "aiml-03-lo08",
      order: 8,
      title: "Apply the multivariate Chain Rule to trace error gradient propagation through composite functions",
      bloom: "apply",
      tier: "core",
      mustHave: false,
      keywords: ["chain rule", "composite function", "backpropagation intuition", "intermediate variable", "gradient product"],
      aliases: ["derivative chain rule", "gradient flow"],
      prerequisites: ["aiml-03-lo07"],
      estMinutes: 12
    },
    {
      id: "aiml-03-lo09",
      order: 9,
      title: "Compute matrix determinants and eigenvalues to analyze linear transformations and variance axes",
      bloom: "analyze",
      tier: "extension",
      mustHave: false,
      keywords: ["eigenvalue", "eigenvector", "determinant", "principal axes", "characteristic equation", "linear transformation"],
      aliases: ["spectral decomposition", "eigen analysis"],
      prerequisites: ["aiml-03-lo02"],
      estMinutes: 15
    }
  ]
};

// Notes for ai-03
writeNoteBlock('ai-ml', 'math-you-actually-need', 'aiml-03-lo01',
  'Vector Dot Products, Projections, and Geometric Norms',
  `Vectors in machine learning represent points, feature embeddings, and direction weights in continuous multidimensional space. Two fundamental operations govern vector geometry: norms and inner products.

The **$L_2$ norm** (Euclidean norm) measures the geometric length of vector $\\mathbf{v}$:
$$\\|\\mathbf{v}\\|_2 = \\sqrt{\\sum_{i=1}^n v_i^2}$$
The **$L_1$ norm** (Manhattan norm) computes the sum of absolute magnitudes: $\\|\\mathbf{v}\\|_1 = \\sum |v_i|$. In machine learning regularization, $L_2$ penalizes large outlier weights smoothly, while $L_1$ induces exact sparsity by driving non-critical weights to zero.

The **dot product** $\\mathbf{u} \\cdot \\mathbf{v} = \\sum u_i v_i = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\cos(\\theta)$ measures directional alignment. Normalizing the dot product yields **Cosine Similarity**:
$$\\text{cosine}(\\mathbf{u}, \\mathbf{v}) = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\|_2 \\|\\mathbf{v}\\|_2}$$
Cosine similarity ranges from $-1$ (opposite directions) to $1$ (identical orientation), making it the primary metric for text embeddings and semantic retrieval.`,
  `Computing norms and cosine similarity in NumPy:
\`\`\`python
# numpy==1.26.4
import numpy as np

u = np.array([3.0, 4.0])
v = np.array([1.0, 2.0])

l2_u = np.linalg.norm(u) # sqrt(9 + 16) = 5.0
l1_u = np.linalg.norm(u, ord=1) # 3 + 4 = 7.0

dot_prod = np.dot(u, v) # 3*1 + 4*2 = 11.0
cos_sim = dot_prod / (np.linalg.norm(u) * np.linalg.norm(v))
print(f"L2: {l2_u}, L1: {l1_u}, Cosine Sim: {cos_sim:.4f}")
\`\`\``,
  `Confusing Euclidean distance with cosine similarity. Two document vectors with identical word frequency proportions can have large Euclidean distance due to document length differences, yet maintain a cosine similarity of exactly 1.0.`,
  `If two non-zero vectors are orthogonal (at an angle of 90 degrees), what is their dot product? (Zero: $\\cos(90^\\circ) = 0$).`
);

writeNoteBlock('ai-ml', 'math-you-actually-need', 'aiml-03-lo02',
  'Matrix Multiplication and Linear Transformations',
  `Matrices represent linear transformations that rotate, scale, shear, and project vector spaces. In machine learning, dense neural layers compute affine transformations: $\\mathbf{y} = \\mathbf{X}\\mathbf{W} + \\mathbf{b}$.

For matrix multiplication $\\mathbf{C} = \\mathbf{A}\\mathbf{B}$ to be mathematically valid, the **inner dimensions must match**:
- If $\\mathbf{A}$ has shape $(M, K)$ and $\\mathbf{B}$ has shape $(K, N)$, the resulting matrix $\\mathbf{C}$ has shape $(M, N)$.
- Each element $C_{ij}$ is computed as the vector dot product of row $i$ of $\\mathbf{A}$ and column $j$ of $\\mathbf{B}$:
$$C_{ij} = \\sum_{k=1}^K A_{ik} B_{kj}$$

Matrix multiplication is associative $((\\mathbf{A}\\mathbf{B})\\mathbf{C} = \\mathbf{A}(\\mathbf{B}\\mathbf{C}))$ and distributive, but strictly **non-commutative** (in general, $\\mathbf{A}\\mathbf{B} \\neq \\mathbf{B}\\mathbf{A}$). The **transpose** $\\mathbf{A}^T$ flips axes such that $(A^T)_{ji} = A_{ij}$, satisfying $(\\mathbf{A}\\mathbf{B})^T = \\mathbf{B}^T \\mathbf{A}^T$.`,
  `Executing batch matrix multiplication with dimension checks:
\`\`\`python
# numpy==1.26.4
import numpy as np

# Batch of 4 samples, 3 input features
X = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 0, 1]]) # (4, 3)

# Weight matrix mapping 3 inputs to 2 hidden neurons
W = np.array([[0.1, 0.2], [0.3, 0.4], [0.5, 0.6]])          # (3, 2)

# Matrix product: (4, 3) @ (3, 2) -> (4, 2)
output = X @ W
print(f"Output shape: {output.shape}") # (4, 2)
print(output)
\`\`\``,
  `Attempting to multiply matrices of shapes $(3, 4)$ and $(3, 2)$ directly. Inner dimensions 4 and 3 do not match. The first matrix must be transposed to $(4, 3)$ or the pipeline restructured.`,
  `If matrix $A$ is shape $(16, 64)$ and matrix $B$ is shape $(64, 10)$, what is the shape of $A B$? ($(16, 10)$).`
);

writeNoteBlock('ai-ml', 'math-you-actually-need', 'aiml-03-lo03',
  'Conditional Probability and Bayes Theorem in Machine Learning',
  `Machine learning algorithms quantify uncertainty using probability theory. The fundamental building block is conditional probability: the likelihood of event $A$ occurring given that event $B$ has already occurred:
$$P(A | B) = \\frac{P(A \\cap B)}{P(B)}$$

Rearranging this relationship yields **Bayes' Theorem**, the mathematical foundation of Bayesian inference, Naive Bayes classifiers, and probabilistic machine learning:
$$P(A | B) = \\frac{P(B | A) P(A)}{P(B)}$$

Where:
- $P(A)$ is the **Prior**: our baseline belief in hypothesis $A$ before observing new evidence.
- $P(B | A)$ is the **Likelihood**: the probability of observing evidence $B$ if hypothesis $A$ is true.
- $P(B)$ is the **Marginal Evidence**: the total probability of observing $B$ across all possible hypotheses: $P(B) = \\sum P(B | A_i) P(A_i)$.
- $P(A | B)$ is the **Posterior**: our updated belief in hypothesis $A$ after observing evidence $B$.`,
  `Calculating posterior spam probability given a suspicious keyword:
\`\`\`python
# Prior probability an email is spam: P(Spam) = 0.20
p_spam = 0.20
p_ham = 0.80

# Likelihood keyword "VIAGRA" appears: P(Word|Spam)=0.60, P(Word|Ham)=0.01
p_word_given_spam = 0.60
p_word_given_ham = 0.01

# Total marginal probability of the word: P(Word)
p_word = (p_word_given_spam * p_spam) + (p_word_given_ham * p_ham) # 0.12 + 0.008 = 0.128

# Posterior probability: P(Spam|Word)
posterior_spam = (p_word_given_spam * p_spam) / p_word
print(f"Posterior P(Spam|Word): {posterior_spam:.4f}") # 0.12 / 0.128 = 0.9375
\`\`\``,
  `Assuming $P(A | B) = P(B | A)$. The probability that someone has a fever given they have malaria is nearly 100%, but the probability that someone has malaria given they have a fever is low in non-endemic regions.`,
  `If an test has a false positive rate, why does low disease prevalence reduce the posterior probability of illness given a positive test? (Because the rare prior probability $P(\\text{Disease})$ heavily suppresses the posterior numerator).`
);

writeNoteBlock('ai-ml', 'math-you-actually-need', 'aiml-03-lo04',
  'Measures of Dispersion: Variance, Covariance, and Standard Deviation',
  `Summary statistics summarize multidimensional distributions into scalar descriptors. The **sample mean** $\\mu = \\frac{1}{N} \\sum x_i$ locates central tendency, but tells nothing about data dispersion.

**Variance** ($\\sigma^2$) measures the average squared deviation from the mean:
$$\\sigma^2 = \\frac{1}{N-1} \\sum_{i=1}^N (x_i - \\mu)^2$$
The division by $N-1$ (Bessel's correction) provides an unbiased estimator for sample populations. **Standard deviation** ($\\sigma = \\sqrt{\\sigma^2}$) restores dispersion to the original measurement units.

In multi-feature datasets, **Covariance** measures the joint directional variability of two features $X$ and $Y$:
$$\\text{Cov}(X, Y) = \\frac{1}{N-1} \\sum (x_i - \\bar{x})(y_i - \\bar{y})$$
Positive covariance indicates features rise and fall together; negative covariance indicates an inverse relationship. The $D \\times D$ **Covariance Matrix** $\\Sigma$ captures all pairwise feature interactions, forming the core mathematical input for Principal Component Analysis (PCA).`,
  `Calculating variance and covariance matrix in NumPy:
\`\`\`python
# numpy==1.26.4
import numpy as np

# 2 features across 4 samples
data = np.array([
    [10.0, 100.0],
    [12.0, 110.0],
    [14.0, 125.0],
    [16.0, 140.0]
])

var_x = np.var(data[:, 0], ddof=1) # ddof=1 enables N-1 Bessel correction
std_x = np.std(data[:, 0], ddof=1)

# Covariance matrix between feature 0 and feature 1
cov_matrix = np.cov(data, rowvar=False)
print(f"Variance: {var_x:.2f}, StdDev: {std_x:.2f}")
print(f"Covariance Matrix:\\n{cov_matrix}")
\`\`\``,
  `Forgetting Bessel's correction (\`ddof=1\` in NumPy) when estimating population variance from small sample batches, systematically underestimating actual population spread.`,
  `If two independent features have zero linear relationship, what is their expected covariance? (Zero).`
);

writeNoteBlock('ai-ml', 'math-you-actually-need', 'aiml-03-lo05',
  'Continuous Uncertainties and the Gaussian Normal Distribution',
  `The Gaussian (Normal) distribution is the ubiquitous distribution in machine learning. By the Central Limit Theorem, the sum of independent random variables converges to a Normal distribution regardless of their underlying generative forms.

The Gaussian Probability Density Function (PDF) is parameterized completely by its mean $\\mu$ and variance $\\sigma^2$:
$$p(x; \\mu, \\sigma) = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\exp\\left( -\\frac{(x - \\mu)^2}{2\\sigma^2} \\right)$$

Key geometric properties:
1. **Symmetry**: The distribution is symmetric about its peak at $x = \\mu$.
2. **Empirical 68-95-99.7 Rule**: Approximately 68.27% of values fall within $\\mu \\pm 1\\sigma$, 95.45% within $\\mu \\pm 2\\sigma$, and 99.73% within $\\mu \\pm 3\\sigma$.
3. **Z-Score Normalization**: Any observation $x$ can be standardized into standard normal form $\\mathcal{N}(0, 1)$ via:
$$z = \\frac{x - \\mu}{\\sigma}$$
Z-score scaling prevents features with large numeric scales (e.g., annual revenue) from dominating gradient descent over smaller features.`,
  `Computing Gaussian probabilities and z-scores:
\`\`\`python
# scipy==1.13.1, numpy==1.26.4
import numpy as np
from scipy import stats

mu, sigma = 50.0, 10.0
sample = 65.0

# Calculate z-score
z = (sample - mu) / sigma # (65 - 50) / 10 = 1.5

# Probability density at sample point
density = stats.norm.pdf(sample, loc=mu, scale=sigma)

# Cumulative probability P(X <= 65)
p_cumulative = stats.norm.cdf(sample, loc=mu, scale=sigma)
print(f"Z-score: {z}, PDF: {density:.5f}, Cumulative: {p_cumulative:.4f}")
\`\`\``,
  `Confusing probability density ($f(x)$) with discrete probability ($P(X=x)$). For continuous distributions, the probability of obtaining any exact real scalar is zero; non-zero probabilities exist only over continuous integration intervals.`,
  `Under a standard Gaussian distribution, what percentage of observations lie within two standard deviations of the mean? (Approximately 95.45%).`
);

writeNoteBlock('ai-ml', 'math-you-actually-need', 'aiml-03-lo06',
  'Single-Variable Calculus: Derivatives and Instantaneous Rates of Change',
  `Machine learning optimization minimizes loss surfaces by iteratively calculating slopes. In single-variable calculus, the derivative $f'(x) = \\frac{df}{dx}$ defines the instantaneous rate of change of function $f(x)$ at point $x$:
$$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$$

Geometrically, the derivative is the slope of the tangent line touching the curve at $(x, f(x))$.
- If $f'(x) > 0$, the function is increasing; moving in the negative direction decreases $f$.
- If $f'(x) < 0$, the function is decreasing; moving in the positive direction decreases $f$.
- If $f'(x) = 0$, the slope is flat, corresponding to a local minimum, maximum, or inflection point.

Fundamental rules:
- **Power Rule**: $\\frac{d}{dx} x^n = n x^{n-1}$. Example: $\\frac{d}{dx} (x^2) = 2x$.
- **Sum Rule**: $\\frac{d}{dx} [f(x) + g(x)] = f'(x) + g'(x)$.
- **Constant Multiplier Rule**: $\\frac{d}{dx} [c \\cdot f(x)] = c \\cdot f'(x)$.`,
  `Numerical vs analytical derivative comparison:
\`\`\`python
# numpy==1.26.4
# Analytical function: f(x) = 3*x^2 + 2*x + 5
# Analytical derivative: f'(x) = 6*x + 2
def f(x):
    return 3 * x**2 + 2 * x + 5

def f_prime_analytical(x):
    return 6 * x + 2

# Finite difference numerical approximation
x_val = 4.0
h = 1e-6
f_prime_numerical = (f(x_val + h) - f(x_val)) / h

print(f"Analytical: {f_prime_analytical(x_val)}") # 6*4 + 2 = 26
print(f"Numerical:  {f_prime_numerical:.5f}")      # ≈ 26.00000
\`\`\``,
  `Confusing the derivative value with the function output value. A function can have a massive output $f(x) = 1,000,000$ yet a tiny slope $f'(x) = 0.001$, meaning optimization steps must remain tiny.`,
  `What is the derivative of the quadratic loss term $L(w) = \\frac{1}{2} w^2$ with respect to weight $w$? ($w$).`
);

writeNoteBlock('ai-ml', 'math-you-actually-need', 'aiml-03-lo07',
  'Multivariable Calculus: Partial Derivatives and the Gradient Vector',
  `Real machine learning models depend on millions of parameters $\\mathbf{w} = [w_1, w_2, \\dots, w_D]$. When a function $f(\\mathbf{w})$ takes multiple inputs, a standard derivative cannot be computed in isolation. Instead, we compute **partial derivatives** $\\frac{\\partial f}{\\partial w_i}$.

A partial derivative treats all other variables as fixed constants while differentiating with respect to the variable of interest. For example, for $f(x, y) = 3x^2 y + 4y^3$:
$$\\frac{\\partial f}{\\partial x} = 6xy, \\quad \\frac{\\partial f}{\\partial y} = 3x^2 + 12y^2$$

The **Gradient Vector** $\\nabla f$ stacks all individual partial derivatives into a single vector pointing in the direction of steepest ascent:
$$\\nabla f(\\mathbf{w}) = \\left[ \\frac{\\partial f}{\\partial w_1}, \\frac{\\partial f}{\\partial w_2}, \\dots, \\frac{\\partial f}{\\partial w_D} \\right]^T$$
To minimize error, Gradient Descent steps in the exact opposite direction of the gradient:
$$\\mathbf{w} \\leftarrow \\mathbf{w} - \\eta \\nabla L(\\mathbf{w})$$`,
  `Computing multivariable gradients analytically:
\`\`\`python
# numpy==1.26.4
import numpy as np

# Loss function: L(w1, w2) = (w1 - 3)^2 + 2*(w2 + 1)^2
def loss(w):
    return (w[0] - 3.0)**2 + 2.0 * (w[1] + 1.0)**2

def compute_gradient(w):
    # dL/dw1 = 2*(w1 - 3)
    # dL/dw2 = 4*(w2 + 1)
    return np.array([2.0 * (w[0] - 3.0), 4.0 * (w[1] + 1.0)])

current_w = np.array([0.0, 0.0])
grad = compute_gradient(current_w) # [-6.0, 4.0]
# Stepping in negative gradient direction reduces loss:
lr = 0.1
new_w = current_w - lr * grad # [0.6, -0.4]
print(f"Initial Loss: {loss(current_w):.2f}, Updated Loss: {loss(new_w):.2f}")
\`\`\``,
  `Differentiating other variables instead of holding them strictly constant when calculating partial derivatives.`,
  `In which geometric direction does the negative gradient vector $-\\nabla L(\\mathbf{w})$ point? (In the direction of steepest descent across the multidimensional loss surface).`
);

writeNoteBlock('ai-ml', 'math-you-actually-need', 'aiml-03-lo08',
  'The Multivariate Chain Rule and Error Gradient Flow',
  `Deep learning models are composed of nested function layers: $\\hat{y} = f_3(f_2(f_1(x; w_1); w_2); w_3)$. Computing parameter gradients for early layers requires propagating derivatives backwards through intermediate variables using the **Chain Rule**.

If $y = f(u)$ and $u = g(x)$, the single-variable Chain Rule states:
$$\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}$$

In multivariate systems where an intermediate vector $\\mathbf{u}$ affects the loss $L$, the total derivative accumulates over all paths:
$$\\frac{\\partial L}{\\partial x} = \\sum_{i} \\frac{\\partial L}{\\partial u_i} \\frac{\\partial u_i}{\\partial x}$$

In matrix form, if $\\mathbf{z} = \\mathbf{X}\\mathbf{W}$ and $L = \\text{MSE}(\\mathbf{z})$, the derivative of the loss with respect to weight matrix $\\mathbf{W}$ is:
$$\\frac{\\partial L}{\\partial \\mathbf{W}} = \\mathbf{X}^T \\left( \\frac{\\partial L}{\\partial \\mathbf{z}} \\right)$$
This matrix formulation powers the Backpropagation algorithm, calculating gradients across billions of parameters in a single reverse sweep.`,
  `Tracing the chain rule through a single linear neuron:
\`\`\`python
# numpy==1.26.4
import numpy as np

# Forward pass:
x = 2.0; w = 3.0; b = 1.0; target = 10.0

z = w * x + b               # z = 3*2 + 1 = 7.0
loss = 0.5 * (z - target)**2 # L = 0.5 * (7 - 10)^2 = 4.5

# Backward pass via Chain Rule:
# dL/dz = z - target = -3.0
dL_dz = z - target

# dz/dw = x = 2.0
dz_dw = x

# dL/dw = (dL/dz) * (dz/dw) = -3.0 * 2.0 = -6.0
dL_dw = dL_dz * dz_dw
print(f"dL/dw: {dL_dw}") # -6.0
\`\`\``,
  `Multiplying Jacobian matrices in the wrong algebraic order, violating non-commutative matrix dimension constraints during backpropagation passes.`,
  `If $\\frac{\\partial L}{\\partial z} = 4$ and $\\frac{\\partial z}{\\partial w} = 3$, what is $\\frac{\\partial L}{\\partial w}$ via the Chain Rule? ($4 \\times 3 = 12$).`
);

writeNoteBlock('ai-ml', 'math-you-actually-need', 'aiml-03-lo09',
  'Determinants, Eigenvalues, and Dimensionality Reduction',
  `Matrices transform geometry by stretching, rotating, and shearing vectors. For most vectors $\\mathbf{v}$, multiplying by matrix $\\mathbf{A}$ changes both their length and direction. However, certain special vectors maintain their exact directional orientation, undergoing only scalar stretching. These are **Eigenvectors**.

Mathematically, a non-zero vector $\\mathbf{v}$ is an eigenvector of square matrix $\\mathbf{A}$ with corresponding **eigenvalue** $\\lambda$ if:
$$\\mathbf{A}\\mathbf{v} = \\lambda \\mathbf{v}$$
Rearranging gives the characteristic equation:
$$(\\mathbf{A} - \\lambda \\mathbf{I})\\mathbf{v} = \\mathbf{0} \\implies \\det(\\mathbf{A} - \\lambda \\mathbf{I}) = 0$$

The **determinant** $\\det(\\mathbf{A})$ measures the scaling factor of volume under transformation $\\mathbf{A}$. If $\\det(\\mathbf{A}) = 0$, the matrix collapses at least one dimension into a flat subspace and is non-invertible.

In machine learning, decomposing a data covariance matrix $\\Sigma$ into its eigenvectors and eigenvalues is the exact mathematical foundation of Principal Component Analysis (PCA): eigenvectors identify the orthogonal axes of maximum variance, while eigenvalues quantify the variance magnitude along each axis.`,
  `Computing eigenvalues and eigenvectors in NumPy:
\`\`\`python
# numpy==1.26.4
import numpy as np

# Symmetric 2x2 covariance matrix
cov = np.array([[3.0, 1.0], [1.0, 3.0]])

# Eigen decomposition
eigenvalues, eigenvectors = np.linalg.eigh(cov)
print(f"Eigenvalues: {eigenvalues}")     # [2.0, 4.0]
print(f"Eigenvectors:\\n{eigenvectors}") # Unit vectors along principal axes

# Verify A @ v = lambda * v for the first eigenvector
v0 = eigenvectors[:, 0]
lambda0 = eigenvalues[0]
print(f"A @ v0:      {cov @ v0}")
print(f"lambda0 * v0:{lambda0 * v0}") # Exact equality
\`\`\``,
  `Assuming every square matrix has real-valued eigenvalues. Non-symmetric matrices representing pure rotations produce complex conjugate eigenvalues with imaginary components.`,
  `In Principal Component Analysis, which eigenvectors are retained as the principal components? (The eigenvectors corresponding to the largest eigenvalues, representing maximum data variance).`
);

// Question Bank for ai-03 (36 questions: 4 per core LO + 2 for ext + 2 numeric)
const ai03Bank = [
  // LO01
  {
    id: "aiml-03-q01",
    loId: "aiml-03-lo01",
    type: "single",
    difficulty: 1,
    stem: "What geometric property does the vector dot product $\\mathbf{u} \\cdot \\mathbf{v}$ directly measure?",
    options: [
      { id: "a", text: "The directional alignment and projection of one vector along another." },
      { id: "b", text: "The cross-sectional area of the unit sphere." },
      { id: "c", text: "The ratio of primes contained within the vector indices." },
      { id: "d", text: "The memory bandwidth required to store float arrays." }
    ],
    answer: ["a"],
    explanation: "The dot product measures the projection of vector u along v, proportional to the cosine of the angle between them.",
    noteRef: "aiml-03-lo01",
    reviewed: false
  },
  {
    id: "aiml-03-q02",
    loId: "aiml-03-lo01",
    type: "single",
    difficulty: 2,
    stem: "Why is Cosine Similarity widely preferred over Euclidean Distance for measuring similarity between document text embeddings?",
    options: [
      { id: "a", text: "Because cosine similarity normalizes by vector magnitude, remaining invariant to overall document word count." },
      { id: "b", text: "Because cosine similarity cannot output negative numbers." },
      { id: "c", text: "Because Euclidean distance requires infinite dimensional arrays." },
      { id: "d", text: "Because cosine similarity is an integer-only metric." }
    ],
    answer: ["a"],
    explanation: "Cosine similarity measures vector angle rather than magnitude, ensuring two documents with the same topic focus match regardless of document length.",
    noteRef: "aiml-03-lo01",
    reviewed: false
  },
  {
    id: "aiml-03-q03",
    loId: "aiml-03-lo01",
    type: "scenario",
    difficulty: 2,
    stem: "You have two vectors $\\mathbf{a} = [2, 0]$ and $\\mathbf{b} = [0, 5]$. What is their dot product, and what geometric relationship does it indicate?",
    options: [
      { id: "a", text: "0, indicating that the two vectors are completely orthogonal (perpendicular at 90 degrees)." },
      { id: "b", text: "10, indicating parallel alignment." },
      { id: "c", text: "7, representing their Manhattan sum." },
      { id: "d", text: "-1, indicating opposite directions." }
    ],
    answer: ["a"],
    explanation: "Dot product = 2*0 + 0*5 = 0. When the dot product of non-zero vectors is zero, the vectors are orthogonal (perpendicular).",
    noteRef: "aiml-03-lo01",
    verify: "(2 * 0 + 0 * 5 === 0)",
    reviewed: false
  },
  {
    id: "aiml-03-q04",
    loId: "aiml-03-lo01",
    type: "numeric",
    difficulty: 2,
    stem: "What is the Euclidean ($L_2$) norm of the 3D vector $\\mathbf{v} = [3.0, 4.0, 12.0]$?",
    options: [
      { id: "a", text: "13.0" },
      { id: "b", text: "19.0" },
      { id: "c", text: "144.0" },
      { id: "d", text: "169.0" }
    ],
    answer: ["a"],
    explanation: "\\|v\\|_2 = sqrt(3^2 + 4^2 + 12^2) = sqrt(9 + 16 + 144) = sqrt(169) = 13.0.",
    noteRef: "aiml-03-lo01",
    verify: "(Math.sqrt(3*3 + 4*4 + 12*12) === 13)",
    reviewed: false
  },

  // LO02
  {
    id: "aiml-03-q05",
    loId: "aiml-03-lo02",
    type: "single",
    difficulty: 1,
    stem: "What condition must be satisfied for matrix multiplication $\\mathbf{A} \\mathbf{B}$ to be mathematically defined?",
    options: [
      { id: "a", text: "The number of columns in $\\mathbf{A}$ must equal the number of rows in $\\mathbf{B}$." },
      { id: "b", text: "Both matrices must have identical square dimensions $(N, N)$." },
      { id: "c", text: "Matrix $\\mathbf{A}$ must have more rows than matrix $\\mathbf{B}$." },
      { id: "d", text: "The determinants of both matrices must equal 1." }
    ],
    answer: ["a"],
    explanation: "Inner dimensions must match: if A has shape (M, K), B must have shape (K, N) to allow valid vector dot products.",
    noteRef: "aiml-03-lo02",
    reviewed: false
  },
  {
    id: "aiml-03-q06",
    loId: "aiml-03-lo02",
    type: "single",
    difficulty: 2,
    stem: "Why is matrix multiplication generally described as non-commutative?",
    options: [
      { id: "a", text: "Because in general, $\\mathbf{A}\\mathbf{B} \\neq \\mathbf{B}\\mathbf{A}$, and often $\\mathbf{B}\\mathbf{A}$ is not even dimensionally defined." },
      { id: "b", text: "Because matrix products cannot be inverted." },
      { id: "c", text: "Because multiplication only works on row vectors." },
      { id: "d", text: "Because scalar constants cannot be factored out." }
    ],
    answer: ["a"],
    explanation: "Multiplying A by B applies transformation B followed by A. Reversing the order produces different spatial transformations.",
    noteRef: "aiml-03-lo02",
    reviewed: false
  },
  {
    id: "aiml-03-q07",
    loId: "aiml-03-lo02",
    type: "scenario",
    difficulty: 2,
    stem: "A neural network layer receives a mini-batch matrix $\\mathbf{X}$ of shape (32, 128) and applies weight matrix $\\mathbf{W}$ to produce hidden activations $\\mathbf{H}$ of shape (32, 64). What must be the shape of $\\mathbf{W}$?",
    options: [
      { id: "a", text: "(128, 64)" },
      { id: "b", text: "(64, 128)" },
      { id: "c", text: "(32, 64)" },
      { id: "d", text: "(128, 32)" }
    ],
    answer: ["a"],
    explanation: "(32, 128) @ (128, 64) produces (32, 64). Inner dimension 128 contracts, leaving outer dimensions (32, 64).",
    noteRef: "aiml-03-lo02",
    reviewed: false
  },
  {
    id: "aiml-03-q08",
    loId: "aiml-03-lo02",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following algebraic properties hold true for matrix transposition?",
    options: [
      { id: "a", text: "$(\\mathbf{A}^T)^T = \\mathbf{A}$" },
      { id: "b", text: "$(\\mathbf{A} \\mathbf{B})^T = \\mathbf{B}^T \\mathbf{A}^T$" },
      { id: "c", text: "$(\\mathbf{A} + \\mathbf{B})^T = \\mathbf{A}^T + \\mathbf{B}^T$" },
      { id: "d", text: "$(\\mathbf{A} \\mathbf{B})^T = \\mathbf{A}^T \\mathbf{B}^T$" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Transposing a product reverses the multiplication order: (AB)^T = B^T A^T. Options a, b, and c are true mathematical identities.",
    noteRef: "aiml-03-lo02",
    reviewed: false
  },

  // LO03
  {
    id: "aiml-03-q09",
    loId: "aiml-03-lo03",
    type: "single",
    difficulty: 1,
    stem: "In Bayes' Theorem $P(A | B) = \\frac{P(B | A) P(A)}{P(B)}$, what is the term $P(A)$ called?",
    options: [
      { id: "a", text: "The Prior probability" },
      { id: "b", text: "The Posterior probability" },
      { id: "c", text: "The Likelihood function" },
      { id: "d", text: "The Marginal evidence" }
    ],
    answer: ["a"],
    explanation: "P(A) represents our initial baseline belief in hypothesis A before observing any empirical evidence B.",
    noteRef: "aiml-03-lo03",
    reviewed: false
  },
  {
    id: "aiml-03-q10",
    loId: "aiml-03-lo03",
    type: "single",
    difficulty: 2,
    stem: "What does the 'Likelihood' term $P(B | A)$ quantify in Bayesian inference?",
    options: [
      { id: "a", text: "The probability of observing evidence $B$ given that hypothesis $A$ is true." },
      { id: "b", text: "The overall frequency of hypothesis $A$ across the entire universe." },
      { id: "c", text: "The error rate of our hardware sensor." },
      { id: "d", text: "The probability of hypothesis $A$ given that evidence $B$ failed." }
    ],
    answer: ["a"],
    explanation: "Likelihood evaluates how consistent the observed data B is under the assumption that hypothesis A holds true.",
    noteRef: "aiml-03-lo03",
    reviewed: false
  },
  {
    id: "aiml-03-q11",
    loId: "aiml-03-lo03",
    type: "scenario",
    difficulty: 2,
    stem: "A medical test has 99% sensitivity $P(+|D)=0.99$ and 95% specificity $P(-|\\neg D)=0.95$. A rare disease has prior prevalence $P(D)=0.001$. What is the marginal probability $P(+)$ of testing positive?",
    options: [
      { id: "a", text: "P(+) = 0.99*0.001 + 0.05*0.999 = 0.00099 + 0.04995 = 0.05094 (about 5.1%)" },
      { id: "b", text: "P(+) = 0.99 (99%)" },
      { id: "c", text: "P(+) = 0.001 (0.1%)" },
      { id: "d", text: "P(+) = 0.50 (50%)" }
    ],
    answer: ["a"],
    explanation: "Total probability integrates true positives (0.99 * 0.001) and false positives (0.05 * 0.999) across the population.",
    noteRef: "aiml-03-lo03",
    verify: "Math.abs((0.99 * 0.001 + 0.05 * 0.999) - 0.05094) < 0.0001",
    reviewed: false
  },
  {
    id: "aiml-03-q12",
    loId: "aiml-03-lo03",
    type: "numeric",
    difficulty: 3,
    stem: "Using the values above ($P(D)=0.001$, $P(+|D)=0.99$, $P(+)=0.05094$), what is the posterior probability $P(D|+)$ that a person with a positive test actually has the disease?",
    options: [
      { id: "a", text: "0.0194 (about 1.94%)" },
      { id: "b", text: "0.9900 (99%)" },
      { id: "c", text: "0.5000 (50%)" },
      { id: "d", text: "0.1000 (10%)" }
    ],
    answer: ["a"],
    explanation: "P(D|+) = (0.99 * 0.001) / 0.05094 = 0.00099 / 0.05094 ≈ 0.0194. Despite 99% test accuracy, rare prevalence makes false positives dominate.",
    noteRef: "aiml-03-lo03",
    verify: "Math.abs(((0.99 * 0.001) / 0.05094) - 0.01943) < 0.001",
    reviewed: false
  },

  // LO04
  {
    id: "aiml-03-q13",
    loId: "aiml-03-lo04",
    type: "single",
    difficulty: 1,
    stem: "Why does sample variance divide by $N-1$ instead of $N$ in standard statistics?",
    options: [
      { id: "a", text: "To correct for sample bias (Bessel's correction) since deviations are measured against the sample mean rather than the true population mean." },
      { id: "b", text: "Because Python 0-indexed arrays have length $N-1$." },
      { id: "c", text: "To account for float rounding precision." },
      { id: "d", text: "To eliminate negative variance values." }
    ],
    answer: ["a"],
    explanation: "Dividing by N-1 compensates for using the sample mean, ensuring the sample variance is an unbiased estimator of true population variance.",
    noteRef: "aiml-03-lo04",
    reviewed: false
  },
  {
    id: "aiml-03-q14",
    loId: "aiml-03-lo04",
    type: "single",
    difficulty: 2,
    stem: "What information is captured along the diagonal of a $D \\times D$ Covariance Matrix $\\Sigma$?",
    options: [
      { id: "a", text: "The individual variances $\\sigma_i^2$ of each respective feature." },
      { id: "b", text: "The mean values of each feature." },
      { id: "c", text: "All zeros." },
      { id: "d", text: "The eigenvalues of the dataset." }
    ],
    answer: ["a"],
    explanation: "The covariance of a feature with itself is its variance: Cov(X_i, X_i) = Var(X_i). Thus diagonal entries are feature variances.",
    noteRef: "aiml-03-lo04",
    reviewed: false
  },
  {
    id: "aiml-03-q15",
    loId: "aiml-03-lo04",
    type: "scenario",
    difficulty: 2,
    stem: "Two features $X$ (house square footage) and $Y$ (sale price) have a positive covariance of $+450,000$. What does this positive sign indicate?",
    options: [
      { id: "a", text: "Larger houses generally associate with higher sale prices." },
      { id: "b", text: "Larger houses cause higher tax penalties." },
      { id: "c", text: "The price decreases as footage increases." },
      { id: "d", text: "Square footage cannot be used in linear regression." }
    ],
    answer: ["a"],
    explanation: "Positive covariance indicates that both variables tend to increase and decrease together.",
    noteRef: "aiml-03-lo04",
    reviewed: false
  },
  {
    id: "aiml-03-q16",
    loId: "aiml-03-lo04",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following statements regarding variance and standard deviation are mathematically accurate?",
    options: [
      { id: "a", text: "Standard deviation shares the exact same physical measurement units as the underlying feature data." },
      { id: "b", text: "Variance is always non-negative ($\\sigma^2 \\ge 0$)." },
      { id: "c", text: "If all samples in a dataset have identical values, variance is exactly 0." },
      { id: "d", text: "Variance can be negative if data points lie below zero." }
    ],
    answer: ["a", "b", "c"],
    explanation: "Variance squares deviations and is strictly non-negative; standard deviation takes the square root, returning to original feature units.",
    noteRef: "aiml-03-lo04",
    reviewed: false
  },

  // LO05
  {
    id: "aiml-03-q17",
    loId: "aiml-03-lo05",
    type: "single",
    difficulty: 1,
    stem: "Under a Gaussian Normal distribution, approximately what percentage of all observations fall within $\\pm 1$ standard deviation of the mean?",
    options: [
      { id: "a", text: "68.27%" },
      { id: "b", text: "95.45%" },
      { id: "c", text: "50.00%" },
      { id: "d", text: "99.73%" }
    ],
    answer: ["a"],
    explanation: "The empirical 68-95-99.7 rule specifies that approximately 68.27% of observations lie within 1 standard deviation of the mean.",
    noteRef: "aiml-03-lo05",
    reviewed: false
  },
  {
    id: "aiml-03-q18",
    loId: "aiml-03-lo05",
    type: "single",
    difficulty: 2,
    stem: "What mathematical transformation converts an arbitrary Normal distribution $\\mathcal{N}(\\mu, \\sigma^2)$ into the Standard Normal form $\\mathcal{N}(0, 1)$?",
    options: [
      { id: "a", text: "Z-score standardization: $z = \\frac{x - \\mu}{\\sigma}$." },
      { id: "b", text: "Min-Max normalization: $\\frac{x - \\min}{\\max - \\min}$." },
      { id: "c", text: "Logarithmic transformation: $\\ln(x)$." },
      { id: "d", text: "Softmax scaling." }
    ],
    answer: ["a"],
    explanation: "Subtracting the mean centers the distribution at 0; dividing by standard deviation scales variance to exactly 1.",
    noteRef: "aiml-03-lo05",
    reviewed: false
  },
  {
    id: "aiml-03-q19",
    loId: "aiml-03-lo05",
    type: "scenario",
    difficulty: 2,
    stem: "A student scores 85 on an ML exam with mean 70 and standard deviation 10. What is their z-score, and how is it interpreted?",
    options: [
      { id: "a", text: "z = +1.5, meaning their score is 1.5 standard deviations above the class mean." },
      { id: "b", text: "z = +15, meaning they scored 15 points above passing." },
      { id: "c", text: "z = 0.85, representing their percentile rank." },
      { id: "d", text: "z = -1.5, meaning their score was below average." }
    ],
    answer: ["a"],
    explanation: "z = (85 - 70) / 10 = +1.5. Positive z-scores indicate performance above the sample mean.",
    noteRef: "aiml-03-lo05",
    verify: "((85 - 70) / 10 === 1.5)",
    reviewed: false
  },
  {
    id: "aiml-03-q20",
    loId: "aiml-03-lo05",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following properties describe a Gaussian (Normal) probability distribution?",
    options: [
      { id: "a", text: "The distribution is completely symmetric around its mean $\\mu$" },
      { id: "b", text: "Mean, median, and mode are all equal at the peak" },
      { id: "c", text: "The total area under the probability density curve equals 1.0" },
      { id: "d", text: "Values outside $\\mu \\pm 3\\sigma$ can never mathematically occur" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Gaussian distributions have symmetric tails with unit total area. Tail probabilities extend asymptotically to infinity, so extreme values can occur.",
    noteRef: "aiml-03-lo05",
    reviewed: false
  },

  // LO06
  {
    id: "aiml-03-q21",
    loId: "aiml-03-lo06",
    type: "single",
    difficulty: 1,
    stem: "In calculus, what does the first derivative $f'(x)$ represent geometrically?",
    options: [
      { id: "a", text: "The slope of the tangent line to the curve at point $x$." },
      { id: "b", text: "The total area enclosed beneath the function curve." },
      { id: "c", text: "The curvature of the coordinate axis." },
      { id: "d", text: "The distance from the origin." }
    ],
    answer: ["a"],
    explanation: "The derivative represents the instantaneous slope of the function at that exact point.",
    noteRef: "aiml-03-lo06",
    reviewed: false
  },
  {
    id: "aiml-03-q22",
    loId: "aiml-03-lo06",
    type: "single",
    difficulty: 2,
    stem: "If the derivative of a cost function at weight $w=5$ is $L'(5) = +4.0$, how should gradient descent adjust $w$ to reduce cost?",
    options: [
      { id: "a", text: "Decrease $w$ (move in the negative direction)." },
      { id: "b", text: "Increase $w$ (move in the positive direction)." },
      { id: "c", text: "Keep $w$ unchanged; the function has converged." },
      { id: "d", text: "Reset $w$ to zero." }
    ],
    answer: ["a"],
    explanation: "Because the slope is positive, increasing w increases loss. Therefore, gradient descent moves opposite the slope: w_new = w - lr * (+4.0).",
    noteRef: "aiml-03-lo06",
    reviewed: false
  },
  {
    id: "aiml-03-q23",
    loId: "aiml-03-lo06",
    type: "scenario",
    difficulty: 2,
    stem: "Consider loss function $L(w) = 3w^2 - 12w + 7$. What is the analytical derivative $\\frac{dL}{dw}$?",
    options: [
      { id: "a", text: "6w - 12" },
      { id: "b", text: "3w - 12" },
      { id: "c", text: "6w^2 - 12" },
      { id: "d", text: "6w" }
    ],
    answer: ["a"],
    explanation: "By the power rule, d/dw (3w^2) = 6w, d/dw (-12w) = -12, and derivative of constant 7 is 0. Result is 6w - 12.",
    noteRef: "aiml-03-lo06",
    reviewed: false
  },
  {
    id: "aiml-03-q24",
    loId: "aiml-03-lo06",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following derivative calculations are correct based on fundamental calculus rules?",
    options: [
      { id: "a", text: "$\\frac{d}{dx} (5x^3) = 15x^2$" },
      { id: "b", text: "$\\frac{d}{dx} (\\ln(x)) = \\frac{1}{x}$" },
      { id: "c", text: "$\\frac{d}{dx} (e^x) = e^x$" },
      { id: "d", text: "$\\frac{d}{dx} (x^4) = 4x^4$" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Power rule gives d/dx (x^4) = 4x^3, so option d is false. Options a, b, and c are correct calculus identities.",
    noteRef: "aiml-03-lo06",
    reviewed: false
  },

  // LO07
  {
    id: "aiml-03-q25",
    loId: "aiml-03-lo07",
    type: "single",
    difficulty: 1,
    stem: "How is a partial derivative $\\frac{\\partial f}{\\partial x}$ computed when a function depends on multiple variables $f(x, y)$?",
    options: [
      { id: "a", text: "Differentiate with respect to $x$ while treating $y$ as a fixed constant." },
      { id: "b", text: "Differentiate both $x$ and $y$ simultaneously and add the results." },
      { id: "c", text: "Divide $f(x)$ by $f(y)$." },
      { id: "d", text: "Replace $y$ with zero before differentiating." }
    ],
    answer: ["a"],
    explanation: "Partial differentiation isolates one variable, holding all other variables constant.",
    noteRef: "aiml-03-lo07",
    reviewed: false
  },
  {
    id: "aiml-03-q26",
    loId: "aiml-03-lo07",
    type: "single",
    difficulty: 2,
    stem: "What geometric direction does the gradient vector $\\nabla f(\\mathbf{w})$ point toward on a loss surface?",
    options: [
      { id: "a", text: "The direction of steepest ascent (greatest rate of increase)." },
      { id: "b", text: "The direction of steepest descent." },
      { id: "c", text: "Tangent to the contour lines with zero rate of change." },
      { id: "d", text: "Directly toward the coordinate origin." }
    ],
    answer: ["a"],
    explanation: "The gradient points in the direction of greatest increase. Gradient descent moves in the opposite direction (-grad) to minimize loss.",
    noteRef: "aiml-03-lo07",
    reviewed: false
  },
  {
    id: "aiml-03-q27",
    loId: "aiml-03-lo07",
    type: "scenario",
    difficulty: 2,
    stem: "You have cost function $f(x, y) = 2x^2 + 3y^2$. At point $(x=1, y=2)$, what is the gradient vector $\\nabla f$?",
    options: [
      { id: "a", text: "[4, 12]" },
      { id: "b", text: "[2, 6]" },
      { id: "c", text: "[4, 6]" },
      { id: "d", text: "[8, 12]" }
    ],
    answer: ["a"],
    explanation: "df/dx = 4x; at x=1, df/dx = 4. df/dy = 6y; at y=2, df/dy = 12. Gradient vector is [4, 12].",
    noteRef: "aiml-03-lo07",
    verify: "(4 * 1 === 4 && 6 * 2 === 12)",
    reviewed: false
  },
  {
    id: "aiml-03-q28",
    loId: "aiml-03-lo07",
    type: "multi",
    difficulty: 3,
    stem: "Which of the following statements about gradient vectors $\\nabla L(\\mathbf{w})$ are true?",
    options: [
      { id: "a", text: "The length (norm) of the gradient vector indicates how steep the slope is" },
      { id: "b", text: "At an unconstrained local minimum, the gradient vector is the zero vector $\\mathbf{0}$" },
      { id: "c", text: "The gradient vector is orthogonal to the contour lines (level curves) of the function" },
      { id: "d", text: "The gradient vector only exists for linear functions" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Gradients are orthogonal to level curves, zero at local extrema, and their magnitude indicates steepness.",
    noteRef: "aiml-03-lo07",
    reviewed: false
  },

  // LO08
  {
    id: "aiml-03-q29",
    loId: "aiml-03-lo08",
    type: "single",
    difficulty: 1,
    stem: "In machine learning backpropagation, what calculus principle allows errors to be propagated backwards through nested function layers?",
    options: [
      { id: "a", text: "The Chain Rule of differentiation." },
      { id: "b", text: "The Central Limit Theorem." },
      { id: "c", text: "L'Hopital's Rule." },
      { id: "d", text: "Euler's Identity." }
    ],
    answer: ["a"],
    explanation: "The Chain Rule calculates derivatives of composite functions by multiplying intermediate Jacobian derivatives.",
    noteRef: "aiml-03-lo08",
    reviewed: false
  },
  {
    id: "aiml-03-q30",
    loId: "aiml-03-lo08",
    type: "single",
    difficulty: 2,
    stem: "If loss $L$ depends on $u$, and $u$ depends on weight $w$, how is $\\frac{\\partial L}{\\partial w}$ expressed via the Chain Rule?",
    options: [
      { id: "a", text: "$\\frac{\\partial L}{\\partial w} = \\frac{\\partial L}{\\partial u} \\cdot \\frac{\\partial u}{\\partial w}$" },
      { id: "b", text: "$\\frac{\\partial L}{\\partial w} = \\frac{\\partial L}{\\partial u} + \\frac{\\partial u}{\\partial w}$" },
      { id: "c", text: "$\\frac{\\partial L}{\\partial w} = \\frac{\\partial L}{\\partial u} / \\frac{\\partial u}{\\partial w}$" },
      { id: "d", text: "$\\frac{\\partial L}{\\partial w} = (\\frac{\\partial L}{\\partial u})^2$" }
    ],
    answer: ["a"],
    explanation: "The rate of change of L with respect to w is the product of the rate of change of L with respect to u and u with respect to w.",
    noteRef: "aiml-03-lo08",
    reviewed: false
  },
  {
    id: "aiml-03-q31",
    loId: "aiml-03-lo08",
    type: "scenario",
    difficulty: 2,
    stem: "A neuron computes $z = w x$. The loss is $L = \\frac{1}{2}(z - y)^2$. If $x = 3.0$, $w = 2.0$, and $y = 4.0$, what is the gradient $\\frac{\\partial L}{\\partial w}$?",
    options: [
      { id: "a", text: "dL/dw = (6.0 - 4.0) * 3.0 = +6.0" },
      { id: "b", text: "dL/dw = +2.0" },
      { id: "c", text: "dL/dw = +12.0" },
      { id: "d", text: "dL/dw = -6.0" }
    ],
    answer: ["a"],
    explanation: "z = 2*3 = 6. dL/dz = z - y = 6 - 4 = 2. dz/dw = x = 3. By Chain Rule, dL/dw = (dL/dz)*(dz/dw) = 2 * 3 = 6.0.",
    noteRef: "aiml-03-lo08",
    verify: "((2.0 * 3.0 - 4.0) * 3.0 === 6.0)",
    reviewed: false
  },
  {
    id: "aiml-03-q32",
    loId: "aiml-03-lo08",
    type: "multi",
    difficulty: 3,
    stem: "Why does the multivariate Chain Rule sum over multiple paths when calculating $\\frac{\\partial L}{\\partial x}$?",
    options: [
      { id: "a", text: "Because variable $x$ may feed into multiple intermediate nodes that each contribute to the final loss $L$" },
      { id: "b", text: "To capture all paths of causal influence through the computational graph" },
      { id: "c", text: "Because matrix products are strictly associative" },
      { id: "d", text: "To convert partial derivatives into complex numbers" }
    ],
    answer: ["a", "b"],
    explanation: "When a variable fans out to multiple downstream nodes, total derivative accumulates the sum of gradient products across all paths.",
    noteRef: "aiml-03-lo08",
    reviewed: false
  },

  // LO09 (Extension)
  {
    id: "aiml-03-q33",
    loId: "aiml-03-lo09",
    type: "single",
    difficulty: 2,
    stem: "What geometric relationship defines an eigenvector $\\mathbf{v}$ and eigenvalue $\\lambda$ of matrix $\\mathbf{A}$?",
    options: [
      { id: "a", text: "Matrix multiplication stretches $\\mathbf{v}$ by scalar $\\lambda$ without rotating its spatial direction: $\\mathbf{A}\\mathbf{v} = \\lambda \\mathbf{v}$." },
      { id: "b", text: "Vector $\\mathbf{v}$ is perpendicular to all rows of $\\mathbf{A}$." },
      { id: "c", text: "$\\mathbf{A}$ and $\\mathbf{v}$ have identical row dimensions." },
      { id: "d", text: "The length of vector $\\mathbf{v}$ always equals 0." }
    ],
    answer: ["a"],
    explanation: "An eigenvector maintains its exact direction when transformed by matrix A, being scaled only by factor lambda.",
    noteRef: "aiml-03-lo09",
    reviewed: false
  },
  {
    id: "aiml-03-q34",
    loId: "aiml-03-lo09",
    type: "single",
    difficulty: 3,
    stem: "What does a matrix determinant $\\det(\\mathbf{A}) = 0$ signify about the geometric transformation represented by $\\mathbf{A}$?",
    options: [
      { id: "a", text: "The transformation collapses volume into a lower-dimensional subspace, meaning the matrix is singular and cannot be inverted." },
      { id: "b", text: "The transformation reflects vectors across the origin without changing volume." },
      { id: "c", text: "The matrix contains only positive numbers." },
      { id: "d", text: "The transformation preserves Euclidean distances perfectly." }
    ],
    answer: ["a"],
    explanation: "A zero determinant indicates that space is squashed to lower dimensions, making the transformation non-invertible.",
    noteRef: "aiml-03-lo09",
    reviewed: false
  },
  {
    id: "aiml-03-q35",
    loId: "aiml-03-lo09",
    type: "numeric",
    difficulty: 2,
    stem: "What is the determinant of the 2x2 matrix $\\begin{pmatrix} 4 & 2 \\\\ 1 & 3 \\end{pmatrix}$?",
    options: [
      { id: "a", text: "10" },
      { id: "b", text: "14" },
      { id: "c", text: "12" },
      { id: "d", text: "2" }
    ],
    answer: ["a"],
    explanation: "det = (4 * 3) - (2 * 1) = 12 - 2 = 10.",
    noteRef: "aiml-03-lo09",
    verify: "(4 * 3 - 2 * 1 === 10)",
    reviewed: false
  }
];

balanceAndSave('ai-ml', 'math-you-actually-need', ai03Objectives, ai03Bank);

console.log('✅ ai-03 complete.');

