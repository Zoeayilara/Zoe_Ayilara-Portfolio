import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Two deploy targets share this config:
// - Netlify (primary): served from the domain root, with /api/contact.
// - GitHub Pages (legacy): served from /Zoe_Ayilara-Portfolio/.
const onNetlify = Boolean(process.env.NETLIFY);
const base = onNetlify ? '/' : '/Zoe_Ayilara-Portfolio/';

const siteUrl = (
  process.env.SITE_URL ||
  (onNetlify && process.env.URL) ||
  'https://zoeayilara.github.io/Zoe_Ayilara-Portfolio'
).replace(/\/$/, '');

// Fills __SITE_URL__ in index.html and writes robots.txt + sitemap.xml
// for whichever domain we're building for.
function siteFiles() {
  return {
    name: 'site-files',
    transformIndexHtml: { order: 'pre', handler: (html) => html.replaceAll('__SITE_URL__', siteUrl) },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`,
      });
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}/</loc></url>\n</urlset>\n`,
      });
    },
  };
}

export default defineConfig({
  root: 'src',
  base,
  publicDir: '../public',
  plugins: [react(), siteFiles()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    assetsInlineLimit: 2048,
  },
});
