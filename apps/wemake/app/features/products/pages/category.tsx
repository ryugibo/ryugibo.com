import type { Route } from "./+types/category";

export const meta: Route.MetaFunction = () => [
  { title: "Category | wemake" },
  { name: "description", content: "Product Category" },
];

export default function CategoryPage() {
  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold">Category</h1>
    </div>
  );
}
