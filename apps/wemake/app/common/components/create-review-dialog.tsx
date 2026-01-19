import { Button } from "@ryugibo/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ryugibo/ui/dialog";
import { StarIcon } from "@ryugibo/ui/icons";
import { Label } from "@ryugibo/ui/label";
import { useState } from "react";
import { Form } from "react-router";
import InputPair from "~/common/components/input-pair";

export default function CreateReviewDialog() {
  const [rating, setRating] = useState<number>(0);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-2xl">What do you think of this product?</DialogTitle>
        <DialogDescription>Share your experience with this product</DialogDescription>
      </DialogHeader>
      <Form className="space-y-10">
        <div>
          <Label className="flex flex-col items-start">
            Rating
            <small className="text-muted-foreground">What would you rate this product?</small>
          </Label>
          <div className="flex mt-5">
            {[1, 2, 3, 4, 5].map((star) => (
              <label
                key={star}
                className="relative px-2"
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
              >
                <StarIcon
                  className="size-5 text-yellow-500"
                  fill={(hoveredStar > 0 ? hoveredStar : rating) >= star ? "currentColor" : "none"}
                />
                <input
                  type="radio"
                  value={star}
                  name="rating"
                  required
                  className="opacity-0 h-px w-px absolute"
                  onChange={() => setRating(star)}
                />
              </label>
            ))}
          </div>
        </div>
        <InputPair
          textarea
          required
          label="Review"
          description="Maximum 1000 characters"
          name="review"
          placeholder="Write your review here..."
        />
        <DialogFooter>
          <Button type="submit">Submit review</Button>
        </DialogFooter>
      </Form>
    </DialogContent>
  );
}
