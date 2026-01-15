import { Hero } from "~/common/components/hero";

export const meta = () => {
  return [{ title: "Team Details | wemake" }, { description: "View team details" }];
};

export default function TeamPage() {
  return (
    <div className="space-y-10">
      <Hero title="Team Name" description="Productivity Tool Project" />
      <div className="container mx-auto space-y-5">
        <h2 className="text-2xl font-bold">Project Description</h2>
        <p className="text-muted-foreground">
          We are building the next generation productivity tool to help you stay organized and
          efficient. Join us to make a difference!
        </p>
        <div className="border p-5 rounded-lg">
          <h3 className="font-semibold mb-2">Roles Needed</h3>
          <ul className="list-disc list-inside text-muted-foreground">
            <li>Frontend Developer (React)</li>
            <li>Backend Developer (Node.js)</li>
            <li>UI/UX Designer</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
