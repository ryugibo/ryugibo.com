import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "Submit Product | wemake" },
  { name: "description", content: "Submit a new product" },
];

export default function SubmitPage() {
  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold">Submit Product</h1>
    </div>
  );
}
