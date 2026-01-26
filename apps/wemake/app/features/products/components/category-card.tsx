import { Card, CardDescription, CardHeader, CardTitle } from "@ryugibo/ui/card";
import { ChevronRightIcon } from "@ryugibo/ui/icons";
import { Link } from "react-router";

interface CategoryCardProps {
  id: number;
  name: string;
  description: string;
}

export function CategoryCard({ id, name, description }: CategoryCardProps) {
  return (
    <Link to={`/products/categories/${id}`} className="block">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {name} <ChevronRightIcon className="size-6" />
          </CardTitle>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
