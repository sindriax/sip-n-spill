import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const OUT = "out";

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const toUrl = (path: string) => "/" + relative(OUT, path).split("\\").join("/");

const pages = readdirSync(OUT)
  .filter((name) => name.endsWith(".html") && name !== "404.html")
  .map((name) => (name === "index.html" ? "/" : `/${name.replace(/\.html$/, "")}`));

const assets = [...walk(join(OUT, "_next", "static")), ...walk(join(OUT, "assets"))]
  .filter((path) => !path.endsWith(".map"))
  .map(toUrl);

const precache = [...pages, ...assets, "/icon-192.png", "/manifest.webmanifest"].sort();
const version = createHash("sha256").update(precache.join("\n")).digest("hex").slice(0, 12);

const swPath = join(OUT, "sw.js");
const sw = readFileSync(swPath, "utf8").replace('"__VERSION__"', JSON.stringify(version)).replace("__PRECACHE__", JSON.stringify(precache));
writeFileSync(swPath, sw);
console.log(`Service worker ${version}: ${precache.length} precached files.`);
