import { Form } from "react-router";
import { Hero } from "~/common/components/hero";
import InputPair from "~/common/components/input-pair";
import SelectPair from "~/common/components/select-pair";
import { Button } from "~/common/components/ui/button";
import { JOB_TYPES, LOCATION_TYPES, SALARY_RANGE } from "../constants";

export const meta = () => {
  return [
    { title: "Post a Job | wemake" },
    { name: "description", content: "Reach out to the best developers." },
  ];
};

export default function JobSubmitPage() {
  return (
    <div>
      <Hero title="Post a job" description="Reach out to the best developers." />
      <Form className="max-w-screen-2xl mx-auto flex flex-col gap-10 items-center">
        <div className="grid grid-cols-3 gap-10">
          <InputPair
            label="Postion"
            description="(40 characters max)"
            id="position"
            name="position"
            maxLength={40}
            type="text"
            required
            placeholder="i.e Senior React Developers"
          />
          <InputPair
            label="Overview"
            description="(400 characters max)"
            id="overview"
            name="overview"
            maxLength={400}
            type="text"
            required
            placeholder="i.e We are looking for a senior React developer to join our team."
            textarea
          />
          <InputPair
            label="Responsibilities"
            description="(400 characters max, comma separated)"
            id="responsibilities"
            name="responsibilities"
            maxLength={400}
            type="text"
            required
            placeholder="i.e Implement new features, Maintain code quality, etc."
            textarea
          />
          <InputPair
            label="Qualifications"
            description="(400 characters max, comma separated)"
            id="qualifications"
            name="qualifications"
            maxLength={400}
            type="text"
            required
            placeholder="i.e Bachelor's degree, 2+ years of experience, etc."
            textarea
          />
          <InputPair
            label="Benefits"
            description="(400 characters max, comma separated)"
            id="benefits"
            name="benefits"
            maxLength={400}
            type="text"
            required
            placeholder="i.e Health Insurance, Paid Time Off, etc."
            textarea
          />
          <InputPair
            label="Skills"
            description="(400 characters max, comma separated)"
            id="skills"
            name="skills"
            maxLength={400}
            type="text"
            required
            placeholder="i.e React, Node.js, Python, etc."
            textarea
          />
          <InputPair
            label="Company Name"
            description="(40 characters max)"
            id="companyName"
            name="companyName"
            maxLength={40}
            type="text"
            required
            placeholder="i.e Wemake"
          />
          <InputPair
            label="Company Logo URL"
            description="(40 characters max)"
            id="companyLogoUrl"
            name="companyLogoUrl"
            maxLength={40}
            type="url"
            required
            placeholder="i.e https://example.com/logo.png"
          />
          <InputPair
            label="Company Location"
            description="(40 characters max)"
            id="companyLocation"
            name="companyLocation"
            maxLength={40}
            type="text"
            required
            placeholder="i.e Remote"
          />
          <InputPair
            label="Apply URL"
            description="(40 characters max)"
            id="applyUrl"
            name="applyUrl"
            maxLength={40}
            type="url"
            required
            placeholder="i.e https://example.com/apply"
          />
          <SelectPair
            label="Job Type"
            description="Select the type of job"
            name="jobType"
            required
            placeholder="Select the type of job"
            options={JOB_TYPES.map((type) => ({ value: type.value, label: type.label }))}
          />
          <SelectPair
            label="Job Location"
            description="Select the location of the job"
            name="jobLocation"
            required
            placeholder="Select the location of the job"
            options={LOCATION_TYPES.map((location) => ({
              value: location.value,
              label: location.label,
            }))}
          />
          <SelectPair
            label="Salary Range"
            description="Select the salary range of the job"
            name="salaryRange"
            required
            placeholder="Select the salary range of the job"
            options={SALARY_RANGE.map((salary) => ({
              value: salary,
              label: salary,
            }))}
          />
        </div>
        <Button type="submit" className="w-full max-w-sm" size="lg">
          Post job for $100
        </Button>
      </Form>
    </div>
  );
}
