import { Form } from "react-router";
import { Hero } from "~/common/components/hero";
import InputPair from "~/common/components/input-pair";
import { Avatar, AvatarFallback, AvatarImage } from "~/common/components/ui/avatar";
import { Badge } from "~/common/components/ui/badge";
import { Button } from "~/common/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/common/components/ui/card";

export const meta = () => {
  return [{ title: "Team Details | wemake" }, { description: "View team details" }];
};

export default function TeamPage() {
  return (
    <div className="space-y-20">
      <Hero title="Join ryugibo's team" />
      <div className="grid grid-cols-6 gap-40 items-start">
        <div className="col-span-4 grid grid-cols-4 gap-5">
          {[
            {
              title: "Product Name",
              value: "Doggie Social",
            },
            {
              title: "Stage",
              value: "MVP",
            },
            {
              title: "Team Size",
              value: "3",
            },
            {
              title: "Available Equity",
              value: "50",
            },
          ].map((item) => (
            <Card key={item.value}>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="font-bold text-2xl">
                <p>{item.value}</p>
              </CardContent>
            </Card>
          ))}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Looking for
              </CardTitle>
            </CardHeader>
            <CardContent className="font-bold text-lg">
              <ul className="list-disc list-inside">
                {[
                  "Senior React Developer",
                  "Senior Node.js Developer",
                  "Senior Python Developer",
                  "UI/UX Designer",
                ].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Idea description
              </CardTitle>
            </CardHeader>
            <CardContent className="font-medium text-lg">
              <p>
                We are looking for a skilled and experienced Software Engineer to join our team.
              </p>
            </CardContent>
          </Card>
        </div>
        <aside className="col-span-2 border rounded-lg shadow-sm p-5 space-y-5">
          <div className="flex gap-5">
            <Avatar className="size-14">
              <AvatarImage src="https://github.com/ryugibo.png" />
              <AvatarFallback>WM</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h4 className="text-lg font-medium">@ryugibo</h4>
              <Badge variant="secondary">Entrepreneur</Badge>
            </div>
          </div>
          <Form className="space-y-5">
            <InputPair
              label="Introduce Yourself?"
              description="Tell us about yourself"
              name="introduction"
              type="text"
              id="introduction"
              required
              textarea
              placeholder="i.e. I'm a software engineer with 5 years of experience"
            />
            <Button type="submit" className="w-full">
              Get in touch
            </Button>
          </Form>
        </aside>
      </div>
    </div>
  );
}
