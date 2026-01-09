import { ChevronUpIcon, EyeIcon, MessageCircleIcon, } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../../../common/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../common/components/ui/card";

interface ProductCardProps {
    id: string;
    title: string;
    description: string;
    commentsCount: number;
    viewsCount: number;
    upvotesCount: number;
}

export function ProductCard({
    id,
    title,
    description,
    commentsCount,
    viewsCount,
    upvotesCount,
}: ProductCardProps) {
    return (
        <Link to={`/products/${id}`}>
            <Card className="w-full flex flex-row items-center justify-between bg-transparent hover:bg-card/50">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold leading-none tracking-tight">
                        {title}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        {description}
                    </CardDescription>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-px text-xs text-muted-foreground">
                            <MessageCircleIcon className="size-4" />
                            <span>{commentsCount}</span>
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
