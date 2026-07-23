const { appendFileSync, mkdirSync, existsSync, readFileSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");
const { createHmac, timingSafeEqual } = require("node:crypto");

const root = join(__dirname, "..");
const dataDir = join(root, "data");
const leadsPath = join(dataDir, "lead-magnet-subscribers.json");

function mailchimpConfigured() {
  return Boolean(process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_AUDIENCE_ID);
}

function serverPrefix() {
  if (process.env.MAILCHIMP_SERVER_PREFIX) return process.env.MAILCHIMP_SERVER_PREFIX;
  const key = process.env.MAILCHIMP_API_KEY || "";
  const parts = key.split("-");
  return parts.length > 1 ? parts[parts.length - 1] : "";
}

function downloadSecret() {
  return process.env.DOWNLOAD_SECRET || process.env.MAILCHIMP_API_KEY || "karmic-futures-dev-secret";
}

function ensureLeadsStore() {
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
  if (!existsSync(leadsPath)) {
    writeFileSync(leadsPath, JSON.stringify({ subscribers: [] }, null, 2));
  }
}

function saveLocalLead({ email, firstName, source }) {
  ensureLeadsStore();
  const store = JSON.parse(readFileSync(leadsPath, "utf8"));
  const normalized = String(email).trim().toLowerCase();
  const existing = store.subscribers.find((s) => s.email === normalized);
  const now = new Date().toISOString();
  if (existing) {
    existing.updatedAt = now;
    existing.firstName = firstName || existing.firstName;
  } else {
    store.subscribers.push({
      email: normalized,
      firstName: firstName || "",
      source: source || "lead-magnet",
      createdAt: now,
      updatedAt: now,
    });
  }
  writeFileSync(leadsPath, JSON.stringify(store, null, 2));
  appendFileSync(
    join(dataDir, "lead-magnet.log"),
    `${now} ${normalized} source=${source || "lead-magnet"}\n`
  );
}

async function subscribeMailchimp({ email, firstName }) {
  const dc = serverPrefix();
  const listId = process.env.MAILCHIMP_AUDIENCE_ID;
  const apiKey = process.env.MAILCHIMP_API_KEY;
  if (!dc || !listId || !apiKey) {
    throw new Error("Mailchimp is not configured.");
  }

  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`;
  const auth = Buffer.from(`anystring:${apiKey}`).toString("base64");
  const body = {
    email_address: email,
    status: process.env.MAILCHIMP_STATUS || "subscribed",
    merge_fields: {
      FNAME: firstName || "",
    },
    tags: ["lead-magnet", "5-signs-pdf"],
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  // 400 member exists → treat as success (still get the PDF)
  if (res.status === 400 && String(data?.title || "").toLowerCase().includes("member exists")) {
    return { ok: true, mode: "mailchimp", alreadySubscribed: true };
  }

  if (!res.ok) {
    const detail = data?.detail || data?.title || "Mailchimp subscribe failed.";
    const err = new Error(detail);
    err.status = res.status;
    throw err;
  }

  return { ok: true, mode: "mailchimp", alreadySubscribed: false };
}

function createDownloadToken(email) {
  const exp = Date.now() + 60 * 60 * 1000; // 1 hour
  const payload = `${String(email).trim().toLowerCase()}|${exp}`;
  const sig = createHmac("sha256", downloadSecret()).update(payload).digest("hex");
  return Buffer.from(`${payload}|${sig}`).toString("base64url");
}

function verifyDownloadToken(token) {
  try {
    const raw = Buffer.from(String(token || ""), "base64url").toString("utf8");
    const [email, expStr, sig] = raw.split("|");
    if (!email || !expStr || !sig) return null;
    const exp = Number(expStr);
    if (!Number.isFinite(exp) || Date.now() > exp) return null;
    const payload = `${email}|${expStr}`;
    const expected = createHmac("sha256", downloadSecret()).update(payload).digest("hex");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    return email;
  } catch {
    return null;
  }
}

async function captureLead({ email, firstName, source }) {
  saveLocalLead({ email, firstName, source });

  if (!mailchimpConfigured()) {
    return {
      ok: true,
      mode: "local",
      message:
        "Saved. Mailchimp is not configured yet — download is still unlocked for this session.",
    };
  }

  const result = await subscribeMailchimp({ email, firstName });
  return {
    ok: true,
    mode: result.mode,
    alreadySubscribed: result.alreadySubscribed,
    message: result.alreadySubscribed
      ? "You’re already on the list. Here’s your download."
      : "You’re in. Download your free guide below.",
  };
}

module.exports = {
  mailchimpConfigured,
  captureLead,
  createDownloadToken,
  verifyDownloadToken,
};
