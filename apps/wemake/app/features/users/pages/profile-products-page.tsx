import { ProductCard } from "~/features/products/components/product-card.tsx";

export default function ProfileProductsPage() {
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
