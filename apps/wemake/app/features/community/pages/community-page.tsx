import { ChevronDownIcon } from "lucide-react";
import { Form, Link, useSearchParams } from "react-router";
import { Hero } from "~/common/components/hero";
import { Button } from "~/common/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/common/components/ui/dropdown-menu";
import { Input } from "~/common/components/ui/input";
import { PostCard } from "~/features/community/components/post-card";
import { PERIOD_OPTIONS, SORT_OPTIONS } from "~/features/community/constant";

export const meta = () => [
  {
    title: "Community | wemake",
  },
  {
    name: "description",
    content: "Ask questions, share ideas, and connect with other developers.",
  },
];

export default function CommunityPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sorting = searchParams.get("sorting") || "newest";
  const period = searchParams.get("period") || "all-time";
  return (
    <div>
      <Hero
        title="Community"
        description="Ask questions, share ideas, and connect with other developers."
      />
      <div className="grid grid-cols-6 items-start gap-40">
        <div className="col-span-4 space-y-10">
          <div className="flex justify-between">
            <div className="space-y-5 w-full">
              <div className="flex items-center gap-5">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 cursor-pointer">
                    <span className="text-sm capitalize">{sorting}</span>
                    <ChevronDownIcon className="size-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {SORT_OPTIONS.map((option) => (
                      <DropdownMenuCheckboxItem
                        key={option}
                        className="capitalize cursor-pointer"
                        onCheckedChange={(checked: boolean) => {
                          if (checked) {
                            searchParams.set("sorting", option);
                            setSearchParams(searchParams);
                          }
                        }}
                      >
                        {option}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {sorting === "popular" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1 cursor-pointer">
                      <span className="text-sm capitalize">{period}</span>
                      <ChevronDownIcon className="size-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {PERIOD_OPTIONS.map((option) => (
                        <DropdownMenuCheckboxItem
                          key={option}
                          className="capitalize cursor-pointer"
                          onCheckedChange={(checked: boolean) => {
                            if (checked) {
                              searchParams.set("period", option);
                              setSearchParams(searchParams);
                            }
                          }}
                        >
                          {option}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <Form className="w-2/3">
                <Input type="text" name="search" placeholder="Search for discussions" />
              </Form>
            </div>
            <Button asChild>
              <Link to="/community/submit">Create Discussion</Link>
            </Button>
          </div>
          <div className="space-y-5">
            {[...Array(11).keys()].map((index) => (
              <PostCard
                key={`postId-${index}`}
                id={`postId-${index}`}
                title={"What is the best productivity tool?"}
                authorName={"Wemake"}
                authorAvatarUrl={"https://github.com/shadcn.png"}
                category={"Productivity"}
                postedAt={"12 hours ago"}
                expanded
              />
            ))}
          </div>
        </div>
        <aside className="col-span-2 space-y-5 flex flex-col">
          <span className="text-sm font-bold text-muted-foreground uppercase">topics</span>
          <div className="flex flex-col gap-4 items-start">
            {[
              "AI Tools",
              "Design Tools",
              "Dev Tools",
              "Note Taking Apps",
              "Productivity Tools",
              "Security Tools",
              "System Tools",
              "Web Tools",
              "Work Tools",
            ].map((category) => (
              <Button asChild variant="link" key={category} className="pl-0">
                <Link to={`?topic=${category}`} className="font-semibold">
                  {category}
                </Link>
              </Button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
