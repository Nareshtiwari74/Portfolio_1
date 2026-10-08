import { ReactNode } from "react";

import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Backdrop gradient behind a project screenshot. Plain colour values (hex,
 * `rgb()`, …) rather than Tailwind classes: these come from project data at
 * runtime, and Tailwind can only generate classes it can see in source.
 */
export interface ProjectGradient {
  from: string;
  /** Optional middle stop. */
  via?: string;
  to: string;
}

interface ProjectImageProps {
  src: string;
  alt: string;
  /**
   * Sizing and corner classes for the frame, e.g. `"aspect-[16/10] rounded-xl"`
   * or `"h-48 sm:h-52"`. The frame always clips its image.
   */
  className?: string;
  /**
   * Zoom the image when an ancestor marked `group` is hovered. Used by the
   * project card; the modal image stays still.
   */
  zoomOnHover?: boolean;
  /**
   * Dark bottom-up gradient, so anything layered over the image via `children`
   * stays readable.
   */
  overlay?: boolean;
  /** Backdrop gradient behind the screenshot, defined per project. */
  gradient: ProjectGradient;
  /**
   * `cover` fills a fixed-height frame and crops the overflow (cards, where a
   * consistent shape matters). `contain` sizes the frame to the image's own
   * ratio so nothing is cropped and the border wraps it tightly (the modal).
   */
  fit?: "cover" | "contain";
  /** Intrinsic size handed to next/image — only affects the requested asset. */
  width?: number;
  height?: number;
  priority?: boolean;
  /** Content layered on top of the image (absolutely positioned). */
  children?: ReactNode;
}

/**
 * Shared image frame for project surfaces, so the card and the modal render the
 * same object-fit, clipping, and hover behaviour instead of drifting apart.
 */
const ProjectImage = ({
  src,
  alt,
  className,
  zoomOnHover = false,
  overlay = false,
  gradient,
  fit = "cover",
  width = 800,
  height = 500,
  priority = false,
  children,
}: ProjectImageProps) => {
  const stops = [gradient.from, gradient.via, gradient.to]
    .filter(Boolean)
    .join(", ");

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        className="h-full w-full p-5"
        style={{
          backgroundImage: `linear-gradient(to bottom right, ${stops})`,
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className={cn(
            "w-full rounded-xl border-4 border-neutral-300/40",
            // `contain` lets the element take the image's own aspect ratio, so
            // the border hugs the picture instead of boxing empty space
            // around it. `cover` fills a frame whose height is set by className.
            fit === "contain" ? "h-auto" : "h-full object-cover",
            zoomOnHover &&
              "absolute top-10 left-10 transition-[translate] duration-150 ease-out group-hover:-translate-x-2 group-hover:-translate-y-2"
          )}
          style={{ transformOrigin: "center center" }}
        />
      </div>

      {overlay && (
        <div className="from-overlay/90 via-overlay/30 to-overlay/10 absolute inset-0 bg-linear-to-t" />
      )}

      {children}
    </div>
  );
};

export default ProjectImage;
