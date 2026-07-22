#!/usr/bin/env python3
"""Ensure each inner page has a clear top back / breadcrumb nav."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# (file, breadcrumb html to insert as first child of <main>)
PAGES = {
    "how-to-ai/index.html": """
    <nav class="page-back" aria-label="Breadcrumb">
      <a class="page-back-home" href="../index.html">← Home</a>
      <span class="page-back-sep" aria-hidden="true">/</span>
      <span class="page-back-current" aria-current="page">How to AI</span>
    </nav>
""",
    "how-to-ai/ai-journey-map.html": """
    <nav class="page-back" aria-label="Breadcrumb">
      <a class="page-back-home" href="../index.html">← Home</a>
      <span class="page-back-sep" aria-hidden="true">/</span>
      <a href="index.html">How to AI</a>
      <span class="page-back-sep" aria-hidden="true">/</span>
      <span class="page-back-current" aria-current="page">AI Journey Map</span>
    </nav>
""",
    "how-to-ai/what-ai-is.html": """
    <nav class="page-back" aria-label="Breadcrumb">
      <a class="page-back-home" href="../index.html">← Home</a>
      <span class="page-back-sep" aria-hidden="true">/</span>
      <a href="index.html">How to AI</a>
      <span class="page-back-sep" aria-hidden="true">/</span>
      <span class="page-back-current" aria-current="page">What AI actually is</span>
    </nav>
""",
    "how-to-ai/how-to-ask.html": """
    <nav class="page-back" aria-label="Breadcrumb">
      <a class="page-back-home" href="../index.html">← Home</a>
      <span class="page-back-sep" aria-hidden="true">/</span>
      <a href="index.html">How to AI</a>
      <span class="page-back-sep" aria-hidden="true">/</span>
      <span class="page-back-current" aria-current="page">How to ask</span>
    </nav>
""",
    "how-to-ai/everyday-uses.html": """
    <nav class="page-back" aria-label="Breadcrumb">
      <a class="page-back-home" href="../index.html">← Home</a>
      <span class="page-back-sep" aria-hidden="true">/</span>
      <a href="index.html">How to AI</a>
      <span class="page-back-sep" aria-hidden="true">/</span>
      <span class="page-back-current" aria-current="page">Everyday uses</span>
    </nav>
""",
    "how-to-ai/business-without-code.html": """
    <nav class="page-back" aria-label="Breadcrumb">
      <a class="page-back-home" href="../index.html">← Home</a>
      <span class="page-back-sep" aria-hidden="true">/</span>
      <a href="index.html">How to AI</a>
      <span class="page-back-sep" aria-hidden="true">/</span>
      <span class="page-back-current" aria-current="page">Business without code</span>
    </nav>
""",
    "how-to-ai/stay-in-control.html": """
    <nav class="page-back" aria-label="Breadcrumb">
      <a class="page-back-home" href="../index.html">← Home</a>
      <span class="page-back-sep" aria-hidden="true">/</span>
      <a href="index.html">How to AI</a>
      <span class="page-back-sep" aria-hidden="true">/</span>
      <span class="page-back-current" aria-current="page">Stay in control</span>
    </nav>
""",
    "make-money/index.html": """
    <nav class="page-back" aria-label="Breadcrumb">
      <a class="page-back-home" href="../index.html">← Home</a>
      <span class="page-back-sep" aria-hidden="true">/</span>
      <span class="page-back-current" aria-current="page">How to make money</span>
    </nav>
""",
    "make-money/step-by-step.html": """
    <nav class="page-back" aria-label="Breadcrumb">
      <a class="page-back-home" href="../index.html">← Home</a>
      <span class="page-back-sep" aria-hidden="true">/</span>
      <a href="index.html">How to make money</a>
      <span class="page-back-sep" aria-hidden="true">/</span>
      <span class="page-back-current" aria-current="page">Step by step</span>
    </nav>
""",
}


def strip_existing_back(html: str) -> str:
    import re

    return re.sub(
        r"\n\s*<nav class=\"page-back\"[\s\S]*?</nav>\n?",
        "\n",
        html,
        count=1,
    )


for rel, crumb in PAGES.items():
    path = ROOT / rel
    html = path.read_text(encoding="utf-8")
    html = strip_existing_back(html)
    if "<main>" not in html and "<main " not in html:
        raise SystemExit(f"No <main> in {rel}")
    # insert after opening main tag
    import re

    html2, n = re.subn(
        r"(<main[^>]*>)",
        r"\1" + crumb.rstrip() + "\n",
        html,
        count=1,
    )
    if n != 1:
        raise SystemExit(f"Failed to inject into {rel}")
    path.write_text(html2, encoding="utf-8")
    print(f"injected: {rel}")
