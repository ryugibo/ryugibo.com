import { DotIcon } from "lucide-react";
import { Badge } from "~/common/components/ui/badge";
import { Button } from "~/common/components/ui/button";

export const meta = () => {
  return [{ title: "Job Details | wemake" }, { name: "description", content: "Job details" }];
};

export default function JobPage() {
  return (
    <div>
      <div className="bg-linear-to-tr from-primary/80 to-primary/10 h-60 w-full rounded-lg"></div>
      <div className="grid grid-cols-6 -mt-16 gap-20 items-start">
        <div className="col-span-4 space-y-10">
          <div>
            <div className="size-40 bg-white rounded-full overflow-hidden relative left-10">
              <img src="https://github.com/facebook.png" alt="" className="object-cover" />
            </div>
            <h1 className="text-4xl font-bold">Software Engineer</h1>
            <h4 className="text-lg text-muted-foreground">Meta Inc.</h4>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">Full-time</Badge>
            <Badge variant="secondary">Remote</Badge>
          </div>
          <div className="space-y-2.5">
            <h4 className="text-3xl font-bold">Overview</h4>
            <p className="text-lg">
              This is a full-time remote position for a Software Engineer. We are looking for a
              skilled and experienced Software Engineer to join our team.
            </p>
          </div>
          <div className="space-y-2.5">
            <h4 className="text-3xl font-bold">Responsibilities</h4>
            <ul className="list-disc list-inside">
              {[
                "Design and implement new features",
                "Fix bugs and improve performance",
                "Collaborate with other engineers",
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2.5">
            <h4 className="text-3xl font-bold">Qualifications</h4>
            <ul className="list-disc list-inside">
              {[
                "Bachelor's degree in Computer Science or related field",
                "2+ years of experience in software development",
                "Proficiency in JavaScript, Python, or Java",
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2.5">
            <h4 className="text-3xl font-bold">Benefits</h4>
            <ul className="list-disc list-inside">
              {["Health Insurance", "Paid Time Off", "Remote Work"].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2.5">
            <h4 className="text-3xl font-bold">Skills</h4>
            <ul className="list-disc list-inside">
              {["React", "Node.js", "Python", "JavaScript", "TypeScript"].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-span-2 sticky top-20 p-6 border rounded-lg mt-32 space-y-5">
          <div className="flex flex-col">
            <h4 className="text-sm text-muted-foreground">Avg. Salary</h4>
            <p className="text-2xl font-medium">$100,000 - $150,000</p>
          </div>
          <div className="flex flex-col">
            <h4 className="text-sm text-muted-foreground">Location</h4>
            <p className="text-2xl font-medium">Remote</p>
          </div>
          <div className="flex flex-col">
            <h4 className="text-sm text-muted-foreground">Type</h4>
            <p className="text-2xl font-medium">Full Time</p>
          </div>
          <div className="flex">
            <h4 className="text-sm text-muted-foreground">Posted 12 hours ago</h4>
            <DotIcon className="size-4" />
            <span className="text-sm text-muted-foreground">395 views</span>
          </div>
          <Button className="w-full">Apply Now</Button>
        </div>
      </div>
    </div>
  );
}
