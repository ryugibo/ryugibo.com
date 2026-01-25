import { cn } from "@ryugibo/ui";
import { AspectRatio } from "@ryugibo/ui/aspect-ratio";

interface BookCoverProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt: string;
  aspectRatio?: number;
  width?: number;
  height?: number;
}

const gradients = [
  "from-pink-500 via-red-500 to-yellow-500",
  "from-blue-400 via-indigo-500 to-purple-500",
  "from-green-400 to-blue-500",
  "from-yellow-400 via-orange-500 to-red-500",
  "from-purple-500 via-pink-500 to-red-500",
  "from-teal-400 to-yellow-200",
  "from-fuchsia-600 to-pink-600",
  "from-indigo-400 to-cyan-400",
  "from-rose-400 via-fuchsia-500 to-indigo-500",
];

function getBookCoverGradient(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

export function BookCover({ src, alt, aspectRatio = 2 / 3, className, ...props }: BookCoverProps) {
  return (
    <div className={cn("overflow-hidden rounded-md shadow-md bg-muted", className)} {...props}>
      <AspectRatio ratio={aspectRatio}>
        {src ? (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover object-center transition-all hover:scale-105"
          />
        ) : (
          <div
            className={cn(
              "h-full w-full flex items-center justify-center p-4 text-center bg-linear-to-br transition-all hover:scale-110",
              getBookCoverGradient(alt),
            )}
          >
            <span
              className="font-bold text-white line-clamp-3 text-lg"
              style={{
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              {alt}
            </span>
          </div>
        )}
      </AspectRatio>
    </div>
  );
}
