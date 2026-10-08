import Image from "next/image";

import { Pin } from "lucide-react";

/**
 * Guestbook avatar. Google profile images 404 for some accounts, so the same
 * placeholder circle stands in whenever there is no picture — the sign-in card
 * and the comment list both render through here rather than each writing their
 * own fallback branch. Pinned comments get a brand ring around the circle and
 * a pin badge on its corner.
 */
const Avatar = ({
  src,
  alt,
  size,
  className = "",
  pinned = false,
}: {
  src: string;
  alt: string;
  size: number;
  className?: string;
  pinned?: boolean;
}) => {
  const ring = pinned
    ? "ring-brand ring-offset-surface ring-2 ring-offset-2"
    : "";

  return (
    <div className="relative shrink-0">
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          className={`outline-image-outline rounded-full outline -outline-offset-1 ${ring} ${className}`}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div
          className={`bg-surface-strong rounded-full ${ring} ${className}`}
          style={{ width: size, height: size }}
        />
      )}
      {pinned && (
        <span
          role="img"
          aria-label="Pinned"
          className="bg-brand text-brand-content ring-surface absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full ring-2"
        >
          <Pin aria-hidden className="size-3 rotate-45" strokeWidth={2.5} />
        </span>
      )}
    </div>
  );
};

export default Avatar;
