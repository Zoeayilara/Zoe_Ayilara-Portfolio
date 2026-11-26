# Zoe Ayilara, portfolio

Live: https://zoeayilara.github.io/Zoe_Ayilara-Portfolio/

React 18 + Vite, plain CSS with design tokens, no UI framework. Around 60 KB of JS gzipped.

## Things worth poking at

- The hero console makes a real `fetch` to `/api/*.json` on this site and shows the real status and timing.
- The StudyCircle explorer: pick an endpoint to see which services the request touches.
- Press <kbd>`</kbd> anywhere for a terminal. Try `help`, `curl /v1/now.json` or `sudo hire zoe`.

## Contact form

`POST /api/contact` is a Netlify Function (`netlify/functions/contact.mjs`) that sends mail through [Resend](https://resend.com). The visitor's address is set as Reply-To, so replying from your inbox goes straight to them.

Logic lives in `lib/contact.js`: validation, a honeypot plus a minimum fill time for bots, a per-IP rate limit, and HTML-escaped email bodies. Tests: `npm test`.

Environment variables (Netlify → Site configuration → Environment variables):

| Name | Required | What it does |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | Resend API key with sending access |
| `CONTACT_TO_EMAIL` | yes | Where messages are delivered |
| `CONTACT_FROM` | after adding a domain | e.g. `Zoe Ayilara <hello@yourdomain.com>` |
| `CONTACT_CONFIRM` | optional | `true` sends the visitor a confirmation (needs `CONTACT_FROM`) |

## Working on it

```bash
npm install
npm run dev       # site at http://localhost:5173/Zoe_Ayilara-Portfolio/
npx netlify dev   # site + /api/contact together
npm test
```

Netlify builds and deploys on every push to `main` (settings in `netlify.toml`). The built copy at the repo root is for the old GitHub Pages URL; refresh it with `npm run release`.

Source lives in `src/`. All copy and project data is in `src/data/profile.js`. Motion lives in `src/motion/` and `src/components/HeroField.jsx`, and all of it switches off when the visitor has reduced motion turned on.
