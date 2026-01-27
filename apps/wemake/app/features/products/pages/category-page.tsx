import z from "zod";
import { Hero } from "~/common/components/hero.tsx";
import { ProductPagination } from "~/common/components/product-pagination.tsx";
import { ProductCard } from "~/features/products/components/product-card.tsx";
import { createSSRClient } from "~/supabase-client.ts";
import { getCategoryById, getCategoryPages, getProductsByCategory } from "../queries.ts";
import type { Route } from "./+types/category-page";

export const meta = () => [
  { title: "Developer Tools | wemake" },
  { name: "description", content: "Tools for developers to build products faster" },
];

const paramsSchema = z.object({
  id: z.coerce.number(),
});
export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const { success, data: dataParams } = paramsSchema.safeParse(params);
  if (!success) {
    throw new Response("Invalid params", { status: 400 });
  }
  const { id } = dataParams;
  const { supabase } = createSSRClient(request);
  const category = await getCategoryById(supabase, { id });
  const products = await getProductsByCategory(supabase, { id, page });
  const totalPage = await getCategoryPages(supabase, { id });

  return { category, products, totalPage };
};

export default function CategoryPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-10">
      <Hero title={loaderData.category.name} description={loaderData.category.description} />

      <div className="space-y-5 w-full max-w-3xl mx-auto">
        {loaderData.products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.name}
            description={product.tagline}
            reviewsCount={product.reviews}
            viewsCount={product.views}
            upvotesCount={product.upvotes}
          />
        ))}
      </div>
      <ProductPagination totalPages={loaderData.totalPage} />
    </div>
  );
}
