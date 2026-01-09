import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "Products | wemake" },
  { name: "description", content: "Browse all products" },
];

export default function ProductsPage() {
  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold">Products</h1>
    </div>
  );
}
