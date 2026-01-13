import { ChevronUpIcon, StarIcon } from "lucide-react";
import { NavLink, Outlet } from "react-router";
import { Button, buttonVariants } from "~/common/components/ui/button";
import { cn } from "~/lib/utils";
import type { Route } from "./+types/product-layout";

export default function ProductLayout({ params }: Route.ComponentProps) {
  const { productId } = params;
  return (
    <div className="space-y-10">
      <div className="flex justify-between">
        <div className="flex gap-10">
          <div className="size-40 rounded-xl shadow-xl bg-primary/50"></div>
          <div>
            <h1 className="text-5xl font-bold">Product Name</h1>
            <p className="text-2xl font-light">Product Description</p>
            <div className="mt-5 flex items-center gap-2">
              <div className="flex gap-1 text-yellow-500">
                {[...Array(5).keys()].map((index) => (
                  <StarIcon key={index} className="size-4" fill="currentColor" />
                ))}
              </div>
              <span className="text-muted-foreground">100 reviews</span>
            </div>
          </div>
        </div>
        <div className="flex gap-5">
          <Button variant="secondary" size="lg" className="text-lg h-14 px-10">
            Visit Website
          </Button>
          <Button size="lg" className="text-lg h-14 px-10">
            <ChevronUpIcon className="size-4" />
            Upvote (100)
          </Button>
        </div>
      </div>
      <div className="flex gap-2.5">
        <NavLink
          to={`/products/${productId}/overview`}
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
          to={`/products/${productId}/reviews`}
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
        <Outlet />
      </div>
    </div>
  );
}
