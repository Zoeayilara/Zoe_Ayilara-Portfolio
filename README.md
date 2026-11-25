# Zoe Ayilara, portfolio

Live: https://zoeayilara.github.io/Zoe_Ayilara-Portfolio/

React 18 + Vite, plain CSS with design tokens, no UI framework. Around 60 KB of JS gzipped.

## Things worth poking at

- The hero console makes a real `fetch` to `/api/*.json` on this site and shows the real status and timing.
- The StudyCircle explorer: pick an endpoint to see which services the request touches.
- Press <kbd>`</kbd> anywhere for a terminal. Try `help`, `curl /api/now.json` or `sudo hire zoe`.

## Working on it

```bash
npm install
npm run dev       # http://localhost:5173/Zoe_Ayilara-Portfolio/
npm run release   # builds, then copies dist/ to the repo root
```

GitHub Pages serves the repo root on `main`, so run `npm run release` and commit the result to publish.

Source lives in `src/`. All copy and project data is in `src/data/profile.js`.
