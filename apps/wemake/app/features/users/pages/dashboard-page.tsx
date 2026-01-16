import type { Route } from "./+types/dashboard-page";

export const meta: Route.MetaFunction = () => [
  { title: "Dashboard | Wemake" },
  { name: "description", content: "Dashboard" },
];

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold">Dashboard</h1>
    </div>
  );
}
