import { cpSync, mkdirSync, rmSync, existsSync, writeFileSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

const staticEntries = [
  "index.html",
  "rates.html",
  "styles.css",
  "main.js",
  "make-money",
  "how-to-ai",
  "workshop",
];

// Runtime files Hostinger needs inside the output directory
const runtimeEntries = ["server.js", "lib"];

if (existsSync(dist)) {
  rmSync(dist, { recursive: true, force: true });
}
mkdirSync(dist, { recursive: true });

for (const entry of [...staticEntries, ...runtimeEntries]) {
  const from = join(root, entry);
  const to = join(dist, entry);
  if (!existsSync(from)) {
    throw new Error(`Missing required file or folder: ${entry}`);
  }
  cpSync(from, to, { recursive: true });
}

// Minimal package.json so Hostinger can start from dist/ if needed
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
writeFileSync(
  join(dist, "package.json"),
  JSON.stringify(
    {
      name: pkg.name,
      version: pkg.version,
      private: true,
      type: "module",
      engines: pkg.engines,
      scripts: {
        start: "node server.js",
      },
      dependencies: pkg.dependencies,
    },
    null,
    2
  )
);

console.log("Built deployable app → dist/ (static + server.js + lib/)");
