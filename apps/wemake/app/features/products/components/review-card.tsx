import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/common/components/ui/avatar";

interface ReviewCardProps {
  avatarUrl: string;
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
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{authorName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="text-lg font-bold">{authorName}</h4>
          <p className="text-sm text-muted-foreground">{authorUsername}</p>
        </div>
      </div>
      <div className="flex gap-1 text-yellow-500">
        {[...Array(rating).keys()].map((index) => (
          <StarIcon key={index} className="size-4" fill="currentColor" />
        ))}
      </div>
      <p className="text-muted-foreground">{content}</p>
      <span className="text-xs text-muted-foreground">{postedAt}</span>
    </div>
  );
}
