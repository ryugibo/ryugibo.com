import { redirect } from "react-router";
import { createSSRClient } from "~/supabase-client.ts";
import { getUserById } from "../queries.ts";
import type { Route } from "./+types/my-profile-page";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase } = createSSRClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/auth/login");
  }
  const profile = await getUserById(supabase, { id: user.id });
  return redirect(`/users/${profile.username}`);
};
