/**
 * Template: AI income paths
 * Shared shape for every monetization method on How to AI.
 *
 * Fields:
 * - id, rank, title, summary
 * - buyer, offer, whyItPays
 * - earnings, speed
 * - steps[] — path-specific play (uses the universal framework)
 */
window.AI_INCOME_PATHS = [
  {
    id: "automation-consulting",
    rank: 1,
    title: "AI automation for local businesses",
    summary: "Sell workflows that save owners hours — lead follow-up, booking, quoting, reporting.",
    buyer: "Local shops, clinics, contractors, agencies",
    offer: "Paid discovery + one workflow build + optional monthly care",
    whyItPays: "Businesses buy time back and fewer missed leads — not “AI.”",
    earnings: "$1,000–$4,000+/mo with a few clients",
    speed: "2–6 weeks to first paid project",
    steps: [
      "Pick one painful workflow (missed inquiries is a strong start).",
      "Offer a free or cheap audit that ends with a fixed-hour quote.",
      "Build with simple tools (Zapier/Make + their email/CRM).",
      "Prove monthly benefit ≥ 3× your fee, then upsell a light retainer."
    ]
  },
  {
    id: "b2b-video",
    rank: 2,
    title: "AI-assisted B2B video",
    summary: "Produce short promo, explainer, and social videos faster with AI editing and scripts.",
    buyer: "Local businesses and small brands that need content weekly",
    offer: "Monthly pack: X short videos + captions + thumbnails",
    whyItPays: "Video is expensive the old way; AI drops delivery cost while buyers still pay for outcomes.",
    earnings: "$3,000–$15,000/mo at agency pace",
    speed: "3–8 weeks once you have a sample reel",
    steps: [
      "Film or gather simple source clips from the client.",
      "Use AI for scripts, cuts, captions, and variants.",
      "Sell a monthly package, not one-off “can you make a video?” jobs.",
      "Reuse winning formats so each new video gets faster."
    ]
  },
  {
    id: "chatbots-agents",
    rank: 3,
    title: "Chatbots & AI agents for business",
    summary: "Build assistants that answer FAQs, qualify leads, or book appointments.",
    buyer: "Service businesses with repetitive questions or after-hours traffic",
    offer: "Setup project ($2k–$8k typical range) + monitoring retainer",
    whyItPays: "One good bot replaces nights of answering the same questions.",
    earnings: "$2,000–$8,000 per project; retainers on top",
    speed: "2–8 weeks",
    steps: [
      "Map the top 10 questions and the booking/lead handoff.",
      "Launch a narrow bot (one job) before a “do everything” agent.",
      "Connect to their site, SMS, or inbox.",
      "Charge for improvements once it’s live and saving time."
    ]
  },
  {
    id: "content-systems",
    rank: 4,
    title: "AI content systems (B2B writing)",
    summary: "Run blogs, emails, and landing pages with AI drafts + human strategy.",
    buyer: "Businesses that need steady marketing output",
    offer: "Project packs or monthly content retainer",
    whyItPays: "Clients pay for pipeline and conversions, not raw words.",
    earnings: "$1,000–$4,000/mo per client common",
    speed: "1–4 weeks",
    steps: [
      "Sell an outcome (more leads, clearer offer) not “blog posts.”",
      "Build a repeatable brief → draft → edit → publish loop.",
      "Keep a brand voice doc so AI stays on-brand.",
      "Move one-off buyers onto a monthly cadence."
    ]
  },
  {
    id: "social-management",
    rank: 5,
    title: "AI social media management",
    summary: "Plan, write, design, and schedule posts with AI — you own strategy and client care.",
    buyer: "Local businesses that post inconsistently",
    offer: "Fixed monthly package (posts + replies + simple reporting)",
    whyItPays: "Consistency grows reach; AI makes consistency affordable to deliver.",
    earnings: "$1,500–$5,000/mo per book of clients",
    speed: "2–6 weeks",
    steps: [
      "Audit their presence and pick 1–2 platforms.",
      "Create a monthly content calendar with AI drafts.",
      "Batch create visuals and schedule in one sitting.",
      "Report on what drove calls, visits, or DMs — not vanity likes."
    ]
  },
  {
    id: "lead-followup",
    rank: 6,
    title: "AI lead follow-up & CRM workflows",
    summary: "Instant replies, nurture sequences, and CRM logging when leads come in.",
    buyer: "Anyone losing money to slow response times",
    offer: "Setup + templates + optional monthly tuning",
    whyItPays: "Speed-to-lead is cash. Hours saved show up as booked jobs.",
    earnings: "$500–$3,000 setup; retainers $250–$800/mo",
    speed: "1–4 weeks",
    steps: [
      "Measure current response time and missed leads.",
      "Write AI reply templates that sound like the owner.",
      "Wire form/SMS/email → CRM → follow-up sequence.",
      "Show before/after numbers in the first 30 days."
    ]
  },
  {
    id: "design-packages",
    rank: 7,
    title: "AI design & brand asset packs",
    summary: "Logos, social kits, menus, flyers, and thumbnails delivered as fixed packages.",
    buyer: "New or rebranding local businesses",
    offer: "Productized packs (e.g. “20 branded social posts”)",
    whyItPays: "Buyers want a finished look fast; AI multiplies your output.",
    earnings: "$500–$5,000/mo",
    speed: "1–4 weeks",
    steps: [
      "Productize 2–3 packs with clear deliverables and price.",
      "Use AI for concepts, then tighten by hand.",
      "Deliver source files and a simple brand sheet.",
      "Upsell monthly creative refresh."
    ]
  },
  {
    id: "short-form-channels",
    rank: 8,
    title: "Faceless / short-form AI channels",
    summary: "Build educational or niche channels with AI scripts, voice, and editing — monetize via ads, affiliates, or leads.",
    buyer: "Audience first; then sponsors or your own offer",
    offer: "Content → attention → offer or affiliate",
    whyItPays: "Works when niche + consistency beat production polish.",
    earnings: "Wide range; treat as a 90-day experiment",
    speed: "4–12 weeks to traction",
    steps: [
      "Choose a narrow niche with search or share demand.",
      "Batch 20 scripts, then produce on a weekly cadence.",
      "Hook → value → soft CTA every video.",
      "Only scale spend after a format proves retention."
    ]
  },
  {
    id: "digital-products",
    rank: 9,
    title: "AI-powered digital products",
    summary: "Templates, prompt packs, Notion kits, checklists, and mini-courses for a specific job.",
    buyer: "People with the same recurring problem you already solved",
    offer: "One narrow product + simple checkout page",
    whyItPays: "High margin — but needs distribution (audience, SEO, or partners).",
    earnings: "Often $0–$200/mo early; compounds with traffic",
    speed: "2–8 weeks to launch; sales follow distribution",
    steps: [
      "Solve one painful, searchable problem.",
      "Ship a minimum product in a weekend.",
      "Sell to a list, community, or via SEO — not “hope.”",
      "Iterate from buyer questions into v2."
    ]
  },
  {
    id: "micro-saas",
    rank: 10,
    title: "Micro-SaaS or AI wrappers",
    summary: "A small paid tool that does one job for one niche — subscriptions or lifetime deals.",
    buyer: "A niche with a repeated, annoying task",
    offer: "$29–$99/mo or a setup + subscription",
    whyItPays: "Recurring revenue if the job-to-be-done is real and sticky.",
    earnings: "Slow start; scales if retention is strong",
    speed: "1–3 months to first paying users",
    steps: [
      "Validate with a manual service version first.",
      "Automate only the steps clients already paid for.",
      "Charge before you build every feature.",
      "Support + iterate with the first 10 users."
    ]
  }
];

/** Universal playbook every path plugs into */
window.AI_INCOME_FRAMEWORK = {
  title: "The professional template",
  idea: "AI provides leverage. The business is a clear buyer, a fixed offer, and consistent outreach — a process anyone can learn.",
  steps: [
    {
      num: "01",
      title: "Pick an outcome buyers already pay for",
      detail: "More leads, faster response, weekly content, booked appointments — not “we do AI.”"
    },
    {
      num: "02",
      title: "Name a specific buyer",
      detail: "Local dentists, HVAC, boutiques, coaches. Narrow beats “anyone with a business.”"
    },
    {
      num: "03",
      title: "Package a fixed offer",
      detail: "Price a starter (hours or package) so the first yes is easy. Avoid open-ended mystery projects."
    },
    {
      num: "04",
      title: "Build an AI-assisted delivery system",
      detail: "Prompts, templates, and workflows so the second client is faster than the first."
    },
    {
      num: "05",
      title: "Sell before you polish",
      detail: "Outreach, intros, and audits beat more tooling. First dollars teach what to improve."
    },
    {
      num: "06",
      title: "Deliver one measurable win",
      detail: "Show hours saved, leads answered, or posts shipped. Proof unlocks retainers."
    },
    {
      num: "07",
      title: "Productize what worked",
      detail: "Turn the winning job into a named package or monthly plan."
    },
    {
      num: "08",
      title: "Compound with referrals & retainers",
      detail: "Ask for intros. Keep a small book of recurring clients. That’s how $1k/mo becomes durable."
    }
  ]
};
