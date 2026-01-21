import { Button } from "@ryugibo/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@ryugibo/ui/dropdown-menu";
import { ChevronDownIcon } from "@ryugibo/ui/icons";
import { Input } from "@ryugibo/ui/input";
import { Form, Link, useSearchParams } from "react-router";
import { Hero } from "~/common/components/hero";
import { PostCard } from "~/features/community/components/post-card";
import { PERIOD_OPTIONS, SORT_OPTIONS } from "~/features/community/constant";
import { getPosts, getTopics } from "~/features/community/queries";
import type { Route } from "./+types/community-page";

export const meta = () => [
  {
    title: "Community | wemake",
  },
  {
    name: "description",
    content: "Ask questions, share ideas, and connect with other developers.",
  },
];

export const loader = async () => {
  const topics = await getTopics();
  const posts = await getPosts();
  return { topics, posts };
};

export default function CommunityPage({ loaderData }: Route.ComponentProps) {
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
            {loaderData.posts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                authorName={post.author.name}
                authorAvatarUrl={post.author.avatar}
                category={post.topic.name}
                postedAt={post.created_at}
                expanded
                upvotesCount={post.post_upvotes[0].count}
              />
            ))}
          </div>
        </div>
        <aside className="col-span-2 space-y-5 flex flex-col">
          <span className="text-sm font-bold text-muted-foreground uppercase">topics</span>
          <div className="flex flex-col gap-4 items-start">
            {loaderData.topics.map((topic) => (
              <Button asChild variant="link" key={topic.slug} className="pl-0">
                <Link to={`?topic=${topic.slug}`} className="font-semibold">
                  {topic.name}
                </Link>
              </Button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
