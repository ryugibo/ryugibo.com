import { Hero } from "~/common/components/hero";
import { TeamCard } from "~/features/teams/components/team-card";
import { getTeams } from "~/features/teams/queries";
import type { Route } from "./+types/teams-page";

export const meta = () => {
  return [{ title: "Teams | wemake" }, { description: "Find a team to work with" }];
};

export const loader = async () => {
  const teams = await getTeams({ limit: 7 });
  return { teams };
};
export default function TeamsPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-20">
      <Hero title="Teams" description="Find a team to work with on your next project." />
      <div className="grid grid-cols-4 gap-4">
        {loaderData.teams.map((team) => (
          <TeamCard
            key={team.id}
            id={team.id}
            leaderName={team.team_leader.username}
            leaderAvatarUrl={team.team_leader.avatar}
            positions={team.roles.split(",")}
            projectDescription={team.product_description}
          />
        ))}
      </div>
    </div>
  );
}
