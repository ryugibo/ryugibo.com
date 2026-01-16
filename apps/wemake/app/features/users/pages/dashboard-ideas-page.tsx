import type { Route } from "./+types/dashboard-ideas-page";

export const meta: Route.MetaFunction = () => [
  { title: "My Ideas | Wemake" },
  { name: "description", content: "My Ideas" },
];

export default function DashboardIdeasPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold">My Ideas</h1>
    </div>
  );
}
