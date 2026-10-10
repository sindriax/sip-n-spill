export const LANGUAGES = ["en", "es"] as const;
export const VIBES = ["chill", "spicy", "unhinged"] as const;
export const MODES = ["classic", "hotseat", "date"] as const;
export const CATEGORIES = [...VIBES, "hotseat", "date"] as const;

export type Language = (typeof LANGUAGES)[number];
export type Vibe = (typeof VIBES)[number];
export type Mode = (typeof MODES)[number];
export type Category = (typeof CATEGORIES)[number];

export interface GameConfig {
  lang: Language;
  mode: Mode;
  vibes: Vibe[];
  players: string[];
}

export const DEFAULT_CONFIG: GameConfig = {
  lang: "en",
  mode: "classic",
  vibes: [...VIBES],
  players: [],
};

export const MIN_HOTSEAT_PLAYERS = 2;
export const MAX_PLAYERS = 12;
export const MAX_PLAYER_NAME_LENGTH = 20;

function oneOf<T extends string>(list: readonly T[], value: string | null, fallback: T): T {
  const normalized = value?.trim().toLowerCase();
  return (list as readonly string[]).includes(normalized ?? "") ? (normalized as T) : fallback;
}

export function parseLanguage(value: string | null): Language {
  return oneOf(LANGUAGES, value, DEFAULT_CONFIG.lang);
}

export function parseMode(value: string | null): Mode {
  return oneOf(MODES, value, DEFAULT_CONFIG.mode);
}

export function parseVibes(value: string | null): Vibe[] {
  const requested = (value ?? "").split(",").map((v) => v.trim().toLowerCase());
  const vibes = VIBES.filter((vibe) => requested.includes(vibe));
  return vibes.length > 0 ? vibes : [...DEFAULT_CONFIG.vibes];
}

export function normalizePlayerName(value: string): string {
  return value.replace(/\s+/g, " ").trim().slice(0, MAX_PLAYER_NAME_LENGTH);
}

export function parsePlayers(value: string | null): string[] {
  const players: string[] = [];
  for (const raw of (value ?? "").split(",")) {
    const name = normalizePlayerName(raw);
    if (name && !players.some((p) => p.toLowerCase() === name.toLowerCase())) players.push(name);
    if (players.length === MAX_PLAYERS) break;
  }
  return players;
}

export function categoriesFor(mode: Mode, vibes: Vibe[]): Category[] {
  return mode === "classic" ? vibes : [mode];
}

export function resolveDeckQuery(params: URLSearchParams): { lang: Language; categories: Category[] } {
  const mode = parseMode(params.get("mode"));
  return {
    lang: parseLanguage(params.get("lang")),
    categories: categoriesFor(mode, parseVibes(params.get("vibes"))),
  };
}

export function canStart(config: GameConfig): boolean {
  switch (config.mode) {
    case "classic":
      return config.vibes.length > 0;
    case "hotseat":
      return config.players.length >= MIN_HOTSEAT_PLAYERS;
    case "date":
      return true;
  }
}

export function toSearchParams(config: GameConfig): URLSearchParams {
  const params = new URLSearchParams({ lang: config.lang, mode: config.mode });
  if (config.mode === "classic") params.set("vibes", config.vibes.join(","));
  if (config.mode === "hotseat") params.set("players", config.players.join(","));
  return params;
}

export function fromSearchParams(params: URLSearchParams): GameConfig {
  return sanitizeConfig({
    lang: params.get("lang"),
    mode: params.get("mode"),
    vibes: params.get("vibes"),
    players: params.get("players"),
  });
}

export function sanitizeConfig(input: Partial<Record<keyof GameConfig, unknown>>): GameConfig {
  const asList = (value: unknown) => (Array.isArray(value) ? value.map(String).join(",") : typeof value === "string" ? value : null);
  return {
    lang: parseLanguage(typeof input.lang === "string" ? input.lang : null),
    mode: parseMode(typeof input.mode === "string" ? input.mode : null),
    vibes: parseVibes(asList(input.vibes)),
    players: parsePlayers(asList(input.players)),
  };
}
