export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be full or blocked (private mode); the app works without it.
  }
}

export const STORAGE_KEYS = {
  setup: "sns:setup",
  rulesSeen: "sns:rules-seen",
  deck: (lang: string, categories: readonly string[]) => `sns:deck:${lang}:${[...categories].sort().join("+")}`,
} as const;
