import { Button } from "@ryugibo/ui";
import { Form } from "react-router";
import { Hero } from "~/common/components/hero.tsx";
import InputPair from "~/common/components/input-pair.tsx";
import SelectPair from "~/common/components/select-pair.tsx";
import type { Route } from "./+types/post-submit-page";

export const meta = () => {
  return [
    {
      title: "Create Discussion | wemake",
    },
    {
      description: "Ask questions, share ideas, and connect with other developers",
    },
  ];
};

export default function PostSubmitPage(_: Route.ComponentProps) {
  return (
    <div>
      <Hero
        title="Create Discussion"
        description="Ask questions, share ideas, and connect with other developers"
      />
      <Form className="flex flex-col gap-5 space-y-10 max-w-3xl mx-auto">
        <InputPair
          label="Title"
          description="(40 characters or less"
          name="title"
          id="title"
          required
          placeholder="i.e What is the bset productivity tool?"
        />
        <SelectPair
          description="Select the category that best fits your discussion"
          label="Category"
          name="category"
          required
          placeholder="i.e Productivity"
          options={[
            { value: "productivity", label: "Productivity" },
            { value: "technology", label: "Technology" },
            { value: "gaming", label: "Gaming" },
            { value: "entertainment", label: "Entertainment" },
            { value: "health", label: "Health" },
            { value: "fitness", label: "Fitness" },
            { value: "finance", label: "Finance" },
            { value: "travel", label: "Travel" },
            { value: "food", label: "Food" },
          ]}
        />
        <InputPair
          label="Content"
          description="(1000 chracters or less)"
          name="content"
          id="content"
          required
          placeholder="i.e I'm looking for a new productivity tool that can help me manage my time better. What are your recommendations?"
          textarea
        />
        <Button className="mx-auto">Create Discussion</Button>
      </Form>
    </div>
  );
}
