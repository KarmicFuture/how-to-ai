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

1. Add website → **Node.js web app** / Deploy Web App (GitHub).
2. Use these settings:
   - **Node version:** 20 (or 18/22)
   - **Build command:** `npm run build`
   - **Start command:** `npm start`
   - **Application startup / entry file:** `server.js` (repo root) **or** `dist/server.js`
   - **Output directory:** `dist`
3. Environment variables (hPanel):
   - `PORT` — leave Hostinger’s value (do not hardcode)
   - Optional SMTP: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`
4. Redeploy after each push. Smoke-test: `/health` and `/api/workshop/sessions` should return JSON.

`npm run build` copies the site **plus** `server.js` and `lib/` into `dist/`, so Hostinger can start the app even when it treats `dist` as the app root. The server listens on `process.env.PORT` (Hostinger injects this).

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
