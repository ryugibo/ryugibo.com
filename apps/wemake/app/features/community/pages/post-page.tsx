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
import { Form, Link } from "react-router";
import { Reply } from "~/features/community/components/reply.tsx";

export const meta = () => {
  return [{ title: "Post | wemake" }, { description: "View a specific post" }];
};

export default function PostPage() {
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
              <Link to="/community?topic=productivity">Productivity</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>What is the best productivity tool</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid grid-cols-6 gap-40 items-start">
        <div className="col-span-4 space-y-10">
          <div className="flex w-full items-start gap-10">
            <Button variant="outline" className="flex flex-col h-14">
              <ChevronUpIcon className="size-4 shrink-0" />
              <span>10</span>
            </Button>
            <div className="space-y-20">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">What is the best productivity tool</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>@ryugibo</span>
                  <DotIcon className="size-5" />
                  <span>10 minutes ago</span>
                  <DotIcon className="size-5" />
                  <span>10 replies</span>
                </div>
                <p className="text-muted-foreground w-2/3">
                  Hello, I"m looking for a new productivity tool that can help me manage my time
                  better. What are your recommendations? I have tried Notion, Trello, and Asana, but
                  I am not satisfied with any of them. Any suggestions?
                </p>
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
                <h4 className="font-semibold">10 Replies</h4>
                <div className="flex flex-col gap-5">
                  <Reply
                    avatarUrl="https://github.com/ryugibo.png"
                    username="ryugibo"
                    timestamp="10 minutes ago"
                    content="Hello, I'm looking for a new productivity tool that can help me manage my time better. What are your recommendations? I have tried Notion, Trello, and Asana, but I am not satisfied with any of them. Any suggestions?"
                    topLevel
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <aside className="col-span-2 border rounded-lg shadow-sm p-5 space-y-5">
          <div className="flex gap-5">
            <Avatar className="size-14">
              <AvatarImage src="https://github.com/ryugibo.png" />
              <AvatarFallback>WM</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h4 className="text-lg font-medium">@ryugibo</h4>
              <Badge variant="secondary">Entrepreneur</Badge>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-xs">
            <span>🎂 Joined 3 months ago</span>
            <span>🚀 Launched 10 products</span>
          </div>
          <Button variant="outline" className="w-full">
            Follow
          </Button>
        </aside>
      </div>
    </div>
  );
}
