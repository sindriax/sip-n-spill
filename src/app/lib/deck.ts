import { categoriesFor, type GameConfig } from "@/lib/game";
import { readJson, STORAGE_KEYS, writeJson } from "./storage";

export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export async function loadDeck(config: GameConfig): Promise<string[]> {
  const categories = categoriesFor(config.mode, config.vibes);
  const cacheKey = STORAGE_KEYS.deck(config.lang, categories);
  const params = new URLSearchParams({ lang: config.lang, mode: config.mode, vibes: config.vibes.join(",") });

  try {
    const response = await fetch(`/api/questions?${params}`);
    if (!response.ok) throw new Error(`Questions API responded ${response.status}`);
    const data: { questions?: unknown } = await response.json();
    const questions = Array.isArray(data.questions) ? data.questions.filter((q): q is string => typeof q === "string") : [];
    if (questions.length === 0) throw new Error("Questions API returned an empty deck");
    writeJson(cacheKey, questions);
    return questions;
  } catch (error) {
    const cached = readJson<string[]>(cacheKey, []);
    if (cached.length > 0) return cached;
    throw error;
  }
}
