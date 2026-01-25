import { Hero } from "~/common/components/hero";
import { IdeaCard } from "~/features/ideas/components/idea-card";
import { getIdeas } from "../queries";
import type { Route } from "./+types/ideas-page";

export const meta = () => {
  return [
    { title: "IdeasGPT | wemake" },
    { name: "description", content: "Find ideas for your next project" },
  ];
};

export const loader = async () => {
  const ideas = await getIdeas({ limit: 20 });

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
