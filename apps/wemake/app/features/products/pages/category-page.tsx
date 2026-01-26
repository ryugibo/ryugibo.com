import { Hero } from "~/common/components/hero.tsx";
import { ProductPagination } from "~/common/components/product-pagination.tsx";
import { ProductCard } from "~/features/products/components/product-card.tsx";

export const meta = () => [
  { title: "Developer Tools | wemake" },
  { name: "description", content: "Tools for developers to build products faster" },
];

export default function CategoryPage() {
  return (
    <div className="space-y-10">
      <Hero title="Developer Tools" description="Tools for developers to build products faster" />

      <div className="space-y-5 w-full max-w-3xl mx-auto">
        {[...Array(10).keys()].map((index) => (
          <ProductCard
            key={`${index}`}
            id={`${index}`}
            title="Product Title"
            description="Product Description"
            reviewsCount="12"
            viewsCount="12"
            upvotesCount="120"
          />
        ))}
      </div>
      <ProductPagination totalPages={10} />
    </div>
  );
}
