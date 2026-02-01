import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle, cn } from "@ryugibo/ui";
import { DotIcon, EyeIcon, HeartIcon, LockIcon } from "@ryugibo/ui/icons";
import { DateTime } from "luxon";
import { Link } from "react-router";

interface IdeaCardProps {
  id: number;
  title: string;
  viewCount?: number;
  createdAt?: string;
  likesCount?: number;
  claimed?: boolean;
  owner?: boolean;
}

export function IdeaCard({
  id,
  title,
  viewCount,
  createdAt,
  likesCount,
  claimed = false,
  owner = false,
}: IdeaCardProps) {
  return (
    <Card className="bg-transparent hover:bg-card/50 transition-colors">
      <CardHeader>
        <Link to={claimed || owner ? "" : `/ideas/${id}`}>
          <CardTitle className="text-xl">
            <span
              className={cn(
                claimed && !owner
                  ? "bg-muted-foreground selection:bg-muted-foreground text-muted-foreground break-all"
                  : "",
              )}
            >
              {title}
            </span>
          </CardTitle>
        </Link>
      </CardHeader>
      {!owner && (
        <CardContent className="flex items-center text-sm">
          <div className="flex items-center gap-1">
            <EyeIcon className="size-4" />
            <span>{viewCount}</span>
          </div>
          <DotIcon className="size-4" />
          {createdAt && <span>{DateTime.fromISO(createdAt).toRelative()}</span>}
        </CardContent>
      )}
      <CardFooter className="flex justify-end gap-2">
        {!claimed && !owner ? (
          <>
            <Button variant="outline">
              <HeartIcon className="size-4" />
              <span>{likesCount}</span>
            </Button>
            <Button asChild>
              <Link to={`/ideas/${id}/claim`}>Claim idea &rarr;</Link>
            </Button>
          </>
        ) : (
          <Button variant="outline" className="cursor-not-allowed opacity-50">
            <LockIcon className="size-4" /> Claimed
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
