import type { Route } from "./+types/dashboard-product-page";

export const meta: Route.MetaFunction = () => [
  { title: "Product Dashboard | Wemake" },
  { name: "description", content: "Product Dashboard" },
];

export default function DashboardProductPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold">Product Dashboard</h1>
    </div>
  );
}
