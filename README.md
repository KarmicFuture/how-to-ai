# How to AI

Karmic Futures — helping local businesses grow in our AI world.

Separate from the birthday bash project (`vinus-birthday`).

## Preview

```bash
npm install
npm run dev
```

Visit http://localhost:3000

Or without Node: `python3 -m http.server 5180`

## Deploy on Hostinger (Node.js web app)

A live **503** almost always means the Node process never started (wrong entry file / wrong framework / crash on boot). The site itself is fine locally.

**Important:** This app is CommonJS (no `"type": "module"`). Hostinger’s build preload uses `require()` and breaks if the project is ESM.

1. Add website → **Deploy Web App** (GitHub: `KarmicFuture/how-to-ai`).
2. **Settings & Redeploy** — use exactly:
   - **Framework:** Express.js (not React/Vite/Other if Express is available)
   - **Node version:** 20
   - **Build command:** `npm run build`
   - **Start command:** `npm start`
   - **Entry file:** `app.js` ← Hostinger’s default; must exist (we ship it)
   - **Output directory:** leave **empty** (or `.`). Do **not** set `dist` for this Express app — that can leave `node_modules` behind and crash start.
3. Environment variables (hPanel): SMTP vars only; do **not** set `PORT` yourself.
4. Open **Deployments** → latest deploy → read the **log**. If start failed, the reason is there.
5. After a successful deploy, click **Restart**, then smoke-test:
   - `https://www.karmicfutures.com/health` → `{"ok":true,...}`
   - `https://www.karmicfutures.com/api/workshop/sessions` → JSON

`npm run build` also copies `app.js` + `server.js` + `lib/` into `dist/` as a fallback. Preferred Hostinger mode is still: entry `app.js` at repo root, empty output directory.

## Offer

- Free 1-hour consultation (assessment + tool advice)
- $99/hour in 4-hour blocks; custom SOW priced TBD
- Stages: See → Speak → Reach → Compound
- Rates page: `rates.html`

## How to AI (blog)

- `how-to-ai/index.html` — blog home for non-coders
- `how-to-ai/ai-journey-map.html` — growth curve + worksheet (pencil & paper → autonomous shop)
- Guides: what AI is, how to ask, everyday uses, business without code, stay in control

## How to make money

- `make-money/paths-template.js` — reusable template for 10 AI income paths
- `make-money/index.html` — overview of the 10 ways
- `make-money/step-by-step.html` — universal playbook + weekly example
- `make-money/examples/` — worked example for each path


## Free Workshop

- Page: `workshop/index.html`
- API: `POST /api/workshop/register|verify|access` (see `server.js`)
- Registrations saved in `data/workshop-registrations.json`
- Saturdays 10–11 AM Eastern starting Aug 1, 2026
- Configure SMTP via `.env` (see `.env.example`); without SMTP, codes appear on-page for local testing

```bash
npm install
npm run dev
```
