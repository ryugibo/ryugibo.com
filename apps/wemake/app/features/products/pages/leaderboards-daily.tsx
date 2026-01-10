import type { Route } from "./+types/leaderboards-daily";

export const meta: Route.MetaFunction = () => [
  { title: "Daily Leaderboard | wemake" },
  { name: "description", content: "Daily Product Leaderboard" },
];

export default function LeaderboardsDailyPage() {
  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold">Daily Leaderboard</h1>
    </div>
  );
}
