import { data, redirect } from "react-router";
import { IdeaCard } from "~/features/ideas/components/idea-card.tsx";
import { getClaimedIdeas } from "~/features/ideas/queries.ts";
import { createSSRClient } from "~/supabase-client.ts";
import type { Route } from "./+types/dashboard-ideas-page";

export const meta = (_: Route.MetaArgs) => [
  { title: "My Ideas | wemake" },
  { name: "description", content: "My Ideas" },
];

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase, getAuthUser, headers } = createSSRClient(request);
  const user = await getAuthUser();
  if (!user) {
    return redirect("/", { headers });
  }
  const { id: claimed_by } = user;
  const ideas = await getClaimedIdeas({ supabase, claimed_by });
  return data({ ideas }, { headers });
};

export default function DashboardIdeasPage({ loaderData }: Route.ComponentProps) {
  const { ideas } = loaderData;
  return (
    <div className="space-y-5 h-full">
      <h1 className="text-2xl font-semibold mb-6">Claimed Ideas</h1>
      <div className="grid grid-cols-4 gap-6">
        {ideas.map((idea) => (
          <IdeaCard key={idea.id} id={idea.id} title={idea.idea} owner={true} />
        ))}
      </div>
    </div>
  );
}
