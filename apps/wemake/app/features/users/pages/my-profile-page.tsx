import { redirect } from "react-router";
import { createSSRClient } from "~/supabase-client.ts";
import { getProfileById } from "../queries.ts";
import type { Route } from "./+types/my-profile-page";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase, getAuthUser, headers } = createSSRClient(request);
  const user = await getAuthUser();
  if (!user) {
    return redirect("/", { headers });
  }
  const { id } = user;
  const profile = await getProfileById({ supabase, id });
  return redirect(`/users/${profile.username}`, { headers });
};
