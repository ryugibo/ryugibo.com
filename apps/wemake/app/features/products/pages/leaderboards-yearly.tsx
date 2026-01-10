import type { Route } from "./+types/leaderboards-yearly";

export const meta: Route.MetaFunction = () => [
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
