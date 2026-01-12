import type { Route } from "./+types/categories-page";

export const meta: Route.MetaFunction = () => [
  { title: "Categories | wemake" },
  { name: "description", content: "Product Categories" },
];

export default function CategoriesPage() {
  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold">Categories</h1>
    </div>
  );
}
