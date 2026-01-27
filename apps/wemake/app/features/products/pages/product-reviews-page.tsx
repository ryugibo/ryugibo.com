import { Button } from "@ryugibo/ui/button";
import { Dialog, DialogTrigger } from "@ryugibo/ui/dialog";
import { useOutletContext } from "react-router";
import z from "zod";
import CreateReviewDialog from "~/common/components/create-review-dialog.tsx";
import { ReviewCard } from "~/features/products/components/review-card.tsx";
import { getReviewsByProductId } from "../queries.ts";
import type { Route } from "./+types/product-reviews-page.ts";

export const meta = () => {
  return [{ title: "Product Reviews" }, { name: "description", content: "Product Reviews" }];
};

const paramsSchema = z.object({
  productId: z.coerce.number(),
});
export const loader = async ({ params }: Route.LoaderArgs) => {
  const { success, data } = paramsSchema.safeParse(params);
  if (!success) {
    throw new Error("Invalid params");
  }
  const reviews = await getReviewsByProductId(data.productId);
  return { reviews };
};

export default function ProductReviewsPage({ loaderData }: Route.ComponentProps) {
  const { review_count } = useOutletContext<{
    review_count: number;
  }>();
  return (
    <Dialog>
      <div className="space-y-10 max-w-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {review_count} Review{review_count > 1 && "s"}
          </h2>
          <DialogTrigger>
            <Button variant={"secondary"}>Write a Review</Button>
          </DialogTrigger>
        </div>
        <div className="space-y-20">
          {loaderData.reviews.map((review) => (
            <ReviewCard
              key={review.id}
              avatarUrl={review.profiles.avatar}
              authorName={review.profiles.name}
              authorUsername={review.profiles.username}
              rating={review.rating}
              content={review.comment}
              postedAt={review.created_at}
            />
          ))}
        </div>
      </div>
      <CreateReviewDialog />
    </Dialog>
  );
}
