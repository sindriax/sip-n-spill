/**
 * @jest-environment node
 */
import { handleQuestions, type QuestionStore } from "../../../worker/questions";

function fakeStore(rows: { text: string }[]) {
  const calls: { sql: string; values: unknown[] }[] = [];
  const store: QuestionStore = {
    prepare: (sql) => ({
      bind: (...values) => {
        calls.push({ sql, values });
        return { all: async <T>() => ({ results: rows as T[] }) };
      },
    }),
  };
  return { store, calls };
}

describe("handleQuestions", () => {
  it("queries the requested language and vibes and returns plain text", async () => {
    const { store, calls } = fakeStore([{ text: "one" }, { text: "two" }]);
    const response = await handleQuestions(new URLSearchParams("lang=es&mode=classic&vibes=chill,spicy"), store);

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toContain("max-age");
    await expect(response.json()).resolves.toEqual({ questions: ["one", "two"] });
    expect(calls[0].sql).toContain("category IN (?, ?)");
    expect(calls[0].values).toEqual(["es", "chill", "spicy"]);
  });

  it("ignores vibes outside classic mode and sanitises bad input", async () => {
    const { store, calls } = fakeStore([]);
    await handleQuestions(new URLSearchParams("lang=xx&mode=hotseat&vibes=<script>"), store);
    expect(calls[0].values).toEqual(["en", "hotseat"]);
  });
});
