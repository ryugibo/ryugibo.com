import { Button } from "@ryugibo/ui/button";
import { Dialog, DialogTrigger } from "@ryugibo/ui/dialog";
import CreateReviewDialog from "~/common/components/create-review-dialog";
import { ReviewCard } from "~/features/products/components/review-card";

export const meta = () => {
  return [{ title: "Product Reviews" }, { name: "description", content: "Product Reviews" }];
};

export default function ProductReviewsPage() {
  return (
    <Dialog>
      <div className="space-y-10 max-w-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">10 Reviewed</h2>
          <DialogTrigger>
            <Button variant={"secondary"}>Write a Review</Button>
          </DialogTrigger>
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
      <CreateReviewDialog />
    </Dialog>
  );
}
