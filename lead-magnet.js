(function () {
  const form = document.getElementById("lead-magnet-form");
  const statusEl = document.getElementById("lead-magnet-status");
  const resultEl = document.getElementById("lead-magnet-result");
  if (!form) return;

  function setStatus(message, isError) {
    if (!statusEl) return;
    statusEl.textContent = message || "";
    statusEl.classList.toggle("is-error", Boolean(isError));
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const firstName = form.firstName.value.trim();
    const email = form.email.value.trim();
    setStatus("Sending…");
    if (resultEl) {
      resultEl.hidden = true;
      resultEl.innerHTML = "";
    }

    try {
      const res = await fetch("/api/lead-magnet/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) {
        throw new Error(data.error || "Could not complete signup.");
      }

      setStatus(data.message || "You’re in.");
      if (resultEl && data.downloadUrl) {
        resultEl.hidden = false;
        resultEl.innerHTML = `
          <a class="btn btn-primary" href="${data.downloadUrl}">
            Download the free 1-page PDF
          </a>
          <p class="lead-magnet-note">Link works for one hour. Check your inbox for future tips.</p>
        `;
      }
      form.reset();
    } catch (err) {
      setStatus(err.message, true);
    }
  });
})();
