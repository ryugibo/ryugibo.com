import { Badge } from "@ryugibo/ui/badge";
import { Button } from "@ryugibo/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@ryugibo/ui/card";
import { DateTime } from "luxon";
import { Link } from "react-router";

interface JobCardProps {
  id: number;
  companyName: string;
  companyLogoUrl: string;
  title: string;
  postedAt: string;
  type: string;
  locationType: string;
  salary: string;
  location: string;
}

export function JobCard({
  id,
  companyName,
  companyLogoUrl,
  title,
  postedAt,
  type,
  locationType,
  salary,
  location,
}: JobCardProps) {
  return (
    <Link to={`/jobs/${id}`}>
      <Card className="bg-transparent hover:bg-card/50 transition-colors">
        <CardHeader>
          <div className="flex items-center gap-4 mb-4">
            <img
              src={companyLogoUrl}
              alt={`${companyName} Logo`}
              className="size-10 rounded-full"
            />
            <div className="space-x-2">
              <span className="text-accent-foreground">{companyName}</span>
              <span className="text-xs text-muted-foreground">
                {DateTime.fromISO(postedAt).toRelative()}
              </span>
            </div>
          </div>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Badge variant="outline" className="capitalize">
            {type}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {locationType}
          </Badge>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">{salary}</span>
            <span className="text-sm font-medium text-muted-foreground">{location}</span>
          </div>
          <Button variant="secondary" size="sm">
            Apply now
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
