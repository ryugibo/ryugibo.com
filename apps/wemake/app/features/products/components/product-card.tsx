import { Button, Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@ryugibo/ui";
import { ChevronUpIcon, EyeIcon, MessageCircleIcon } from "@ryugibo/ui/icons";
import { Link } from "react-router";

interface ProductCardProps {
  id: number;
  title: string;
  description: string;
  reviewsCount: string;
  viewsCount: string;
  upvotesCount: string;
}

export function ProductCard({
  id,
  title,
  description,
  reviewsCount,
  viewsCount,
  upvotesCount,
}: ProductCardProps) {
  return (
    <Link to={`/products/${id}`} className="block">
      <Card className="w-full flex flex-row items-center justify-between bg-transparent hover:bg-card/50">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-px text-xs text-muted-foreground">
              <MessageCircleIcon className="size-4" />
              <span>{reviewsCount}</span>
            </div>
            <div className="flex items-center gap-px text-xs text-muted-foreground">
              <EyeIcon className="size-4" />
              <span>{viewsCount}</span>
            </div>
          </div>
        </CardHeader>
        <CardFooter className="py-0">
          <Button variant="outline" className="flex flex-col h-14">
            <ChevronUpIcon className="size-4 shrink-0" />
            <span>{upvotesCount}</span>
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
