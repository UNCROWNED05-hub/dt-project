/**
 * scripts/lint-wording.mjs
 * Static wording linter enforcing truth-in-advertising guidelines for Task 5A:
 * - Forbidden phrases: "from this video", "from the video", "transcript"
 * - Permitted wording: "Aligned to this video's outline", "Covers X of Y objectives"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const SCAN_DIRS = [
  path.join(ROOT_DIR, 'src'),
  path.join(ROOT_DIR, 'content'),
];

const FORBIDDEN_PATTERNS = [
  { regex: /\bfrom this video\b/i, label: 'from this video' },
  { regex: /\bfrom the video\b/i, label: 'from the video' },
  { regex: /\btranscript\b/i, label: 'transcript' },
];

const IGNORE_EXTENSIONS = ['.png', '.jpg', '.svg', '.json', '.lock'];
// Allow this script itself and documentation audit files to mention the forbidden phrases
const IGNORE_FILES = [
  'lint-wording.mjs',
  'REQUIREMENTS.md',
  'implementation_plan.md',
  'TASK_5A.md',
];

function scanDirectory(dir, issues = []) {
  if (!fs.existsSync(dir)) return issues;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(ROOT_DIR, fullPath).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git') continue;
      scanDirectory(fullPath, issues);
    } else {
      if (IGNORE_FILES.some((f) => relPath.endsWith(f))) continue;
      if (IGNORE_EXTENSIONS.some((ext) => relPath.endsWith(ext))) continue;

      const content = fs.readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, lineNum) => {
        // Skip comment lines in scripts or tests that explicitly test for forbidden words
        if (line.includes('FORBIDDEN') || line.includes('wording-lint-ignore')) return;

        for (const pattern of FORBIDDEN_PATTERNS) {
          if (pattern.regex.test(line)) {
            issues.push({
              file: relPath,
              line: lineNum + 1,
              match: pattern.label,
              snippet: line.trim(),
            });
          }
        }
      });
    }
  }

  return issues;
}

console.log('=== Task 5A Static Wording Linter ===\n');
let allIssues = [];
for (const dir of SCAN_DIRS) {
  scanDirectory(dir, allIssues);
}

if (allIssues.length > 0) {
  console.error(`❌ Found ${allIssues.length} forbidden wording violations:\n`);
  for (const issue of allIssues) {
    console.error(`  - ${issue.file}:${issue.line} contains forbidden phrase "${issue.match}"`);
    console.error(`    Line: "${issue.snippet}"\n`);
  }
  process.exit(1);
} else {
  console.log('✅ Wording lint clean! Zero occurrences of "from this video", "from the video", or "transcript".');
  process.exit(0);
}
