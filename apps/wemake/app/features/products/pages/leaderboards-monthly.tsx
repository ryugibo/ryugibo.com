import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
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
