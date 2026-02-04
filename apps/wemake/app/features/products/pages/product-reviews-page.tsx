import { Button, Dialog, DialogTrigger } from "@ryugibo/ui";
import { parseZodError } from "@ryugibo/utils";
import { useEffect, useState } from "react";
import { data, redirect, useOutletContext } from "react-router";
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
  const { success, data: paramsData } = paramsSchema.safeParse(params);
  if (!success) {
    throw new Error("Invalid params");
  }
  const { id } = paramsData;
  const { supabase, headers } = createSSRClient(request);
  const reviews = await getReviewsByProductId({ supabase, id: Number(id) });
  return data({ id, reviews }, { headers });
};

const reviewSchema = z.object({
  product_id: z.coerce.number(),
  rating: z.coerce.number(),
  comment: z.string(),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const { pathname } = new URL(request.url);
  const { supabase, headers, getAuthUser } = createSSRClient(request);

  const defaultReturn = {
    data: null,
    formError: null,
    success: false,
  };

  const user = await getAuthUser();
  if (!user) {
    return redirect(pathname, { headers });
  }
  const { id: profile_id } = user;
  const {
    success: successForm,
    data: dataForm,
    error: errorForm,
  } = reviewSchema.safeParse(Object.fromEntries(await request.formData()));

  if (!successForm) {
    const formError = parseZodError(errorForm);
    return data({ ...defaultReturn, formError }, { headers });
  }

  const { rating, comment, product_id } = dataForm;
  await createReview({ supabase, rating, comment, profile_id, product_id });
  return data({ ...defaultReturn, success: true }, { headers });
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
