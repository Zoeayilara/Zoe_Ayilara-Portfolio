// Copies the fresh build in dist/ to the repo root, which is what
// GitHub Pages serves. Old hashed bundles are removed first.
import { cpSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');
if (!existsSync(join(dist, 'index.html'))) {
  console.error('dist/index.html is missing. Run `npm run build` first.');
  process.exit(1);
}

for (const name of ['assets', 'api', 'index.html', 'og.png', 'favicon.svg', 'robots.txt', 'sitemap.xml']) {
  rmSync(join(root, name), { recursive: true, force: true });
}
for (const name of readdirSync(dist)) {
  cpSync(join(dist, name), join(root, name), { recursive: true });
}
console.log('Copied dist/ to the repo root. Commit and push to publish.');
