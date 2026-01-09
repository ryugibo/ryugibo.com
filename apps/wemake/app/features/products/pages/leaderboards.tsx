import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "Leaderboards | wemake" },
  { name: "description", content: "Product Leaderboards" },
];

export default function LeaderboardsPage() {
  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold">Leaderboards</h1>
    </div>
  );
}
