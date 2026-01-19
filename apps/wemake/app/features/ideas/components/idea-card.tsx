import { cn } from "@ryugibo/ui";
import { Button } from "@ryugibo/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@ryugibo/ui/card";
import { DotIcon, EyeIcon, HeartIcon, LockIcon } from "@ryugibo/ui/icons";
import { Link } from "react-router";

interface IdeaCardProps {
  id: string;
  title: string;
  viewCount: number;
  createdAt: string;
  likesCount: number;
  claimed?: boolean;
}

export function IdeaCard({
  id,
  title,
  viewCount,
  createdAt,
  likesCount,
  claimed = false,
}: IdeaCardProps) {
  return (
    <Card className="bg-transparent hover:bg-card/50 transition-colors">
      <CardHeader>
        <Link to={`/ideas/${id}`}>
          <CardTitle className="text-xl">
            <span
              className={cn(
                claimed
                  ? "bg-muted-foreground selection:bg-muted-foreground text-muted-foreground"
                  : "",
              )}
            >
              {title}
            </span>
          </CardTitle>
        </Link>
      </CardHeader>
      <CardContent className="flex items-center text-sm">
        <div className="flex items-center gap-1">
          <EyeIcon className="size-4" />
          <span>{viewCount}</span>
        </div>
        <DotIcon className="size-4" />
        <span>{createdAt}</span>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">
          <HeartIcon className="size-4" />
          <span>{likesCount}</span>
        </Button>
        {!claimed ? (
          <Button asChild>
            <Link to={`/ideas/${id}/claim`}>Claim idea &rarr;</Link>
          </Button>
        ) : (
          <Button variant="outline" className="cursor-not-allowed opacity-50">
            <LockIcon className="size-4" /> Claimed
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
