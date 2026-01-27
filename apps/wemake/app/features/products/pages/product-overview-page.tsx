import { useOutletContext } from "react-router";
import supabase from "~/supabase-client.ts";
import type { Route } from "./+types/product-overview-page";

export const loader = async ({ params }: Route.LoaderArgs) => {
  await supabase.rpc("track_event", {
    event_type: "product_view",
    event_data: { product_id: params.productId },
  });
  return null;
};

export default function ProductOverviewPage(_: Route.ComponentProps) {
  const { description, how_it_works } = useOutletContext<{
    description: string;
    how_it_works: string;
  }>();
  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <h3 className="text-lg font-bold">What is this product?</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold">How does it work?</h3>
        <p className="text-muted-foreground">{how_it_works}</p>
      </div>
    </div>
  );
}
