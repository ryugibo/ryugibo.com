import type { Route } from "./+types/leaderboards-weekly";

export const meta: Route.MetaFunction = () => [
  { title: "Weekly Leaderboard | wemake" },
  { name: "description", content: "Weekly Product Leaderboard" },
];

export default function LeaderboardsWeeklyPage() {
  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold">Weekly Leaderboard</h1>
    </div>
  );
}
