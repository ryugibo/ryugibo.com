import type { Route } from "./+types/promote-page";

export const meta: Route.MetaFunction = () => [
  { title: "Promote Product | wemake" },
  { name: "description", content: "Promote your product" },
];

export default function PromotePage() {
  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold">Promote Product</h1>
    </div>
  );
}
