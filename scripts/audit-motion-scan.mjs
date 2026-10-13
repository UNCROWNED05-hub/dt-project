import fs from 'fs';
import path from 'path';

function findFiles(dir, exts = ['.ts', '.tsx', '.js', '.jsx', '.css', '.mjs']) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (item === 'node_modules' || item === '.next' || item === '.git') continue;
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      files = files.concat(findFiles(full, exts));
    } else if (exts.includes(path.extname(full))) {
      files.push(full);
    }
  }
  return files;
}

const patterns = [
  /setInterval/g,
  /setTimeout/g,
  /autoplay/gi,
  /repeat:\s*-1/g,
  /animation-iteration-count:\s*infinite/g,
  /infinite/gi,
  /requestAnimationFrame/g,
  /marquee/gi,
  /ticker/gi,
];

const files = findFiles(path.resolve(process.cwd(), 'src'));
const results = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    for (const pat of patterns) {
      if (pat.test(line)) {
        results.push({
          file: path.relative(process.cwd(), file),
          line: idx + 1,
          code: line.trim(),
          match: pat.toString(),
        });
        break;
      }
    }
  });
}

console.log(`Found ${results.length} matches in src:`);
results.forEach((r) => {
  console.log(`${r.file}:${r.line} [${r.match}] -> ${r.code}`);
});
