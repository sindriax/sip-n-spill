import { handleQuestions } from "./questions";

interface Env {
  DB: D1Database;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/api/questions") {
      return handleQuestions(url.searchParams, env.DB);
    }
    return new Response("Not found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;
