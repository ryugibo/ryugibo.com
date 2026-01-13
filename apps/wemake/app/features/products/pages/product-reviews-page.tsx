import { Button } from "~/common/components/ui/button";
import { ReviewCard } from "../components/review-card";

export const meta = () => {
  return [{ title: "Product Reviews" }, { name: "description", content: "Product Reviews" }];
};

export default function ProductReviewsPage() {
  return (
    <div className="space-y-10 max-w-xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">10 Reviewed</h2>
        <Button variant="secondary">Write a Review</Button>
      </div>
      <div className="space-y-20">
        {[...Array(10).keys()].map((index) => (
          <ReviewCard
            key={index}
            avatarUrl="https://github.com/ryugibo.png"
            authorName="John Doe"
            authorUsername="@username"
            rating={5}
            content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod."
            postedAt="10 days ago"
          />
        ))}
      </div>
    </div>
  );
}
