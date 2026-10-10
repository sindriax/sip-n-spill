import { loadDeck, shuffle } from "../../app/lib/deck";
import { DEFAULT_CONFIG } from "@/lib/game";

const config = { ...DEFAULT_CONFIG, lang: "en" as const, mode: "classic" as const, vibes: ["spicy" as const] };

function mockFetch(response: Partial<Response> | Error) {
  global.fetch = jest.fn(() => (response instanceof Error ? Promise.reject(response) : Promise.resolve(response as Response)));
}

beforeEach(() => localStorage.clear());

describe("shuffle", () => {
  it("returns a permutation without mutating the input", () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
    expect([...result].sort()).toEqual(input);
  });
});

describe("loadDeck", () => {
  it("requests the deck for the config and caches it", async () => {
    mockFetch({ ok: true, json: async () => ({ questions: ["a", "b", 3] }) });
    await expect(loadDeck(config)).resolves.toEqual(["a", "b"]);
    expect(fetch).toHaveBeenCalledWith("/api/questions?lang=en&mode=classic&vibes=spicy");
    expect(JSON.parse(localStorage.getItem("sns:deck:en:spicy") ?? "[]")).toEqual(["a", "b"]);
  });

  it("falls back to the cached deck when the network fails", async () => {
    localStorage.setItem("sns:deck:en:spicy", JSON.stringify(["cached"]));
    mockFetch(new Error("offline"));
    await expect(loadDeck(config)).resolves.toEqual(["cached"]);
  });

  it("rejects when there is no cache and the API fails", async () => {
    mockFetch({ ok: false, status: 500 });
    await expect(loadDeck(config)).rejects.toThrow("500");
  });

  it("treats an empty deck as a failure", async () => {
    mockFetch({ ok: true, json: async () => ({ questions: [] }) });
    await expect(loadDeck(config)).rejects.toThrow("empty");
  });
});
