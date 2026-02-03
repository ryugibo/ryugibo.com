import { LoadingButton } from "@ryugibo/ui";
import { parseZodError, resolveParentPath } from "@ryugibo/utils";
import { Form, redirect, useNavigation } from "react-router";
import z from "zod";
import { Hero } from "~/common/components/hero.tsx";
import InputPair from "~/common/components/input-pair.tsx";
import SelectPair from "~/common/components/select-pair.tsx";
import { createSSRClient } from "~/supabase-client.ts";
import { createPost } from "../mutations.ts";
import { getTopicIdBySlug, getTopics } from "../queries.ts";
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

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { pathname } = new URL(request.url);
  const { supabase, getAuthUser } = createSSRClient(request);
  const user = await getAuthUser();
  if (!user) {
    throw redirect(resolveParentPath({ pathname, steps: 1 }));
  }
  const topics = await getTopics({ supabase });
  return { topics };
};

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(40, "Title must be less than 40 characters"),
  category: z.string().min(1, "Category is required"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(1000, "Content must be less than 1000 characters"),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const { pathname } = new URL(request.url);
  const { supabase, getAuthUser } = createSSRClient(request);
  const user = await getAuthUser();
  if (!user) {
    throw redirect(resolveParentPath({ pathname, steps: 1 }));
  }
  const { id: profile_id } = user;

  const formData = await request.formData();
  const { success, data, error: formZodError } = formSchema.safeParse(Object.fromEntries(formData));
  if (!success) {
    const formError = parseZodError(formZodError);
    return { formError };
  }
  const { title, category, content } = data;
  const { topic_id } = await getTopicIdBySlug({ supabase, slug: category });
  const post = await createPost({
    supabase,
    profile_id,
    title,
    topic_id,
    content,
  });
  return redirect(`/community/${post.id}`);
};

export default function PostSubmitPage({ loaderData, actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting" || navigation.state === "loading";
  const { topics } = loaderData;
  return (
    <div>
      <Hero
        title="Create Discussion"
        description="Ask questions, share ideas, and connect with other developers"
      />
      <Form method="post" className="flex flex-col gap-5 space-y-10 max-w-3xl mx-auto">
        <InputPair
          label="Title"
          description="(40 characters or less"
          name="title"
          id="title"
          required
          placeholder="i.e What is the bset productivity tool?"
        />
        {actionData?.formError?.title?.map(({ key, message }) => (
          <p key={key} className="text-sm text-red-500">
            {message}
          </p>
        ))}
        <SelectPair
          description="Select the category that best fits your discussion"
          label="Category"
          name="category"
          required
          placeholder="i.e Productivity"
          options={topics.map((topic) => ({
            label: topic.name,
            value: topic.slug,
          }))}
        />
        {actionData?.formError?.category?.map(({ key, message }) => (
          <p key={key} className="text-sm text-red-500">
            {message}
          </p>
        ))}
        <InputPair
          label="Content"
          description="(1000 chracters or less)"
          name="content"
          id="content"
          required
          placeholder="i.e I'm looking for a new productivity tool that can help me manage my time better. What are your recommendations?"
          textarea
        />
        {actionData?.formError?.content?.map(({ key, message }) => (
          <p key={key} className="text-sm text-red-500">
            {message}
          </p>
        ))}
        <LoadingButton className="mx-auto w-auto" isLoading={isSubmitting}>
          Create Discussion
        </LoadingButton>
      </Form>
    </div>
  );
}
