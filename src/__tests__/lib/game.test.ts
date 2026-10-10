import {
  DEFAULT_CONFIG,
  canStart,
  categoriesFor,
  fromSearchParams,
  parsePlayers,
  parseVibes,
  resolveDeckQuery,
  sanitizeConfig,
  toSearchParams,
} from "@/lib/game";

describe("parseVibes", () => {
  it("keeps only known vibes in canonical order", () => {
    expect(parseVibes("unhinged, Chill,nope")).toEqual(["chill", "unhinged"]);
  });

  it("falls back to the default selection when nothing is valid", () => {
    expect(parseVibes("")).toEqual(DEFAULT_CONFIG.vibes);
    expect(parseVibes(null)).toEqual(DEFAULT_CONFIG.vibes);
  });
});

describe("parsePlayers", () => {
  it("trims, dedupes case-insensitively and caps name length", () => {
    expect(parsePlayers(" Ana , ana,  Luis   Pérez ,, ")).toEqual(["Ana", "Luis Pérez"]);
    expect(parsePlayers("a".repeat(40))).toEqual(["a".repeat(20)]);
  });

  it("caps the number of players", () => {
    const names = Array.from({ length: 20 }, (_, i) => `p${i}`).join(",");
    expect(parsePlayers(names)).toHaveLength(12);
  });
});

describe("categoriesFor / resolveDeckQuery", () => {
  it("maps classic to the chosen vibes and other modes to their own deck", () => {
    expect(categoriesFor("classic", ["spicy"])).toEqual(["spicy"]);
    expect(categoriesFor("hotseat", ["spicy"])).toEqual(["hotseat"]);
    expect(categoriesFor("date", [])).toEqual(["date"]);
  });

  it("resolves a raw query into a language and categories", () => {
    expect(resolveDeckQuery(new URLSearchParams("lang=ES&mode=classic&vibes=chill,unhinged"))).toEqual({
      lang: "es",
      categories: ["chill", "unhinged"],
    });
    expect(resolveDeckQuery(new URLSearchParams("lang=fr&mode=hotseat&vibes=chill"))).toEqual({
      lang: "en",
      categories: ["hotseat"],
    });
  });
});

describe("canStart", () => {
  it("requires two players for hot seat only", () => {
    expect(canStart({ ...DEFAULT_CONFIG, mode: "hotseat", players: ["A"] })).toBe(false);
    expect(canStart({ ...DEFAULT_CONFIG, mode: "hotseat", players: ["A", "B"] })).toBe(true);
    expect(canStart({ ...DEFAULT_CONFIG, mode: "classic", players: [] })).toBe(true);
    expect(canStart({ ...DEFAULT_CONFIG, mode: "date", players: [] })).toBe(true);
  });
});

describe("search params round trip", () => {
  it("serialises only what the mode needs", () => {
    const params = toSearchParams({ lang: "es", mode: "date", vibes: ["chill"], players: ["A", "B"] });
    expect(params.toString()).toBe("lang=es&mode=date");
  });

  it("round-trips a classic config with players", () => {
    const config = { lang: "en" as const, mode: "classic" as const, vibes: ["spicy" as const, "unhinged" as const], players: ["Ana", "Luis"] };
    expect(fromSearchParams(toSearchParams(config))).toEqual(config);
  });
});

describe("sanitizeConfig", () => {
  it("repairs a corrupted stored config", () => {
    expect(sanitizeConfig({ lang: 42, mode: "party", vibes: "spicy", players: ["x", 7, "x"] })).toEqual({
      lang: "en",
      mode: "classic",
      vibes: ["spicy"],
      players: ["x", "7"],
    });
  });
});
