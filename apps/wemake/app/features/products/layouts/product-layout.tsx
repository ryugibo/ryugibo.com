import { Button, buttonVariants, cn } from "@ryugibo/ui";
import { ChevronUpIcon, StarIcon } from "@ryugibo/ui/icons";
import { Link, NavLink, Outlet } from "react-router";
import { z } from "zod";
import { createSSRClient } from "~/supabase-client.ts";
import { getProductById } from "../queries.ts";
import type { Route } from "./+types/product-layout";

export const meta = ({ loaderData }: Route.MetaArgs) => {
  return [
    { title: `${loaderData.product.name} | wemake` },
    { name: "description", content: loaderData.product.description },
  ];
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
  const product = await getProductById({ supabase, id: Number(id) });
  return { product };
};
export default function ProductLayout({ loaderData }: Route.ComponentProps) {
  const { product } = loaderData;
  return (
    <div className="space-y-10">
      <div className="flex justify-between">
        <div className="flex gap-10">
          <div className="size-40 rounded-xl shadow-xl bg-primary/50"></div>
          <div>
            <h1 className="text-5xl font-bold">{product.name}</h1>
            <p className="text-2xl font-light">{product.tagline}</p>
            <div className="mt-5 flex items-center gap-2">
              <div className="flex gap-1 text-yellow-500">
                {[...Array(5).keys()].map((index) => (
                  <StarIcon
                    key={index}
                    className="size-4"
                    fill={index < Math.floor(product.average_rating) ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <span className="text-muted-foreground">{product.reviews} reviews</span>
            </div>
          </div>
        </div>
        <div className="flex gap-5">
          <Button variant="secondary" size="lg" className="text-lg h-14 px-10" asChild>
            <Link to={`/products/${product.id}/visit`}>Visit Website</Link>
          </Button>
          <Button size="lg" className="text-lg h-14 px-10">
            <ChevronUpIcon className="size-4" />
            Upvote ({product.upvotes})
          </Button>
        </div>
      </div>
      <div className="flex gap-2.5">
        <NavLink
          to={`/products/${product.id}/overview`}
          className={({ isActive }) =>
            cn([
              buttonVariants({ variant: "outline" }),
              isActive && "bg-accent text-accent-foreground",
            ])
          }
        >
          Overview
        </NavLink>
        <NavLink
          to={`/products/${product.id}/reviews`}
          className={({ isActive }) =>
            cn([
              buttonVariants({ variant: "outline" }),
              isActive && "bg-accent text-accent-foreground",
            ])
          }
        >
          Reviews
        </NavLink>
      </div>
      <div>
        <Outlet
          context={{
            id: product.id,
            description: product.description,
            how_it_works: product.how_it_works,
            review_count: product.reviews,
          }}
        />
      </div>
    </div>
  );
}
