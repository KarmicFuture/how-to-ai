#!/usr/bin/env python3
"""Generate worked-example pages for each make-money path."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "make-money" / "examples"
OUT.mkdir(parents=True, exist_ok=True)

NAV = """    <nav class="nav" aria-label="Primary">
      <a class="nav-home" href="../../index.html">Home</a>
      <a href="../../index.html#stages">Stages</a>
      <div class="nav-dropdown">
        <button class="nav-dropdown-toggle" type="button" aria-expanded="false" aria-controls="how-to-ai-menu">
          How to AI
          <span class="nav-caret" aria-hidden="true"></span>
        </button>
        <div class="nav-dropdown-panel" id="how-to-ai-menu">
          <a href="../../how-to-ai/index.html">Blog home</a>
          <a href="../../how-to-ai/ai-journey-map.html">AI Journey Map</a>
          <a href="../../how-to-ai/what-ai-is.html">What AI actually is</a>
          <a href="../../how-to-ai/how-to-ask.html">How to ask AI for help</a>
          <a href="../../how-to-ai/everyday-uses.html">Everyday uses</a>
          <a href="../../how-to-ai/business-without-code.html">Business without code</a>
          <a href="../../how-to-ai/stay-in-control.html">Stay in control</a>
        </div>
      </div>
      <div class="nav-dropdown is-active">
        <button class="nav-dropdown-toggle" type="button" aria-expanded="false" aria-controls="make-money-menu">
          How to make money
          <span class="nav-caret" aria-hidden="true"></span>
        </button>
        <div class="nav-dropdown-panel" id="make-money-menu">
          <a href="../index.html">10 ways overview</a>
          <a href="../step-by-step.html">Step by step</a>
        </div>
      </div>
      <a class="nav-rates" href="../../rates.html">Rates</a>
      <a class="nav-cta" href="../../index.html#book">Book intro</a>
    </nav>"""

EXAMPLES = [
    {
        "id": "automation-consulting",
        "title": "AI automation for local businesses",
        "business": "Harbor HVAC — a 6-person heating & cooling company",
        "scene": "The owner misses evening quote requests while on jobs. By morning, two competitors have already called the homeowner back.",
        "week": [
            ("Monday — Free consult", "Walk through how leads arrive (web form, Google messages, voicemail). Count missed replies in the last 30 days."),
            ("Tuesday — Scope the block", "Agree on one workflow: new inquiry → instant friendly text → owner alert → CRM note. Quote one 4-hour block (~$396)."),
            ("Wednesday–Thursday — Build", "Connect form/SMS tools, write AI reply templates in the owner’s voice, test with fake leads."),
            ("Friday — Hand off", "Show a live demo. Leave a one-page “how it works.” Offer $150–$300/mo if they want weekly tweaks."),
        ],
        "you_do": "Set up the tools, write the message templates, test, and train the owner in under a week.",
        "they_get": "Leads answered in minutes instead of hours — without hiring a night receptionist.",
        "money": "First block ~$396. Two similar clients + light care ≈ $800–$1,200/mo.",
    },
    {
        "id": "b2b-video",
        "title": "AI-assisted short video for locals",
        "business": "Bean & Branch Café — neighborhood coffee shop",
        "scene": "They post when the owner remembers. Followers like photos, but weekday traffic is flat. They want Reels without hiring a videographer.",
        "week": [
            ("Week 1 — Sample", "Film 20 minutes of phone footage (latte pour, morning line, pastry case). Deliver 2 sample clips free or cheap to win trust."),
            ("Week 2 — Package", "Sell a monthly pack: 6 short videos + captions for $400/mo."),
            ("Ongoing — Batch day", "One afternoon: AI scripts from weekly specials, edit, caption, schedule. Reuse the same 3 formats."),
            ("Report", "Track saves, profile visits, and “was it busy after posting?” — not vanity likes alone."),
        ],
        "you_do": "Turn phone clips into a steady short-video habit with AI writing and editing help.",
        "they_get": "A reliable posting cadence that feels like their café — without living in CapCut every night.",
        "money": "One café at $400/mo; three locals ≈ $1,200/mo.",
    },
    {
        "id": "chatbots-agents",
        "title": "FAQ & booking helpers",
        "business": "Bright Smiles Dental — small private practice",
        "scene": "The front desk answers the same questions all day: hours, insurance, “do you take new patients?”, parking.",
        "week": [
            ("Day 1 — Map FAQs", "List the top 10 questions from calls and the website contact form."),
            ("Days 2–4 — Build", "Launch a site chat helper that answers those FAQs and offers “request an appointment” with name + phone."),
            ("Day 5 — Soft launch", "Staff tests for a week. Fix wrong answers. Keep a human review of appointment requests."),
            ("Month 2 — Care", "Optional $150/mo to update hours, insurance notes, and seasonal promos."),
        ],
        "you_do": "Build a narrow helper that answers the boring questions and captures booking intent.",
        "they_get": "Fewer repeat calls; after-hours visitors still leave a request instead of bouncing.",
        "money": "Setup $600–$1,000; care adds a small monthly if they want updates.",
    },
    {
        "id": "content-systems",
        "title": "AI content for local marketing",
        "business": "Ridgeview Realty — three-agent local team",
        "scene": "They know they should email past clients and post market notes. Nobody has a system, so months go silent.",
        "week": [
            ("Kickoff", "Interview for voice: warm, local, no jargon. Collect 5 past emails they liked."),
            ("System", "Create a monthly kit: 2 emails + 4 social posts + 1 “market this month” blurb — $350/mo."),
            ("Delivery", "AI drafts → you edit → they approve once → you schedule or they paste."),
            ("Compound", "Reuse listing wins into fresh posts so you’re never starting from a blank page."),
        ],
        "you_do": "Run a light content engine they can approve in minutes, not write from scratch.",
        "they_get": "Stay visible to past clients and neighbors without a full-time marketer.",
        "money": "One team $350/mo; three clients ≈ $1,000/mo.",
    },
    {
        "id": "social-management",
        "title": "AI social media for local shops",
        "business": "Nova Nails — busy nail salon",
        "scene": "Instagram is outdated. The owner takes great photos but never writes captions or posts on a schedule.",
        "week": [
            ("Audit", "Pick Instagram + Google posts. Agree on 10 posts/month for $300."),
            ("Batch", "Owner drops 15 photos in a shared folder. You write captions with AI, edit for voice, schedule."),
            ("Engage light", "Suggest 3 reply templates for common DMs (“prices?”, “walk-ins?”)."),
            ("Monthly review", "What drove bookings? Double down on that format next month."),
        ],
        "you_do": "Turn their photos into a month of posts without them living on their phone.",
        "they_get": "A filled calendar and a fresher profile that matches how good the salon actually looks.",
        "money": "Two salons + one boutique at $250–$350 each ≈ $750–$1,000/mo.",
    },
    {
        "id": "lead-followup",
        "title": "AI lead follow-up & reminders",
        "business": "ClearPath Moving — local movers",
        "scene": "Web quotes sit overnight. By the time someone calls back, the customer has booked another company.",
        "week": [
            ("Measure", "Pull last month’s form leads. How many got a same-day reply?"),
            ("Templates", "Write AI-assisted texts/emails in the dispatcher’s voice: thanks, next question, book a walkthrough."),
            ("Wire it", "Form submit → instant reply → task for the human → reminder if no response in 24 hours."),
            ("Prove it", "Compare response time and booked jobs for 30 days. Offer $150/mo to keep scripts fresh."),
        ],
        "you_do": "Make speed-to-lead automatic while humans still close the job.",
        "they_get": "Fewer cold leads; more conversations while the customer still cares.",
        "money": "Setup $400–$700; ongoing care optional.",
    },
    {
        "id": "design-packages",
        "title": "AI design packs for locals",
        "business": "Green Spoon — new juice bar opening downtown",
        "scene": "They need a menu board look, launch flyer, and a week of social graphics before opening day — budget is tight.",
        "week": [
            ("Pack sale", "Offer “Launch Kit”: menu layout + flyer + 8 social graphics for $350."),
            ("Create", "AI concepts → you refine typography and brand colors → one revision round."),
            ("Deliver", "Print-ready PDF + square/story sizes for Instagram."),
            ("Upsell", "Monthly “fresh specials” pack for $150 if the launch goes well."),
        ],
        "you_do": "Ship a finished visual kit fast, without a big branding agency fee.",
        "they_get": "A cohesive look for opening week they can actually afford.",
        "money": "Two launch kits a month ≈ $700; add refresh retainers when ready.",
    },
    {
        "id": "short-form-channels",
        "title": "Local niche short-form content",
        "business": "Your channel: “Home Fixes Under $100” for your metro area",
        "scene": "You’re not selling a client yet — you’re attracting homeowners, then offering a paid “room refresh consult” or affiliate tools.",
        "week": [
            ("Niche lock", "Pick one promise: quick, cheap, local home fixes. Film with a phone."),
            ("Batch", "AI helps outline 20 hooks. Post 3×/week for 6 weeks."),
            ("CTA", "Every video: “DM FIX for this week’s checklist” → email/SMS capture."),
            ("Monetize", "Once DMs are steady, offer a $99 virtual consult or local partner referrals."),
        ],
        "you_do": "Build attention in a narrow niche, then attach a simple offer.",
        "they_get": "n/a (this path is often your own brand) — viewers get useful tips; you get leads.",
        "money": "Early months may be $0–$300; wins look like booked consults, not ad revenue.",
    },
    {
        "id": "digital-products",
        "title": "Small digital products for a niche",
        "business": "Product: “Airbnb Turnover Checklist for Local Cleaners”",
        "scene": "You already help cleaners with AI schedules. Ten of them asked for your checklist. That’s the product.",
        "week": [
            ("Ship", "Turn your checklist + message templates into a $19 PDF/Notion pack in one weekend."),
            ("Page", "Simple checkout page. Three screenshots. Clear “who it’s for.”"),
            ("Sell", "Post in two local cleaner Facebook groups + email past clients."),
            ("Iterate", "Add a $39 “pro” version from the questions buyers ask."),
        ],
        "you_do": "Productize something you already explain repeatedly.",
        "they_get": "A ready system instead of reinventing their turnover process.",
        "money": "20 sales = $380; a small email list can repeat that monthly.",
    },
    {
        "id": "micro-saas",
        "title": "Tiny paid tools for one job",
        "business": "Tool idea: “Review Reply Helper” for local clinics",
        "scene": "Dentists hate writing Google review replies. You start by doing it manually with AI, then wrap the workflow.",
        "week": [
            ("Manual first", "Serve 5 clinics at $99/mo: they forward reviews; you send reply drafts in 24 hours."),
            ("Productize", "Build a simple form: paste review → get 3 on-brand replies. Charge $29/mo."),
            ("Migrate", "Move happy manual clients onto the tool + a little human polish."),
            ("Expand", "Add one feature they beg for (multi-location) only after retention is real."),
        ],
        "you_do": "Prove people pay for the job, then automate the boring middle.",
        "they_get": "Faster, kinder review replies without staring at a blank box.",
        "money": "10 clinics × $29 ≈ $290/mo; hybrid service+tool can reach $500/mo sooner.",
    },
]


def render(example: dict) -> str:
    week_html = "\n".join(
        f"""          <li>
            <h3>{title}</h3>
            <p>{body}</p>
          </li>"""
        for title, body in example["week"]
    )
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Example: {example["title"]} — How to Make Money</title>
  <meta name="description" content="Worked example: {example["title"]} for a small local business." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../../styles.css" />
</head>
<body class="page-inner">
  <header class="site-header is-scrolled">
    <a class="logo" href="../../index.html">Karmic Futures</a>
{NAV}
  </header>

  <main>
    <nav class="page-back" aria-label="Breadcrumb">
      <a class="page-back-home" href="../../index.html">← Home</a>
      <span class="page-back-sep" aria-hidden="true">/</span>
      <a href="../index.html">How to make money</a>
      <span class="page-back-sep" aria-hidden="true">/</span>
      <span class="page-back-current" aria-current="page">Example</span>
    </nav>

    <article class="article">
      <header class="article-header">
        <p class="eyebrow"><a href="../index.html">← Back to 10 ways</a></p>
        <h1>Example: {example["title"]}</h1>
        <p class="article-dek">{example["business"]}</p>
        <p class="blog-meta">Worked example · Local business</p>
      </header>

      <div class="article-body">
        <h2>The situation</h2>
        <p>{example["scene"]}</p>

        <h2>How it works (sample timeline)</h2>
        <ol class="example-steps">
{week_html}
        </ol>

        <h2>What you do</h2>
        <p>{example["you_do"]}</p>

        <h2>What they get</h2>
        <p>{example["they_get"]}</p>

        <h2>How the money looks</h2>
        <p class="callout">{example["money"]}</p>

        <p>
          See <a href="../../rates.html">Karmic Futures rates</a> if you want a free consult
          to adapt this example to a real business near you.
        </p>
      </div>

      <nav class="article-nav" aria-label="Article">
        <a href="../index.html#{example["id"]}">← Back to this path</a>
        <a href="../step-by-step.html">Step-by-step template →</a>
      </nav>
    </article>
  </main>

  <footer class="site-footer">
    <p><span>Karmic Futures</span> — Practical AI guidance for local business growth. Open to everyone.</p>
  </footer>
  <script src="../../main.js"></script>
</body>
</html>
"""


for ex in EXAMPLES:
    path = OUT / f"{ex['id']}.html"
    path.write_text(render(ex), encoding="utf-8")
    print("wrote", path.relative_to(ROOT))

print(f"Generated {len(EXAMPLES)} example pages.")
