(function () {
  const STAGES = {
    1: {
      title: "Stage 1 — Pencil & paper",
      summary:
        "You’re running a classic brick-and-mortar rhythm: reliable craft, heavy manual admin. That’s a solid foundation — not a failure.",
      next: "Next step: digitize one bottleneck (appointments, inventory, or follow-up notes) so nothing important lives only on paper.",
    },
    2: {
      title: "Stage 2 — Basic digital",
      summary:
        "Tools exist, but the business still feels patched together. Digital chaos is normal here — the win is consistency, not more apps.",
      next: "Next step: pick one channel (email or Google replies) and make it reliable before adding AI.",
    },
    3: {
      title: "Stage 3 — AI curious",
      summary:
        "You’ve peeked at AI. Curiosity is the right stage — experiments beat big transformations.",
      next: "Next step: use AI weekly for one job (review replies or social drafts) and keep a human review every time.",
    },
    4: {
      title: "Stage 4 — AI assisted",
      summary:
        "AI is becoming a helper. You’re faster at drafting — now the opportunity is reducing copy-paste and forgotten follow-ups.",
      next: "Next step: turn your best AI habit into a simple repeatable checklist or template for the team.",
    },
    5: {
      title: "Stage 5 — AI integrated",
      summary:
        "Systems are starting to connect. Time is coming back. This is where employee energy can shift toward customers.",
      next: "Next step: automate one lead or FAQ path, then reassign a few hours toward outreach and service quality.",
    },
    6: {
      title: "Stage 6 — Autonomous shop",
      summary:
        "Routine operations largely run with oversight. Your advantage is human: attracting, converting, and caring for customers.",
      next: "Next step: protect that model — review automation monthly, and keep investing people time in growth relationships.",
    },
  };

  const form = document.getElementById("journey-form");
  const result = document.getElementById("ws-result");
  const title = document.getElementById("ws-result-title");
  const summary = document.getElementById("ws-result-summary");
  const next = document.getElementById("ws-result-next");
  const stages = document.querySelectorAll(".journey-stage");
  const marker = document.getElementById("journey-marker");
  const markerLabel = document.getElementById("journey-marker-label");
  const resetBtn = document.getElementById("ws-reset");

  // Approximate left % along the curve for stages 1–6
  const MARKER_LEFT = {
    1: 4,
    2: 20,
    3: 38,
    4: 52,
    5: 70,
    6: 92,
  };
  const MARKER_TOP = {
    1: 78,
    2: 70,
    3: 48,
    4: 28,
    5: 14,
    6: 6,
  };

  function clearHighlights() {
    stages.forEach((el) => el.classList.remove("is-current"));
  }

  function placeMarker(stage) {
    if (!marker) return;
    marker.hidden = false;
    marker.style.left = `${MARKER_LEFT[stage]}%`;
    marker.style.top = `${MARKER_TOP[stage]}%`;
    if (markerLabel) markerLabel.textContent = `You · Stage ${stage}`;
  }

  function showResult(stage) {
    const data = STAGES[stage];
    clearHighlights();
    const active = document.querySelector(`.journey-stage[data-stage="${stage}"]`);
    if (active) active.classList.add("is-current");
    placeMarker(stage);

    title.textContent = data.title;
    summary.textContent = data.summary;
    next.textContent = data.next;
    result.hidden = false;
    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const values = ["q1", "q2", "q3", "q4", "q5"].map((name) => {
        const checked = form.querySelector(`input[name="${name}"]:checked`);
        return checked ? Number(checked.value) : null;
      });

      if (values.some((v) => v == null)) return;

      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const stage = Math.min(6, Math.max(1, Math.round(avg)));
      showResult(stage);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      clearHighlights();
      if (marker) marker.hidden = true;
      if (result) result.hidden = true;
    });
  }
})();
