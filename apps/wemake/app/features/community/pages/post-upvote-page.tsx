import { redirect } from "react-router";
import z from "zod";
import { createSSRClient } from "~/supabase-client.ts";
import { toggleUpvote } from "../mutations.ts";
import type { Route } from "./+types/post-upvote-page";

const paramsSchema = z.object({
  id: z.coerce.number(),
});

export const action = async ({ params, request }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    throw new Response("Invalid method", { status: 405 });
  }
  const { success, data } = paramsSchema.safeParse(params);
  if (!success) {
    throw new Error("Invalid params");
  }
  const { id: post_id } = data;
  const { supabase, getAuthUser } = await createSSRClient(request);
  const user = await getAuthUser();
  if (!user) {
    throw redirect("/");
  }
  const { id: profile_id } = user;
  await toggleUpvote({
    supabase,
    profile_id,
    post_id,
  });
};
