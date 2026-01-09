import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "Yearly Leaderboard | wemake" },
  { name: "description", content: "Yearly Product Leaderboard" },
];

export default function LeaderboardsYearlyPage() {
  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold">Yearly Leaderboard</h1>
    </div>
  );
}
