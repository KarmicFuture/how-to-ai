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

1. Add website → **Node.js web app** (GitHub or ZIP).
2. Use these settings:
   - **Node version:** 18, 20, or 22
   - **Build command:** `npm run build`
   - **Start command:** `npm start`
   - **Output directory:** `dist`
3. Redeploy after each push (or enable auto-deploy if your plan supports it).

`package.json` builds the static site into `dist/` and serves it on port **3000**.

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
