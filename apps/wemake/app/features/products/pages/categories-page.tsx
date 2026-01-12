import { Hero } from "~/common/components/hero";
import { CategoryCard } from "../components/category-card";
import type { Route } from "./+types/categories-page";

export const meta = (_: Route.MetaArgs) => [
  { title: "Categories | wemake" },
  { name: "description", content: "Product Categories" },
];

export default function CategoriesPage() {
  return (
    <div className="space-y-10">
      <Hero title="Categories" description="Browse products by category" />
      <div className="grid grid-cols-4 gap-10">
        {[...Array(10).keys()].map((index) => (
          <CategoryCard
            key={`${index}`}
            id={`categoryId-${index}`}
            name="Category Name"
            description="Category Description"
          />
        ))}
      </div>
    </div>
  );
}
