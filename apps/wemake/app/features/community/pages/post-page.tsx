import { Avatar, AvatarFallback, AvatarImage } from "@ryugibo/ui/avatar";
import { Badge } from "@ryugibo/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ryugibo/ui/breadcrumb";
import { Button } from "@ryugibo/ui/button";
import { ChevronUpIcon, DotIcon } from "@ryugibo/ui/icons";
import { Textarea } from "@ryugibo/ui/textarea";
import { DateTime } from "luxon";
import { Form, Link } from "react-router";
import z from "zod";
import { Reply } from "~/features/community/components/reply.tsx";
import { getPostById, getReplies } from "../queries.ts";
import type { Route } from "./+types/post-page";

export const meta = () => {
  return [{ title: "Post | wemake" }, { description: "View a specific post" }];
};

const paramsSchema = z.object({
  id: z.coerce.number(),
});

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { success, data } = paramsSchema.safeParse(params);
  if (!success) {
    throw new Error("Invalid params");
  }
  const post = await getPostById(data.id);
  const replies = await getReplies(data.id);
  return { post, replies };
};

export default function PostPage({ loaderData }: Route.ComponentProps) {
  const { post, replies } = loaderData;
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
            <Button variant="outline" className="flex flex-col h-14">
              <ChevronUpIcon className="size-4 shrink-0" />
              <span>{post.upvotes}</span>
            </Button>
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
              <Form className="flex items-start gap-5 w-3/4">
                <Avatar className="size-14">
                  <AvatarImage src="https://github.com/ryugibo.png" />
                  <AvatarFallback>WM</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-5 items-end w-full">
                  <Textarea
                    placeholder="Write a reply..."
                    className="w-full resize-none field-sizing-fixed"
                    rows={5}
                  />
                  <Button type="submit">Reply</Button>
                </div>
              </Form>
              <div className="space-y-10">
                <h4 className="font-semibold">{post.replies} Replies</h4>
                <div className="flex flex-col gap-5">
                  {replies.map((reply) => (
                    <Reply
                      key={reply.id}
                      avatarUrl={reply.user.avatar}
                      username={reply.user.username}
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
