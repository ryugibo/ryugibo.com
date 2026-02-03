import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  cn,
} from "@ryugibo/ui";
import { ChevronUpIcon, DotIcon } from "@ryugibo/ui/icons";
import { DateTime } from "luxon";
import { Link, useFetcher } from "react-router";

interface PostCardProps {
  id: number;
  title: string;
  authorName: string;
  authorAvatarUrl: string | null;
  category: string;
  postedAt: string;
  expanded?: boolean;
  upvotesCount?: number;
  isUpvoted?: boolean;
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
  isUpvoted = false,
}: PostCardProps) {
  const fetcher = useFetcher();
  const optimisticUpvotesCount =
    fetcher.state === "idle" ? upvotesCount : isUpvoted ? upvotesCount - 1 : upvotesCount + 1;
  const optimisticIsUpvoted = fetcher.state === "idle" ? isUpvoted : !isUpvoted;
  const onClickUpvote = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fetcher.submit(null, { method: "post", action: `/community/${id}/upvote` });
  };

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
            {authorAvatarUrl && <AvatarImage src={authorAvatarUrl} />}
            <AvatarFallback>{authorName[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <CardTitle>{title}</CardTitle>
            <div className="flex gap-2 text-sm leading-tight text-muted-foreground">
              <span>{authorName} on</span>
              <span>{category}</span>
              <DotIcon className="size-4" />
              <span>{DateTime.fromISO(postedAt).toRelative()}</span>
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
            <Button
              onClick={onClickUpvote}
              variant="outline"
              className={cn(
                "flex flex-col h-14",
                optimisticIsUpvoted && "border-primary text-primary",
              )}
            >
              <ChevronUpIcon className="size-4 shrink-0" />
              <span>{optimisticUpvotesCount}</span>
            </Button>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}
