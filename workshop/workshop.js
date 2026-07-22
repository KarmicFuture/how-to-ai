(function () {
  const STORAGE_KEY = "kf_workshop_session";

  const statusEl = document.getElementById("ws-status");
  const authEl = document.getElementById("workshop-auth");
  const roomEl = document.getElementById("workshop-room");
  const calendarEl = document.getElementById("workshop-calendar");
  const debugEl = document.getElementById("debug-code");
  const panels = {
    register: document.getElementById("panel-register"),
    verify: document.getElementById("panel-verify"),
    access: document.getElementById("panel-access"),
  };

  let pendingFirstName = "";

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

  function formatDateLabel(dateKey) {
    const [y, m, d] = dateKey.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  function renderCalendar(sessions) {
    if (!calendarEl) return;
    if (!sessions?.length) {
      calendarEl.innerHTML = "<p>No sessions scheduled yet.</p>";
      return;
    }

    calendarEl.innerHTML = sessions
      .map((session) => {
        const meeting = session.meetingUrl
          ? `<a class="btn btn-primary" href="${session.meetingUrl}" target="_blank" rel="noopener">Join meeting</a>`
          : `<span class="ws-meeting-pending">${session.meetingNote || "Meeting link coming soon"}</span>`;
        return `
          <article class="ws-session">
            <div>
              <h4>${session.title}</h4>
              <p class="ws-session-when">${formatDateLabel(session.date)}</p>
              <p class="ws-session-time">${session.startsAt}–${session.endsAt} ${session.timezoneLabel || "Eastern"}</p>
            </div>
            <div class="ws-session-action">${meeting}</div>
          </article>
        `;
      })
      .join("");
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
