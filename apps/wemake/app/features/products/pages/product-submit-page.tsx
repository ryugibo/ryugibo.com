import { Button } from "@ryugibo/ui/button";
import { Input } from "@ryugibo/ui/input";
import { Label } from "@ryugibo/ui/label";
import { useState } from "react";
import { Form } from "react-router";
import { Hero } from "~/common/components/hero.tsx";
import InputPair from "~/common/components/input-pair.tsx";
import SelectPair from "~/common/components/select-pair.tsx";

export const meta = () => [
  { title: "Submit Product | wemake" },
  { name: "description", content: "Share your product with the world" },
];

export default function ProductSubmitPage() {
  const [icon, setIcon] = useState<string | null>(null);
  const onChangeIcon = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    if (file) {
      setIcon(URL.createObjectURL(file));
    }
  };
  return (
    <div>
      <Hero title="Submit Your Product" description="Share your product with the world" />
      <Form className="grid grid-cols-2 gap-10 max-w-5xl mx-auto">
        <div className="space-y-5">
          <InputPair
            label="Name"
            description="The name of your product"
            name="name"
            id="name"
            type="text"
            required
            placeholder="Name of your product"
          />
          <InputPair
            label="Tagline"
            description="(60 characters or less)"
            name="tagline"
            id="tagline"
            required
            type="text"
            placeholder="A concise description of your product"
          />
          <InputPair
            label="URL"
            description="The URL of your product"
            name="url"
            id="url"
            required
            type="url"
            placeholder="https://example.com"
          />
          <InputPair
            label="Description"
            description="A detailed description of your product"
            name="description"
            id="description"
            required
            placeholder="A detailed description of your product"
            textarea
          />
          <SelectPair
            label="Category"
            description="The category of your product"
            name="category"
            required
            placeholder="Select a category"
            options={[
              { label: "Category 1", value: "category-1" },
              { label: "Category 2", value: "category-2" },
              { label: "Category 3", value: "category-3" },
            ]}
          />
          <Button type="submit" className="w-full" size="lg">
            Submit
          </Button>
        </div>
        <div className="flex flex-col space-y-2 items-start">
          <div className="size-40 rounded-xl shadow-xl overflow-hidden">
            {icon && <img src={icon} alt="icon-preview" className="w-full h-full object-cover" />}
          </div>
          <Label htmlFor="icon" className="flex flex-col items-start">
            Icon
            <small className="text-muted-foreground">The icon of your product</small>
          </Label>
          <Input
            type="file"
            onChange={onChangeIcon}
            name="icon"
            id="icon"
            required
            className="w-1/2"
          />
          <div className="flex flex-col text-xs">
            <span className="text-muted-foreground">Recommended size: 128x128</span>
            <span className="text-muted-foreground">Allowed formats: PNG, JPEG</span>
            <span className="text-muted-foreground">Max file size: 1MB</span>
          </div>
        </div>
      </Form>
    </div>
  );
}
