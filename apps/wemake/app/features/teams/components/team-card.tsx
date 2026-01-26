import { Avatar, AvatarFallback, AvatarImage } from "@ryugibo/ui/avatar";
import { Badge } from "@ryugibo/ui/badge";
import { Button } from "@ryugibo/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@ryugibo/ui/card";
import { Link } from "react-router";

interface TeamCardProps {
  id: number;
  leaderName: string;
  leaderAvatarUrl: string | null;
  positions: string[];
  projectDescription: string;
}

export function TeamCard({
  id,
  leaderName,
  leaderAvatarUrl,
  positions,
  projectDescription,
}: TeamCardProps) {
  return (
    <Link to={`/teams/${id}`} className="block">
      <Card className="bg-transparent hover:bg-card/50 transition-colors flex flex-col justify-between h-full">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="text-base leading-none">
            <Badge variant="secondary" className="inline-flex shadow-sm items-center text-base">
              <span>@{leaderName}</span>
              <Avatar className="size-5">
                {leaderAvatarUrl && <AvatarImage src={leaderAvatarUrl} />}
                <AvatarFallback>{leaderName[0]}</AvatarFallback>
              </Avatar>
            </Badge>
            <span> is looking for </span>
            {positions.map((position) => (
              <Badge key={position} className="text-base">
                {position}
              </Badge>
            ))}
            <span> to build </span>
            <span>{projectDescription}</span>
          </CardTitle>
        </CardHeader>
        <CardFooter className="justify-end">
          <Button variant="link">Join team &rarr;</Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
