import type { Route } from "./+types/message-page";

export const meta: Route.MetaFunction = () => [
  { title: "Message | Wemake" },
  { name: "description", content: "Message" },
];

export default function MessagePage() {
  return (
    <div>
      <h1 className="text-4xl font-bold">Message</h1>
    </div>
  );
}
