import { Hero } from "~/common/components/hero.tsx";
import { IdeaCard } from "~/features/ideas/components/idea-card.tsx";
import { createSSRClient } from "~/supabase-client.ts";
import { getIdeas } from "../queries.ts";
import type { Route } from "./+types/ideas-page";

export const meta = () => {
  return [
    { title: "IdeasGPT | wemake" },
    { name: "description", content: "Find ideas for your next project" },
  ];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase } = createSSRClient(request);
  const ideas = await getIdeas(supabase, { limit: 20 });

  return { ideas };
};

export default function IdeasPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-20">
      <Hero title="IdeasGPT" description="Find ideas for your next project" />
      <div className="grid grid-cols-4 gap-4">
        {loaderData.ideas.map((idea) => (
          <IdeaCard
            key={idea.id}
            id={idea.id}
            title={idea.idea}
            viewCount={idea.views}
            createdAt={idea.created_at}
            likesCount={idea.likes}
            claimed={idea.is_claimed}
          />
        ))}
      </div>
    </div>
  );
}
