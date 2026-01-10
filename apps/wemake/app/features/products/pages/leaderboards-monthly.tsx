import type { Route } from "./+types/leaderboards-monthly";

export const meta: Route.MetaFunction = () => [
  { title: "Monthly Leaderboard | wemake" },
  { name: "description", content: "Monthly Product Leaderboard" },
];

export default function LeaderboardsMonthlyPage() {
  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold">Monthly Leaderboard</h1>
    </div>
  );
}
