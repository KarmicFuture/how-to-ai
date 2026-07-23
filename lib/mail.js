import nodemailer from "nodemailer";
import { appendFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "data");

function smtpPass() {
  return process.env.SMTP_PASS || process.env.SMTP_PASSWORD || "";
}

function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && smtpPass());
}

export async function sendVerificationEmail({ to, firstName, code }) {
  const subject = "Your Karmic Futures workshop verification code";
  const text = `Hi ${firstName || "there"},

Your Free Workshop verification code is: ${code}

This code expires in 30 minutes.

If you did not request this, you can ignore this email.

— Karmic Futures`;

  if (!smtpConfigured()) {
    if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
    appendFileSync(
      join(dataDir, "dev-verification-codes.log"),
      `${new Date().toISOString()} ${to} code=${code}\n`
    );
    return {
      sent: false,
      mode: "dev-log",
      message:
        "Email SMTP is not configured yet. Your verification code was saved for local testing.",
      debugCode: code,
    };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: smtpPass(),
    },
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
  });

  return { sent: true, mode: "smtp" };
}
