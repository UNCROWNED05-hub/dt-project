import fs from 'fs';
import path from 'path';

const FORBIDDEN_PATTERNS = [
  /\btext-black\b/,
  /\btext-white\b/,
  /\btext-gray-/,
  /\btext-slate-/,
  /\btext-zinc-/,
  /\bbg-white\b/,
  /\bbg-black\b/,
  /\btext-ink-/,
  /\bbg-paper-/,
];

const SCAN_DIRS = ['src/components', 'src/app'];

function scanDir(dir, errors) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath, errors);
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
      // Exclude tests or mock configs if any
      const content = fs.readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, idx) => {
        // Skip comment lines or raw SVG paths if explicitly allowed
        if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;

        for (const pattern of FORBIDDEN_PATTERNS) {
          if (pattern.test(line)) {
            errors.push({
              file: fullPath,
              line: idx + 1,
              pattern: pattern.toString(),
              content: line.trim(),
            });
          }
        }
      });
    }
  }
}

const errors = [];
for (const d of SCAN_DIRS) {
  scanDir(d, errors);
}

if (errors.length > 0) {
  console.error(`\n❌ Found ${errors.length} forbidden hardcoded color usage(s):`);
  errors.slice(0, 20).forEach((err) => {
    console.error(`  ${err.file}:${err.line} matches ${err.pattern}`);
    console.error(`    > ${err.content}`);
  });
  if (errors.length > 20) {
    console.error(`  ... and ${errors.length - 20} more.`);
  }
  process.exit(1);
} else {
  console.log('\n✅ Zero forbidden color classes detected! All components adhere strictly to semantic tokens.');
}
