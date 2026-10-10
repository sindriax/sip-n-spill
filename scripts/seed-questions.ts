import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { CATEGORIES, LANGUAGES, type Category, type Language } from "../src/lib/game";

type Deck = Record<Category, string[]>;

const target = process.argv[2];
if (target !== "--local" && target !== "--remote") {
  console.error("Usage: tsx scripts/seed-questions.ts --local | --remote");
  process.exit(1);
}

const quote = (value: string) => `'${value.replace(/'/g, "''")}'`;
const rows: string[] = [];

for (const lang of LANGUAGES) {
  const deck = JSON.parse(readFileSync(join("src", "data", `questions_${lang}.json`), "utf8")) as Deck;
  for (const category of CATEGORIES) {
    for (const text of deck[category]) rows.push(`(${quote(lang satisfies Language)}, ${quote(category)}, ${quote(text)})`);
  }
}

const statements = ["DELETE FROM questions;"];
for (let i = 0; i < rows.length; i += 100) {
  statements.push(`INSERT INTO questions (lang, category, text) VALUES\n${rows.slice(i, i + 100).join(",\n")};`);
}

const file = join(mkdtempSync(join(tmpdir(), "sip-n-spill-seed-")), "seed.sql");
writeFileSync(file, statements.join("\n\n"));
execFileSync("npx", ["wrangler", "d1", "execute", "sip-n-spill", target, "--file", file], { stdio: "inherit" });
console.log(`Seeded ${rows.length} questions (${target.slice(2)}).`);
