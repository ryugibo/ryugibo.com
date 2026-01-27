import { Button } from "@ryugibo/ui/button";
import { Input } from "@ryugibo/ui/input";
import { data, Form } from "react-router";
import z from "zod";
import { Hero } from "~/common/components/hero.tsx";
import { ProductPagination } from "~/common/components/product-pagination.tsx";
import { ProductCard } from "~/features/products/components/product-card.tsx";
import { createSSRClient } from "~/supabase-client.ts";
import { getPagesByKeyword, getProductsByKeyword } from "../queries.ts";
import type { Route } from "./+types/search-page";

export const meta: Route.MetaFunction = () => [
  { title: "Search | wemake" },
  { name: "description", content: "Search Products" },
];

const paramsSchema = z.object({
  keyword: z.string().optional().default(""),
  page: z.coerce.number().default(1),
});

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);
  const { success, data: dataParams } = paramsSchema.safeParse(params);
  if (!success) {
    throw data({ error_code: "invalid_params", message: "invalid params" }, { status: 400 });
  }
  if (dataParams.keyword === "") {
    return { products: [], totalPages: 1 };
  }
  const { supabase } = createSSRClient(request);
  const products = await getProductsByKeyword(supabase, dataParams);
  const totalPages = await getPagesByKeyword(supabase, dataParams);
  return { products, totalPages };
};

export default function SearchPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-10">
      <Hero title="Search" description="Search for products by title or description" />
      <Form className="flex justify-center max-w-screen-sm items-center mx-auto gap-2">
        <Input name="keyword" placeholder="Search for products" className="text-lg" />
        <Button type="submit">Search</Button>
      </Form>
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
      <ProductPagination totalPages={loaderData.totalPages} />
    </div>
  );
}
