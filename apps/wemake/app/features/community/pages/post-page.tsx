import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  cn,
  Textarea,
} from "@ryugibo/ui";
import { ChevronUpIcon, DotIcon } from "@ryugibo/ui/icons";
import { parseZodError } from "@ryugibo/utils";
import { DateTime } from "luxon";
import { useEffect, useRef } from "react";
import { Form, Link, useFetcher, useOutletContext } from "react-router";
import z from "zod";
import type { OutletContext } from "~/common/layouts/home-layout.tsx";
import { Reply } from "~/features/community/components/reply.tsx";
import { createSSRClient } from "~/supabase-client.ts";
import { createReply } from "../mutations.ts";
import { getPostById, getReplies } from "../queries.ts";
import type { Route } from "./+types/post-page";

export const meta = () => {
  return [{ title: "Post | wemake" }, { description: "View a specific post" }];
};

const paramsSchema = z.object({
  id: z.coerce.number(),
});

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { success, data } = paramsSchema.safeParse(params);
  if (!success) {
    throw new Error("Invalid params");
  }
  const { id } = data;
  const { supabase } = createSSRClient(request);
  const post = await getPostById({ supabase, id: Number(id) });
  const replies = await getReplies({ supabase, id: Number(id) });
  return { post, replies };
};

const formSchema = z
  .object({
    content: z.string().min(1, "Content is required"),
    post_id: z.coerce.number().optional(),
    parent_id: z.coerce.number().optional(),
  })
  .refine(
    (data) => {
      const hasPostId = data.post_id !== undefined;
      const hasParentId = data.parent_id !== undefined;
      return hasPostId !== hasParentId;
    },
    {
      message: "Either post_id or parent_id must be provided, but not both.",
      path: ["content"],
    },
  );

export const action = async ({ request }: Route.ActionArgs) => {
  const { supabase, getAuthUser } = createSSRClient(request);
  const {
    success: successForm,
    data: dataForm,
    error: formZodError,
  } = formSchema.safeParse(Object.fromEntries(await request.formData()));
  if (!successForm) {
    const formError = parseZodError(formZodError);
    return { success: false, formError };
  }
  const { content, post_id, parent_id } = dataForm;
  const user = await getAuthUser();
  if (!user) {
    return {
      success: false,
      formError: { content: [{ key: "content", message: "You must be logged in to reply" }] },
    };
  }
  const { id: profile_id } = user;
  await createReply({ supabase, profile_id, post_id, parent_id, content });
  return { success: true, post_id, parent_id };
};

export default function PostPage({ loaderData, actionData }: Route.ComponentProps) {
  const { isLoggedIn, name, avatar } = useOutletContext<OutletContext>();
  const { post, replies } = loaderData;
  const formRef = useRef<HTMLFormElement>(null);
  const fetcher = useFetcher();

  useEffect(() => {
    if (actionData?.success && actionData.post_id === post.id) {
      formRef.current?.reset();
    }
  }, [actionData]);

  return (
    <div className="space-y-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/community">Community</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/community?topic=${post.topic_slug}`}>{post.topic_name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{post.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid grid-cols-6 gap-40 items-start">
        <div className="col-span-4 space-y-10">
          <div className="flex w-full items-start gap-10">
            <fetcher.Form method="post" action={`/community/${post.id}/upvote`}>
              <Button
                variant="outline"
                className={cn(
                  "flex flex-col h-14",
                  post.is_upvoted && "border-primary text-primary",
                )}
              >
                <ChevronUpIcon className="size-4 shrink-0" />
                <span>{post.upvotes}</span>
              </Button>
            </fetcher.Form>
            <div className="space-y-20 w-full">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">{post.title}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>@{post.author_name}</span>
                  <DotIcon className="size-5" />
                  <span>{DateTime.fromISO(post.created_at).toRelative()}</span>
                  <DotIcon className="size-5" />
                  <span>{post.replies} replies</span>
                </div>
                <p className="text-muted-foreground w-2/3">{post.content}</p>
              </div>
              {isLoggedIn && (
                <Form ref={formRef} method="post" className="flex items-start gap-5 w-3/4">
                  <input type="hidden" name="post_id" value={post.id} />
                  <Avatar className="size-14">
                    {avatar && <AvatarImage src={avatar} />}
                    <AvatarFallback>{name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-5 items-end w-full">
                    <Textarea
                      placeholder="Write a reply..."
                      className="w-full resize-none field-sizing-fixed"
                      rows={5}
                      name="content"
                    />
                    {actionData?.formError?.content?.map(({ key, message }) => (
                      <p key={key} className="text-red-500">
                        {message}
                      </p>
                    ))}
                    <Button type="submit">Reply</Button>
                  </div>
                </Form>
              )}
              <div className="space-y-10">
                <h4 className="font-semibold">{post.replies} Replies</h4>
                <div className="flex flex-col gap-5">
                  {replies.map((reply) => (
                    <Reply
                      key={reply.id}
                      id={reply.id}
                      avatarUrl={reply.user.avatar}
                      username={reply.user.username}
                      name={reply.user.name}
                      timestamp={reply.created_at}
                      content={reply.content}
                      topLevel
                      replies={reply.post_replies}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <aside className="col-span-2 border rounded-lg shadow-sm p-5 space-y-5">
          <div className="flex gap-5">
            <Avatar className="size-14">
              {post.author_avatar && <AvatarImage src={post.author_avatar} />}
              <AvatarFallback>{post.author_name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h4 className="text-lg font-medium items-start">@{post.author_name}</h4>
              <Badge variant="secondary" className="capitalize">
                {post.author_role}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-xs">
            <span>🎂 Joined {DateTime.fromISO(post.author_created_at).toRelative()}</span>
            <span>🚀 Launched {post.author_products} products</span>
          </div>
          <Button variant="outline" className="w-full">
            Follow
          </Button>
        </aside>
      </div>
    </div>
  );
}
