import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outDir = path.join(root, 'out');

if (!fs.existsSync(outDir)) {
  throw new Error('Missing out/. Run npm run build before exporting to root.');
}

function copyRecursive(from, to) {
  const stat = fs.statSync(from);

  if (stat.isDirectory()) {
    fs.mkdirSync(to, { recursive: true });
    for (const entry of fs.readdirSync(from)) {
      copyRecursive(path.join(from, entry), path.join(to, entry));
    }
    return;
  }

  fs.copyFileSync(from, to);
}

for (const entry of fs.readdirSync(outDir)) {
  // CNAME is managed in DNS, not via GitHub Pages custom-domain settings.
  if (entry === 'CNAME') {
    continue;
  }

  const target = path.join(root, entry);
  fs.rmSync(target, { recursive: true, force: true });
  copyRecursive(path.join(outDir, entry), target);
}
