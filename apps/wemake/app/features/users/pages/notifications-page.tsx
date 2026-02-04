import { data, redirect } from "react-router";
import { createSSRClient } from "~/supabase-client.ts";
import { NotificationCard } from "../components/notification-card.tsx";
import { getNotifications } from "../queries.ts";
import type { Route } from "./+types/notifications-page";

export const meta = () => [
  { title: "Notifications | wemake" },
  { name: "description", content: "Notifications" },
];

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase, headers, getAuthUser } = createSSRClient(request);
  const user = await getAuthUser();
  if (!user) {
    return redirect("/", { headers });
  }
  const { id } = user;
  const { notifications } = await getNotifications({ supabase, profile_id: id });
  return data({ notifications }, { headers });
};

export default function NotificationsPage({ loaderData }: Route.ComponentProps) {
  const { notifications } = loaderData;
  return (
    <div className="space-y-20">
      <h1 className="text-4xl font-bold mb-6">Notifications</h1>
      <div className="flex flex-col items-start gap-5">
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            avatar={notification.source.avatar}
            name={notification.source.name}
            type={notification.type}
            timestamp={notification.created_at}
            seen={notification.seen}
            product={notification.product}
            post={notification.post}
          />
        ))}
      </div>
    </div>
  );
}
