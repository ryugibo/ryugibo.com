import { Hero } from "~/common/components/hero.tsx";
import { CategoryCard } from "~/features/products/components/category-card.tsx";
import { createSSRClient } from "~/supabase-client.ts";
import { getCategories } from "../queries.ts";
import type { Route } from "./+types/categories-page.ts";

export const meta = (_: Route.MetaArgs) => [
  { title: "Categories | wemake" },
  { name: "description", content: "Product Categories" },
];

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase } = createSSRClient(request);
  const categories = await getCategories({ supabase });
  return { categories };
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
