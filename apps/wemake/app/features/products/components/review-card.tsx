import { Avatar, AvatarFallback, AvatarImage } from "@ryugibo/ui";
import { StarIcon } from "@ryugibo/ui/icons";
import { DateTime } from "luxon";

interface ReviewCardProps {
  avatarUrl: string | null;
  authorName: string;
  authorUsername: string;
  rating: number;
  content: string;
  postedAt: string;
}

export function ReviewCard({
  avatarUrl,
  authorName,
  authorUsername,
  rating,
  content,
  postedAt,
}: ReviewCardProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Avatar>
          {avatarUrl && <AvatarImage src={avatarUrl} />}
          <AvatarFallback>{authorName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="text-lg font-bold">{authorName}</h4>
          <p className="text-sm text-muted-foreground">{authorUsername}</p>
        </div>
      </div>
      <div className="flex gap-1 text-yellow-500">
        {[...Array(5).keys()].map((index) => (
          <StarIcon
            key={index}
            className="size-4"
            fill={index < rating ? "currentColor" : "none"}
          />
        ))}
      </div>
      <p className="text-muted-foreground">{content}</p>
      <span className="text-xs text-muted-foreground">
        {DateTime.fromISO(postedAt).toRelative()}
      </span>
    </div>
  );
}
