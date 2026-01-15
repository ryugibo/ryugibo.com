import { DotIcon, MessageCircleIcon } from "lucide-react";
import { useState } from "react";
import { Form, Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/common/components/ui/avatar";
import { Button } from "~/common/components/ui/button";
import { Textarea } from "~/common/components/ui/textarea";

interface ReplyProps {
  avatarUrl: string;
  username: string;
  timestamp: string;
  content: string;
  topLevel: boolean;
}

export function Reply({ avatarUrl, username, timestamp, content, topLevel }: ReplyProps) {
  const [replying, setReplying] = useState(false);
  const toggleReply = () => setReplying((prev) => !prev);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-5 w-2/3">
        <Avatar className="size-14">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-4 items-start">
          <div className="flex items-center gap-2">
            <Link to={`/users/${username}`}>
              <h4 className="font-medium">@{username}</h4>
            </Link>
            <DotIcon className="size-4" />
            <span className="text-xs text-muted-foreground">{timestamp}</span>
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
      {topLevel && (
        <div className="pl-20 w-full">
          <Reply
            avatarUrl="https://github.com/ryugibo.png"
            username="ryugibo"
            timestamp="10 minutes ago"
            content="Hello, I'm looking for a new productivity tool that can help me manage my time better. What are your recommendations? I have tried Notion, Trello, and Asana, but I am not satisfied with any of them. Any suggestions?"
            topLevel={false}
          />
        </div>
      )}
    </div>
  );
}
