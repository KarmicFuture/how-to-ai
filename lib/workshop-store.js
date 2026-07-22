import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { randomInt, createHash } from "node:crypto";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "data");
const storePath = join(dataDir, "workshop-registrations.json");

function ensureStore() {
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
  if (!existsSync(storePath)) {
    writeFileSync(storePath, JSON.stringify({ registrations: [] }, null, 2));
  }
}

function readStore() {
  ensureStore();
  return JSON.parse(readFileSync(storePath, "utf8"));
}

function writeStore(store) {
  ensureStore();
  writeFileSync(storePath, JSON.stringify(store, null, 2));
}

function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

function hashCode(code) {
  return createHash("sha256").update(String(code)).digest("hex");
}

export function findRegistration(email) {
  const store = readStore();
  return store.registrations.find((r) => r.email === normalizeEmail(email)) || null;
}

export function upsertRegistration({ firstName, email }) {
  const store = readStore();
  const normalized = normalizeEmail(email);
  const code = String(randomInt(100000, 999999));
  const now = new Date().toISOString();
  let row = store.registrations.find((r) => r.email === normalized);

  if (!row) {
    row = {
      id: `reg_${Date.now()}_${randomInt(1000, 9999)}`,
      firstName: String(firstName || "").trim(),
      email: normalized,
      verified: false,
      createdAt: now,
      verifiedAt: null,
      lastAccessAt: null,
    };
    store.registrations.push(row);
  } else {
    row.firstName = String(firstName || row.firstName || "").trim();
    // Re-registering while unverified refreshes the code; verified users can request a new code too if needed
  }

  row.codeHash = hashCode(code);
  row.codeExpiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
  row.updatedAt = now;
  writeStore(store);

  return { registration: publicRegistration(row), code };
}

export function verifyRegistration(email, code) {
  const store = readStore();
  const normalized = normalizeEmail(email);
  const row = store.registrations.find((r) => r.email === normalized);
  if (!row) return { ok: false, error: "No registration found for that email." };
  if (!row.codeHash || !row.codeExpiresAt) {
    return { ok: false, error: "No verification code pending. Register again." };
  }
  if (new Date(row.codeExpiresAt).getTime() < Date.now()) {
    return { ok: false, error: "That code has expired. Register again for a new code." };
  }
  if (row.codeHash !== hashCode(String(code || "").trim())) {
    return { ok: false, error: "Incorrect verification code." };
  }

  row.verified = true;
  row.verifiedAt = new Date().toISOString();
  row.codeHash = null;
  row.codeExpiresAt = null;
  row.updatedAt = row.verifiedAt;
  writeStore(store);
  return { ok: true, registration: publicRegistration(row) };
}

export function accessWorkshop(email) {
  const row = findRegistration(email);
  if (!row) return { ok: false, error: "No registration found. Please register first." };
  if (!row.verified) {
    return { ok: false, error: "Email not verified yet. Enter the code we sent you." };
  }
  const store = readStore();
  const live = store.registrations.find((r) => r.email === row.email);
  live.lastAccessAt = new Date().toISOString();
  writeStore(store);
  return { ok: true, registration: publicRegistration(live) };
}

export function publicRegistration(row) {
  return {
    firstName: row.firstName,
    email: row.email,
    verified: Boolean(row.verified),
    createdAt: row.createdAt,
    verifiedAt: row.verifiedAt,
  };
}

/** Saturdays 10:00–11:00 America/New_York, starting first Saturday of August 2026 */
export function getWorkshopSessions({ throughMonths = 6 } = {}) {
  const sessions = [];
  // Aug 1, 2026 is a Saturday
  let cursor = new Date(Date.UTC(2026, 7, 1, 14, 0, 0)); // 10:00 EDT = 14:00 UTC
  const end = new Date(cursor);
  end.setUTCMonth(end.getUTCMonth() + throughMonths);

  while (cursor <= end) {
    const year = cursor.getUTCFullYear();
    const month = cursor.getUTCMonth();
    const day = cursor.getUTCDate();
    // Store as ISO date for the calendar day in Eastern (date portion)
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    sessions.push({
      id: `ws-${dateKey}`,
      date: dateKey,
      startsAt: "10:00",
      endsAt: "11:00",
      timezone: "America/New_York",
      timezoneLabel: "EST/EDT",
      title: "Free How to AI Workshop",
      meetingUrl: null,
      meetingNote: "Meeting link will be added soon.",
    });
    cursor = new Date(cursor.getTime() + 7 * 24 * 60 * 60 * 1000);
  }
  return sessions;
}
