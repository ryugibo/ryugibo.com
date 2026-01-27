import { ProductCard } from "~/features/products/components/product-card.tsx";
import type { Route } from "./+types/profile-products-page";

export default function ProfileProductsPage(_: Route.ComponentProps) {
  return (
    <div className="flex flex-col gap-5">
      {[...Array(5).keys()].map((index) => (
        <ProductCard
          key={index}
          id={index}
          title="Product Title"
          description="Product Description"
          reviewsCount="12"
          viewsCount="12"
          upvotesCount="120"
        />
      ))}
    </div>
  );
}
