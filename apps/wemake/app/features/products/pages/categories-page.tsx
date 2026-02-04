import { data } from "react-router";
import { Hero } from "~/common/components/hero.tsx";
import { CategoryCard } from "~/features/products/components/category-card.tsx";
import { createSSRClient } from "~/supabase-client.ts";
import { getCategories } from "../queries.ts";
import type { Route } from "./+types/categories-page";

export const meta = () => {
  return [
    { title: "Categories | wemake" },
    { name: "description", content: "Browse products by category" },
  ];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase, headers } = createSSRClient(request);
  const categories = await getCategories({ supabase });
  return data({ categories }, { headers });
};

export default function CategoriesPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-10">
      <Hero title="Categories" description="Browse products by category" />
      <div className="grid grid-cols-4 gap-10">
        {loaderData.categories.map((category) => (
          <CategoryCard
            key={category.id}
            id={category.id}
            name={category.name}
            description={category.description}
          />
        ))}
      </div>
    </div>
  );
}
