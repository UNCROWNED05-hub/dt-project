import fs from 'fs';

function fixFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const fixed = lines.map(line => {
    const trimmed = line.trim();
    if (
      trimmed.startsWith('"sec-') ||
      trimmed.startsWith('"aiml-') ||
      trimmed.startsWith('"iot-') ||
      trimmed === '`,' ||
      trimmed === '`' ||
      trimmed.endsWith('`;') ||
      trimmed.startsWith('```') ||
      trimmed.startsWith('\\`\\`\\`')
    ) {
      return line;
    }
    // Replace unescaped backticks with escaped backticks
    return line.replace(/(?<!\\)`/g, '\\`');
  });
  fs.writeFileSync(filePath, fixed.join('\n'), 'utf8');
  console.log(`Fixed backticks in ${filePath}`);
}

const target = process.argv[2] || 'scripts/generate-sec-batch5.mjs';
fixFile(target);
