import { Button, Dialog, DialogTrigger } from "@ryugibo/ui";
import { parseZodError } from "@ryugibo/utils";
import { useEffect, useState } from "react";
import { redirect, useOutletContext } from "react-router";
import z from "zod";
import CreateReviewDialog from "~/common/components/create-review-dialog.tsx";
import { ReviewCard } from "~/features/products/components/review-card.tsx";
import { createSSRClient } from "~/supabase-client.ts";
import { createReview } from "../mutations.ts";
import { getReviewsByProductId } from "../queries.ts";
import type { Route } from "./+types/product-reviews-page.ts";

export const meta = () => {
  return [{ title: "Product Reviews" }, { name: "description", content: "Product Reviews" }];
};

const paramsSchema = z.object({
  id: z.coerce.number(),
});

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { success, data } = paramsSchema.safeParse(params);
  if (!success) {
    throw new Error("Invalid params");
  }
  const { id } = data;
  const { supabase } = createSSRClient(request);
  const reviews = await getReviewsByProductId({ supabase, id: Number(id) });
  return { id, reviews };
};

const reviewSchema = z.object({
  product_id: z.coerce.number(),
  rating: z.coerce.number(),
  comment: z.string(),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const { pathname } = new URL(request.url);
  const { supabase, getAuthUser } = createSSRClient(request);
  const user = await getAuthUser();
  if (!user) {
    throw redirect(pathname);
  }
  const { id: profile_id } = user;
  const {
    success,
    data,
    error: formZodError,
  } = reviewSchema.safeParse(Object.fromEntries(await request.formData()));
  if (!success) {
    const formError = parseZodError(formZodError);
    return { succes: false, formError };
  }
  const { rating, comment, product_id } = data;
  await createReview({ supabase, rating, comment, profile_id, product_id });
  return { success: true };
};

export default function ProductReviewsPage({ loaderData, actionData }: Route.ComponentProps) {
  const { id, reviews } = loaderData;
  const { review_count } = useOutletContext<{
    review_count: number;
  }>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (actionData?.success) {
      setOpen(false);
    }
  }, [actionData]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          {reviews.map((review) => (
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
      <CreateReviewDialog productId={id} />
    </Dialog>
  );
}
