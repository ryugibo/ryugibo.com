import type { Route } from "./+types/notifications-page";

export const meta: Route.MetaFunction = () => [
  { title: "Notifications | Wemake" },
  { name: "description", content: "Notifications" },
];

export default function NotificationsPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold">Notifications</h1>
    </div>
  );
}
