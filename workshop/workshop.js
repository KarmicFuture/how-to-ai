(function () {
  const STORAGE_KEY = "kf_workshop_session";
  const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const statusEl = document.getElementById("ws-status");
  const authEl = document.getElementById("workshop-auth");
  const roomEl = document.getElementById("workshop-room");
  const calendarEl = document.getElementById("workshop-calendar");
  const detailEl = document.getElementById("ws-cal-detail");
  const debugEl = document.getElementById("debug-code");
  const panels = {
    register: document.getElementById("panel-register"),
    verify: document.getElementById("panel-verify"),
    access: document.getElementById("panel-access"),
  };

  let pendingFirstName = "";
  let sessionsByDate = new Map();
  let viewYear = 2026;
  let viewMonth = 7; // August (0-indexed)
  let selectedDate = null;

  function setStatus(message, isError) {
    if (!statusEl) return;
    statusEl.textContent = message || "";
    statusEl.classList.toggle("is-error", Boolean(isError));
  }

  function showPanel(name) {
    Object.entries(panels).forEach(([key, el]) => {
      if (el) el.hidden = key !== name;
    });
  }

  function saveSession(registration) {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        email: registration.email,
        firstName: registration.firstName,
        verified: true,
      })
    );
  }

  function clearSession() {
    sessionStorage.removeItem(STORAGE_KEY);
  }

  function readSession() {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null");
    } catch {
      return null;
    }
  }

  function dateKeyFromParts(y, m, d) {
    return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }

  function parseDateKey(dateKey) {
    const [y, m, d] = dateKey.split("-").map(Number);
    return { y, m: m - 1, d };
  }

  function formatDateLabel(dateKey) {
    const { y, m, d } = parseDateKey(dateKey);
    const dt = new Date(y, m, d);
    return dt.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  function monthLabel(year, month) {
    return new Date(year, month, 1).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }

  function todayKey() {
    const now = new Date();
    return dateKeyFromParts(now.getFullYear(), now.getMonth(), now.getDate());
  }

  function indexSessions(sessions) {
    sessionsByDate = new Map();
    (sessions || []).forEach((session) => {
      if (session?.date) sessionsByDate.set(session.date, session);
    });
  }

  function pickInitialView() {
    const today = todayKey();
    const upcoming = [...sessionsByDate.keys()].sort().find((key) => key >= today);
    const first = [...sessionsByDate.keys()].sort()[0];
    const pick = upcoming || first;
    if (!pick) {
      viewYear = 2026;
      viewMonth = 7;
      selectedDate = null;
      return;
    }
    const { y, m } = parseDateKey(pick);
    viewYear = y;
    viewMonth = m;
    selectedDate = pick;
  }

  function shiftMonth(delta) {
    const d = new Date(viewYear, viewMonth + delta, 1);
    viewYear = d.getFullYear();
    viewMonth = d.getMonth();
    renderCalendarGrid();
  }

  function renderSessionDetail(session) {
    if (!detailEl) return;
    if (!session) {
      detailEl.hidden = true;
      detailEl.innerHTML = "";
      return;
    }

    const meeting = session.meetingUrl
      ? `<a class="btn btn-primary" href="${session.meetingUrl}" target="_blank" rel="noopener">Join meeting</a>`
      : `<p class="ws-meeting-pending">${session.meetingNote || "Meeting link coming soon"}</p>`;

    detailEl.hidden = false;
    detailEl.innerHTML = `
      <p class="eyebrow">Selected session</p>
      <h4>${session.title}</h4>
      <p class="ws-session-when">${formatDateLabel(session.date)}</p>
      <p class="ws-session-time">${session.startsAt}–${session.endsAt} ${session.timezoneLabel || "Eastern"}</p>
      <div class="ws-session-action">${meeting}</div>
    `;
  }

  function renderCalendarGrid() {
    if (!calendarEl) return;

    const firstDow = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const today = todayKey();

    const cells = [];
    for (let i = 0; i < firstDow; i += 1) {
      cells.push(`<div class="ws-cal-cell is-empty" aria-hidden="true"></div>`);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const key = dateKeyFromParts(viewYear, viewMonth, day);
      const session = sessionsByDate.get(key);
      const isToday = key === today;
      const isSelected = key === selectedDate;
      const classes = [
        "ws-cal-cell",
        "ws-cal-day",
        session ? "has-session" : "",
        isToday ? "is-today" : "",
        isSelected ? "is-selected" : "",
      ]
        .filter(Boolean)
        .join(" ");

      if (session) {
        cells.push(`
          <button
            type="button"
            class="${classes}"
            data-date="${key}"
            aria-pressed="${isSelected ? "true" : "false"}"
            aria-label="Workshop on ${formatDateLabel(key)}, 10 to 11 AM Eastern"
          >
            <span class="ws-cal-num">${day}</span>
            <span class="ws-cal-mark">Workshop</span>
          </button>
        `);
      } else {
        cells.push(`
          <div class="${classes}" aria-label="${formatDateLabel(key)}">
            <span class="ws-cal-num">${day}</span>
          </div>
        `);
      }
    }

    calendarEl.innerHTML = `
      <div class="ws-cal" role="region" aria-label="Workshop month calendar">
        <div class="ws-cal-toolbar">
          <button type="button" class="ws-cal-nav" id="ws-cal-prev" aria-label="Previous month">‹</button>
          <h4 class="ws-cal-month" id="ws-cal-month">${monthLabel(viewYear, viewMonth)}</h4>
          <button type="button" class="ws-cal-nav" id="ws-cal-next" aria-label="Next month">›</button>
        </div>
        <div class="ws-cal-weekdays" aria-hidden="true">
          ${WEEKDAYS.map((d) => `<span>${d}</span>`).join("")}
        </div>
        <div class="ws-cal-grid">
          ${cells.join("")}
        </div>
        <p class="ws-cal-legend">
          <span class="ws-cal-legend-swatch" aria-hidden="true"></span>
          Saturdays with a live workshop (10:00–11:00 AM Eastern)
        </p>
      </div>
    `;

    document.getElementById("ws-cal-prev")?.addEventListener("click", () => shiftMonth(-1));
    document.getElementById("ws-cal-next")?.addEventListener("click", () => shiftMonth(1));

    calendarEl.querySelectorAll(".ws-cal-day.has-session").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedDate = btn.getAttribute("data-date");
        renderCalendarGrid();
        renderSessionDetail(sessionsByDate.get(selectedDate));
      });
    });

    renderSessionDetail(selectedDate ? sessionsByDate.get(selectedDate) : null);
  }

  function renderCalendar(sessions) {
    indexSessions(sessions);
    if (!sessionsByDate.size) {
      if (calendarEl) calendarEl.innerHTML = "<p>No sessions scheduled yet.</p>";
      if (detailEl) {
        detailEl.hidden = true;
        detailEl.innerHTML = "";
      }
      return;
    }
    pickInitialView();
    renderCalendarGrid();
  }

  async function openRoom(registration, sessions) {
    authEl.hidden = true;
    roomEl.hidden = false;
    document.getElementById("room-name").textContent = registration.firstName || "friend";
    document.getElementById("room-email").textContent = registration.email;
    renderCalendar(sessions || []);
    setStatus("");
  }

  async function api(path, body) {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.ok === false) {
      throw new Error(data.error || "Something went wrong. Please try again.");
    }
    return data;
  }

  document.querySelectorAll("[data-show]").forEach((btn) => {
    btn.addEventListener("click", () => {
      showPanel(btn.getAttribute("data-show"));
      setStatus("");
      if (debugEl) debugEl.hidden = true;
    });
  });

  document.getElementById("form-register")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const firstName = form.firstName.value.trim();
    const email = form.email.value.trim();
    pendingFirstName = firstName;
    setStatus("Sending verification code…");
    try {
      const data = await api("/api/workshop/register", { firstName, email });
      document.getElementById("verify-email").value = email;
      document.getElementById("verify-email-label").textContent = email;
      showPanel("verify");
      setStatus(data.message || "Code sent.");
      if (data.debugCode && debugEl) {
        debugEl.hidden = false;
        debugEl.textContent = `Local testing code: ${data.debugCode}`;
      }
    } catch (err) {
      setStatus(err.message, true);
    }
  });

  document.getElementById("resend-code")?.addEventListener("click", async () => {
    const email = document.getElementById("verify-email").value;
    const firstName = pendingFirstName || "there";
    if (!email) return;
    setStatus("Resending code…");
    try {
      const data = await api("/api/workshop/register", { firstName, email });
      setStatus(data.message || "Code resent.");
      if (data.debugCode && debugEl) {
        debugEl.hidden = false;
        debugEl.textContent = `Local testing code: ${data.debugCode}`;
      }
    } catch (err) {
      setStatus(err.message, true);
    }
  });

  document.getElementById("form-verify")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("Verifying…");
    try {
      const data = await api("/api/workshop/verify", {
        email: form.email.value.trim(),
        code: form.code.value.trim(),
      });
      saveSession(data.registration);
      const access = await api("/api/workshop/access", { email: data.registration.email });
      await openRoom(access.registration, access.sessions);
    } catch (err) {
      setStatus(err.message, true);
    }
  });

  document.getElementById("form-access")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = event.currentTarget.email.value.trim();
    setStatus("Checking access…");
    try {
      const data = await api("/api/workshop/access", { email });
      saveSession(data.registration);
      await openRoom(data.registration, data.sessions);
    } catch (err) {
      setStatus(err.message, true);
    }
  });

  document.getElementById("ws-signout")?.addEventListener("click", () => {
    clearSession();
    roomEl.hidden = true;
    authEl.hidden = false;
    showPanel("access");
    setStatus("Signed out. Enter your verified email to return.");
  });

  // Restore session if still verified server-side
  (async function boot() {
    const wantsPreview = new URLSearchParams(window.location.search).has("preview");
    if (wantsPreview) {
      try {
        const res = await fetch("/api/workshop/sessions");
        const data = await res.json();
        await openRoom(
          { firstName: "Preview", email: "preview@local" },
          data.sessions || []
        );
        setStatus("Preview mode — calendar only (not a real registration).");
        return;
      } catch {
        setStatus("Could not load preview calendar.", true);
      }
    }

    const session = readSession();
    if (!session?.email) {
      showPanel("register");
      return;
    }
    try {
      const data = await api("/api/workshop/access", { email: session.email });
      await openRoom(data.registration, data.sessions);
    } catch {
      clearSession();
      showPanel("access");
    }
  })();
})();
