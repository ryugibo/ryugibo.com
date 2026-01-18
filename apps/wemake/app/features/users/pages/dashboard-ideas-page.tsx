import { IdeaCard } from "~/features/ideas/components/idea-card";
import type { Route } from "./+types/dashboard-ideas-page";

export const meta = (_: Route.MetaArgs) => [
  { title: "My Ideas | wemake" },
  { name: "description", content: "My Ideas" },
];

export default function DashboardIdeasPage() {
  return (
    <div className="space-y-5 h-full">
      <h1 className="text-2xl font-semibold mb-6">Claimed Ideas</h1>
      <div className="grid grid-cols-4 gap-6">
        {[...Array(5).keys()].map((index) => (
          <IdeaCard
            key={`ideaId-${index}`}
            id={`ideaId-${index}`}
            title="A startup that creates an AI-powered generated personal trainer, delivering customized fitness recommendations and tracking of progress using a mobile app to track workouts and progress as well as a website to manage the business."
            viewCount={123}
            createdAt={"12 hours ago"}
            likesCount={12}
          />
        ))}
      </div>
    </div>
  );
}
