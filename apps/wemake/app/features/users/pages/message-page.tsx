import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Textarea,
} from "@ryugibo/ui";
import { SendIcon } from "@ryugibo/ui/icons";
import { Form } from "react-router";
import { MessageBubble } from "~/features/users/components/message-bubble.tsx";
import type { Route } from "./+types/message-page";

export const meta: Route.MetaFunction = () => [
  { title: "Message | Wemake" },
  { name: "description", content: "Message" },
];

export default function MessagePage() {
  return (
    <div className="h-full flex flex-col justify-between">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="size-14">
            <AvatarImage src="https://github.com/shadcn.png" />
            ``
            <AvatarFallback>WM</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0">
            <CardTitle>Shadcn</CardTitle>
            <CardDescription>2 days ago</CardDescription>
          </div>
        </CardHeader>
      </Card>
      <div className="py-10 overflow-y-scroll flex flex-col justify-start h-full">
        {[...Array(50).keys()].map((index) => (
          <MessageBubble
            key={index}
            avatarSrc={
              index % 2 === 0 ? "https://github.com/ryugibo.png" : "https://github.com/shadcn.png"
            }
            avatarFallback={index % 2 === 0 ? "RB" : "WM"}
            message="This is a message, make sure to reply before the deadline."
            isCurrentUser={index % 2 === 0}
          />
        ))}
      </div>
      <Card>
        <CardHeader>
          <Form className="relative flex justify-end items-center">
            <Textarea
              placeholder="Write a message..."
              className="resize-none field-sizing-fixed"
              rows={5}
            />
            <Button type="submit" size="icon" className="absolute right-2">
              <SendIcon className="size-4" />
            </Button>
          </Form>
        </CardHeader>
      </Card>
    </div>
  );
}
