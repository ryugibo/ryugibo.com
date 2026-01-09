import { Link, type MetaFunction } from "react-router";
import { PostCard } from "../../features/community/components/post-card";
import { ProductCard } from "../../features/products/components/product-card";
import { Button } from "../components/ui/button";

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

const posts = Array.from({ length: 10 }).map((_, index) => ({
  id: `postId-${index}`,
  title: "What is the best productivity tool?",
  authorName: "Wemake",
  authorAvatarUrl: "https://github.com/shadcn.png",
  category: "Productivity",
  postedAt: "12 hours ago"
}));

export default function Homepage() {
  return <div className="px-20 space-y-40">
    <div className="grid grid-cols-3 gap-4">
      <div>
        <h2 className="text-5xl font-bold leading-tight tracking-tight">
          Today's Products
        </h2>
        <p className="text-2xl font-light text-foreground">The best products made by our community today.</p>
        <Button variant="link" asChild className="text-lg p-0">
          <Link to="/products">Explore all products &rarr;</Link>
        </Button>
      </div>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
        />
      ))}
    </div>
    <div className="grid grid-cols-3 gap-4">
      <div>
        <h2 className="text-5xl font-bold leading-tight tracking-tight">
          Latest Discussions
        </h2>
        <p className="text-2xl font-light text-foreground">The latest discussions from our community.</p>
        <Button variant="link" asChild className="text-lg p-0">
          <Link to="/community">Explore all discussions &rarr;</Link>
        </Button>
      </div>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          {...post}
        />
      ))}
    </div>
  </div>;
}
