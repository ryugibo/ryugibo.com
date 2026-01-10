import type { Route } from "./+types/search";

export const meta: Route.MetaFunction = () => [
  { title: "Search | wemake" },
  { name: "description", content: "Search Products" },
];

export default function SearchPage() {
  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold">Search</h1>
    </div>
  );
}
