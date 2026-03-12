import type { APIRoute } from "astro";
import { snippets } from "../../db/schema.ts";
import { getDb } from "../../lib/db.server.ts";

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.profile) {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  const content = formData.get("content")?.toString();

  if (!content || content.length === 0) {
    return new Response("Content is required", { status: 400 });
  }

  if (content.length > 500) {
    return new Response("Content exceeds character limit", { status: 400 });
  }

  const env = import.meta.env;
  const db = getDb(env);

  try {
    await db.insert(snippets).values({
      profile_id: locals.profile.id,
      content,
    });

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (error) {
    console.error("Failed to insert snippet:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
