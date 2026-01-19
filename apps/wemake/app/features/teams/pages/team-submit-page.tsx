import { Button } from "@ryugibo/ui/button";
import { Form } from "react-router";
import { Hero } from "~/common/components/hero";
import InputPair from "~/common/components/input-pair";
import SelectPair from "~/common/components/select-pair";

export const meta = () => {
  return [{ title: "Create Team | wemake" }, { description: "Create a team to find a team mate." }];
};

export default function TeamSubmitPage() {
  return (
    <div>
      <Hero title="Create Team" description="Create a team to find a team mate." />
      <Form className="max-w-screen-2xl mx-auto flex flex-col gap-10 items-center">
        <div className="grid grid-cols-3 gap-10">
          <InputPair
            label="What is the name of yout product?"
            description="(20 characters max)"
            name="name"
            maxLength={20}
            type="text"
            id="name"
            required
            placeholder="i.e Wemake"
          />
          <SelectPair
            label="What is the stage of your product?"
            description="Select the stage of your product"
            name="stage"
            required
            placeholder="Select the stage of your product"
            options={[
              { label: "Idea", value: "idea" },
              { label: "Prototype", value: "prototype" },
              { label: "MVP", value: "mvp" },
              { label: "Production", value: "production" },
            ]}
          />
          <InputPair
            label="What is the size of yout team?"
            description="(1-100)"
            name="size"
            max={100}
            min={1}
            type="number"
            id="size"
            required
          />
          <InputPair
            label="How much equity are you willing to give?"
            description="(each)"
            name="equity"
            max={100}
            min={1}
            type="number"
            id="equity"
            required
          />
          <InputPair
            label="What roles are you looking for?"
            description="(comma separated)"
            name="roles"
            type="text"
            id="roles"
            required
            placeholder="i.e Frontend Developer, Backend Developer, etc."
          />
          <InputPair
            label="What is the description of your product?"
            description="(200 characters max)"
            name="description"
            type="text"
            id="description"
            maxLength={200}
            required
            placeholder="i.e We are looking for a senior React developer to join our team."
            textarea
          />
        </div>
        <Button type="submit" className="w-full max-w-sm" size="lg">
          Create Team
        </Button>
      </Form>
    </div>
  );
}
