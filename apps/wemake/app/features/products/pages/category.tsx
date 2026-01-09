import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
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
