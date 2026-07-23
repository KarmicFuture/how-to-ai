const express = require("express");
const { join } = require("node:path");
const { existsSync } = require("node:fs");
const {
  upsertRegistration,
  verifyRegistration,
  accessWorkshop,
  getWorkshopSessions,
} = require("./lib/workshop-store.js");
const { sendVerificationEmail } = require("./lib/mail.js");
const {
  captureLead,
  createDownloadToken,
  verifyDownloadToken,
} = require("./lib/mailchimp.js");

const app = express();
const port = Number(process.env.PORT) || 3000;

function resolveStaticDir() {
  if (process.env.STATIC_DIR) return process.env.STATIC_DIR;

  // Prefer local index.html (works when Hostinger runs from dist/)
  if (existsSync(join(__dirname, "index.html"))) return __dirname;

  const distDir = join(__dirname, "dist");
  if (existsSync(join(distDir, "index.html"))) return distDir;

  return __dirname;
}

const staticDir = resolveStaticDir();

app.use(express.json({ limit: "32kb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true, service: "karmic-futures" });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true, service: "karmic-futures" });
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

app.post("/api/workshop/register", async (req, res) => {
  try {
    const firstName = String(req.body?.firstName || "").trim();
    const email = String(req.body?.email || "").trim();
    if (!firstName || firstName.length < 1) {
      return res.status(400).json({ ok: false, error: "First name is required." });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ ok: false, error: "A valid email address is required." });
    }

    const { registration, code } = upsertRegistration({ firstName, email });
    const mail = await sendVerificationEmail({
      to: registration.email,
      firstName: registration.firstName,
      code,
    });

    const payload = {
      ok: true,
      registration,
      emailSent: mail.sent,
      message: mail.sent
        ? "Check your email for a 6-digit verification code."
        : mail.message || "Registration saved. Use the verification code to continue.",
    };
    // Only expose code when SMTP is not configured (local/dev)
    if (!mail.sent && mail.debugCode) {
      payload.debugCode = mail.debugCode;
    }
    return res.json(payload);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Could not complete registration." });
  }
});

app.post("/api/workshop/verify", (req, res) => {
  const email = String(req.body?.email || "").trim();
  const code = String(req.body?.code || "").trim();
  if (!isValidEmail(email) || !code) {
    return res.status(400).json({ ok: false, error: "Email and verification code are required." });
  }
  const result = verifyRegistration(email, code);
  if (!result.ok) return res.status(400).json(result);
  return res.json(result);
});

app.post("/api/workshop/access", (req, res) => {
  const email = String(req.body?.email || "").trim();
  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, error: "A valid email address is required." });
  }
  const result = accessWorkshop(email);
  if (!result.ok) return res.status(403).json(result);
  return res.json({
    ...result,
    sessions: getWorkshopSessions(),
  });
});

app.get("/api/workshop/sessions", (_req, res) => {
  res.json({ ok: true, sessions: getWorkshopSessions() });
});

const pdfPath = join(__dirname, "downloads", "5-signs-leaving-ai-money.pdf");

app.post("/api/lead-magnet/subscribe", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim();
    const firstName = String(req.body?.firstName || "").trim();
    if (!isValidEmail(email)) {
      return res.status(400).json({ ok: false, error: "A valid email address is required." });
    }

    const result = await captureLead({
      email,
      firstName,
      source: "homepage-lead-magnet",
    });
    const token = createDownloadToken(email);
    return res.json({
      ok: true,
      message: result.message,
      mode: result.mode,
      downloadUrl: `/api/lead-magnet/download?token=${encodeURIComponent(token)}`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      ok: false,
      error: err.message || "Could not complete signup. Please try again.",
    });
  }
});

app.get("/api/lead-magnet/download", (req, res) => {
  const email = verifyDownloadToken(req.query.token);
  if (!email) {
    return res.status(403).send("This download link is invalid or expired. Please request the guide again.");
  }
  if (!existsSync(pdfPath)) {
    return res.status(404).send("Guide not found on the server yet.");
  }
  res.download(pdfPath, "5-Signs-Leaving-AI-Money-on-the-Table.pdf");
});

app.use(express.static(staticDir));

app.use((req, res) => {
  if (req.path.startsWith("/api/") || req.path === "/health") {
    return res.status(404).json({ ok: false, error: "Not found" });
  }
  const fallback = join(staticDir, "index.html");
  if (existsSync(fallback)) return res.sendFile(fallback);
  return res.status(404).send("Not found");
});

function start() {
  // Older Hostinger/Passenger setups expect this instead of a TCP port.
  if (typeof global.PhusionPassenger !== "undefined") {
    global.PhusionPassenger.configure({ autoInstall: false });
    app.listen("passenger");
    console.log("Karmic Futures listening via Phusion Passenger");
    console.log(`Serving static files from ${staticDir}`);
    return;
  }

  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`Karmic Futures listening on 0.0.0.0:${port}`);
    console.log(`Serving static files from ${staticDir}`);
  });

  server.on("error", (err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
}

start();

module.exports = app;
