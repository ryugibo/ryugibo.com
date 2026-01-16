import { NotificationCard } from "../components/notification-card";

export const meta = () => [
  { title: "Notifications | wemake" },
  { name: "description", content: "Notifications" },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-20">
      <h1 className="text-4xl font-bold mb-6">Notifications</h1>
      <div className="flex flex-col items-start gap-5">
        <NotificationCard
          avatarUrl="https://github.com/shadcn.png"
          avatarFallback="CN"
          source="Steve Jobs"
          message="followed you"
          timestamp="2 days ago"
          seen={false}
        />
      </div>
    </div>
  );
}
