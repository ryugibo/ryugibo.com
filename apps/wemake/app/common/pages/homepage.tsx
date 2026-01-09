import type { MetaFunction } from "react-router";
import { ProductCard } from "../../features/products/components/product-card";

export const meta: MetaFunction = () => [
  {
    title: "Home",
  },
  { name: "description", content: "Welcome to wemake" },
];
const products = Array.from({ length: 11 }).map((_, index) => ({
  id: `productId-${index}`,
  title: "Product Title",
  description: "Product Description",
  commentsCount: 12,
  viewsCount: 12,
  upvotesCount: 120,
}));

export default function Homepage() {
  return <div className="px-20">
    <div className="grid grid-cols-3 gap-4">
      <div>
        <h2 className="text-5xl font-bold leading-tight tracking-tight">
          Today's Products
        </h2>
        <p className="text-xl font-light text-foreground">The best products made by our community today.</p>
      </div>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
        />
      ))}
    </div>
  </div>;
}
