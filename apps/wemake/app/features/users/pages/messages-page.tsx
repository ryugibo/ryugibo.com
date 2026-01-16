import type { Route } from "./+types/messages-page";

export const meta: Route.MetaFunction = () => [
  { title: "Messages | Wemake" },
  { name: "description", content: "Messages" },
];

export default function MessagesPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold">Messages</h1>
    </div>
  );
}
