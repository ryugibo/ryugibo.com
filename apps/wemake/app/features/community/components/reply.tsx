import { Avatar, AvatarFallback, AvatarImage, Button, Textarea } from "@ryugibo/ui";
import { DotIcon, MessageCircleIcon } from "@ryugibo/ui/icons";
import { DateTime } from "luxon";
import { useState } from "react";
import { Form, Link } from "react-router";

interface ReplyProps {
  avatarUrl: string | null;
  username: string;
  timestamp: string;
  content: string;
  topLevel: boolean;
  replies?: {
    id: number;
    content: string;
    created_at: string;
    user: {
      name: string;
      username: string;
      avatar: string | null;
    };
  }[];
}

export function Reply({ avatarUrl, username, timestamp, content, topLevel, replies }: ReplyProps) {
  const [replying, setReplying] = useState(false);
  const toggleReply = () => setReplying((prev) => !prev);
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-start gap-5 w-2/3">
        <Avatar className="size-14">
          {avatarUrl && <AvatarImage src={avatarUrl} />}
          <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-4 items-start w-full">
          <div className="flex items-center gap-2">
            <Link to={`/users/${username}`}>
              <h4 className="font-medium">@{username}</h4>
            </Link>
            <DotIcon className="size-4" />
            <span className="text-xs text-muted-foreground">
              {DateTime.fromISO(timestamp).toRelative()}
            </span>
          </div>
          <p className="text-muted-foreground">{content}</p>
          <Button variant="ghost" className="self-end" onClick={toggleReply}>
            <MessageCircleIcon className="size-4" /> Reply
          </Button>
        </div>
      </div>
      {replying && (
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
      )}
      {topLevel && replies && (
        <div className="pl-20 w-full">
          {replies.map((reply) => (
            <Reply
              key={reply.id}
              avatarUrl={reply.user.avatar}
              username={reply.user.username}
              timestamp={`${DateTime.fromISO(reply.created_at).toRelative()}`}
              content={reply.content}
              topLevel={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
