import { AspectRatio, cn } from "@ryugibo/ui";
import { BookOpen } from "@ryugibo/ui/icons";
import { useEffect, useRef, useState } from "react";

interface BookCoverProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt: string;
  aspectRatio?: number;
  width?: number;
  height?: number;
}

export function BookCover({ src, alt, aspectRatio = 2 / 3, className, ...props }: BookCoverProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);

    // Check if image is already loaded (e.g. from cache)
    if (imgRef.current?.complete && imgRef.current?.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [src]);

  return (
    <div
      className={cn("overflow-hidden rounded-md shadow-md bg-muted group", className)}
      {...props}
    >
      <AspectRatio ratio={aspectRatio}>
        <div className="relative w-full h-full">
          {/* Fallback - Always rendered but faded out when image loads */}
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center bg-muted transition-opacity duration-500",
              isLoaded && !hasError ? "opacity-0" : "opacity-100",
            )}
            aria-hidden="true"
          >
            <BookOpen className="h-10 w-10 text-muted-foreground/20" />
          </div>

          {/* Image */}
          {src && (
            <img
              ref={imgRef}
              key={src} // Force remount on source change to ensure onLoad fires
              src={src}
              alt={alt}
              loading="lazy"
              decoding="async"
              onLoad={(e) => {
                // Double check if image is actually loaded
                if (e.currentTarget.complete) {
                  setIsLoaded(true);
                }
              }}
              onError={() => setHasError(true)}
              className={cn(
                "h-full w-full object-cover object-center transition-all duration-500",
                // Restore hover effect
                !hasError && "group-hover:scale-105",
                isLoaded && !hasError ? "opacity-100" : "opacity-0",
              )}
            />
          )}
        </div>
      </AspectRatio>
    </div>
  );
}
