import { data, Form } from "react-router";
import z from "zod";
import { Hero } from "~/common/components/hero";
import { ProductPagination } from "~/common/components/product-pagination";
import { Button } from "~/common/components/ui/button";
import { Input } from "~/common/components/ui/input";
import { ProductCard } from "~/features/products/components/product-card";
import type { Route } from "./+types/search-page";

export const meta: Route.MetaFunction = () => [
  { title: "Search | wemake" },
  { name: "description", content: "Search Products" },
];

const paramsSchema = z.object({
  query: z.string().optional().default(""),
  page: z.coerce.number().default(1),
});

export const loader = ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);
  const { success, data: parsedData } = paramsSchema.safeParse(params);
  if (!success) {
    throw data({ error_code: "invalid_params", message: "invalid params" }, { status: 400 });
  }
  return {
    ...parsedData,
  };
};

const products = Array.from({ length: 11 }).map((_, index) => ({
  id: `productId-${index}`,
  title: "Product Title",
  description: "Product Description",
  commentsCount: 12,
  viewsCount: 12,
  upvotesCount: 120,
}));

export default function SearchPage() {
  return (
    <div className="space-y-10">
      <Hero title="Search" description="Search for products by title or description" />
      <Form className="flex justify-center max-w-screen-sm items-center mx-auto gap-2">
        <Input name="query" placeholder="Search for products" className="text-lg" />
        <Button type="submit">Search</Button>
      </Form>
      <div className="space-y-5 w-full max-w-3xl mx-auto">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
      <ProductPagination totalPages={10} />
    </div>
  );
}
