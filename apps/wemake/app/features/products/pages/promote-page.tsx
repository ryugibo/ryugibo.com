import { Button } from "@ryugibo/ui/button";
import { Calendar } from "@ryugibo/ui/calendar";
import { Label } from "@ryugibo/ui/label";
import type { DateRange } from "@ryugibo/ui/react-day-picker";
import { DateTime } from "luxon";
import { useState } from "react";
import { Form } from "react-router";
import { Hero } from "~/common/components/hero.tsx";
import SelectPair from "~/common/components/select-pair.tsx";

export const meta = () => [
  { title: "Promote Product | wemake" },
  { name: "description", content: "Promote your product" },
];

export default function PromotePage() {
  const [promotionPeriod, setPromotionPeriod] = useState<DateRange | undefined>(undefined);
  const totalDays =
    promotionPeriod?.from && promotionPeriod?.to
      ? DateTime.fromJSDate(promotionPeriod.to).diff(
          DateTime.fromJSDate(promotionPeriod.from),
          "days",
        ).days
      : 0;
  return (
    <div className="space-y-10">
      <Hero title="Promote your product" description="Boost your product's visibility." />
      <Form className="max-w-xs mx-auto flex flex-col gap-10 items-center">
        <SelectPair
          label="Select a product"
          name="product"
          required
          description="Select the product you want to promote"
          options={[
            {
              label: "AI Dark Mode Maker",
              value: "ai-dark-mode-make1",
            },
            {
              label: "AI Dark Mode Maker",
              value: "ai-dark-mode-make2",
            },
            {
              label: "AI Dark Mode Maker",
              value: "ai-dark-mode-make3",
            },
          ]}
          placeholder="Select a product"
        />
        <div className="flex flex-col gap-2 items-center w-full">
          <Label className="flex flex-col gap-2">
            Select a range of dates for promotion
            <small className="text-muted-foreground">Minimum duration is 3 days.</small>
          </Label>
          <Calendar
            mode="range"
            selected={promotionPeriod}
            onSelect={setPromotionPeriod}
            min={3}
            disabled={{ before: new Date() }}
          />
        </div>
        <Button disabled={totalDays === 0}>Go to checkout (${totalDays * 10})</Button>
      </Form>
    </div>
  );
}
