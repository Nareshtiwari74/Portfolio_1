import Image from "next/image";

import { siteConfig } from "@/lib/site";

/** Naresh's supplied Instagram profile screenshot. */
const InstagramProfilePreview = () => (
  <div className="border-line-strong/90 w-fit overflow-hidden rounded-3xl border-2">
    <Image
      src="/social-instagram.png"
      alt={`${siteConfig.name} Instagram profile card`}
      width={1370}
      height={462}
      sizes="300px"
      loading="eager"
      className="h-auto w-[300px]"
    />
  </div>
);

export default InstagramProfilePreview;
