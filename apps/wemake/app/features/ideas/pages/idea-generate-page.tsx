import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { z } from "zod";
import { supabaseAdmin } from "~/supabase-client.ts";
import { insertIdeas } from "../mutations.ts";
import type { Route } from "./+types/idea-generate-page";

const openai = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});
const IdeaSchema = z.object({
  title: z.string(),
  description: z.string().max(100),
  problem: z.string(),
  solution: z.string(),
  category: z.enum(["tech", "business", "health", "education", "finance", "other"]),
});

const ResponseSchema = z.object({
  ideas: z.array(IdeaSchema).min(10),
});

export const action = async ({ request }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    return new Response(null, { status: 404 });
  }
  const header = request.headers.get("X-POTATO");
  if (!header || header !== process.env.API_SECRET_KEY) {
    return new Response(null, { status: 404 });
  }
  const completion = await openai.chat.completions.parse({
    model: "openai/gpt-4.1-mini",
    messages: [
      {
        role: "user",
        content:
          "Give the name and elevator pitch of startup ideas that can be built by small teams.",
      },
      {
        role: "user",
        content:
          "For example: 'An app that helps you find the best deals on groceries.', or 'A platform to rent a coder per hour.'",
      },
    ],
    response_format: zodResponseFormat(ResponseSchema, "ideas"),
  });

  const ideas = completion.choices[0].message.parsed?.ideas.map((idea) => idea.description);

  if (!ideas) {
    return Response.json(
      {
        error: "No ideas generated",
      },
      { status: 400 },
    );
  }

  await insertIdeas({
    supabase: supabaseAdmin,
    ideas,
  });

  return Response.json({ ok: true });
};
