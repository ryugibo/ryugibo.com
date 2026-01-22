import { cn } from "@ryugibo/ui";
import { AspectRatio } from "@ryugibo/ui/aspect-ratio";

interface BookCoverProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  aspectRatio?: number;
  width?: number;
  height?: number;
}

export function BookCover({ src, alt, aspectRatio = 2 / 3, className, ...props }: BookCoverProps) {
  return (
    <div className={cn("overflow-hidden rounded-md shadow-md bg-muted", className)} {...props}>
      <AspectRatio ratio={aspectRatio}>
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover object-center transition-all hover:scale-105"
        />
      </AspectRatio>
    </div>
  );
}
