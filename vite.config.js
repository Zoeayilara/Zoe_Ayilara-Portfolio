import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Source lives in src/ (including index.html). The repo root holds the
// built site because GitHub Pages serves this repo's main branch root.
export default defineConfig({
  root: 'src',
  base: '/Zoe_Ayilara-Portfolio/',
  publicDir: '../public',
  plugins: [react()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    assetsInlineLimit: 2048,
  },
});
