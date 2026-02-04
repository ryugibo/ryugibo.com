import { data, useOutletContext } from "react-router";
import z from "zod";
import { createSSRClient } from "~/supabase-client.ts";
import type { Route } from "./+types/profile-page";

export const meta = (_: Route.MetaArgs) => [
  { title: "Profile | wenake" },
  { name: "description", content: "Profile" },
];

const paramsSchema = z.object({
  username: z.string(),
});

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { success, data: dataParams } = paramsSchema.safeParse(params);
  const { supabase, headers } = createSSRClient(request);
  if (success) {
    await supabase.rpc("track_event", {
      event_type: "profile_view",
      event_data: { username: dataParams.username },
    });
  }

  return data(null, { headers });
};

export default function ProfilePage() {
  const { headline, bio } = useOutletContext<{ headline: string; bio: string }>();
  return (
    <div className="max-w-3xl flex flex-col space-y-10">
      <div className="space-y-2">
        <h4 className="text-lg font-bold">Headline</h4>
        <p className="text-muted-foreground">{headline}</p>
      </div>
      <div className="space-y-2">
        <h4 className="text-lg font-bold">Bio</h4>
        <p className="text-muted-foreground">{bio}</p>
      </div>
    </div>
  );
}
