import { resolveDeckQuery } from "../src/lib/game";

export interface QuestionStore {
  prepare(sql: string): { bind(...values: unknown[]): { all<T>(): Promise<{ results: T[] }> } };
}

export async function handleQuestions(params: URLSearchParams, db: QuestionStore): Promise<Response> {
  const { lang, categories } = resolveDeckQuery(params);
  const placeholders = categories.map(() => "?").join(", ");
  const { results } = await db
    .prepare(`SELECT text FROM questions WHERE lang = ? AND category IN (${placeholders}) ORDER BY id`)
    .bind(lang, ...categories)
    .all<{ text: string }>();

  return Response.json(
    { questions: results.map((row) => row.text) },
    { headers: { "Cache-Control": "public, max-age=600" } },
  );
}
