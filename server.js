import express from "express";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import {
  upsertRegistration,
  verifyRegistration,
  accessWorkshop,
  getWorkshopSessions,
} from "./lib/workshop-store.js";
import { sendVerificationEmail } from "./lib/mail.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 3000);

const distDir = join(__dirname, "dist");
const staticDir =
  process.env.STATIC_DIR ||
  (existsSync(join(distDir, "index.html")) && process.env.NODE_ENV === "production"
    ? distDir
    : __dirname);

app.use(express.json({ limit: "32kb" }));

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

app.use(express.static(staticDir));

app.use((req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ ok: false, error: "Not found" });
  }
  const fallback = join(staticDir, "index.html");
  if (existsSync(fallback)) return res.sendFile(fallback);
  return res.status(404).send("Not found");
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Karmic Futures listening on http://localhost:${port}`);
  console.log(`Serving static files from ${staticDir}`);
});
