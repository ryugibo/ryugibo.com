import { cn } from "@ryugibo/ui";
import { Button } from "@ryugibo/ui/button";
import { useSearchParams } from "react-router";
import { Hero } from "~/common/components/hero";
import { JobCard } from "~/features/jobs/components/job-card";
import { JOB_TYPES, LOCATION_TYPES, SALARY_RANGE } from "~/features/jobs/constants";

export const meta = () => {
  return [
    { title: "Jobs | wemake" },
    { name: "description", content: "Companies looking for makers" },
  ];
};

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const onClickFilter = (key: string, value: string) => {
    searchParams.set(key, value);
    setSearchParams(searchParams);
  };
  return (
    <div className="space-y-20">
      <Hero title="Jobs" description="Companies looking for makers" />
      <div className="grid grid-cols-1 xl:grid-cols-6 gap-20 items-start">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:col-span-4 gap-5">
          {[...Array(11).keys()].map((index) => (
            <JobCard
              key={`jobId-${index}`}
              id={`jobId-${index}`}
              companyName={"Tesla Motors"}
              companyLogoUrl={"https://github.com/teslamotors.png"}
              title={"Software Engineer"}
              postedAt={"12 hours ago"}
              type={"Full-time"}
              locationType={"Remote"}
              salary={"$100,000 - $150,000"}
              location={"San Francisco, CA"}
            />
          ))}
        </div>
        <div className="xl:col-span-2 sticky top-20 flex flex-col gap-10">
          <div className="flex flex-col items-start gap-2.5">
            <h4 className="text-sm text-muted-foreground font-bold">Type</h4>
            <div className="flex flex-wrap gap-2">
              {JOB_TYPES.map((type) => (
                <Button
                  key={type.value}
                  variant="outline"
                  onClick={() => onClickFilter("type", type.value)}
                  className={cn(
                    searchParams.get("type") === type.value && "bg-accent text-accent-foreground",
                  )}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-start gap-2.5">
            <h4 className="text-sm text-muted-foreground font-bold">Location</h4>
            <div className="flex flex-wrap gap-2">
              {LOCATION_TYPES.map((type) => (
                <Button
                  key={type.value}
                  variant="outline"
                  onClick={() => onClickFilter("location", type.value)}
                  className={cn(
                    searchParams.get("location") === type.value &&
                      "bg-accent text-accent-foreground",
                  )}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-start gap-2.5">
            <h4 className="text-sm text-muted-foreground font-bold">Salary Range</h4>
            <div className="flex flex-wrap gap-2">
              {SALARY_RANGE.map((range) => (
                <Button
                  key={range}
                  variant="outline"
                  onClick={() => onClickFilter("salary", range)}
                  className={cn(
                    searchParams.get("salary") === range && "bg-accent text-accent-foreground",
                  )}
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
