import { copyFileSync, cpSync, readdirSync, rmSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const dist = resolve(root, "../dist");
const pub = resolve(root, "../../backend/public");

copyFileSync(join(dist, "index.html"), join(pub, "spa.html"));

for (const name of readdirSync(dist)) {
  if (name === "index.html") continue;
  const from = join(dist, name);
  const to = join(pub, name);
  if (statSync(from).isDirectory()) {
    rmSync(to, { recursive: true, force: true });
    cpSync(from, to, { recursive: true });
  } else {
    copyFileSync(from, to);
  }
}

console.log("Copied SPA into backend/public");
