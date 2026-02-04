import { Avatar, AvatarFallback, AvatarImage, Button, Textarea } from "@ryugibo/ui";
import { DotIcon, MessageCircleIcon } from "@ryugibo/ui/icons";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Form, Link, useActionData, useOutletContext } from "react-router";
import type { OutletContext } from "~/common/layouts/home-layout.tsx";
import type { action } from "../pages/post-page.tsx";

interface ReplyProps {
  id: number;
  avatarUrl: string | null;
  username: string;
  name: string;
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

export function Reply({
  id,
  avatarUrl,
  username,
  name,
  timestamp,
  content,
  topLevel,
  replies,
}: ReplyProps) {
  const [replying, setReplying] = useState(false);
  const toggleReply = () => setReplying((prev) => !prev);
  const { isLoggedIn, name: loginName, avatar: loginAvatar } = useOutletContext<OutletContext>();
  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (actionData?.data?.parent_id === id) {
      setReplying(false);
    }
  }, [actionData, id]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-start gap-5 w-2/3">
        <Avatar className="size-14">
          {avatarUrl && <AvatarImage src={avatarUrl} />}
          <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-4 items-start w-full">
          <div className="flex items-center gap-2">
            <Link to={`/users/${username}`}>
              <h4 className="font-medium">{name}</h4>
            </Link>
            <DotIcon className="size-4" />
            <span className="text-xs text-muted-foreground">
              {DateTime.fromISO(timestamp).toRelative()}
            </span>
          </div>
          <p className="text-muted-foreground">{content}</p>
          {isLoggedIn && (
            <Button variant="ghost" className="self-end" onClick={toggleReply}>
              <MessageCircleIcon className="size-4" /> Reply
            </Button>
          )}
        </div>
      </div>
      {isLoggedIn && replying && (
        <Form method="post" className="flex items-start gap-5 w-3/4">
          <input type="hidden" name="parent_id" value={id} />
          <Avatar className="size-14">
            {loginAvatar && <AvatarImage src={loginAvatar} />}
            <AvatarFallback>{loginName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-5 items-end w-full">
            <Textarea
              placeholder="Write a reply..."
              className="w-full resize-none field-sizing-fixed"
              rows={5}
              name="content"
              defaultValue={`@${username} `}
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
              id={reply.id}
              avatarUrl={reply.user.avatar}
              username={reply.user.username}
              name={reply.user.name}
              timestamp={reply.created_at}
              content={reply.content}
              topLevel={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
