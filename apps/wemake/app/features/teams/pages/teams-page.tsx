import { Hero } from "~/common/components/hero";
import { TeamCard } from "~/features/teams/components/team-card";

export const meta = () => {
  return [{ title: "Teams | wemake" }, { description: "Find a team to work with" }];
};

export default function TeamsPage() {
  return (
    <div className="space-y-20">
      <Hero title="Teams" description="Find a team to work with on your next project." />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(7).keys()].map((index) => (
          <TeamCard
            key={`teamId-${index}`}
            id={`teamId-${index}`}
            leaderName={"wemake"}
            leaderAvatarUrl={"https://github.com/ryugibo.png"}
            positions={["React Developer", "Backend Developer", "Product Manager"]}
            projectDescription={"a new social media platform"}
          />
        ))}
      </div>
    </div>
  );
}
