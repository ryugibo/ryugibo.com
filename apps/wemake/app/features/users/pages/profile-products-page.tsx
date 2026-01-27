import { z } from "zod";
import { ProductCard } from "~/features/products/components/product-card.tsx";
import { getProductsByUsername } from "../queries.ts";
import type { Route } from "./+types/profile-products-page";

const paramsSchema = z.object({
  username: z.string(),
});

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { success, data } = paramsSchema.safeParse(params);
  if (!success) {
    throw new Error("Invalid params");
  }
  const { username } = data;
  const products = await getProductsByUsername(username);
  return { products };
};

export default function ProfileProductsPage({ loaderData }: Route.ComponentProps) {
  const { products } = loaderData;
  return (
    <div className="flex flex-col gap-5">
      {products.map((product) => (
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
  );
}
