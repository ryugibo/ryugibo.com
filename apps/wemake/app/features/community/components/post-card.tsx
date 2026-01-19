import { cn } from "@ryugibo/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@ryugibo/ui/avatar";
import { Button } from "@ryugibo/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@ryugibo/ui/card";
import { ChevronUpIcon, DotIcon } from "@ryugibo/ui/icons";
import { Link } from "react-router";

interface PostCardProps {
  id: string;
  title: string;
  authorName: string;
  authorAvatarUrl: string;
  category: string;
  postedAt: string;
  expanded?: boolean;
  upvotesCount?: number;
}

export function PostCard({
  id,
  title,
  authorName,
  authorAvatarUrl,
  category,
  postedAt,
  expanded = false,
  upvotesCount = 0,
}: PostCardProps) {
  return (
    <Link to={`/community/${id}`} className="block">
      <Card
        className={cn(
          "bg-transparent hover:bg-card/50 transition-colors",
          expanded && "flex flex-row items-center justify-between",
        )}
      >
        <CardHeader className="flex flex-row items-center gap-2">
          <Avatar className="size-14">
            <AvatarImage src={authorAvatarUrl} />
            <AvatarFallback>{authorName[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <CardTitle>{title}</CardTitle>
            <div className="flex gap-2 text-sm leading-tight text-muted-foreground">
              <span>{authorName} on</span>
              <span>{category}</span>
              <DotIcon className="size-4" />
              <span>{postedAt}</span>
            </div>
          </div>
        </CardHeader>
        {!expanded && (
          <CardFooter className="flex justify-end">
            <Button variant="link">Reply &rarr;</Button>
          </CardFooter>
        )}
        {expanded && (
          <CardFooter className="flex justify-end">
            <Button variant="outline" className="flex flex-col h-14">
              <ChevronUpIcon className="size-4 shrink-0" />
              <span>{upvotesCount}</span>
            </Button>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}
