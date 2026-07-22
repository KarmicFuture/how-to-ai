import { cpSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

const entries = [
  "index.html",
  "rates.html",
  "styles.css",
  "main.js",
  "make-money",
  "how-to-ai",
  "workshop",
];

if (existsSync(dist)) {
  rmSync(dist, { recursive: true, force: true });
}
mkdirSync(dist, { recursive: true });

for (const entry of entries) {
  const from = join(root, entry);
  const to = join(dist, entry);
  if (!existsSync(from)) {
    throw new Error(`Missing required file or folder: ${entry}`);
  }
  cpSync(from, to, { recursive: true });
}

console.log("Built static site → dist/");
