export const VALID_LANGUAGES = ["en", "es"] as const;
export const VALID_CATEGORIES = ["chill", "spicy", "unhinged", "hotseat"] as const;
export const VALID_MODES = ["classic", "standard", "hotseat"] as const;

export type Language = (typeof VALID_LANGUAGES)[number];
export type Category = (typeof VALID_CATEGORIES)[number];
export type GameMode = (typeof VALID_MODES)[number];

export function sanitizeString(input: string, maxLength: number = 50): string {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>'"&]/g, ""); // Remove potentially dangerous characters
}

export function validateLanguage(lang: string | null): Language {
  const sanitized = lang ? sanitizeString(lang, 5).toLowerCase() : "es";
  return VALID_LANGUAGES.includes(sanitized as Language)
    ? (sanitized as Language)
    : "es";
}

export function validateCategories(categoriesParam: string | null): Category[] {
  if (!categoriesParam) {
    return ["spicy"];
  }

  const sanitized = sanitizeString(categoriesParam, 100);
  const requested = sanitized.split(",").map((c) => c.trim().toLowerCase());
  const valid = requested.filter((c) =>
    VALID_CATEGORIES.includes(c as Category)
  ) as Category[];

  return valid.length > 0 ? valid : ["spicy"];
}

export function validateMode(mode: string | null): GameMode | null {
  if (!mode) return null;
  const sanitized = sanitizeString(mode, 20).toLowerCase();
  return VALID_MODES.includes(sanitized as GameMode)
    ? (sanitized as GameMode)
    : null;
}

export interface ValidationResult {
  lang: Language;
  categories: Category[];
  mode: GameMode | null;
}

export function validateQueryParams(searchParams: URLSearchParams): ValidationResult {
  const lang = validateLanguage(searchParams.get("lang"));
  const categoriesParam =
    searchParams.get("categories") || searchParams.get("category");
  const categories = validateCategories(categoriesParam);
  const mode = validateMode(searchParams.get("mode"));

  return { lang, categories, mode };
}
